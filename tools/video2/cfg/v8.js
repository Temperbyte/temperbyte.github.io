// Realtors, slideshow: months of inventory (numbers from the calculator's example, reel r11)
window.CFG = { kind: "swipe", music: "dark", pal: { bg: "linear-gradient(170deg,#101a22,#14202a 40%,#0b1015)", deep: "#E2622A", orb2: "#1f6f8b", wire: "#FF8A3D", rim: "#7fe0ff" },
  slides: [
    `<div class="k">For listing agents</div><div class="t">Buyer's market<br>or <em>seller's<br>market?</em></div><div class="sub" data-t="0.95">Wrong question. It depends on the price band.</div>`,
    `<div class="k">Same town, same month</div><div class="t" style="font-size:96px">Two different<br><em>markets.</em></div>
     <div class="offer" data-t="2.6"><div class="n">All price bands</div><div class="v">4.0 months</div><div class="d" style="color:var(--mute)">balanced</div></div>
     <div class="offer win" data-t="3.6"><div class="n">$600k and up</div><div class="v">7.8 months</div><div class="d" style="color:var(--or2)">buyer's market</div></div>`,
    `<div class="k">The formula</div><div class="t" style="font-size:92px">Months of<br>inventory =</div>
     <div class="offer" data-t="6.2"><div class="v" style="font-size:72px">active listings</div><div class="d" style="color:var(--or2);font-size:80px;line-height:1;margin:6px 0">÷</div><div class="v" style="font-size:72px">sales per month</div></div>
     <div class="sub" data-t="7.4">Compare two areas or price bands side by side.</div>`,
    `<div class="k">Before the listing appointment</div><div class="t">Price the band,<br>not the <em>town.</em></div><div class="sub" data-t="9.9">Use your MLS's numbers.<br>Thresholds vary by market.</div>`,
    `<div class="k">All free · no sign-up</div><div class="t" style="font-size:100px">3 calculators<br>for listing<br><em>agents.</em></div>
     <div style="margin-top:40px"><div class="calc" data-t="12.0"><b>1</b>Months of inventory</div><div class="calc" data-t="12.3"><b>2</b>Comps price range</div><div class="calc" data-t="12.6"><b>3</b>Price reduction</div></div>
     <div class="sub" style="color:var(--ink);font-weight:700;margin-top:48px" data-t="13.2">link in bio ↗</div>`],
  sfx: [[2.6, "pop", .5], [3.6, "boom", .7], [6.2, "pop", .5], [7.4, "pop", .4], [9.9, "pop", .4], [12.0, "pop", .4], [12.3, "pop", .4], [12.6, "pop", .4], [13.3, "sparkle", .6]],
  hits: [3.6],
  face: [[0, { expr: "smug", turn: -0.3 }], [1.875, { expr: "neutral", lookX: -0.8, lookY: -0.5, turn: -0.4 }], [3.6, { expr: "shock", mouth: "o" }],
    [5.625, { expr: "load", flameBoost: 1.4 }], [7.4, { expr: "happy", mouth: "smile", armR: 2.0 }], [9.375, { expr: "smug", turn: -0.3, armR: 0.9 }],
    [11.25, (t) => ({ expr: t > 14.0 && t < 14.4 ? "wink" : "happy", mouth: "smile", armR: 2.4 + Math.sin((t - 11) * 12) * 0.35, armL: 0.3, bounce: t < 11.9 ? 0.3 : 0 })]] };
