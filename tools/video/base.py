"""Builds 5 vertical (1080x1920) TikTok/Shorts videos from scenes.
Scene types:
  ("card", big, small, seconds)            brand title card
  ("page", url_path, js_setup, caption, scroll_y, seconds)  live calculator screenshot with caption bar
  ("image", png_path, caption, crop_box, seconds)  example image shown in a frame with caption
"""
import subprocess, os, http.server, threading, functools, shutil, html
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get("VIDEO_OUT", os.path.join(HERE, "out"))
SITE = os.path.abspath(os.path.join(HERE, "..", ".."))
W, H = 432, 768  # x2.5 = 1080x1920
DSF = 2.5

CARD = """<!doctype html><html><head><meta charset=utf-8><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:432px;height:768px;background:%(bg)s;color:%(fg)s;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}
.p{height:100%%;padding:56px 34px;display:flex;flex-direction:column}
.m{display:flex;gap:10px;align-items:center;font-weight:600;letter-spacing:.16em;font-size:13px;text-transform:uppercase}
.m i{width:11px;height:11px;background:#B0532B;display:block}
.c{flex:1;display:flex;flex-direction:column;justify-content:center}
h1{font-size:46px;line-height:1.04;letter-spacing:-.03em;font-weight:600}
p{margin-top:22px;font-size:21px;line-height:1.35;opacity:.75}
</style></head><body><div class=p><div class=m><i></i>Temperbyte</div><div class=c><h1>%(big)s</h1><p>%(small)s</p></div></div></body></html>"""

CAPTION_JS = """(t)=>{let d=document.getElementById('__cap'); if(!d){d=document.createElement('div');d.id='__cap';document.body.appendChild(d);}
d.style.cssText='position:fixed;left:14px;right:14px;top:18px;z-index:9999;background:#16181B;color:#F2F0EB;font:600 19px/1.3 Inter,sans-serif;padding:14px 16px;letter-spacing:-.01em;box-shadow:0 0 0 2px #B0532B';
d.textContent=t;}"""

IMG = """<!doctype html><html><head><meta charset=utf-8><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:432px;height:768px;background:#16181B;color:#F2F0EB;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased;display:flex;flex-direction:column}
.cap{margin:18px 14px 0;background:#F2F0EB;color:#16181B;font:600 19px/1.3 Inter,sans-serif;padding:14px 16px;box-shadow:0 0 0 2px #B0532B}
.f{flex:1;display:flex;align-items:center;justify-content:center;padding:14px}
.f div{width:100%%;height:100%%;background:url('%(src)s') %(pos)s/%(size)s no-repeat;border:1px solid #333}
</style></head><body><div class=cap>%(cap)s</div><div class=f><div></div></div></body></html>"""


PANEL = """<!doctype html><html><head><meta charset=utf-8><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:432px;height:768px;background:#16181B;font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased;display:flex;flex-direction:column}
.cap{margin:18px 14px 0;background:#F2F0EB;color:#16181B;font:600 19px/1.3 Inter,sans-serif;padding:14px 16px;box-shadow:0 0 0 2px #B0532B}
.w{flex:1;display:flex;align-items:center;padding:16px 14px 40px}.f{width:100%%;background:#FBFAF7;color:#16181B;padding:24px 20px;display:flex;flex-direction:column;gap:14px}
.l{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#6E7177;font-weight:600}
.mono{font-family:'DejaVu Sans Mono',monospace;font-size:16px;line-height:1.55;color:#3a3d42;white-space:pre-wrap}
h3{font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:600;margin-top:4px}
p,li{font-size:19px;line-height:1.42}
ul{padding-left:18px;display:flex;flex-direction:column;gap:8px}
.s{text-decoration:line-through;color:#B0532B}
.b{display:inline-block;border:1.5px solid #2F6B4F;color:#2F6B4F;font-size:13px;font-weight:700;letter-spacing:.1em;padding:3px 8px}
table{border-collapse:collapse;width:100%%;font-size:15px}td{padding:6px 6px 6px 0;border-bottom:1px solid #D6D2C9}
</style></head><body><div class=cap>%(cap)s</div><div class=w><div class=f>%(inner)s</div></div></body></html>"""

