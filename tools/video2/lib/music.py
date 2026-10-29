"""Original music + sound effects for Temperbyte reels, synthesized from scratch (no samples,
no rights issues).  python3 lib/music.py frames/v1/meta.json out/v1.wav
meta: {"duration": s, "music": {"style": "dark|hype|glide", "bpm": 128, "drop": s}, "sfx": [[t, name, gain], ...]}"""
import json
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
rng = np.random.default_rng(7)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def filt(x, kind, f, order=2):
    w = [v / (SR / 2) for v in f] if isinstance(f, (list, tuple)) else f / (SR / 2)
    sos = butter(order, w, btype=kind, output="sos")
    return sosfilt(sos, x)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / SR / tau)


def add(buf, x, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= buf.shape[0] or i + len(x) <= 0:
        return
    if i < 0:
        x = x[-i:]; i = 0
    x = x[: buf.shape[0] - i]
    l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    buf[i:i + len(x), 0] += x * gain * l * 1.414
    buf[i:i + len(x), 1] += x * gain * r * 1.414


# ------------------------------------------------------------------ drums --
def kick(punch=1.0):
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 46 + 120 * np.exp(-t / 0.035) * punch
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t / 0.18)
    click = filt(rng.standard_normal(n), "highpass", 3000) * np.exp(-t / 0.004) * 0.35
    return np.tanh((x + click * 1.6) * 1.8) * 0.55


def b808(note, length):
    n = int(length * SR); t = np.arange(n) / SR
    f = mtof(note) * (1 + 0.9 * np.exp(-t / 0.03))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / max(0.15, length * 0.6))
    x *= np.minimum(1, (length - t) / 0.03).clip(0, 1)
    return np.tanh(x * 3.2) * 0.5


def snare(tone=190, bright=1.0, tail=0.16):
    n = int(0.5 * SR); t = np.arange(n) / SR
    noise = filt(rng.standard_normal(n), "bandpass", [900, 9000 * bright]) * np.exp(-t / tail)
    body = np.sin(2 * np.pi * tone * t) * np.exp(-t / 0.05)
    return np.tanh((noise * 0.8 + body * 0.6) * 1.5) * 0.6


def clap():
    n = int(0.4 * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for d in (0, 0.011, 0.023, 0.034):
        i = int(d * SR); x[i:] += np.exp(-(t[: n - i]) / (0.012 if d < 0.03 else 0.13))
    x *= filt(rng.standard_normal(n), "bandpass", [1100, 6500])
    return x * 0.55


def hat(open_=False):
    n = int((0.35 if open_ else 0.06) * SR); t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), "highpass", 7500) * np.exp(-t / (0.12 if open_ else 0.018))
    return x * 0.5


# ------------------------------------------------------------------ synths --
def saw(f, n, detune=0.0):
    t = np.arange(n) / SR
    ph = (f * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))


def supersaw(notes, length, cutoff=2600, voices=5, amp=0.12):
    amp *= 2.4
    n = int(length * SR)
    x = np.zeros(n)
    for m in notes:
        f = mtof(m)
        for v in range(voices):
            d = (v - (voices - 1) / 2) * 0.006
            x += saw(f, n, d) * rng.uniform(0.7, 1.0)
    x = filt(x, "lowpass", cutoff)
    t = np.arange(n) / SR
    e = np.minimum(1, t / 0.02) * np.minimum(1, (length - t) / 0.08).clip(0, 1)
    return x * e * amp / max(1, len(notes) ** 0.5)


def pluck(m, length=0.3, bright=4000, amp=0.22):
    amp *= 2.2
    n = int(length * SR); t = np.arange(n) / SR
    x = saw(mtof(m), n) * 0.6 + np.sign(np.sin(2 * np.pi * mtof(m) * t)) * 0.4
    x = filt(x, "lowpass", bright) * np.exp(-t / (length * 0.35))
    return x * amp


def bell(m, length=0.9, amp=0.18):
    amp *= 2.2
    n = int(length * SR); t = np.arange(n) / SR
    f = mtof(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.12) + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.05)
    return x * np.exp(-t / (length * 0.4)) * amp


