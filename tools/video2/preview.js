// node preview.js v1.html out/prev.png t1 t2 ...  -> contact sheet (each frame 360x640)
const {chromium}=require('playwright');const path=require('path');const {execSync}=require('child_process');
(async()=>{const [f,out,...ts]=process.argv.slice(2);const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('console:',m.text()));
await p.goto('file://'+path.resolve(f));await p.waitForFunction(()=>window.ready,null,{timeout:180000});
const files=[];const t0=Date.now();for(const t of ts){await p.evaluate(t=>seek(t),+t);const fn=`/tmp/claude-0/pv_${t}.png`;await p.screenshot({path:fn});files.push(fn)}
console.log('ms/frame',(Date.now()-t0)/ts.length);await b.close();
const cols=Math.min(files.length,6);execSync(`python3 -c "
from PIL import Image,ImageDraw;import sys
fs=sys.argv[2:];cols=${cols};rows=(len(fs)+cols-1)//cols
im=Image.new('RGB',(cols*360,rows*660),'#000');d=ImageDraw.Draw(im)
for i,f in enumerate(fs):
  a=Image.open(f).convert('RGB').resize((360,640));im.paste(a,((i%cols)*360,(i//cols)*660));d.text(((i%cols)*360+8,(i//cols)*660+642),f.split('pv_')[1][:-4],fill='white')
im.save(sys.argv[1])" ${out} ${files.join(' ')}`)})();