LW_IN = """<div class=l>What you paste</div><div class=mono>3 bed 2 bath ranch, Maple Grove
1,640 sq ft, built 1998
0.31 acre lot, fully fenced backyard
kitchen redone 2023 - quartz,
new cabinets, gas range
new roof 2021, HVAC 2022
2 car garage, covered patio
0.4 mi to Cedar Park
perfect for young families, safe
quiet neighborhood, great schools!!</div>"""
LW_OUT = """<div class=l>What you get</div><h3>Headline</h3><p>2023 Quartz Kitchen, 2021 Roof, 2022 HVAC</p>
<h3>MLS public remarks</h3><p>Single-level living on a fully fenced 0.31-acre lot in Maple Grove, 0.4 miles from Cedar Park. The kitchen was remodeled in 2023 with quartz counters, new cabinets and a gas range…</p>"""
LW_FH = """<div class=l>Fair housing check</div><ul>
<li><span class=s>"perfect for young families"</span> removed. Describes who should live there (familial status).</li>
<li><span class=s>"safe quiet neighborhood"</span> replaced with "0.4 miles from Cedar Park".</li>
<li><span class=s>"great schools!!"</span> removed. Rating schools is a steering risk.</li></ul>"""
CA_IN = """<div class=l>What you paste</div><div class=mono>Goal: fat loss. Week 6.
Last week avg: 82.9 kg

Weigh-ins: 82.4 82.6 82.3
82.1 82.0 82.2 83.4
Calories on target 6/7
(Sat pizza night)
Training 4/4

"Ugh, scale jumped a full kilo
this morning. I think the diet
stopped working?? Should I cut
more?"</div>"""
CA_OUT = """<div class=l>What you get</div><h3>Trend</h3><p>Weekly average <b>82.43 kg</b>, down 0.47 kg = <b>−0.57% per week</b>. On target for fat loss.</p>
<h3>Decision</h3><p><span class=b>HOLD</span></p><p>Adherence was 86%. Sunday's 83.4 kg follows one big meal and doesn't move the weekly average enough to act on.</p>"""
CA_FLAGS = """<div class=l>Red flags</div><p>Checks every check-in for warning signs: dizziness or fainting, skipped meals to make up for eating, training far beyond the plan, very fast loss.</p><p>When one shows up, it tells you, and the plan does not get tightened.</p>"""


def serve():
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    h = functools.partial(Q, directory="/")
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 8799), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s


def build(name, scenes, pg, tmp):
    frames = []
    for i, sc in enumerate(scenes):
        f = os.path.join(tmp, f"{name}-{i:02d}.png")
        kind = sc[0]
        if kind == "card":
            _, big, small, sec, dark = sc
            pg.set_content(CARD % dict(big=big, small=small, bg="#16181B" if dark else "#F2F0EB", fg="#F2F0EB" if dark else "#16181B"))
            pg.wait_for_timeout(200)
        elif kind == "page":
            _, path, js, cap, y, sec = sc
            pg.goto("http://127.0.0.1:8799" + SITE + path)
            pg.wait_for_timeout(400)
            if js:
                pg.evaluate(js)
                pg.wait_for_timeout(300)
            pg.evaluate(f"window.scrollTo(0,{y})")
            pg.evaluate(CAPTION_JS, cap)
            pg.wait_for_timeout(200)
        elif kind == "panel":
            _, cap, inner, sec = sc
            pg.set_content(PANEL % dict(cap=html.escape(cap), inner=inner))
            pg.wait_for_timeout(300)
        elif kind == "image":
            _, src, cap, pos, size, sec = sc
            pg.set_content(IMG % dict(src="http://127.0.0.1:8799" + src, cap=html.escape(cap), pos=pos, size=size))
            pg.wait_for_timeout(600)
        pg.screenshot(path=f)
        frames.append((f, sc[-1] if kind != "card" else sc[3]))
    # assemble: each frame shown with a short crossfade
    inputs, filt = [], []
    for j, (f, sec) in enumerate(frames):
        inputs += ["-loop", "1", "-t", str(sec), "-i", f]
    fade = 0.4
    prev = "[0:v]"
    offset = 0.0
    for j in range(1, len(frames)):
        offset += frames[j - 1][1] - fade
        out = f"[v{j}]"
        filt.append(f"{prev}[{j}:v]xfade=transition=fade:duration={fade}:offset={offset:.2f}{out}")
        prev = out
    total = sum(s for _, s in frames) - fade * (len(frames) - 1)
    filt_s = ";".join(filt) + f";{prev}scale=1080:1920,format=yuv420p[vout]" if filt else "[0:v]scale=1080:1920,format=yuv420p[vout]"
    mp4 = os.path.join(OUT, f"{name}.mp4")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-f", "lavfi", "-t", f"{total:.2f}", "-i", "anullsrc=r=44100:cl=stereo",
           "-filter_complex", filt_s, "-map", "[vout]", "-map", f"{len(frames)}:a", "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
           "-c:a", "aac", "-shortest", "-movflags", "+faststart", mp4]
    subprocess.run(cmd, check=True)
    shutil.copy(frames[0][0], os.path.join(OUT, f"{name}-cover.png"))
    print(name, f"{total:.1f}s")


