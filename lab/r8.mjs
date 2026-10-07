import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
await p.click('.hero .demo__btn'); await p.waitForTimeout(700); await p.screenshot({ path: 'lab/r8-demo.png', clip: { x: 0, y: 520, width: 760, height: 380 } });
await p.mouse.click(5, 5);
await p.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })); await p.waitForTimeout(1500);
await p.screenshot({ path: 'lab/r8-foot.png' });
await b.close();
