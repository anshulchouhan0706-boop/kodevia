import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4500/#start', { waitUntil: 'networkidle' });
await p.evaluate(() => { scrollTo(0, document.documentElement.scrollHeight); });
await p.waitForTimeout(600);
// capture the mailto without leaving the page
await p.evaluate(() => { const d = Object.getOwnPropertyDescriptor(Location.prototype, 'href'); });
await p.route('**/*', r => r.continue());
await p.click('.chip:has-text("Websites")');
await p.click('#brief button[type=submit]');
console.log('empty submit note:', await p.textContent('#brief-note'));
await p.fill('textarea[name=idea]', 'A booking app for our clinics');
const req = p.waitForEvent('request', { predicate: r => r.url().startsWith('mailto'), timeout: 2000 }).catch(() => null);
const nav = await p.evaluate(() => new Promise(res => { const orig = HTMLFormElement.prototype.submit; addEventListener('beforeunload', () => {}); const f = document.getElementById('brief'); const o = Object.getOwnPropertyDescriptor(window, 'location'); f.requestSubmit(); res(document.getElementById('brief-note').textContent); }));
console.log('after submit note:', nav);
await b.close();
