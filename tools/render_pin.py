"""Render one Temperbyte pin image (1000x1500) in the house style.

python3 tools/render_pin.py OUT.png "Tag" "Title" "Subtitle" "Button" [dark|light]
Example: python3 tools/render_pin.py assets/social/14-appraisal-gap.png "Free tool" "Appraisal gap calculator" "..." "Try it free" dark
"""
import sys
from playwright.sync_api import sync_playwright
W,H=1000,1500
HTML="""<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:%dpx;height:%dpx;background:%s;color:%s;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
.p{height:100%%;padding:84px 80px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;font-size:22px;letter-spacing:.16em;text-transform:uppercase}
.m{display:flex;align-items:center;gap:14px;font-weight:600}.m i{width:18px;height:18px;background:#B0532B;display:block}
.r{opacity:.65;font-weight:500}
.main{flex:1;display:flex;flex-direction:column;justify-content:center}
h1{font-weight:600;font-size:96px;line-height:1.02;letter-spacing:-.035em}
p{margin-top:44px;font-size:38px;line-height:1.35;opacity:.72}
.foot{display:flex;justify-content:space-between;align-items:center;border-top:2px solid currentColor;padding-top:30px;font-size:28px;font-weight:500}
.btn{background:#B0532B;color:#fff;padding:16px 26px}
</style></head><body><div class="p"><div class="top"><div class="m"><i></i>Temperbyte</div><div class="r">%s</div></div>
<div class="main"><h1>%s</h1><p>%s</p></div><div class="foot"><span>temperbyte</span><span class="btn">%s</span></div></div></body></html>"""
out,tag,title,sub,btn=sys.argv[1:6]
dark=(sys.argv[6] if len(sys.argv)>6 else "dark")=="dark"
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(viewport={"width":W,"height":H})
    pg.set_content(HTML%(W,H,'#16181B' if dark else '#F2F0EB','#F2F0EB' if dark else '#16181B',tag,title,sub,btn)); pg.wait_for_timeout(150)
    pg.screenshot(path=out); b.close()
print(out)
