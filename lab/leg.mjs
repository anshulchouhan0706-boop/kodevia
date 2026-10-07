import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
const frames = [['asm-end', '#assemble', -2.45], ['close', '#start', 0]];
for (const [n, sel, off] of frames) {
  await p.evaluate(([s, o]) => { const e = document.querySelector(s); scrollTo({ top: e.getBoundingClientRect().top + scrollY - innerHeight * o, behavior: 'instant' }); }, [sel, off]);
  for (const t of [0, 1500, 3000]) { await p.waitForTimeout(t ? 1500 : 1800); await p.screenshot({ path: `lab/leg-${n}-${t}.png` }); }
}
await b.close();
