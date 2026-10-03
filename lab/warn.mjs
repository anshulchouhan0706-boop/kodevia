import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const msgs = []; p.on('console', m => { if (m.type() !== 'log') msgs.push(m.type() + ': ' + m.text()); });
const reqs = []; p.on('response', r => reqs.push(r.status() + ' ' + r.url().replace('http://localhost:4500','')));
await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' });
for (let i = 1; i <= 12; i++) { await p.evaluate(v => scrollTo(0, v * innerHeight), i); await p.waitForTimeout(250); }
await p.waitForTimeout(800);
console.log(msgs.join('\n') || 'no warnings/errors');
console.log(reqs.join('\n'));
await b.close();
