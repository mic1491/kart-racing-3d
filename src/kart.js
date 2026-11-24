import * as THREE from 'three';

export const KART_ORDER = ['yellow', 'cyan', 'red', 'purple', 'green', 'desert', 'ice', 'cyber', 'hsr', 'shuttle', 'ufo', 'duck', 'carriage'];

export const DRIVER_ORDER = ['racer_red', 'racer_black', 'astronaut', 'police', 'knight', 'ninja'];

export const DRIVER_PRESETS = {
  racer_red: { id: 'racer_red', name: '紅盔車手', icon: '🏎️', helmet: 0xd92323, suit: 0x154596, accent: 0xe53935, hand: 0xd92323, visor: 0xdff6ff, visorOp: 0.22, style: 'helmet', beard: false },
  racer_black: { id: 'racer_black', name: '暗影車手', icon: '🕶️', helmet: 0x1c1f26, suit: 0x2b303a, accent: 0xe91e8c, hand: 0x454c59, visor: 0x222a3a, visorOp: 0.3, style: 'helmet', beard: true },
  astronaut: { id: 'astronaut', name: '太空人', icon: '👨‍🚀', helmet: 0xf8fafc, suit: 0xf1f5f9, accent: 0x0284c7, hand: 0xe2e8f0, visor: 0xffc400, visorOp: 0.42, style: 'astro', beard: false },
  police: { id: 'police', name: '積木警長', icon: '👮', helmet: 0x0f2b5b, suit: 0x1e3a8a, accent: 0xffd700, hand: 0xffd500, visor: 0x111111, visorOp: 0.2, style: 'cap', beard: true },
  knight: { id: 'knight', name: '黃金騎士', icon: '⚔️', helmet: 0xffc107, suit: 0x94a3b8, accent: 0xffc107, hand: 0x64748b, visor: 0x334155, visorOp: 0.25, style: 'knight', beard: false },
  ninja: { id: 'ninja', name: '烈焰忍者', icon: '🥷', helmet: 0xb91c1c, suit: 0x18181b, accent: 0xef4444, hand: 0x18181b, visor: 0x000000, visorOp: 0.12, style: 'ninja', beard: false },
};

