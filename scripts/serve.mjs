import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const port=Number(process.env.PORT||4175);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid port');
const server=createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'}).end();return;}
  try{
    const pathname=new URL(req.url,'http://127.0.0.1').pathname;
    const file=['/','/preview.html'].includes(pathname)?'preview.html':/^\/assets\/(?:notebook(?:-motion)?(?:-mobile)?|book-[a-z]+(?:-mobile)?|tool-\d+)\.svg$/.test(pathname)?pathname.slice(1):null;
    if(!file){res.writeHead(404).end('Not found');return;}
    const bytes=await readFile(path.join(root,file));
    res.writeHead(200,{'Content-Type':file.endsWith('.svg')?'image/svg+xml; charset=utf-8':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}).end(req.method==='HEAD'?undefined:bytes);
  }catch(error){res.writeHead(error.code==='ENOENT'?404:500).end('Preview unavailable');}
});
server.on('error',error=>{console.error(error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Profile preview: http://127.0.0.1:${port} (Ctrl+C to stop)`));
