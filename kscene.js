/* Kodevia: the capsule K as a real 3D object.
   One scene, one light, one material. The page and the still renderer
   (lab/render.html) both build from this file, so every image on the site
   comes from the same shoot. */
import * as THREE from 'three';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const Q = (x, y, z) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));

/* The assembled mark, in its own units. Measured against the brand board:
   a tall stem, an upper arm leaning out to the top right, and a heavier lower
   leg that crosses in front of both. */
export const K_POSE = [
  { name: 'stem', radius: 0.6,  length: 1.95, p: V(-0.62, 0.0, 0.0),  q: Q(0, 0, 0) },
  { name: 'arm',  radius: 0.55, length: 1.25, p: V(0.46, 0.78, -0.22), q: Q(0, 0, -0.78) },
  { name: 'leg',  radius: 0.6,  length: 1.15, p: V(0.5, -0.68, 0.34),   q: Q(0, 0, 0.74) },
];

/* Loose pieces, hanging apart in depth. */
export const SCATTER_POSE = [
  { p: V(-1.9, 0.55, -1.4), q: Q(0.35, 0.5, 0.42) },
  { p: V(1.75, 1.35, 0.5),  q: Q(-0.4, 0.2, -1.55) },
  { p: V(0.35, -1.35, 1.7), q: Q(0.25, -0.6, 1.25) },
];

