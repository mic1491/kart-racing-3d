import * as THREE from 'three';
import { createLegoKart, createNameplateSprite, createEmoteBubbleSprite, attachBattleBalloons, MOD_CATALOG, KART_ORDER, KART_PRESETS, DRIVER_ORDER, DRIVER_PRESETS } from './kart.js';
import { RaceTrack, TRACK_ORDER, TRACK_CONFIGS } from './track.js';
import { SoundEngine } from './audio.js';
import { ItemManager, ITEM_TYPES, attachKartStatusMeshes } from './items.js';
import { RoomNetwork } from './network.js';

const TOTAL_LAPS = 3;
const CUP_TRACKS = ['village', 'desert', 'sky', 'dino'];
const EMOTE_PHRASES = ['😂 哈哈！', '🔥 借過啦！', '😎 太慢囉！', '🚀 追不上我！', '🦖 救命啊！', '⚡ 吃我尾氣！'];
const SAVE_KEY = 'kart_lego_3d_save_v3';
const UPGRADE_COSTS = [40, 70, 110, 160, 220];

// --- Persistent Save (Unlock Progress, Names, Coins, Upgrades, Per-Car 3D Mods, Medals, Ghosts) ---
function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem('kart_lego_3d_save_v2');
    if (raw) {
      const p = JSON.parse(raw);
      return {
        unlockedCount: Math.max(1, Math.min(TRACK_ORDER.length, p.unlockedCount || 1)),
        p1Name: p.p1Name || '玩家 1',
        p2Name: p.p2Name || '玩家 2',
        coins: Number.isFinite(p.coins) ? p.coins : 50,
        upgrades: {
          engine: p.upgrades?.engine || 0,
          nitro: p.upgrades?.nitro || 0,
          drift: p.upgrades?.drift || 0,
        },
        kartMods: p.kartMods || {},
        medals: p.medals || {},
        bestTimes: p.bestTimes || {},
        ghosts: p.ghosts || {},
      };
    }
  } catch (_) {}
  return {
    unlockedCount: 1,
    p1Name: '玩家 1',
    p2Name: '玩家 2',
    coins: 50,
    upgrades: { engine: 0, nitro: 0, drift: 0 },
    kartMods: {},
    medals: {},
    bestTimes: {},
    ghosts: {},
  };
}

function getKartMods(kartId) {
  const m = (saveData.kartMods && saveData.kartMods[kartId]) || {};
  return { wheel: m.wheel || 'std', wing: m.wing || 'none', bumper: m.bumper || 'none' };
}

function writeSave() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  } catch (_) {}
}

const saveData = loadSave();

// --- DOM Elements ---
const canvas = document.getElementById('game-canvas');
const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const finishScreen = document.getElementById('finish-screen');
const hud = document.getElementById('hud');
const splitDivider = document.getElementById('split-divider');
const countdownEl = document.getElementById('countdown');
const speedLinesEl = document.getElementById('speed-lines');

const p1NameInput = document.getElementById('p1-name-input');
const p2NameInput = document.getElementById('p2-name-input');
const playerCountButtons = document.querySelectorAll('#player-count-selector .pill-btn');
const modeButtons = document.querySelectorAll('#mode-selector .pill-btn');
const trackSelectorEl = document.getElementById('track-selector');
const unlockProgressEl = document.getElementById('unlock-progress');
const unlockAllBtn = document.getElementById('unlock-all-btn');
const driverSelectorEl = document.getElementById('driver-selector');
const kartGridEl = document.getElementById('kart-grid');
const p2KartTabsEl = document.getElementById('p2-kart-tabs');
const controlsGuideEl = document.getElementById('controls-guide');

const netPanelEl = document.getElementById('net-panel');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const roomCodeInput = document.getElementById('room-code-input');
const netStatusEl = document.getElementById('net-status');

const hudTrackName = document.getElementById('hud-track-name');
const hudModeTag = document.getElementById('hud-mode-tag');
const hudTime = document.getElementById('hud-time');
const hudCoinsVal = document.getElementById('hud-coins-val');
const lobbyCoinsEl = document.getElementById('lobby-coins');
const sumTrackEl = document.getElementById('sum-track');
const sumKartEl = document.getElementById('sum-kart');
const sumDriverEl = document.getElementById('sum-driver');
const lobbyTabButtons = document.querySelectorAll('#lobby-tabs .tab-btn');
const lobbyTabPanes = document.querySelectorAll('.tab-pane');
const upgradeButtons = document.querySelectorAll('.upgrade-btn');
const finishRewardEl = document.getElementById('finish-reward');
const minimapCanvas = document.getElementById('minimap');
const minimapCtx = minimapCanvas.getContext('2d');

const hudP2Pane = document.getElementById('hud-p2');
const pHudEls = [0, 1].map((i) => ({
  rank: document.getElementById(`p${i + 1}-rank`),
  suffix: document.getElementById(`p${i + 1}-rank-suffix`),
  name: document.getElementById(`p${i + 1}-hud-name`),
  lap: document.getElementById(`p${i + 1}-lap`),
  speed: document.getElementById(`p${i + 1}-speed`),
  nitroFill: document.getElementById(`p${i + 1}-nitro-fill`),
  banner: document.getElementById(`p${i + 1}-banner`),
  wrongWay: document.getElementById(`p${i + 1}-wrong-way`),
  ink: document.getElementById(`p${i + 1}-ink`),
  slots: [document.getElementById(`p${i + 1}-slot-0`), document.getElementById(`p${i + 1}-slot-1`)],
  bannerTimer: 0,
}));

const finishRankTitle = document.getElementById('finish-rank-title');
const finishBadgeEl = document.getElementById('finish-badge');
const finishSubtitleEl = document.getElementById('finish-subtitle');
const unlockBannerEl = document.getElementById('unlock-banner');
const finishMetaEl = document.getElementById('finish-meta');
const finishTimeEl = document.getElementById('finish-time');
const finishBestLapEl = document.getElementById('finish-best-lap');
const standingsListEl = document.getElementById('standings-list');
const nextTrackBtn = document.getElementById('next-track-btn');

const pauseScreen = document.getElementById('pause-screen');
const pauseBtn = document.getElementById('pause-btn');
const hornBtn = document.getElementById('horn-btn');
const resumeBtn = document.getElementById('resume-btn');
const gamepadStatusEl = document.getElementById('gamepad-status');
const modKartNameEl = document.getElementById('mod-kart-name');
const modWheelRowEl = document.getElementById('mod-wheel-row');
const modWingRowEl = document.getElementById('mod-wing-row');
const modBumperRowEl = document.getElementById('mod-bumper-row');

// Grand Prix Cup & Battle Arena state
let cupRound = 0;
let cupScores = {};
let battleTimer = 90;
let zoomSlowMoTimer = 0;
const gpPrevAction = [false, false];
const gpPrevHorn = [false, false];
const gpState = [
  { accel: false, brake: false, left: false, right: false, drift: false },
  { accel: false, brake: false, left: false, right: false, drift: false },
];
const pauseRestartBtn = document.getElementById('pause-restart-btn');
const pauseMenuBtn = document.getElementById('pause-menu-btn');
const muteBtn = document.getElementById('mute-btn');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const touchToggleBtn = document.getElementById('touch-toggle-btn');
const touchControlsEl = document.getElementById('touch-controls');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const changeKartBtn = document.getElementById('change-kart-btn');

p1NameInput.value = saveData.p1Name;
p2NameInput.value = saveData.p2Name;

// --- Scene, Renderer & Mobile GPU Auto-Optimization ---
const isMobileDevice = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 820;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobileDevice, powerPreference: 'high-performance' });
renderer.setPixelRatio(isMobileDevice ? 1.25 : Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = isMobileDevice ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.2, 720);
const camera2 = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.2, 720);

const hemiLight = new THREE.HemisphereLight(0xdff4ff, 0x3b7a3d, 0.9);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfff8e7, 1.65);
sunLight.position.set(120, 180, 90);
sunLight.castShadow = true;
const shadowRes = isMobileDevice ? 512 : 2048;
sunLight.shadow.mapSize.width = shadowRes;
sunLight.shadow.mapSize.height = shadowRes;
sunLight.shadow.camera.near = 20;
sunLight.shadow.camera.far = 520;
const sd = 240;
sunLight.shadow.camera.left = -sd;
sunLight.shadow.camera.right = sd;
sunLight.shadow.camera.top = sd;
sunLight.shadow.camera.bottom = -sd;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

// --- Audio & Particles ---
const audio = new SoundEngine();

const PARTICLE_COUNT = 160;
const particles = [];
const particleGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const mesh = new THREE.Mesh(particleGeo, mat);
  mesh.visible = false;
  scene.add(mesh);
  particles.push({ mesh, vel: new THREE.Vector3(), life: 0, maxLife: 0.4 });
}
let particleCursor = 0;

function spawnParticle(pos, vel, color, maxLife = 0.35, scale = 1.0) {
  const p = particles[particleCursor];
  particleCursor = (particleCursor + 1) % PARTICLE_COUNT;
  p.mesh.position.copy(pos);
  p.mesh.material.color.setHex(color);
  p.mesh.material.opacity = 0.92;
  p.mesh.scale.setScalar(scale);
  p.mesh.visible = true;
  p.vel.copy(vel);
  p.life = maxLife;
  p.maxLife = maxLife;
}

function updateParticles(dt) {
  for (const p of particles) {
    if (p.life <= 0) continue;
    p.life -= dt;
    if (p.life <= 0) {
      p.mesh.visible = false;
      continue;
    }
    p.mesh.position.addScaledVector(p.vel, dt);
    p.vel.y -= 6 * dt;
    const ratio = p.life / p.maxLife;
    p.mesh.material.opacity = ratio * 0.9;
    p.mesh.scale.setScalar(0.5 + (1 - ratio) * 0.9);
  }
}

// --- Drift Tire Skid Marks Pool ---
const SKID_COUNT = isMobileDevice ? 60 : 140;
const skidMarks = [];
const skidGeo = new THREE.PlaneGeometry(0.42, 1.5);
skidGeo.rotateX(-Math.PI / 2);
const skidMat = new THREE.MeshBasicMaterial({ color: 0x0d0f14, transparent: true, opacity: 0.48, depthWrite: false });
for (let i = 0; i < SKID_COUNT; i++) {
  const m = new THREE.Mesh(skidGeo, skidMat);
  m.visible = false;
  scene.add(m);
  skidMarks.push(m);
}
let skidCursor = 0;
let skidThrottle = 0;
let camShake = 0;

function addSkidMark(x, y, z, yaw) {
  const m = skidMarks[skidCursor];
  skidCursor = (skidCursor + 1) % SKID_COUNT;
  m.position.set(x, y + 0.12, z);
  m.rotation.y = yaw;
  m.visible = true;
}

function clearSkidMarks() {
  for (const m of skidMarks) m.visible = false;
}

function showBannerFor(racer, text, color = '#00f0ff', duration = 1.15) {
  const idx = racer && racer.humanIndex === 1 ? 1 : 0;
  const h = pHudEls[idx];
  h.banner.textContent = text;
  h.banner.style.color = color;
  h.banner.classList.remove('hidden');
  h.bannerTimer = duration;
}

// --- Game State ---
let track = null;
const itemManager = new ItemManager(scene, audio, spawnParticle, showBannerFor);

let gameState = 'menu'; // 'menu' | 'countdown' | 'racing' | 'paused' | 'finished'
let isPaused = false;
let playType = '1'; // '1' | '2' | 'net'
let selectedMode = 'item'; // 'item' | 'speed'
let selectedTrackId = 'village';
let selectedKarts = ['yellow', 'cyan']; // [p1KartId, p2KartId]
let selectedDrivers = ['racer_red', 'racer_black']; // [p1DriverId, p2DriverId]
let activePickSlot = 0; // 0 = P1, 1 = P2

let racers = [];
let humanRacers = []; // [p1] or [p1, p2]
let remoteRacers = new Map(); // slotIndex -> racer (for 4-player LAN/Online room)
let raceTime = 0;
let raceCoinsEarned = 0;
let countdownTimer = 0;
let lastCountdownNum = 4;
let showcaseAngle = 0;

// Ghost Replay Car
let ghostKart = null;
let ghostPlaybackData = null;
let currentGhostLog = [];
let ghostRecordAccum = 0;

// Grand 3D Podium & Confetti Celebration State
let podiumGroup = null;
let podiumCenter = new THREE.Vector3();
let podiumTimer = 0;
let fireworkCooldown = 0;
let podiumSorted = [];
let confettiPieces = [];

function clearPodium() {
  if (podiumGroup) {
    scene.remove(podiumGroup);
    podiumGroup = null;
  }
  podiumSorted = [];
  confettiPieces = [];
  if (confettiCanvas) confettiCanvas.classList.add('hidden');
}

function makePodiumNumberTex(numStr, bgHex, txtHex) {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bgHex;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 116, 116);
  ctx.fillStyle = txtHex;
  ctx.font = '900 76px Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(numStr, 64, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildVictoryPodium(sortedRacers, isFourthPlace) {
  clearPodium();
  podiumGroup = new THREE.Group();
  const basePt = track.points[0].clone();
  const tan0 = track.tangents[0];
  const baseYaw = Math.atan2(tan0.x, tan0.z);
  podiumCenter.set(basePt.x, basePt.y, basePt.z);
  podiumGroup.position.copy(podiumCenter);
  podiumGroup.rotation.y = baseYaw;

  // 3 Stepped LEGO Podium Blocks: 1st (Center, tall gold), 2nd (Left, silver), 3rd (Right, bronze)
  const steps = [
    { x: 0, h: 3.0, col: 0xffc107, bg: '#ffb300', num: '1' },
    { x: -4.4, h: 2.0, col: 0xcbd5e1, bg: '#94a3b8', num: '2' },
    { x: 4.4, h: 1.3, col: 0xd97706, bg: '#b45309', num: '3' },
  ];
  steps.forEach((st) => {
    const mat = new THREE.MeshStandardMaterial({ color: st.col, roughness: 0.25, metalness: 0.35 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(4.0, st.h, 4.4), mat);
    box.position.set(st.x, st.h / 2, 0);
    box.castShadow = true;
    box.receiveShadow = true;
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 1.7),
      new THREE.MeshBasicMaterial({ map: makePodiumNumberTex(st.num, st.bg, '#ffffff') })
    );
    plaque.position.set(st.x, st.h / 2, 2.24);
    podiumGroup.add(box, plaque);
  });

  // Grand golden spotlight pillar arch behind podium
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xaa6600, emissiveIntensity: 0.4, metalness: 0.5 });
  for (const px of [-6.8, 6.8]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 7.5, 10), pillarMat);
    p.position.set(px, 3.75, -2.5);
    podiumGroup.add(p);
  }
  scene.add(podiumGroup);

  // Position all 4 karts onto the 3D Victory Podium!
  podiumSorted = sortedRacers;
  const localSpots = [
    { x: 0, y: 3.0, z: 0 },
    { x: -4.4, y: 2.0, z: 0 },
    { x: 4.4, y: 1.3, z: 0 },
    { x: 8.6, y: 0.0, z: 1.6 }, // 4th place parked beside podium!
  ];
  const cosY = Math.cos(baseYaw);
  const sinY = Math.sin(baseYaw);

  sortedRacers.forEach((r, idx) => {
    const sp = localSpots[Math.min(3, idx)];
    const wx = podiumCenter.x + sp.x * cosY + sp.z * sinY;
    const wz = podiumCenter.z - sp.x * sinY + sp.z * cosY;
    r.podiumBasePos = new THREE.Vector3(wx, podiumCenter.y + sp.y, wz);
    r.podiumYaw = baseYaw + Math.PI; // face forward toward camera
    r.pos.copy(r.podiumBasePos);
    r.yaw = r.podiumYaw;
    r.speed = 0;
    r.spinTimer = 0;
    r.waterTrapTimer = 0;
    r.freezeTimer = 0;
  });

  // Initialize Full-Screen Confetti Rain!
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.classList.remove('hidden');
  const cols = isFourthPlace
    ? ['#60a5fa', '#93c5fd', '#cbd5e1', '#fde047']
    : ['#ff3b30', '#ffdd00', '#00e5ff', '#38ef7d', '#ff2a9d', '#a855f7', '#ffffff'];
  confettiPieces = [];
  const count = isFourthPlace ? 55 : 140;
  for (let i = 0; i < count; i++) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 10,
      vy: 110 + Math.random() * 190,
      vx: (Math.random() - 0.5) * 80,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 8,
      color: cols[i % cols.length],
    });
  }
  podiumTimer = 0;
  fireworkCooldown = 0.2;
}

