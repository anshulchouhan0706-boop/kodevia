// Render one still from the scene. Usage: node lab/still.mjs out.png W H 'json-config' [dpr]
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const [out, W, H, cfgJson, dpr = '1'] = process.argv.slice(2);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript' };
const srv = createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = srv.address().port;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: +W, height: +H } });
page.on('console', m => { if (m.type() === 'error') console.error('page:', m.text()); });
page.on('pageerror', e => console.error('pageerror:', e.message));
await page.goto(`http://localhost:${port}/lab/render.html?w=${W}&h=${H}&dpr=${dpr}`);
await page.waitForFunction('window.ready === true');
await page.evaluate(c => window.shot(JSON.parse(c)), cfgJson);
await page.waitForTimeout(150);
if (process.env.BG) { await page.evaluate(b => { document.body.style.background = b; }, process.env.BG); await page.screenshot({ path: out }); }
else { const data = await page.evaluate(() => document.getElementById('c').toDataURL('image/png'));
fs.writeFileSync(out, Buffer.from(data.split(',')[1], 'base64')); }
await browser.close(); srv.close();
console.log('wrote', out);
