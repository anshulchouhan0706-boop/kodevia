import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
for (const [w,h] of [[1440,900],[1280,720],[1920,1080],[390,844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  const r = await p.evaluate(async () => {
    const act = document.getElementById('services'); const rail = act.querySelector('.rail');
    const top = act.getBoundingClientRect().top + scrollY;
    scrollTo(0, top + act.offsetHeight - innerHeight - 2); await new Promise(r => setTimeout(r, 500));
    const end = rail.querySelector('.rail__end').getBoundingClientRect();
    return { overflow: rail.scrollWidth - innerWidth, endRight: Math.round(end.right), vw: innerWidth, transform: getComputedStyle(rail).transform };
  });
  console.log(w, JSON.stringify(r));
  await p.close();
}
await b.close();
