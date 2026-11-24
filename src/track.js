import * as THREE from 'three';

export const TRACK_ORDER = ['village', 'desert', 'neon', 'ice', 'beach', 'sakura', 'volcano', 'rainbow', 'sky', 'dino', 'candy', 'island'];

// Control points are now 3D: [x, y, z] for hills, bridges, figure-8 overpasses & drops!
export const TRACK_CONFIGS = {
  village: {
    id: 'village',
    name: '積木城鎮',
    icon: '🌲',
    skyColor: 0x7cc8ff,
    fogColor: 0x7cc8ff,
    hemiSky: 0xdff4ff,
    hemiGround: 0x3b7a3d,
    hemiIntensity: 0.9,
    sunColor: 0xfff8e7,
    sunIntensity: 1.65,
    groundColor: '#47b849',
    studColor: '#3da83f',
    roadBg: '#2e3440',
    roadEdge: '#ffffff',
    roadCenter: '#ffd54f',
    curbA: '#e53935',
    curbB: '#ffffff',
    postA: 0x1565c0,
    postB: 0xffffff,
    archPillar: 0xffb300,
    archTop: 0x0d47a1,
    // 1. Classic GP Circuit: straight -> high-speed S-chicane -> park bridge -> sweeping return
    points: [
      [0, 0, 140], [0, 0, 20], [0, 0, -90], [65, 6, -185], [170, 10, -170],
      [210, 6, -70], [115, 2, -10], [215, 6, 80], [190, 8, 195],
      [85, 2, 230], [0, 0, 195],
    ],
    boostTs: [0.09, 0.34, 0.57, 0.79, 0.92],
    rampTs: [0.22, 0.68],
    itemRowTs: [0.16, 0.43, 0.65, 0.86],
    obstacleTs: [0.5],
    dinoTs: [0.27],
    trainTs: [0.62],
    tunnelRange: [0.72, 0.82],
    shortcut: [0.36, 0.48],
  },
  desert: {
    id: 'desert',
    name: '黃金沙漠',
    icon: '🏜️',
    skyColor: 0xffb36b,
    fogColor: 0xf4a460,
    hemiSky: 0xffe4b5,
    hemiGround: 0xc28a42,
    hemiIntensity: 0.95,
    sunColor: 0xffe2a8,
    sunIntensity: 1.85,
    groundColor: '#e6b86a',
    studColor: '#d4a353',
    roadBg: '#3e322b',
    roadEdge: '#ffe082',
    roadCenter: '#ffffff',
    curbA: '#ff6f00',
    curbB: '#fff8e1',
    postA: 0xd84315,
    postB: 0xffca28,
    archPillar: 0xd84315,
    archTop: 0x4e342e,
    // 2. Quad-Hairpin Switchback Canyon (4 tight 180° drift hairpins!)
    points: [
      [0, 0, 140], [0, 0, 20], [0, 4, -120], [95, 10, -210], [215, 14, -195],
      [245, 10, -110], [105, 6, -95], [105, 6, -20], [260, 12, -5],
      [260, 12, 85], [110, 6, 100], [110, 4, 175], [220, 6, 225],
      [90, 2, 245], [0, 0, 200],
    ],
    boostTs: [0.07, 0.25, 0.47, 0.7, 0.9],
    rampTs: [0.18, 0.58, 0.82],
    itemRowTs: [0.14, 0.36, 0.62, 0.84],
    obstacleTs: [0.31, 0.74],
    dinoTs: [0.54],
    boulderTs: [0.39],
    tunnelRange: [0.76, 0.85],
    shortcut: [0.32, 0.45],
  },
  neon: {
    id: 'neon',
    name: '霓虹夜市',
    icon: '🌃',
    skyColor: 0x0b1026,
    fogColor: 0x0e1433,
    hemiSky: 0x7c9bff,
    hemiGround: 0x3b2666,
    hemiIntensity: 1.45,
    sunColor: 0xd0e4ff,
    sunIntensity: 1.4,
    groundColor: '#13172b',
    studColor: '#1e2445',
    roadBg: '#1c2238',
    roadEdge: '#00f5ff',
    roadCenter: '#ff2a9d',
    curbA: '#ff2a9d',
    curbB: '#00f5ff',
    postA: 0x00e5ff,
    postB: 0xe91e8c,
    archPillar: 0xe91e8c,
    archTop: 0x00e5ff,
    // 3. Clean Symmetric 3D Figure-8 Overpass! Crosses at [140, 0, 0] (lower) & [140, 16, 0] (upper bridge)
    points: [
      [0, 0, 140], [0, 0, 30], [0, 0, -90], [65, 0, -195], [190, 0, -195],
      [250, 0, -95], [140, 0, 0], [45, 5, 95], [70, 12, 215],
      [205, 16, 225], [275, 16, 115], [215, 16, 30], [140, 16, 0],
      [45, 10, -25], [-55, 4, 55], [-45, 1, 165], [0, 0, 195],
    ],
    boostTs: [0.08, 0.29, 0.54, 0.76, 0.91],
    rampTs: [0.22, 0.66],
    itemRowTs: [0.15, 0.4, 0.61, 0.84],
    obstacleTs: [0.35, 0.8],
    tunnelRange: [0.44, 0.54],
    shortcut: [0.22, 0.34],
  },
  ice: {
    id: 'ice',
    name: '極地冰原',
    icon: '❄️',
    skyColor: 0xb8e6ff,
    fogColor: 0xcbeeff,
    hemiSky: 0xffffff,
    hemiGround: 0x8cc8e8,
    hemiIntensity: 1.0,
    sunColor: 0xf0fbff,
    sunIntensity: 1.5,
    groundColor: '#e8f7ff',
    studColor: '#cde8f8',
    roadBg: '#397ea8',
    roadEdge: '#ffffff',
    roadCenter: '#b3e5fc',
    curbA: '#0288d1',
    curbB: '#ffffff',
    postA: 0x039be5,
    postB: 0xe1f5fe,
    archPillar: 0x0288d1,
    archTop: 0x01579b,
    // 4. Giant Alpine Zig-Zag Glacier Slalom (climbs to y=26, plunges down huge Z-curves!)
    points: [
      [0, 0, 140], [0, 0, 20], [-20, 8, -110], [-125, 18, -195], [-40, 26, -265],
      [95, 24, -220], [15, 16, -125], [165, 12, -95], [90, 6, 15],
      [225, 4, 85], [135, 2, 195], [35, 0, 235], [0, 0, 195],
    ],
    boostTs: [0.09, 0.34, 0.57, 0.81],
    rampTs: [0.24, 0.49, 0.74],
    itemRowTs: [0.17, 0.43, 0.66, 0.86],
    obstacleTs: [0.39, 0.69],
    tunnelRange: [0.26, 0.35],
    shortcut: [0.52, 0.65],
  },
  beach: {
    id: 'beach',
    name: '熱帶海島',
    icon: '🏖️',
    skyColor: 0x4dd0e1,
    fogColor: 0x80deea,
    hemiSky: 0xe0f7fa,
    hemiGround: 0x00acc1,
    hemiIntensity: 1.0,
    sunColor: 0xfffde7,
    sunIntensity: 1.8,
    groundColor: '#00bcd4',
    studColor: '#00acc1',
    roadBg: '#f3d299',
    roadEdge: '#ffffff',
    roadCenter: '#ff7043',
    curbA: '#ff7043',
    curbB: '#ffffff',
    postA: 0xffca28,
    postB: 0xffffff,
    archPillar: 0xff7043,
    archTop: 0x00838f,
    // 5. Twin-Island Butterfly Bridges (West Island Loop <-> Long High Ocean Bridge <-> East Island Loop)
    points: [
      [0, 2, 140], [0, 2, 20], [-35, 4, -100], [-145, 6, -165], [-195, 4, -55],
      [-95, 8, 15], [60, 16, 15], [215, 14, -10], [285, 6, -110],
      [215, 4, -195], [140, 8, -95], [245, 12, 85], [215, 8, 210],
      [85, 4, 225], [0, 2, 195],
    ],
    boostTs: [0.08, 0.34, 0.54, 0.76, 0.91],
    rampTs: [0.23, 0.42, 0.68, 0.84],
    itemRowTs: [0.16, 0.38, 0.62, 0.82],
    obstacleTs: [0.47, 0.73],
    tunnelRange: [0.76, 0.85],
    shortcut: [0.24, 0.37],
  },
  sakura: {
    id: 'sakura',
    name: '櫻花古城',
    icon: '🏯',
    skyColor: 0xffcdd2,
    fogColor: 0xf8bbd0,
    hemiSky: 0xffeef2,
    hemiGround: 0x81c784,
    hemiIntensity: 1.0,
    sunColor: 0xfff3e0,
    sunIntensity: 1.55,
    groundColor: '#66bb6a',
    studColor: '#57a85b',
    roadBg: '#455a64',
    roadEdge: '#f48fb1',
    roadCenter: '#ffffff',
    curbA: '#d32f2f',
    curbB: '#fce4ec',
    postA: 0xd32f2f,
    postB: 0xf8bbd0,
    archPillar: 0xc62828,
    archTop: 0x212121,
    // 6. Touge Mountain 5-Switchback Peak Climb & High-Speed Valley Sprint
    points: [
      [0, 0, 140], [0, 0, 20], [0, 4, -100], [110, 10, -185], [240, 16, -145],
      [155, 22, -65], [275, 26, 15], [160, 22, 95], [265, 16, 175],
      [140, 10, 245], [35, 6, 170], [-75, 4, 215], [-55, 1, 145], [0, 0, 195],
    ],
    boostTs: [0.08, 0.3, 0.52, 0.74, 0.9],
    rampTs: [0.22, 0.56, 0.81],
    itemRowTs: [0.15, 0.38, 0.61, 0.83],
    obstacleTs: [0.43, 0.67],
    tunnelRange: [0.16, 0.25],
    shortcut: [0.45, 0.58],
  },
  volcano: {
    id: 'volcano',
    name: '熔岩火山',
    icon: '🌋',
    skyColor: 0x3b1212,
    fogColor: 0x4a1612,
    hemiSky: 0xff8a65,
    hemiGround: 0x5d1c0c,
    hemiIntensity: 1.25,
    sunColor: 0xffab91,
    sunIntensity: 1.55,
    groundColor: '#2a1816',
    studColor: '#ff5722',
    roadBg: '#262226',
    roadEdge: '#ff6d00',
    roadCenter: '#ffeb3b',
    curbA: '#ff3d00',
    curbB: '#212121',
    postA: 0xff3d00,
    postB: 0xffab00,
    archPillar: 0xd50000,
    archTop: 0xff6d00,
    // 7. 3-Lobe Cloverleaf Volcano Crater Circuit (wild radial petals around central magma!)
    points: [
      [0, 2, 140], [0, 2, 20], [-20, 8, -110], [-145, 16, -175], [-60, 24, -265],
      [60, 18, -165], [185, 24, -245], [275, 16, -125], [155, 8, -25],
      [295, 16, 65], [250, 22, 195], [115, 14, 155], [75, 8, 255],
      [-25, 4, 215], [0, 2, 195],
    ],
    boostTs: [0.08, 0.28, 0.5, 0.72, 0.89],
    rampTs: [0.19, 0.42, 0.65, 0.84],
    itemRowTs: [0.15, 0.37, 0.6, 0.81],
    obstacleTs: [0.32, 0.55, 0.77],
    tunnelRange: [0.55, 0.65],
    shortcut: [0.23, 0.36],
  },
  rainbow: {
    id: 'rainbow',
    name: '彩虹太空道',
    icon: '🌈',
    skyColor: 0x06081c,
    fogColor: 0x090d28,
    hemiSky: 0xc5d8ff,
    hemiGround: 0x4a148c,
    hemiIntensity: 1.45,
    sunColor: 0xffffff,
    sunIntensity: 1.5,
    groundColor: '#090c24',
    studColor: '#1d2458',
    roadBg: '#rainbow',
    roadEdge: '#ffffff',
    roadCenter: '#ffffff',
    curbA: '#ffdd00',
    curbB: '#ff2a9d',
    postA: 0xffdd00,
    postB: 0x00f5ff,
    archPillar: 0xffdd00,
    archTop: 0xa855f7,
    // 8. 360° Ascending Space Corkscrew Spiral + High-Altitude Sky Wave Rollercoaster!
    points: [
      [0, 6, 140], [0, 6, 20], [0, 8, -90],
      // Full 360° ascending corkscrew spiral (y = 10 -> 30)!
      [95, 12, -165], [185, 18, -95], [125, 24, 0], [35, 28, -65], [95, 32, -165],
      // Sky-high mega wave rollercoaster back to start!
      [245, 30, -185], [305, 14, -55], [250, 28, 85], [285, 12, 215],
      [155, 22, 255], [45, 10, 235], [0, 6, 195],
    ],
    boostTs: [0.07, 0.24, 0.44, 0.64, 0.84],
    rampTs: [0.16, 0.38, 0.58, 0.78],
    itemRowTs: [0.13, 0.33, 0.53, 0.74],
    obstacleTs: [0.29, 0.49, 0.69, 0.87],
    tunnelRange: [0.41, 0.5],
    shortcut: [0.62, 0.75],
  },
  sky: {
    id: 'sky',
    name: '雲端天國',
    icon: '☁️',
    openEdge: true, // NO guardrails — fall off into the clouds to respawn!
    skyColor: 0x60b6ff,
    fogColor: 0xbae6fd,
    hemiSky: 0xffffff,
    hemiGround: 0x93c5fd,
    hemiIntensity: 1.2,
    sunColor: 0xfffde7,
    sunIntensity: 1.8,
    groundColor: '#e0f2fe',
    studColor: '#ffffff',
    roadBg: '#f8fafc',
    roadEdge: '#fbbf24',
    roadCenter: '#38bdf8',
    curbA: '#fbbf24',
    curbB: '#ffffff',
    postA: 0xfbbf24,
    postB: 0xffffff,
    archPillar: 0xfbbf24,
    archTop: 0x38bdf8,
    // Floating Sky Circuit suspended high above the cloud sea!
    points: [
      [0, 30, 140], [0, 30, 20], [0, 34, -95], [85, 42, -195], [210, 46, -165],
      [255, 38, -55], [140, 32, 10], [260, 38, 105], [215, 44, 220],
      [90, 36, 240], [0, 30, 195],
    ],
    boostTs: [0.09, 0.3, 0.53, 0.75, 0.91],
    rampTs: [0.2, 0.44, 0.68, 0.85],
    itemRowTs: [0.15, 0.38, 0.61, 0.82],
    obstacleTs: [0.34, 0.72],
    fanTs: [0.28, 0.66],
    tunnelRange: [0.46, 0.54],
    shortcut: [0.23, 0.37],
  },
  dino: {
    id: 'dino',
    name: '恐龍侏羅紀',
    icon: '🦖',
    skyColor: 0x86efac,
    fogColor: 0x4ade80,
    hemiSky: 0xdcfce7,
    hemiGround: 0x3f6212,
    hemiIntensity: 1.0,
    sunColor: 0xfef08a,
    sunIntensity: 1.75,
    groundColor: '#2d5a27',
    studColor: '#234a1e',
    roadBg: '#4a3b2c',
    roadEdge: '#facc15',
    roadCenter: '#fde047',
    curbA: '#eab308',
    curbB: '#166534',
    postA: 0x854d0e,
    postB: 0xfacc15,
    archPillar: 0x15803d,
    archTop: 0xca8a04,
    // Prehistoric Jurassic Valley with rolling hills & 3 giant stomping T-Rexes!
    points: [
      [0, 0, 140], [0, 0, 20], [0, 4, -100], [90, 12, -200], [205, 16, -165],
      [250, 10, -55], [145, 4, 5], [240, 8, 115], [190, 12, 225],
      [75, 4, 240], [0, 0, 195],
    ],
    boostTs: [0.08, 0.31, 0.58, 0.83],
    rampTs: [0.24, 0.65],
    itemRowTs: [0.13, 0.37, 0.62, 0.86],
    obstacleTs: [0.4],
    dinoTs: [0.18, 0.48, 0.78],
    boulderTs: [0.63],
    tunnelRange: [0.68, 0.75],
    shortcut: [0.26, 0.39],
  },
  candy: {
    id: 'candy',
    name: '糖果王國',
    icon: '🍭',
    skyColor: 0xffc8e8,
    fogColor: 0xffd6ef,
    hemiSky: 0xfff0fa,
    hemiGround: 0xf472b6,
    hemiIntensity: 1.15,
    sunColor: 0xfffaf0,
    sunIntensity: 1.7,
    groundColor: '#ffb3d9',
    studColor: '#ff9ccc',
    roadBg: '#6b3a2a',
    roadEdge: '#ffffff',
    roadCenter: '#ff4fa3',
    curbA: '#ff2d6f',
    curbB: '#ffffff',
    postA: 0xff4fa3,
    postB: 0x7dd3fc,
    archPillar: 0xff4fa3,
    archTop: 0x8b5cf6,
    // 11. 巧克力大道穿過巨型甜甜圈、繞過蛋糕山，最後從棒棒糖森林衝回終點！
    points: [
      [0, 0, 140], [0, 0, 20], [0, 4, -80], [-60, 10, -170], [30, 16, -240],
      [150, 12, -215], [200, 6, -120], [140, 2, -40], [230, 8, 40],
      [260, 14, 160], [170, 10, 240], [60, 4, 250], [0, 0, 195],
    ],
    boostTs: [0.08, 0.27, 0.49, 0.71, 0.9],
    rampTs: [0.2, 0.6],
    itemRowTs: [0.14, 0.38, 0.62, 0.84],
    obstacleTs: [0.45, 0.78],
    donutGateTs: [0.33, 0.67],
  },
  island: {
    id: 'island',
    name: '海島大冒險',
    icon: '🏝️',
    water: true, // 地面是海：路面缺口掉下去會落海，救回後繼續
    skyColor: 0x7dd3fc,
    fogColor: 0xbfe9ff,
    hemiSky: 0xf0fbff,
    hemiGround: 0x0ea5e9,
    hemiIntensity: 1.05,
    sunColor: 0xfff7e0,
    sunIntensity: 1.8,
    groundColor: '#0e7fc2',
    studColor: '#2a9fe0',
    roadBg: '#3b4252',
    roadEdge: '#ffffff',
    roadCenter: '#ffd54f',
    curbA: '#ff7043',
    curbB: '#ffffff',
    postA: 0xff7043,
    postB: 0xffffff,
    archPillar: 0x0ea5e9,
    archTop: 0xf97316,
    // 12. 跳島 → 跨海懸索大橋 → 潛進海底玻璃隧道（看鯨魚！）→ 連續跳島衝回終點
    points: [
      [0, 2, 140], [0, 2, 20], [0, 2, -90], [60, 2, -165], [150, 20, -205], [260, 28, -210], [360, 20, -180], [425, 3, -95],
      [405, -8, 0], [340, -20, 60], [260, -20, 75], [190, -7, 50], [135, 3, 5], [95, 2, 90], [62, 2, 175], [40, 2, 232],
      [-12, 2, 238], [-22, 2, 195],
    ],
    gaps: [[0.095, 0.11], [0.8, 0.815], [0.87, 0.885]],
    bridgeRange: [0.235, 0.445],
    bridgeTowers: [0.29, 0.39],
    tunnelRange: [0.47, 0.75],
    underwater: true,
    boostTs: [0.06, 0.31, 0.6, 0.84, 0.95],
    rampTs: [],
    itemRowTs: [0.15, 0.36, 0.66, 0.91],
    obstacleTs: [0.2, 0.93],
  },
};

