# Temperbyte video style (set 2026-10-29)

Mascot: **Byte** — a rounded 3D cube with a dark glass face screen, glowing LED eyes, little arms and legs,
and a small forge flame on top (lib/mascot.js, three.js). Expressions: neutral, happy, angry, shock, smug,
love, money, wink, sad, load, dead. Original design.

Look: dark background with warm orange glow, wireframe shapes, film grain, Anton for slam words,
Inter Display for headlines, JetBrains Mono for numbers. Brand orange #C2501F / #E2622A / #FF8A3D.
v3 uses a violet/purple variant with glass cards for slideshow-style videos.

Rules
- 15 s, 1080x1920, 30 fps. First 1 s is the hook: question/attack ("Don't."), hype ("Best of the best.") or a bold claim.
- Every number comes from the calculator or skill output. Never invent stats.
- Music and sound effects are generated (lib/music.py), no samples, no licensing. Styles: dark, hype, glide.
- Byte shows up in each video but never talks over the content.

Build
  node render.js v1.html 2      # frames/v1/*.jpg (about 2 s per frame with software WebGL)
  ./make.sh v1                  # music + mp4 -> out/v1.mp4
  node preview.js v1.html out/p.png 0.3 1.2 ...   # contact sheet to check before rendering
Needs: node + playwright (Chromium), python3 numpy scipy, ffmpeg. Fonts are in fonts/ (OFL).

Templates (2026-10-29): lib/tpl.js + cfg/<name>.js. kind "stat" (slam hook → proof card → big number + stamp → product chips → CTA),
"hype" (four hype words → claim → same proof), "swipe" (five glass slides, data-t reveals). v4–v10 are examples.
New video: copy a cfg, change the words and numbers (numbers only from the calculators), make a vN.html like v4.html, preview, render.

Publishing (2026-10-30)
- Finished videos go to media/reels/<id>.mp4 and into media/reels/queue.json (id, date, url, caption, seconds).
  AVA's Mac posts the day's Reel to Instagram from that queue. TikTok is scheduled separately in TikTok Studio.
- The old-style reels r08–r20 were taken out of the queue on 2026-10-30 (list in media/reels/old-style-not-queued.json);
  their files are kept.
- tools/video/make_reels.py (old style) is no longer used for new batches.