function glowTexture(inner, outer) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.45, outer);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createScene(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true,
    preserveDrawingBuffer: !!opts.capture,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap; // PCFSoftShadowMap was removed in r18x; radius below softens PCF

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.36;

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.55, 12);
  camera.lookAt(0, 0, 0);

  // Light: one soft key from the upper left, a violet rim from behind, a low
  // lavender fill. Matches the board renders.
  const key = new THREE.DirectionalLight(0xfff6ff, 2.6);
  key.position.set(-4, 6, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -5; key.shadow.camera.right = 5;
  key.shadow.camera.top = 5; key.shadow.camera.bottom = -5;
  key.shadow.radius = 6;
  key.shadow.blurSamples = 12;
  key.shadow.bias = -0.0005;
  scene.add(key);
  const rim = new THREE.PointLight(0x9a5cff, 60, 30, 1.6);
  rim.position.set(3.5, 2.5, -4);
  scene.add(rim);
  const rim2 = new THREE.PointLight(0xc084fc, 26, 30, 1.6);
  rim2.position.set(-4, -1, -3);
  scene.add(rim2);
  const fill = new THREE.HemisphereLight(0xe9d5ff, 0x1a0b33, 0.4);
  scene.add(fill);
  const lights = [
    [key, key.intensity], [rim, rim.intensity], [rim2, rim2.intensity], [fill, fill.intensity],
  ];

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x8d5bff,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.4,
    sheen: 0.55,
    sheenRoughness: 0.45,
    sheenColor: new THREE.Color(0xe9d5ff),
  });

  // The rig is what the page moves around the frame. Pieces live inside it.
  const rig = new THREE.Group();
  scene.add(rig);
  const mark = new THREE.Group();
  rig.add(mark);

  const pieces = K_POSE.map((k, i) => {
    const geo = new THREE.CapsuleGeometry(k.radius, k.length, 24, 64);
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mark.add(mesh);
    // The outer tip of each piece, in its own space, for label leaders.
    const tip = new THREE.Vector3(0, (k.length / 2 + k.radius * 0.6) * (k.name === 'leg' ? -1 : 1), 0);
    return { mesh, k, tip, offset: new THREE.Vector3(), vel: new THREE.Vector3() };
  });

  // Floor: a shadow catcher plus a violet pool of light under the mark.
  const floorY = -1.58;
  const shadowMat = new THREE.ShadowMaterial({ color: 0x07020f, opacity: 0.55 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), shadowMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = floorY;
  floor.receiveShadow = true;
  rig.add(floor);
  const glowMat = new THREE.MeshBasicMaterial({
    map: glowTexture('rgba(150,92,255,0.95)', 'rgba(110,50,230,0.32)'),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = floorY + 0.005;
  rig.add(glow);
  const pulseMat = new THREE.MeshBasicMaterial({
    map: glowTexture('rgba(232,208,255,1)', 'rgba(192,132,252,0.4)'),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0,
  });
  const pulse = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), pulseMat);
  pulse.rotation.x = -Math.PI / 2;
  pulse.position.y = floorY + 0.01;
  rig.add(pulse);

  const tmpV = new THREE.Vector3();
  const tmpQ = new THREE.Quaternion();
  const state = { floor: 1, dim: 0, pulse: 0 };

  let dprCap = opts.maxDpr || 1.5;
  function resize(w, h, dpr) {
    renderer.setPixelRatio(Math.min(dpr || window.devicePixelRatio || 1, dprCap));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /* t: 0 = scattered, 1 = assembled, per piece. */
  function setPieces(ts, scatter = SCATTER_POSE) {
    pieces.forEach((pc, i) => {
      const t = ts[i];
      const s = scatter[i];
      tmpV.copy(s.p).lerp(pc.k.p, t);
      pc.mesh.position.copy(tmpV).add(pc.offset);
      tmpQ.copy(s.q).slerp(pc.k.q, t);
      pc.mesh.quaternion.copy(tmpQ);
    });
  }

  function setRig({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, scale = 1 } = {}) {
    rig.position.set(x, y, z);
    rig.rotation.set(rx, ry, rz);
    rig.scale.setScalar(scale);
  }

  function setLook({ floor: f = 1, dim = 0, pulse: pl = 0 } = {}) {
    state.floor = f; state.dim = dim; state.pulse = pl;
    shadowMat.opacity = 0.55 * f;
    glowMat.opacity = 0.75 * f;
    pulseMat.opacity = pl;
    pulse.scale.setScalar(0.6 + pl * 0.9);
    const k = 1 - dim * 0.72;
    lights.forEach(([l, base]) => { l.intensity = base * k; });
    scene.environmentIntensity = 0.36 * k;
  }

  /* Screen position of a piece's outer tip, in CSS pixels. */
  function project(i, w, h) {
    const pc = pieces[i];
    tmpV.copy(pc.tip).applyMatrix4(pc.mesh.matrixWorld).project(camera);
    return { x: (tmpV.x * 0.5 + 0.5) * w, y: (-tmpV.y * 0.5 + 0.5) * h, z: tmpV.z };
  }
  function projectCenter(w, h) {
    tmpV.set(0, 0, 0).applyMatrix4(mark.matrixWorld).project(camera);
    return { x: (tmpV.x * 0.5 + 0.5) * w, y: (-tmpV.y * 0.5 + 0.5) * h };
  }

  function render() {
    scene.updateMatrixWorld();
    renderer.render(scene, camera);
  }

  /* Quality steps for slower GPUs: 0 full, 1 lower resolution, 2 no shadows. */
  function setQuality(level, w, h) {
    dprCap = level >= 1 ? 1 : (opts.maxDpr || 1.5);
    renderer.shadowMap.enabled = level < 2;
    key.castShadow = level < 2;
    material.needsUpdate = true;
    shadowMat.needsUpdate = true;
    resize(w, h);
  }

  /* Screen-space box of the assembled mark (stable while pieces fly). */
  const corners = [V(-1.25, 1.65, 0), V(1.3, 1.65, 0), V(-1.25, -1.6, 0), V(1.3, -1.6, 0)];
  function markBox(w, h) {
    let l = Infinity, r = -Infinity, t = Infinity, b = -Infinity;
    for (const c of corners) {
      tmpV.copy(c).applyMatrix4(mark.matrixWorld).project(camera);
      const x = (tmpV.x * 0.5 + 0.5) * w, y = (-tmpV.y * 0.5 + 0.5) * h;
      l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y);
    }
    return { l, r, t, b };
  }

  return {
    setQuality, markBox,
    THREE, renderer, scene, camera, rig, mark, pieces, floor, glow, key,
    resize, setPieces, setRig, setLook, project, projectCenter, render,
    dispose() { renderer.dispose(); pmrem.dispose(); },
  };
}
