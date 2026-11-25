import * as THREE from 'three';
import { createLegoKart, DRIVER_PRESETS } from './kart.js';
import { TRACK_ORDER, TRACK_CONFIGS } from './track.js';

// ===================================================================
// 🎲 積木大亨賽車（大富翁 × 卡丁車）
// - 擲骰子在 20 格棋盤上走；每塊地是一張賽道，可以買、可以蓋房（升級）
// - 停在別人的地：付過路費，或「挑戰賽」單挑地主（贏了免付還反收，輸了付雙倍）
// - 機會格抽道具卡；繞過起點領薪水；固定回合數後，總資產最高的人獲勝
// ===================================================================

const START_COINS = 1500;
const PASS_START = 200;
const MAX_LEVEL = 3;
const TOLL_MULT = [1, 2.2, 3.6, 5.2]; // 等級 0~3 的過路費倍率
const PLAYER_COLORS = ['#ffcc00', '#00e5ff', '#ff4f8b', '#7cf27c'];

// 20 格：0 起點、5 維修站（休息一回合）、10 神龍門（隨機傳送）、15 加油站（+150）
// 3、8、13、18 機會；其他 12 格是賽道地產
const SPECIAL = { 0: 'start', 5: 'pit', 10: 'portal', 15: 'fuel', 3: 'chance', 8: 'chance', 13: 'chance', 18: 'chance' };
const PROP_SLOTS = [1, 2, 4, 6, 7, 9, 11, 12, 14, 16, 17, 19];

const CHANCE_CARDS = [
  { icon: '🐉', title: '神龍附身', text: '直接飛到前方最近的空地！', act: 'dragon' },
  { icon: '⚡', title: '黃金氮氣', text: '再擲一次骰子！', act: 'again' },
  { icon: '🍌', title: '踩到香蕉皮', text: '滑倒後退 3 格', act: 'back3' },
  { icon: '🧲', title: '超級磁鐵', text: '從最有錢的玩家吸走 150 金幣', act: 'magnet' },
  { icon: '🌩️', title: '天雷閃電', text: '其他每位玩家各付你 50 金幣', act: 'thunder' },
  { icon: '🚀', title: '加速帶', text: '向前衝 3 格', act: 'fwd3' },
  { icon: '🦑', title: '墨魚噴墨', text: '看不到路，下一回合休息', act: 'skip' },
  { icon: '🪙', title: '金幣雨', text: '撿到 200 金幣！', act: 'coins' },
  { icon: '🔧', title: '免費改裝', text: '自己的一塊地免費升一級', act: 'freeup' },
  { icon: '💸', title: '超速罰單', text: '罰款 120 金幣', act: 'fine' },
];

function propPrice(i) { return 120 + i * 20; } // 第 i 塊地（0~11）越後面越貴

