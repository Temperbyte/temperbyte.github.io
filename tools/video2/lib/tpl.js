/* Data-driven templates for Temperbyte videos. A page sets window.CFG and loads this file.
   CFG.kind: "stat" (slam hook + proof card + big number) | "hype" (hype words + claim + proof card) | "swipe" (5 swipeable glass cards)
   Shared: 15 s, 128 bpm (8 bars of 1.875 s), mascot Byte, generated music/sfx.                             */
(function () {
  const { p, E, win, el, css, lerp, clamp } = K;
  const B = 0.46875, BAR = 1.875;
  const C = window.CFG;
  const PAL = Object.assign({ or: "#E2622A", or2: "#FF8A3D", deep: "#C2501F", orb2: "#3b4a8a", bg: "linear-gradient(170deg,#1b1d22,#121316 60%,#0b0c0e)" }, C.pal || {});
  const root = document.documentElement;
  root.style.setProperty("--or", PAL.or); root.style.setProperty("--or2", PAL.or2);
  window.DURATION = 15.0; window.FPS = 30;
  window.MUSIC = { style: C.music || "dark", bpm: 128, drop: C.drop ?? BAR };

  document.body.innerHTML = `<div id="world"><div class="bg" style="background:${PAL.bg}"></div>
  <div class="orb" id="orb1" style="width:780px;height:780px;background:${PAL.deep}"></div>
  <div class="orb" id="orb2" style="width:580px;height:580px;background:${PAL.orb2}"></div>
  <canvas id="wire" class="full" width="540" height="960"></canvas>
  <div id="hype" class="full"></div><div id="stage"></div>
  <canvas id="mascot" class="full" width="1080" height="1920"></canvas><div id="top"></div></div>
  <div class="vig"></div><div class="flash" id="flash"></div>
  <style>
  .stack{position:absolute;left:0;right:0;text-align:center;font-family:Anton;text-transform:uppercase;line-height:.86;white-space:nowrap}
  .card3{position:absolute;left:60px;right:60px;top:560px;padding:56px 56px 64px;border-radius:44px}
  .card3 .k{font:700 26px/1 Inter;letter-spacing:.18em;text-transform:uppercase;color:var(--mute);margin-bottom:26px}
  .rw{display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:36px 0;border-bottom:1.5px solid rgba(255,255,255,.12);font:600 50px/1.2 Inter}
  .rw span:last-child{font:600 50px/1 Mono;text-align:right}
  .rw.hl{color:var(--or2)} .rw.bad span:last-child{color:#ff9b7a}
  .rw.hot{margin:0 -22px;padding-left:22px;padding-right:22px;border-radius:18px;border-bottom:0;background:rgba(226,98,42,.18);box-shadow:inset 0 0 0 2px var(--or)}
  .bigres{position:absolute;left:70px;right:70px;text-align:center}
  .bigres .lab{font:700 34px/1.2 Inter;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}
  .bigres .num{font:900 230px/1 InterD;letter-spacing:-.05em;white-space:nowrap;margin-top:14px}
  .bigres .sub{font:600 46px/1.25 Mono;color:var(--or2);margin-top:20px}
  .stamp2{position:absolute;font-family:Anton;font-size:200px;line-height:1;padding:4px 48px 14px;border:12px solid var(--or);color:var(--or);border-radius:28px;letter-spacing:.02em;white-space:nowrap;background:rgba(18,19,22,.85);text-shadow:0 0 40px rgba(226,98,42,.6);box-shadow:0 0 60px rgba(226,98,42,.45),inset 0 0 40px rgba(226,98,42,.25)}
  .spark{position:absolute;width:18px;height:18px;background:#FFD27A;transform:rotate(45deg);border-radius:3px;box-shadow:0 0 20px #ffb347}
  .sl{position:absolute;left:70px;top:440px;width:940px;height:1060px;padding:70px 64px;overflow:hidden;background:linear-gradient(160deg,rgba(34,28,52,.74),rgba(16,14,26,.66) 70%)!important}
  .sl .k{font:700 26px/1 Inter;letter-spacing:.18em;text-transform:uppercase;color:var(--or2);margin-bottom:30px}
  .sl .t{font:900 112px/0.98 InterD;letter-spacing:-.04em}.sl .t em{font-style:normal;color:var(--or2);text-shadow:0 0 30px rgba(255,138,61,.35)}
  .sl .sub{font:500 50px/1.3 Inter;color:var(--mute);margin-top:40px}
  .dots{position:absolute;left:0;right:0;top:230px;display:flex;justify-content:center;gap:14px}
  .dots i{width:54px;height:54px;border-radius:50%;border:2px solid rgba(255,255,255,.22);font:700 24px/50px Inter;text-align:center;font-style:normal;color:var(--mute);background:rgba(255,255,255,.05)}
  .dots i.on{background:var(--or);border-color:var(--or);color:#16181B;box-shadow:0 0 24px rgba(226,98,42,.7)}
  .offer{border-radius:30px;padding:38px 42px;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.14);margin-top:26px}
  .offer .n{font:700 28px/1 Inter;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}.offer .v{font:800 92px/1.1 InterD;letter-spacing:-.03em;margin-top:12px}.offer .d{font:600 36px/1.3 Mono;color:#ff9b7a;margin-top:6px}
  .offer.win{border-color:var(--or);box-shadow:0 0 40px rgba(226,98,42,.35)}
  .pill{display:inline-block;padding:22px 34px;margin:0 16px 20px 0;border-radius:999px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.18);font:700 44px/1 Inter}
  .calc{display:flex;align-items:center;gap:26px;padding:30px 0;border-bottom:1.5px solid rgba(255,255,255,.12);font:700 56px/1.1 InterD;letter-spacing:-.02em}
  .calc b{width:74px;height:74px;border-radius:22px;background:var(--or);color:#16181B;font:900 40px/74px Inter;text-align:center;flex:none}
  </style>`;
  const S = document.getElementById("stage"), TOP = document.getElementById("top"), HY = document.getElementById("hype");
  const brand = el("div", "brand", TOP, "<i></i>Temperbyte");
  const wire = K.wireBg(document.getElementById("wire"), { color: PAL.wire || PAL.deep });
  const grain = K.grain(document.getElementById("world"));
  const M = K.mascotStage(document.getElementById("mascot"), { rim: PAL.rim || "#7fb2ff" });
  const orb1 = document.getElementById("orb1"), orb2 = document.getElementById("orb2"), flash = document.getElementById("flash"), world = document.getElementById("world");
  window.SFX = [];
  const sfx = (t, n, g = 0.6) => SFX.push([t, n, g]);

  function slamIn(e, t, t0, t1, o = {}) {
    const k = p(t, t0, t0 + (o.d || 0.16)), out = o.out ? E.in3(p(t, t1 - 0.14, t1)) : 0, vis = t >= t0 && t < t1;
    e.style.display = vis ? "" : "none"; if (!vis) return;
    const blur = (1 - k) * 18;
    e.style.opacity = Math.min(1, k * 3) * (1 - out); e.style.filter = blur > 0.3 ? `blur(${blur}px)` : "";
    e.style.transform = `translateY(${-out * 120}px) scale(${lerp(o.from || 1.45, 1, E.out5(k))})${o.rot ? ` rotate(${o.rot}deg)` : ""}`;
  }
  function fadeUp(e, t, t0, t1, dist = 60) {
    const v = win(t, t0, t1, 0.3, 0.2); e.style.display = v > 0 ? "" : "none"; e.style.opacity = v; e.style.transform = `translateY(${(1 - v) * dist}px)`;
  }
  function popIn(e, t, t0, t1) {
    const k = p(t, t0, t0 + 0.35), v = win(t, t0, t1, 0.35, 0.2); e.style.display = v > 0 ? "" : "none";
    e.style.opacity = Math.min(1, k * 2.5) * (t > t1 - 0.2 ? v : 1); e.style.transform = `scale(${lerp(0.6, 1, E.back(k))})`;
  }
  const fmt = (v, dec = 0) => Number(v).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const place = (state) => {
    const m = state.m, f = state.f;
    M.place(m.x, m.y, m.size, Object.assign({ t: state.t, shadow: state.shadow ?? 0.4 }, f));
  };
  function keyed(K0, t) {
    let i = 0; while (i < K0.length - 2 && t >= K0[i + 1][0]) i++;
    const a = K0[i], b = K0[i + 1], k = E.io3(p(t, a[0], b[0]));
    return { x: lerp(a[1], b[1], k), y: lerp(a[2], b[2], k), size: lerp(a[3], b[3], k) };
  }
  function face(list, t) { let r = list[0][1]; for (const [t0, f] of list) if (t >= t0) r = f; return typeof r === "function" ? r(t) : r; }
  function background(t, sh, flashes) {
    world.style.transform = `translate(${sh.x}px,${sh.y}px) rotate(${sh.r}deg)`;
    let fl = 0; for (const h of flashes) if (t >= h) fl += Math.max(0, 1 - (t - h) / 0.3) * 0.38; flash.style.opacity = fl;
    css(orb1, { left: (160 + Math.sin(t * 0.5) * 120) + "px", top: lerp(-200, 900, (Math.sin(t * 0.3) + 1) / 2) + "px" });
    css(orb2, { left: (500 + Math.cos(t * 0.4) * 160) + "px", top: (1300 + Math.sin(t * 0.5) * 200) + "px" });
    wire(t, 0.8, { drift: t * 0.1 }); grain(t);
  }

  // ======================================================================== stat / hype
  function stat_hype() {
    const hype = C.kind === "hype";
    // ---- intro (bars 1-2)
    let intro;
    if (hype) {
      const hw = C.words.map(([w, bg, fg], i) => {
        const d = el("div", "full", HY); d.style.background = bg; const fs = (C.wordSizes || [310, 250, 205, 230])[i] * (C.wordScale || 1); const rows = [];
        for (let r = 0; r < 5; r++) { const s = el("div", "stack", d, w); css(s, { color: fg, fontSize: fs + "px", top: (i === 3 ? 600 + (r - 2) * 520 : 680 + (r - 2) * fs * 1.25) + "px", opacity: r === 2 ? 1 : 0.18 }); rows.push(s); }
        return { d, rows };
      });
      const claim = el("div", "h", S, C.claim); css(claim, { top: "320px", fontSize: (C.claimSize || 112) + "px" });
      const ok = el("div", "mono", S, C.claimTag || "…okay. proof."); css(ok, { position: "absolute", left: "84px", top: "1050px", fontSize: "54px", color: "var(--mute)" });
      const sparks = Array.from({ length: 26 }, () => el("div", "spark", S));
      intro = (t) => {
        hw.forEach((h, i) => { const t0 = i * B, t1 = i === 3 ? BAR : (i + 1) * B, on = t >= t0 && t < t1; h.d.style.display = on ? "" : "none";
          if (on) { const k = E.out5(p(t, t0, t0 + 0.14)); h.rows.forEach((r, j) => { r.style.transform = `translateX(${(j % 2 ? 1 : -1) * (1 - k) * 600 + (j % 2 ? -1 : 1) * (t - t0) * 120}px) scale(${j === 2 ? lerp(1.5, 1, k) : 1})`; }); } });
        brand.style.color = (t < BAR && Math.floor(t / B) % 2 === 1) ? "#16181B" : "";
        sparks.forEach((s, i) => { const t0 = 3 * B + K.rand(i) * 0.2, k = p(t, t0, t0 + 1.1), vis = t >= t0 && k < 1; s.style.display = vis ? "" : "none"; if (!vis) return;
          const a = K.rand(i + 9) * 6.28, d = 200 + K.rand(i + 3) * 520; s.style.left = (540 + Math.cos(a) * d * E.out3(k)) + "px"; s.style.top = (900 + Math.sin(a) * d * E.out3(k) + k * k * 300) + "px"; s.style.opacity = 1 - k; s.style.transform = `rotate(${45 + k * 360}deg) scale(${1.4 - k})`; });
        fadeUp(claim, t, BAR, 2 * BAR - 0.05, 50); fadeUp(ok, t, 3.15, 2 * BAR - 0.05, 20);
      };
      sfx(0, "impact", .7); sfx(B, "impact", .7); sfx(2 * B, "impact", .75); sfx(3 * B, "boom", 1); sfx(3 * B + .1, "sparkle", .6); sfx(BAR + .1, "whoosh", .5); sfx(3.05, "scratch", .8);
    } else {
      const L = C.lines;
      const a = [el("div", "slam", S, L[0]), el("div", "slam", S, L[1]), el("div", "slam", S, C.big)];
      css(a[0], { top: "330px", fontSize: (C.lineSize || 190) + "px" }); css(a[1], { top: (330 + (C.lineSize || 190) * 1.0) + "px", fontSize: (C.lineSize || 190) + "px" });
      css(a[2], { top: (330 + (C.lineSize || 190) * 2.0 + 10) + "px", fontSize: (C.bigSize || 330) + "px", color: "var(--or)", textShadow: "0 0 60px rgba(226,98,42,.55)" });
      const sub = el("div", "slam", S, C.sub); css(sub, { top: (330 + (C.lineSize || 190) * 2.0 + 30 + (C.bigSize || 330) * 0.95) + "px", fontSize: "56px", fontFamily: "Mono", textTransform: "none", color: "var(--mute)" });
      const b1 = el("div", "h", S, C.turn1); css(b1, { top: "430px", fontSize: "92px", textAlign: "center" });
      const b2 = el("div", "slam", S, C.turn2); css(b2, { top: "740px", fontSize: (C.turn2Size || 420) + "px" });
      intro = (t) => {
        slamIn(a[0], t, 0, BAR, { out: 1 }); slamIn(a[1], t, B, BAR, { out: 1 }); slamIn(a[2], t, 2 * B, BAR, { out: 1, from: 1.8 }); fadeUp(sub, t, 3 * B, BAR);
        fadeUp(b1, t, BAR, 2 * BAR - 0.1, 40); slamIn(b2, t, 6 * B, 2 * BAR, { out: 1, from: 2.2, rot: -3 });
      };
      sfx(0, "impact", .8); sfx(B, "impact", .7); sfx(2 * B, "boom", 1); sfx(2 * B + .06, "pop", .6); sfx(BAR, "whoosh", .5); sfx(6 * B, "boom", 1); sfx(2 * BAR - .25, "whoosh", .7);
    }
    // ---- proof card (bars 3-4)
    const card = el("div", "glass card3", S, `<div class="k">${C.card.title}</div>${C.card.rows.map((r) => `<div class="rw ${r[2] || ""}"><span>${r[0]}</span><span>${r[1]}</span></div>`).join("")}`);
    const head = el("div", "h", S, C.card.head); css(head, { top: "270px", fontSize: "88px", textAlign: "left" });
    const rows = [...card.querySelectorAll(".rw")];
    const T3 = 2 * BAR, T4 = 4 * BAR;   // card on screen 3.75 .. 7.5 (+ moves up when result arrives)
    // ---- result (bars 5-6)
    const R = C.result;
    const res = el("div", "bigres", S, `<div class="lab">${R.label}</div><div class="num" id="rnum">${R.pre || ""}0${R.suf || ""}</div><div class="sub">${R.sub}</div>`);
    css(res, { top: "470px" });
    const rnum = res.querySelector(".num");
    const stamp = el("div", "stamp2", S, R.stamp); css(stamp, { left: "50%", top: "930px" });
    // ---- product (bar 7) + CTA (bar 8)
    const d1 = el("div", "h", S, C.product.name); css(d1, { top: "300px", fontSize: "104px" });
    const d2 = el("div", "mono", S, C.product.tag); css(d2, { position: "absolute", left: "84px", top: (300 + (C.product.name.includes("<br>") ? 230 : 130)) + "px", fontSize: "40px", color: "var(--or2)" });
    const chips = C.product.chips.map((s, i) => { const c = el("div", "chip", S, s); css(c, { left: "80px", top: (680 + i * 130) + "px", fontSize: "46px" }); return c; });
    const e1 = el("div", "slam", S, C.cta1 || "Free"); css(e1, { top: "330px", fontSize: "330px", color: "var(--or)", textShadow: "0 0 70px rgba(226,98,42,.55)" });
    const e2 = el("div", "slam", S, C.cta2 || "calculator"); css(e2, { top: "620px", fontSize: "190px" });
    const e3 = el("div", "h", S, "link in bio ↗"); css(e3, { top: "860px", fontSize: "76px", textAlign: "center", color: "var(--mute)", fontWeight: 800 });
    const e4 = el("div", "mono", S, "no sign-up · temperbyte.github.io"); css(e4, { position: "absolute", left: 0, right: 0, textAlign: "center", top: "990px", fontSize: "38px", color: "var(--mute)" });
    // sfx for proof
    C.card.rows.forEach((_, i) => sfx(T3 + 0.55 + i * 0.4, "tick", .45));
    sfx(T3 - .1, "whoosh", .5); sfx(T4 - .3, "riser", .4); sfx(T4 + .05, "whoosh", .6); sfx(T4 + .5, "tick", .6); sfx(9.8, "stamp", 1);
    sfx(6 * BAR - .2, "whoosh", .6); chips.forEach((_, i) => sfx(6 * BAR + .4 + i * .23, "pop", .45)); sfx(7 * BAR, "boom", .9); sfx(7 * BAR + .4, "sparkle", .7);
    const hits = [0.94, 2.81, 9.8, 7 * BAR]; if (hype) hits.push(0, B, 2 * B, 3 * B);
    const flashes = hype ? [7 * BAR, 9.8] : [0.94, 2.81, 9.8, 7 * BAR];

    // mascot
    const MK = C.mascotKeys || (hype
      ? [[0, 860, 1820, 380], [1.8, 860, 1820, 380], [2.2, 760, 1640, 420], [3.7, 760, 1640, 420], [4.0, 880, 562, 250], [7.4, 880, 562, 250], [7.9, 880, 1780, 400], [11.0, 880, 1780, 400], [11.6, 890, 1760, 400], [12.9, 890, 1760, 400], [13.4, 540, 1770, 500], [15, 540, 1770, 500]]
      : [[0, 900, 2500, 380], [0.94, 900, 2500, 380], [1.25, 840, 1780, 400], [3.4, 840, 1780, 400], [3.9, 880, 562, 250], [7.4, 880, 562, 250], [7.9, 880, 1780, 400], [11.0, 880, 1780, 400], [11.6, 890, 1760, 400], [12.9, 890, 1760, 400], [13.4, 540, 1770, 500], [15, 540, 1770, 500]]);
    const wave = (t) => ({ expr: t > 14.2 && t < 14.6 ? "wink" : (C.endExpr || "happy"), mouth: "smile", armR: 2.4 + Math.sin((t - 13.1) * 12) * 0.35, armL: 0.3, bounce: t < 13.8 ? 0.3 : 0 });
    const FACE = C.face || (hype
      ? [[0, { expr: "money", bounce: 0.45, bounceRate: 13.4, armL: 2.3, armR: 2.3, flameBoost: 1.5 }], [BAR, { expr: "love", armL: 1.2, armR: 1.2, bounce: 0.15 }], [3.05, { expr: "shock", mouth: "o", armL: 0.4, armR: 0.4 }],
        [3.75, { expr: "neutral", lookX: -0.8, lookY: -0.4, turn: -0.35 }], [6.0, { expr: "angry", turn: -0.35 }], [7.5, { expr: "load", flameBoost: 1.6, bounce: 0.15, bounceRate: 20 }], [8.6, { expr: "happy", mouth: "smile", turn: -0.3, armR: 1.6 }],
        [9.8, { expr: "smug", turn: -0.4, armR: 0.8 }], [11.25, { expr: "happy", mouth: "smile", bounce: 0.35, armL: 2.2, armR: 2.2 }], [13.125, wave]]
      : [[0, { expr: "shock", mouth: "o", armL: 1.3, armR: 1.3 }], [1.25, { expr: "sad", lookX: -0.5, armL: 0.3, armR: 0.3 }], [2.81, { expr: "angry", armL: 0.6, armR: 0.6 }],
        [3.75, { expr: "neutral", lookX: -0.7, lookY: -0.3, turn: -0.35 }], [6.0, { expr: "shock", mouth: "o", turn: -0.35 }], [6.3, { expr: "smug", turn: -0.25 }],
        [9.8, { expr: "happy", mouth: "smile", bounce: 0.35, armL: 2.2, armR: 2.2 }], [11.25, { expr: "neutral", lookX: -0.7, turn: -0.4, armR: 0.9 }], [13.125, wave]]);

    window.seek = function (t) {
      background(t, K.shake(t, hits, 24), flashes); intro(t);
      // card
      const cv = win(t, T3, T4 + 0.2, 0.45, 0.35, E.back);
      card.style.display = cv > 0 ? "" : "none"; card.style.transform = `translateY(${(1 - cv) * 900}px)`; card.style.opacity = Math.min(1, cv * 1.4);
      fadeUp(head, t, T3 + 0.1, T4 - 0.05);
      rows.forEach((r, i) => { const k = p(t, T3 + 0.5 + i * 0.4, T3 + 0.8 + i * 0.4); r.style.opacity = k; r.style.transform = `translateX(${(1 - E.out3(k)) * 70}px)`;
        if (r.classList.contains("hot")) r.style.boxShadow = `inset 0 0 0 2px rgba(226,98,42,${k})`; });
      // result
      fadeUp(res, t, T4, 6 * BAR - 0.05, 50);
      rnum.textContent = (R.pre || "") + fmt(lerp(R.from, R.to, E.out3(p(t, T4 + 0.1, T4 + 1.1))), R.dec || 0) + (R.suf || "");
      { const L = ((R.pre || "") + fmt(R.to, R.dec || 0) + (R.suf || "")).length; rnum.style.fontSize = Math.min(230, 940 / (L * 0.6)) + "px"; }
      const sk = p(t, 9.8, 9.95), sv = t >= 9.8 && t < 6 * BAR;
      stamp.style.display = sv ? "" : "none"; stamp.style.transform = `translate(-50%,0) rotate(-7deg) scale(${lerp(2.4, 1, E.out5(sk))})`; stamp.style.opacity = Math.min(1, sk * 3) * (1 - p(t, 6 * BAR - 0.15, 6 * BAR));
      // product + CTA
      fadeUp(d1, t, 6 * BAR + 0.05, 7 * BAR); fadeUp(d2, t, 6 * BAR + 0.2, 7 * BAR); chips.forEach((c, i) => popIn(c, t, 6 * BAR + 0.35 + i * 0.23, 7 * BAR));
      slamIn(e1, t, 7 * BAR, 15.1, { from: 2.0 }); slamIn(e2, t, 7 * BAR + B, 15.1); fadeUp(e3, t, 7 * BAR + 2 * B, 15.1); fadeUp(e4, t, 7 * BAR + 3 * B, 15.1, 20);
      const m = keyed(MK, t), f = face(FACE, t); const blink = (Math.floor(t * 10) % 37 === 0) ? 1 : 0;
      M.place(m.x, m.y, m.size, Object.assign({ t, blink: (f.expr === "neutral" || f.expr === "smug") ? blink : 0, shadow: m.y > 1500 ? 0 : 0.4 }, f));
    };
  }

  // ======================================================================== swipe
  function swipe() {
    const SW = [BAR, 3 * BAR, 5 * BAR, 6 * BAR]; // swipe times: slide1 0-1.875, 2 to 5.6, 3 to 9.4, 4 to 11.25, 5 to end
    const SWT = C.swipes || [1.875, 5.625, 9.375, 11.25];
    const slides = C.slides.map((html) => el("div", "glass sl", S, html));
    const dots = el("div", "dots", TOP, [1, 2, 3, 4, 5].map((n) => `<i>${n}</i>`).join("")); const dotEls = [...dots.children];
    sfx(0, "impact", .6); sfx(0.95, "pop", .5); SWT.forEach((s) => sfx(s - 0.12, "whoosh", .7));
    (C.sfx || []).forEach((x) => SFX.push(x));
    const FACE = C.face; const hops = SWT;
    window.seek = function (t) {
      background(t, K.shake(t, [0, ...(C.hits || [])], 14), []);
      let idx = 0; for (const s of SWT) if (t >= s) idx++;
      slides.forEach((s, i) => { let x = (i - idx) * 1100, sc = 1; const sw = SWT[idx - 1];
        if (sw != null && t - sw < 0.45) { const k = E.out5(p(t, sw, sw + 0.45)); x = (i - idx + 1 - k) * 1100; }
        if (i === 0) { sc = lerp(0.7, 1, E.back(p(t, 0, 0.5))); s.style.opacity = Math.min(1, p(t, 0, 0.2) * 3); }
        s.style.display = Math.abs(x) < 1090 ? "" : "none"; s.style.transform = `translateX(${x}px) rotate(${x / 1100 * -6}deg) scale(${sc})`; });
      dotEls.forEach((d, i) => d.classList.toggle("on", i === idx));
      document.querySelectorAll("[data-t]").forEach((e) => { const k = p(t, +e.dataset.t, +e.dataset.t + 0.35); e.style.opacity = k; e.style.transform = `translateY(${(1 - E.out3(k)) * 40}px) scale(${lerp(0.94, 1, E.out3(k))})`; });
      if (C.anim) C.anim(t, { p, E, lerp, clamp, fmt, slides });
      let hopk = 0; for (const s of hops) { const d = t - s; if (d >= -0.1 && d < 0.45) hopk = Math.sin(Math.PI * clamp((d + 0.1) / 0.55)); }
      const entry = E.back(p(t, 0.15, 0.7)); const f = face(FACE, t);
      M.place(860, 442 - hopk * 55 - (1 - entry) * 600, 250, Object.assign({ t, shadow: hopk > 0.2 ? 0.15 : 0.4, visible: t > 0.15 }, f));
    };
  }

  if (C.kind === "swipe") swipe(); else stat_hype();
  document.fonts.ready.then(() => { seek(0); window.ready = true; });
})();