export const KART_PRESETS = {
  yellow: {
    id: 'yellow', bodyStyle: 'kart', styleLabel: '卡丁車', name: '閃電金星 #27', desc: '經典黃藍・均衡過彎', number: '27',
    primary: 0xffb300, secondary: 0x0d47a1, accent: 0xffffff, bumper: 0xffb300, exhaust: 0x8e99a8,
    decalBg: '#0d47a1', decalText: '#ff2a2a', decalStroke: '#ffffff',
    swatchCss: 'linear-gradient(135deg, #ffb700 50%, #0d47a1 50%)',
    statSpeed: 86, statDrift: 92, maxSpeed: 54, accel: 34, driftGrip: 0.94, mapColor: '#ffcc00',
  },
  cyan: {
    id: 'cyan', bodyStyle: 'kart', styleLabel: '卡丁車', name: '霓虹暗影 #4', desc: '黑青粉雙噴・強勁極速', number: '4',
    primary: 0x1b1f2a, secondary: 0x00bfa5, accent: 0xe91e8c, bumper: 0x00bfa5, exhaust: 0xd32f2f,
    decalBg: '#1b1f2a', decalText: '#00e5cc', decalStroke: '#e91e8c',
    swatchCss: 'linear-gradient(135deg, #1b1f2a 45%, #00c4b4 45%, #00c4b4 75%, #e91e8c 75%)',
    statSpeed: 92, statDrift: 86, maxSpeed: 56, accel: 35, driftGrip: 0.91, mapColor: '#00e5cc',
  },
  red: {
    id: 'red', bodyStyle: 'f1', styleLabel: 'F1 方程式', name: '烈焰方程式 #12', desc: '大尾翼超跑・爆發加速', number: '12',
    primary: 0xe53935, secondary: 0xffffff, accent: 0x1e293b, bumper: 0xe53935, exhaust: 0x9aa4b2,
    decalBg: '#ffffff', decalText: '#e53935', decalStroke: '#111111',
    swatchCss: 'linear-gradient(135deg, #e53935 55%, #ffffff 55%)',
    statSpeed: 95, statDrift: 88, maxSpeed: 57, accel: 38, driftGrip: 0.92, mapColor: '#ff4d4d',
  },
  purple: {
    id: 'purple', bodyStyle: 'f1', styleLabel: 'F1 方程式', name: '皇家紫電 #99', desc: '紫金 F1・極致渦輪', number: '99',
    primary: 0x7b1fa2, secondary: 0xffd54f, accent: 0xffffff, bumper: 0xffd54f, exhaust: 0xffca28,
    decalBg: '#4a148c', decalText: '#ffd54f', decalStroke: '#ffffff',
    swatchCss: 'linear-gradient(135deg, #7b1fa2 55%, #ffd54f 55%)',
    statSpeed: 97, statDrift: 85, maxSpeed: 57.8, accel: 35, driftGrip: 0.91, mapColor: '#d580ff',
  },
  green: {
    id: 'green', bodyStyle: 'monster', styleLabel: '大腳越野車', name: '翡翠大腳怪 #88', desc: '巨型越野胎・神級甩尾', number: '88',
    primary: 0x43a047, secondary: 0x1565c0, accent: 0xffee58, bumper: 0x263238, exhaust: 0x9aa4b2,
    decalBg: '#1565c0', decalText: '#ffee58', decalStroke: '#ffffff',
    swatchCss: 'linear-gradient(135deg, #43a047 50%, #ffee58 50%)',
    statSpeed: 85, statDrift: 97, maxSpeed: 53.8, accel: 36, driftGrip: 0.96, mapColor: '#4dff88',
  },
  desert: {
    id: 'desert', bodyStyle: 'monster', styleLabel: '大腳越野車', name: '沙暴越野王 #55', desc: '防滾架吉普・穩重耐撞', number: '55',
    primary: 0xf57c00, secondary: 0x3e2723, accent: 0xffca28, bumper: 0x212121, exhaust: 0xb0bec5,
    decalBg: '#3e2723', decalText: '#ffca28', decalStroke: '#ffffff',
    swatchCss: 'linear-gradient(135deg, #f57c00 50%, #3e2723 50%)',
    statSpeed: 87, statDrift: 94, maxSpeed: 54.5, accel: 37, driftGrip: 0.95, mapColor: '#ff9800',
  },
  ice: {
    id: 'ice', bodyStyle: 'cyber', styleLabel: '未來跑車', name: '冰晶戰神 #77', desc: '極地流線・冰藍光軌', number: '77',
    primary: 0x29b6f6, secondary: 0xe1f5fe, accent: 0x01579b, bumper: 0x00e5ff, exhaust: 0x80d8ff,
    decalBg: '#01579b', decalText: '#80d8ff', decalStroke: '#ffffff',
    swatchCss: 'linear-gradient(135deg, #29b6f6 50%, #e1f5fe 50%)',
    statSpeed: 91, statDrift: 94, maxSpeed: 55.8, accel: 36, driftGrip: 0.95, mapColor: '#66d9ff',
  },
  cyber: {
    id: 'cyber', bodyStyle: 'cyber', styleLabel: '未來跑車', name: '星際幻影 #01', desc: '霓虹超跑・三噴推進', number: '01',
    primary: 0xf8fafc, secondary: 0x0f172a, accent: 0xff2a9d, bumper: 0xff2a9d, exhaust: 0x00f5ff,
    decalBg: '#0f172a', decalText: '#ff2a9d', decalStroke: '#00f5ff',
    swatchCss: 'linear-gradient(135deg, #f8fafc 45%, #ff2a9d 45%, #ff2a9d 75%, #00f5ff 75%)',
    statSpeed: 96, statDrift: 91, maxSpeed: 57.2, accel: 37, driftGrip: 0.93, mapColor: '#ff66cc',
  },
  hsr: {
    id: 'hsr', bodyStyle: 'train', styleLabel: '🚄 高鐵車頭', name: '台灣高鐵 700T', desc: '橘白流線・極速子彈列車', number: '700',
    primary: 0xffffff, secondary: 0xff6d00, accent: 0x1e293b, bumper: 0xff6d00, exhaust: 0x94a3b8,
    decalBg: '#ff6d00', decalText: '#ffffff', decalStroke: '#1e293b',
    swatchCss: 'linear-gradient(135deg, #ffffff 55%, #ff6d00 55%, #ff6d00 80%, #1e293b 80%)',
    statSpeed: 99, statDrift: 88, maxSpeed: 58.2, accel: 36, driftGrip: 0.92, mapColor: '#ff8a00',
  },
  shuttle: {
    id: 'shuttle', bodyStyle: 'shuttle', styleLabel: '🚀 太空梭', name: '發現號太空梭', desc: '三角翼三引擎・火箭升空', number: '09',
    primary: 0xf8fafc, secondary: 0x111827, accent: 0xff3b30, bumper: 0x111827, exhaust: 0x475569,
    decalBg: '#111827', decalText: '#ffffff', decalStroke: '#ff3b30',
    swatchCss: 'linear-gradient(135deg, #f8fafc 55%, #111827 55%, #111827 82%, #ff3b30 82%)',
    statSpeed: 98, statDrift: 90, maxSpeed: 58.0, accel: 39, driftGrip: 0.93, mapColor: '#ffffff',
  },
  ufo: {
    id: 'ufo', bodyStyle: 'ufo', styleLabel: '🛸 外星飛碟', name: '星際幽浮 UFO', desc: '磁浮懸空・零阻力飄移', number: '51',
    primary: 0xcbd5e1, secondary: 0x00f5ff, accent: 0x38ef7d, bumper: 0x00f5ff, exhaust: 0x38ef7d,
    decalBg: '#0f172a', decalText: '#38ef7d', decalStroke: '#00f5ff',
    swatchCss: 'linear-gradient(135deg, #94a3b8 45%, #38ef7d 45%, #38ef7d 75%, #00f5ff 75%)',
    statSpeed: 94, statDrift: 99, maxSpeed: 56.8, accel: 38, driftGrip: 0.97, mapColor: '#38ef7d',
  },
  duck: {
    id: 'duck', bodyStyle: 'duck', styleLabel: '🦆 黃金鴨鴨', name: '巨無霸鴨鴨車', desc: '呆萌神車・全場焦點', number: '99',
    primary: 0xffd600, secondary: 0xff6d00, accent: 0xffffff, bumper: 0xff6d00, exhaust: 0xff9100,
    decalBg: '#ffd600', decalText: '#ff6d00', decalStroke: '#ffffff',
    swatchCss: 'linear-gradient(135deg, #ffd600 60%, #ff6d00 60%)',
    statSpeed: 90, statDrift: 96, maxSpeed: 55.6, accel: 37, driftGrip: 0.96, mapColor: '#ffee00',
  },
  carriage: {
    id: 'carriage', bodyStyle: 'carriage', styleLabel: '🐴 皇家馬車', name: '皇家黃金馬車', desc: '白馬拉車・童話飆車', number: '00',
    primary: 0xc62828, secondary: 0xffd54f, accent: 0xffffff, bumper: 0xffd54f, exhaust: 0xffb300,
    decalBg: '#c62828', decalText: '#ffd54f', decalStroke: '#ffffff',
    swatchCss: 'linear-gradient(135deg, #c62828 50%, #ffd54f 50%)',
    statSpeed: 92, statDrift: 95, maxSpeed: 56.2, accel: 38, driftGrip: 0.95, mapColor: '#ffd54f',
  },
};

