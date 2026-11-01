/* ============ 3D-флакон By the Fireplace на главном экране ============ */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const stage = document.getElementById('stage');
const heroEl = document.getElementById('hero');

function showFallback() {
  heroEl.classList.add('no-webgl');
  document.getElementById('heroFallback').innerHTML = fallbackBottle(byId('by-the-fireplace'));
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) { showFallback(); }

if (renderer) init();

function init() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, .1, 100);
  camera.position.set(0, .3, 14.6);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;

  /* ---------- Свет: тёплый «камин» снизу слева, контровой сзади ---------- */
  scene.add(new THREE.AmbientLight(0xffe2c4, .25));
  const key = new THREE.DirectionalLight(0xfff1e0, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const fire = new THREE.PointLight(0xff6a1a, 40, 14, 2);
  fire.position.set(-2.2, -1.8, 2.2);
  scene.add(fire);
  const rim = new THREE.PointLight(0xffb070, 30, 12, 2);
  rim.position.set(1.5, 1.5, -2.5);
  scene.add(rim);

  /* ---------- Текстура льняной этикетки Replica ---------- */
  function labelTexture() {
    const W = 1024, H = 1220, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    g.fillStyle = '#f4f3ef';
    g.fillRect(0, 0, W, H);
    // переплетение льна: тонкие вертикальные и горизонтальные нити
    for (let x = 0; x < W; x += 3) { g.fillStyle = `rgba(90,85,80,${.02 + Math.random() * .03})`; g.fillRect(x, 0, 1, H); }
    for (let y = 0; y < H; y += 3) { g.fillStyle = `rgba(90,85,80,${.02 + Math.random() * .03})`; g.fillRect(0, y, W, 1); }
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = `rgba(255,255,255,${Math.random() * .35})`;
      g.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
    // тонкая тёмная рамка внутри этикетки
    g.strokeStyle = 'rgba(40,38,36,.75)'; g.lineWidth = 3;
    g.strokeRect(26, 26, W - 52, H - 52);

    const ink = '#161514', typed = '#6a6661', cx = W / 2, x = 70;
    g.fillStyle = ink; g.textAlign = 'center';
    g.font = '700 128px Arial, Helvetica, sans-serif';
    g.fillText('REPLICA', cx, 190);
    g.font = '700 40px Arial, Helvetica, sans-serif';
    ['REPRODUCTION OF FAMILIAR', 'SCENTS AND MOMENTS OF VARYING', 'LOCATIONS AND PERIODS'].forEach((t, i) => g.fillText(t, cx, 262 + i * 48));

    // жирный заголовок + бледная «машинописная» строка над пунктиром
    const block = (title, value, y) => {
      g.textAlign = 'left'; g.fillStyle = ink;
      g.font = '700 54px Arial, Helvetica, sans-serif';
      g.fillText(title, x, y);
      g.textAlign = 'center'; g.fillStyle = typed;
      g.font = '400 46px "Courier New", Courier, monospace';
      g.fillText(value, cx, y + 66);
      g.strokeStyle = 'rgba(40,38,36,.7)'; g.lineWidth = 3; g.setLineDash([6, 7]);
      g.beginPath(); g.moveTo(x, y + 80); g.lineTo(W - x, y + 80); g.stroke(); g.setLineDash([]);
    };
    block('Originally:', 'By the Fireplace', 470);
    block('Provenance and Period:', 'Chamonix, 1971', 610);
    block('Fragrance Description:', 'Burning wood and chestnut', 750);
    block('Style Description:', 'Memory in a fragrance', 890);

    g.textAlign = 'center'; g.fillStyle = ink;
    g.font = '400 88px "Times New Roman", Times, serif';
    g.fillText('Maison Margiela', cx, 1085);
    g.font = '400 40px "Times New Roman", Times, serif';
    g.fillText('P A R I S', cx, 1145);

    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  // плотная намотка тонкой хлопковой нити: цвет + рельеф
  function ropeTextures() {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
    const g = c.getContext('2d');
    const b = document.createElement('canvas'); b.width = 1024; b.height = 256;
    const h = b.getContext('2d');
    g.fillStyle = '#f1eee7'; g.fillRect(0, 0, 1024, 256);
    h.fillStyle = '#808080'; h.fillRect(0, 0, 1024, 256);
    const rows = 22, rh = 256 / rows;
    for (let r = 0; r < rows; r++) {
      const y = r * rh;
      // тень между витками
      g.fillStyle = 'rgba(120,110,95,.35)'; g.fillRect(0, y, 1024, 1.5);
      const gr = h.createLinearGradient(0, y, 0, y + rh);
      gr.addColorStop(0, '#202020'); gr.addColorStop(.5, '#ffffff'); gr.addColorStop(1, '#202020');
      h.fillStyle = gr; h.fillRect(0, y, 1024, rh);
      // скрутка нити — короткие косые штрихи
      for (let x = (r % 2) * 4; x < 1024; x += 8) {
        g.strokeStyle = 'rgba(150,140,125,.28)'; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(x, y + rh - 1); g.lineTo(x + 5, y + 1); g.stroke();
      }
    }
    const map = new THREE.CanvasTexture(c), bump = new THREE.CanvasTexture(b);
    map.colorSpace = THREE.SRGBColorSpace;
    [map, bump].forEach(t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1); });
    return { map, bump };
  }

  /* ---------- Флакон по фото: плотный цилиндр, плоские плечи, толстое дно ---------- */
  const bottle = new THREE.Group();
  // стекло — тонкая прозрачная оболочка с бликами, чтобы цвет жидкости оставался насыщенным
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0, metalness: 0, transparent: true, opacity: .07, depthWrite: false,
    clearcoat: 1, clearcoatRoughness: 0, envMapIntensity: 2.2, specularIntensity: 1
  });
  const thickGlass = new THREE.MeshPhysicalMaterial({
    color: 0xfff6e8, roughness: .05, metalness: 0, transparent: true, opacity: .32, emissive: 0x3a2410, emissiveIntensity: .6,
    clearcoat: 1, envMapIntensity: 1.6
  });

  // контур вращения: скруглённое дно, прямая стенка, скруглённое плечо, почти плоский верх к горлышку
  function profile(R, bottom, top, rb, rt, neckR, neckTop) {
    const pts = [new THREE.Vector2(0, bottom)];
    for (let i = 0; i <= 8; i++) {
      const a = -Math.PI / 2 + i / 8 * Math.PI / 2;
      pts.push(new THREE.Vector2(R - rb + Math.cos(a) * rb, bottom + rb + Math.sin(a) * rb));
    }
    for (let i = 0; i <= 14; i++) {
      const a = i / 14 * Math.PI / 2;
      pts.push(new THREE.Vector2(R - rt + Math.cos(a) * rt, top - rt + Math.sin(a) * rt));
    }
    if (neckR) {
      pts.push(new THREE.Vector2(neckR + .05, top + .05));
      pts.push(new THREE.Vector2(neckR, top + .08));
      pts.push(new THREE.Vector2(neckR, neckTop));
      pts.push(new THREE.Vector2(0, neckTop));
    } else pts.push(new THREE.Vector2(0, top));
    return pts;
  }
  const R = .95, BOT = -1.75, TOP = 1.4;
  bottle.add(new THREE.Mesh(new THREE.LatheGeometry(profile(R, BOT, TOP, .08, .24, .33, TOP + .4), 160), glass));

  // жидкость: медовый янтарь, к краям темнее (эффект толщи)
  const juiceMat = new THREE.MeshPhysicalMaterial({
    color: 0xe8901a, roughness: .05, metalness: 0, clearcoat: 1, clearcoatRoughness: .02,
    emissive: 0xc05a00, emissiveIntensity: .55, envMapIntensity: .7
  });
  juiceMat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', `
      float fr = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition)));
      gl_FragColor.rgb *= mix(1.15, 0.5, pow(fr, 1.6));
      #include <dithering_fragment>`);
  };
  const JB = BOT + .24, JT = TOP - .04;
  bottle.add(new THREE.Mesh(new THREE.LatheGeometry(profile(R - .05, JB, JT, .06, .2), 160), juiceMat));
  // толстое стеклянное дно
  bottle.add(new THREE.Mesh(new THREE.LatheGeometry(profile(R - .01, BOT + .005, JB - .005, .075, .03), 160), thickGlass));

  // плотная полоса намотки на горлышке с мягкими краями
  const ropeT = ropeTextures();
  const rope = new THREE.MeshStandardMaterial({ map: ropeT.map, bumpMap: ropeT.bump, bumpScale: 1.2, roughness: 1, metalness: 0 });
  const RY0 = TOP + .1, RY1 = TOP + .44;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(.43, .43, RY1 - RY0 - .05, 96, 1, true), rope);
  band.position.y = (RY0 + RY1) / 2;
  bottle.add(band);
  [RY0 + .03, RY1 - .03].forEach(y => {
    const edge = new THREE.Mesh(new THREE.TorusGeometry(.405, .03, 16, 96), rope);
    edge.rotation.x = Math.PI / 2; edge.position.y = y;
    bottle.add(edge);
  });
  const ropeTop = new THREE.Mesh(new THREE.RingGeometry(.3, .41, 64), rope);
  ropeTop.rotation.x = -Math.PI / 2; ropeTop.position.y = RY1 - .002;
  bottle.add(ropeTop);

  // серебряный распылитель: воротничок со ступенькой, Т-образная головка, сопло в ободке
  const metal = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, metalness: 1, roughness: .07, envMapIntensity: 1.9 });
  const lathe = (pts, mat) => new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 96), mat);
  const C0 = RY1;
  bottle.add(lathe([[0, C0], [.36, C0], [.395, C0 + .01], [.405, C0 + .04], [.405, C0 + .1], [.39, C0 + .125], [.3, C0 + .13],
    [.29, C0 + .14], [.29, C0 + .22], [.27, C0 + .235], [.12, C0 + .24], [0, C0 + .24]], metal));
  const A0 = C0 + .24;
  const actuator = new THREE.Mesh(new THREE.CylinderGeometry(.165, .165, .3, 64), metal);
  actuator.position.y = A0 + .15;
  bottle.add(actuator);
  bottle.add(lathe([[0, A0 + .29], [.2, A0 + .29], [.215, A0 + .3], [.22, A0 + .33], [.21, A0 + .345], [0, A0 + .35]], metal));
  const nozzleY = A0 + .16;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.055, .014, 12, 40), metal);
  ring.position.set(0, nozzleY, .168);
  bottle.add(ring);
  const hole = new THREE.Mesh(new THREE.CircleGeometry(.042, 32), new THREE.MeshBasicMaterial({ color: 0x0b0b0b }));
  hole.position.set(0, nozzleY, .166);
  bottle.add(hole);

  // льняная этикетка, слегка изогнутая по корпусу
  const LW = 1.56, LH = 1.98;
  const arc = LW / (R + .006);
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(R + .006, R + .006, LH, 96, 1, true, -arc / 2, arc),
    new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: .95, metalness: 0 })
  );
  label.position.y = BOT + .44 + LH / 2;
  bottle.add(label);

  bottle.position.y = -.38;

  /* ---------- Мягкая тень и свечение «камина» ---------- */
  function radial(stops) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    stops.forEach(([o, col]) => gr.addColorStop(o, col));
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.2), new THREE.MeshBasicMaterial({ map: radial([[0, 'rgba(0,0,0,.55)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.15;
  shadow.visible = false;
  scene.add(shadow);

  const glow = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshBasicMaterial({
    map: radial([[0, 'rgba(255,130,50,.55)'], [.4, 'rgba(200,80,20,.18)'], [1, 'rgba(0,0,0,0)']]),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  glow.scale.setScalar(1.4);
  glow.position.set(0, -1.4, -4.4);
  glow.visible = false;

  // тёплый свет «от камина» на флакон — сам огонь теперь на видео
  const hearthLight = new THREE.PointLight(0xff7a2a, 45, 22, 2);
  hearthLight.position.set(0, -2, -3.6);
  scene.add(hearthLight);

  /* ---------- Искры от камина ---------- */
  const N = 260;
  const pos = new Float32Array(N * 3), speed = new Float32Array(N), phase = new Float32Array(N);
  const resetEmber = (i, anyY) => {
    pos[i * 3] = (Math.random() - .5) * 7;
    pos[i * 3 + 1] = anyY ? (Math.random() - .5) * 6 : -3 - Math.random();
    pos[i * 3 + 2] = -Math.random() * 4.5;
    speed[i] = .25 + Math.random() * .6;
    phase[i] = Math.random() * 10;
  };
  for (let i = 0; i < N; i++) resetEmber(i, true);
  const emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const embers = new THREE.Points(emberGeo, new THREE.PointsMaterial({
    size: .07, map: radial([[0, 'rgba(255,220,170,1)'], [.25, 'rgba(255,140,60,.9)'], [1, 'rgba(255,80,0,0)']]),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffa060
  }));
  embers.visible = false;

  /* ---------- Сборка: наклон вправо, как будто флакон держат в руке ---------- */
  const holder = new THREE.Group();   // для прокрутки и появления
  const tilt = new THREE.Group();     // постоянный наклон
  tilt.rotation.set(.05, -.25, -.17);
  tilt.add(bottle);
  holder.add(tilt);
  scene.add(holder);

  /* ---------- Размеры и адаптив ---------- */
  let mobile = false;
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    mobile = w < 900;
    // по центру экрана надпись, поэтому флакон справа; на телефоне — над надписью
    holder.userData.baseY = mobile ? 2.1 : -.3;
    holder.userData.baseX = mobile ? 0 : Math.min(4.8, 3.05 * w / h);
    const s = mobile ? .5 : (w / h < 1.5 ? .58 : .7);
    holder.userData.baseScale = s;
  }
  resize();
  new ResizeObserver(resize).observe(stage);

  /* ---------- Мышь, перетаскивание, прокрутка ---------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let drag = null, spin = 0, spinVel = 0;
  window.addEventListener('pointermove', e => {
    mouse.tx = e.clientX / innerWidth * 2 - 1;
    mouse.ty = e.clientY / innerHeight * 2 - 1;
    if (drag !== null) { spinVel = (e.clientX - drag) * .006; spin += spinVel; drag = e.clientX; }
  });
  stage.addEventListener('pointerdown', e => { drag = e.clientX; stage.style.cursor = 'grabbing'; });
  window.addEventListener('pointerup', () => { drag = null; stage.style.cursor = 'grab'; });
  stage.style.cursor = 'grab';

  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 }).observe(heroEl);

  /* ---------- Анимация ---------- */
  const clock = new THREE.Clock();
  const t0 = performance.now() + (document.getElementById('intro') ? 1700 : 0);
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), .05);
    const t = clock.elapsedTime;

    mouse.x += (mouse.tx - mouse.x) * .05;
    mouse.y += (mouse.ty - mouse.y) * .05;
    if (drag === null) { spinVel *= .94; spin += spinVel; spin *= .985; }

    // появление после интро
    const k = Math.min(Math.max((performance.now() - t0) / 2200, 0), 1);
    const e = 1 - Math.pow(1 - k, 4);

    const prog = Math.min(scrollY / heroEl.offsetHeight, 1.2);
    const s = holder.userData.baseScale * (.7 + .3 * e) * (1 - prog * .25);
    holder.scale.setScalar(s);
    holder.position.set(holder.userData.baseX, holder.userData.baseY + Math.sin(t * .9) * .06 + prog * 2.2 - (1 - e) * .6, 0);
    // лёгкое «дыхание» руки
    holder.rotation.y = Math.sin(t * .35) * .16 + mouse.x * .3 + spin + prog * 1.4 + (1 - e) * -1.6;
    holder.rotation.x = mouse.y * .08 + Math.sin(t * .5) * .02;
    holder.rotation.z = Math.sin(t * .7) * .012 - mouse.x * .03;

    // мерцание огня
    const flick = .75 + Math.sin(t * 8.3) * .08 + Math.sin(t * 13.1) * .06 + Math.random() * .08;
    fire.intensity = 40 * flick * e;
    glow.material.opacity = .65 + flick * .35;
    hearthLight.intensity = 45 * flick;
    juiceMat.emissiveIntensity = .45 + flick * .18;

    renderer.render(scene, camera);
  }
  frame();
}
