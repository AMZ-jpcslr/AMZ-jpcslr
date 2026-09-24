import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = Number(process.env.PORT || 4175);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535.');
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, {Allow:'GET, HEAD'}).end();
    return;
  }
  try {
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
    const file = pathname === '/' || pathname === '/preview.html' ? 'preview.html'
      : /^\/assets\/(?:terminal(?:-mobile)?|skill-\d+)-(?:dark|light)\.svg$/.test(pathname) ? pathname.slice(1) : null;
    if (!file) { response.writeHead(404).end('Not found'); return; }
    const content = await readFile(path.join(root, file));
    response.writeHead(200, {
      'Content-Type': file.endsWith('.svg') ? 'image/svg+xml; charset=utf-8' : 'text/html; charset=utf-8',
      'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Preview unavailable. Run npm run build first.');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Profile preview: http://127.0.0.1:${port}\nStop with Ctrl+C.`));