function updateVictoryCelebration(dt) {
  if (gameState !== 'finished' || !podiumGroup) return;
  podiumTimer += dt;

  // Bounce Top 3 karts joyfully; 4th place does a funny wobble!
  podiumSorted.forEach((r, idx) => {
    if (!r.podiumBasePos) return;
    if (idx < 3) {
      const bounce = Math.abs(Math.sin(podiumTimer * (5.2 - idx * 0.6) + idx)) * (0.65 - idx * 0.12);
      r.kart.root.position.set(r.podiumBasePos.x, r.podiumBasePos.y + bounce, r.podiumBasePos.z);
      r.kart.root.rotation.y = r.podiumYaw + Math.sin(podiumTimer * 2.4 + idx) * 0.22;
      for (const fl of r.kart.flames) fl.visible = idx === 0;
    } else {
      r.kart.root.position.copy(r.podiumBasePos);
      r.kart.root.rotation.y = r.podiumYaw + Math.sin(podiumTimer * 6) * 0.12;
      for (const fl of r.kart.flames) fl.visible = false;
    }
  });

  // Launch 3D Fireworks behind the podium!
  fireworkCooldown -= dt;
  if (fireworkCooldown <= 0) {
    fireworkCooldown = 0.55 + Math.random() * 0.45;
    const fwCols = [0xffdd00, 0x00f5ff, 0xff2a9d, 0x38ef7d, 0xff5722, 0xa855f7];
    const col = fwCols[Math.floor(Math.random() * fwCols.length)];
    const burstOrigin = new THREE.Vector3(
      podiumCenter.x + (Math.random() - 0.5) * 26,
      podiumCenter.y + 11 + Math.random() * 9,
      podiumCenter.z + (Math.random() - 0.5) * 22
    );
    for (let k = 0; k < 24; k++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const spd = 8 + Math.random() * 14;
      spawnParticle(
        burstOrigin,
        new THREE.Vector3(Math.sin(phi) * Math.cos(theta) * spd, Math.cos(phi) * spd + 4, Math.sin(phi) * Math.sin(theta) * spd),
        col,
        0.95,
        1.35
      );
    }
    audio.playFireworkPop();
  }

  // Update 2D Confetti Canvas
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;
  confettiCtx.clearRect(0, 0, w, h);
  for (const p of confettiPieces) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vrot * dt;
    if (p.y > h + 20) {
      p.y = -20;
      p.x = Math.random() * w;
    }
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  }
}

// --- 4-Player LAN / Online Room Network ---
const net = new RoomNetwork({
  onStatus(text, kind) {
    netStatusEl.textContent = text;
    netStatusEl.className = 'net-status' + (kind === 'connected' ? ' connected' : kind === 'error' ? ' error' : '');
  },
  onRoster() {
    if (gameState === 'menu') setupShowcase();
  },
  onStartRace(msg) {
    selectedTrackId = msg.trackId || 'village';
    selectedMode = msg.mode || 'item';
    startRace(false, msg);
  },
  onRemoteState(slot, msg) {
    const r = remoteRacers.get(slot);
    if (!r) return;
    r.remoteTarget = {
      x: msg.x,
      y: msg.y || 0,
      z: msg.z,
      yaw: msg.yaw,
      speed: msg.speed,
      driftVisualYaw: msg.dy || 0,
      steerInput: msg.st || 0,
      boostTimer: msg.bt || 0,
      shieldTimer: msg.sh || 0,
      waterTrapTimer: msg.wt || 0,
      spinTimer: msg.sp || 0,
      lap: msg.lap || 1,
      totalProgress: msg.prog || 0,
      finished: !!msg.fin,
      finishTime: msg.ft || 0,
    };
  },
});

function getLocalNetInfo() {
  return {
    name: (p1NameInput.value.trim() || '玩家 1').slice(0, 10),
    kartId: selectedKarts[0],
    driverId: selectedDrivers[0],
  };
}

createRoomBtn.addEventListener('click', () => net.createRoom(getLocalNetInfo()));
joinRoomBtn.addEventListener('click', () => net.joinRoom(roomCodeInput.value, getLocalNetInfo()));

// --- Input ---
const keys = {};
const actionQueued = [false, false];

window.addEventListener('keydown', (e) => {
  // Don't hijack typing in name / room inputs
  if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
  keys[e.code] = true;

  if (gameState === 'racing') {
    if (e.code === 'Space' || (playType !== '2' && (e.code === 'ControlLeft' || e.code === 'ControlRight'))) {
      e.preventDefault();
      actionQueued[0] = true;
    }
    if (playType === '2' && (e.code === 'Enter' || e.code === 'Period' || e.code === 'ControlRight')) {
      e.preventDefault();
      actionQueued[1] = true;
    }
  }
  if (e.code === 'KeyR' && (gameState === 'racing' || gameState === 'countdown') && playType !== 'net') {
    startRace();
  }
  if ((e.code === 'KeyP' || e.code === 'Escape') && (gameState === 'racing' || gameState === 'paused')) {
    togglePause();
  }
  if (e.code === 'KeyH' && (gameState === 'racing' || gameState === 'countdown') && humanRacers[0]) {
    triggerHornEmote(humanRacers[0]);
  }
  if (e.code === 'KeyM' && playType === '2' && (gameState === 'racing' || gameState === 'countdown') && humanRacers[1]) {
    triggerHornEmote(humanRacers[1]);
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

function bindTouchHold(btnId, keyCode) {
  const el = document.getElementById(btnId);
  if (!el) return;
  const down = (e) => { e.preventDefault(); keys[keyCode] = true; el.classList.add('pressed'); };
  const up = (e) => { e.preventDefault(); keys[keyCode] = false; el.classList.remove('pressed'); };
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('pointerleave', up);
}

bindTouchHold('btn-left', 'KeyA');
bindTouchHold('btn-right', 'KeyD');
bindTouchHold('btn-gas', 'KeyW');
bindTouchHold('btn-brake', 'KeyS');
bindTouchHold('btn-drift', 'ShiftLeft');

const btnUse = document.getElementById('btn-use');
if (btnUse) {
  btnUse.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (gameState === 'racing') actionQueued[0] = true;
  });
}

let touchVisible = window.matchMedia('(pointer: coarse)').matches;
touchControlsEl.classList.toggle('hidden', !touchVisible);
touchToggleBtn.addEventListener('click', (e) => {
  e.currentTarget.blur();
  touchVisible = !touchVisible;
  touchControlsEl.classList.toggle('hidden', !touchVisible || playType === '2');
});

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Build Lobby UI Dynamically ---
// Lobby Tab Switching
lobbyTabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    lobbyTabButtons.forEach((b) => b.classList.toggle('active', b === btn));
    lobbyTabPanes.forEach((p) => p.classList.toggle('active', p.id === `tab-${target}`));
  });
});

function updateSetupSummary() {
  const tCfg = TRACK_CONFIGS[selectedTrackId] || TRACK_CONFIGS.village;
  const kCfg = KART_PRESETS[selectedKarts[0]] || KART_PRESETS.yellow;
  const dCfg = DRIVER_PRESETS[selectedDrivers[0]] || DRIVER_PRESETS.racer_red;
  if (sumTrackEl) sumTrackEl.textContent = `${tCfg.icon} ${tCfg.name}`;
  if (sumKartEl) sumKartEl.textContent = kCfg.name;
  if (sumDriverEl) sumDriverEl.textContent = `${dCfg.icon} ${dCfg.name}`;
}

function renderGarageUI() {
  lobbyCoinsEl.textContent = saveData.coins;
  for (const key of ['engine', 'nitro', 'drift']) {
    const lv = saveData.upgrades[key] || 0;
    const lvEl = document.getElementById(`upg-${key}-lv`);
    const costEl = document.getElementById(`upg-${key}-cost`);
    const btn = document.querySelector(`.upgrade-btn[data-upg="${key}"]`);
    if (!lvEl || !costEl || !btn) continue;
    lvEl.textContent = lv >= 5 ? 'MAX' : `Lv.${lv}`;
    if (lv >= 5) {
      costEl.textContent = '滿級';
      btn.disabled = true;
    } else {
      const cost = UPGRADE_COSTS[lv];
      costEl.textContent = cost;
      btn.disabled = saveData.coins < cost;
    }
  }
  renderModLoadoutUI();
}

function renderModLoadoutUI() {
  if (!modWheelRowEl || !modWingRowEl || !modBumperRowEl) return;
  const slot = playType === '2' ? activePickSlot : 0;
  const kartId = selectedKarts[slot];
  const preset = KART_PRESETS[kartId] || KART_PRESETS.yellow;
  if (modKartNameEl) modKartNameEl.textContent = `${preset.name} #${preset.number}`;
  const curMods = getKartMods(kartId);

  const rows = [
    ['wheel', modWheelRowEl],
    ['wing', modWingRowEl],
    ['bumper', modBumperRowEl],
  ];
  for (const [cat, el] of rows) {
    el.innerHTML = '';
    for (const opt of MOD_CATALOG[cat]) {
      const b = document.createElement('button');
      b.className = 'pill-btn' + (curMods[cat] === opt.id ? ' selected' : '');
      b.textContent = `${opt.icon} ${opt.name}`;
      b.title = opt.desc;
      b.addEventListener('click', () => {
        if (!saveData.kartMods) saveData.kartMods = {};
        if (!saveData.kartMods[kartId]) saveData.kartMods[kartId] = { wheel: 'std', wing: 'none', bumper: 'none' };
        saveData.kartMods[kartId][cat] = opt.id;
        writeSave();
        audio.init();
        audio.playBeep(660, 0.08, 0.08);
        renderModLoadoutUI();
        if (gameState === 'menu') setupShowcase();
      });
      el.appendChild(b);
    }
  }
}

function triggerHornEmote(r, customPhrase = null) {
  if (!r || !r.kart || !r.kart.root) return;
  if (r.emoteSprite) {
    r.kart.root.remove(r.emoteSprite);
    r.emoteSprite = null;
  }
  const phrase = customPhrase || EMOTE_PHRASES[Math.floor(Math.random() * EMOTE_PHRASES.length)];
  const sp = createEmoteBubbleSprite(phrase);
  r.kart.root.add(sp);
  r.emoteSprite = sp;
  r.emoteTimer = 2.2;
  if (!customPhrase) {
    audio.init();
    audio.playHorn();
  }
}

function triggerCamZoom(humanIdx, targetRacer, duration = 0.9, fov = 42, sideOffset = 2.4, slowMoDur = 0) {
  const st = camStates[humanIdx];
  if (!st || !targetRacer) return;
  st.zoom = { target: targetRacer, timer: duration, maxDur: duration, fov, sideOffset };
  if (slowMoDur > 0 && playType === '1') {
    zoomSlowMoTimer = Math.max(zoomSlowMoTimer, slowMoDur);
  }
}

function popBattleBalloon(victim) {
  if (selectedMode !== 'battle' || !victim || victim.eliminated || victim.balloonGrace > 0) return;
  victim.balloonGrace = 2.0;
  victim.balloons = Math.max(0, (victim.balloons || 0) - 1);
  if (victim.balloonMeshes && victim.balloonMeshes[victim.balloons]) {
    const b = victim.balloonMeshes[victim.balloons];
    b.mesh.visible = false;
    for (let k = 0; k < 14; k++) {
      spawnParticle(
        victim.pos.clone().add(new THREE.Vector3(0, 2.4, 0)),
        new THREE.Vector3((Math.random() - 0.5) * 14, 4 + Math.random() * 6, (Math.random() - 0.5) * 14),
        b.color,
        0.55,
        1.1
      );
    }
  }
  audio.playBalloonPop();
  if (victim.balloons <= 0) {
    victim.eliminated = true;
    victim.finishTime = raceTime;
    victim.speed *= 0.2;
    if (victim.isHuman) showBannerFor(victim, '💥 氣球全破！淘汰出局！', '#ff3b30', 2.2);
  } else if (victim.isHuman) {
    showBannerFor(victim, `🎈 氣球破了一顆！剩餘 ${victim.balloons} 顆！`, '#ff9500', 1.4);
  }
}

function pollGamepads() {
  if (!navigator.getGamepads) return;
  const rawPads = navigator.getGamepads();
  const activePads = Array.from(rawPads).filter((g) => g && g.connected);
  const connectedCount = activePads.length;

  for (let i = 0; i < 2; i++) {
    const gp = activePads[i];
    if (gp) {
      const ax0 = gp.axes[0] || 0;
      const ax1 = gp.axes[1] || 0;
      // Support USB Arcade Stick POV Hat (axes[9] on Zero-Delay / DragonRise encoders)
      let hatUp = false, hatDown = false, hatLeft = false, hatRight = false;
      if (gp.axes.length > 9 && gp.axes[9] <= 1.05) {
        const h = gp.axes[9];
        if (Math.abs(h + 1.0) < 0.15) hatUp = true;
        else if (Math.abs(h + 0.714) < 0.15) { hatUp = true; hatRight = true; }
        else if (Math.abs(h + 0.428) < 0.15) hatRight = true;
        else if (Math.abs(h + 0.143) < 0.15) { hatDown = true; hatRight = true; }
        else if (Math.abs(h - 0.143) < 0.15) hatDown = true;
        else if (Math.abs(h - 0.428) < 0.15) { hatDown = true; hatLeft = true; }
        else if (Math.abs(h - 0.714) < 0.15) hatLeft = true;
        else if (Math.abs(h - 1.0) < 0.15) { hatUp = true; hatLeft = true; }
      }
      const btns = gp.buttons || [];
      const b = (idx) => !!(btns[idx] && (btns[idx].pressed || btns[idx].value > 0.35));
      gpState[i] = {
        accel: b(0) || b(7) || ax1 < -0.38 || hatUp,
        brake: b(1) || b(6) || ax1 > 0.38 || hatDown,
        left: ax0 < -0.28 || b(14) || hatLeft,
        right: ax0 > 0.28 || b(15) || hatRight,
        drift: b(2) || b(5),
      };
      const actNow = b(3) || b(4);
      if (actNow && !gpPrevAction[i]) actionQueued[i] = true;
      gpPrevAction[i] = actNow;

      const hornNow = b(8) || b(9);
      if (hornNow && !gpPrevHorn[i] && humanRacers[i]) triggerHornEmote(humanRacers[i]);
      gpPrevHorn[i] = hornNow;
    } else {
      gpState[i] = { accel: false, brake: false, left: false, right: false, drift: false };
    }
  }
  if (gamepadStatusEl) {
    gamepadStatusEl.classList.toggle('hidden', connectedCount === 0);
    if (connectedCount > 0) gamepadStatusEl.textContent = `🕹️ 已連接 ${connectedCount} 支搖桿/手把`;
  }
}

upgradeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.upg;
    const lv = saveData.upgrades[key] || 0;
    if (lv >= 5) return;
    const cost = UPGRADE_COSTS[lv];
    if (saveData.coins < cost) return;
    saveData.coins -= cost;
    saveData.upgrades[key] = lv + 1;
    writeSave();
    audio.init();
    audio.playCoin();
    renderGarageUI();
  });
});

function renderTrackButtons() {
  trackSelectorEl.innerHTML = '';
  const medalCount = Object.values(saveData.medals || {}).filter(Boolean).length;
  unlockProgressEl.textContent = `${medalCount} / ${TRACK_ORDER.length}`;

  TRACK_ORDER.forEach((id, idx) => {
    const cfg = TRACK_CONFIGS[id];
    const medal = saveData.medals[id] || '';
    const btn = document.createElement('button');
    btn.className = 'pill-btn' + (id === selectedTrackId ? ' selected' : '');
    btn.textContent = `${cfg.icon} ${idx + 1}. ${cfg.name} ${medal}`.trim();
    btn.title = saveData.bestTimes[id] ? `最快紀錄：${formatTime(saveData.bestTimes[id])}` : cfg.name;
    btn.addEventListener('click', () => {
      selectedTrackId = id;
      renderTrackButtons();
      updateSetupSummary();
      loadTrack(id);
      setupShowcase();
    });
    trackSelectorEl.appendChild(btn);
  });
}