function createNumberTexture(preset) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = preset.decalBg;
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = preset.decalStroke;
  ctx.lineWidth = 14;
  ctx.strokeRect(14, 14, 228, 228);

  ctx.font = '900 124px Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 10;
  ctx.strokeStyle = preset.decalStroke;
  ctx.strokeText(preset.number, 128, 120);
  ctx.fillStyle = preset.decalText;
  ctx.fillText(preset.number, 128, 120);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createLegoFaceTexture(isBeard = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffd500';
  ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#111111';
  ctx.beginPath();
  ctx.arc(106, 54, 7, 0, Math.PI * 2);
  ctx.arc(150, 54, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(104, 51, 2.5, 0, Math.PI * 2);
  ctx.arc(148, 51, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(128, 66, 20, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();
  if (isBeard) {
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(128, 70, 28, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createNameplateSprite(displayName, badgeColor = '#ffdd00', isHuman = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 72;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 320, 72);
  ctx.fillStyle = isHuman ? 'rgba(10, 20, 48, 0.84)' : 'rgba(20, 26, 40, 0.68)';
  ctx.strokeStyle = isHuman ? badgeColor : 'rgba(255,255,255,0.4)';
  ctx.lineWidth = isHuman ? 5 : 3;
  ctx.beginPath();
  ctx.roundRect(10, 10, 300, 52, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isHuman ? '#ffffff' : '#dce6f7';
  ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Noto Sans TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const text = displayName.length > 10 ? displayName.slice(0, 10) + '…' : displayName;
  ctx.fillText(text, 160, 37);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  sprite.scale.set(3.2, 0.72, 1);
  sprite.position.set(0, 3.2, 0);
  return sprite;
}

export const MOD_CATALOG = {
  wheel: [
    { id: 'std', name: '標準胎', icon: '⚫', desc: '均衡操控' },
    { id: 'slick', name: '極速光頭胎', icon: '🏁', desc: '極速+4・金輪框' },
    { id: 'offroad', name: '越野巨輪', icon: '🛞', desc: '超大胎・草地不減速' },
  ],
  wing: [
    { id: 'none', name: '無尾翼', icon: '➖', desc: '輕巧車身' },
    { id: 'gt', name: '巨型 GT 尾翼', icon: '🏎️', desc: '甩尾集氣 +22%' },
    { id: 'glider', name: '天空滑翔翼', icon: '🪂', desc: '空中滑翔飛超遠！' },
  ],
  bumper: [
    { id: 'none', name: '標準車頭', icon: '➖', desc: '原廠造型' },
    { id: 'spike', name: '尖刺裝甲桿', icon: '🛡️', desc: '撞飛對手！' },
    { id: 'magnet', name: '吸金磁鐵', icon: '🧲', desc: '自動吸取附近金幣' },
  ],
};

export function createEmoteBubbleSprite(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
  ctx.beginPath();
  ctx.roundRect(10, 8, 236, 66, 22);
  ctx.fill();
  ctx.strokeStyle = '#ff6b00';
  ctx.lineWidth = 5;
  ctx.stroke();
  // Little speech tail
  ctx.beginPath();
  ctx.moveTo(114, 74);
  ctx.lineTo(128, 92);
  ctx.lineTo(142, 74);
  ctx.closePath();
  ctx.fill();

  ctx.font = '900 32px "Noto Sans TC", Arial, sans-serif';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 42);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(4.6, 1.75, 1);
  sprite.position.set(0, 4.45, 0);
  return sprite;
}

export function attachBattleBalloons(kartRoot) {
  const colors = [0xff2a55, 0x38bdf8, 0xfacc15];
  const offsets = [
    { x: -0.68, y: 2.35, z: 1.55 },
    { x: 0.0, y: 2.65, z: 1.72 },
    { x: 0.68, y: 2.35, z: 1.55 },
  ];
  const stringMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const balloons = [];
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group();
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 12, 10),
      new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.2, metalness: 0.1 })
    );
    bulb.scale.set(0.95, 1.15, 0.95);
    const knot = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.14, 6), new THREE.MeshBasicMaterial({ color: colors[i] }));
    knot.position.y = -0.5;
    const str = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 5), stringMat);
    str.position.y = -1.05;
    g.add(bulb, knot, str);
    g.position.set(offsets[i].x, offsets[i].y, offsets[i].z);
    kartRoot.add(g);
    balloons.push({ mesh: g, baseY: offsets[i].y, color: colors[i], phase: i * 1.9 });
  }
  return balloons;
}

