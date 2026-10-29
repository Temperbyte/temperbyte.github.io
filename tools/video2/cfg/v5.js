// PT, slideshow: client capacity (numbers from the client capacity calculator's example, reels r14/r20)
window.CFG = { kind: "swipe", music: "glide", pal: { bg: "linear-gradient(170deg,#17142a,#1a1630 40%,#0f0e17)", deep: "#E2622A", orb2: "#C2367A", wire: "#FF8A3D", rim: "#ff7ab6" },
  slides: [
    `<div class="k">For online coaches</div><div class="t">18 clients.<br>15 hours.<br><em>Room for<br>one more?</em></div><div class="sub" data-t="0.95">Most coaches never do this math.</div>`,
    `<div class="k">Right now</div><div class="t" style="font-size:96px">25-minute<br>check-ins.</div>
     <div class="offer" data-t="2.5"><div class="n">You can coach about</div><div class="v">17 clients</div></div>
     <div class="offer win" data-t="3.3"><div class="n">You have</div><div class="v">18 clients</div><div class="d">101% of your hours</div></div>`,
    `<div class="k">Same 15 hours</div><div class="t" style="font-size:96px">10-minute<br><em>check-ins.</em></div>
     <div class="offer win" data-t="6.3"><div class="n">Room for</div><div class="v">25 clients</div></div>
     <div class="offer" data-t="7.1"><div class="n">At $150 a month</div><div class="v" style="font-size:80px">$2,550 → $3,750</div><div class="d" style="color:var(--mute)">example numbers · plug in yours</div></div>`,
    `<div class="k">The lesson</div><div class="t">Check-in time<br>is the <em>biggest<br>lever.</em></div><div class="sub" data-t="9.9">More clients without longer weeks.</div>`,
    `<div class="k">All free · no sign-up</div><div class="t" style="font-size:100px">3 calculators<br>every coach<br><em>needs.</em></div>
     <div style="margin-top:40px"><div class="calc" data-t="12.0"><b>1</b>Client capacity</div><div class="calc" data-t="12.3"><b>2</b>Client adherence</div><div class="calc" data-t="12.6"><b>3</b>Training volume</div></div>
     <div class="sub" style="color:var(--ink);font-weight:700;margin-top:48px" data-t="13.2">link in bio ↗</div>`],
  sfx: [[2.5, "pop", .5], [3.3, "boom", .6], [6.3, "sparkle", .6], [7.1, "pop", .5], [9.9, "pop", .4], [12.0, "pop", .4], [12.3, "pop", .4], [12.6, "pop", .4], [13.3, "sparkle", .6]],
  hits: [3.3],
  face: [[0, { expr: "shock", mouth: "o", armL: 1.1, armR: 1.1 }], [1.875, { expr: "neutral", lookX: -0.8, lookY: -0.5, turn: -0.4 }], [3.3, { expr: "dead", tilt: 0.06 }],
    [5.625, { expr: "neutral", lookX: -0.6, lookY: -0.6, turn: -0.4 }], [6.3, { expr: "love", armL: 2.0, armR: 2.0, bounce: 0.25 }], [7.1, { expr: "money", bounce: 0.3, armL: 2.2, armR: 2.2 }],
    [9.375, { expr: "smug", turn: -0.3 }], [11.25, (t) => ({ expr: t > 14.0 && t < 14.4 ? "wink" : "happy", mouth: "smile", armR: 2.4 + Math.sin((t - 11) * 12) * 0.35, armL: 0.3, bounce: t < 11.9 ? 0.3 : 0 })]] };