function renderDriverButtons() {
  driverSelectorEl.innerHTML = '';
  const slot = playType === '2' ? activePickSlot : 0;
  for (const id of DRIVER_ORDER) {
    const d = DRIVER_PRESETS[id];
    const btn = document.createElement('button');
    btn.className = 'pill-btn' + (selectedDrivers[slot] === id ? ' selected' : '');
    btn.textContent = `${d.icon} ${d.name}`;
    btn.addEventListener('click', () => {
      selectedDrivers[slot] = id;
      renderDriverButtons();
      updateSetupSummary();
      if (gameState === 'menu') setupShowcase();
      if (playType === 'net' && net.connected) net.sendHello(getLocalNetInfo());
    });
    driverSelectorEl.appendChild(btn);
  }
}

function renderKartCards() {
  kartGridEl.innerHTML = '';
  for (const id of KART_ORDER) {
    const p = KART_PRESETS[id];
    const isP1 = selectedKarts[0] === id;
    const isP2 = playType === '2' && selectedKarts[1] === id;

    const card = document.createElement('div');
    card.className = 'kart-card' + (isP1 ? ' selected-p1' : '') + (isP2 ? ' selected-p2' : '');
    card.innerHTML = `
      <div class="pick-badges">
        ${isP1 ? '<span class="pick-badge p1">P1</span>' : ''}
        ${isP2 ? '<span class="pick-badge p2">P2</span>' : ''}
      </div>
      <div class="kart-top-row">
        <div class="kart-swatch" style="background:${p.swatchCss}">#${p.number}</div>
        <div class="kart-title-wrap">
          <h3>${p.name}</h3>
          <span class="style-tag">${p.styleLabel}</span>
        </div>
      </div>
      <div class="stat-row"><span>極速</span><div class="stat-bar"><div style="width:${p.statSpeed}%"></div></div></div>
      <div class="stat-row"><span>甩尾</span><div class="stat-bar"><div style="width:${p.statDrift}%"></div></div></div>
    `;
    card.addEventListener('click', () => {
      const slot = playType === '2' ? activePickSlot : 0;
      selectedKarts[slot] = id;
      renderKartCards();
      renderModLoadoutUI();
      updateSetupSummary();
      if (gameState === 'menu') setupShowcase();
      if (playType === 'net' && net.connected) net.sendHello(getLocalNetInfo());
    });
    kartGridEl.appendChild(card);
  }
}

function updateLobbyControlsGuide() {
  if (playType === '2') {
    controlsGuideEl.innerHTML = `
      <span><b>P1(左)</b>：<kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> + <kbd>左Shift</kbd> 甩尾 + <kbd>Space</kbd> 道具</span>
      <span><b>P2(右)</b>：<kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> + <kbd>右Shift</kbd>/<kbd>/</kbd> 甩尾 + <kbd>Enter</kbd> 道具</span>
    `;
  } else {
    controlsGuideEl.innerHTML = `
      <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / <kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> 駕駛</span>
      <span><kbd>Shift</kbd> 甩尾小噴</span>
      <span><kbd>Space</kbd> 道具 / N2O</span>
      <span><kbd>R</kbd> 重置</span>
    `;
  }
}

// Lobby event bindings
p1NameInput.addEventListener('input', () => {
  saveData.p1Name = p1NameInput.value.trim() || '玩家 1';
  writeSave();
  if (gameState === 'menu') setupShowcase();
  if (playType === 'net' && net.connected) net.sendHello(getLocalNetInfo());
});

p2NameInput.addEventListener('input', () => {
  saveData.p2Name = p2NameInput.value.trim() || '玩家 2';
  writeSave();
  if (gameState === 'menu') setupShowcase();
});

playerCountButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    playerCountButtons.forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    playType = btn.dataset.players;
    p2NameInput.classList.toggle('hidden', playType !== '2');
    p2KartTabsEl.classList.toggle('hidden', playType !== '2');
    netPanelEl.classList.toggle('hidden', playType !== 'net');
    if (playType !== '2') activePickSlot = 0;
    renderKartCards();
    updateLobbyControlsGuide();
    setupShowcase();
  });
});

p2KartTabsEl.querySelectorAll('.pill-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    p2KartTabsEl.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    activePickSlot = Number(btn.dataset.pickFor);
    renderDriverButtons();
  });
});

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    modeButtons.forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMode = btn.dataset.mode;
    if (selectedMode === 'cup') {
      cupRound = 0;
      cupScores = {};
      selectedTrackId = CUP_TRACKS[0];
    }
    if (gameState === 'menu') {
      loadTrack(selectedTrackId);
      setupShowcase();
    }
  });
});

if (unlockAllBtn) {
  unlockAllBtn.addEventListener('click', () => {
    saveData.unlockedCount = TRACK_ORDER.length;
    writeSave();
    renderTrackButtons();
  });
}

function isItemModeActive() {
  return selectedMode === 'item' || selectedMode === 'battle' || selectedMode === 'cup';
}

// --- Track & Racers ---
function loadTrack(trackId) {
  if (track) track.dispose();
  selectedTrackId = trackId;
  track = new RaceTrack(scene, trackId, selectedMode === 'battle');

  const cfg = track.config;
  scene.background = new THREE.Color(cfg.skyColor);
  scene.fog = new THREE.Fog(cfg.fogColor, 185, 520);
  hemiLight.color.setHex(cfg.hemiSky);
  hemiLight.groundColor.setHex(cfg.hemiGround);
  hemiLight.intensity = cfg.hemiIntensity;
  sunLight.color.setHex(cfg.sunColor);
  sunLight.intensity = cfg.sunIntensity;

  itemManager.onRacerHit = (victim) => popBattleBalloon(victim);
  itemManager.setupForTrack(track, isItemModeActive());
}

function createRacer(presetKey, slotIndex, displayName, controlType, humanIndex = -1, driverKey = 'racer_red') {
  // controlType: 'human' | 'ai' | 'remote'
  const mods = controlType === 'human'
    ? getKartMods(presetKey)
    : {
        wheel: ['std', 'slick', 'offroad'][slotIndex % 3],
        wing: ['none', 'gt', 'glider'][(slotIndex + 1) % 3],
        bumper: ['none', 'spike', 'magnet'][(slotIndex + 2) % 3],
      };
  const kartObj = createLegoKart(presetKey, driverKey, mods);
  const statusMeshes = attachKartStatusMeshes(kartObj.root);
  const balloonMeshes = selectedMode === 'battle' ? attachBattleBalloons(kartObj.root) : null;
  const badgeCol = humanIndex === 0 ? '#ffdd00' : humanIndex === 1 ? '#00f5ff' : '#94a3b8';
  const nameplate = createNameplateSprite(displayName, badgeCol, controlType !== 'ai');
  kartObj.root.add(nameplate);

  const start = track.getStartTransform(slotIndex);
  kartObj.root.position.copy(start.position);
  kartObj.root.rotation.y = start.yaw;
  scene.add(kartObj.root);

  return {
    id: presetKey,
    name: displayName,
    kartName: kartObj.preset.name,
    controlType,
    isHuman: controlType === 'human',
    humanIndex,
    kart: kartObj,
    mods,
    statusMeshes,
    balloonMeshes,
    balloons: 3,
    balloonGrace: 0,
    eliminated: false,
    emoteSprite: null,
    emoteTimer: 0,
    airTrickTimer: 0,
    airTrickDone: false,
    pendingTrickBoost: false,
    hazardCooldown: 0,
    groundY: start.position.y,
    pos: start.position.clone(),
    velY: 0,
    hopY: 0,
    hopVel: 0,
    squashTimer: 0,
    roadPitch: 0,
    rampCooldown: 0,
    shortcutJump: null,
    shortcutCooldown: 0,
    cannonState: null,
    teleportState: null,
    fallingTimer: 0,
    obstacleCooldown: 0,
    yaw: start.yaw,
    moveYaw: start.yaw,
    lastRank: slotIndex + 1,
    overtakeCooldown: 0,
    gallopPhase: 0,
    speed: 0,
    steerInput: 0,
    isDrifting: false,
    driftDir: 0,
    driftTime: 0,
    driftVisualYaw: 0,
    nitroGauge: 0,
    nitroSlots: 0,
    boostTimer: 0,
    miniBoostTimer: 0,
    padCooldown: 0,
    items: [],
    shieldTimer: 0,
    spinTimer: 0,
    waterTrapTimer: 0,
    freezeTimer: 0,
    devilTimer: 0,
    squidTimer: 0,
    flattenedTimer: 0,
    dinoCooldown: 0,
    blizzardTimer: 0,
    meteorSlowTimer: 0,
    tireBuffTimer: 0,
    engineBuffTimer: 0,
    starTimer: 0,
    magnetTimer: 0,
    magnetTarget: null,
    aiItemDelay: 1.5 + Math.random() * 2.0,
    remoteTarget: null,
    trackIndex: start.trackIndex,
    trackT: start.trackIndex / track.samples,
    lap: 1,
    passedHalfway: false,
    totalProgress: 0,
    lapStartTime: 0,
    bestLapTime: Infinity,
    finished: false,
    finishTime: 0,
    aiLaneOffset: (slotIndex % 2 === 0 ? -3.4 : 3.4) + (Math.random() - 0.5) * 1.5,
    aiSkill: 0.87 + slotIndex * 0.032,
    aiLookAhead: 11 + slotIndex * 2,
  };
}

function clearRacers() {
  for (const r of racers) scene.remove(r.kart.root);
  racers = [];
  humanRacers = [];
  remoteRacers.clear();
  if (ghostKart) {
    scene.remove(ghostKart.root);
    ghostKart = null;
  }
}

function spawnGhostKartIfAvailable() {
  if (playType !== '1') return;
  const savedGhost = saveData.ghosts[selectedTrackId];
  if (!savedGhost || savedGhost.length < 4) {
    ghostPlaybackData = null;
    return;
  }
  ghostPlaybackData = savedGhost;
  ghostKart = createLegoKart(selectedKarts[0], selectedDrivers[0]);
  ghostKart.root.traverse((obj) => {
    if (obj.isMesh && obj.material) {
      const ghostMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.36,
        wireframe: false,
      });
      obj.material = ghostMat;
    }
  });
  ghostKart.root.add(createNameplateSprite('👻 你的最快紀錄', '#00f5ff', true));
  const [_, gx, gy, gz, gyaw] = savedGhost[0];
  ghostKart.root.position.set(gx, gy, gz);
  ghostKart.root.rotation.y = gyaw;
  scene.add(ghostKart.root);
}

function pickRemainingKarts(used, count) {
  const pool = KART_ORDER.filter((id) => !used.includes(id));
  const out = [];
  for (let i = 0; i < count; i++) out.push(pool[i % pool.length] || KART_ORDER[i]);
  return out;
}

const AI_NAMES = ['積木小旋風', '氮氣阿強', '甩尾莉莉', '極速機器人'];

function setupShowcase(netStartMsg = null) {
  clearRacers();
  const p1Name = (p1NameInput.value.trim() || '玩家 1').slice(0, 10);
  const p2Name = (p2NameInput.value.trim() || '玩家 2').slice(0, 10);

  if (playType === '2') {
    const others = pickRemainingKarts(selectedKarts, 2);
    const r0 = createRacer(selectedKarts[0], 0, p1Name, 'human', 0, selectedDrivers[0]);
    const r1 = createRacer(selectedKarts[1], 1, p2Name, 'human', 1, selectedDrivers[1]);
    const r2 = createRacer(others[0], 2, AI_NAMES[0], 'ai', -1, DRIVER_ORDER[2]);
    const r3 = createRacer(others[1], 3, AI_NAMES[1], 'ai', -1, DRIVER_ORDER[3]);
    racers = [r0, r1, r2, r3];
    humanRacers = [r0, r1];
  } else if (playType === 'net' && net.connected) {
    const roster = (netStartMsg && netStartMsg.roster) ? netStartMsg.roster : net.roster;
    const bySlot = new Map(roster.map((item) => [item.slot, item]));
    const usedKarts = roster.map((item) => item.kartId);
    const aiKarts = pickRemainingKarts(usedKarts, 4);

    racers = [];
    humanRacers = [];
    remoteRacers.clear();
    let aiIdx = 0;

    for (let slot = 0; slot < 4; slot++) {
      const info = bySlot.get(slot);
      if (info) {
        const isMe = slot === net.mySlot;
        const r = createRacer(info.kartId || 'yellow', slot, info.name || `玩家 ${slot + 1}`, isMe ? 'human' : 'remote', isMe ? 0 : -1, info.driverId || 'racer_red');
        racers.push(r);
        if (isMe) humanRacers.push(r);
        else remoteRacers.set(slot, r);
      } else {
        const r = createRacer(aiKarts[aiIdx], slot, AI_NAMES[aiIdx % AI_NAMES.length], 'ai', -1, DRIVER_ORDER[(slot + 2) % DRIVER_ORDER.length]);
        racers.push(r);
        aiIdx++;
      }
    }
    if (humanRacers.length === 0 && racers.length > 0) humanRacers.push(racers[0]);
  } else {
    const others = pickRemainingKarts([selectedKarts[0]], 3);
    const r0 = createRacer(selectedKarts[0], 0, p1Name, 'human', 0, selectedDrivers[0]);
    const r1 = createRacer(others[0], 1, AI_NAMES[0], 'ai', -1, DRIVER_ORDER[1]);
    const r2 = createRacer(others[1], 2, AI_NAMES[1], 'ai', -1, DRIVER_ORDER[2]);
    const r3 = createRacer(others[2], 3, AI_NAMES[2], 'ai', -1, DRIVER_ORDER[4]);
    racers = [r0, r1, r2, r3];
    humanRacers = [r0];
  }
}

function returnToMenu() {
  gameState = 'menu';
  audio.stopBgm();
  audio.setFinalLap(false);
  audio.updateDrive(0, false, false, false);
  clearSkidMarks();
  clearPodium();
  finishScreen.classList.add('hidden');
  hud.classList.add('hidden');
  hud.classList.remove('split-mode');
  splitDivider.classList.add('hidden');
  countdownEl.classList.add('hidden');
  speedLinesEl.classList.remove('active');
  startScreen.classList.remove('hidden');
  renderTrackButtons();
  renderGarageUI();
  loadTrack(selectedTrackId);
  setupShowcase();
}

function startRace(broadcastIfHost = true, netStartMsg = null) {
  if (playType === 'net' && net.connected && net.role === 'host' && broadcastIfHost) {
    net.sendStart({
      trackId: selectedTrackId,
      mode: selectedMode,
      hostInfo: getLocalNetInfo(),
      guestInfo: net.remoteInfo || { name: '對手', kartId: 'cyan' },
    });
  }

  audio.init();
  audio.stopBgm();
  audio.setFinalLap(false);
  clearSkidMarks();
  clearPodium();
  loadTrack(selectedTrackId);
  setupShowcase(netStartMsg);
  spawnGhostKartIfAvailable();

  startScreen.classList.add('hidden');
  finishScreen.classList.add('hidden');
  hud.classList.remove('hidden');
  speedLinesEl.classList.remove('active');

  const isSplit = playType === '2';
  hud.classList.toggle('split-mode', isSplit);
  splitDivider.classList.toggle('hidden', !isSplit);
  hudP2Pane.classList.toggle('hidden', !isSplit);
  touchControlsEl.classList.toggle('hidden', !touchVisible || isSplit);

  hudTrackName.textContent = selectedMode === 'battle'
    ? '🎈 氣球競技場'
    : selectedMode === 'cup'
      ? `🏆 第${cupRound + 1}/4關 ${track.config.icon}${track.config.name}`
      : `${track.config.icon} ${track.config.name}`;
  hudModeTag.textContent = selectedMode === 'battle' ? '氣球亂鬥' : selectedMode === 'cup' ? '錦標賽' : selectedMode === 'item' ? '道具' : '競速';
  battleTimer = 90;
  pHudEls[0].name.textContent = humanRacers[0].name;
  pHudEls[0].banner.classList.add('hidden');
  pHudEls[0].wrongWay.classList.add('hidden');
  if (humanRacers[1]) {
    pHudEls[1].name.textContent = humanRacers[1].name;
    pHudEls[1].banner.classList.add('hidden');
    pHudEls[1].wrongWay.classList.add('hidden');
  }

  gameState = 'countdown';
  countdownTimer = 3.2;
  lastCountdownNum = 4;
  raceTime = 0;
  raceCoinsEarned = 0;
  currentGhostLog = [];
  ghostRecordAccum = 0;
  hudCoinsVal.textContent = '0';
  actionQueued[0] = false;
  actionQueued[1] = false;
  updateHUD();
}

