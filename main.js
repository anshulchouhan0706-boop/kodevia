/* Kodevia page choreography. Bespoke to this page; the scrollcraft engine is
   untouched and still drives every data-sc-* device. This file owns:
   - the live 3D mark (one fixed WebGL canvas) across hero, pieces, assembly
     and close,
   - the leader-line tags, laid out beside the mark so they never overlap it,
   - the pointer tug on the finished mark,
   - the brief: services picked on the rail carry into the close form,
   - small interactions: brief tray, card spotlight, FAQ.

   Performance rules this file keeps:
   - one rAF loop for the scene; it sleeps when nothing is on screen,
   - smoothing is time-based (exponential), so a dropped frame never shows as
     a jump,
   - CSS variables are written to the element that uses them, never to :root,
     and only when the value actually changed,
   - quality steps down automatically on a slow GPU. */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a, b, t) => a + (b - a) * t;
const span = (x, a, b) => clamp01((x - a) / (b - a));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// Dock: arrives fast, overshoots a touch, settles. Reads as a click into place.
const dock = (t) => { if (t <= 0) return 0; if (t >= 1) return 1; const c = 1.35; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const damp = (dt, rate) => 1 - Math.exp(-rate * dt);

/* Write a style property only when it changed enough to matter. */
const lastVar = new WeakMap();
function setVar(el, name, v, digits = 3) {
  const s = v.toFixed(digits);
  let m = lastVar.get(el);
  if (!m) { m = {}; lastVar.set(el, m); }
  if (m[name] === s) return;
  m[name] = s;
  el.style.setProperty(name, s);
}

/* ---------------------------------------------------------------- brief -- */
(function brief() {
  const picks = [...document.querySelectorAll('[data-pick]')];
  const chips = [...document.querySelectorAll('.brief input[name="need"]')];
  const tray = document.querySelector('.tray');
  const trayText = tray && tray.querySelector('.tray__text');
  let chosen = new Set();
  try { chosen = new Set(JSON.parse(sessionStorage.getItem('kodevia-brief') || '[]')); } catch (e) { /* storage blocked */ }
  const sync = () => {
    picks.forEach((b) => {
      const on = chosen.has(b.dataset.pick);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      const card = b.closest('.svc');
      if (card) card.classList.toggle('is-picked', on);
    });
    chips.forEach((c) => { c.checked = chosen.has(c.value); });
    if (tray) {
      const n = chosen.size;
      tray.classList.toggle('is-on', n > 0);
      tray.hidden = n === 0;
      tray.setAttribute('aria-label', 'Review your brief');
      trayText.textContent = n === 1 ? '1 service in your brief' : n + ' services in your brief';
    }
    try { sessionStorage.setItem('kodevia-brief', JSON.stringify([...chosen])); } catch (e) { /* storage blocked */ }
  };
  picks.forEach((b) => b.addEventListener('click', () => {
    const v = b.dataset.pick;
    chosen.has(v) ? chosen.delete(v) : chosen.add(v);
    sync();
    b.classList.remove('is-pop'); void b.offsetWidth; b.classList.add('is-pop');
  }));
  chips.forEach((c) => c.addEventListener('change', () => {
    c.checked ? chosen.add(c.value) : chosen.delete(c.value);
    sync();
  }));
  sync();
  // The tray steps aside once the brief itself is on screen.
  if (tray) new IntersectionObserver(([e]) => tray.classList.toggle('is-away', e.isIntersecting), { threshold: 0.3 })
    .observe(document.getElementById('start'));

  const form = document.getElementById('brief');
  const note = document.getElementById('brief-note');
  const to = form.getAttribute('action').replace(/^mailto:/, '');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const idea = form.idea.value.trim();
    if (!idea) { form.idea.focus(); note.textContent = 'Add a line about what you are building first.'; return; }
    const needs = [...chosen];
    const body = [
      'What we need: ' + (needs.length ? needs.join(', ') : 'Not sure yet'),
      '',
      'What we are building:',
      idea,
    ].join('\n');
    const subject = 'New project' + (needs.length ? ': ' + needs.join(', ') : '');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    note.textContent = 'Your email app should open with the brief. Send it from there and we will reply.';
  });
})();

