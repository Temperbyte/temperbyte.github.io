// node render.js v1.html [workers] [from] [to]  -> frames/v1/00000.jpg ... + frames/v1/meta.json
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const f=process.argv[2];const name=path.basename(f,'.html');const workers=+(process.argv[3]||4);
const dir=path.join(__dirname,'frames',name);fs.mkdirSync(dir,{recursive:true});
const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
const open=async()=>{const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('console:',m.text())});
await p.goto('file://'+path.resolve(f));await p.waitForFunction(()=>window.ready,null,{timeout:180000});return p};
const p0=await open();const meta=await p0.evaluate(()=>({duration:DURATION,fps:window.FPS||30,sfx:window.SFX||[],music:window.MUSIC||{}}));
fs.writeFileSync(path.join(dir,'meta.json'),JSON.stringify(meta));
const n=Math.round(meta.duration*meta.fps);const from=+(process.argv[4]||0),to=+(process.argv[5]||n);
const pages=[p0];for(let i=1;i<workers;i++)pages.push(await open());
let next=from,done=0;const t0=Date.now();
await Promise.all(pages.map(async p=>{while(next<to){const i=next++;await p.evaluate(t=>seek(t),i/meta.fps);
await p.screenshot({path:path.join(dir,String(i).padStart(5,'0')+'.jpg'),type:'jpeg',quality:93});
if(++done%30==0)console.log(name,done,'/',to-from,((Date.now()-t0)/done).toFixed(0),'ms/frame')}}));
await b.close();console.log('done',name,n)})();