export function createLegoKart(presetKey = 'yellow', driverKey = 'racer_red', mods = null) {
  const preset = KART_PRESETS[presetKey] || KART_PRESETS.yellow;
  const driver = DRIVER_PRESETS[driverKey] || DRIVER_PRESETS.racer_red;
  const activeMods = { wheel: 'std', wing: 'none', bumper: 'none', ...(mods || {}) };
  const style = preset.bodyStyle || 'kart';
  const isMonster = style === 'monster';
  const isUfo = style === 'ufo';
  const yLift = isMonster ? 0.34 : isUfo ? 0.28 : 0;

  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  bodyGroup.position.y = yLift;
  root.add(bodyGroup);
  const horseLegs = [];

  const primaryMat = new THREE.MeshStandardMaterial({ color: preset.primary, roughness: 0.22, metalness: isUfo ? 0.55 : 0.08 });
  const secondaryMat = new THREE.MeshStandardMaterial({ color: preset.secondary, roughness: 0.25, metalness: 0.1 });
  const accentMat = new THREE.MeshStandardMaterial({ color: preset.accent, roughness: 0.25, metalness: 0.05 });
  const bumperMat = new THREE.MeshStandardMaterial({ color: preset.bumper, roughness: 0.22, metalness: 0.08 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x20242c, roughness: 0.55, metalness: 0.15 });
  const exhaustMat = new THREE.MeshStandardMaterial({ color: preset.exhaust, roughness: 0.35, metalness: 0.4 });

  // Base Chassis (skip boxy chassis on UFO saucer)
  if (!isUfo) {
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.28, style === 'f1' || style === 'train' || style === 'shuttle' ? 3.3 : 2.75),
      darkMat
    );
    chassis.position.set(0, 0.42, 0);
    chassis.castShadow = true;
    bodyGroup.add(chassis);
  }

  // Style-specific Front / Body / Wing
  if (style === 'train') {
    // 🚄 Taiwan HSR 700T Bullet Train Nose!
    const bodyMain = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.85, 2.4), primaryMat);
    bodyMain.position.set(0, 0.85, 0.25);
    bodyMain.castShadow = true;
    // Sleek aerodynamic bullet nosecone
    const noseCone = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.96, 1.55, 16), primaryMat);
    noseCone.rotation.x = -Math.PI / 2;
    noseCone.scale.set(1.0, 1.0, 0.65);
    noseCone.position.set(0, 0.72, -1.65);
    noseCone.castShadow = true;
    // Orange HSR racing stripes along both sides + front skirt
    for (const sx of [-0.98, 0.98]) {
      const orangeBand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 3.0), secondaryMat);
      orangeBand.position.set(sx, 0.75, -0.05);
      const blackBand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 2.9), accentMat);
      blackBand.position.set(sx, 0.98, 0.05);
      bodyGroup.add(orangeBand, blackBand);
    }
    // Panoramic dark windshield + glowing twin LED headlights
    const windGlass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.34, 0.55), accentMat);
    windGlass.position.set(0, 1.18, -1.05);
    windGlass.rotation.x = 0.45;
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xfff8b0 });
    for (const lx of [-0.55, 0.55]) {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.12), ledMat);
      lamp.position.set(lx, 0.78, -2.25);
      bodyGroup.add(lamp);
    }
    // Roof pantograph (集電弓) at rear
    const pantoBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.5), accentMat);
    pantoBase.position.set(0, 1.4, 1.05);
    const pantoArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.12), exhaustMat);
    pantoArm.position.set(0, 1.72, 1.12);
    pantoArm.rotation.x = -0.35;
    const pantoBar = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.09, 0.12), secondaryMat);
    pantoBar.position.set(0, 2.02, 1.24);
    bodyGroup.add(bodyMain, noseCone, windGlass, pantoBase, pantoArm, pantoBar);
  } else if (style === 'shuttle') {
    // 🚀 Space Shuttle with Delta Wings & Vertical Tail Fin!
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 2.5, 14), primaryMat);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.scale.set(1.1, 1.0, 0.72);
    fuselage.position.set(0, 0.75, 0.1);
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.74, 1.35, 14), secondaryMat);
    nose.rotation.x = -Math.PI / 2;
    nose.scale.set(1.1, 1.0, 0.72);
    nose.position.set(0, 0.72, -1.78);
    // Wide triangular delta wings
    const wingGeo = new THREE.ConeGeometry(2.35, 2.4, 3);
    wingGeo.rotateX(-Math.PI / 2);
    const wing = new THREE.Mesh(wingGeo, primaryMat);
    wing.scale.set(1.05, 0.14, 1.0);
    wing.position.set(0, 0.5, 0.35);
    const heatTrim = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.18, 0.38), secondaryMat);
    heatTrim.position.set(0, 0.48, 1.28);
    // Tall vertical tail fin
    const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.55, 1.15), primaryMat);
    tailFin.position.set(0, 1.55, 1.15);
    tailFin.rotation.x = -0.25;
    const finStripe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 1.05), accentMat);
    finStripe.position.set(0, 1.9, 1.18);
    finStripe.rotation.x = -0.25;
    bodyGroup.add(fuselage, nose, wing, heatTrim, tailFin, finStripe);
  } else if (style === 'ufo') {
    // 🛸 Hovering Alien Flying Saucer!
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 2.15, 0.48, 24), primaryMat);
    saucer.position.set(0, 0.65, 0);
    const lowerDisk = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 1.25, 0.32, 24), darkMat);
    lowerDisk.position.set(0, 0.28, 0);
    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.12, 0.11, 8, 28),
      new THREE.MeshBasicMaterial({ color: 0x00f5ff })
    );
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.set(0, 0.46, 0);
    // Glowing green hover beam ring underneath
    const hoverBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.45, 0.3, 18, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x38ef7d, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    hoverBeam.position.set(0, 0.0, 0);
    // Blinking alien perimeter orbs
    const orbMat = new THREE.MeshBasicMaterial({ color: 0x38ef7d });
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), orbMat);
      orb.position.set(Math.cos(a) * 1.82, 0.72, Math.sin(a) * 1.82);
      bodyGroup.add(orb);
    }
    bodyGroup.add(saucer, lowerDisk, glowRing, hoverBeam);
  } else if (style === 'duck') {
    // 🦆 Giant Yellow LEGO Rubber Duck Mobile!
    const duckBody = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.85, 2.45), primaryMat);
    duckBody.position.set(0, 0.72, 0.15);
    const duckNeck = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.72, 0.95), primaryMat);
    duckNeck.position.set(0, 1.15, -1.18);
    // Cute wide orange duck bill!
    const billTop = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.26, 0.82), secondaryMat);
    billTop.position.set(0, 1.02, -1.92);
    const billBot = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.16, 0.65), secondaryMat);
    billBot.position.set(0, 0.84, -1.82);
    // Big glossy cute duck eyes on the front hood!
    const dEyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const dWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (const dx of [-0.36, 0.36]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), dEyeMat);
      eye.position.set(dx, 1.32, -1.62);
      const gl = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), dWhiteMat);
      gl.position.set(dx - 0.04, 1.37, -1.75);
      bodyGroup.add(eye, gl);
    }
    // Side cute wings + rear duck tail!
    for (const sx of [-1.12, 1.12]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.52, 1.35), primaryMat);
      wing.position.set(sx, 0.84, 0.15);
      wing.rotation.z = sx > 0 ? -0.25 : 0.25;
      bodyGroup.add(wing);
    }
    const duckTail = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.95, 4), primaryMat);
    duckTail.position.set(0, 1.25, 1.45);
    duckTail.rotation.x = 0.65;
    bodyGroup.add(duckBody, duckNeck, billTop, billBot, duckTail);
  } else if (style === 'carriage') {
    // 🐴 Royal Gold & Crimson LEGO Horse-Drawn Carriage!
    const cabinBase = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.72, 2.0), primaryMat);
    cabinBase.position.set(0, 0.78, 0.45);
    const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.16, 2.1), secondaryMat);
    goldTrim.position.set(0, 1.12, 0.45);
    // 4 Golden Canopy Pillars + Royal Crown Roof
    for (const px of [-0.82, 0.82]) {
      for (const pz of [-0.4, 1.28]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.45, 8), secondaryMat);
        post.position.set(px, 1.85, pz);
        bodyGroup.add(post);
      }
    }
    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.22, 1.9), primaryMat);
    roof.position.set(0, 2.58, 0.45);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.45, 6), secondaryMat);
    crown.position.set(0, 2.9, 0.45);
    bodyGroup.add(cabinBase, goldTrim, roof, crown);

    // 3D LEGO White Horse pulling in front!
    const horseMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.28 });
    const maneMat = new THREE.MeshStandardMaterial({ color: 0xffca28, roughness: 0.4 });
    const hoofMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.6 });
    const horse = new THREE.Group();
    horse.position.set(0, 0.0, -1.95);

    const hBody = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.72, 1.45), horseMat);
    hBody.position.set(0, 1.02, 0);
    const hSaddle = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.14, 0.65), primaryMat);
    hSaddle.position.set(0, 1.4, 0.05);
    const hNeck = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.88, 0.52), horseMat);
    hNeck.position.set(0, 1.56, -0.58);
    hNeck.rotation.x = 0.28;
    const hHead = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.44, 0.78), horseMat);
    hHead.position.set(0, 1.92, -0.95);
    hHead.rotation.x = 0.25;
    const hMane = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.85, 0.22), maneMat);
    hMane.position.set(0, 1.72, -0.35);
    const hTail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.75, 0.26), maneMat);
    hTail.position.set(0, 0.96, 0.85);
    hTail.rotation.x = 0.45;
    // Horse ears & eyes
    const hEyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    for (const hx of [-0.18, 0.18]) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.26, 4), horseMat);
      ear.position.set(hx, 2.22, -0.78);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), hEyeMat);
      eye.position.set(hx * 1.25, 1.98, -1.12);
      horse.add(ear, eye);
    }
    // 4 Horse Legs mounted on hip pivots so they gallop dynamically with speed!
    const legSpecs = [
      [-0.26, 0.82, -0.48, 0],
      [0.26, 0.82, -0.48, Math.PI],
      [-0.26, 0.82, 0.48, Math.PI],
      [0.26, 0.82, 0.48, 0],
    ];
    for (const [lx, ly, lz, phase] of legSpecs) {
      const legPivot = new THREE.Group();
      legPivot.position.set(lx, ly, lz);
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.82, 0.22), horseMat);
      leg.position.y = -0.41;
      const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.24), hoofMat);
      hoof.position.y = -0.78;
      legPivot.add(leg, hoof);
      horse.add(legPivot);
      horseLegs.push({ pivot: legPivot, phase });
    }
    // Golden harness shafts connecting horse to carriage!
    for (const sx of [-0.52, 0.52]) {
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 1.8), secondaryMat);
      shaft.position.set(sx, 0.88, -1.15);
      bodyGroup.add(shaft);
    }
    horse.add(hBody, hSaddle, hNeck, hHead, hMane, hTail);
    bodyGroup.add(horse);
  } else if (style === 'f1') {
    // Wide F1 front wing + tapered nosecone + tall rear spoiler
    const frontWing = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, 0.55), secondaryMat);
    frontWing.position.set(0, 0.34, -1.78);
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.34, 1.55), primaryMat);
    nose.position.set(0, 0.62, -1.05);
    nose.rotation.x = 0.12;
    bodyGroup.add(frontWing, nose);

    // Tall F1 Rear Spoiler Wing
    for (const sx of [-0.55, 0.55]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.95, 0.35), darkMat);
      strut.position.set(sx, 1.25, 1.42);
      bodyGroup.add(strut);
    }
    const rearWing = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.16, 0.62), secondaryMat);
    rearWing.position.set(0, 1.72, 1.48);
    const wingEndL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.72), primaryMat);
    wingEndL.position.set(-1.18, 1.65, 1.48);
    const wingEndR = wingEndL.clone();
    wingEndR.position.x = 1.18;
    bodyGroup.add(rearWing, wingEndL, wingEndR);
  } else if (style === 'monster') {
    // Rugged Monster Truck Hood + Front Bull Bar + Roll Cage
    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.68, 0.58, 1.2), primaryMat);
    hood.position.set(0, 0.82, -0.92);
    const bullBar = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.32, 0.36), bumperMat);
    bullBar.position.set(0, 0.62, -1.62);
    bodyGroup.add(hood, bullBar);

    // Roll-cage bars over driver
    const barMat = new THREE.MeshStandardMaterial({ color: preset.accent, roughness: 0.35, metalness: 0.3 });
    for (const sx of [-0.72, 0.72]) {
      const postF = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.35, 8), barMat);
      postF.position.set(sx, 1.55, -0.35);
      postF.rotation.x = -0.22;
      const postB = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.35, 8), barMat);
      postB.position.set(sx, 1.55, 0.85);
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.25, 8), barMat);
      rail.rotation.x = Math.PI / 2;
      rail.position.set(sx, 2.2, 0.25);
      bodyGroup.add(postF, postB, rail);
    }
    const roofBar = new THREE.Mesh(new THREE.BoxGeometry(1.56, 0.12, 0.35), barMat);
    roofBar.position.set(0, 2.2, 0.25);
    bodyGroup.add(roofBar);
  } else if (style === 'cyber') {
    // Futuristic wedge canopy + glowing neon underglow strips + twin rear fins
    const wedge = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.36, 1.4), primaryMat);
    wedge.position.set(0, 0.64, -1.0);
    wedge.rotation.x = 0.26;
    const neonMat = new THREE.MeshBasicMaterial({ color: preset.bumper });
    const underL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 2.5), neonMat);
    underL.position.set(-1.12, 0.32, 0);
    const underR = underL.clone();
    underR.position.x = 1.12;
    const frontStrip = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.16, 0.18), neonMat);
    frontStrip.position.set(0, 0.45, -1.68);
    bodyGroup.add(wedge, underL, underR, frontStrip);

    // Swept cyberpunk rear fins
    for (const sx of [-0.88, 0.88]) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 1.1), secondaryMat);
      fin.position.set(sx, 1.05, 0.95);
      fin.rotation.x = 0.32;
      bodyGroup.add(fin);
    }
  } else {
    // Classic LEGO Go-Kart bumper & sloped hood
    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.42, 0.62), bumperMat);
    frontBumper.position.set(0, 0.52, -1.42);
    const cornerGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.42, 12);
    for (const side of [-1, 1]) {
      const corner = new THREE.Mesh(cornerGeo, bumperMat);
      corner.position.set(side * 1.0, 0.52, -1.35);
      bodyGroup.add(corner);
    }
    const hoodBase = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.32, 1.05), primaryMat);
    hoodBase.position.set(0, 0.72, -0.92);
    hoodBase.rotation.x = 0.22;
    bodyGroup.add(frontBumper, hoodBase);
  }

  // Number decal plate (skip on UFO, duck & train where custom front noses shine)
  if (!['ufo', 'duck', 'train', 'shuttle', 'carriage'].includes(style)) {
    const decalPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.88, 0.88),
      new THREE.MeshStandardMaterial({ map: createNumberTexture(preset), roughness: 0.2 })
    );
    decalPlate.position.set(0, isMonster ? 1.13 : 0.92, -0.96);
    decalPlate.rotation.x = -Math.PI / 2 + (isMonster ? 0 : 0.2);
    bodyGroup.add(decalPlate);

    // Side Pods
    for (const side of [-1, 1]) {
      const podLower = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 1.35), accentMat);
      podLower.position.set(side * 0.96, 0.46, 0.05);
      const podMid = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.22, 1.25), secondaryMat);
      podMid.position.set(side * 0.96, 0.65, 0.08);
      const podTop = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.24, 1.1), primaryMat);
      podTop.position.set(side * 0.94, 0.84, 0.14);
      bodyGroup.add(podLower, podMid, podTop);
    }

    const rearDeck = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.52, 0.85), primaryMat);
    rearDeck.position.set(0, 0.72, 1.02);
    const seatBack = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.65, 0.22), secondaryMat);
    seatBack.position.set(0, 0.95, 0.62);
    seatBack.rotation.x = -0.18;
    bodyGroup.add(rearDeck, seatBack);
  }

  // Exhausts & Boost Flames (cyber & shuttle have triple rocket thrusters!)
  const flames = [];
  const flameOuterGeo = new THREE.ConeGeometry(style === 'shuttle' ? 0.34 : 0.24, style === 'shuttle' ? 1.7 : 1.2, 10);
  flameOuterGeo.rotateX(Math.PI / 2);
  const flameOuterMat = new THREE.MeshBasicMaterial({ color: style === 'shuttle' ? 0xff9500 : 0x00e5ff, transparent: true, opacity: 0.88 });
  const flameInnerGeo = new THREE.ConeGeometry(0.15, 0.9, 8);
  flameInnerGeo.rotateX(Math.PI / 2);
  const flameInnerMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });

  const pipeXs = (style === 'cyber' || style === 'shuttle') ? [-0.55, 0, 0.55] : [-0.42, 0.42];
  for (const sx of pipeXs) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.58, 12), exhaustMat);
    pipe.position.set(sx, 0.96, 1.46);
    pipe.rotation.x = Math.PI / 2 - 0.22;
    bodyGroup.add(pipe);

    const flameGroup = new THREE.Group();
    flameGroup.position.set(sx, 0.92, 2.08);
    const outer = new THREE.Mesh(flameOuterGeo, flameOuterMat);
    const inner = new THREE.Mesh(flameInnerGeo, flameInnerMat);
    inner.position.z = -0.15;
    flameGroup.add(outer, inner);
    flameGroup.visible = false;
    bodyGroup.add(flameGroup);
    flames.push(flameGroup);
  }

  // Steering Wheel
  const steeringPivot = new THREE.Group();
  steeringPivot.position.set(0, 1.18, -0.22);
  steeringPivot.rotation.x = -0.45;
  steeringPivot.add(
    new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 8, 18), darkMat),
    new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.05), darkMat)
  );
  bodyGroup.add(steeringPivot);

  // LEGO Minifigure Driver (6 distinct styles!)
  const driverGroup = new THREE.Group();
  driverGroup.position.set(0, 0.82, 0.16);
  bodyGroup.add(driverGroup);

  const suitMat = new THREE.MeshStandardMaterial({ color: driver.suit, roughness: 0.35 });
  const suitAccentMat = new THREE.MeshStandardMaterial({ color: driver.accent, roughness: 0.35 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd500, roughness: 0.25 });
  const helmetMat = new THREE.MeshStandardMaterial({ color: driver.helmet, roughness: 0.18, metalness: driver.style === 'knight' ? 0.45 : 0.1 });
  const handMat = new THREE.MeshStandardMaterial({ color: driver.hand, roughness: 0.3 });

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.72, 0.42), suitMat);
  torso.position.set(0, 0.36, 0);
  const chestStripe = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.46, 0.44), suitAccentMat);
  chestStripe.position.set(0, 0.38, 0);
  driverGroup.add(torso, chestStripe);

  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.56, 10), suitMat);
    arm.position.set(side * 0.46, 0.46, -0.18);
    arm.rotation.x = Math.PI / 2.6;
    arm.rotation.z = side * 0.22;
    const hand = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.035, 8, 12, Math.PI * 1.45), handMat);
    hand.position.set(side * 0.32, 0.36, -0.38);
    hand.rotation.y = Math.PI / 2;
    driverGroup.add(arm, hand);
  }

  const headMat = new THREE.MeshStandardMaterial({ map: createLegoFaceTexture(driver.beard), roughness: 0.25 });
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.46, 18), [headMat, skinMat, skinMat]);
  head.position.set(0, 0.96, 0);
  // Keep u=0.5 facing -Z (forward)!
  head.rotation.y = 0;
  driverGroup.add(head);

  // Crisp 3D LEGO facial features right on front (-Z) so face is unmistakably clear!
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mouthMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  for (const ex of [-0.095, 0.095]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 8), eyeMat);
    eye.position.set(ex, 1.0, -0.262);
    const sparkle = new THREE.Mesh(new THREE.SphereGeometry(0.013, 6, 6), sparkleMat);
    sparkle.position.set(ex - 0.01, 1.014, -0.292);
    driverGroup.add(eye, sparkle);
  }
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 6, 12, Math.PI), mouthMat);
  smile.position.set(0, 0.915, -0.268);
  smile.rotation.z = Math.PI;
  driverGroup.add(smile);
  if (driver.beard) {
    const beard = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.025, 6, 12, Math.PI), mouthMat);
    beard.position.set(0, 0.905, -0.262);
    beard.rotation.z = Math.PI;
    driverGroup.add(beard);
  }

  if (driver.style === 'cap') {
    // Police cap + badge
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.31, 0.22, 16), helmetMat);
    capTop.position.set(0, 1.24, 0);
    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.06, 0.32), darkMat);
    brim.position.set(0, 1.14, -0.26);
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.06), suitAccentMat);
    badge.position.set(0, 1.24, -0.34);
    driverGroup.add(capTop, brim, badge);
  } else {
    const helmetShell = new THREE.Mesh(
      new THREE.SphereGeometry(driver.style === 'astro' ? 0.42 : 0.37, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.54),
      helmetMat
    );
    helmetShell.position.set(0, 1.04, 0.02);
    const helmetBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.365, 0.35, 0.32, 18, 1, true, -Math.PI * 0.62, Math.PI * 1.24),
      helmetMat
    );
    helmetBack.position.set(0, 0.93, 0.02);
    const visor = new THREE.Mesh(
      new THREE.CylinderGeometry(driver.style === 'astro' ? 0.42 : 0.38, driver.style === 'astro' ? 0.42 : 0.38, 0.24, 16, 1, true, Math.PI * 0.65, Math.PI * 0.7),
      new THREE.MeshStandardMaterial({ color: driver.visor, roughness: 0.08, metalness: 0.25, transparent: true, opacity: driver.visorOp })
    );
    visor.position.set(0, 0.98, 0);
    driverGroup.add(helmetShell, helmetBack, visor);

    if (driver.style === 'knight') {
      // Red plume crest on top of golden knight helmet!
      const plume = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.56), new THREE.MeshStandardMaterial({ color: 0xe53935 }));
      plume.position.set(0, 1.44, 0.06);
      driverGroup.add(plume);
    } else if (driver.style === 'ninja') {
      // Trailing red ninja headband tails
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.48), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      tail.position.set(0, 1.05, 0.44);
      tail.rotation.x = -0.35;
      driverGroup.add(tail);
    }
  }

  // Wheels (oversized for monster truck or offroad mod, gold rims for slick mod!)
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x1e2024, roughness: activeMods.wheel === 'slick' ? 0.35 : 0.85 });
  const rimMat = new THREE.MeshStandardMaterial({
    color: activeMods.wheel === 'slick' ? 0xfbbf24 : activeMods.wheel === 'offroad' ? 0xf97316 : 0x4b5563,
    roughness: 0.3,
    metalness: 0.55,
  });
  const hubMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3, metalness: 0.6 });

  const frontWheelPivots = [];
  const allWheels = [];
  const modWheelMul = activeMods.wheel === 'offroad' ? 1.28 : 1.0;
  const wScale = (isMonster ? 1.55 : 1.0) * modWheelMul;
  const wheelConfigs = [
    { x: -1.18 * (isMonster ? 1.12 : 1), y: 0.44 * wScale, z: -0.98, radius: 0.44 * wScale, width: 0.42 * (isMonster ? 1.35 : 1) * (activeMods.wheel === 'slick' ? 1.18 : 1), front: true },
    { x: 1.18 * (isMonster ? 1.12 : 1), y: 0.44 * wScale, z: -0.98, radius: 0.44 * wScale, width: 0.42 * (isMonster ? 1.35 : 1) * (activeMods.wheel === 'slick' ? 1.18 : 1), front: true },
    { x: -1.22 * (isMonster ? 1.12 : 1), y: 0.48 * wScale, z: 0.94, radius: 0.48 * wScale, width: 0.5 * (isMonster ? 1.35 : 1) * (activeMods.wheel === 'slick' ? 1.24 : 1), front: false },
    { x: 1.22 * (isMonster ? 1.12 : 1), y: 0.48 * wScale, z: 0.94, radius: 0.48 * wScale, width: 0.5 * (isMonster ? 1.35 : 1) * (activeMods.wheel === 'slick' ? 1.24 : 1), front: false },
  ];

  // Visible 3D LEGO Mod Attachments (Wing / Glider & Front Bumper!)
  let gliderMesh = null;
  if (activeMods.wing === 'gt') {
    const gtGroup = new THREE.Group();
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.4 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x0284c7, emissiveIntensity: 0.35, roughness: 0.2 });
    for (const sx of [-0.62, 0.62]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.85, 0.24), strutMat);
      strut.position.set(sx, 1.38, 1.48);
      gtGroup.add(strut);
      const endPlate = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.48, 0.68), bladeMat);
      endPlate.position.set(sx * 1.9, 1.78, 1.56);
      gtGroup.add(endPlate);
    }
    const blade = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 0.52), strutMat);
    blade.position.set(0, 1.78, 1.56);
    blade.rotation.x = 0.16;
    gtGroup.add(blade);
    bodyGroup.add(gtGroup);
  } else if (activeMods.wing === 'glider') {
    gliderMesh = new THREE.Group();
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.5, roughness: 0.3 });
    const sailMat = new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xf59e0b, emissiveIntensity: 0.25, roughness: 0.3, side: THREE.DoubleSide });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xff2a9d, roughness: 0.3 });
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.15, 8), poleMat);
    mast.position.set(0, 1.72, 0.55);
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.08, 1.1), sailMat);
    leftWing.position.set(-0.92, 2.25, 0.55);
    leftWing.rotation.z = 0.14;
    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.08, 1.1), sailMat);
    rightWing.position.set(0.92, 2.25, 0.55);
    rightWing.rotation.z = -0.14;
    const centerBar = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 0.18), trimMat);
    centerBar.position.set(0, 2.24, 0.05);
    gliderMesh.add(mast, leftWing, rightWing, centerBar);
    bodyGroup.add(gliderMesh);
  }

  if (activeMods.bumper === 'spike') {
    const spikeGroup = new THREE.Group();
    const barMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.65, roughness: 0.3 });
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.75, roughness: 0.2 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.34, 0.32), barMat);
    bar.position.set(0, 0.58, -1.78);
    spikeGroup.add(bar);
    for (const sx of [-0.78, -0.26, 0.26, 0.78]) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.62, 6), spikeMat);
      cone.rotation.x = -Math.PI / 2;
      cone.position.set(sx, 0.58, -2.18);
      spikeGroup.add(cone);
    }
    bodyGroup.add(spikeGroup);
  } else if (activeMods.bumper === 'magnet') {
    const magGroup = new THREE.Group();
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.25 });
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.7, roughness: 0.2 });
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.14, 8, 16, Math.PI), redMat);
    arc.rotation.x = Math.PI / 2;
    arc.position.set(0, 0.95, -1.45);
    for (const mx of [-0.45, 0.45]) {
      const tip = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.32), tipMat);
      tip.position.set(mx, 0.95, -1.85);
      magGroup.add(tip);
    }
    magGroup.add(arc);
    bodyGroup.add(magGroup);
  }

  for (const cfg of (isUfo ? [] : wheelConfigs)) {
    const pivot = new THREE.Group();
    pivot.position.set(cfg.x, cfg.y, cfg.z);
    const wheelSpin = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(cfg.radius, cfg.radius, cfg.width, 20), tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(cfg.radius * 0.56, cfg.radius * 0.56, cfg.width + 0.03, 14), rimMat);
    rim.rotation.z = Math.PI / 2;
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(cfg.radius * 0.22, cfg.radius * 0.22, cfg.width + 0.06, 10), hubMat);
    hub.rotation.z = Math.PI / 2;
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(cfg.width + 0.05, cfg.radius * 0.9, 0.08), hubMat);

    wheelSpin.add(tire, rim, hub, spoke);
    pivot.add(wheelSpin);
    root.add(pivot);
    if (cfg.front) frontWheelPivots.push(pivot);
    allWheels.push(wheelSpin);
  }

  return { root, bodyGroup, driverGroup, steeringPivot, frontWheelPivots, allWheels, flames, horseLegs, yLift, preset, mods: activeMods, gliderMesh };
}