/* ------------------------------------------------------ small interactions -- */
// Card spotlight: a soft light follows the pointer across each surface.
if (fine.matches && !reduce) {
  document.querySelectorAll('[data-glow]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      setVar(el, '--gx', ((e.clientX - r.left) / r.width) * 100, 1);
      setVar(el, '--gy', ((e.clientY - r.top) / r.height) * 100, 1);
    }, { passive: true });
  });
}

// FAQ: animate the panel closed before <details> drops it; opening is CSS.
document.querySelectorAll('.faq details').forEach((d) => {
  const sum = d.querySelector('summary');
  sum.addEventListener('click', (e) => {
    if (reduce || !d.open) return;
    e.preventDefault();
    d.classList.add('is-closing');
    setTimeout(() => { d.open = false; d.classList.remove('is-closing'); }, 260);
  });
});

// Keyboard focus. Two cases the engine does not cover:
// - focus inside the sideways rail: scroll the page to the point where the
//   rail has carried that card to the middle of the screen;
// - focus inside a block still waiting for its entrance: reveal it now, so a
//   keyboard user never lands on something at opacity 0.
document.addEventListener('focusin', (e) => {
  const el = e.target;
  if (!(el instanceof Element)) return;
  const pending = el.closest('[data-sc-in]:not(.sc-in)');
  if (pending) {
    pending.classList.add('sc-in');
    [...pending.children].forEach((k) => k.classList.add('sc-in'));
  }
  const card = el.closest('.rail > *');
  if (card) {
    const act = card.closest('[data-sc-act="pan"]');
    const rail = card.parentElement;
    const over = rail.scrollWidth - innerWidth;
    if (over <= 0) return;
    const want = Math.min(Math.max(card.offsetLeft + card.offsetWidth / 2 - innerWidth / 2, 0), over);
    const top = act.getBoundingClientRect().top + scrollY;
    const travel = act.offsetHeight - innerHeight;
    scrollTo({ top: top + (want / (over * (1 + (parseFloat(rail.dataset.scPan) || 0)))) * travel, behavior: 'instant' });
  }
});

// Rail settle: cards arrive in sequence while the rail travels. Runs only
// while the rail is on screen.
(function railSettle() {
  if (reduce) return;
  const act = document.getElementById('services');
  const cards = [...act.querySelectorAll('.svc')];
  let on = false;
  new IntersectionObserver(([e]) => {
    on = e.isIntersecting;
    if (on) requestAnimationFrame(tick);
  }).observe(act);
  function tick() {
    if (!on) return;
    const w = innerWidth;
    for (const c of cards) {
      const left = c.getBoundingClientRect().left;
      setVar(c, '--settle', easeOut(clamp01((w * 1.02 - left) / (w * 0.32))));
    }
    requestAnimationFrame(tick);
  }
})();

/* --------------------------------------------------------------- scene -- */
function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

const els = {
  hero: document.getElementById('top'),
  pieces: document.querySelector('.pieces'),
  asm: document.getElementById('assemble'),
  start: document.getElementById('start'),
  tags: [...document.querySelectorAll('.tag')],
  lines: [...document.querySelectorAll('.leaders line')],
  dots: [...document.querySelectorAll('.leaders circle')],
  list: [...document.querySelectorAll('.assemble__list li')],
  listEl: document.querySelector('.assemble__list'),
  far: document.querySelector('.far'),
  scene: document.querySelector('.scene'),
  tagLayer: document.querySelector('.tags'),
  near: document.querySelector('.near'),
};

const geo = {};
function measure() {
  const y = scrollY;
  for (const k of ['hero', 'pieces', 'asm', 'start']) {
    const r = els[k].getBoundingClientRect();
    geo[k] = { top: r.top + y, h: r.height };
  }
  geo.vh = innerHeight; geo.vw = innerWidth;
  geo.tagW = els.tags.map((t) => t.offsetWidth);
  geo.tagH = els.tags.map((t) => t.offsetHeight);
}