function togglePause(forceState = null) {
  if (gameState !== 'racing' && gameState !== 'paused') return;
  const nextPaused = forceState !== null ? forceState : !isPaused;
  isPaused = nextPaused;
  gameState = isPaused ? 'paused' : 'racing';
  pauseScreen.classList.toggle('hidden', !isPaused);
  if (isPaused) {
    audio.stopBgm();
    audio.updateDrive(0, false, false, false);
  } else {
    audio.startBgm();
  }
}

pauseBtn.addEventListener('click', (e) => { e.currentTarget.blur(); togglePause(); });
if (hornBtn) hornBtn.addEventListener('click', (e) => { e.currentTarget.blur(); if (humanRacers[0]) triggerHornEmote(humanRacers[0]); });
resumeBtn.addEventListener('click', () => togglePause(false));
pauseRestartBtn.addEventListener('click', () => { isPaused = false; pauseScreen.classList.add('hidden'); startRace(true); });
pauseMenuBtn.addEventListener('click', () => { isPaused = false; pauseScreen.classList.add('hidden'); returnToMenu(); });

startBtn.addEventListener('click', () => {
  if (selectedMode === 'cup') {
    cupRound = 0;
    cupScores = {};
    selectedTrackId = CUP_TRACKS[0];
  }
  startRace(true);
});
playAgainBtn.addEventListener('click', () => {
  if (selectedMode === 'cup' && cupRound >= CUP_TRACKS.length - 1) {
    cupRound = 0;
    cupScores = {};
    selectedTrackId = CUP_TRACKS[0];
  }
  startRace(true);
});
changeKartBtn.addEventListener('click', returnToMenu);
menuBtn.addEventListener('click', (e) => { e.currentTarget.blur(); returnToMenu(); });
restartBtn.addEventListener('click', (e) => { e.currentTarget.blur(); startRace(true); });
muteBtn.addEventListener('click', (e) => {
  e.currentTarget.blur();
  audio.init();
  audio.setMuted(!audio.muted);
  muteBtn.textContent = audio.muted ? '🔇' : '🔊';
});

nextTrackBtn.addEventListener('click', () => {
  if (selectedMode === 'cup' && cupRound + 1 < CUP_TRACKS.length) {
    cupRound++;
    selectedTrackId = CUP_TRACKS[cupRound];
    renderTrackButtons();
    startRace(true);
    return;
  }
  const curIdx = TRACK_ORDER.indexOf(selectedTrackId);
  if (curIdx >= 0 && curIdx + 1 < TRACK_ORDER.length) {
    selectedTrackId = TRACK_ORDER[curIdx + 1];
    renderTrackButtons();
    startRace(true);
  }
});

// --- Controls & Physics ---
function getPlayerInputState(humanIdx) {
  const gp = gpState[humanIdx] || { accel: false, brake: false, left: false, right: false, drift: false };
  if (playType === '2') {
    if (humanIdx === 0) {
      return {
        accel: !!(keys['KeyW'] || gp.accel),
        brake: !!(keys['KeyS'] || gp.brake),
        left: !!(keys['KeyA'] || gp.left),
        right: !!(keys['KeyD'] || gp.right),
        drift: !!(keys['ShiftLeft'] || gp.drift),
      };
    }
    return {
      accel: !!(keys['ArrowUp'] || gp.accel),
      brake: !!(keys['ArrowDown'] || gp.brake),
      left: !!(keys['ArrowLeft'] || gp.left),
      right: !!(keys['ArrowRight'] || gp.right),
      drift: !!(keys['ShiftRight'] || keys['Slash'] || gp.drift),
    };
  }
  const autoGas = touchVisible && playType !== '2' && !keys['KeyS'] && !keys['ArrowDown'];
  return {
    accel: !!(keys['KeyW'] || keys['ArrowUp'] || autoGas || gp.accel),
    brake: !!(keys['KeyS'] || keys['ArrowDown'] || gp.brake),
    left: !!(keys['KeyA'] || keys['ArrowLeft'] || gp.left),
    right: !!(keys['KeyD'] || keys['ArrowRight'] || gp.right),
    drift: !!(keys['ShiftLeft'] || keys['ShiftRight'] || gp.drift),
  };
}

function updateHumanControls(r, dt) {
  if (r.eliminated) {
    r.speed *= Math.pow(0.2, dt);
    return;
  }
  const inp = getPlayerInputState(r.humanIndex);
  const preset = r.kart.preset;
  const mods = r.mods || { wheel: 'std', wing: 'none', bumper: 'none' };
  const upgEngine = saveData.upgrades.engine || 0;
  const upgNitro = saveData.upgrades.nitro || 0;
  const upgDrift = saveData.upgrades.drift || 0;
  const isBoosting = r.boostTimer > 0;
  const isMiniBoosting = r.miniBoostTimer > 0;
  const isAirborne = r.pos.y > (r.groundY || 0) + 1.4;

  // 🤸 Mid-Air 360° Air Trick! Press Shift or Space while airborne!
  if (isAirborne && !r.airTrickDone && (inp.drift || actionQueued[r.humanIndex])) {
    r.airTrickDone = true;
    r.airTrickTimer = 0.55;
    r.pendingTrickBoost = true;
    raceCoinsEarned += 5;
    hudCoinsVal.textContent = raceCoinsEarned;
    audio.playTrick();
    showBannerFor(r, '🤸 空中 360° 特技！落地超級加速 +5🪙', '#ffdd00', 1.3);
  }

  if (actionQueued[r.humanIndex]) {
    actionQueued[r.humanIndex] = false;
    if (isItemModeActive()) {
      itemManager.useItem(r, racers, track);
    } else if (r.nitroSlots > 0 && r.boostTimer <= 0.1) {
      r.nitroSlots--;
      r.boostTimer = 2.4 + upgNitro * 0.25;
      camShake = Math.max(camShake, 0.35);
      audio.playBoost();
      showBannerFor(r, '⚡ N2O 氮氣加速！', '#00f5ff', 1.4);
    }
  }

  let targetMax = preset.maxSpeed + upgEngine * 1.6 + (mods.wheel === 'slick' ? 4 : 0);
  if (r.tireBuffTimer > 0) targetMax += 10;
  if (r.engineBuffTimer > 0) targetMax += 15;
  if (r.starTimer > 0) targetMax += 16;
  if (isBoosting) targetMax += 24 + upgNitro * 2.0;
  else if (isMiniBoosting) targetMax += 13;

  if (inp.accel || isBoosting) {
    const accelBoost = (isBoosting ? 2.2 : isMiniBoosting ? 1.6 : 1.0) * (r.engineBuffTimer > 0 ? 1.55 : 1.0);
    r.speed += (preset.accel + upgEngine * 1.2) * accelBoost * dt;
  } else if (inp.brake) {
    if (r.speed > 2) r.speed -= 48 * dt;
    else r.speed -= 20 * dt;
  } else {
    r.speed *= Math.pow(0.45, dt);
    if (Math.abs(r.speed) < 0.2) r.speed = 0;
  }

  if (r.speed > targetMax) r.speed = THREE.MathUtils.lerp(r.speed, targetMax, Math.min(1, dt * 4));
  if (r.speed < -16) r.speed = -16;

  // Devil prank flips left & right steering!
  const invertSign = r.devilTimer > 0 ? -1 : 1;
  const rawSteer = ((inp.left ? 1 : 0) - (inp.right ? 1 : 0)) * invertSign;
  r.steerInput = THREE.MathUtils.lerp(r.steerInput, rawSteer, Math.min(1, dt * 12));

  // KartRider × Mario Kart Drift Hop + 3-Tier Sparks (Orange -> Blue -> Purple Ultra Boost!)
  const canDrift = inp.drift && r.speed > 16;
  if (canDrift) {
    if (!r.isDrifting && Math.abs(rawSteer) > 0) {
      r.isDrifting = true;
      r.driftDir = rawSteer > 0 ? 1 : -1;
      r.driftTime = 0;
      // Crisp physical Hop right as you initiate a drift!
      if (r.hopY <= 0.02) {
        r.hopVel = 7.6;
        audio.playBeep(420, 0.06, 0.07);
      }
    }
  } else if (r.isDrifting) {
    if (r.driftTime >= 1.55 && r.speed > 16) {
      r.boostTimer = Math.max(r.boostTimer, 1.85);
      camShake = Math.max(camShake, 0.42);
      audio.playBoost();
      showBannerFor(r, '💜 ULTRA BOOST 終極紫噴！', '#d946ef', 1.3);
    } else if (r.driftTime >= 0.9 && r.speed > 16) {
      r.miniBoostTimer = Math.max(r.miniBoostTimer, 1.25);
      camShake = Math.max(camShake, 0.28);
      audio.playBoost();
      showBannerFor(r, '🔥 DOUBLE BOOST 雙噴連擊！', '#00e5ff', 1.1);
    } else if (r.driftTime >= 0.35 && r.speed > 16) {
      r.miniBoostTimer = Math.max(r.miniBoostTimer, 0.78);
      audio.playMiniBoost();
      showBannerFor(r, '⚡ 小噴加速！', '#ffdd00', 0.85);
    }
    r.isDrifting = false;
    r.driftDir = 0;
    r.driftTime = 0;
  }

  const speedFactor = Math.min(1, Math.abs(r.speed) / 14) * (r.speed >= 0 ? 1 : -1);
  if (r.isDrifting) {
    r.driftTime += dt;
    const grip = Math.min(0.99, preset.driftGrip + upgDrift * 0.008 + (r.tireBuffTimer > 0 ? 0.035 : 0));
    r.speed *= Math.pow(grip, dt);
    r.yaw += (r.driftDir * 1.72 + r.steerInput * 1.05) * dt * speedFactor;

    const driftMult = 1 + upgDrift * 0.15 + ((r.mods && r.mods.wing === 'gt') ? 0.22 : 0);
    r.nitroGauge += (36 + Math.min(18, r.driftTime * 11)) * driftMult * dt;
    if (r.nitroGauge >= 100) {
      if (selectedMode === 'speed') {
        if (r.nitroSlots < 2) {
          r.nitroSlots++;
          r.nitroGauge -= 100;
          audio.playBeep(980, 0.14, 0.12);
          showBannerFor(r, '獲得 N2O 氮氣！', '#ff9500', 1.1);
        } else {
          r.nitroGauge = 100;
        }
      } else {
        r.nitroGauge = 0;
        r.miniBoostTimer = Math.max(r.miniBoostTimer, 0.95);
        audio.playMiniBoost();
        showBannerFor(r, '🔥 飄移蓄能加速！', '#ffaa00', 0.95);
      }
    }
  } else {
    r.yaw += r.steerInput * 2.15 * dt * speedFactor;
  }

  r.driftVisualYaw = THREE.MathUtils.lerp(r.driftVisualYaw, r.isDrifting ? r.driftDir * 0.4 : 0, Math.min(1, dt * 11));
}

function updateAI(r, dt) {
  if (r.eliminated) {
    r.speed *= Math.pow(0.2, dt);
    return;
  }
  const preset = r.kart.preset;
  let targetPt;
  if (track.isBattleArena) {
    // Battle Arena AI: hunt item boxes if empty, else chase nearest alive opponent!
    let bestTarget = null;
    let bestD = Infinity;
    if (r.items.length === 0) {
      for (const box of itemManager.boxes) {
        if (box.respawnTimer > 0) continue;
        const d = r.pos.distanceTo(box.pos);
        if (d < bestD) { bestD = d; bestTarget = box.pos; }
      }
    }
    if (!bestTarget) {
      for (const other of racers) {
        if (other === r || other.eliminated) continue;
        const d = r.pos.distanceTo(other.pos);
        if (d < bestD) { bestD = d; bestTarget = other.pos; }
      }
    }
    targetPt = bestTarget || new THREE.Vector3(0, 0, 0);
  } else {
    const lookIdx = (r.trackIndex + r.aiLookAhead) % track.samples;
    targetPt = track.points[lookIdx].clone().addScaledVector(track.rights[lookIdx], r.aiLaneOffset);
  }
  const desiredYaw = Math.atan2(-(targetPt.x - r.pos.x), -(targetPt.z - r.pos.z));

  let angleDiff = desiredYaw - r.yaw;
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

  let steerTarget = THREE.MathUtils.clamp(angleDiff * 2.4, -1, 1);
  if (r.devilTimer > 0) steerTarget = Math.sin(raceTime * 7 + r.aiLookAhead) * 0.9;
  else if (r.squidTimer > 0) steerTarget += Math.sin(raceTime * 4) * 0.45;
  r.steerInput = THREE.MathUtils.clamp(steerTarget, -1, 1);
  r.yaw += r.steerInput * 2.5 * dt;

  const sharpTurn = Math.abs(angleDiff) > 0.32 && r.speed > 26;
  r.isDrifting = sharpTurn;
  r.driftVisualYaw = THREE.MathUtils.lerp(r.driftVisualYaw, sharpTurn ? Math.sign(angleDiff) * 0.28 : 0, Math.min(1, dt * 8));

  if (isItemModeActive() && r.items.length > 0 && !r.finished && !r.eliminated) {
    r.aiItemDelay -= dt;
    if (r.aiItemDelay <= 0) {
      itemManager.useItem(r, racers, track);
      r.aiItemDelay = track.isBattleArena ? (1.2 + Math.random() * 1.4) : (2.0 + Math.random() * 2.5);
    }
  }

  let rubber = 1.0;
  const leadHuman = humanRacers[0];
  if (leadHuman && !r.finished) {
    const gap = leadHuman.totalProgress - r.totalProgress;
    if (gap > 0.08) rubber = 1.14;
    else if (gap > 0.03) rubber = 1.06;
    else if (gap < -0.15) rubber = 0.94;
  }

  let targetSpeed = preset.maxSpeed * r.aiSkill * rubber;
  if (r.devilTimer > 0 || r.squidTimer > 0) targetSpeed *= 0.8;
  if (sharpTurn) targetSpeed *= 0.88;
  if (r.boostTimer > 0) targetSpeed += 20;
  r.speed = THREE.MathUtils.lerp(r.speed, targetSpeed, Math.min(1, dt * 4.2));
}

