"""Builds a batch of vertical Reels (1080x1920, ~15 s, soft music bed) and the posting queue.

    python3 tools/video/make_reels.py tools/video/batches/2026-10.py

A batch file defines START (first post date, YYYY-MM-DD) and REELS: a list of dicts
  {"id": "...", "scenes": [...], "caption": "..."}
Scene types:
  ("card", big, small, seconds, dark)
  ("page", "/slug/", js_or_None, caption_bar, css_selector, pad_px, seconds, regex_that_must_be_in_#out)
  ("panel", caption_bar, inner_html, seconds)
Output: media/reels/<id>.mp4 and media/reels/queue.json (one reel per day from START, merged
with the reels already queued; reels more than 21 days in the past are dropped from the queue
and their files deleted).
"""
import datetime as dt
import html
import json
import os
import re
import runpy
import shutil
import subprocess
import sys
import wave

import numpy as np
from playwright.sync_api import sync_playwright

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import base  # noqa: E402  (templates, local web server)

SITE = base.SITE
REELS = os.path.join(SITE, "media", "reels")
QUEUE = os.path.join(REELS, "queue.json")
PUBLIC = "https://temperbyte.github.io/media/reels/"
SR = 44100


# ------------------------------------------------------------------ music --
def note(n):
    return 440.0 * 2 ** ((n - 69) / 12)


PROGS = [  # MIDI chords: calm, major-leaning loops
    [[48, 55, 64, 71], [45, 52, 60, 67], [41, 48, 57, 64], [43, 50, 59, 62]],   # Cmaj7 Am7 Fmaj7 G
    [[50, 57, 65, 72], [46, 53, 62, 69], [43, 50, 58, 65], [45, 52, 61, 64]],   # Dm9-ish Bb G A
    [[41, 48, 57, 64], [43, 50, 59, 62], [45, 52, 60, 67], [40, 47, 55, 64]],   # F G Am Em
]


