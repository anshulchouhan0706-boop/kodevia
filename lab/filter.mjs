import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500/blog/', { waitUntil: 'networkidle' });
await p.click('[data-filter="Technology"]'); await p.waitForTimeout(500);
console.log('Technology shows:', await p.evaluate(() => [...document.querySelectorAll('.blog-list [data-tag]')].filter(e => !e.hidden).map(e => e.querySelector('strong').textContent)));
await p.click('[data-filter="all"]'); await p.waitForTimeout(300);
console.log('All shows:', await p.evaluate(() => [...document.querySelectorAll('.blog-list [data-tag]')].filter(e => !e.hidden).length));
await b.close();