function updateRacerPhysics(r, dt) {
  // Remote player in LAN/Online mode: smoothly interpolate from network state
  if (r.controlType === 'remote') {
    if (r.remoteTarget) {
      const t = r.remoteTarget;
      const lerpAmt = Math.min(1, dt * 16);
      r.pos.x = THREE.MathUtils.lerp(r.pos.x, t.x, lerpAmt);
      r.pos.y = THREE.MathUtils.lerp(r.pos.y, t.y || 0, lerpAmt);
      r.pos.z = THREE.MathUtils.lerp(r.pos.z, t.z, lerpAmt);
      r.yaw = t.yaw;
      r.speed = t.speed;
      r.driftVisualYaw = t.driftVisualYaw;
      r.steerInput = t.steerInput;
      r.boostTimer = t.boostTimer;
      r.shieldTimer = t.shieldTimer;
      r.waterTrapTimer = t.waterTrapTimer;
      r.spinTimer = t.spinTimer;
      r.lap = t.lap;
      r.totalProgress = t.totalProgress;
      r.finished = t.finished;
      r.finishTime = t.finishTime;
    }
    applyKartVisuals(r, dt);
    return;
  }

  if (r.boostTimer > 0) r.boostTimer = Math.max(0, r.boostTimer - dt);
  if (r.miniBoostTimer > 0) r.miniBoostTimer = Math.max(0, r.miniBoostTimer - dt);
  if (r.padCooldown > 0) r.padCooldown = Math.max(0, r.padCooldown - dt);
  if (r.rampCooldown > 0) r.rampCooldown = Math.max(0, r.rampCooldown - dt);
  if (r.shortcutCooldown > 0) r.shortcutCooldown = Math.max(0, r.shortcutCooldown - dt);
  if (r.obstacleCooldown > 0) r.obstacleCooldown = Math.max(0, r.obstacleCooldown - dt);

  // 1. Active Giant Sky Cannon Animation (Load into barrel -> BOOM -> Soar 56m into the Clouds!)
  if (r.cannonState) {
    const cs = r.cannonState;
    cs.timer += dt;
    if (cs.phase === 'loading') {
      const f = Math.min(1, cs.timer / cs.loadDuration);
      // Kart slides/shrinks into the shaking cannon barrel!
      r.pos.set(cs.startPos.x, cs.startPos.y + 1.45, cs.startPos.z);
      r.yaw = cs.flightYaw;
      r.moveYaw = cs.flightYaw;
      r.kart.root.position.copy(r.pos);
      r.kart.root.rotation.y = cs.flightYaw;
      const sc = Math.max(0.22, 1 - f * 0.78);
      r.kart.root.scale.setScalar(sc);
      if (cs.barrelGroup) {
        const swell = 1 + Math.sin(f * Math.PI * 5) * 0.12;
        cs.barrelGroup.scale.set(swell, swell, 1 - f * 0.15);
      }
      if (f >= 1) {
        cs.phase = 'flying';
        cs.timer = 0;
        r.kart.root.scale.setScalar(1);
        if (cs.barrelGroup) cs.barrelGroup.scale.set(1, 1, 1);
        // BOOM muzzle explosion!
        for (let k = 0; k < 28; k++) {
          spawnParticle(
            cs.startPos.clone().add(new THREE.Vector3(0, 2.8, 0)),
            new THREE.Vector3((Math.random() - 0.5) * 22, 6 + Math.random() * 14, (Math.random() - 0.5) * 22),
            k % 2 === 0 ? 0xff9500 : 0xffffff,
            0.65,
            1.6
          );
        }
        if (r.isHuman) {
          camShake = 0.65;
          audio.playBoost();
          audio.playFireworkPop();
          showBannerFor(r, '🚀 BOOM!! 飛向雲端！！', '#ffdd00', 1.5);
        }
      }
    } else {
      const f = Math.min(1, cs.timer / cs.flyDuration);
      r.pos.x = THREE.MathUtils.lerp(cs.startPos.x, cs.endPos.x, f);
      r.pos.z = THREE.MathUtils.lerp(cs.startPos.z, cs.endPos.z, f);
      const baseY = THREE.MathUtils.lerp(cs.startPos.y, cs.endPos.y, f);
      r.pos.y = baseY + Math.sin(f * Math.PI) * (cs.peakY - baseY);
      r.roadPitch = Math.cos(f * Math.PI) * 0.65;
      r.yaw = cs.flightYaw;
      r.moveYaw = cs.flightYaw;
      r.speed = r.kart.preset.maxSpeed + 34;
      // Golden comet tail in the clouds!
      spawnParticle(
        r.pos.clone(),
        new THREE.Vector3((Math.random() - 0.5) * 6, -2, (Math.random() - 0.5) * 6),
        0xffdd00,
        0.4,
        1.25
      );
      if (f >= 1) {
        r.pos.copy(cs.endPos);
        r.yaw = cs.endYaw;
        r.moveYaw = cs.endYaw;
        r.trackIndex = cs.endIdx;
        r.trackT = cs.endIdx / track.samples;
        if (r.trackT > 0.42 && r.trackT < 0.65) r.passedHalfway = true;
        r.cannonState = null;
        r.squashTimer = 0.3;
        r.boostTimer = Math.max(r.boostTimer, 1.5);
        if (r.isHuman) {
          camShake = 0.38;
          showBannerFor(r, '☁️ 從雲端完美降落！', '#38ef7d', 1.2);
        }
      }
    }
    let adjustedT = r.trackT;
    if (r.lap === 1 && !r.passedHalfway && adjustedT > 0.8) adjustedT -= 1.0;
    r.totalProgress = (r.lap - 1) + adjustedT;
    applyKartVisuals(r, dt);
    return;
  }

  // 2. Active Quantum Instant Teleport!
  if (r.teleportState) {
    const ts = r.teleportState;
    ts.timer += dt;
    const f = Math.min(1, ts.timer / ts.duration);
    r.kart.root.scale.setScalar(Math.max(0.08, 1 - f));
    r.kart.root.rotation.y += dt * 18;
    if (f >= 1) {
      r.kart.root.scale.setScalar(1);
      r.pos.copy(ts.exitPos);
      r.yaw = ts.exitYaw;
      r.moveYaw = ts.exitYaw;
      r.trackIndex = ts.exitIdx;
      r.trackT = ts.exitIdx / track.samples;
      if (r.trackT > 0.42 && r.trackT < 0.65) r.passedHalfway = true;
      r.teleportState = null;
      r.boostTimer = Math.max(r.boostTimer, 1.4);
      itemManager._spawnPortalRing(r.pos, r.yaw, 0x22d3ee);
      for (let k = 0; k < 22; k++) {
        spawnParticle(
          r.pos.clone().add(new THREE.Vector3(0, 1.5, 0)),
          new THREE.Vector3((Math.random() - 0.5) * 18, 4 + Math.random() * 8, (Math.random() - 0.5) * 18),
          0x00f5ff,
          0.5,
          1.2
        );
      }
      if (r.isHuman) {
        camShake = 0.35;
        audio.playBoost();
        showBannerFor(r, '🌀 空間瞬移完成！瞬間超車！', '#22d3ee', 1.3);
      }
    }
    return;
  }

  // 3. Falling off the Cloud Track (openEdge) -> tumble into clouds & respawn back on track!
  if (r.fallingTimer > 0) {
    r.fallingTimer -= dt;
    r.velY -= 42 * dt;
    r.pos.y += r.velY * dt;
    r.kart.root.position.copy(r.pos);
    r.kart.root.rotation.y += dt * 7;
    r.kart.root.rotation.x += dt * 4;
    if (r.fallingTimer <= 0) {
      const safeIdx = (r.trackIndex - 4 + track.samples) % track.samples;
      const sp = track.points[safeIdx];
      const stan = track.tangents[safeIdx];
      const syaw = Math.atan2(-stan.x, -stan.z);
      r.pos.copy(sp);
      r.velY = 0;
      r.yaw = syaw;
      r.moveYaw = syaw;
      r.speed = 18;
      r.trackIndex = safeIdx;
      r.trackT = safeIdx / track.samples;
      r.kart.root.rotation.set(0, syaw, 0);
      if (r.isHuman) {
        audio.playBeep(660, 0.14, 0.12);
        showBannerFor(r, '☁️ 已拉回雲端賽道！繼續衝！', '#38bdf8', 1.1);
      }
    }
    return;
  }

  // Active High-Altitude Sky-Jump Shortcut Flight!
  if (r.shortcutJump) {
    const sj = r.shortcutJump;
    sj.progress += dt / sj.duration;
    const f = Math.min(1, sj.progress);
    r.pos.x = THREE.MathUtils.lerp(sj.startPos.x, sj.endPos.x, f);
    r.pos.z = THREE.MathUtils.lerp(sj.startPos.z, sj.endPos.z, f);
    const baseY = THREE.MathUtils.lerp(sj.startPos.y, sj.endPos.y, f);
    r.pos.y = baseY + Math.sin(f * Math.PI) * (sj.peakY - baseY);
    r.roadPitch = Math.cos(f * Math.PI) * 0.42;
    r.yaw = sj.flightYaw;
    r.moveYaw = sj.flightYaw;
    r.speed = r.kart.preset.maxSpeed + 26;
    if (f >= 1) {
      r.pos.copy(sj.endPos);
      r.yaw = sj.endYaw;
      r.moveYaw = sj.endYaw;
      r.trackIndex = sj.endIdx;
      r.trackT = sj.endIdx / track.samples;
      if (r.trackT > 0.42 && r.trackT < 0.65) r.passedHalfway = true;
      r.shortcutJump = null;
      r.squashTimer = 0.28;
      r.boostTimer = Math.max(r.boostTimer, 1.35);
      if (r.isHuman) {
        camShake = Math.max(camShake, 0.35);
        raceCoinsEarned += 10;
        hudCoinsVal.textContent = raceCoinsEarned;
        audio.playCoin();
        showBannerFor(r, '🚀 高空捷徑落地！+10🪙', '#ffdd00', 1.25);
      }
    }
    let adjustedT = r.trackT;
    if (r.lap === 1 && !r.passedHalfway && adjustedT > 0.8) adjustedT -= 1.0;
    r.totalProgress = (r.lap - 1) + adjustedT;
    applyKartVisuals(r, dt);
    return;
  }
  if (r.shieldTimer > 0) r.shieldTimer = Math.max(0, r.shieldTimer - dt);
  if (r.spinTimer > 0) r.spinTimer = Math.max(0, r.spinTimer - dt);
  if (r.waterTrapTimer > 0) r.waterTrapTimer = Math.max(0, r.waterTrapTimer - dt);
  if (r.freezeTimer > 0) r.freezeTimer = Math.max(0, r.freezeTimer - dt);
  if (r.devilTimer > 0) r.devilTimer = Math.max(0, r.devilTimer - dt);
  if (r.squidTimer > 0) r.squidTimer = Math.max(0, r.squidTimer - dt);
  if (r.flattenedTimer > 0) r.flattenedTimer = Math.max(0, r.flattenedTimer - dt);
  if (r.dinoCooldown > 0) r.dinoCooldown = Math.max(0, r.dinoCooldown - dt);
  if (r.blizzardTimer > 0) r.blizzardTimer = Math.max(0, r.blizzardTimer - dt);
  if (r.meteorSlowTimer > 0) r.meteorSlowTimer = Math.max(0, r.meteorSlowTimer - dt);
  if (r.balloonGrace > 0) r.balloonGrace = Math.max(0, r.balloonGrace - dt);
  if (r.hazardCooldown > 0) r.hazardCooldown = Math.max(0, r.hazardCooldown - dt);
  if (r.airTrickTimer > 0) r.airTrickTimer = Math.max(0, r.airTrickTimer - dt);
  if (r.emoteTimer > 0) {
    r.emoteTimer -= dt;
    if (r.emoteTimer <= 0 && r.emoteSprite) {
      r.kart.root.remove(r.emoteSprite);
      r.emoteSprite = null;
    }
  }
  if (r.tireBuffTimer > 0) r.tireBuffTimer = Math.max(0, r.tireBuffTimer - dt);
  if (r.engineBuffTimer > 0) r.engineBuffTimer = Math.max(0, r.engineBuffTimer - dt);
  if (r.starTimer > 0) r.starTimer = Math.max(0, r.starTimer - dt);
  if (r.magnetTimer > 0) {
    r.magnetTimer = Math.max(0, r.magnetTimer - dt);
    if (r.magnetTarget && !r.magnetTarget.finished) {
      const dx = r.magnetTarget.pos.x - r.pos.x;
      const dz = r.magnetTarget.pos.z - r.pos.z;
      const dist = Math.hypot(dx, dz);
      if (dist > 3.5 && dist < 130) {
        const pullYaw = Math.atan2(-dx, -dz);
        let diff = pullYaw - r.yaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        r.yaw += THREE.MathUtils.clamp(diff, -2.5 * dt, 2.5 * dt);
        r.speed = Math.max(r.speed, r.kart.preset.maxSpeed + 22);
      }
    }
  }

  const incapacitated = r.spinTimer > 0 || r.waterTrapTimer > 0 || r.freezeTimer > 0;

  if (gameState === 'racing') {
    if (r.freezeTimer > 0) {
      r.isDrifting = false;
      r.speed = 0;
    } else if (incapacitated) {
      r.isDrifting = false;
      r.speed *= Math.pow(0.18, dt);
    } else if (r.isHuman && !r.finished) {
      updateHumanControls(r, dt);
    } else {
      updateAI(r, dt);
    }
    if (r.flattenedTimer > 0) {
      const flatMax = r.kart.preset.maxSpeed * 0.52;
      if (r.speed > flatMax) r.speed = THREE.MathUtils.lerp(r.speed, flatMax, Math.min(1, dt * 8));
    }
    if (r.blizzardTimer > 0 || r.meteorSlowTimer > 0) {
      const slowMax = r.kart.preset.maxSpeed * (r.meteorSlowTimer > 0 ? 0.55 : 0.58);
      if (r.speed > slowMax) r.speed = THREE.MathUtils.lerp(r.speed, slowMax, Math.min(1, dt * 7));
      if (Math.random() < dt * 16) {
        spawnParticle(
          r.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 3.5, 1.5 + Math.random() * 2.5, (Math.random() - 0.5) * 3.5)),
          new THREE.Vector3((Math.random() - 0.5) * 5, r.blizzardTimer > 0 ? -3.5 : 3.5, (Math.random() - 0.5) * 5),
          r.blizzardTimer > 0 ? 0xbae6fd : 0xff5500,
          0.38,
          0.85
        );
      }
    }
  } else {
    r.speed *= Math.pow(0.1, dt);
  }

  // Drift Hop spring & Squash timer
  if (r.hopY > 0 || r.hopVel > 0) {
    r.hopVel -= 44 * dt;
    r.hopY += r.hopVel * dt;
    if (r.hopY <= 0) {
      r.hopY = 0;
      r.hopVel = 0;
      r.squashTimer = 0.16;
    }
  }
  if (r.squashTimer > 0) r.squashTimer = Math.max(0, r.squashTimer - dt);
  if (r.overtakeCooldown > 0) r.overtakeCooldown = Math.max(0, r.overtakeCooldown - dt);

  // Real Lateral Drift Inertia: moveYaw lags behind yaw during drift for true sideways slide!
  let yawDelta = r.yaw - r.moveYaw;
  while (yawDelta > Math.PI) yawDelta -= Math.PI * 2;
  while (yawDelta < -Math.PI) yawDelta += Math.PI * 2;
  const followRate = r.isDrifting ? 4.8 : 13.5;
  r.moveYaw += yawDelta * Math.min(1, dt * followRate);

  const fwdX = -Math.sin(r.moveYaw);
  const fwdZ = -Math.cos(r.moveYaw);
  r.pos.x += fwdX * r.speed * dt;
  r.pos.z += fwdZ * r.speed * dt;

  const closest = track.getClosestTrackPoint(r.pos, r.trackIndex);
  const prevT = r.trackT;
  r.trackIndex = closest.index;
  r.trackT = closest.t;

  // 3D Elevation + Gravity / Jump Ramp / Glider Wing Physics + Perfect Landing & Air Trick!
  const groundY = closest.point.y;
  r.groundY = groundY;
  if (r.pos.y > groundY + 0.05 || r.velY > 0) {
    const prevVelY = r.velY;
    const isGliding = r.mods && r.mods.wing === 'glider' && r.velY < 0;
    const grav = isGliding ? 16 : 38;
    r.velY -= grav * dt;
    if (isGliding && r.velY < -9) r.velY = -9;
    r.pos.y += r.velY * dt;
    if (r.pos.y <= groundY) {
      r.pos.y = groundY;
      r.velY = 0;
      r.airTrickDone = false;
      if (r.pendingTrickBoost) {
        r.pendingTrickBoost = false;
        r.boostTimer = Math.max(r.boostTimer, 1.55);
        r.squashTimer = 0.28;
        if (r.isHuman) {
          camShake = Math.max(camShake, 0.34);
          audio.playBoost();
          showBannerFor(r, '🚀 特技落地超級加速！', '#ffdd00', 1.15);
        }
      } else if (prevVelY < -8) {
        r.squashTimer = 0.24;
        r.speed += 4.5;
        if (r.isHuman) {
          camShake = Math.max(camShake, 0.22);
          showBannerFor(r, '✨ PERFECT LANDING!', '#38ef7d', 0.85);
        }
      }
    }
  } else {
    r.pos.y = THREE.MathUtils.lerp(r.pos.y, groundY, Math.min(1, dt * 18));
    r.velY = 0;
    r.airTrickDone = false;
  }

  // Match road slope pitch (or nose-up while airborne!)
  const slopePitch = r.pos.y > groundY + 0.3
    ? THREE.MathUtils.clamp(r.velY * 0.028, -0.32, 0.38)
    : Math.asin(THREE.MathUtils.clamp(closest.tangent.y, -0.45, 0.45));
  r.roadPitch = THREE.MathUtils.lerp(r.roadPitch, slopePitch, Math.min(1, dt * 10));

  if (track.isBattleArena) {
    // Circular LEGO Stadium Wall Bounce!
    const distFromCenter = Math.hypot(r.pos.x, r.pos.z);
    const maxR = track.arenaRadius - 2.6;
    if (distFromCenter > maxR) {
      const nx = r.pos.x / distFromCenter;
      const nz = r.pos.z / distFromCenter;
      r.pos.x = nx * maxR;
      r.pos.z = nz * maxR;
      r.yaw = Math.atan2(nx, nz);
      r.moveYaw = r.yaw;
      r.speed *= 0.78;
      if (r.isHuman) camShake = Math.max(camShake, 0.16);
    }
  } else {
    const halfRoad = track.roadWidth / 2;
    const isOffroadTire = r.mods && r.mods.wheel === 'offroad';
    // Allow riding the red/white curb freely without mud slowdown!
    if (!isOffroadTire && Math.abs(closest.lateralOffset) > halfRoad + 2.6 && r.boostTimer <= 0 && r.tireBuffTimer <= 0 && r.starTimer <= 0 && r.pos.y <= groundY + 0.3) {
      r.speed *= Math.pow(0.82, dt);
    }

    // Open-edge Sky Track: falling off edge tumbles into the clouds and respawns!
    const maxLat = track.wallOffset - 1.4;
    if (Math.abs(closest.lateralOffset) > maxLat) {
      if (track.config.openEdge && r.isHuman && gameState === 'racing') {
        r.fallingTimer = 1.15;
        r.velY = -6;
        r.speed *= 0.4;
        audio.playHit();
        showBannerFor(r, '☁️ 掉到雲海下面了！準備拉回重來！', '#ff6b6b', 1.3);
        return;
      }
      // Silky-smooth Wall-Bounce & Auto-Glide: never get stuck on roadside posts!
      const sign = Math.sign(closest.lateralOffset);
      const safeLat = maxLat - 0.65;
      const clampedPos = closest.point.clone().addScaledVector(closest.right, sign * safeLat);
      r.pos.x = clampedPos.x;
      r.pos.z = clampedPos.z;
      const trackYaw = Math.atan2(-closest.tangent.x, -closest.tangent.z);
      // Aim nose cleanly back into the road (away from the posts!)
      const targetReturnYaw = trackYaw + sign * 0.16;
      let alignDiff = targetReturnYaw - r.yaw;
      while (alignDiff > Math.PI) alignDiff -= Math.PI * 2;
      while (alignDiff < -Math.PI) alignDiff += Math.PI * 2;
      r.yaw += alignDiff * 0.62;
      r.moveYaw = r.yaw;
      // Gentle per-second wall scrub (never per-frame stall!) + keep minimum slide speed
      r.speed *= Math.pow(0.76, dt);
      if (r.speed > 0 && r.speed < 18) r.speed = 18;
      if (r.isHuman) camShake = Math.max(camShake, 0.12);
    }
  }

  // Boost pads
  if (r.padCooldown <= 0 && gameState === 'racing' && !incapacitated) {
    for (const pad of track.boostPads) {
      const dx = r.pos.x - pad.position.x;
      const dz = r.pos.z - pad.position.z;
      const dy = Math.abs(r.pos.y - pad.position.y);
      if (dy < 3.5 && dx * dx + dz * dz < pad.radius * pad.radius) {
        r.boostTimer = Math.max(r.boostTimer, 1.15);
        r.padCooldown = 1.0;
        if (r.isHuman) {
          audio.playBoost();
          showBannerFor(r, '加速帶衝刺！', '#ffdd00', 0.9);
        }
        break;
      }
    }
  }

  // High-Altitude Sky-Jump Shortcut Pads!
  if (r.shortcutCooldown <= 0 && !r.shortcutJump && gameState === 'racing' && !incapacitated && r.speed > 18) {
    for (const sc of track.shortcuts || []) {
      const dx = r.pos.x - sc.entryPos.x;
      const dz = r.pos.z - sc.entryPos.z;
      const dy = Math.abs(r.pos.y - sc.entryPos.y);
      if (dy < 4.0 && dx * dx + dz * dz < sc.radius * sc.radius) {
        r.shortcutCooldown = 4.0;
        const flightYaw = Math.atan2(-(sc.exitPos.x - r.pos.x), -(sc.exitPos.z - r.pos.z));
        r.shortcutJump = {
          startPos: r.pos.clone(),
          endPos: sc.exitPos.clone(),
          endIdx: sc.exitIdx,
          endYaw: sc.exitYaw,
          flightYaw,
          peakY: sc.peakY,
          progress: 0,
          duration: 1.35,
        };
        if (r.isHuman) {
          camShake = Math.max(camShake, 0.35);
          audio.playBoost();
          showBannerFor(r, '⚡ 高空彈跳抄捷徑 SKY SHORTCUT!', '#ff2a9d', 1.4);
        }
        break;
      }
    }
  }

  // Jump Ramps -> launch kart into the air!
  if (r.rampCooldown <= 0 && gameState === 'racing' && !incapacitated && r.speed > 18) {
    for (const ramp of track.jumpRamps) {
      const dx = r.pos.x - ramp.position.x;
      const dz = r.pos.z - ramp.position.z;
      const dy = Math.abs(r.pos.y - ramp.position.y);
      if (dy < 3.5 && dx * dx + dz * dz < ramp.radius * ramp.radius) {
        r.velY = 17.5;
        r.boostTimer = Math.max(r.boostTimer, 1.05);
        r.rampCooldown = 1.4;
        if (r.isHuman) {
          audio.playMiniBoost();
          showBannerFor(r, '🚀 空中飛躍 AIR JUMP!', '#ffea00', 1.1);
        }
        break;
      }
    }
  }

  // Moving Track Obstacles collision
  if (r.obstacleCooldown <= 0 && gameState === 'racing' && !incapacitated) {
    for (const obs of track.obstacles) {
      const dx = r.pos.x - obs.pos.x;
      const dz = r.pos.z - obs.pos.z;
      const dy = Math.abs(r.pos.y - obs.pos.y);
      if (dy < 2.8 && dx * dx + dz * dz < 6.8) {
        r.obstacleCooldown = 1.4;
        if (r.shieldTimer > 0) {
          r.shieldTimer = 0;
          if (r.isHuman) {
            audio.playShield();
            showBannerFor(r, '🛡️ 護盾撞飛路障！', '#38ef7d', 1.0);
          }
        } else {
          r.spinTimer = 0.85;
          r.speed *= 0.35;
          if (r.isHuman) {
            audio.playHit();
            showBannerFor(r, '💥 撞到移動路障！', '#ff3b30', 1.1);
          }
        }
        break;
      }
    }
  }

  // Giant Stomping LEGO T-Rex collision -> FLATTEN KART INTO A PANCAKE!
  if (gameState === 'racing' && track.dinos && track.dinos.length > 0) {
    for (const d of track.dinos) {
      const dx = r.pos.x - d.stompPos.x;
      const dz = r.pos.z - d.stompPos.z;
      const distSq = dx * dx + dz * dz;
      // Subtle seismic thud when nearby T-Rex slams its giant foot!
      if (r.isHuman && d.justSlammed && distSq < 2800) {
        camShake = Math.max(camShake, 0.24);
      }
      if (d.stompActive && r.dinoCooldown <= 0 && !incapacitated) {
        const dy = Math.abs(r.pos.y - d.stompPos.y);
        if (dy < 4.5 && distSq < (d.radius + 1.1) * (d.radius + 1.1)) {
          r.dinoCooldown = 3.2;
          if (r.starTimer > 0) {
            if (r.isHuman) showBannerFor(r, '⭐ 無敵星彈開暴龍腳掌！', '#ffdd00', 1.1);
          } else if (r.shieldTimer > 0) {
            r.shieldTimer = 0;
            if (r.isHuman) {
              audio.playShield();
              showBannerFor(r, '🛡️ 護盾擋下暴龍踩踏！', '#38ef7d', 1.1);
            }
          } else {
            r.flattenedTimer = 2.8;
            r.speed *= 0.32;
            r.isDrifting = false;
            for (let k = 0; k < 14; k++) {
              spawnParticle(
                r.pos.clone().add(new THREE.Vector3(0, 0.6, 0)),
                new THREE.Vector3((Math.random() - 0.5) * 14, 3 + Math.random() * 5, (Math.random() - 0.5) * 14),
                0xd6d3d1,
                0.45,
                1.1
              );
            }
            if (r.isHuman) {
              camShake = Math.max(camShake, 0.55);
              audio.playHit();
              showBannerFor(r, '🦖 被暴龍踩扁了！變成紙片車！', '#ff3b30', 1.8);
              triggerCamZoom(r.humanIndex, r, 0.85, 42, 2.2, 0.2);
            }
          }
          break;
        }
      }
    }
  }

  // 🚂 Express Train Crossing, 🪨 Rolling Boulders & 🌀 Crosswind Fans!
  if (gameState === 'racing' && !incapacitated) {
    if (r.hazardCooldown <= 0 && track.trains && track.trains.length > 0) {
      for (const tr of track.trains) {
        if (!tr.active) continue;
        const dx = r.pos.x - tr.pos.x;
        const dz = r.pos.z - tr.pos.z;
        const dy = Math.abs(r.pos.y - tr.pos.y);
        if (dy < 4.0 && dx * dx + dz * dz < 68) {
          r.hazardCooldown = 2.0;
          if (r.shieldTimer > 0 || r.starTimer > 0) {
            if (r.shieldTimer > 0) r.shieldTimer = 0;
            if (r.isHuman) showBannerFor(r, '🛡️ 護盾彈開急行火車！', '#38ef7d', 1.1);
          } else {
            r.spinTimer = 1.25;
            r.velY = 15;
            r.speed *= 0.25;
            if (r.isHuman) {
              camShake = Math.max(camShake, 0.5);
              audio.playHit();
              showBannerFor(r, '🚂 撞到平交道急行火車啦！', '#ff3b30', 1.5);
            }
          }
          break;
        }
      }
    }
    if (r.hazardCooldown <= 0 && track.boulders && track.boulders.length > 0) {
      for (const b of track.boulders) {
        const dx = r.pos.x - b.pos.x;
        const dz = r.pos.z - b.pos.z;
        const dy = Math.abs(r.pos.y - b.pos.y);
        if (dy < 3.6 && dx * dx + dz * dz < 14.5) {
          r.hazardCooldown = 1.8;
          if (r.shieldTimer > 0 || r.starTimer > 0) {
            if (r.shieldTimer > 0) r.shieldTimer = 0;
          } else {
            r.flattenedTimer = 2.0;
            r.speed *= 0.35;
            if (r.isHuman) {
              camShake = Math.max(camShake, 0.45);
              audio.playHit();
              showBannerFor(r, '🪨 被巨型滾石壓扁了！', '#f97316', 1.5);
            }
          }
          break;
        }
      }
    }
    if (track.fans && track.fans.length > 0) {
      for (const f of track.fans) {
        const dx = r.pos.x - f.center.x;
        const dz = r.pos.z - f.center.z;
        if (dx * dx + dz * dz < f.radius * f.radius) {
          r.pos.x += f.blowDir.x * f.force * dt;
          r.pos.z += f.blowDir.z * f.force * dt;
          if (Math.random() < dt * 14) {
            spawnParticle(
              r.pos.clone().add(new THREE.Vector3(0, 1.4, 0)),
              f.blowDir.clone().multiplyScalar(22),
              0xe0f2fe,
              0.3,
              0.8
            );
          }
        }
      }
    }
  }

  // Track Buff Orbs pickup (🛞 Turbo Tires / 🔥 Super Engine — active in ALL modes!)
  if (gameState === 'racing' && !r.finished) {
    for (const b of track.buffOrbs) {
      if (b.respawn > 0) continue;
      const dx = r.pos.x - b.pos.x;
      const dz = r.pos.z - b.pos.z;
      const dy = Math.abs(r.pos.y + 1.2 - b.pos.y);
      if (dy < 3.0 && dx * dx + dz * dz < 7.2) {
        b.respawn = 10.0;
        b.mesh.visible = false;
        if (b.kind === 'turbo_tire') {
          r.tireBuffTimer = 8.0;
          if (r.isHuman) {
            audio.playBoost();
            showBannerFor(r, '🛞 吃到黃金輪胎！抓地＋極速強化 8 秒！', '#fbbf24', 1.4);
          }
        } else {
          r.engineBuffTimer = 8.0;
          if (r.isHuman) {
            audio.playBoost();
            showBannerFor(r, '🔥 吃到狂暴引擎！馬力暴衝 8 秒！', '#fb7185', 1.4);
          }
        }
        break;
      }
    }
  }

  // Coins pickup (human racers collect coins; Magnet bumper vacuums from 10m!)
  if (r.isHuman && gameState === 'racing') {
    const coinDistSq = (r.mods && r.mods.bumper === 'magnet') ? 100 : 6.2;
    for (const c of track.coins) {
      if (c.respawn > 0) continue;
      const dx = r.pos.x - c.pos.x;
      const dz = r.pos.z - c.pos.z;
      const dy = Math.abs(r.pos.y + 1.0 - c.pos.y);
      if (dy < 3.5 && dx * dx + dz * dz < coinDistSq) {
        c.respawn = 12.0;
        c.mesh.visible = false;
        raceCoinsEarned++;
        hudCoinsVal.textContent = raceCoinsEarned;
        r.speed += 1.8;
        audio.playCoin();
      }
    }
  }

  if (gameState === 'racing' && !r.finished) {
    if (r.trackT > 0.42 && r.trackT < 0.65) r.passedHalfway = true;
    if (prevT > 0.85 && r.trackT < 0.15 && r.passedHalfway) {
      const lapDuration = raceTime - r.lapStartTime;
      if (lapDuration < r.bestLapTime) r.bestLapTime = lapDuration;
      r.lapStartTime = raceTime;
      r.passedHalfway = false;
      r.lap++;

      if (r.lap > TOTAL_LAPS) {
        r.finished = true;
        r.finishTime = raceTime;
        if (r.isHuman) {
          const allHumansDone = humanRacers.every((h) => h.finished);
          if (allHumansDone) {
            onRaceFinish();
          } else {
            showBannerFor(r, '🏁 完賽！等待另一位玩家...', '#38ef7d', 4.0);
          }
        }
      } else if (r.isHuman) {
        audio.playLapChime();
        if (r.lap === TOTAL_LAPS) audio.setFinalLap(true);
        showBannerFor(r, r.lap === TOTAL_LAPS ? '🔥 最後一圈 FINAL LAP!' : `LAP ${r.lap} / ${TOTAL_LAPS}`, '#4ce0ff', 1.5);
      }
    }

    if (r.isHuman) {
      const dot = fwdX * closest.tangent.x + fwdZ * closest.tangent.z;
      pHudEls[r.humanIndex].wrongWay.classList.toggle('hidden', dot > -0.25 || r.speed < 4);
    }
  }

  let adjustedT = r.trackT;
  if (r.lap === 1 && !r.passedHalfway && adjustedT > 0.8) adjustedT -= 1.0;
  r.totalProgress = (r.lap - 1) + adjustedT;

  applyKartVisuals(r, dt);
}