const pinned = (g, y) => clamp01((y - g.top) / Math.max(g.h - geo.vh, 1));
const flowP = (g, y) => clamp01((y + geo.vh - g.top) / (g.h + geo.vh));

/* Everything the frame needs, as a pure function of scroll. */
function target(y) {
  const vh = geo.vh;
  const mobile = geo.vw <= 860;
  const pH = pinned(geo.hero, y);
  const pP = flowP(geo.pieces, y);
  const pA = pinned(geo.asm, y);
  const asmUnpin = geo.asm.top + geo.asm.h - vh;
  const startPin = geo.start.top;

  const o = { t: [0, 0, 0], spread: 1, rig: {}, look: {}, sceneO: 1, slidePx: 0, pA, pH, pP, phase: 'hero' };

  // Composition anchors. Desktop: subject right of the copy. Phone: subject
  // in the upper half, copy underneath.
  const X = mobile ? 0 : 1.75;
  const Y = mobile ? 1.15 : 0.15;
  const S = mobile ? 0.46 : 1;

  if (y < geo.asm.top) {
    // Hero, then the quiet pieces beat: the parts drift apart and dim.
    const quiet = easeInOut(span(pP, 0.12, 0.62));
    o.spread = 1 + pH * 0.3 + quiet * 0.3;
    o.rig = {
      x: lerp(X, mobile ? 0 : 0.7, quiet), y: lerp(Y, mobile ? 0.9 : 0.25, quiet),
      ry: pH * 0.9 + quiet * 0.4, rx: pH * -0.15, scale: S * lerp(1 + pH * 0.08, 0.8, quiet),
    };
    o.look = { floor: lerp(0.45, 0, quiet), dim: quiet * 0.85 };
    o.sceneO = 1 - quiet * 0.6;
  } else {
    // The peak. Pieces dock one at a time, with a pulse as each lands. The
    // mark sits near the centre while the tags are out, so both columns have
    // room, then moves right for the closing line.
    const w = [[0.06, 0.3], [0.3, 0.54], [0.54, 0.78]];
    o.t = w.map(([a, b]) => dock(span(pA, a, b)));
    o.spread = lerp(1.5, 1.35, span(pA, 0, 0.1));
    const wake = easeOut(span(pA, 0, 0.12));
    const settle = easeInOut(span(pA, 0.8, 0.92));
    o.rig = {
      x: mobile ? 0 : lerp(0.35, 1.75, settle),
      y: mobile ? lerp(0.9, 1.45, settle) : lerp(0.2, 0.15, settle),
      ry: lerp(0.55, -0.12, easeInOut(span(pA, 0.04, 0.9))),
      rx: 0, scale: (mobile ? lerp(0.62, 0.5, settle) : 0.86 * lerp(1, 1.16, settle)),
    };
    const pulses = w.map(([, b]) => Math.max(0, 1 - Math.abs(pA - b) / 0.05) * 0.5);
    const big = Math.max(0, 1 - Math.abs(pA - 0.86) / 0.07);
    o.look = { floor: lerp(0, 1, span(pA, 0.5, 0.86)), dim: lerp(0.85, 0, wake), pulse: Math.max(big, ...pulses) };
    o.sceneO = lerp(0.4, 1, wake);
    o.phase = 'asm';
    if (y > asmUnpin) {
      // The stage slides off after the pin; the mark leaves with it and fades.
      o.slidePx = y - asmUnpin;
      o.sceneO = 1 - span(o.slidePx, vh * 0.15, vh * 0.75);
    }
    if (y > startPin - vh) {
      // The close: the finished mark returns, resting beside the brief.
      const into = startPin - y;
      const k = 1 - span(into, 0, vh * 0.9);
      const short = vh < 700;
      o.t = [1, 1, 1]; o.spread = 1;
      o.rig = {
        x: mobile ? 0 : 2.1, y: mobile ? (short ? 2.2 : 1.95) : 0.05,
        ry: -0.2 + (1 - k) * 0.3, rx: 0, scale: mobile ? (short ? 0.24 : 0.3) : 0.92,
      };
      o.look = { floor: 0.8, dim: 0, pulse: 0 };
      o.slidePx = -Math.max(0, into);
      o.sceneO = easeOut(k);
      o.phase = 'start';
    }
  }
  return o;
}

