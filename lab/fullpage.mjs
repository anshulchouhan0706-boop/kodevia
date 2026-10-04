import { chromium } from 'playwright-core';
const [path, out, W = '1440'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: +W, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => (m.type() === 'error' || m.type() === 'warning') && errs.push(m.text()));
p.on('response', r => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
await p.goto('http://localhost:4500/' + path, { waitUntil: 'networkidle' });
// walk down so lazy images load and reveals fire
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 500) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(900);
await p.screenshot({ path: out, fullPage: true });
console.log(path, 'height', H, errs.length ? '\n' + errs.join('\n') : 'clean');
await b.close();