function applyKartVisuals(r, dt) {
  const floatY = r.waterTrapTimer > 0 ? 1.1 + Math.sin(raceTime * 8) * 0.25 : 0;
  const ufoBob = r.kart.preset.bodyStyle === 'ufo' ? Math.sin(raceTime * 5 + r.pos.x * 0.1) * 0.16 : 0;
  const spinExtra = r.spinTimer > 0 ? r.spinTimer * Math.PI * 4.5 : 0;
  r.kart.root.position.set(r.pos.x, r.pos.y + (r.hopY || 0) + floatY + ufoBob, r.pos.z);
  r.kart.root.rotation.y = r.yaw + r.driftVisualYaw + spinExtra;

  // Springy Squash & Stretch on hop/jump landing!
  if (r.flattenedTimer > 0) {
    // Pancake-flattened by a giant T-Rex stomp!
    const targetSy = r.flattenedTimer < 0.25 ? THREE.MathUtils.lerp(1, 0.18, r.flattenedTimer / 0.25) : 0.18;
    const targetSx = r.flattenedTimer < 0.25 ? THREE.MathUtils.lerp(1, 1.42, r.flattenedTimer / 0.25) : 1.42;
    r.kart.root.scale.set(targetSx, targetSy, 1 + (targetSx - 1) * 0.65);
  } else if (!r.teleportState && (!r.cannonState || r.cannonState.phase !== 'load')) {
    r.kart.root.scale.set(1, 1, 1);
  }

  if (r.squashTimer > 0) {
    const s = Math.sin((r.squashTimer / 0.24) * Math.PI) * 0.14;
    r.kart.bodyGroup.scale.set(1 + s, 1 - s, 1 + s * 0.5);
  } else {
    r.kart.bodyGroup.scale.set(1, 1, 1);
  }

  // Animated galloping horse legs on the Royal Carriage!
  if (r.kart.horseLegs && r.kart.horseLegs.length > 0) {
    r.gallopPhase += dt * (2.5 + Math.abs(r.speed) * 0.36);
    const amp = Math.min(0.65, 0.1 + Math.abs(r.speed) * 0.015);
    for (const leg of r.kart.horseLegs) {
      leg.pivot.rotation.x = Math.sin(r.gallopPhase + leg.phase) * amp;
    }
  }

  r.statusMeshes.shieldMesh.visible = r.shieldTimer > 0;
  if (r.shieldTimer > 0) r.statusMeshes.shieldMesh.scale.setScalar(1 + Math.sin(raceTime * 10) * 0.05);
  r.statusMeshes.waterMesh.visible = r.waterTrapTimer > 0;
  if (r.statusMeshes.freezeMesh) r.statusMeshes.freezeMesh.visible = r.freezeTimer > 0;
  if (r.statusMeshes.blizzardMesh) {
    r.statusMeshes.blizzardMesh.visible = r.blizzardTimer > 0;
    if (r.blizzardTimer > 0) r.statusMeshes.blizzardMesh.rotation.y += dt * 7.5;
  }
  if (r.statusMeshes.starAura) {
    const hasBuffAura = r.starTimer > 0 || r.tireBuffTimer > 0 || r.engineBuffTimer > 0;
    r.statusMeshes.starAura.visible = hasBuffAura;
    if (hasBuffAura) {
      r.statusMeshes.starAura.rotation.z += dt * 6;
      const col = r.starTimer > 0
        ? [0xff3b30, 0xffdd00, 0x38ef7d, 0x00e5ff, 0xd946ef][Math.floor(raceTime * 12) % 5]
        : r.engineBuffTimer > 0 ? 0xfb7185 : 0xfbbf24;
      r.statusMeshes.starAura.material.color.setHex(col);
    }
  }

  const targetRoll = -r.steerInput * 0.08 - r.driftVisualYaw * 0.16;
  if (r.airTrickTimer > 0) {
    // 🤸 360° Mid-Air Barrel Roll / Flip!
    const f = 1 - r.airTrickTimer / 0.55;
    r.kart.bodyGroup.rotation.z = f * Math.PI * 2;
    r.kart.bodyGroup.rotation.x = Math.sin(f * Math.PI) * 0.45;
  } else {
    r.kart.bodyGroup.rotation.z = THREE.MathUtils.lerp(r.kart.bodyGroup.rotation.z, targetRoll, Math.min(1, dt * 10));
    const boostPitch = (r.boostTimer > 0 || r.miniBoostTimer > 0) ? 0.05 : 0;
    const targetPitch = (r.roadPitch || 0) + boostPitch;
    r.kart.bodyGroup.rotation.x = THREE.MathUtils.lerp(r.kart.bodyGroup.rotation.x, targetPitch, Math.min(1, dt * 8));
  }

  // Bobbing 3D Battle Balloons!
  if (r.balloonMeshes) {
    for (const b of r.balloonMeshes) {
      if (b.mesh.visible) {
        b.mesh.position.y = b.baseY + Math.sin(raceTime * 4.2 + b.phase) * 0.16;
      }
    }
  }

  r.kart.steeringPivot.rotation.z = r.steerInput * 0.65;
  r.kart.driverGroup.rotation.y = r.steerInput * 0.2;
  for (const pivot of r.kart.frontWheelPivots) pivot.rotation.y = r.steerInput * 0.42;
  for (const wheel of r.kart.allWheels) wheel.rotation.x -= r.speed * dt * 2.1;

  const boostingNow = r.boostTimer > 0 || r.miniBoostTimer > 0 || r.engineBuffTimer > 0 || r.starTimer > 0;
  for (const flame of r.kart.flames) {
    flame.visible = boostingNow;
    if (boostingNow) {
      const flicker = 0.85 + Math.random() * 0.45;
      flame.scale.set(1, 1, r.boostTimer > 0 ? flicker * 1.45 : flicker * 0.9);
    }
  }

  if (r.isDrifting && r.speed > 16) {
    const visualYaw = r.yaw + r.driftVisualYaw;
    const rightX = Math.cos(visualYaw);
    const rightZ = -Math.sin(visualYaw);
    const backX = Math.sin(visualYaw);
    const backZ = Math.cos(visualYaw);
    for (const side of [-1.0, 1.0]) {
      const tx = r.pos.x + rightX * side + backX * 1.15;
      const tz = r.pos.z + rightZ * side + backZ * 1.15;
      // 3-Tier Drift Sparks: Orange (Mini) -> Cyan (Double) -> Purple (Ultra)!
      const sparkColor = r.driftTime >= 1.55 ? 0xd946ef : r.driftTime >= 0.9 ? 0x00f0ff : 0xffaa00;
      const sparkScale = r.driftTime >= 1.55 ? 1.15 : r.driftTime >= 0.9 ? 0.95 : 0.75;
      spawnParticle(
        new THREE.Vector3(tx, r.pos.y + 0.24, tz),
        new THREE.Vector3(backX * 7 + (Math.random() - 0.5) * 4, 2.5 + Math.random() * 3, backZ * 7 + (Math.random() - 0.5) * 4),
        sparkColor,
        0.28,
        sparkScale
      );
      if (skidThrottle <= 0) addSkidMark(tx, r.pos.y, tz, visualYaw);
    }
  }
}