def music(seconds, variant, path):
    """A quiet pad + soft plucked arpeggio. Generated here, so there are no rights issues."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    prog = PROGS[variant % len(PROGS)]
    bar = 2.4
    rng = np.random.default_rng(variant)
    for i in range(int(seconds / bar) + 1):
        chord = prog[i % len(prog)]
        s0 = i * bar
        seg = (t >= s0) & (t < s0 + bar + 0.6)
        tt = t[seg] - s0
        env = np.minimum(1, tt / 0.5) * np.exp(-np.maximum(0, tt - bar) / 0.25)
        for m in chord:
            f = note(m)
            for det in (-0.7, 0.7):
                out[seg] += 0.05 * env * (np.sin(2 * np.pi * (f + det) * tt) + 0.25 * np.sin(4 * np.pi * (f + det) * tt))
        out[seg] += 0.09 * env * np.sin(2 * np.pi * note(chord[0] - 12) * tt)
        for k in range(8):  # arpeggio, eighth notes
            a0 = s0 + k * bar / 8
            seg2 = (t >= a0) & (t < a0 + 1.2)
            ta = t[seg2] - a0
            m = chord[(k + int(rng.integers(0, 2))) % 4] + 12
            out[seg2] += 0.06 * np.exp(-ta / 0.28) * np.minimum(1, ta / 0.005) * np.sin(2 * np.pi * note(m) * ta)
    fade = np.minimum(1, np.minimum(t / 0.6, (seconds - t) / 1.2))
    out *= np.clip(fade, 0, 1)
    out = out / (np.abs(out).max() + 1e-9) * 0.30          # peak about -10 dBFS: a background bed
    st = np.stack([out, np.roll(out, 220)], axis=1)          # a touch of width
    pcm = (st * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ------------------------------------------------------------------ video --
def shoot(pg, sc, f):
    kind = sc[0]
    if kind == "card":
        _, big, small, sec, dark = sc
        pg.set_content(base.CARD % dict(big=big, small=small, bg="#16181B" if dark else "#F2F0EB",
                                        fg="#F2F0EB" if dark else "#16181B"))
        pg.wait_for_timeout(200)
    elif kind == "page":
        _, path, js, cap, sel, pad, sec, expect = sc
        pg.goto("http://127.0.0.1:8799" + SITE + path)
        pg.wait_for_timeout(400)
        if js:
            pg.evaluate(js)
            pg.wait_for_timeout(300)
        out = pg.inner_text("#out")
        if expect and not re.search(expect, out):
            raise SystemExit(f"{path}: expected /{expect}/ in the result, got: {out[:300]!r}")
        y = pg.evaluate(f"(()=>{{const e=document.querySelector({sel!r});"
                        f"if(!e) return null; return e.getBoundingClientRect().top+scrollY-{pad}}})()")
        if y is None:
            raise SystemExit(f"{path}: selector {sel} not found")
        pg.evaluate(f"window.scrollTo(0,{y})")
        pg.evaluate(base.CAPTION_JS, cap)
        pg.wait_for_timeout(200)
    elif kind == "panel":
        _, cap, inner, sec = sc
        pg.set_content(base.PANEL % dict(cap=html.escape(cap), inner=inner))
        pg.wait_for_timeout(300)
    else:
        raise SystemExit(f"unknown scene {kind}")
    pg.screenshot(path=f)
    return {"card": 3, "page": 6, "panel": 3}[kind]


def build(reel, pg, tmp, variant):
    frames = []
    for i, sc in enumerate(reel["scenes"]):
        f = os.path.join(tmp, f"{reel['id']}-{i:02d}.png")
        frames.append((f, sc[shoot(pg, sc, f)]))
    fade = 0.4
    inputs, filt, prev, offset = [], [], "[0:v]", 0.0
    for f, sec in frames:
        inputs += ["-loop", "1", "-t", str(sec), "-i", f]
    for j in range(1, len(frames)):
        offset += frames[j - 1][1] - fade
        filt.append(f"{prev}[{j}:v]xfade=transition=fade:duration={fade}:offset={offset:.2f}[v{j}]")
        prev = f"[v{j}]"
    total = sum(s for _, s in frames) - fade * (len(frames) - 1)
    wav = os.path.join(tmp, f"{reel['id']}.wav")
    music(total, variant, wav)
    filt_s = ";".join(filt + [f"{prev}scale=1080:1920,format=yuv420p[vout]"])
    mp4 = os.path.join(REELS, f"{reel['id']}.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-i", wav, "-filter_complex", filt_s,
                    "-map", "[vout]", "-map", f"{len(frames)}:a", "-r", "30", "-c:v", "libx264", "-profile:v", "high",
                    "-preset", "medium", "-crf", "21", "-c:a", "aac", "-b:a", "128k", "-ar", "44100",
                    "-shortest", "-movflags", "+faststart", mp4], check=True)
    return total


def main(batch_path):
    batch = runpy.run_path(batch_path)
    start = dt.date.fromisoformat(batch["START"])
    os.makedirs(REELS, exist_ok=True)
    try:
        with open(QUEUE) as fh:
            queue = json.load(fh)
    except FileNotFoundError:
        queue = {"version": 1, "reels": []}
    known = {r["id"] for r in queue["reels"]}
    taken = {r["date"] for r in queue["reels"]}
    tmp = os.path.join(base.OUT, "frames")
    os.makedirs(tmp, exist_ok=True)
    srv = base.serve()
    day = start
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": base.W, "height": base.H}, device_scale_factor=base.DSF, color_scheme="light")
        pg.route("**fonts.g**", lambda r: r.abort())
        for k, reel in enumerate(batch["REELS"]):
            if reel["id"] in known:
                raise SystemExit(f"duplicate id {reel['id']}")
            if len(reel["caption"]) > 2000:
                raise SystemExit(f"{reel['id']}: caption too long")
            while day.isoformat() in taken:
                day += dt.timedelta(days=1)
            secs = build(reel, pg, tmp, k)
            queue["reels"].append({"id": reel["id"], "date": day.isoformat(), "url": PUBLIC + reel["id"] + ".mp4",
                                   "caption": reel["caption"], "seconds": round(secs, 1)})
            taken.add(day.isoformat())
            print(day, reel["id"], f"{secs:.1f}s")
            day += dt.timedelta(days=1)
        b.close()
    srv.shutdown()
    cutoff = (dt.date.today() - dt.timedelta(days=21)).isoformat()
    keep = []
    for r in sorted(queue["reels"], key=lambda r: r["date"]):
        if r["date"] < cutoff:
            try:
                os.remove(os.path.join(REELS, r["id"] + ".mp4"))
            except FileNotFoundError:
                pass
        else:
            keep.append(r)
    queue["reels"] = keep
    queue["updated"] = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    with open(QUEUE, "w") as fh:
        json.dump(queue, fh, indent=1, ensure_ascii=False)
    shutil.rmtree(tmp, ignore_errors=True)
    print("queue:", len(keep), "reels, last date", keep[-1]["date"] if keep else "-")


if __name__ == "__main__":
    main(sys.argv[1])