# ------------------------------------------------------------------ sfx --
def sfx(name):
    if name == "impact" or name == "boom":
        n = int(1.4 * SR); t = np.arange(n) / SR
        sub = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-t / 0.08)) / SR) * np.exp(-t / (0.5 if name == "boom" else 0.3))
        nz = filt(rng.standard_normal(n), "lowpass", 1800) * np.exp(-t / 0.25) * 0.5
        crack = filt(rng.standard_normal(n), "highpass", 2500) * np.exp(-t / 0.03) * 0.5
        return np.tanh((sub * 1.2 + nz + crack) * 1.6) * (0.9 if name == "boom" else 0.65)
    if name == "whoosh":
        n = int(0.55 * SR); t = np.arange(n) / SR
        x = rng.standard_normal(n); out = np.zeros(n)
        for k in range(10):
            a, b = int(k * n / 10), int((k + 1) * n / 10)
            fc = 400 + 5000 * np.sin(np.pi * (k + .5) / 10)
            out[a:b] = filt(x, "bandpass", [fc * 0.6, min(fc * 1.6, 20000)])[a:b]
        return out * np.sin(np.pi * t / t[-1]) ** 2 * 0.45
    if name == "pop":
        n = int(0.12 * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * np.cumsum(500 + 1300 * t / t[-1]) / SR) * np.exp(-t / 0.035) * 0.5
    if name == "tick":
        n = int(0.09 * SR); t = np.arange(n) / SR
        return (np.sin(2 * np.pi * 1800 * t) * 0.6 + filt(rng.standard_normal(n), "highpass", 4000) * 0.4) * np.exp(-t / 0.015) * 0.6
    if name == "stamp":
        n = int(0.9 * SR); t = np.arange(n) / SR
        thud = np.sin(2 * np.pi * np.cumsum(60 + 140 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.16)
        slap = filt(rng.standard_normal(n), "bandpass", [600, 5000]) * np.exp(-t / 0.05)
        return np.tanh((thud * 1.4 + slap * 0.9) * 1.8) * 0.8
    if name == "sparkle":
        out = np.zeros(int(1.2 * SR))
        for k, m in enumerate([88, 91, 95, 100]):
            b = bell(m, 0.8, 0.12); i = int(k * 0.07 * SR); out[i:i + len(b)] += b[: len(out) - i]
        return out
    if name == "riser":
        n = int(1.8 * SR); t = np.arange(n) / SR
        x = rng.standard_normal(n); out = np.zeros(n)
        for k in range(18):
            a, b = int(k * n / 18), int((k + 1) * n / 18)
            fc = 300 * (1 + k) ** 1.5
            out[a:b] = filt(x, "bandpass", [fc * 0.7, min(fc * 1.5, 19000)])[a:b]
        return out * (t / t[-1]) ** 2 * 0.4
    if name == "glitch":
        n = int(0.25 * SR); out = np.zeros(n)
        for k in range(8):
            a = int(k * n / 8); l = int(n / 16)
            out[a:a + l] = np.sign(np.sin(2 * np.pi * rng.uniform(200, 2000) * np.arange(l) / SR)) * 0.25
        return out
    if name == "type":
        n = int(0.05 * SR); t = np.arange(n) / SR
        return filt(rng.standard_normal(n), "bandpass", [2000, 7000]) * np.exp(-t / 0.008) * 0.35
    if name == "scratch":
        n = int(0.4 * SR); t = np.arange(n) / SR
        f = 300 + 900 * np.abs(np.sin(2 * np.pi * 5 * t))
        return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * filt(rng.standard_normal(n), "bandpass", [500, 3000]) * 0.5 * np.exp(-t / 0.25)
    raise SystemExit("unknown sfx " + name)


# ------------------------------------------------------------------ arrangement --
STYLES = {
    # chord roots + chord tones (MIDI), one chord per bar
    "dark": dict(prog=[[45, 57, 60, 64], [41, 53, 57, 60], [38, 50, 53, 57], [40, 52, 56, 59]], key=57),
    "hype": dict(prog=[[48, 60, 64, 67], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60]], key=60),
    "glide": dict(prog=[[41, 57, 60, 64, 67], [43, 55, 59, 62, 65], [45, 57, 60, 64, 67], [40, 55, 59, 62, 64]], key=60),
}