function resolveKartCollisions() {
  const minDist = 2.6;
  for (let i = 0; i < racers.length; i++) {
    for (let j = i + 1; j < racers.length; j++) {
      const a = racers[i];
      const b = racers[j];
      const dx = b.pos.x - a.pos.x;
      const dz = b.pos.z - a.pos.z;
      const distSq = dx * dx + dz * dz;
      if (distSq > 0.001 && distSq < minDist * minDist) {
        const dist = Math.sqrt(distSq);
        const push = (minDist - dist) * 0.5;
        const nx = dx / dist;
        const nz = dz / dist;
        if (a.controlType !== 'remote') { a.pos.x -= nx * push; a.pos.z -= nz * push; }
        if (b.controlType !== 'remote') { b.pos.x += nx * push; b.pos.z += nz * push; }
        // Invincible Star OR Spike Bumper knocks opponents spinning on contact!
        const aSpike = a.mods && a.mods.bumper === 'spike' && a.speed > 26 && a.speed > b.speed + 5;
        const bSpike = b.mods && b.mods.bumper === 'spike' && b.speed > 26 && b.speed > a.speed + 5;
        if ((a.starTimer > 0 || aSpike) && b.starTimer <= 0 && b.spinTimer <= 0) {
          b.spinTimer = a.starTimer > 0 ? 1.0 : 0.65;
          b.speed *= 0.35;
          if (selectedMode === 'battle') popBattleBalloon(b);
          if (a.isHuman) {
            audio.playHit();
            if (aSpike) showBannerFor(a, '🛡️ 尖刺裝甲撞飛對手！', '#fbbf24', 0.95);
          }
        } else if ((b.starTimer > 0 || bSpike) && a.starTimer <= 0 && a.spinTimer <= 0) {
          a.spinTimer = b.starTimer > 0 ? 1.0 : 0.65;
          a.speed *= 0.35;
          if (selectedMode === 'battle') popBattleBalloon(a);
          if (b.isHuman) {
            audio.playHit();
            if (bSpike) showBannerFor(b, '🛡️ 尖刺裝甲撞飛對手！', '#fbbf24', 0.95);
          }
        }
      }
    }
  }
}

// --- Cameras ---
const camStates = [
  { pos: new THREE.Vector3(0, 10, 140), look: new THREE.Vector3(0, 2, 120) },
  { pos: new THREE.Vector3(0, 10, 140), look: new THREE.Vector3(0, 2, 120) },
];

function updateFollowCamera(cam, state, r, dt) {
  const backX = Math.sin(r.moveYaw || r.yaw);
  const backZ = Math.cos(r.moveYaw || r.yaw);
  const isBoost = r.boostTimer > 0;
  // Low, tight, high-speed arcade chase camera!
  const camDist = isBoost ? 8.4 : 7.3;
  const camHeight = isBoost ? 3.15 : 3.45;

  let desiredPos = new THREE.Vector3(r.pos.x + backX * camDist, r.pos.y + camHeight, r.pos.z + backZ * camDist);
  let desiredLook = new THREE.Vector3(r.pos.x - backX * 11, r.pos.y + 1.4, r.pos.z - backZ * 11);
  let targetFov = r.boostTimer > 0 ? 82 : r.miniBoostTimer > 0 ? 73 : 65 + Math.max(0, r.speed / 10);

  // Dramatic Zoom-In Mini-Animation (Overtaken / Overtake / Flattened)!
  if (state.zoom && state.zoom.timer > 0) {
    state.zoom.timer = Math.max(0, state.zoom.timer - dt);
    const p = 1 - state.zoom.timer / state.zoom.maxDur;
    // Fast snap-in, smooth ease-out bell curve!
    const zBlend = Math.sin(Math.min(1, p) * Math.PI);
    const tPos = state.zoom.target ? state.zoom.target.pos : r.pos;
    const rightX = Math.cos(r.yaw);
    const rightZ = -Math.sin(r.yaw);
    const zoomPos = new THREE.Vector3(
      tPos.x + backX * 5.6 + rightX * state.zoom.sideOffset,
      tPos.y + 2.35,
      tPos.z + backZ * 5.6 + rightZ * state.zoom.sideOffset
    );
    const zoomLook = new THREE.Vector3(tPos.x, tPos.y + 1.35, tPos.z);
    desiredPos.lerp(zoomPos, zBlend * 0.88);
    desiredLook.lerp(zoomLook, zBlend * 0.92);
    targetFov = THREE.MathUtils.lerp(targetFov, state.zoom.fov, zBlend);
    if (state.zoom.timer <= 0) state.zoom = null;
  }

  state.pos.lerp(desiredPos, 1 - Math.exp(-12 * dt));
  state.look.lerp(desiredLook, 1 - Math.exp(-16 * dt));

  cam.position.copy(state.pos);
  if (camShake > 0.01) {
    cam.position.x += (Math.random() - 0.5) * camShake;
    cam.position.y += (Math.random() - 0.5) * camShake * 0.7;
  }
  cam.lookAt(state.look);

  // Subtle camera banking into drifts & turns!
  const targetBank = -(r.steerInput * 0.032 + (r.driftVisualYaw || 0) * 0.065);
  state.bank = THREE.MathUtils.lerp(state.bank || 0, targetBank, Math.min(1, dt * 7));
  cam.rotation.z += state.bank;

  cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, Math.min(1, dt * 10));
  cam.updateProjectionMatrix();
}

function updateCameras(dt) {
  if (humanRacers.length === 0) return;

  if (gameState === 'menu') {
    showcaseAngle += dt * 0.55;
    const focusRacer = playType === '2' ? (humanRacers[activePickSlot] || humanRacers[0]) : humanRacers[0];
    const p = focusRacer.pos;
    const radius = 6.4;
    // Frame kart in the clear upper-middle showcase area above the lobby UI!
    camera1.position.set(p.x + Math.sin(showcaseAngle) * radius, p.y + 2.75, p.z + Math.cos(showcaseAngle) * radius);
    camera1.lookAt(p.x, p.y - 0.55, p.z);
    camera1.fov = THREE.MathUtils.lerp(camera1.fov, 50, Math.min(1, dt * 6));
    camera1.updateProjectionMatrix();
    return;
  }

  if (gameState === 'finished' && podiumGroup) {
    // Cinematic slow orbit around the 3D Victory Podium & Fireworks!
    const baseYaw = podiumGroup.rotation.y;
    const orbit = baseYaw + Math.sin(podiumTimer * 0.45) * 0.55;
    const radius = 15.5;
    camera1.position.set(
      podiumCenter.x + Math.sin(orbit) * radius,
      podiumCenter.y + 6.2,
      podiumCenter.z + Math.cos(orbit) * radius
    );
    camera1.lookAt(podiumCenter.x, podiumCenter.y + 1.4, podiumCenter.z);
    camera1.fov = THREE.MathUtils.lerp(camera1.fov, 52, Math.min(1, dt * 5));
    camera1.updateProjectionMatrix();
    return;
  }

  updateFollowCamera(camera1, camStates[0], humanRacers[0], dt);
  if (playType === '2' && humanRacers[1]) {
    updateFollowCamera(camera2, camStates[1], humanRacers[1], dt);
  }
}

// --- HUD & Finish ---
function formatTime(sec) {
  if (!isFinite(sec)) return '--:--.--';
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60);
  const cs = Math.floor((sec * 100) % 100);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

function getSortedRacers() {
  if (selectedMode === 'battle') {
    return [...racers].sort((a, b) => {
      if (b.balloons !== a.balloons) return b.balloons - a.balloons;
      return (b.finishTime || 999) - (a.finishTime || 999);
    });
  }
  return [...racers].sort((a, b) => {
    if (a.finished && b.finished) return a.finishTime - b.finishTime;
    if (a.finished) return -1;
    if (b.finished) return 1;
    return b.totalProgress - a.totalProgress;
  });
}

function updateHUD() {
  if (humanRacers.length === 0) return;
  const sorted = getSortedRacers();
  const suffixes = ['st', 'nd', 'rd', 'th'];
  hudTime.textContent = selectedMode === 'battle' ? `剩 ${Math.ceil(Math.max(0, battleTimer))}s` : formatTime(raceTime);

  humanRacers.forEach((r, idx) => {
    const h = pHudEls[idx];
    const rank = sorted.indexOf(r) + 1;
    // Overtake & Overtaken Dramatic Zoom-In Mini-Animations!
    if (selectedMode !== 'battle' && gameState === 'racing' && raceTime > 2.8 && r.overtakeCooldown <= 0) {
      if (rank < r.lastRank) {
        r.overtakeCooldown = 3.2;
        raceCoinsEarned += 5;
        hudCoinsVal.textContent = raceCoinsEarned;
        audio.playCoin();
        showBannerFor(r, '⚡ OVERTAKE! 帥氣超車 +5🪙', '#38ef7d', 1.1);
        triggerCamZoom(idx, r, 0.65, 50, -1.8, 0);
      } else if (rank > r.lastRank) {
        r.overtakeCooldown = 4.5;
        const passer = sorted[rank - 2];
        if (passer && passer !== r) {
          audio.playBeep(260, 0.14, 0.12);
          showBannerFor(r, `😱 被 ${passer.name} 超車了！！`, '#ff6b6b', 1.35);
          triggerHornEmote(passer, '😏 超過你囉！');
          triggerCamZoom(idx, passer, 0.95, 40, 2.6, 0.25);
        }
      }
    }
    r.lastRank = rank;
    h.rank.textContent = rank;
    h.suffix.textContent = suffixes[rank - 1] || 'th';
    h.lap.textContent = selectedMode === 'battle' ? '🎈'.repeat(Math.max(0, r.balloons)) || '💥' : Math.min(r.lap, TOTAL_LAPS);
    h.speed.textContent = Math.round(Math.abs(r.speed) * 3.8);
    h.nitroFill.style.width = `${Math.min(100, r.nitroGauge)}%`;
    if (h.ink) h.ink.classList.toggle('hidden', r.squidTimer <= 0);

    h.slots.forEach((el, sIdx) => {
      el.classList.remove('ready', 'item-ready');
      if (isItemModeActive()) {
        const itemId = r.items[sIdx];
        if (itemId) {
          const info = ITEM_TYPES[itemId];
          el.classList.add('item-ready');
          el.innerHTML = `<span class="slot-icon">${info.icon}</span><span class="slot-sub">${info.name}</span>`;
        } else {
          el.innerHTML = `<span class="slot-icon" style="opacity:0.25">?</span>`;
        }
      } else {
        const hasNitro = sIdx < r.nitroSlots;
        el.classList.toggle('ready', hasNitro);
        el.innerHTML = `<span class="slot-icon" style="font-size:14px">N2O</span>`;
      }
    });
  });

  speedLinesEl.classList.toggle('active', playType !== '2' && humanRacers[0].boostTimer > 0);
  drawMinimap();
}

