/* Kodevia page choreography. Bespoke to this page; the scrollcraft engine is
   untouched and still drives every data-sc-* device. This file owns:
   - the live 3D mark (one fixed WebGL canvas) across hero, pieces, assembly
     and close,
   - the leader-line tags, laid out beside the mark so they never overlap it,
   - the pointer tug on the finished mark,
   - the Book a free demo popovers (call, WhatsApp, email),
   - small interactions: work preview, timeline, card spotlight, FAQ.

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

/* ---------------------------------------------------------------- demo -- */
// Every "Book a free demo" button opens the same three options: call,
// WhatsApp, email. Contact details live on <body> as data attributes.
(function demo() {
  const { phone, whatsapp, email } = document.body.dataset;
  const msg = 'Hi Kodevia, I would like to book a free demo.';
  const boxes = [...document.querySelectorAll('[data-demo]')];
  const close = (box, focus) => {
    if (!box.classList.contains('is-open')) return;
    box.classList.remove('is-open');
    box.querySelector('.demo__btn').setAttribute('aria-expanded', 'false');
    if (focus) box.querySelector('.demo__btn').focus();
  };
  boxes.forEach((box) => {
    const btn = box.querySelector('.demo__btn');
    const opts = [...box.querySelectorAll('.demo__opt')];
    box.querySelector('[data-kind="call"]').href = 'tel:' + phone;
    box.querySelector('[data-kind="whatsapp"]').href = 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(msg);
    box.querySelector('[data-kind="email"]').href = 'mailto:' + email + '?subject=' + encodeURIComponent('Free demo request') + '&body=' + encodeURIComponent(msg);
    box.classList.add('is-ready');
    btn.setAttribute('role', 'button');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !box.classList.contains('is-open');
      boxes.forEach((o) => o !== box && close(o));
      box.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    box.addEventListener('keydown', (e) => {
      const i = opts.indexOf(document.activeElement);
      if (e.key === 'Escape') close(box, true);
      else if (e.key === 'ArrowDown' && box.classList.contains('is-open')) { e.preventDefault(); (opts[i + 1] || opts[0]).focus(); }
      else if (e.key === 'ArrowUp' && box.classList.contains('is-open')) { e.preventDefault(); (opts[i - 1] || opts[opts.length - 1]).focus(); }
    });
    box.addEventListener('focusout', (e) => { if (!box.contains(e.relatedTarget)) close(box); });
  });
  document.addEventListener('click', (e) => boxes.forEach((b) => !b.contains(e.target) && close(b)));
})();

/* ---------------------------------------------------------------- work -- */
// Our work: hovering or focusing a category swaps the preview stage. Until
// the visitor touches it, the stage turns over on its own, slowly.
(function work() {
  const rows = [...document.querySelectorAll('.wrow')];
  const scenes = [...document.querySelectorAll('.wscene')];
  if (!rows.length) return;
  let i = 0, held = false;
  const show = (k) => {
    i = k;
    rows.forEach((r, j) => r.classList.toggle('is-on', j === k));
    scenes.forEach((sc) => sc.classList.toggle('is-on', sc.dataset.scene === rows[k].dataset.show));
  };
  rows.forEach((r, k) => {
    r.addEventListener('pointerenter', () => { held = true; show(k); });
    r.addEventListener('focus', () => { held = true; show(k); });
  });
  document.querySelector('.wlist').addEventListener('pointerleave', () => { held = false; });
  if (!reduce) setInterval(() => { if (!held && !document.hidden) show((i + 1) % rows.length); }, 3600);
})();

// Process timeline: the track fills as the section passes; each stage lights
// when the fill reaches it.
(function timeline() {
  const tl = document.querySelector('.tl');
  if (!tl) return;
  const steps = [...tl.querySelectorAll('.tl__step')];
  let on = false;
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) requestAnimationFrame(tick); }).observe(tl);
  function tick() {
    if (!on) return;
    const r = tl.getBoundingClientRect();
    const p = reduce ? 1 : clamp01((innerHeight * 0.82 - r.top) / (innerHeight * 0.55));
    setVar(tl, '--fill', p);
    steps.forEach((st, k) => st.classList.toggle('is-lit', p >= k / (steps.length - 1) - 0.02));
    requestAnimationFrame(tick);
  }
})();