def song(duration, style, bpm, drop):
    n = int(duration * SR) + 3 * SR
    mus = np.zeros((n, 2)); drums = np.zeros((n, 2)); kicks = np.zeros(n)
    beat = 60 / bpm; bar = beat * 4
    st = STYLES[style]
    nbars = int(duration / bar) + 1
    for b in range(nbars):
        t0 = b * bar
        chord = st["prog"][b % 4]
        root = chord[0]
        intro = t0 + bar <= drop + 0.01      # before the drop: lighter
        if style == "dark":
            # half-time trap: kick 1 + "3-and", snare on 3, 16th hats with rolls, 808
            for kt in (0, 2.5) if not intro else (0,):
                add(drums, kick(), t0 + kt * beat, 0.95); kicks[int((t0 + kt * beat) * SR)] = 1
            if not intro:
                add(drums, snare(200, 1.0, 0.18), t0 + 2 * beat, 0.8)
                add(drums, clap(), t0 + 2 * beat, 0.45)
            for h in range(16):
                if intro and h % 2: continue
                ht = t0 + h * beat / 4
                add(drums, hat(), ht, 0.55 if h % 4 == 0 else 0.35, pan=0.25)
                if b % 2 == 1 and h >= 12 and not intro:   # roll
                    add(drums, hat(), ht + beat / 8, 0.3, pan=0.25)
            if not intro:
                add(mus, b808(root - 12 + 12, beat * 2.4), t0, 0.85)
                add(mus, b808(root - 12 + 12 + (3 if b % 2 else 0), beat * 1.3), t0 + 2.5 * beat, 0.7)
            pad = supersaw(chord[1:], bar, 1400 if intro else 2400, amp=0.16)
            add(mus, pad, t0, 0.8, -0.2); add(mus, np.roll(pad, 600), t0, 0.6, 0.3)
            for k, m in enumerate([0, 3, 7, 10, 12, 10, 7, 3]):
                add(mus, pluck(st["key"] + m + (0 if b % 2 == 0 else -2), 0.25, 3200, 0.16), t0 + k * beat / 2, 1, 0.3 if k % 2 else -0.3)
        elif style == "hype":
            for k in range(4):
                if intro and k % 2: continue
                add(drums, kick(1.2), t0 + k * beat, 1.0); kicks[int((t0 + k * beat) * SR)] = 1
                add(drums, hat(open_=True), t0 + (k + 0.5) * beat, 0.4, 0.2)
            if not intro:
                for k in (1, 3):
                    add(drums, clap(), t0 + k * beat, 0.8)
                    add(drums, snare(220, 1.2, 0.1), t0 + k * beat, 0.35)
            for h in range(16):
                add(drums, hat(), t0 + h * beat / 4, 0.25 if h % 2 else 0.4, -0.25)
            add(mus, b808(root, bar * 0.95), t0, 0.55)
            for k in range(8):   # off-beat bass + chord stabs
                if k % 2 == 1:
                    add(mus, supersaw(chord[1:], beat * 0.42, 5200 if not intro else 2500, amp=0.3), t0 + k * beat / 2, 0.9)
            mel = [12, 7, 9, 12, 14, 12, 9, 7] if b % 2 == 0 else [12, 14, 16, 14, 12, 9, 7, 9]
            for k, m in enumerate(mel):
                add(mus, pluck(st["key"] + m, 0.22, 6000, 0.17), t0 + k * beat / 2, 1, 0.2)
        else:  # glide: warm chill house, swung hats, sidechained chords, bells
            for k in range(4):
                add(drums, kick(0.8), t0 + k * beat, 0.8 if not intro else 0.5); kicks[int((t0 + k * beat) * SR)] = 1
            if not intro:
                for k in (1, 3):
                    add(drums, clap(), t0 + k * beat, 0.5)
            for h in range(8):
                sw = 0.06 * beat if h % 2 else 0
                add(drums, hat(), t0 + h * beat / 2 + sw, 0.3 if h % 2 else 0.18, 0.3)
            add(mus, b808(root, bar * 0.9), t0, 0.45)
            pad = supersaw(chord[1:], bar, 2000, amp=0.18)
            add(mus, pad, t0, 0.8, -0.3); add(mus, np.roll(pad, 900), t0, 0.6, 0.35)
            for k, m in enumerate([24, 19, 16, 19] if b % 2 == 0 else [26, 21, 19, 16]):
                add(mus, bell(chord[1] + m - 12, 0.9, 0.12), t0 + k * beat + beat / 2, 1, 0.4 if k % 2 else -0.4)
    # sidechain: duck the music on every kick
    duck = np.ones(n)
    idx = np.nonzero(kicks)[0]
    rel = np.linspace(0, 1, int(0.22 * SR)) ** 1.4
    for i in idx:
        seg = duck[i:i + len(rel)]
        duck[i:i + len(seg)] = np.minimum(seg, 0.25 + 0.75 * rel[: len(seg)])
    mus *= duck[:, None]
    return mus + drums


def master(x):
    x = np.stack([filt(x[:, c], "highpass", 28) for c in (0, 1)], 1)
    x = x + 0.5 * np.stack([filt(x[:, c], "highpass", 2500) for c in (0, 1)], 1)   # presence for phone speakers
    pk = np.abs(x).max() + 1e-9
    x = x / pk * 1.6
    x = np.tanh(x) / np.tanh(1.6)
    return x * 0.89


def main(meta_path, out_path):
    meta = json.load(open(meta_path))
    dur = meta["duration"]
    m = meta.get("music", {})
    mix = song(dur, m.get("style", "dark"), m.get("bpm", 128), m.get("drop", 0)) * 0.7
    fx = np.zeros_like(mix)
    for t, name, g in meta.get("sfx", []):
        add(fx, sfx(name), t, g)
    out = mix + fx * 0.8
    n = int(dur * SR)
    out = out[:n]
    t = np.arange(n) / SR
    out *= np.minimum(1, (dur - t) / 0.35).clip(0, 1)[:, None]
    out = master(out)
    pcm = (out * 32767).astype("<i2")
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    main(*sys.argv[1:3])
