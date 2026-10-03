import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
const y = await p.evaluate(() => { const a = document.getElementById('services'); return a.getBoundingClientRect().top + scrollY + a.offsetHeight - innerHeight - 4; });
await p.mouse.wheel(0, 10); await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(900);
console.log(await p.evaluate(() => { const r = document.querySelector('.rail'); return { t: r.style.transform, end: Math.round(r.querySelector('.rail__end').getBoundingClientRect().right), vw: innerWidth }; }));
await p.screenshot({ path: 'lab/rail-end.png' });
await b.close();