export class TycoonGame {
  constructor(api) {
    this.api = api;
    this.active = false;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x8fd3ff);
    this.scene.fog = new THREE.Fog(0x8fd3ff, 140, 320);
    this.camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.5, 600);
    this.camTarget = new THREE.Vector3();
    this.camPos = new THREE.Vector3(0, 70, 70);
    this.time = 0;
    this._buildLights();
    this._buildUI();
    window.addEventListener('keydown', (e) => this._onKey(e));
  }

  // ---------------------------------------------------------------
  // 開始一盤
  // ---------------------------------------------------------------
  start(setup) {
    this.setup = setup;
    this.rounds = setup.rounds || 10;
    this.round = 1;
    this.turn = 0;
    this.busy = false;
    this.tiles = this._makeTiles();
    this.players = setup.players.map((p, idx) => ({
      ...p,
      idx,
      coins: START_COINS,
      pos: 0,
      skip: 0,
      out: false,
      color: PLAYER_COLORS[idx],
      token: null,
    }));
    if (this.board) { this.scene.remove(this.board); this._dispose(this.board); }
    this.board = new THREE.Group();
    this.scene.add(this.board);
    this._buildBoard();
    this.players.forEach((p) => this._spawnToken(p));
    this.active = true;
    this.root.classList.remove('hidden');
    this.endEl.classList.add('hidden');
    this._renderPlayers();
    this.snapCam = true;
    this.api.audio.startBgm('victory');
    this._log(`🎲 積木大亨賽車開始！共 ${this.rounds} 回合，總資產最高的人獲勝`);
    setTimeout(() => this._beginTurn(), 700);
  }

  stop() {
    this.active = false;
    this.root.classList.add('hidden');
    this.endEl.classList.add('hidden');
    clearTimeout(this.aiTimer);
  }

  // 從挑戰賽回來
  resume() {
    this.active = true;
    this.root.classList.remove('hidden');
    this.api.audio.startBgm('victory');
    this._renderPlayers();
    this._renderTiles();
  }

  // ---------------------------------------------------------------
  // 3D 棋盤
  // ---------------------------------------------------------------
  _buildLights() {
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x5a8a3a, 1.1));
    const sun = new THREE.DirectionalLight(0xfff4e0, 1.5);
    sun.position.set(40, 90, 30);
    this.scene.add(sun);
  }

  _makeTiles() {
    const tiles = [];
    let p = 0;
    for (let i = 0; i < 20; i++) {
      const type = SPECIAL[i] || 'prop';
      const t = { i, type, owner: -1, level: 0 };
      if (type === 'prop') {
        const trackId = TRACK_ORDER[p % TRACK_ORDER.length];
        const cfg = TRACK_CONFIGS[trackId];
        t.trackId = trackId;
        t.name = cfg.name;
        t.icon = cfg.icon;
        t.price = propPrice(p);
        t.color = cfg.archTop;
        t.ground = cfg.groundColor;
        p++;
      } else {
        Object.assign(t, {
          start: { name: '起點', icon: '🏁', color: 0xffffff },
          pit: { name: '維修站', icon: '🔧', color: 0x94a3b8 },
          portal: { name: '神龍門', icon: '🐉', color: 0xef4444 },
          fuel: { name: '加油站', icon: '⛽', color: 0xf59e0b },
          chance: { name: '機會', icon: '❓', color: 0xa855f7 },
        }[type]);
      }
      tiles.push(t);
    }
    return tiles;
  }

  // 第 i 格在棋盤上的位置（正方形一圈，每邊 5 格）
  tilePos(i) {
    const S = 9.2; // 格子間距
    const side = Math.floor(i / 5);
    const k = i % 5;
    const half = S * 2.5;
    const pts = [
      [half - k * S, half], // 下邊：由右往左
      [-half, half - k * S], // 左邊：由下往上
      [-half + k * S, -half], // 上邊：由左往右
      [half, -half + k * S], // 右邊：由上往下
    ];
    const [x, z] = pts[side];
    return new THREE.Vector3(x, 0, z);
  }

  _tileTexture(t) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const g = c.getContext('2d');
    const base = '#' + new THREE.Color(t.color).getHexString();
    g.fillStyle = t.type === 'prop' ? t.ground : '#1e293b';
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = base;
    g.fillRect(0, 0, 256, 62);
    g.font = '72px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(t.icon, 128, 120);
    g.font = '900 38px "Noto Sans TC", "PingFang TC", sans-serif';
    g.fillStyle = '#ffffff';
    g.strokeStyle = 'rgba(0,0,0,0.75)';
    g.lineWidth = 7;
    g.strokeText(t.name, 128, 190);
    g.fillText(t.name, 128, 190);
    if (t.type === 'prop') {
      g.font = '900 30px sans-serif';
      g.fillStyle = '#ffe066';
      g.strokeText(`🪙${t.price}`, 128, 232);
      g.fillText(`🪙${t.price}`, 128, 232);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  _buildBoard() {
    // 草地底座＋中央標誌
    const ground = new THREE.Mesh(new THREE.BoxGeometry(62, 2, 62), new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.9 }));
    ground.position.y = -1.6;
    this.board.add(ground);
    const logo = document.createElement('canvas');
    logo.width = 512;
    logo.height = 512;
    const g = logo.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#ff3b30');
    grad.addColorStop(0.5, '#ffcc00');
    grad.addColorStop(1, '#00c6ff');
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 512);
    g.textAlign = 'center';
    g.font = '160px sans-serif';
    g.fillText('🎲', 256, 210);
    g.font = '900 64px "Noto Sans TC", "PingFang TC", sans-serif';
    g.fillStyle = '#fff';
    g.strokeStyle = '#1b1f3b';
    g.lineWidth = 10;
    g.strokeText('積木大亨賽車', 256, 360);
    g.fillText('積木大亨賽車', 256, 360);
    const logoTex = new THREE.CanvasTexture(logo);
    logoTex.colorSpace = THREE.SRGBColorSpace;
    const center = new THREE.Mesh(new THREE.BoxGeometry(26, 1, 26), [0, 0, 0, 0, 0, 0].map((_, k) => (k === 2 ? new THREE.MeshStandardMaterial({ map: logoTex }) : new THREE.MeshStandardMaterial({ color: 0x1e293b }))));
    center.position.y = -0.2;
    this.board.add(center);

    this.tileMeshes = [];
    for (const t of this.tiles) {
      const pos = this.tilePos(t.i);
      const top = new THREE.MeshStandardMaterial({ map: this._tileTexture(t), roughness: 0.6 });
      const side = new THREE.MeshStandardMaterial({ color: t.color, roughness: 0.5 });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(8.6, 1.2, 8.6), [side, side, top, side, side, side]);
      mesh.position.copy(pos);
      // 所有格子的字都朝向鏡頭（鏡頭從棋盤南方斜上方看）
      this.board.add(mesh);
      const ownerRing = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.35, 6, 4), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.4 }));
      ownerRing.rotation.x = Math.PI / 2;
      ownerRing.rotation.z = Math.PI / 4;
      ownerRing.position.set(pos.x, 0.7, pos.z);
      ownerRing.scale.set(1.3, 1.3, 1);
      ownerRing.visible = false;
      this.board.add(ownerRing);
      const houses = new THREE.Group();
      houses.position.set(pos.x, 0.6, pos.z);
      this.board.add(houses);
      this.tileMeshes[t.i] = { mesh, ownerRing, houses };
    }
    // 棋盤四周的小樹與看台裝飾
    const leaf = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
    const trunk = new THREE.MeshStandardMaterial({ color: 0x795548 });
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2;
      const tree = new THREE.Group();
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 3, 6), trunk);
      tr.position.y = 1.5;
      const lf = new THREE.Mesh(new THREE.BoxGeometry(3.4, 3, 3.4), leaf);
      lf.position.y = 4;
      tree.add(tr, lf);
      tree.position.set(Math.cos(a) * 44, -0.6, Math.sin(a) * 44);
      this.board.add(tree);
    }
    this._renderTiles();
  }

  _renderTiles() {
    if (!this.tileMeshes) return;
    for (const t of this.tiles) {
      const tm = this.tileMeshes[t.i];
      if (t.type !== 'prop') continue;
      tm.ownerRing.visible = t.owner >= 0;
      if (t.owner >= 0) {
        const col = new THREE.Color(PLAYER_COLORS[t.owner]);
        tm.ownerRing.material.color.copy(col);
        tm.ownerRing.material.emissive.copy(col);
      }
      // 房子：每升一級多一棟樂高小屋（顏色 = 地主顏色）
      while (tm.houses.children.length) tm.houses.remove(tm.houses.children[0]);
      for (let l = 0; l < t.level; l++) {
        const h = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 1.6), new THREE.MeshStandardMaterial({ color: PLAYER_COLORS[t.owner] }));
        body.position.y = 0.7;
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.1, 4), new THREE.MeshStandardMaterial({ color: 0xd32f2f }));
        roof.position.y = 1.95;
        roof.rotation.y = Math.PI / 4;
        h.add(body, roof);
        h.position.set(-2.4 + l * 2.4, 0, -2.6);
        tm.houses.add(h);
      }
    }
  }

  _spawnToken(p) {
    const k = createLegoKart(p.kartId, p.driverId, null);
    k.root.scale.setScalar(0.95);
    // 頭上的玩家顏色標記
    const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.9), new THREE.MeshStandardMaterial({ color: p.color, emissive: p.color, emissiveIntensity: 0.6 }));
    marker.position.y = 6.2;
    k.root.add(marker);
    p.marker = marker;
    p.token = k.root;
    this.board.add(k.root);
    this._placeToken(p, p.pos, true);
  }

  _tokenSpot(p, i) {
    const base = this.tilePos(i);
    const off = [[-2.1, -2.1], [2.1, -2.1], [-2.1, 2.1], [2.1, 2.1]][p.idx];
    return new THREE.Vector3(base.x + off[0], 0.6, base.z + off[1]);
  }

  _placeToken(p, i, instant = false) {
    const spot = this._tokenSpot(p, i);
    const side = Math.floor(i / 5);
    const yaw = [Math.PI / 2, 0, -Math.PI / 2, Math.PI][side]; // 車頭朝前進方向
    if (instant) {
      p.token.position.copy(spot);
      p.token.rotation.y = yaw;
    }
    return { spot, yaw };
  }

  // 一格一格跳過去
  _hopTo(p, steps, done) {
    const dir = steps >= 0 ? 1 : -1;
    let left = Math.abs(steps);
    const hop = () => {
      if (left <= 0) { done(); return; }
      const from = p.token.position.clone();
      const next = (p.pos + dir + 20) % 20;
      if (dir > 0 && next === 0) {
        p.coins += PASS_START;
        this._float(p, `+${PASS_START} 🪙 經過起點`, '#ffe066');
        this.api.audio.playCoin();
        this._renderPlayers();
      }
      p.pos = next;
      const { spot, yaw } = this._placeToken(p, next);
      const t0 = performance.now();
      const dur = p.isHuman ? 200 : 160;
      const anim = () => {
        const k = Math.min(1, (performance.now() - t0) / dur);
        p.token.position.lerpVectors(from, spot, k);
        p.token.position.y = spot.y + Math.sin(k * Math.PI) * 2.2;
        p.token.rotation.y = THREE.MathUtils.lerp(p.token.rotation.y, yaw, 0.35);
        if (k < 1) requestAnimationFrame(anim);
        else {
          this.api.audio.playBeep(500 + (Math.abs(steps) - left) * 40, 0.05, 0.06);
          left--;
          hop();
        }
      };
      anim();
    };
    hop();
  }

  // ---------------------------------------------------------------
  // 每幀更新：鏡頭跟著目前玩家、標記上下浮動
  // ---------------------------------------------------------------
  update(dt) {
    if (!this.board) return;
    this.time += dt;
    for (const p of this.players || []) {
      if (p.marker) {
        p.marker.position.y = 6.2 + Math.sin(this.time * 3 + p.idx) * 0.4;
        p.marker.rotation.y += dt * 2;
        p.marker.visible = !p.out;
      }
    }
    // 鏡頭：整個棋盤塞進「玩家列」和「下方面板」之間的空白，並稍微跟著目前玩家
    const cur = this.players && this.players[this.turn];
    const want = new THREE.Vector3();
    if (cur && cur.token) want.copy(cur.token.position).multiplyScalar(0.22);
    this.camTarget.lerp(want, Math.min(1, dt * 2.5));
    const W = window.innerWidth;
    const H = window.innerHeight;
    const plR = this.playersEl.getBoundingClientRect();
    const panelR = this.root.querySelector('.ty-panel').getBoundingClientRect();
    const sideCol = getComputedStyle(this.playersEl).flexDirection === 'column'; // 手機橫放：玩家卡在左邊直列
    const topY = sideCol ? 0 : plR.bottom + 6;
    const leftX = sideCol ? plR.right + 6 : 0;
    const botY = this.root.classList.contains('hidden') ? H : panelR.top - 6;
    const rh = Math.max(120, botY - topY);
    const rw = Math.max(160, W - leftX);
    this.camera.fov = 40;
    this.camera.aspect = W / H;
    const tanH = Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) * 2;
    const objW = 66;
    const objH = 66 * 0.74; // 斜著看，棋盤深度會變扁
    const dist = Math.max((objH * H) / (0.96 * rh * tanH), (objW * H) / (0.94 * rw * tanH));
    const dir = new THREE.Vector3(0, 0.82, 0.57).normalize();
    const goal = this.camTarget.clone().addScaledVector(dir, dist);
    if (this.snapCam) { this.camPos.copy(goal); this.snapCam = false; } else this.camPos.lerp(goal, Math.min(1, dt * 3));
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camTarget);
    this.camera.setViewOffset(W, H, W / 2 - (leftX + W) / 2, H / 2 - (topY + botY) / 2, W, H);
    this.camera.updateProjectionMatrix();
  }

  _focusOn(p, instant) {
    if (!p || !p.token) return;
    if (instant) this.camTarget.copy(p.token.position);
  }

  // ---------------------------------------------------------------
  // 回合流程
  // ---------------------------------------------------------------
  get current() { return this.players[this.turn]; }

  _beginTurn() {
    if (!this.active) return;
    const p = this.current;
    if (p.out) { this._nextTurn(); return; }
    this._renderPlayers();
    if (p.skip > 0) {
      p.skip--;
      this._prompt(`${p.name} 在休息中，這回合暫停 💤`, [{ label: '下一位 ▶', primary: true, fn: () => this._nextTurn() }], p);
      return;
    }
    this._prompt(`輪到 ${p.name}！`, [{ label: '🎲 擲骰子', primary: true, fn: () => this._roll() }], p);
  }

  _roll() {
    const p = this.current;
    const d1 = 1 + Math.floor(Math.random() * 6);
    const d2 = 1 + Math.floor(Math.random() * 6);
    this._clearButtons();
    this._showDice(d1, d2, () => {
      this._log(`${p.name} 擲出 ${d1} + ${d2} = ${d1 + d2}`);
      this._hopTo(p, d1 + d2, () => this._land(p, d1 === d2));
    });
  }

  _land(p, doubles = false) {
    const t = this.tiles[p.pos];
    const after = () => {
      this._renderPlayers();
      if (this._checkBankrupt()) return;
      if (doubles && !p.out && p.skip === 0) {
        this._prompt(`🎲 擲出一樣的點數！${p.name} 再擲一次`, [{ label: '🎲 再擲一次', primary: true, fn: () => this._roll() }], p);
      } else this._prompt(`${p.name} 的回合結束`, [{ label: '下一位 ▶', primary: true, fn: () => this._nextTurn() }], p, 700);
    };
    if (t.type === 'start') { this._float(p, '🏁 回到起點', '#fff'); after(); return; }
    if (t.type === 'fuel') {
      p.coins += 150;
      this.api.audio.playCoin();
      this._float(p, '+150 🪙 加油站補給', '#ffe066');
      after();
      return;
    }
    if (t.type === 'pit') {
      p.skip = 1;
      this._float(p, '🔧 進維修站，休息一回合', '#94a3b8');
      after();
      return;
    }
    if (t.type === 'portal') {
      const dest = Math.floor(Math.random() * 20);
      this._float(p, '🐉 神龍門！隨機傳送…', '#ef4444');
      this.api.audio.playBoost();
      setTimeout(() => {
        const steps = (dest - p.pos + 20) % 20 || 20;
        this._hopTo(p, steps, () => (dest === 10 ? after() : this._land(p)));
      }, 600);
      return;
    }
    if (t.type === 'chance') { this._drawChance(p, after); return; }

    // 賽道地產
    if (t.owner < 0) {
      if (p.coins >= t.price) {
        this._prompt(`${t.icon}「${t.name}」沒有主人，要用 🪙${t.price} 買下嗎？`, [
          { label: `✅ 買下（🪙${t.price}）`, primary: true, fn: () => { this._buy(p, t); after(); } },
          { label: '不買', fn: after },
        ], p, 0, () => this._aiShouldBuy(p, t));
      } else {
        this._float(p, '錢不夠買這塊地 😢', '#ff9b9b');
        after();
      }
      return;
    }
    if (t.owner === p.idx) {
      const cost = this._upgradeCost(t);
      if (t.level < MAX_LEVEL && p.coins >= cost) {
        this._prompt(`${t.icon}「${t.name}」是你的地！要花 🪙${cost} 蓋房子升到 Lv.${t.level + 1} 嗎？（過路費變成 🪙${this._toll({ ...t, level: t.level + 1 })}）`, [
          { label: `🏠 升級（🪙${cost}）`, primary: true, fn: () => { this._upgrade(p, t); after(); } },
          { label: '先不要', fn: after },
        ], p, 0, () => this._aiShouldUpgrade(p, t));
      } else after();
      return;
    }
    // 別人的地：付錢或挑戰
    const owner = this.players[t.owner];
    if (owner.out) { after(); return; }
    const toll = this._toll(t);
    this._prompt(`😱 這是 ${owner.name} 的「${t.name}」（Lv.${t.level}），過路費 🪙${toll}！`, [
      { label: `🏁 挑戰賽！（贏了免付，輸了付 🪙${toll * 2}）`, primary: true, fn: () => this._challenge(p, owner, t, toll, after) },
      { label: `付過路費 🪙${toll}`, fn: () => { this._pay(p, owner, toll); after(); } },
    ], p, 0, () => this._aiShouldChallenge(p, owner, t, toll));
  }

  _nextTurn() {
    if (!this.active) return;
    let n = this.turn;
    for (let k = 0; k < this.players.length; k++) {
      n = (n + 1) % this.players.length;
      if (n === 0) {
        this.round++;
        if (this.round > this.rounds) { this._endGame(); return; }
        this._log(`📅 第 ${this.round} / ${this.rounds} 回合`);
      }
      if (!this.players[n].out) break;
    }
    this.turn = n;
    this._beginTurn();
  }

  // ---------------------------------------------------------------
  // 金錢
  // ---------------------------------------------------------------
  _toll(t) { return Math.round((t.price * 0.35 * TOLL_MULT[t.level]) / 10) * 10; }
  _upgradeCost(t) { return Math.round((t.price * 0.6) / 10) * 10; }

  _buy(p, t) {
    p.coins -= t.price;
    t.owner = p.idx;
    this.api.audio.playItemPickup();
    this._float(p, `🎉 買下 ${t.name}！`, p.color);
    this.api.say(p, 'overtake');
    this._renderTiles();
    this._renderPlayers();
  }

  _upgrade(p, t) {
    p.coins -= this._upgradeCost(t);
    t.level++;
    this.api.audio.playShield();
    this._float(p, `🏠 ${t.name} 升到 Lv.${t.level}！`, p.color);
    this._renderTiles();
    this._renderPlayers();
  }

  _pay(from, to, amount) {
    from.coins -= amount;
    if (to) to.coins += amount;
    this.api.audio.playHit();
    this._float(from, `-${amount} 🪙`, '#ff6b6b');
    if (to) this._float(to, `+${amount} 🪙`, '#ffe066');
    this._renderPlayers();
  }

  netWorth(p) {
    let v = p.coins;
    for (const t of this.tiles) if (t.owner === p.idx) v += t.price + t.level * this._upgradeCost(t);
    return v;
  }

  // 錢變負的：自動賣地（從最便宜的賣起，半價）；賣光還是負的就出局
  _checkBankrupt() {
    for (const p of this.players) {
      if (p.out || p.coins >= 0) continue;
      const owned = this.tiles.filter((t) => t.owner === p.idx).sort((a, b) => a.price - b.price);
      while (p.coins < 0 && owned.length) {
        const t = owned.shift();
        const refund = Math.round((t.price + t.level * this._upgradeCost(t)) / 2);
        p.coins += refund;
        t.owner = -1;
        t.level = 0;
        this._log(`💸 ${p.name} 賣掉「${t.name}」換 🪙${refund}`);
      }
      if (p.coins < 0) {
        p.out = true;
        p.coins = 0;
        this._log(`💥 ${p.name} 破產出局！`);
        this._float(p, '💥 破產出局', '#ff3b30');
      }
      this._renderTiles();
    }
    this._renderPlayers();
    if (this.players.filter((p) => !p.out).length <= 1) { this._endGame(); return true; }
    return false;
  }

  // ---------------------------------------------------------------
  // 機會卡
  // ---------------------------------------------------------------
  _drawChance(p, after) {
    const c = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
    this.api.audio.playItemPickup();
    this._showCard(c, () => {
      const others = this.players.filter((o) => o !== p && !o.out);
      switch (c.act) {
        case 'dragon': {
          let steps = 1;
          while (steps < 20 && !(this.tiles[(p.pos + steps) % 20].type === 'prop' && this.tiles[(p.pos + steps) % 20].owner < 0)) steps++;
          if (steps >= 20) { after(); return; }
          this.api.audio.playBoost();
          this._hopTo(p, steps, () => this._land(p));
          return;
        }
        case 'again':
          this._prompt(`⚡ ${p.name} 再擲一次！`, [{ label: '🎲 擲骰子', primary: true, fn: () => this._roll() }], p);
          return;
        case 'back3': this._hopTo(p, -3, () => this._land(p)); return;
        case 'fwd3': this._hopTo(p, 3, () => this._land(p)); return;
        case 'magnet': {
          const rich = others.sort((a, b) => b.coins - a.coins)[0];
          if (rich) this._pay(rich, p, Math.min(150, Math.max(0, rich.coins)));
          break;
        }
        case 'thunder': others.forEach((o) => this._pay(o, p, 50)); break;
        case 'skip': p.skip = 1; break;
        case 'coins': p.coins += 200; this.api.audio.playCoin(); break;
        case 'fine': this._pay(p, null, 120); break;
        case 'freeup': {
          const mine = this.tiles.filter((t) => t.owner === p.idx && t.level < MAX_LEVEL);
          if (mine.length) {
            const t = mine.sort((a, b) => b.price - a.price)[0];
            t.level++;
            this._float(p, `🔧 ${t.name} 免費升到 Lv.${t.level}`, p.color);
            this._renderTiles();
          } else { p.coins += 100; this._float(p, '還沒有地，改送 100 🪙', '#ffe066'); }
          break;
        }
        default: break;
      }
      after();
    });
  }

  // ---------------------------------------------------------------
  // 挑戰賽：停在別人地上可以單挑地主（1 圈）
  // ---------------------------------------------------------------
  _challenge(p, owner, t, toll, after) {
    this._clearButtons();
    const settle = (challengerWon) => {
      if (challengerWon) {
        const bonus = Math.round(toll / 2 / 10) * 10;
        this._log(`🏆 ${p.name} 挑戰成功！免付過路費，還從 ${owner.name} 拿走 🪙${bonus}`);
        this._pay(owner, p, bonus);
        this.api.say(p, 'win');
      } else {
        this._log(`😵 ${p.name} 挑戰失敗，付給 ${owner.name} 雙倍 🪙${toll * 2}`);
        this._pay(p, owner, toll * 2);
        this.api.say(owner, 'win');
      }
      this._renderPlayers();
      after();
    };
    // 兩個都是電腦：直接用機率決定（地主等級越高越有利）
    if (!p.isHuman && !owner.isHuman) {
      this._prompt(`⚡ 電腦對決：${p.name} vs ${owner.name}（${t.icon}${t.name}）…`, [], p);
      setTimeout(() => settle(Math.random() < 0.5 - t.level * 0.08), 1400);
      return;
    }
    this._prompt(`🏁 挑戰賽！${p.name} vs ${owner.name}，在「${t.name}」跑 1 圈，地主 Lv.${t.level} 有起步優勢`, [], p);
    setTimeout(() => {
      this.root.classList.add('hidden');
      this.active = false;
      this.api.startChallenge({ trackId: t.trackId, challenger: p, owner, level: t.level }, (challengerWon) => {
        this.resume();
        settle(challengerWon);
      });
    }, 1500);
  }

  // ---------------------------------------------------------------
  // 電腦的決定
  // ---------------------------------------------------------------
  _aiShouldBuy(p, t) { return p.coins - t.price >= 250 || (p.coins - t.price >= 0 && Math.random() < 0.35); }
  _aiShouldUpgrade(p, t) { return p.coins - this._upgradeCost(t) >= 350; }
  _aiShouldChallenge(p, owner, t, toll) {
    // 過路費越貴越想挑戰；地主等級越高越怕
    const risk = toll * 2 <= p.coins;
    return risk && Math.random() < 0.65 - t.level * 0.12 + Math.min(0.25, toll / 800);
  }

  // ---------------------------------------------------------------
  // 結束：總資產排名
  // ---------------------------------------------------------------
  _endGame() {
    this.active = false;
    clearTimeout(this.aiTimer);
    this._clearButtons();
    const ranking = [...this.players].sort((a, b) => this.netWorth(b) - this.netWorth(a));
    const medals = ['🥇', '🥈', '🥉', '4️⃣'];
    this.endEl.innerHTML = `
      <div class="ty-end-card">
        <div class="title-badge">🎲 大亨賽車結束</div>
        <h1 class="game-title">${ranking[0].name} 成為積木大亨！</h1>
        <div class="ty-rank">${ranking.map((p, k) => `
          <div class="ty-rank-row ${p.isHuman ? 'me' : ''}" style="--pc:${p.color}">
            <span>${medals[k]} ${p.name}</span>
            <span>🪙${p.coins}　🏠${this.tiles.filter((t) => t.owner === p.idx).length} 塊地</span>
            <strong>總資產 ${this.netWorth(p)}</strong>
          </div>`).join('')}</div>
        <div class="finish-buttons">
          <button class="primary-btn" data-ty="again">再玩一盤</button>
          <button class="secondary-btn" data-ty="exit">返回大廳</button>
        </div>
      </div>`;
    this.endEl.classList.remove('hidden');
    this.root.classList.add('hidden');
    const best = Math.min(...ranking.map((p, k) => (p.isHuman ? k + 1 : 9)));
    this.api.audio.playVictory(best > 4 ? 4 : best);
    this.endEl.querySelector('[data-ty=again]').onclick = () => this.start(this.setup);
    this.endEl.querySelector('[data-ty=exit]').onclick = () => { this.stop(); this.api.exit(); };
  }

  // ---------------------------------------------------------------
  // 畫面（HTML）
  // ---------------------------------------------------------------
  _buildUI() {
    const root = document.createElement('div');
    root.id = 'tycoon-ui';
    root.className = 'hidden';
    root.innerHTML = `
      <div class="ty-players"></div>
      <div class="ty-log"></div>
      <div class="ty-dice hidden"><div class="ty-die"></div><div class="ty-die"></div></div>
      <div class="ty-card hidden"></div>
      <div class="ty-panel">
        <div class="ty-msg"></div>
        <div class="ty-btns"></div>
      </div>
      <button class="ty-quit" title="離開大亨賽車">🏠</button>`;
    document.getElementById('game-container').appendChild(root);
    this.root = root;
    this.playersEl = root.querySelector('.ty-players');
    this.logEl = root.querySelector('.ty-log');
    this.diceEl = root.querySelector('.ty-dice');
    this.cardEl = root.querySelector('.ty-card');
    this.msgEl = root.querySelector('.ty-msg');
    this.btnsEl = root.querySelector('.ty-btns');
    root.querySelector('.ty-quit').onclick = () => {
      if (window.confirm('要離開這盤大亨賽車回到大廳嗎？')) { this.stop(); this.api.exit(); }
    };
    const end = document.createElement('div');
    end.id = 'tycoon-end';
    end.className = 'overlay hidden';
    document.getElementById('game-container').appendChild(end);
    this.endEl = end;
  }

  _renderPlayers() {
    if (!this.players) return;
    this.playersEl.innerHTML = this.players.map((p) => {
      const lands = this.tiles.filter((t) => t.owner === p.idx).length;
      const drv = DRIVER_PRESETS[p.driverId];
      return `<div class="ty-pl ${p.idx === this.turn ? 'now' : ''} ${p.out ? 'out' : ''}" style="--pc:${p.color}">
        <span class="ty-ic">${drv ? drv.icon : '🏎️'}</span>
        <span class="ty-nm">${p.name}${p.isHuman ? '' : ' 🤖'}</span>
        <span class="ty-co">🪙${p.coins}</span>
        <span class="ty-ld">🏠${lands}${p.skip ? ' 💤' : ''}</span>
      </div>`;
    }).join('') + `<div class="ty-round">第 ${Math.min(this.round, this.rounds)} / ${this.rounds} 回合</div>`;
  }

  _log(text) {
    const line = document.createElement('div');
    line.textContent = text;
    this.logEl.prepend(line);
    while (this.logEl.children.length > 4) this.logEl.lastChild.remove();
  }

  _clearButtons() {
    clearTimeout(this.aiTimer);
    this.btnsEl.innerHTML = '';
  }

  // 顯示訊息與按鈕；電腦玩家會自動選（aiChoice 回傳 true = 選第一個）
  _prompt(text, buttons, p, autoDelay = 0, aiChoice = null) {
    this._clearButtons();
    this.msgEl.textContent = text;
    this.msgEl.style.setProperty('--pc', p ? p.color : '#fff');
    if (!buttons.length) return;
    if (p && !p.isHuman) {
      this.btnsEl.innerHTML = '<span class="ty-thinking">🤖 思考中…</span>';
      this.aiTimer = setTimeout(() => {
        const pickFirst = aiChoice ? aiChoice() : true;
        const b = pickFirst ? buttons[0] : buttons[1] || buttons[0];
        this._clearButtons();
        b.fn();
      }, 600 + autoDelay * 0.4);
      return;
    }
    if (autoDelay > 0 && buttons.length === 1) {
      // 人類玩家：回合結束自動進下一位，也可以按按鈕立刻跳過
      this.aiTimer = setTimeout(() => { if (this.btnsEl.contains(el)) { this._clearButtons(); buttons[0].fn(); } }, 1600 + autoDelay);
    }
    let el = null;
    for (const b of buttons) {
      const btn = document.createElement('button');
      btn.className = b.primary ? 'primary-btn' : 'secondary-btn';
      btn.textContent = b.label;
      btn.onclick = () => { this._clearButtons(); b.fn(); };
      this.btnsEl.appendChild(btn);
      if (!el) el = btn;
    }
  }

  _onKey(e) {
    if (!this.active || this.root.classList.contains('hidden')) return;
    const btns = [...this.btnsEl.querySelectorAll('button')];
    if (!btns.length) return;
    if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); (btns.find((b) => b.classList.contains('gp-focus')) || btns[0]).click(); }
    else if ((e.code === 'Escape' || e.code === 'Backspace') && btns[1]) { e.preventDefault(); btns[1].click(); }
  }

  get navRoot() { return this.active && !this.root.classList.contains('hidden') ? this.btnsEl : (!this.endEl.classList.contains('hidden') ? this.endEl : null); }

  _showDice(d1, d2, done) {
    const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    const dice = this.diceEl.querySelectorAll('.ty-die');
    this.diceEl.classList.remove('hidden');
    let n = 0;
    const spin = setInterval(() => {
      dice[0].textContent = faces[1 + Math.floor(Math.random() * 6)];
      dice[1].textContent = faces[1 + Math.floor(Math.random() * 6)];
      this.api.audio.playBeep(380 + Math.random() * 200, 0.03, 0.04);
      if (++n > 11) {
        clearInterval(spin);
        dice[0].textContent = faces[d1];
        dice[1].textContent = faces[d2];
        this.diceEl.classList.add('land');
        this.api.audio.playCountdown(2);
        setTimeout(() => {
          this.diceEl.classList.add('hidden');
          this.diceEl.classList.remove('land');
          done();
        }, 750);
      }
    }, 70);
  }

  _showCard(c, done) {
    this.cardEl.innerHTML = `<div class="ty-card-ic">${c.icon}</div><div class="ty-card-t">${c.title}</div><div class="ty-card-x">${c.text}</div>`;
    this.cardEl.classList.remove('hidden');
    this.cardEl.classList.remove('pop');
    void this.cardEl.offsetWidth;
    this.cardEl.classList.add('pop');
    setTimeout(() => { this.cardEl.classList.add('hidden'); done(); }, 1900);
  }

  // 棋子上方飄出的文字
  _float(p, text, color) {
    if (!p || !p.token) return;
    const v = p.token.position.clone();
    v.y += 7;
    v.project(this.camera);
    const el = document.createElement('div');
    el.className = 'ty-float';
    el.textContent = text;
    el.style.color = color;
    el.style.left = `${(v.x * 0.5 + 0.5) * 100}%`;
    el.style.top = `${(-v.y * 0.5 + 0.5) * 100}%`;
    this.root.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }

  _dispose(obj) {
    obj.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
    });
  }
}

