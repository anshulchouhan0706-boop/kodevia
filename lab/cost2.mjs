import { chromium } from 'playwright-core';
const variants = {
  baseline: '',
  noBlend: '.sc-grain{mix-blend-mode:normal!important}',
  noBackdrop: '.bar.is-solid,.tray{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}',
  noGrain: '.sc-grain{display:none!important}',
  allThree: '.sc-grain{display:none!important}.bar.is-solid,.tray{backdrop-filter:none!important}',
};
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--use-angle=gl', '--enable-gpu', '--ignore-gpu-blocklist'] });
for (const [name, css] of Object.entries(variants)) {
  for (const dpr of [1.5, 1.0]) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1.5 });
    await p.goto('http://localhost:4500/', { waitUntil: 'networkidle' });
    if (css) await p.addStyleTag({ content: css });
    await p.evaluate(d => { const S = window.__kodevia.S; S.renderer.setPixelRatio(d); S.renderer.setSize(innerWidth, innerHeight, false); }, dpr);
    await p.waitForTimeout(1000);
    const r = await p.evaluate(async () => { const frames = [];
      await new Promise(res => { let last = performance.now(); const t0 = last; const H = document.documentElement.scrollHeight * 0.4;
        const f = (n) => { frames.push(n - last); last = n; scrollTo(0, ((n - t0) / 5000) * H); if (n - t0 < 5000) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
      frames.sort((a, b) => a - b); return { p95: +frames[Math.floor(frames.length * .95)].toFixed(1), over20: frames.filter(x => x > 20).length, n: frames.length }; });
    console.log(name.padEnd(11), 'canvasDPR', dpr, JSON.stringify(r));
    await p.close();
  }
}
await b.close();
