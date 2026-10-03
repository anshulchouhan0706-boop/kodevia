// node lab/peek.mjs <outdir> <W> <H> y1,y2,... (y in viewport-heights) [--reduced]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, W, H, ys] = process.argv.slice(2);
const reduced = process.argv.includes('--reduced');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: +W, height: +H }, reducedMotion: reduced ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
await ctx.addInitScript(() => { Element.prototype.requestPointerLock = () => {}; Element.prototype.setPointerCapture = () => {}; });
const page = await ctx.newPage();
const errs = [];
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('requestfailed', r => errs.push('failed: ' + r.url()));
await page.goto('http://localhost:4500/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const total = await page.evaluate(() => document.documentElement.scrollHeight / innerHeight);
console.log('page length (vh):', total.toFixed(2));
for (const v of ys.split(',')) {
  const yv = v === 'end' ? total : parseFloat(v);
  await page.evaluate(y => window.scrollTo(0, y * innerHeight), yv);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `${out}/y${String(v).padStart(5,'0')}.png` });
}
console.log(errs.length ? errs.join('\n') : 'no console errors');
await browser.close();
