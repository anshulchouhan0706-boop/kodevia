import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--disable-webgl','--disable-3d-apis'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
console.log('no-webgl class:', await p.evaluate(() => document.documentElement.classList.contains('no-webgl')));
await p.evaluate(() => scrollTo(0, innerHeight * 4.5)); await p.waitForTimeout(800);
await p.screenshot({ path: 'lab/nogl.png' });
// keyboard: tab order
await p.evaluate(() => scrollTo(0, 0));
const order = [];
for (let i = 0; i < 14; i++) { await p.keyboard.press('Tab'); order.push(await p.evaluate(() => { const a = document.activeElement; return (a.textContent || a.name || a.value || a.tagName).trim().replace(/\s+/g,' ').slice(0, 28); })); }
console.log('tab order:', order.join(' | '));
// brief carry-over: pick two on the rail, check chips
await p.click('[data-pick="Web apps"]'); await p.click('[data-pick="Mobile apps"]');
console.log('chips checked:', await p.evaluate(() => [...document.querySelectorAll('.brief input:checked')].map(i => i.value).join(', ')));
// submit with empty idea -> validation message; then with idea -> mailto url
let mailto = null; p.on('framenavigated', f => { if (f.url().startsWith('mailto')) mailto = f.url(); });
await p.evaluate(() => { window.__href = null; });
console.log('pageerrors:', errs.length ? errs : 'none');
await b.close();