def set_offers(rows, comm=None, payoff=None, other=None):
    js = "()=>{const set=(el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}))};"
    if comm is not None:
        js += f"set(document.querySelector('#comm'),'{comm}');set(document.querySelector('#payoff'),'{payoff}');set(document.querySelector('#other'),'{other}');"
    js += "let o=[...document.querySelectorAll('.offer')];"
    js += f"while(o.length>{len(rows)}){{o[o.length-1].querySelector('.rm').click();o=[...document.querySelectorAll('.offer')];}}"
    for i, (p, c, inc, cap) in enumerate(rows):
        js += f"set(o[{i}].querySelector('.price'),'{p}');set(o[{i}].querySelector('.credit'),'{c}');set(o[{i}].querySelector('.inc'),'{inc}');set(o[{i}].querySelector('.cap'),'{cap}');"
    js += "}"
    return js


VIDEOS = {
    "video1-escalation-calculator": [
        ("card", "Your listing got an escalation clause.", "What is the offer really worth?", 2.6, True),
        ("page", "/escalation-clause-calculator/", None, "3 offers. Offer C: $455k, +$2k over others, cap $480k", 330, 3.6),
        ("page", "/escalation-clause-calculator/", None, "Offer C escalates to $474,000", 980, 3.6),
        ("page", "/escalation-clause-calculator/", None, "Highest net to the seller: $233,100", 980, 3.2),
        ("card", "Free calculator.", "temperbyte.github.io · link in bio", 2.8, False),
    ],
    "video2-two-clauses": [
        ("card", "Two escalation clauses on one house.", "Who wins?", 2.6, True),
        ("page", "/escalation-clause-calculator/", set_offers([(615000, 0, 3000, 650000), (620000, 0, 5000, 640000)], 0, 0, 0),
         "A: $615k, +$3k, cap $650k  ·  B: $620k, +$5k, cap $640k", 330, 3.8),
        ("page", "/escalation-clause-calculator/", set_offers([(615000, 0, 3000, 650000), (620000, 0, 5000, 640000)], 0, 0, 0),
         "B tops out at its $640k cap. A wins at $643,000", 760, 3.8),
        ("card", "Free calculator.", "temperbyte.github.io · link in bio", 2.8, False),
    ],
    "video3-listing-writer": [
        ("card", "Rough notes → MLS remarks.", "With a fair housing check.", 2.6, True),
        ("panel", "Paste your rough property notes", LW_IN, 3.4),
        ("panel", "Get MLS-ready remarks and a headline", LW_OUT, 3.8),
        ("panel", "Risky phrases get flagged and rewritten", LW_FH, 4.2),
        ("card", "Free Claude skill.", "Lite version free · link in bio", 2.8, False),
    ],
    "video4-weigh-in": [
        ("card", "Your client gained 1 kg overnight.", "Did they?", 2.6, True),
        ("page", "/weight-trend-calculator/", None, "Daily weigh-ins jump around with water and salt", 520, 3.6),
        ("page", "/weight-trend-calculator/", None, "The weekly average: down 0.67 kg per week", 540, 3.6),
        ("page", "/weight-trend-calculator/", None, "Compare weekly averages, not single days", 760, 3.2),
        ("card", "Free calculator.", "temperbyte.github.io · link in bio", 2.8, False),
    ],
    "video5-checkin-analyzer": [
        ("card", "20 client check-ins every Monday?", "Coaches, this one's for you.", 2.6, True),
        ("panel", "Paste the client's weekly check-in", CA_IN, 3.4),
        ("panel", "Get the trend math and a hold or adjust call", CA_OUT, 3.8),
        ("panel", "Plus red flags to act on", CA_FLAGS, 3.6),
        ("card", "Free Claude skill.", "Lite version free · link in bio", 2.8, False),
    ],
}

if __name__ == "__main__":
    srv = serve()
    tmp = os.path.join(OUT, "frames")
    os.makedirs(tmp, exist_ok=True)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": W, "height": H}, device_scale_factor=DSF, color_scheme="light")
        for name, scenes in VIDEOS.items():
            build(name, scenes, pg, tmp)
        b.close()
    srv.shutdown()
