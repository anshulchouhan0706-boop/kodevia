// Renders every still on the site from the one scene. node lab/render-assets.mjs [only]
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const only = process.argv[2];
const types = { '.html':'text/html', '.js':'text/javascript' };
const srv = createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = srv.address().port;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const D = Math.PI / 180;
const jobs = {
  'k-mark':   { w: 256, h: 256, cfg: { hideFloor: true, cam: { pos: [0, 0.2, 13.5], fov: 24 } } },
  'k-poster': { w: 900, h: 900, cfg: { cam: { pos: [0, 0.55, 12] } } },
  'svc-web':  { w: 720, h: 540, cfg: { cam: { pos: [0.6, 4.6, 10.4], look: [0.3, -0.1, 0], fov: 30 },
      poses: [ { p: [-0.5, -0.95, 0.9], r: [0, 0.25, 90*D] }, { p: [0.35, 0.15, -0.3], r: [0, 0.25, 90*D] }, { p: [1.2, 1.25, -1.5], r: [0, 0.25, 90*D] } ] } },
  'svc-webapp': { w: 720, h: 540, cfg: { cam: { pos: [0, 1.4, 11], look: [0, -0.2, 0], fov: 28 },
      poses: [ { p: [-1.35, -0.1, 0], r: [0, 0, 0] }, { p: [0.75, 0.75, -0.2], r: [0, 0, 90*D] }, { p: [0.65, -0.82, 0.3], r: [0, 0, 90*D] } ] } },
  'svc-mobile': { w: 720, h: 540, cfg: { cam: { pos: [0, 0.6, 10.5], fov: 28 },
      poses: [ { p: [0, -0.1, 0.6], r: [0.12, -0.4, -0.12] }, { p: [-2.1, 0.9, -2.6], r: [0.4, 0.2, 0.9] }, { p: [2.2, -0.6, -2.2], r: [-0.3, 0.3, -0.7] } ] } },
  'svc-design': { w: 720, h: 540, cfg: { cam: { pos: [0, 0.8, 10.5], fov: 28 },
      poses: [ { p: [0, 0, 0], r: [0, 0, 45*D] }, { p: [0.05, 0.05, 0.6], r: [0, 0, -45*D] }, { p: [2.3, -0.7, -2.4], r: [0.5, 0.2, 0.2] } ] } },
  'og':       { w: 1200, h: 630, bg: '#0A0A0B', dpr: 1, cfg: { cam: { pos: [-1.6, 0.55, 12] } } },
  'touch':    { w: 180, h: 180, bg: '#16121F', dpr: 1, cfg: { hideFloor: true, cam: { pos: [0, 0.2, 14.5], fov: 24 } } },
  'band':     { w: 1600, h: 640, bg: '#0A0A0B', cfg: { cam: { pos: [0.2, 0.2, 4.3], look: [0.2, 0, 0], fov: 34 }, look: { floor: 0 },
      poses: [ { p: [-2.2, -0.7, -0.9], r: [0.2, 0.3, 1.05] }, { p: [-0.1, 0.55, 0.1], r: [-0.2, 0.2, -1.0] }, { p: [1.9, -0.75, -0.5], r: [0.1, -0.3, 1.25] } ] } },
};
for (const [name, j] of Object.entries(jobs)) {
  if (only && only !== name) continue;
  const dpr = j.dpr || 2;
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error(name, 'pageerror:', e.message));
  await page.goto(`http://localhost:${port}/lab/render.html?w=${j.w}&h=${j.h}&dpr=${dpr}`);
  await page.waitForFunction('window.ready === true');
  await page.evaluate(c => window.shot(c), j.cfg);
  await page.waitForTimeout(100);
  let data;
  if (j.bg) {
    data = await page.evaluate(bg => { const c = document.getElementById('c'); const o = document.createElement('canvas'); o.width = c.width; o.height = c.height; const g = o.getContext('2d'); g.fillStyle = bg; g.fillRect(0,0,o.width,o.height); g.drawImage(c,0,0); return o.toDataURL('image/png'); }, j.bg);
  } else data = await page.evaluate(() => document.getElementById('c').toDataURL('image/png'));
  fs.writeFileSync(path.join(root, 'lab', `raw-${name}.png`), Buffer.from(data.split(',')[1], 'base64'));
  console.log('rendered', name);
  await page.close();
}
await browser.close(); srv.close();