export class RaceTrack {
  constructor(scene, trackId = 'village', isBattleArena = false) {
    this.scene = scene;
    this.trackId = trackId;
    this.isBattleArena = isBattleArena;
    this.arenaRadius = 78;
    this.config = TRACK_CONFIGS[trackId] || TRACK_CONFIGS.village;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.roadWidth = 22;
    this.curbWidth = 2.2;
    this.wallOffset = this.roadWidth / 2 + this.curbWidth + 1.2;
    this.samples = 460;
    this.boostPads = [];
    this.jumpRamps = [];
    this.shortcuts = [];
    this.obstacles = [];
    this.dinos = [];
    this.trains = [];
    this.boulders = [];
    this.fans = [];
    this.coins = [];
    this.buffOrbs = [];
    this.itemBoxAnchors = [];
    this.spinners = [];
    this.elapsed = 0;

    if (this.isBattleArena) {
      this._buildSkyDome();
      this._buildBattleArena();
      return;
    }

    this._buildCurve();
    this._buildSkyDome();
    this._buildGround();
    this._buildRoadAndCurbs();
    this._buildBridgePillars();
    this._buildStartArch();
    this._buildBoostPads();
    this._buildJumpRamps();
    this._buildSkyShortcut();
    this._buildMovingObstacles();
    this._buildStompingDinos();
    this._buildDynamicHazards();
    this._buildCoins();
    this._buildItemBoxAnchors();
    this._buildRichTrackDetails();
    this._buildScenery();
  }

  dispose() {
    this.scene.remove(this.group);
    this.group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
  }

  update(dt) {
    this.elapsed += dt;
    for (const obs of this.obstacles) {
      const offset = Math.sin(this.elapsed * obs.speed + obs.phase) * obs.range;
      const pos = obs.center.clone().addScaledVector(obs.right, offset);
      obs.pos.copy(pos);
      obs.mesh.position.set(pos.x, pos.y + 1.1, pos.z);
      obs.mesh.rotation.y += dt * 1.8;
    }
    for (const d of this.dinos) {
      // Stomp cycle: lift foot high, pause briefly, SLAM down onto the road!
      const cyc = (this.elapsed * d.speed + d.phase) % 1;
      let footLift = 0;
      if (cyc < 0.42) {
        // Foot slammed flat on asphalt (DANGER!)
        footLift = 0;
      } else if (cyc < 0.72) {
        // Lifting up
        footLift = Math.sin(((cyc - 0.42) / 0.3) * (Math.PI / 2)) * 8.5;
      } else if (cyc < 0.88) {
        // Hovering high ready to crush
        footLift = 8.5;
      } else {
        // Fast slam down!
        const p = (cyc - 0.88) / 0.12;
        footLift = (1 - p * p) * 8.5;
      }
      d.stompLeg.position.y = d.legBaseY + footLift;
      d.stompActive = footLift < 1.35;
      d.justSlammed = !d.wasActive && d.stompActive;
      d.wasActive = d.stompActive;

      // Animate head roar & tail sway
      d.head.rotation.x = d.stompActive ? 0.25 : -0.15 + Math.sin(this.elapsed * 3 + d.phase) * 0.08;
      d.tail.rotation.y = Math.sin(this.elapsed * 2.4 + d.phase) * 0.25;

      // Pulse warning ring on road
      const ringScale = d.stompActive ? 1.15 : 0.85 + Math.sin(this.elapsed * 10) * 0.12;
      d.warningRing.scale.set(ringScale, ringScale, 1);
      d.warningRing.material.color.setHex(d.stompActive ? 0xff1744 : 0xfacc15);
      d.warningRing.material.opacity = d.stompActive ? 0.92 : 0.55;
    }
    for (const tr of this.trains) {
      // Express train zooms across the road every ~7.5s!
      const cyc = (this.elapsed * 0.14 + tr.phase) % 1;
      let offset = 75;
      if (cyc < 0.36) {
        const p = cyc / 0.36;
        offset = -52 + p * 104;
        tr.active = true;
      } else {
        tr.active = false;
      }
      const pos = tr.center.clone().addScaledVector(tr.right, offset);
      tr.pos.copy(pos);
      tr.mesh.visible = tr.active;
      tr.mesh.position.set(pos.x, pos.y + 1.8, pos.z);
    }
    for (const b of this.boulders) {
      const offset = Math.sin(this.elapsed * b.speed + b.phase) * b.range;
      const pos = b.center.clone().addScaledVector(b.right, offset);
      b.pos.copy(pos);
      b.mesh.position.set(pos.x, pos.y + 2.1, pos.z);
      b.mesh.rotation.x += dt * 3.5;
      b.mesh.rotation.z -= Math.cos(this.elapsed * b.speed + b.phase) * dt * 4.5;
    }
    for (const f of this.fans) {
      f.blades.rotation.z += dt * 14;
    }
    if (this.waterMesh) {
      this.waterMesh.material.map.offset.set(this.elapsed * 0.004, this.elapsed * 0.006);
    }
    for (const sp of this.spinners) {
      sp.mesh.rotation[sp.axis] += dt * sp.speed;
      if (sp.bob) sp.mesh.position.y = sp.baseY + Math.sin(this.elapsed * 1.6 + sp.baseY) * sp.bob;
    }
    for (const c of this.coins) {
      if (c.respawn > 0) {
        c.respawn -= dt;
        if (c.respawn <= 0) c.mesh.visible = true;
      } else {
        c.mesh.rotation.y += dt * 3.2;
      }
    }
    for (const b of this.buffOrbs) {
      if (b.respawn > 0) {
        b.respawn -= dt;
        if (b.respawn <= 0) b.mesh.visible = true;
      } else {
        b.mesh.rotation.y += dt * 2.4;
        b.mesh.position.y = b.baseY + Math.sin(this.elapsed * 4 + b.pos.x) * 0.35;
      }
    }
  }

  _buildCurve() {
    const pts = this.config.points.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    this.curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.45);
    this.totalLength = this.curve.getLength();

