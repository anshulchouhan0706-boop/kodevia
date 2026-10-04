import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const errs = [];
let p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:4500/work/apps.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(900);
await p.click('.bar .demo__btn'); await p.waitForTimeout(500); await p.screenshot({ path: 'lab/r5-apps.png' });
await p.close();
p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
await p.screenshot({ path: 'lab/r5-m0.png' });
for (const [sel, n] of [['#work', 'work'], ['.tools', 'tools'], ['#process', 'proc']]) {
  await p.evaluate(s => { const e = document.querySelector(s); scrollTo(0, e.getBoundingClientRect().top + scrollY - 70); }, sel); await p.waitForTimeout(1300);
  await p.screenshot({ path: `lab/r5-m-${n}.png` });
}
await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(1500);
await p.tap('#start .demo__btn'); await p.waitForTimeout(500); await p.screenshot({ path: 'lab/r5-m-close.png' });
console.log(errs.length ? errs.join('\n') : 'clean');
await b.close();