function drawMinimap() {
  const w = minimapCanvas.width;
  const h = minimapCanvas.height;
  minimapCtx.clearRect(0, 0, w, h);

  const pad = 16;
  const spanX = track.maxX - track.minX;
  const spanZ = track.maxZ - track.minZ;
  const scale = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanZ);
  const offX = (w - spanX * scale) / 2 - track.minX * scale;
  const offZ = (h - spanZ * scale) / 2 - track.minZ * scale;

  minimapCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  minimapCtx.lineWidth = track.isBattleArena ? 4 : 7;
  minimapCtx.lineJoin = 'round';
  minimapCtx.beginPath();
  if (track.isBattleArena) {
    minimapCtx.arc(w / 2, h / 2, track.arenaRadius * scale, 0, Math.PI * 2);
  } else {
    track.points.forEach((p, idx) => {
      const mx = p.x * scale + offX;
      const my = p.z * scale + offZ;
      if (idx === 0) minimapCtx.moveTo(mx, my);
      else minimapCtx.lineTo(mx, my);
    });
    minimapCtx.closePath();
  }
  minimapCtx.stroke();

  const sp = track.points[0];
  minimapCtx.fillStyle = '#ffffff';
  minimapCtx.fillRect(sp.x * scale + offX - 5, sp.z * scale + offZ - 2, 10, 4);

  for (const r of racers) {
    const mx = r.pos.x * scale + offX;
    const my = r.pos.z * scale + offZ;
    minimapCtx.beginPath();
    minimapCtx.arc(mx, my, r.isHuman ? 5.5 : 4, 0, Math.PI * 2);
    minimapCtx.fillStyle = r.kart.preset.mapColor;
    minimapCtx.fill();
    if (r.isHuman) {
      minimapCtx.lineWidth = 2;
      minimapCtx.strokeStyle = r.humanIndex === 1 ? '#00f5ff' : '#ffffff';
      minimapCtx.stroke();
    }
  }
}

function onRaceFinish() {
  gameState = 'finished';
  audio.updateDrive(0, false, false, false);
  speedLinesEl.classList.remove('active');
  hud.classList.add('hidden');
  splitDivider.classList.add('hidden');
  finishScreen.classList.remove('hidden');

  const sorted = getSortedRacers();
  const p1 = humanRacers[0];
  const p1Rank = sorted.indexOf(p1) + 1;
  const bestHumanRank = Math.min(...humanRacers.map((h) => sorted.indexOf(h) + 1));

  audio.playVictory(bestHumanRank);
  buildVictoryPodium(sorted, bestHumanRank === 4);

  const badges = ['🏆 盛大冠軍頒獎典禮', '🥈 榮耀亞軍頒獎典禮', '🥉 熱血季軍頒獎典禮', '😅 殿軍鼓勵獎'];
  const subs = [
    '煙火齊放！全場歡呼！你是本場最強車神！',
    '太強了！只差一步就是冠軍，站上銀牌頒獎台！',
    '表現亮眼！成功搶下銅牌頒獎台席次！',
    '別氣餒！去車庫升級引擎，下一場用雷射炮炸翻他們！',
  ];
  if (finishBadgeEl) finishBadgeEl.textContent = badges[bestHumanRank - 1] || '🏁 比賽結束';
  if (finishSubtitleEl) finishSubtitleEl.textContent = subs[bestHumanRank - 1] || '';

  if (playType === '2') {
    const winner = sorted[0];
    finishRankTitle.textContent = `🏆 冠軍：${winner.name}！`;
  } else {
    const titles = ['第 1 名！冠軍！🏆', '第 2 名！亞軍！🥈', '第 3 名！季軍！🥉', '第 4 名！殿軍加油！😅'];
    finishRankTitle.textContent = titles[p1Rank - 1] || `第 ${p1Rank} 名`;
  }

  // Grand Prix 4-Track Cup points accumulation!
  let cupBonus = 0;
  const isCupFinal = selectedMode === 'cup' && cupRound >= CUP_TRACKS.length - 1;
  if (selectedMode === 'cup') {
    const ptsTable = [10, 6, 4, 2];
    sorted.forEach((r, idx) => {
      cupScores[r.name] = (cupScores[r.name] || 0) + (ptsTable[idx] || 1);
    });
    if (isCupFinal) {
      const topScore = Math.max(...Object.values(cupScores));
      const p1Score = cupScores[p1.name] || 0;
      if (p1Score >= topScore) {
        cupBonus = 120;
        if (finishBadgeEl) finishBadgeEl.textContent = '🏆 錦標賽總冠軍金盃！！';
        if (finishSubtitleEl) finishSubtitleEl.textContent = `4 關總積分 ${p1Score} 分稱霸全場！額外獲得 +120🪙 冠軍大獎！`;
      } else {
        if (finishBadgeEl) finishBadgeEl.textContent = `🏁 錦標賽 4 關完賽！（總分 ${p1Score} 分）`;
      }
    } else {
      if (finishBadgeEl) finishBadgeEl.textContent = `🏆 錦標賽第 ${cupRound + 1} / 4 關完成！`;
    }
  }

  // Progression Unlock, Medals, Coins & Ghost Replay Save!
  const rankBonus = [50, 30, 20, 10][Math.min(3, bestHumanRank - 1)] || 10;
  const totalReward = rankBonus + raceCoinsEarned + cupBonus;
  saveData.coins += totalReward;

  const medalOrder = { '': 0, '🥉': 1, '🥈': 2, '🥇': 3 };
  const newMedal = bestHumanRank === 1 ? '🥇' : bestHumanRank === 2 ? '🥈' : bestHumanRank === 3 ? '🥉' : '';
  if ((medalOrder[newMedal] || 0) > (medalOrder[saveData.medals[selectedTrackId] || ''] || 0)) {
    saveData.medals[selectedTrackId] = newMedal;
  }

  let savedNewGhost = false;
  if (playType === '1' && p1.finishTime < (saveData.bestTimes[selectedTrackId] || Infinity)) {
    saveData.bestTimes[selectedTrackId] = p1.finishTime;
    if (currentGhostLog.length >= 6) {
      saveData.ghosts[selectedTrackId] = currentGhostLog;
      savedNewGhost = true;
    }
  }

  const curIdx = TRACK_ORDER.indexOf(selectedTrackId);
  writeSave();
  renderTrackButtons();
  renderGarageUI();

  if (finishRewardEl) {
    finishRewardEl.textContent = `+${totalReward} 🪙` + (savedNewGhost ? ' ・ 👻 新幽靈紀錄！' : '');
  }

  const hasNextTrack = selectedMode === 'cup' ? (cupRound + 1 < CUP_TRACKS.length) : (curIdx + 1 < TRACK_ORDER.length);
  nextTrackBtn.classList.toggle('hidden', !hasNextTrack || selectedMode === 'battle');
  nextTrackBtn.textContent = selectedMode === 'cup' ? `錦標賽第 ${cupRound + 2} 關 ➔` : '前往下一關 ➔';
  unlockBannerEl.classList.add('hidden');

  const modeLabel = selectedMode === 'battle' ? '氣球大亂鬥' : selectedMode === 'cup' ? `錦標賽 ${cupRound + 1}/4` : selectedMode === 'item' ? '道具模式' : '競速模式';
  finishMetaEl.textContent = `${selectedMode === 'battle' ? '🎈 氣球競技場' : `${track.config.icon} ${track.config.name}`}・${modeLabel}`;
  finishTimeEl.textContent = selectedMode === 'battle' ? `剩餘 ${p1.balloons} 🎈` : formatTime(p1.finishTime);
  finishBestLapEl.textContent = selectedMode === 'cup' ? `總分 ${cupScores[p1.name] || 0} pt` : formatTime(p1.bestLapTime);

  standingsListEl.innerHTML = '';
  sorted.forEach((r, idx) => {
    const row = document.createElement('div');
    row.className = 'standing-item' + (r.isHuman ? ' player' : '');
    const timeLabel = selectedMode === 'battle'
      ? (r.balloons > 0 ? '🎈'.repeat(r.balloons) : '💥 淘汰')
      : selectedMode === 'cup'
        ? `${cupScores[r.name] || 0} 分`
        : (r.finished ? formatTime(r.finishTime) : '賽道行駛中');
    row.innerHTML = `<span>#${idx + 1} ${r.name} (${r.kartName})</span><span>${timeLabel}</span>`;
    standingsListEl.appendChild(row);
  });
}

// --- Boot & Main Loop ---
renderTrackButtons();
renderGarageUI();
renderDriverButtons();
renderKartCards();
updateSetupSummary();
updateLobbyControlsGuide();
loadTrack(selectedTrackId);
setupShowcase();

function updateGhostReplay(dt) {
  if (playType !== '1' || gameState !== 'racing') return;
  const p1 = humanRacers[0];
  if (p1 && !p1.finished) {
    ghostRecordAccum += dt;
    if (ghostRecordAccum >= 0.14 && currentGhostLog.length < 1800) {
      ghostRecordAccum = 0;
      currentGhostLog.push([
        Math.round(raceTime * 100) / 100,
        Math.round(p1.pos.x * 10) / 10,
        Math.round(p1.pos.y * 10) / 10,
        Math.round(p1.pos.z * 10) / 10,
        Math.round(p1.yaw * 100) / 100,
      ]);
    }
  }
  if (ghostKart && ghostPlaybackData && ghostPlaybackData.length >= 2) {
    let i = 0;
    while (i < ghostPlaybackData.length - 2 && ghostPlaybackData[i + 1][0] < raceTime) i++;
    const a = ghostPlaybackData[i];
    const b = ghostPlaybackData[i + 1];
    const span = Math.max(0.001, b[0] - a[0]);
    const f = THREE.MathUtils.clamp((raceTime - a[0]) / span, 0, 1);
    ghostKart.root.position.set(
      THREE.MathUtils.lerp(a[1], b[1], f),
      THREE.MathUtils.lerp(a[2], b[2], f),
      THREE.MathUtils.lerp(a[3], b[3], f)
    );
    ghostKart.root.rotation.y = THREE.MathUtils.lerp(a[4], b[4], f);
  }
}

let lastTime = performance.now();
function animate(now) {
  requestAnimationFrame(animate);
  let dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  if (zoomSlowMoTimer > 0) {
    zoomSlowMoTimer = Math.max(0, zoomSlowMoTimer - dt);
    if (gameState === 'racing') dt *= 0.58;
  }
  if (camShake > 0) camShake = Math.max(0, camShake - dt * 1.4);
  skidThrottle = skidThrottle <= 0 ? 0.05 : skidThrottle - dt;

  if (gameState === 'countdown') {
    countdownTimer -= dt;
    const currentNum = Math.ceil(countdownTimer);
    if (currentNum !== lastCountdownNum && currentNum > 0 && currentNum <= 3) {
      lastCountdownNum = currentNum;
      countdownEl.textContent = currentNum;
      countdownEl.classList.remove('hidden');
      countdownEl.style.animation = 'none';
      void countdownEl.offsetWidth;
      countdownEl.style.animation = '';
      audio.playBeep(520, 0.16, 0.14);
    }
    if (countdownTimer <= 0) {
      gameState = 'racing';
      countdownEl.textContent = 'GO!';
      audio.playBeep(880, 0.28, 0.16);
      audio.startBgm();
      // Give AI racers a brisk launch on GO! so the pack stays competitive right away
      for (const r of racers) {
        if (r.controlType === 'ai') r.speed = r.kart.preset.maxSpeed * 0.55;
      }
      // PERFECT START boost if holding gas right on GO!
      for (const h of humanRacers) {
        if (getPlayerInputState(h.humanIndex).accel) {
          h.boostTimer = 1.5;
          h.speed = h.kart.preset.maxSpeed * 0.72;
          camShake = 0.35;
          audio.playBoost();
          showBannerFor(h, '🔥 PERFECT START 完美起跑！', '#ffdd00', 1.35);
        }
      }
      setTimeout(() => countdownEl.classList.add('hidden'), 650);
    }
  }

  pollGamepads();
  if (gameState === 'racing') {
    raceTime += dt;
    track.update(dt);
    updateGhostReplay(dt);
    if (selectedMode === 'battle') {
      battleTimer -= dt;
      const alive = racers.filter((r) => !r.eliminated);
      const humansAlive = humanRacers.filter((h) => !h.eliminated);
      if (alive.length <= 1 || humansAlive.length === 0 || battleTimer <= 0) {
        onRaceFinish();
      }
    }
  }

  for (const h of pHudEls) {
    if (h.bannerTimer > 0) {
      h.bannerTimer -= dt;
      if (h.bannerTimer <= 0) h.banner.classList.add('hidden');
    }
  }

  if (gameState === 'paused') {
    // Render frozen frame cleanly without advancing physics or timers
  } else if (gameState === 'finished') {
    updateVictoryCelebration(dt);
  } else {
    for (const r of racers) updateRacerPhysics(r, dt);
    resolveKartCollisions();
  }

  const sorted = getSortedRacers();
  if (gameState === 'racing') {
    itemManager.update(dt, racers, sorted);
    // Sync local player over WebRTC in LAN/Online mode
    if (playType === 'net' && net.connected && humanRacers[0]) {
      const me = humanRacers[0];
      net.sendState({
        x: me.pos.x,
        y: me.pos.y,
        z: me.pos.z,
        yaw: me.yaw,
        speed: me.speed,
        dy: me.driftVisualYaw,
        st: me.steerInput,
        bt: me.boostTimer,
        sh: me.shieldTimer,
        wt: me.waterTrapTimer,
        sp: me.spinTimer,
        lap: me.lap,
        prog: me.totalProgress,
        fin: me.finished,
        ft: me.finishTime,
      }, now);
    }
  }
  updateParticles(dt);

  if (humanRacers[0] && gameState === 'racing') {
    const p = humanRacers[0];
    audio.updateDrive(p.speed / p.kart.preset.maxSpeed, p.isDrifting, p.boostTimer > 0, true);
  } else {
    audio.updateDrive(0, false, false, false);
  }

  updateCameras(dt);
  if (gameState === 'racing' || gameState === 'countdown') updateHUD();

  // Render (Full-Screen or 2P Split-Screen)
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (playType === '2' && gameState !== 'menu' && gameState !== 'finished') {
    renderer.setScissorTest(true);
    const halfW = Math.floor(w / 2);

    camera1.aspect = halfW / h;
    camera1.updateProjectionMatrix();
    renderer.setViewport(0, 0, halfW, h);
    renderer.setScissor(0, 0, halfW, h);
    renderer.render(scene, camera1);

    camera2.aspect = (w - halfW) / h;
    camera2.updateProjectionMatrix();
    renderer.setViewport(halfW, 0, w - halfW, h);
    renderer.setScissor(halfW, 0, w - halfW, h);
    renderer.render(scene, camera2);
  } else {
    renderer.setScissorTest(false);
    camera1.aspect = w / h;
    camera1.updateProjectionMatrix();
    renderer.setViewport(0, 0, w, h);
    renderer.render(scene, camera1);
  }
}

requestAnimationFrame(animate);