    this.points = [];
    this.tangents = [];
    this.rights = [];

    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < this.samples; i++) {
      const t = i / this.samples;
      const p = this.curve.getPointAt(t);
      const tan = this.curve.getTangentAt(t).normalize();
      const horizTan = new THREE.Vector3(tan.x, 0, tan.z).normalize();
      const right = new THREE.Vector3().crossVectors(horizTan, up).normalize();
      this.points.push(p);
      this.tangents.push(tan);
      this.rights.push(right);
    }

    this.minX = Infinity;
    this.maxX = -Infinity;
    this.minZ = Infinity;
    this.maxZ = -Infinity;
    for (const p of this.points) {
      if (p.x < this.minX) this.minX = p.x;
      if (p.x > this.maxX) this.maxX = p.x;
      if (p.z < this.minZ) this.minZ = p.z;
      if (p.z > this.maxZ) this.maxZ = p.z;
    }
  }

  _buildSkyDome() {
    const palettes = {
      village: ['#1d78d8', '#6ec6ff', '#d8f3ff'],
      desert: ['#b83b5e', '#f08a5d', '#ffe082'],
      neon: ['#050714', '#131842', '#3a145c'],
      ice: ['#4a90c2', '#a8d8f8', '#eef9ff'],
      beach: ['#0083b0', '#00d2ff', '#d7f9ff'],
      sakura: ['#d16ba5', '#f8bbd0', '#fff0f5'],
      volcano: ['#1c0606', '#5e1410', '#d84315'],
      rainbow: ['#030414', '#160b38', '#3d1566'],
      sky: ['#1e88e5', '#7dd3fc', '#f0f9ff'],
      dino: ['#15803d', '#4ade80', '#fef08a'],
    };
    const [topCol, midCol, botCol] = palettes[this.trackId] || palettes.village;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, topCol);
    grad.addColorStop(0.45, midCol);
    grad.addColorStop(0.62, botCol);
    grad.addColorStop(1.0, botCol);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 256);

    const skyTex = new THREE.CanvasTexture(canvas);
    skyTex.colorSpace = THREE.SRGBColorSpace;
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(620, 20, 14),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false })
    );
    dome.position.set(110, 0, 20);
    this.group.add(dome);

    // Glowing Sun / Moon orb in the sky
    const isNight = this.trackId === 'neon' || this.trackId === 'rainbow';
    const orbColor = this.trackId === 'volcano' ? 0xff5722 : isNight ? 0xe0f2fe : 0xfff59d;
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(28, 16, 12),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(orbColor).multiplyScalar(2.2), fog: false })
    );
    orb.position.set(280, 220, -340);
    this.group.add(orb);
  }

  _buildGround() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = this.config.groundColor;
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = this.config.studColor;
    for (let y = 0; y < 256; y += 32) {
      for (let x = 0; x < 256; x += 32) {
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const groundTex = new THREE.CanvasTexture(canvas);
    groundTex.wrapS = THREE.RepeatWrapping;
    groundTex.wrapT = THREE.RepeatWrapping;
    groundTex.repeat.set(60, 60);
    groundTex.colorSpace = THREE.SRGBColorSpace;

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1500, 1500),
      this.config.water
        ? new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.72, side: THREE.DoubleSide, depthWrite: false })
        : new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.92 })
    );
    if (this.config.water) this.waterMesh = ground;
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(110, -0.15, 20);
    ground.receiveShadow = true;
    this.group.add(ground);
  }

  _createRoadTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    if (this.config.roadBg === '#rainbow') {
      const stripes = ['#ff3b30', '#ff9500', '#ffdd00', '#34c759', '#00c7be', '#007aff', '#af52de'];
      const sw = 512 / stripes.length;
      stripes.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(i * sw, 0, sw + 1, 512);
      });
      ctx.fillStyle = 'rgba(255,255,255,0.16)';
      ctx.fillRect(0, 0, 512, 18);
      ctx.fillRect(0, 256, 512, 18);
    } else {
      ctx.fillStyle = this.config.roadBg;
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 4500; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.045)';
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
      }
    }

    ctx.fillStyle = this.config.roadEdge;
    ctx.fillRect(14, 0, 18, 512);
    ctx.fillRect(480, 0, 18, 512);

    ctx.fillStyle = this.config.roadCenter;
    ctx.fillRect(246, 36, 20, 184);
    ctx.fillRect(246, 292, 20, 184);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }

  _createCurbTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = this.config.curbA;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = this.config.curbB;
    ctx.fillRect(0, 128, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // 跳島缺口：這些路段不鋪路，掉下去就落海
  inGap(idx) {
    const gaps = this.config.gaps;
    if (!gaps) return false;
    const t = idx / this.samples;
    return gaps.some(([a, b]) => t >= a && t < b);
  }

  _buildRibbon(innerOffset, outerOffset, yOffset, uvRepeatY, material) {
    const positions = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= this.samples; i++) {
      const idx = i % this.samples;
      const p = this.points[idx];
      const r = this.rights[idx];

      const pLeft = p.clone().addScaledVector(r, innerOffset);
      const pRight = p.clone().addScaledVector(r, outerOffset);

      positions.push(pLeft.x, p.y + yOffset, pLeft.z);
      positions.push(pRight.x, p.y + yOffset, pRight.z);

      const v = (i / this.samples) * uvRepeatY;
      uvs.push(0, v, 1, v);

      if (i < this.samples && !this.inGap(i)) {
        const a = i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, material);
    mesh.receiveShadow = true;
    this.group.add(mesh);
    return mesh;
  }

  _buildRoadAndCurbs() {
    const halfW = this.roadWidth / 2;
    const roadTex = this._createRoadTexture();
    const isGlowing = this.trackId === 'neon' || this.trackId === 'rainbow';
    const roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      emissive: this.trackId === 'rainbow' ? 0x332244 : this.trackId === 'neon' ? 0x101830 : 0x000000,
      emissiveIntensity: isGlowing ? 0.55 : 0,
      roughness: isGlowing ? 0.38 : 0.78,
      metalness: isGlowing ? 0.2 : 0.05,
      side: THREE.DoubleSide,
    });
    this._buildRibbon(-halfW, halfW, 0.05, 70, roadMat);

    // Underside deck for elevated bridges
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x1e2430, roughness: 0.8, side: THREE.DoubleSide });
    this._buildRibbon(-halfW - this.curbWidth, halfW + this.curbWidth, -0.35, 1, deckMat);

    const curbTex = this._createCurbTexture();
    const curbMat = new THREE.MeshStandardMaterial({
      map: curbTex,
      emissive: isGlowing ? 0x221133 : 0x000000,
      emissiveIntensity: isGlowing ? 0.45 : 0,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    this._buildRibbon(-halfW - this.curbWidth, -halfW, 0.09, 140, curbMat);
    this._buildRibbon(halfW, halfW + this.curbWidth, 0.09, 140, curbMat);

    const postGeo = new THREE.BoxGeometry(0.9, 1.35, 2.4);
    const matA = new THREE.MeshStandardMaterial({
      color: this.config.postA,
      emissive: isGlowing || this.trackId === 'volcano' ? this.config.postA : 0x000000,
      emissiveIntensity: isGlowing || this.trackId === 'volcano' ? 0.45 : 0,
      roughness: 0.3,
    });
    const matB = new THREE.MeshStandardMaterial({
      color: this.config.postB,
      emissive: isGlowing ? this.config.postB : 0x000000,
      emissiveIntensity: isGlowing ? 0.45 : 0,
      roughness: 0.3,
    });

    // Skip barrier posts on openEdge Sky Track so you can visibly see the drop into the clouds!
    if (!this.config.openEdge) {
      for (let i = 0; i < this.samples; i += 6) {
        if (i < 6 || i > this.samples - 6 || this.inGap(i) || this.inGap(i + 2) || this.inGap(i - 2)) continue;
        const p = this.points[i];
        const tan = this.tangents[i];
        const r = this.rights[i];
        const angle = Math.atan2(tan.x, tan.z);
        const mat = (i / 6) % 2 === 0 ? matA : matB;

        for (const side of [-1, 1]) {
          const post = new THREE.Mesh(postGeo, mat);
          const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 1.4));
          post.position.set(pos.x, p.y + 0.68, pos.z);
          post.rotation.y = angle;
          post.castShadow = true;
          this.group.add(post);
        }
      }
    }
  }

  _buildBridgePillars() {
    if (this.config.openEdge) return; // Cloud track floats freely in the sky!
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.65 });
    for (let i = 0; i < this.samples; i += 14) {
      const p = this.points[i];
      if (p.y < 2.2) continue;
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.roadWidth / 2 - 1.5));
        const col = new THREE.Mesh(new THREE.BoxGeometry(2.2, p.y, 2.2), pillarMat);
        col.position.set(pos.x, p.y / 2 - 0.2, pos.z);
        col.castShadow = true;
        this.group.add(col);
      }
    }
  }

  _buildStartArch() {
    const p0 = this.points[0];
    const tan0 = this.tangents[0];
    const angle = Math.atan2(tan0.x, tan0.z);

    const checkerCanvas = document.createElement('canvas');
    checkerCanvas.width = 512;
    checkerCanvas.height = 128;
    const ctx = checkerCanvas.getContext('2d');
    const sq = 32;
    for (let y = 0; y < 128; y += sq) {
      for (let x = 0; x < 512; x += sq) {
        ctx.fillStyle = (x / sq + y / sq) % 2 === 0 ? '#ffffff' : '#111111';
        ctx.fillRect(x, y, sq, sq);
      }
    }
    const checkerTex = new THREE.CanvasTexture(checkerCanvas);
    checkerTex.colorSpace = THREE.SRGBColorSpace;

    const lineMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(this.roadWidth, 4.5),
      new THREE.MeshStandardMaterial({ map: checkerTex, roughness: 0.6 })
    );
    lineMesh.rotation.x = -Math.PI / 2;
    lineMesh.rotation.z = -angle;
    lineMesh.position.set(p0.x, p0.y + 0.14, p0.z);
    this.group.add(lineMesh);

    const archGroup = new THREE.Group();
    archGroup.position.set(p0.x, p0.y, p0.z);
    archGroup.rotation.y = angle;

    const isGlow = this.trackId === 'neon' || this.trackId === 'rainbow' || this.trackId === 'volcano';
    const pillarMat = new THREE.MeshStandardMaterial({
      color: this.config.archPillar,
      emissive: isGlow ? this.config.archPillar : 0x000000,
      emissiveIntensity: isGlow ? 0.45 : 0,
      roughness: 0.25,
    });
    const topMat = new THREE.MeshStandardMaterial({
      color: this.config.archTop,
      emissive: isGlow ? this.config.archTop : 0x000000,
      emissiveIntensity: isGlow ? 0.35 : 0,
      roughness: 0.25,
    });
    const halfSpan = this.roadWidth / 2 + 2.8;

    for (const side of [-1, 1]) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 11, 2.2), pillarMat);
      pillar.position.set(side * halfSpan, 5.5, 0);
      pillar.castShadow = true;
      archGroup.add(pillar);
    }

    const beam = new THREE.Mesh(new THREE.BoxGeometry(halfSpan * 2 + 2.6, 2.6, 2.4), topMat);
    beam.position.set(0, 11.4, 0);
    archGroup.add(beam);

    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 1024;
    bannerCanvas.height = 192;
    const bctx = bannerCanvas.getContext('2d');
    bctx.fillStyle = isGlow ? '#101633' : '#0d47a1';
    bctx.fillRect(0, 0, 1024, 192);
    bctx.fillStyle = isGlow ? '#00f5ff' : '#ffdd00';
    bctx.font = '900 80px sans-serif';
    bctx.textAlign = 'center';
    bctx.textBaseline = 'middle';
    bctx.fillText(`START ★ ${this.config.name}`, 512, 98);
    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    bannerTex.colorSpace = THREE.SRGBColorSpace;

    const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex });
    const bannerFront = new THREE.Mesh(new THREE.PlaneGeometry(halfSpan * 1.8, 2.1), bannerMat);
    bannerFront.position.set(0, 11.4, 1.24);
    const bannerBack = new THREE.Mesh(new THREE.PlaneGeometry(halfSpan * 1.8, 2.1), bannerMat);
    bannerBack.position.set(0, 11.4, -1.24);
    bannerBack.rotation.y = Math.PI;
    archGroup.add(bannerFront, bannerBack);

    this.group.add(archGroup);
  }

  _buildBoostPads() {
    const padCanvas = document.createElement('canvas');
    padCanvas.width = 256;
    padCanvas.height = 512;
    const ctx = padCanvas.getContext('2d');
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 3; i++) {
      const yBase = 80 + i * 150;
      ctx.fillStyle = i % 2 === 0 ? '#00f5ff' : '#ffdd00';
      ctx.beginPath();
      ctx.moveTo(128, yBase);
      ctx.lineTo(230, yBase + 75);
      ctx.lineTo(230, yBase + 125);
      ctx.lineTo(128, yBase + 52);
      ctx.lineTo(26, yBase + 125);
      ctx.lineTo(26, yBase + 75);
      ctx.closePath();
      ctx.fill();
    }
    const padTex = new THREE.CanvasTexture(padCanvas);
    padTex.colorSpace = THREE.SRGBColorSpace;
    const padMat = new THREE.MeshBasicMaterial({ map: padTex, color: new THREE.Color(1.6, 1.6, 1.6) });

    for (const t of this.config.boostTs) {
      const idx = Math.floor(t * this.samples) % this.samples;
      const p = this.points[idx];
      const tan = this.tangents[idx];
      const angle = Math.atan2(tan.x, tan.z);

      const pad = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 11), padMat);
      pad.rotation.order = 'YXZ';
      pad.rotation.y = angle + Math.PI;
      pad.rotation.x = -Math.PI / 2 - Math.asin(THREE.MathUtils.clamp(tan.y, -0.4, 0.4));
      pad.position.set(p.x, p.y + 0.16, p.z);
      this.group.add(pad);

      this.boostPads.push({ position: p.clone(), radius: 6.2 });
    }
  }

  _buildJumpRamps() {
    // Glowing orange/yellow LEGO jump ramps that launch karts into the air!
    const rampCanvas = document.createElement('canvas');
    rampCanvas.width = 256;
    rampCanvas.height = 256;
    const ctx = rampCanvas.getContext('2d');
    ctx.fillStyle = '#ff6f00';
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#ffeb3b';
    for (let y = 30; y < 230; y += 70) {
      ctx.beginPath();
      ctx.moveTo(128, y);
      ctx.lineTo(220, y + 48);
      ctx.lineTo(190, y + 60);
      ctx.lineTo(128, y + 26);
      ctx.lineTo(66, y + 60);
      ctx.lineTo(36, y + 48);
      ctx.closePath();
      ctx.fill();
    }
    const rampTex = new THREE.CanvasTexture(rampCanvas);
    rampTex.colorSpace = THREE.SRGBColorSpace;
    const rampMat = new THREE.MeshBasicMaterial({ map: rampTex });
    const sideMat = new THREE.MeshStandardMaterial({ color: 0xe65100, roughness: 0.4 });

    for (const t of this.config.rampTs || []) {
      const idx = Math.floor(t * this.samples) % this.samples;
      const p = this.points[idx];
      const tan = this.tangents[idx];
      const angle = Math.atan2(-tan.x, -tan.z);

      const ramp = new THREE.Group();
      const slab = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.45, 7.5), [sideMat, sideMat, rampMat, sideMat, sideMat, sideMat]);
      slab.rotation.x = 0.24;
      slab.position.set(0, 0.85, 0);
      ramp.add(slab);

      ramp.position.set(p.x, p.y, p.z);
      ramp.rotation.y = angle;
      this.group.add(ramp);

      this.jumpRamps.push({ position: p.clone(), radius: 5.5 });
    }
  }

  _buildSkyShortcut() {
    if (!this.config.shortcut) return;
    const [entryT, exitT] = this.config.shortcut;
    const entryIdx = Math.floor(entryT * this.samples) % this.samples;
    const exitIdx = Math.floor(exitT * this.samples) % this.samples;
    const pStart = this.points[entryIdx];
    const rStart = this.rights[entryIdx];
    const tanStart = this.tangents[entryIdx];
    const pEnd = this.points[exitIdx];
    const tanEnd = this.tangents[exitIdx];

    // Place glowing Shortcut Launch Pad slightly to the inner side of the track
    const launchPos = pStart.clone().addScaledVector(rStart, 4.6);
    const angle = Math.atan2(-tanStart.x, -tanStart.z);

    // Glowing Magenta/Gold Mega-Jump Pad + Overhead "⚡ 捷徑 SHORTCUT" Sign!
    const padCanvas = document.createElement('canvas');
    padCanvas.width = 256;
    padCanvas.height = 256;
    const ctx = padCanvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#ffdd00');
    grad.addColorStop(0.5, '#ff2a9d');
    grad.addColorStop(1, '#7c3aed');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ 捷徑', 128, 95);
    ctx.fillText('SKY JUMP', 128, 165);
    const padTex = new THREE.CanvasTexture(padCanvas);
    padTex.colorSpace = THREE.SRGBColorSpace;

    const launchGroup = new THREE.Group();
    const rampSlab = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 0.55, 8.2),
      new THREE.MeshBasicMaterial({ map: padTex })
    );
    rampSlab.rotation.x = 0.34;
    rampSlab.position.set(0, 1.35, 0);
    launchGroup.add(rampSlab);

    // Glowing arch sign right above the shortcut pad
    const archMat = new THREE.MeshBasicMaterial({ color: 0xffdd00 });
    const pL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 6.2, 0.45), archMat);
    pL.position.set(-3.8, 3.1, 0);
    const pR = pL.clone();
    pR.position.x = 3.8;
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(8.1, 0.5, 0.5), archMat);
    topBar.position.set(0, 6.2, 0);
    launchGroup.add(pL, pR, topBar);

    launchGroup.position.set(launchPos.x, pStart.y, launchPos.z);
    launchGroup.rotation.y = angle;
    this.group.add(launchGroup);

    // Floating Golden Sky Rings tracing the high-altitude parabolic shortcut arc!
    const peakY = Math.max(pStart.y, pEnd.y) + 24;
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 0.85 });
    const ringGeo = new THREE.TorusGeometry(4.2, 0.32, 8, 20);
    const arcDir = new THREE.Vector3().subVectors(pEnd, launchPos).normalize();
    const arcYaw = Math.atan2(arcDir.x, arcDir.z);

    for (const frac of [0.22, 0.5, 0.78]) {
      const rx = THREE.MathUtils.lerp(launchPos.x, pEnd.x, frac);
      const rz = THREE.MathUtils.lerp(launchPos.z, pEnd.z, frac);
      const baseY = THREE.MathUtils.lerp(pStart.y, pEnd.y, frac);
      const ry = baseY + Math.sin(frac * Math.PI) * (peakY - baseY);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(rx, ry + 1.5, rz);
      ring.rotation.y = arcYaw;
      this.group.add(ring);
    }

    this.shortcuts.push({
      entryPos: launchPos,
      exitPos: pEnd.clone(),
      exitIdx,
      exitYaw: Math.atan2(-tanEnd.x, -tanEnd.z),
      peakY,
      radius: 5.6,
    });
  }

  _buildMovingObstacles() {
    // Glowing LEGO spinning/sliding barrier blocks on track!
    const obsMat = new THREE.MeshStandardMaterial({
      color: 0xff1744,
      emissive: 0xaa0022,
      emissiveIntensity: 0.55,
      roughness: 0.25,
    });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });

    (this.config.obstacleTs || []).forEach((t, i) => {
      const idx = Math.floor(t * this.samples) % this.samples;
      const p = this.points[idx];
      const r = this.rights[idx];

      const g = new THREE.Group();
      const core = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 2.8), obsMat);
      const band = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.45, 3.0), stripeMat);
      g.add(core, band);
      g.position.set(p.x, p.y + 1.1, p.z);
      this.group.add(g);

      this.obstacles.push({
        mesh: g,
        center: p.clone(),
        right: r.clone(),
        pos: p.clone(),
        range: this.roadWidth * 0.34,
        speed: 1.65 + (i % 2) * 0.55,
        phase: i * 1.9,
      });
    });
  }

  _buildCoins() {
    const coinGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.22, 12);
    coinGeo.rotateX(Math.PI / 2);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xaa6600,
      emissiveIntensity: 0.45,
      metalness: 0.65,
      roughness: 0.2,
    });

    // Place 6 clusters of 4 coins along optimal racing curves!
    const clusterTs = [0.06, 0.2, 0.36, 0.53, 0.71, 0.87];
    clusterTs.forEach((baseT, cIdx) => {
      const lane = (cIdx % 3 - 1) * 4.2;
      for (let k = 0; k < 4; k++) {
        const idx = Math.floor(((baseT + k * 0.012) % 1) * this.samples);
        const p = this.points[idx];
        const r = this.rights[idx];
        const pos = p.clone().addScaledVector(r, lane);
        const mesh = new THREE.Mesh(coinGeo, coinMat);
        mesh.position.set(pos.x, p.y + 1.15, pos.z);
        this.group.add(mesh);
        this.coins.push({ mesh, pos: new THREE.Vector3(pos.x, p.y + 1.15, pos.z), respawn: 0 });
      }
    });

    // Place 4 Glowing Track Buff Orbs (🛞 Turbo Tires / 🔥 Super Engine / ❄️ Time Freeze) on every track!
    const orbSpecs = [
      { t: 0.27, kind: 'turbo_tire', col: 0xfbbf24 },
      { t: 0.51, kind: 'super_engine', col: 0xfb7185 },
      { t: 0.74, kind: 'turbo_tire', col: 0xfbbf24 },
      { t: 0.93, kind: 'super_engine', col: 0xfb7185 },
    ];
    const orbGeo = new THREE.OctahedronGeometry(1.05, 0);
    orbSpecs.forEach((spec, i) => {
      const idx = Math.floor(spec.t * this.samples) % this.samples;
      const p = this.points[idx];
      const r = this.rights[idx];
      const pos = p.clone().addScaledVector(r, i % 2 === 0 ? -4.5 : 4.5);
      const mesh = new THREE.Mesh(
        orbGeo,
        new THREE.MeshStandardMaterial({ color: spec.col, emissive: spec.col, emissiveIntensity: 0.65, roughness: 0.15 })
      );
      mesh.position.set(pos.x, p.y + 1.85, pos.z);
      this.group.add(mesh);
      this.buffOrbs.push({ mesh, kind: spec.kind, baseY: p.y + 1.85, pos: new THREE.Vector3(pos.x, p.y + 1.85, pos.z), respawn: 0 });
    });
  }

  _buildItemBoxAnchors() {
    for (const t of this.config.itemRowTs) {
      const idx = Math.floor(t * this.samples) % this.samples;
      const p = this.points[idx];
      const r = this.rights[idx];
      for (const lane of [-5.2, 0, 5.2]) {
        const pos = p.clone().addScaledVector(r, lane);
        pos.y = p.y + 1.65;
        this.itemBoxAnchors.push(pos);
      }
    }
  }

  _buildRichTrackDetails() {
    // 1. Glowing Corner Chevron Signs
    const chevCanvas = document.createElement('canvas');
    chevCanvas.width = 256;
    chevCanvas.height = 128;
    const cctx = chevCanvas.getContext('2d');
    cctx.fillStyle = '#111827';
    cctx.fillRect(0, 0, 256, 128);
    cctx.strokeStyle = '#ffdd00';
    cctx.lineWidth = 8;
    cctx.strokeRect(4, 4, 248, 120);
    cctx.fillStyle = '#ffdd00';
    for (let k = 0; k < 3; k++) {
      const ox = 28 + k * 72;
      cctx.beginPath();
      cctx.moveTo(ox, 22);
      cctx.lineTo(ox + 34, 22);
      cctx.lineTo(ox + 64, 64);
      cctx.lineTo(ox + 34, 106);
      cctx.lineTo(ox, 106);
      cctx.lineTo(ox + 30, 64);
      cctx.closePath();
      cctx.fill();
    }
    const chevTex = new THREE.CanvasTexture(chevCanvas);
    chevTex.colorSpace = THREE.SRGBColorSpace;
    const chevMat = new THREE.MeshBasicMaterial({ map: chevTex, side: THREE.DoubleSide });
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });

    for (let i = 10; i < this.samples - 10; i += 8) {
      const prevT = this.tangents[(i - 5 + this.samples) % this.samples];
      const nextT = this.tangents[(i + 5) % this.samples];
      const crossY = prevT.z * nextT.x - prevT.x * nextT.z;
      if (Math.abs(crossY) > 0.14) {
        const outerSide = crossY > 0 ? -1 : 1;
        const p = this.points[i];
        const r = this.rights[i];
        const tan = this.tangents[i];
        const pos = p.clone().addScaledVector(r, outerSide * (this.wallOffset + 1.8));

        const signGroup = new THREE.Group();
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.6, 8), poleMat);
        pole.position.y = 1.8;
        const board = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.0), chevMat);
        board.position.y = 3.2;
        if (crossY < 0) board.scale.x = -1;
        signGroup.add(pole, board);
        signGroup.position.set(pos.x, p.y, pos.z);
        signGroup.rotation.y = Math.atan2(-tan.x, -tan.z);
        this.group.add(signGroup);
      }
    }

    // 2. Real 3D Enclosed Mountain Cave Tunnel (vaulted walls + rocky mountain shell + interior lights!)
    if (this.config.tunnelRange) {
      const [tStart, tEnd] = this.config.tunnelRange;
      const iStart = Math.floor(tStart * this.samples);
      const iEnd = Math.floor(tEnd * this.samples);
      const radius = this.roadWidth / 2 + 2.6;

      // Build continuous semi-cylindrical vaulted cave shell!
      const ringSegs = 10;
      const tPos = [];
      const tIdx = [];
      const steps = iEnd - iStart;
      for (let s = 0; s <= steps; s++) {
        const idx = (iStart + s) % this.samples;
        const p = this.points[idx];
        const r = this.rights[idx];
        for (let k = 0; k <= ringSegs; k++) {
          const theta = (k / ringSegs) * Math.PI; // 0 (right) -> PI (left) over the top
          const lat = Math.cos(theta) * radius;
          const elev = Math.sin(theta) * (radius * 0.88);
          const vx = p.x + r.x * lat;
          const vy = p.y + elev;
          const vz = p.z + r.z * lat;
          tPos.push(vx, vy, vz);
        }
        if (s < steps) {
          const rowA = s * (ringSegs + 1);
          const rowB = (s + 1) * (ringSegs + 1);
          for (let k = 0; k < ringSegs; k++) {
            tIdx.push(rowA + k, rowB + k, rowA + k + 1);
            tIdx.push(rowA + k + 1, rowB + k, rowB + k + 1);
          }
        }
      }
      const caveGeo = new THREE.BufferGeometry();
      caveGeo.setAttribute('position', new THREE.Float32BufferAttribute(tPos, 3));
      caveGeo.setIndex(tIdx);
      caveGeo.computeVertexNormals();

      const caveColors = {
        village: 0x475569, desert: 0x8d5524, neon: 0x1e1b4b, ice: 0x38bdf8,
        beach: 0x64748b, sakura: 0x4b5563, volcano: 0x2b1515, rainbow: 0x2e1065,
      };
      const caveMat = this.config.underwater
        ? new THREE.MeshStandardMaterial({ color: 0x9be7ff, transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.3, side: THREE.DoubleSide, depthWrite: false })
        : new THREE.MeshStandardMaterial({
          color: caveColors[this.trackId] || 0x475569,
          roughness: 0.75,
          side: THREE.DoubleSide,
        });
      const caveMesh = new THREE.Mesh(caveGeo, caveMat);
      this.group.add(caveMesh);

      // Rocky LEGO mountain blocks piled outside the cave + glowing interior ceiling lights!
      const mountMat = new THREE.MeshStandardMaterial({ color: caveColors[this.trackId] || 0x334155, roughness: 0.85 });
      const lightStripMat = new THREE.MeshBasicMaterial({ color: this.trackId === 'volcano' ? 0xff7043 : 0x00f5ff });
      for (let s = 0; s <= steps; s += 4) {
        const idx = (iStart + s) % this.samples;
        const p = this.points[idx];
        const tan = this.tangents[idx];
        const r = this.rights[idx];
        const yaw = Math.atan2(tan.x, tan.z);

        // Glowing rib light inside the cave ceiling
        const lightRib = new THREE.Mesh(new THREE.TorusGeometry(radius - 0.35, 0.22, 6, 16, Math.PI), lightStripMat);
        lightRib.position.set(p.x, p.y, p.z);
        lightRib.rotation.y = yaw;
        this.group.add(lightRib);

        // Mountain peak blocks over the cave exterior
        if (!this.config.underwater && s > 1 && s < steps - 1 && s % 8 === 0) {
          const cap = new THREE.Mesh(new THREE.BoxGeometry(radius * 2.2, 9 + (s % 3) * 4, 14), mountMat);
          cap.position.set(p.x, p.y + radius * 0.95 + 2.5, p.z);
          cap.rotation.y = yaw;
          this.group.add(cap);
        }
      }
    }

    // 3. LEGO Grandstand near Start/Finish
    const sp = this.points[6];
    const sr = this.rights[6];
    const stan = this.tangents[6];
    const standPos = sp.clone().addScaledVector(sr, -(this.wallOffset + 9.5));
    const stand = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const roofMat = new THREE.MeshStandardMaterial({ color: this.config.archPillar, roughness: 0.3 });
    const specColors = [0xff3b30, 0xffdd00, 0x00e5ff, 0x38ef7d, 0xe91e8c, 0xffffff];

    for (let tier = 0; tier < 3; tier++) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.5, 24), baseMat);
      bench.position.set(-tier * 2.4, 0.75 + tier * 1.5, 0);
      stand.add(bench);
      for (let z = -10; z <= 10; z += 2.6) {
        const sMat = new THREE.MeshStandardMaterial({ color: specColors[Math.abs(Math.round(z) + tier) % specColors.length] });
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.9), sMat);
        body.position.set(-tier * 2.4 + 0.3, 2.0 + tier * 1.5, z);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffd500 }));
        head.position.set(-tier * 2.4 + 0.3, 2.9 + tier * 1.5, z);
        stand.add(body, head);
      }
    }
    const roof = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.7, 25), roofMat);
    roof.position.set(-2.5, 9.2, 0);
    stand.add(roof);
    stand.position.set(standPos.x, sp.y, standPos.z);
    stand.rotation.y = Math.atan2(stan.x, stan.z);
    this.group.add(stand);

    // 4. Trackside Lamp Posts & Vibrant Racing Flags for high-speed parallax!
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff3b0 });
    const flagColors = [0xff3b30, 0xffdd00, 0x00e5ff, 0x38ef7d, 0xe91e8c];
    for (let i = 16; i < this.samples - 12; i += 18) {
      const p = this.points[i];
      const r = this.rights[i];
      const tan = this.tangents[i];
      const side = (i / 18) % 2 === 0 ? 1 : -1;
      const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 2.2));
      const group = new THREE.Group();
      if (i % 36 === 0) {
        const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 8.5, 8), poleMat);
        mast.position.y = 4.25;
        const arm = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.25, 0.25), poleMat);
        arm.position.set(-side * 1.2, 8.4, 0);
        const bulb = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.35, 0.6), lampMat);
        bulb.position.set(-side * 2.1, 8.15, 0);
        group.add(mast, arm, bulb);
      } else {
        // Tall colorful racing banner flag
        const fPole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 6.2, 6), poleMat);
        fPole.position.y = 3.1;
        const fCloth = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 2.2, 1.5),
          new THREE.MeshStandardMaterial({ color: flagColors[(i / 18) % flagColors.length | 0], roughness: 0.4 })
        );
        fCloth.position.set(-side * 0.2, 4.9, 0.75);
        group.add(fPole, fCloth);
      }
      group.position.set(pos.x, p.y, pos.z);
      group.rotation.y = Math.atan2(tan.x, tan.z);
      this.group.add(group);
    }
  }

  _buildScenery() {
    if (this.trackId === 'village') this._buildVillageScenery();
    else if (this.trackId === 'desert') this._buildDesertScenery();
    else if (this.trackId === 'ice') this._buildIceScenery();
    else if (this.trackId === 'beach') this._buildBeachScenery();
    else if (this.trackId === 'sakura') this._buildSakuraScenery();
    else if (this.trackId === 'volcano') this._buildVolcanoScenery();
    else if (this.trackId === 'rainbow') this._buildRainbowScenery();
    else if (this.trackId === 'sky') this._buildSkyScenery();
    else if (this.trackId === 'dino') this._buildDinoScenery();
    else if (this.trackId === 'candy') this._buildCandyScenery();
    else if (this.trackId === 'island') this._buildIslandScenery();
    else this._buildNeonScenery();
  }

  _buildDynamicHazards() {
    // 1. 🚂 Express Train Crossing (default on village/neon/sakura if configured)
    const trainTs = this.config.trainTs || (this.trackId === 'neon' || this.trackId === 'sakura' ? [0.58] : []);
    trainTs.forEach((t, idx) => {
      const i = Math.floor(t * this.samples) % this.samples;
      const p = this.points[i];
      const r = this.rights[i];
      const trainGroup = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
      const winMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd });
      const headMat = new THREE.MeshBasicMaterial({ color: 0xfff8b0 });

      for (let c = -1; c <= 1; c++) {
        const car = new THREE.Mesh(new THREE.BoxGeometry(7.6, 3.4, 3.6), c === 1 ? bodyMat : new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35 }));
        car.position.set(c * 8.4, 0.2, 0);
        car.castShadow = true;
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(7.7, 0.45, 3.68), stripeMat);
        stripe.position.set(c * 8.4, -0.3, 0);
        const win = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.0, 3.72), winMat);
        win.position.set(c * 8.4, 0.8, 0);
        trainGroup.add(car, stripe, win);
      }
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), headMat);
      lamp.position.set(12.4, 0.4, 0);
      trainGroup.add(lamp);

      trainGroup.rotation.y = Math.atan2(-r.z, r.x);
      this.group.add(trainGroup);

      // Red/white railroad crossing posts on both sides of the track
      const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const redMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
      for (const side of [-1, 1]) {
        const postPos = p.clone().addScaledVector(r, side * (this.roadWidth / 2 + 2.5));
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 6.2, 8), postMat);
        pole.position.set(postPos.x, p.y + 3.1, postPos.z);
        const warn = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), redMat);
        warn.position.set(postPos.x, p.y + 6.3, postPos.z);
        this.group.add(pole, warn);
      }

      this.trains.push({
        mesh: trainGroup,
        center: p.clone(),
        right: r.clone(),
        pos: p.clone(),
        phase: idx * 0.45,
        active: false,
      });
    });

    // 2. 🪨 Giant Rolling Boulders (desert / volcano / dino)
    const boulderTs = this.config.boulderTs || (this.trackId === 'volcano' ? [0.34, 0.72] : []);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.92 });
    boulderTs.forEach((t, idx) => {
      const i = Math.floor(t * this.samples) % this.samples;
      const p = this.points[i];
      const r = this.rights[i];
      const mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(2.35, 0), rockMat);
      mesh.castShadow = true;
      mesh.position.set(p.x, p.y + 2.1, p.z);
      this.group.add(mesh);
      this.boulders.push({
        mesh,
        center: p.clone(),
        right: r.clone(),
        pos: p.clone(),
        range: this.roadWidth / 2 - 2.2,
        speed: 1.55 + idx * 0.25,
        phase: idx * 2.1,
      });
    });

    // 3. 🌀 Giant Crosswind Turbo Fans (sky / ice / beach / rainbow)
    const fanTs = this.config.fanTs || ((this.trackId === 'ice' || this.trackId === 'beach' || this.trackId === 'rainbow') ? [0.44] : []);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.4 });
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 });
    fanTs.forEach((t, idx) => {
      const i = Math.floor(t * this.samples) % this.samples;
      const p = this.points[i];
      const r = this.rights[i];
      const side = idx % 2 === 0 ? -1 : 1;
      const fanPos = p.clone().addScaledVector(r, side * (this.roadWidth / 2 + 4.2));
      const fanGroup = new THREE.Group();
      const ring = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.55, 8, 22), frameMat);
      ring.position.y = 4.6;
      const blades = new THREE.Group();
      blades.position.y = 4.6;
      for (let b = 0; b < 4; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.9, 3.6, 0.22), bladeMat);
        blade.rotation.z = (b * Math.PI) / 2;
        blades.add(blade);
      }
      fanGroup.add(ring, blades);
      fanGroup.position.set(fanPos.x, p.y, fanPos.z);
      // Face across the road!
      const blowDir = r.clone().multiplyScalar(-side);
      fanGroup.rotation.y = Math.atan2(blowDir.x, blowDir.z);
      this.group.add(fanGroup);

      this.fans.push({
        center: p.clone(),
        blowDir,
        blades,
        radius: 17,
        force: 22,
      });
    });
  }

  _buildBattleArena() {
    // 🎈 3D Circular LEGO Battle Arena Stadium!
    this.points = [new THREE.Vector3(0, 0, 0)];
    this.tangents = [new THREE.Vector3(0, 0, -1)];
    this.rights = [new THREE.Vector3(1, 0, 0)];
    this.minX = -this.arenaRadius;
    this.maxX = this.arenaRadius;
    this.minZ = -this.arenaRadius;
    this.maxZ = this.arenaRadius;

    // Checkered colorful Battle Arena Floor
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = '#283548';
          ctx.fillRect(x * 64, y * 64, 64, 64);
        }
      }
    }
    ctx.strokeStyle = '#ffdd00';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(256, 256, 120, 0, Math.PI * 2);
    ctx.stroke();

    const floorTex = new THREE.CanvasTexture(canvas);
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(6, 6);
    floorTex.colorSpace = THREE.SRGBColorSpace;

    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(this.arenaRadius + 1, this.arenaRadius + 1, 1.0, 48),
      new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.75 })
    );
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Colorful LEGO Circular Stadium Wall
    const wallColors = [0xff3b30, 0xffdd00, 0x00e5ff, 0x38ef7d];
    const segs = 32;
    for (let i = 0; i < segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(16, 4.5, 2.2),
        new THREE.MeshStandardMaterial({ color: wallColors[i % wallColors.length], roughness: 0.35 })
      );
      wall.position.set(Math.cos(a) * (this.arenaRadius + 1.1), 2.25, Math.sin(a) * (this.arenaRadius + 1.1));
      wall.rotation.y = -a + Math.PI / 2;
      this.group.add(wall);
    }

    // 4 Boost Pads + 4 Jump Ramps + 12 Item Box Anchors around the arena!
    const padMat = new THREE.MeshBasicMaterial({ color: 0xffdd00, side: THREE.DoubleSide });
    const rampMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35 });
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const px = Math.cos(a) * 32;
      const pz = Math.sin(a) * 32;
      const pad = new THREE.Mesh(new THREE.CircleGeometry(4.2, 16), padMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(px, 0.08, pz);
      this.group.add(pad);
      this.boostPads.push({ position: new THREE.Vector3(px, 0, pz), radius: 4.5 });

      const ra = a + Math.PI / 4;
      const rx = Math.cos(ra) * 44;
      const rz = Math.sin(ra) * 44;
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.8, 7.5), rampMat);
      ramp.position.set(rx, 0.7, rz);
      ramp.rotation.y = -ra;
      this.group.add(ramp);
      this.jumpRamps.push({ position: new THREE.Vector3(rx, 0, rz), radius: 5.0 });
    }

    // 12 Regenerating Item Boxes (4 inner ring + 8 outer ring)
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      this.itemBoxAnchors.push(new THREE.Vector3(Math.cos(a) * 18, 1.4, Math.sin(a) * 18));
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      this.itemBoxAnchors.push(new THREE.Vector3(Math.cos(a) * 54, 1.4, Math.sin(a) * 54));
    }
  }

  _buildStompingDinos() {
    const dinoTs = this.config.dinoTs || [];
    if (!dinoTs.length) return;

    const skinColors = [0x22c55e, 0xea580c, 0x16a34a];
    const bellyMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.45 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const clawMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.35 });

    dinoTs.forEach((t, idx) => {
      const sampleIdx = Math.floor(t * this.samples) % this.samples;
      const p = this.points[sampleIdx];
      const tan = this.tangents[sampleIdx];
      const r = this.rights[sampleIdx];
      const side = idx % 2 === 0 ? 1 : -1;

      // Giant LEGO T-Rex stands right next to the road, stomping its huge foot onto the lane!
      const dinoPos = p.clone().addScaledVector(r, side * (this.roadWidth / 2 + 5.2));
      const stompLane = side * 3.8; // stomps onto the half of the road on its side!
      const stompWorldPos = p.clone().addScaledVector(r, stompLane);

      const skinMat = new THREE.MeshStandardMaterial({
        color: skinColors[idx % skinColors.length],
        roughness: 0.35,
        metalness: 0.05,
      });

      const dino = new THREE.Group();
      dino.position.set(dinoPos.x, p.y, dinoPos.z);
      // Face across the track toward the stomp zone!
      const faceDir = stompWorldPos.clone().sub(dinoPos);
      dino.rotation.y = Math.atan2(faceDir.x, faceDir.z);

      // Standing rear leg
      const standLeg = new THREE.Mesh(new THREE.BoxGeometry(3.8, 9.5, 4.2), skinMat);
      standLeg.position.set(-2.6, 4.75, -1.2);
      standLeg.castShadow = true;
      dino.add(standLeg);

      // Chunky LEGO torso
      const body = new THREE.Mesh(new THREE.BoxGeometry(8.5, 8.8, 12.5), skinMat);
      body.position.set(0, 12.2, 0.5);
      body.rotation.x = 0.18;
      body.castShadow = true;
      dino.add(body);

      const belly = new THREE.Mesh(new THREE.BoxGeometry(6.6, 7.2, 2.2), bellyMat);
      belly.position.set(0, 11.4, 6.2);
      dino.add(belly);

      // Tiny T-Rex arms
      for (const ax of [-4.4, 4.4]) {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 3.2), skinMat);
        arm.position.set(ax, 12.0, 5.8);
        dino.add(arm);
      }

      // Giant LEGO Head + Jaws + Teeth + Glowing Eyes
      const head = new THREE.Group();
      head.position.set(0, 17.5, 6.2);
      const skull = new THREE.Mesh(new THREE.BoxGeometry(6.8, 5.4, 8.6), skinMat);
      skull.position.set(0, 1.2, 2.6);
      skull.castShadow = true;
      head.add(skull);

      const jaw = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2.0, 7.2), skinMat);
      jaw.position.set(0, -1.8, 2.4);
      head.add(jaw);

      // Row of white LEGO teeth
      for (let tx = -2.2; tx <= 2.2; tx += 1.1) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.1, 0.65), whiteMat);
        tooth.position.set(tx, -0.7, 6.4);
        head.add(tooth);
      }
      // Glowing yellow eyes
      for (const ex of [-3.5, 3.5]) {
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 1.4), eyeMat);
        eye.position.set(ex, 2.4, 4.2);
        const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.7, 0.6), pupilMat);
        pupil.position.set(ex, 2.4, 4.5);
        head.add(eye, pupil);
      }
      dino.add(head);

      // Giant swaying LEGO tail
      const tail = new THREE.Group();
      tail.position.set(0, 11.2, -5.8);
      const t1 = new THREE.Mesh(new THREE.BoxGeometry(5.6, 5.2, 7.5), skinMat);
      t1.position.set(0, -0.5, -3.5);
      const t2 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3.2, 6.8), skinMat);
      t2.position.set(0, -1.2, -9.8);
      tail.add(t1, t2);
      dino.add(tail);

      // GIANT STOMPING LEG & FOOT reaching right onto the asphalt!
      const stompLeg = new THREE.Group();
      const legDist = dinoPos.distanceTo(stompWorldPos);
      stompLeg.position.set(0, 0, legDist);

      const shin = new THREE.Mesh(new THREE.BoxGeometry(4.4, 11.5, 4.6), skinMat);
      shin.position.set(0, 6.8, -0.4);
      shin.castShadow = true;
      stompLeg.add(shin);

      const foot = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.2, 7.6), skinMat);
      foot.position.set(0, 1.1, 0.6);
      foot.castShadow = true;
      stompLeg.add(foot);

      // 3 giant white claws on the stomping foot!
      for (const cx of [-2.2, 0, 2.2]) {
        const claw = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 2.1), clawMat);
        claw.position.set(cx, 0.8, 4.8);
        stompLeg.add(claw);
      }
      dino.add(stompLeg);
      this.group.add(dino);

      // Glowing danger target ring on the asphalt right under the stomping foot!
      const warningRing = new THREE.Mesh(
        new THREE.RingGeometry(3.2, 4.9, 24),
        new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
      );
      warningRing.rotation.x = -Math.PI / 2;
      warningRing.position.set(stompWorldPos.x, p.y + 0.12, stompWorldPos.z);
      this.group.add(warningRing);

      this.dinos.push({
        stompPos: stompWorldPos,
        radius: 4.9,
        stompLeg,
        legBaseY: 0,
        head,
        tail,
        warningRing,
        speed: 0.24 + (idx % 2) * 0.05,
        phase: idx * 0.37,
        stompActive: false,
        wasActive: false,
        justSlammed: false,
      });
    });
  }

  _buildDinoScenery() {
    // Prehistoric Jurassic palm/fern trees, giant amber crystals, and mossy boulders!
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.8 });
    const fernMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.45 });
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.9 });
    const amberMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.45, roughness: 0.2 });

    for (let i = 0; i < this.samples; i += 14) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 15 + (i % 4) * 4.5));
        if (this._isClearOfTrack(pos, this.wallOffset + 9)) {
          const g = new THREE.Group();
          if (i % 28 === 0) {
            // Giant LEGO prehistoric fern tree
            const trunk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 13, 2.2), trunkMat);
            trunk.position.y = 6.5;
            const c1 = new THREE.Mesh(new THREE.BoxGeometry(10, 2.2, 3.2), fernMat);
            c1.position.y = 13.5;
            const c2 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 10), fernMat);
            c2.position.y = 13.8;
            const c3 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.5, 6.5), fernMat);
            c3.position.y = 15.2;
            g.add(trunk, c1, c2, c3);
          } else {
            // Mossy prehistoric rock + glowing amber crystal
            const rock = new THREE.Mesh(new THREE.BoxGeometry(6.5, 4.5, 5.5), rockMat);
            rock.position.y = 2.25;
            const amber = new THREE.Mesh(new THREE.OctahedronGeometry(2.2, 0), amberMat);
            amber.position.set(1.2, 5.8, 0);
            g.add(rock, amber);
          }
          g.position.set(pos.x, 0, pos.z);
          this.group.add(g);
        }
      }
    }
    this._buildClouds(0xdcfce7, 0x86efac);
  }

  _buildSkyScenery() {
    // Sea of giant fluffy LEGO clouds below & beside the floating Sky Track + golden sky halos!
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xe0f2fe, emissiveIntensity: 0.5, roughness: 0.85 });
    for (let i = 0; i < 42; i++) {
      const c = new THREE.Group();
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(28 + (i % 4) * 8, 9, 18 + (i % 3) * 6), cloudMat);
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(18, 7, 14), cloudMat);
      b2.position.set(4, 6, 0);
      c.add(b1, b2);
      c.position.set(
        -160 + ((i * 83) % 580),
        4 + ((i * 7) % 14),
        -260 + ((i * 113) % 620)
      );
      this.group.add(c);
    }
    // Floating golden sky rings framing the sky highway
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    for (let i = 40; i < this.samples; i += 75) {
      const p = this.points[i];
      const tan = this.tangents[i];
      const halo = new THREE.Mesh(new THREE.TorusGeometry(this.roadWidth / 2 + 4.5, 0.55, 8, 28), haloMat);
      halo.position.set(p.x, p.y + 4, p.z);
      halo.rotation.y = Math.atan2(tan.x, tan.z);
      this.group.add(halo);
    }
  }

  _isClearOfTrack(pos, minClearance) {
    const minSq = minClearance * minClearance;
    for (let i = 0; i < this.samples; i += 3) {
      const p = this.points[i];
      const dx = pos.x - p.x;
      const dz = pos.z - p.z;
      if (dx * dx + dz * dz < minSq) return false;
    }
    return true;
  }

  _buildVillageScenery() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.7 });
    const leafMats = [
      new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.4 }),
      new THREE.MeshStandardMaterial({ color: 0x43a047, roughness: 0.4 }),
    ];
    for (let i = 0; i < this.samples; i += 13) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 13 + (i % 5) * 3.5));
        if (this._isClearOfTrack(pos, this.wallOffset + 8)) {
          const g = new THREE.Group();
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 3.2, 8), trunkMat);
          trunk.position.y = 1.6;
          const lMat = leafMats[i % leafMats.length];
          const t1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 4.2), lMat);
          t1.position.y = 4.0;
          const t2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.0, 3.0), lMat);
          t2.position.y = 6.0;
          const t3 = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.6, 1.7), lMat);
          t3.position.y = 7.7;
          g.add(trunk, t1, t2, t3);
          g.position.set(pos.x, 0, pos.z);
          this.group.add(g);
        }
      }
    }
    const brickColors = [0xffb300, 0xe53935, 0x1e88e5, 0x00bfa5, 0xe91e8c];
    [[80, -85], [110, 95], [-60, -20], [275, 25], [115, 285]].forEach(([tx, tz], idx) => {
      const tower = new THREE.Group();
      for (let h = 0; h < 4; h++) {
        const block = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 6), new THREE.MeshStandardMaterial({ color: brickColors[(idx + h) % brickColors.length], roughness: 0.25 }));
        block.position.y = 2.5 + h * 5;
        tower.add(block);
      }
      tower.position.set(tx, 0, tz);
      this.group.add(tower);
    });
    this._buildClouds(0xffffff, 0xdceeff);
  }

  _buildDesertScenery() {
    const cactusMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.45 });
    for (let i = 0; i < this.samples; i += 14) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 14 + (i % 4) * 4));
        if (this._isClearOfTrack(pos, this.wallOffset + 8)) {
          const g = new THREE.Group();
          const stem = new THREE.Mesh(new THREE.BoxGeometry(1.4, 6.2, 1.4), cactusMat);
          stem.position.y = 3.1;
          const armL = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 1.1), cactusMat);
          armL.position.set(-1.3, 3.6, 0);
          const armLUp = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.4, 1.1), cactusMat);
          armLUp.position.set(-1.9, 4.7, 0);
          g.add(stem, armL, armLUp);
          g.position.set(pos.x, 0, pos.z);
          this.group.add(g);
        }
      }
    }
    const pyrMat = new THREE.MeshStandardMaterial({ color: 0xd99b38, roughness: 0.55 });
    for (const [px, pz, sc] of [[85, -110, 1.2], [95, 120, 1.0], [-75, 25, 1.35], [325, 10, 1.4]]) {
      const pyr = new THREE.Group();
      for (let tier = 0; tier < 6; tier++) {
        const size = (28 - tier * 4.2) * sc;
        const step = new THREE.Mesh(new THREE.BoxGeometry(size, 4.2 * sc, size), pyrMat);
        step.position.y = (tier * 4.2 + 2.1) * sc;
        pyr.add(step);
      }
      pyr.position.set(px, 0, pz);
      this.group.add(pyr);
    }
    this._buildClouds(0xffe9cc, 0xffd2a6);
  }

  _buildIceScenery() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
    const snowLeafMat = new THREE.MeshStandardMaterial({ color: 0x2a6f7f, roughness: 0.4 });
    const snowCapMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    for (let i = 0; i < this.samples; i += 14) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 13 + (i % 4) * 4));
        if (this._isClearOfTrack(pos, this.wallOffset + 8)) {
          const g = new THREE.Group();
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 3, 8), trunkMat);
          trunk.position.y = 1.5;
          const t1 = new THREE.Mesh(new THREE.BoxGeometry(4.0, 2.2, 4.0), snowLeafMat);
          t1.position.y = 3.9;
          const t2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 2.8), snowCapMat);
          t2.position.y = 5.9;
          g.add(trunk, t1, t2);
          g.position.set(pos.x, 0, pos.z);
          this.group.add(g);
        }
      }
    }
    const iceMat = new THREE.MeshStandardMaterial({ color: 0x80d8ff, emissive: 0x29b6f6, emissiveIntensity: 0.22, roughness: 0.15 });
    for (const [bx, bz, sc] of [[95, -90, 1.2], [105, 115, 1.0], [-95, 10, 1.3], [295, 15, 1.35]]) {
      const berg = new THREE.Group();
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(14 * sc, 20 * sc, 12 * sc), iceMat);
      b1.position.y = 10 * sc;
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(9 * sc, 28 * sc, 8 * sc), iceMat);
      b2.position.set(4 * sc, 14 * sc, -2 * sc);
      berg.add(b1, b2);
      berg.position.set(bx, 0, bz);
      this.group.add(berg);
    }
    this._buildClouds(0xffffff, 0xdcf4ff);
  }

  _buildBeachScenery() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.7 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.4 });
    const umbColors = [0xff5252, 0xffd740, 0x40c4ff, 0xff4081];
    for (let i = 0; i < this.samples; i += 14) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 13 + (i % 4) * 3.5));
        if (this._isClearOfTrack(pos, this.wallOffset + 8)) {
          const palm = new THREE.Group();
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 7.5, 8), trunkMat);
          trunk.position.y = 3.75;
          palm.add(trunk);
          for (let a = 0; a < 4; a++) {
            const frond = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.45, 1.2), leafMat);
            frond.position.set(0, 7.6, 0);
            frond.rotation.y = (a * Math.PI) / 2 + 0.4;
            palm.add(frond);
          }
          palm.position.set(pos.x, 0, pos.z);
          this.group.add(palm);
          if (i % 28 === 0) {
            const umb = new THREE.Group();
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 3.6, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
            pole.position.y = 1.8;
            const top = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.3, 8), new THREE.MeshStandardMaterial({ color: umbColors[(i / 28) % umbColors.length | 0] }));
            top.position.y = 3.8;
            umb.add(pole, top);
            umb.position.set(pos.x + side * 4.5, 0, pos.z);
            this.group.add(umb);
          }
        }
      }
    }
    this._buildClouds(0xffffff, 0xe0f7fa);
  }

  _buildSakuraScenery() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xf48fb1, roughness: 0.4 });
    const lightPinkMat = new THREE.MeshStandardMaterial({ color: 0xfce4ec, roughness: 0.4 });
    const toriiMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.3 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.5 });

    for (let i = 0; i < this.samples; i += 13) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 13 + (i % 4) * 3.8));
        if (this._isClearOfTrack(pos, this.wallOffset + 8)) {
          const tree = new THREE.Group();
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 3.8, 8), trunkMat);
          trunk.position.y = 1.9;
          const crown1 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.6, 5.2), pinkMat);
          crown1.position.y = 4.9;
          const crown2 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.0, 3.4), lightPinkMat);
          crown2.position.y = 7.0;
          tree.add(trunk, crown1, crown2);
          tree.position.set(pos.x, 0, pos.z);
          this.group.add(tree);
        }
      }
    }

    for (let i = 55; i < this.samples; i += 90) {
      const p = this.points[i];
      const tan = this.tangents[i];
      const span = this.roadWidth / 2 + 2.6;
      const gate = new THREE.Group();
      gate.position.set(p.x, p.y, p.z);
      gate.rotation.y = Math.atan2(tan.x, tan.z);
      const pL = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, 11.5, 10), toriiMat);
      pL.position.set(-span, 5.75, 0);
      const pR = pL.clone();
      pR.position.x = span;
      const cross1 = new THREE.Mesh(new THREE.BoxGeometry(span * 2 + 5, 1.1, 1.3), toriiMat);
      cross1.position.y = 10.6;
      const crossTop = new THREE.Mesh(new THREE.BoxGeometry(span * 2 + 6.5, 0.9, 1.8), roofMat);
      crossTop.position.y = 11.5;
      gate.add(pL, pR, cross1, crossTop);
      this.group.add(gate);
    }
    this._buildClouds(0xfff0f5, 0xffcdd2);
  }

  _buildVolcanoScenery() {
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x2b2020, roughness: 0.85 });
    const lavaMat = new THREE.MeshBasicMaterial({ color: 0xff5722 });
    for (let i = 0; i < this.samples; i += 14) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 14 + (i % 4) * 4));
        if (this._isClearOfTrack(pos, this.wallOffset + 8)) {
          const h = 6 + (i % 5) * 3;
          const rock = new THREE.Mesh(new THREE.BoxGeometry(4.5, h, 4.5), rockMat);
          rock.position.set(pos.x, h / 2, pos.z);
          this.group.add(rock);
        }
      }
    }
    for (const [vx, vz, sc] of [[105, -80, 1.3], [115, 115, 1.15], [-80, 15, 1.4], [320, 40, 1.45]]) {
      const volc = new THREE.Group();
      for (let tier = 0; tier < 5; tier++) {
        const size = (28 - tier * 4.5) * sc;
        const step = new THREE.Mesh(new THREE.BoxGeometry(size, 5 * sc, size), rockMat);
        step.position.y = (tier * 5 + 2.5) * sc;
        volc.add(step);
      }
      const crater = new THREE.Mesh(new THREE.BoxGeometry(7 * sc, 1.6 * sc, 7 * sc), lavaMat);
      crater.position.y = 25.5 * sc;
      volc.add(crater);
      volc.position.set(vx, 0, vz);
      this.group.add(volc);
    }
  }

  _buildRainbowScenery() {
    const starColors = [0xffffff, 0xffdd00, 0x00f5ff, 0xff2a9d, 0xa855f7];
    const starGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    for (let i = 0; i < 160; i++) {
      const star = new THREE.Mesh(starGeo, new THREE.MeshBasicMaterial({ color: starColors[i % starColors.length] }));
      star.position.set(-220 + ((i * 73) % 680), 18 + ((i * 29) % 110), -320 + ((i * 97) % 680));
      this.group.add(star);
    }
    const planetSpots = [
      [110, 56, -90, 14, 0xff2a9d, 0xffdd00],
      [-95, 62, 30, 18, 0x00e5ff, 0xffffff],
      [330, 58, 95, 16, 0xa855f7, 0x00f5ff],
    ];
    for (const [px, py, pz, rad, col, ringCol] of planetSpots) {
      const g = new THREE.Group();
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(rad, 16, 12), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35 }));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(rad * 1.55, 1.1, 8, 28), new THREE.MeshBasicMaterial({ color: ringCol }));
      ring.rotation.x = Math.PI / 2.4;
      g.add(sphere, ring);
      g.position.set(px, py, pz);
      this.group.add(g);
    }
  }

  _buildNeonScenery() {
    const neonColors = [0x00f5ff, 0xff2a9d, 0xa855f7, 0xffdd00];
    const bldgMat = new THREE.MeshStandardMaterial({ color: 0x161b33, roughness: 0.4, metalness: 0.3 });
    for (let i = 0; i < this.samples; i += 15) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 18 + (i % 4) * 5));
        if (this._isClearOfTrack(pos, this.wallOffset + 11)) {
          const h = 20 + ((i * 7) % 30);
          const w = 7 + (i % 4) * 1.5;
          const bldg = new THREE.Group();
          const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), bldgMat);
          body.position.y = h / 2;
          bldg.add(body);
          const col = neonColors[(i + (side > 0 ? 1 : 0)) % neonColors.length];
          const neonMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(2.2) });
          const roofStrip = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.8, w + 0.3), neonMat);
          roofStrip.position.y = h - 0.6;
          bldg.add(roofStrip);
          for (let wy = 4; wy < h - 3; wy += 5) {
            const band = new THREE.Mesh(new THREE.BoxGeometry(w + 0.15, 0.5, w + 0.15), neonMat);
            band.position.y = wy;
            bldg.add(band);
          }
          bldg.position.set(pos.x, 0, pos.z);
          this.group.add(bldg);
        }
      }
    }
  }

  // 🍭 糖果王國：棒棒糖森林、軟糖、旋轉甜甜圈拱門、巨型生日蛋糕（全部用基本幾何體程序生成，不佔檔案大小）
  _buildCandyScenery() {
    const pastel = [0xff4fa3, 0x7dd3fc, 0xfde047, 0xa78bfa, 0x4ade80, 0xfb923c];
    const stickMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const mats = pastel.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.25, emissive: c, emissiveIntensity: 0.12 }));
    const stickGeo = new THREE.CylinderGeometry(0.45, 0.45, 9, 8);
    const discGeo = new THREE.CylinderGeometry(3.6, 3.6, 1.1, 20);
    const swirlGeo = new THREE.TorusGeometry(2.2, 0.45, 6, 20);
    const gumGeo = new THREE.SphereGeometry(2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);

    for (let i = 0; i < this.samples; i += 12) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 12 + (i % 5) * 4));
        if (!this._isClearOfTrack(pos, this.wallOffset + 7)) continue;
        const k = (i + (side > 0 ? 3 : 0)) % pastel.length;
        if ((i / 12) % 3 === 2) {
          const gum = new THREE.Mesh(gumGeo, mats[k]);
          gum.position.set(pos.x, 0, pos.z);
          gum.scale.setScalar(0.8 + (i % 4) * 0.25);
          this.group.add(gum);
          continue;
        }
        const pop = new THREE.Group();
        const stick = new THREE.Mesh(stickGeo, stickMat);
        stick.position.y = 4.5;
        const head = new THREE.Group();
        const disc = new THREE.Mesh(discGeo, mats[k]);
        disc.rotation.x = Math.PI / 2;
        const swirl = new THREE.Mesh(swirlGeo, mats[(k + 2) % mats.length]);
        swirl.position.z = 0.6;
        head.add(disc, swirl);
        head.position.y = 11.5;
        pop.add(stick, head);
        pop.position.set(pos.x, 0, pos.z);
        pop.rotation.y = Math.atan2(r.x, r.z);
        this.group.add(pop);
        this.spinners.push({ mesh: head, axis: 'z', speed: 1.2 * side });
      }
    }

    // 🍩 巨型旋轉甜甜圈拱門：賽道直接從甜甜圈中間穿過去！（內徑 20，路面寬度內完全不會擦到）
    const sprinkleGeo = new THREE.BoxGeometry(0.7, 2.2, 0.7);
    for (const t of this.config.donutGateTs || []) {
      const idx = Math.floor(t * this.samples) % this.samples;
      const p = this.points[idx];
      const tan = this.tangents[idx];
      const gate = new THREE.Group();
      const dough = new THREE.Mesh(new THREE.TorusGeometry(24, 4, 14, 44), new THREE.MeshStandardMaterial({ color: 0xe0a060, roughness: 0.6 }));
      const icing = new THREE.Mesh(new THREE.TorusGeometry(24, 4.15, 14, 44), new THREE.MeshStandardMaterial({ color: 0xff6fb5, roughness: 0.3 }));
      icing.scale.set(1, 1, 0.55);
      icing.position.z = 1.4;
      const ring = new THREE.Group();
      ring.add(dough, icing);
      for (let s = 0; s < 36; s++) {
        const a = (s / 36) * Math.PI * 2;
        const sp = new THREE.Mesh(sprinkleGeo, mats[s % mats.length]);
        sp.position.set(Math.cos(a) * (24 + ((s % 3) - 1) * 2.2), Math.sin(a) * (24 + ((s % 3) - 1) * 2.2), 3.4);
        sp.rotation.z = a + s;
        ring.add(sp);
      }
      gate.add(ring);
      gate.position.set(p.x, p.y + 6, p.z);
      gate.rotation.y = Math.atan2(tan.x, tan.z);
      this.group.add(gate);
      this.spinners.push({ mesh: ring, axis: 'z', speed: 0.5 });
    }

    // 🎂 巨型生日蛋糕山（地標）
    const cake = new THREE.Group();
    const layers = [[34, 12, 0xfff1f2], [26, 11, 0xfbcfe8], [18, 10, 0xfff1f2]];
    let y = 0;
    layers.forEach(([rad, h, col]) => {
      const layer = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, h, 32), new THREE.MeshStandardMaterial({ color: col, roughness: 0.5 }));
      layer.position.y = y + h / 2;
      const drip = new THREE.Mesh(new THREE.TorusGeometry(rad, 1.3, 6, 32), mats[0]);
      drip.rotation.x = Math.PI / 2;
      drip.position.y = y + h;
      cake.add(layer, drip);
      y += h;
    });
    for (let c = 0; c < 8; c++) {
      const a = (c / 8) * Math.PI * 2;
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 7, 8), mats[(c + 1) % mats.length]);
      candle.position.set(Math.cos(a) * 11, y + 3.5, Math.sin(a) * 11);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd54f }));
      flame.position.set(Math.cos(a) * 11, y + 8, Math.sin(a) * 11);
      flame.scale.y = 1.6;
      cake.add(candle, flame);
    }
    cake.position.set(95, 0, 110);
    if (this._isClearOfTrack(cake.position, this.wallOffset + 36)) this.group.add(cake);
    else { cake.position.set(-110, 0, -40); this.group.add(cake); }

    // 天上飄的棉花糖雲
    this._buildClouds(0xfff0fa, 0xffc8e8);
  }

  // 🏝️ 海島大冒險：沙島＋椰子樹、跳島跳台、跨海懸索大橋、海底世界（珊瑚、海草、魚群、鯨魚）
  _buildIslandScenery() {
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xf2d49b, roughness: 0.9 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 });
    const islandGeo = new THREE.CylinderGeometry(19, 24, 5, 18);
    const [bA, bB] = this.config.bridgeRange;
    const [uA, uB] = this.config.tunnelRange;
    const nearGap = (i) => this.inGap(i) || this.inGap(i + 3) || this.inGap(i - 3);

    // 沙島：鋪在一般路段下面（跳島缺口、大橋、海底隧道除外）
    for (let i = 0; i < this.samples; i += 6) {
      const t = i / this.samples;
      if (nearGap(i) || (t > bA - 0.01 && t < bB + 0.02) || (t > uA - 0.01 && t < uB + 0.01)) continue;
      const p = this.points[i];
      const isle = new THREE.Mesh(islandGeo, sandMat);
      isle.position.set(p.x, p.y - 3.4, p.z);
      isle.receiveShadow = true;
      this.group.add(isle);
      if (i % 18 === 0) {
        const r = this.rights[i];
        for (const side of [-1, 1]) {
          const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 3.5));
          const palm = new THREE.Group();
          const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 8, 7), trunkMat);
          trunk.position.y = 4;
          trunk.rotation.z = side * 0.18;
          palm.add(trunk);
          for (let k = 0; k < 5; k++) {
            const leaf = new THREE.Mesh(new THREE.BoxGeometry(5, 0.25, 1.3), leafMat);
            const a = (k / 5) * Math.PI * 2;
            leaf.position.set(Math.cos(a) * 2 + side * 1.3, 8, Math.sin(a) * 2);
            leaf.rotation.set(0, -a, -0.45);
            palm.add(leaf);
          }
          palm.position.set(pos.x, p.y - 1, pos.z);
          this.group.add(palm);
        }
      }
    }

    // 跳島跳台：整條路寬的大跳台，確保一定飛得過去（速度太慢會掉海）
    const rampMat = new THREE.MeshStandardMaterial({ color: 0xff7043, emissive: 0xff5722, emissiveIntensity: 0.35, roughness: 0.4 });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffeb3b });
    for (const [gA] of this.config.gaps) {
      const idx = Math.floor((gA - 0.007) * this.samples);
      const p = this.points[idx];
      const tan = this.tangents[idx];
      const r = this.rights[idx];
      const ramp = new THREE.Group();
      const slab = new THREE.Mesh(new THREE.BoxGeometry(this.roadWidth + 1, 0.6, 9), rampMat);
      slab.rotation.x = 0.26;
      slab.position.y = 1.0;
      ramp.add(slab);
      for (let k = -2; k <= 2; k++) {
        const st = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.65, 8.6), stripeMat);
        st.rotation.x = 0.26;
        st.position.set(k * 4.4, 1.05, 0);
        ramp.add(st);
      }
      ramp.position.copy(p);
      ramp.rotation.y = Math.atan2(-tan.x, -tan.z);
      this.group.add(ramp);
      for (let k = -2; k <= 2; k++) {
        this.jumpRamps.push({ position: p.clone().addScaledVector(r, k * 4.6), radius: 5.2 });
      }
    }

    // 🌉 跨海懸索大橋：兩座紅色主塔＋鋼纜
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xd9382a, roughness: 0.45 });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const towerTops = [];
    for (const t of this.config.bridgeTowers) {
      const idx = Math.floor(t * this.samples);
      const p = this.points[idx];
      const tan = this.tangents[idx];
      const r = this.rights[idx];
      const h = p.y + 34;
      const tops = [];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 1.5));
        const leg = new THREE.Mesh(new THREE.BoxGeometry(3, h, 3), towerMat);
        leg.position.set(pos.x, h / 2 - 1, pos.z);
        leg.castShadow = true;
        this.group.add(leg);
        tops.push(new THREE.Vector3(pos.x, h - 2, pos.z));
      }
      for (const yy of [p.y + 14, h - 3]) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry((this.wallOffset + 1.5) * 2 + 3, 2.2, 2.4), towerMat);
        beam.position.set(p.x, yy, p.z);
        beam.rotation.y = Math.atan2(-r.z, r.x);
        this.group.add(beam);
      }
      towerTops.push(tops);
    }
    const [bs, be] = this.config.bridgeRange;
    const iS = Math.floor(bs * this.samples);
    const iE = Math.floor(be * this.samples);
    for (const sideIdx of [0, 1]) {
      const side = sideIdx === 0 ? -1 : 1;
      const pts = [];
      for (let i = iS; i <= iE; i += 2) {
        const p = this.points[i];
        const r = this.rights[i];
        const base = p.clone().addScaledVector(r, side * (this.wallOffset + 1.5));
        // 鋼纜高度：塔頂最高、中間下垂
        const t = i / this.samples;
        const [t1, t2] = this.config.bridgeTowers;
        let sag;
        if (t < t1) sag = (t - bs) / (t1 - bs);
        else if (t > t2) sag = (be - t) / (be - t2);
        else sag = 0.45 + Math.pow((t - (t1 + t2) / 2) / ((t2 - t1) / 2), 2) * 0.55;
        base.y = p.y + 2 + sag * 32;
        pts.push(base);
        if (i % 6 === 0) {
          const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, base.y - p.y, 5), cableMat);
          hanger.position.set(base.x, (base.y + p.y) / 2, base.z);
          this.group.add(hanger);
        }
      }
      const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 2, 0.45, 6, false), cableMat);
      this.group.add(cable);
    }

    // 🐠 海底世界：沙地海床、珊瑚、海草、魚群、鯨魚
    const seabed = new THREE.Mesh(new THREE.PlaneGeometry(1500, 1500), new THREE.MeshStandardMaterial({ color: 0xd9c08a, roughness: 1 }));
    seabed.rotation.x = -Math.PI / 2;
    seabed.position.set(110, -30, 20);
    this.group.add(seabed);
    const coralCols = [0xff6b9a, 0xffa94d, 0xc084fc, 0xf43f5e, 0xfde047];
    const weedMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.6 });
    const iU = Math.floor(uA * this.samples);
    const iUe = Math.floor(uB * this.samples);
    for (let i = iU; i < iUe; i += 3) {
      const p = this.points[i];
      const r = this.rights[i];
      for (const side of [-1, 1]) {
        const pos = p.clone().addScaledVector(r, side * (this.wallOffset + 6 + (i % 4) * 5));
        if ((i / 3) % 2 === 0) {
          const coral = new THREE.Mesh(new THREE.ConeGeometry(2 + (i % 3), 6 + (i % 5) * 2, 6), new THREE.MeshStandardMaterial({ color: coralCols[i % coralCols.length], roughness: 0.6 }));
          coral.position.set(pos.x, -27, pos.z);
          this.group.add(coral);
        } else {
          const weed = new THREE.Mesh(new THREE.BoxGeometry(0.6, 14 + (i % 4) * 3, 0.6), weedMat);
          weed.position.set(pos.x, -24, pos.z);
          weed.rotation.z = Math.sin(i) * 0.2;
          this.group.add(weed);
        }
      }
    }
    // 魚群：繞著隧道游
    const midIdx = Math.floor(((uA + uB) / 2) * this.samples);
    const mid = this.points[midIdx];
    const fishCols = [0xffa500, 0xfde047, 0x38bdf8, 0xf472b6, 0xffffff];
    for (let sch = 0; sch < 5; sch++) {
      const pivot = new THREE.Group();
      pivot.position.set(mid.x, 0, mid.z);
      for (let f = 0; f < 7; f++) {
        const fish = new THREE.Group();
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6), new THREE.MeshStandardMaterial({ color: fishCols[(sch + f) % fishCols.length], roughness: 0.4 }));
        body.scale.set(1, 0.7, 1.8);
        const tail = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.2, 4), body.material);
        tail.rotation.x = -Math.PI / 2;
        tail.position.z = 2;
        fish.add(body, tail);
        fish.position.set(40 + sch * 14 + (f % 3) * 2, -6 - sch * 3 - (f % 2) * 1.5, f * 2.6);
        pivot.add(fish);
      }
      pivot.rotation.y = sch * 1.3;
      this.group.add(pivot);
      this.spinners.push({ mesh: pivot, axis: 'y', speed: (sch % 2 ? -1 : 1) * (0.25 + sch * 0.04) });
    }
    // 🐋 大鯨魚：慢慢繞著海底隧道游，從玻璃隧道裡就看得到
    const whalePivot = new THREE.Group();
    whalePivot.position.set(mid.x, 0, mid.z);
    const whale = new THREE.Group();
    const whaleMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.5 });
    const belly = new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.6 });
    const wb = new THREE.Mesh(new THREE.SphereGeometry(7, 16, 12), whaleMat);
    wb.scale.set(1, 0.8, 2.6);
    const wbelly = new THREE.Mesh(new THREE.SphereGeometry(6.3, 14, 10), belly);
    wbelly.scale.set(0.9, 0.5, 2.4);
    wbelly.position.y = -2.4;
    const wtail = new THREE.Mesh(new THREE.BoxGeometry(14, 1, 4), whaleMat);
    wtail.position.z = 20;
    const weye = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 6), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    weye.position.set(5.6, 1, -10);
    const weye2 = weye.clone();
    weye2.position.x = -5.6;
    whale.add(wb, wbelly, wtail, weye, weye2);
    whale.position.set(75, -14, 0);
    whalePivot.add(whale);
    this.group.add(whalePivot);
    this.spinners.push({ mesh: whalePivot, axis: 'y', speed: -0.12 });

    this._buildClouds(0xffffff, 0xe0f2fe);
  }

  _buildClouds(colorHex, emissiveHex) {
    const cloudMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: emissiveHex, emissiveIntensity: 0.65, roughness: 0.9 });
    for (let i = 0; i < 16; i++) {
      const cloud = new THREE.Group();
      const c1 = new THREE.Mesh(new THREE.BoxGeometry(18, 5, 10), cloudMat);
      const c2 = new THREE.Mesh(new THREE.BoxGeometry(11, 5, 8), cloudMat);
      c2.position.set(3, 4, 0);
      cloud.add(c1, c2);
      cloud.position.set(-120 + (i % 4) * 140 + Math.sin(i) * 30, 72 + (i % 3) * 14, -240 + Math.floor(i / 4) * 160);
      this.group.add(cloud);
    }
  }

  getClosestTrackPoint(pos, hintIndex = -1) {
    if (this.isBattleArena) {
      return {
        index: 0,
        t: 0,
        point: new THREE.Vector3(0, 0, 0),
        tangent: new THREE.Vector3(0, 0, -1),
        right: new THREE.Vector3(1, 0, 0),
        lateralOffset: 0,
        distanceSq: pos.x * pos.x + pos.z * pos.z,
      };
    }
    let bestIdx = 0;
    let bestDistSq = Infinity;

    if (hintIndex >= 0) {
      // Local window search keeps karts locked to upper/lower bridge on Figure-8 overpasses!
      const windowSize = 26;
      for (let offset = -windowSize; offset <= windowSize; offset++) {
        const idx = (hintIndex + offset + this.samples) % this.samples;
        const p = this.points[idx];
        const dx = pos.x - p.x;
        const dz = pos.z - p.z;
        const dSq = dx * dx + dz * dz;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          bestIdx = idx;
        }
      }
      if (bestDistSq > 1600) hintIndex = -1;
    }

    if (hintIndex < 0) {
      for (let i = 0; i < this.samples; i++) {
        const p = this.points[i];
        const dx = pos.x - p.x;
        const dz = pos.z - p.z;
        const dSq = dx * dx + dz * dz;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          bestIdx = i;
        }
      }
    }

    const p = this.points[bestIdx];
    const tan = this.tangents[bestIdx];
    const right = this.rights[bestIdx];
    const relX = pos.x - p.x;
    const relZ = pos.z - p.z;
    const lateralOffset = relX * right.x + relZ * right.z;

    return { index: bestIdx, t: bestIdx / this.samples, point: p, tangent: tan, right, lateralOffset, distanceSq: bestDistSq };
  }

  getStartTransform(slotIndex) {
    if (this.isBattleArena) {
      const a = (slotIndex / 4) * Math.PI * 2 + Math.PI / 4;
      const dist = 42;
      const pos = new THREE.Vector3(Math.cos(a) * dist, 0, Math.sin(a) * dist);
      // Face toward the center (0, 0, 0)!
      const yaw = Math.atan2(pos.x, pos.z);
      return { position: pos, yaw, trackIndex: 0 };
    }
    const backSamples = 7 + Math.floor(slotIndex / 2) * 5;
    const idx = (this.samples - backSamples) % this.samples;
    const p = this.points[idx];
    const tan = this.tangents[idx];
    const right = this.rights[idx];

    const lane = slotIndex % 2 === 0 ? -4.2 : 4.2;
    const pos = p.clone().addScaledVector(right, lane);
    const yaw = Math.atan2(-tan.x, -tan.z);

    return { position: pos, yaw, trackIndex: idx };
  }
}