async function boot() {
  const root = document.documentElement;
  if (!hasWebGL()) { root.classList.add('no-webgl', 'tags-compact'); return; }
  let mod;
  try { mod = await import('./kscene.js'); } catch (e) { root.classList.add('no-webgl', 'tags-compact'); return; }
  const { createScene, SCATTER_POSE } = mod;
  const canvas = document.getElementById('k');
  let S;
  try { S = createScene(canvas, { maxDpr: 1.5 }); } catch (e) { root.classList.add('no-webgl', 'tags-compact'); return; }
  const THREE = S.THREE;

  const scatter = SCATTER_POSE.map((s) => ({ p: s.p.clone(), q: s.q.clone() }));
  const scaled = SCATTER_POSE.map((s) => ({ p: s.p.clone(), q: s.q.clone() }));
  const tumbleQ = new THREE.Quaternion();
  const tumbleE = new THREE.Euler();
  const outward = S.pieces.map((pc) => pc.k.p.clone().setZ(0.4).normalize());
  const desired = new THREE.Vector3();

  const size = () => { measure(); S.resize(innerWidth, innerHeight); compact = null; wake(); };
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 120); });
  if (document.fonts) document.fonts.ready.then(() => setTimeout(size, 50));
  setTimeout(size, 400);

  // Pointer, normalised. Fine pointers only.
  const ptr = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999, active: false };
  if (fine.matches && !reduce) {
    addEventListener('pointermove', (e) => {
      ptr.tx = (e.clientX / innerWidth) * 2 - 1;
      ptr.ty = (e.clientY / innerHeight) * 2 - 1;
      ptr.px = e.clientX; ptr.py = e.clientY; ptr.active = true;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { ptr.active = false; ptr.tx = 0; ptr.ty = 0; });
  }

  const cur = { t: [0, 0, 0], spread: 1, x: 0, y: 0, ry: 0, rx: 0, scale: 1, floor: 0.45, dim: 0, pulse: 0 };
  let first = true;
  const wpp = () => (2 * Math.tan((S.camera.fov * Math.PI) / 360) * S.camera.position.z) / geo.vh;

  // Adaptive quality: watch real frame times and step down on a slow GPU.
  let quality = 0, slow = 0;
  function watch(dt) {
    if (dt > 0.1) return; // tab switch or stall, not a signal
    if (dt > 1 / 45) slow++; else slow = Math.max(0, slow - 1);
    if (slow > 40 && quality < 2) { quality++; slow = 0; S.setQuality(quality, innerWidth, innerHeight); }
  }

  let running = false, last = 0;
  const clock = performance.now();
  function wake() {
    if (running || document.hidden) return;
    running = true; last = performance.now();
    requestAnimationFrame(frame);
  }
  addEventListener('scroll', wake, { passive: true });
  addEventListener('pointermove', wake, { passive: true });
  document.addEventListener('visibilitychange', wake);

  function frame(now) {
    if (document.hidden) { running = false; return; }
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
    last = now;
    const y = scrollY;
    const tg = target(y);
    const a = first || reduce ? 1 : damp(dt, 7.5);
    first = false;
    for (let i = 0; i < 3; i++) cur.t[i] = lerp(cur.t[i], tg.t[i], a);
    cur.spread = lerp(cur.spread, tg.spread, a);
    cur.x = lerp(cur.x, tg.rig.x, a); cur.y = lerp(cur.y, tg.rig.y, a);
    cur.ry = lerp(cur.ry, tg.rig.ry, a); cur.rx = lerp(cur.rx, tg.rig.rx || 0, a);
    cur.scale = lerp(cur.scale, tg.rig.scale, a);
    cur.floor = lerp(cur.floor, tg.look.floor || 0, a);
    cur.dim = lerp(cur.dim, tg.look.dim || 0, a);
    cur.pulse = lerp(cur.pulse, tg.look.pulse || 0, Math.max(a, damp(dt, 14)));
    const pa = damp(dt, 4);
    ptr.x = lerp(ptr.x, ptr.tx, pa); ptr.y = lerp(ptr.y, ptr.ty, pa);

    setVar(els.scene, '--scene-o', tg.sceneO);
    setVar(els.far, '--scene-o', tg.sceneO);
    setVar(els.far, '--mx', ptr.x);
    setVar(els.far, '--far-y', -(Math.min(y, geo.asm.top) * 0.08), 0);
    setVar(els.near, '--mx', ptr.x);
    setVar(els.near, '--my', ptr.y);

    if (tg.sceneO <= 0.002) {
      // Nothing of the scene on screen: hide the tags and go to sleep until
      // the next scroll or pointer event wakes the loop.
      els.tagLayer.style.visibility = 'hidden';
      running = false;
      return;
    }
    els.tagLayer.style.visibility = '';
    requestAnimationFrame(frame);
    watch(dt);

    const time = (now - clock) / 1000;
    const loose = reduce ? 0 : 1;
    const intro = reduce ? 1 : easeOut(clamp01((now - clock - 150) / 1900));
    for (let i = 0; i < 3; i++) {
      const s = scatter[i];
      const free = 1 - cur.t[i];
      scaled[i].p.copy(s.p).multiplyScalar(cur.spread * lerp(2.6, 1, intro));
      scaled[i].p.z += (1 - intro) * -7;
      scaled[i].p.y += Math.sin(time * 0.9 + i * 2.1) * 0.22 * free * loose;
      scaled[i].p.x += Math.cos(time * 0.7 + i * 1.3) * 0.12 * free * loose;
      // depth parallax: nearer pieces follow the pointer further
      const depth = 0.25 + (s.p.z + 2) * 0.12;
      scaled[i].p.x += ptr.x * depth * free * loose;
      scaled[i].p.y -= ptr.y * depth * 0.7 * free * loose;
      tumbleQ.setFromEuler(tumbleE.set(
        (time * 0.22 + i) * free * loose + (1 - intro) * 2.5,
        (time * 0.31 + i * 2) * free * loose,
        Math.sin(time * 0.4 + i) * 0.25 * free * loose));
      scaled[i].q.copy(s.q).multiply(tumbleQ);
    }

    // Tug: once whole, the pieces part away from a nearby pointer and spring
    // back into exact lockup. The spring is integrated per second.
    const whole = Math.min(cur.t[0], cur.t[1], cur.t[2]);
    const tugOn = ptr.active && whole > 0.98 && !reduce;
    let pull = 0;
    if (tugOn) {
      const c = S.projectCenter(innerWidth, innerHeight);
      const reach = Math.min(innerWidth, innerHeight) * 0.32;
      pull = (1 - clamp01(Math.hypot(ptr.px - c.x, ptr.py - c.y) / reach)) * 0.55;
    }
    const k = dt * 60;
    S.pieces.forEach((pc, i) => {
      desired.copy(outward[i]).multiplyScalar(pull).sub(pc.offset).multiplyScalar(0.09 * k);
      pc.vel.add(desired).multiplyScalar(Math.pow(0.78, k));
      pc.offset.addScaledVector(pc.vel, k);
    });

    S.setPieces(cur.t, scaled);
    const lean = reduce ? 0 : 1;
    S.setRig({
      x: cur.x, y: cur.y + tg.slidePx * wpp() + Math.sin(time * 1.1) * 0.07 * whole * loose, z: 0,
      ry: cur.ry + ptr.x * 0.32 * lean + Math.sin(time * 0.5) * 0.12 * loose,
      rx: cur.rx + ptr.y * 0.14 * lean + Math.sin(time * 0.7) * 0.03 * loose, scale: cur.scale,
    });
    S.key.position.set(loose ? Math.sin(time * 0.35) * 6 : -4, 6 + Math.cos(time * 0.5) * 1.2 * loose, 6);
    S.setLook({ floor: cur.floor, dim: cur.dim, pulse: cur.pulse });
    S.render();
    tags(tg);
  }

  // Leader tags: set in columns either side of the mark's screen box, with a
  // line drawn out to the tip of each piece. They never sit on the mark. If
  // either column has no room, the plain list inside the stage is used.
  const tagSide = ['left', 'right', 'right'];
  const win = [[0.04, 0.3], [0.28, 0.54], [0.52, 0.78]];
  let compact = null;
  function tags(tg) {
    const pA = tg.phase === 'asm' ? tg.pA : 0;
    const out = 1 - span(pA, 0.76, 0.82);
    const W = innerWidth, H = innerHeight;
    const box = S.markBox(W, H);
    const gap = 64, edge = Math.max(24, W * 0.03);
    const fitL = box.l - gap - geo.tagW[0] >= edge;
    const fitR = box.r + gap + Math.max(geo.tagW[1], geo.tagW[2]) <= W - edge;
    // Decide the layout from the assembly position only (the hero position
    // is irrelevant), then hold it for the rest of the pass so it never flips
    // mid-animation.
    const isCompact = W <= 860 || !(fitL && fitR);
    if (compact === null) { compact = W <= 860; root.classList.toggle('tags-compact', compact); }
    if (tg.phase === 'asm' && pA > 0.02 && pA < 0.06 && isCompact !== compact) {
      compact = isCompact; root.classList.toggle('tags-compact', compact);
    }
    let webY = -Infinity;
    els.tags.forEach((el, i) => {
      const [a, b] = win[i];
      const on = compact ? 0 : span(pA, a + 0.02, a + (b - a) * 0.6) * out;
      setVar(el, 'opacity', on);
      setVar(els.lines[i], 'opacity', on);
      setVar(els.dots[i], 'opacity', on);
      if (on <= 0.001) return;
      const tip = S.project(i, W, H);
      const tw = geo.tagW[i], th = geo.tagH[i];
      let ty = Math.min(Math.max(tip.y - th * 0.4, box.t), box.b - th);
      if (i === 1) webY = ty;
      if (i === 2) ty = Math.max(ty, webY + geo.tagH[1] + 28);
      const tx = tagSide[i] === 'left' ? box.l - gap - tw : box.r + gap;
      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
      const ax = tagSide[i] === 'left' ? tx + tw + 12 : tx - 12;
      const ay = ty + 18;
      const prog = easeOut(on);
      const ln = els.lines[i];
      ln.setAttribute('x1', ax.toFixed(1)); ln.setAttribute('y1', ay.toFixed(1));
      ln.setAttribute('x2', lerp(ax, tip.x, prog).toFixed(1)); ln.setAttribute('y2', lerp(ay, tip.y, prog).toFixed(1));
      els.dots[i].setAttribute('cx', tip.x.toFixed(1)); els.dots[i].setAttribute('cy', tip.y.toFixed(1));
    });
    // The list (phones and narrow screens) leaves before the closing line.
    if (els.listEl) setVar(els.listEl, 'opacity', tg.phase === 'asm' ? out : 0);
    els.list.forEach((li, i) => {
      const [a, b] = win[i];
      const on = tg.phase === 'asm' ? span(pA, a, a + (b - a) * 0.5) * out : 0;
      setVar(li, '--o', on);
    });
  }

  measure(); S.resize(innerWidth, innerHeight);
  wake();
  // Exposed for the verification harness only.
  window.__kodevia = { S, target, geo, quality: () => quality };
}

boot();