// Header: transparent over the hero, a clean solid bar once the page moves,
// instead of a dark gradient that slid over content.
(function bar() {
  const bar = document.querySelector('.bar');
  let on = null;
  const check = () => { const v = scrollY > 24; if (v !== on) { on = v; bar.classList.toggle('is-solid', v); } };
  addEventListener('scroll', check, { passive: true });
  check();
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
  // Anything inside a reveal that has not fully landed is shown at once:
  // a keyboard user should never wait on a fade to read what they focused.
  const block = el.closest('[data-sc-in]');
  if (block) {
    [block, ...block.children].forEach((k) => { k.style.transition = 'none'; k.style.transitionDelay = '0ms'; k.classList.add('sc-in'); });
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

// Rail: cards settle in sequence while the rail travels, and a wire runs
// through the cards, drawing itself as you go. Positions are measured on
// resize; per frame only the rail's own transform is read (no layout).
(function rail() {
  const act = document.getElementById('services');
  const railEl = act.querySelector('.rail');
  const cards = [...act.querySelectorAll('.svc')];
  const wire = railEl.querySelector('.rail__wire');
  const base = wire.querySelector('.rail__wire-base');
  const glow = wire.querySelector('.rail__wire-glow');
  const head = wire.querySelector('.rail__wire-head');
  let pts = [], lefts = [], len = 1, on = false;
  function measure() {
    const W = railEl.scrollWidth, H = railEl.offsetHeight;
    wire.setAttribute('width', W); wire.setAttribute('height', H);
    wire.setAttribute('viewBox', `0 0 ${W} ${H}`);
    lefts = cards.map((c) => c.offsetLeft);
    // the wire runs along the floor under the cards, rising to touch each one
    const lead = railEl.querySelector('.rail__lead');
    const floor = cards[0] ? cards[0].offsetTop + cards[0].offsetHeight + 34 : H / 2;
    const touch = floor - 34;
    pts = [[lead.offsetLeft + 4, floor]].concat(cards.map((c) => [c.offsetLeft + c.offsetWidth / 2, touch]), [[W - 40, floor]]);
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const mx = (x0 + x1) / 2;
      d += ` C ${mx} ${y0}, ${mx} ${floor + 22}, ${(x0 + x1) / 2} ${floor + 22} S ${x1} ${y1}, ${x1} ${y1}`;
    }
    base.setAttribute('d', d); glow.setAttribute('d', d);
    len = glow.getTotalLength();
    glow.style.strokeDasharray = len;
    act.style.setProperty('--wire-y', floor + 'px');
  }
  addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);
  setTimeout(measure, 300);
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { measure(); requestAnimationFrame(tick); } }).observe(act);
  function tick() {
    if (!on) return;
    const tx = parseFloat((railEl.style.transform.match(/-?[\d.]+/) || [0])[0]) || 0;
    const w = innerWidth;
    // how far the wire has drawn: up to the middle of the screen
    const reach = Math.max(0, Math.min(len, (w * 0.55 - tx)));
    const frac = reach / (railEl.scrollWidth || 1);
    glow.style.strokeDashoffset = (len * (1 - frac)).toFixed(1);
    const pt = glow.getPointAtLength(len * frac);
    head.setAttribute('cx', pt.x.toFixed(1)); head.setAttribute('cy', pt.y.toFixed(1));
    cards.forEach((c, i) => {
      const left = lefts[i] + tx;
      if (!reduce) setVar(c, '--settle', easeOut(clamp01((w * 1.02 - left) / (w * 0.32))));
      c.classList.toggle('is-wired', lefts[i] + c.offsetWidth / 2 <= reach + 1);
    });
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
  leads: [...document.querySelectorAll('.leaders .lead')].map((g) => ({
    g, base: g.querySelector('.lead__base'), flow: g.querySelector('.lead__flow'),
    ring: g.querySelector('.lead__ring'), dot: g.querySelector('.lead__dot'),
  })),
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
      // The close: the finished mark returns, resting beside the demo booking.
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
  try { mod = await import('./kscene.js?v=4'); } catch (e) { root.classList.add('no-webgl', 'tags-compact'); return; }
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
    const a = first || reduce ? 1 : damp(dt, 11);
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
      const L = els.leads[i];
      setVar(L.g, 'opacity', on);
      if (on <= 0.001) return;
      const tip = S.project(i, W, H);
      const tw = geo.tagW[i], th = geo.tagH[i];
      let ty = Math.min(Math.max(tip.y - th * 0.4, box.t), box.b - th);
      if (i === 1) webY = ty;
      if (i === 2) ty = Math.max(ty, webY + geo.tagH[1] + 28);
      const tx = tagSide[i] === 'left' ? box.l - gap - tw : box.r + gap;
      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
      // A soft S-curve from the label out to the piece, drawn as it arrives.
      const ax = tagSide[i] === 'left' ? tx + tw + 12 : tx - 12;
      const ay = ty + 18;
      const mx = (ax + tip.x) / 2;
      const d = `M ${ax.toFixed(1)} ${ay.toFixed(1)} C ${mx.toFixed(1)} ${ay.toFixed(1)}, ${mx.toFixed(1)} ${tip.y.toFixed(1)}, ${tip.x.toFixed(1)} ${tip.y.toFixed(1)}`;
      L.base.setAttribute('d', d); L.flow.setAttribute('d', d);
      setVar(L.base, 'stroke-dashoffset', 1 - easeOut(on));
      L.ring.setAttribute('cx', tip.x.toFixed(1)); L.ring.setAttribute('cy', tip.y.toFixed(1));
      L.dot.setAttribute('cx', tip.x.toFixed(1)); L.dot.setAttribute('cy', tip.y.toFixed(1));
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
