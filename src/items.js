import * as THREE from 'three';

export const ITEM_TYPES = {
  nitro: { id: 'nitro', name: '黃金氮氣', icon: '⚡', color: '#ff9500' },
  missile: { id: 'missile', name: '追蹤飛彈', icon: '🚀', color: '#ff3b30' },
  banana: { id: 'banana', name: '香蕉皮', icon: '🍌', color: '#ffdd00' },
  waterbomb: { id: 'waterbomb', name: '水炸彈', icon: '💧', color: '#00b4ff' },
  shield: { id: 'shield', name: '天使護盾', icon: '🛡️', color: '#38ef7d' },
  magnet: { id: 'magnet', name: '超級磁鐵', icon: '🧲', color: '#ff2a9d' },
  lightning: { id: 'lightning', name: '天雷閃電', icon: '🌩️', color: '#ffea00' },
  freeze: { id: 'freeze', name: '時間凍結', icon: '❄️', color: '#7dd3fc' },
  turbo_tire: { id: 'turbo_tire', name: '黃金輪胎', icon: '🛞', color: '#fbbf24' },
  super_engine: { id: 'super_engine', name: '狂暴引擎', icon: '🔥', color: '#fb7185' },
  star: { id: 'star', name: '無敵星星', icon: '⭐', color: '#fde047' },
  devil: { id: 'devil', name: '大魔王顛倒', icon: '😈', color: '#c026d3' },
  squid: { id: 'squid', name: '墨魚噴墨', icon: '🦑', color: '#312e81' },
  mine: { id: 'mine', name: '三連地雷', icon: '💣', color: '#ef4444' },
  tornado: { id: 'tornado', name: '超級龍捲風', icon: '🌪️', color: '#38bdf8' },
  laser: { id: 'laser', name: '雷射炮', icon: '🔫', color: '#ff2a55' },
  cannon: { id: 'cannon', name: '雲端大炮', icon: '💥', color: '#f97316' },
  teleport: { id: 'teleport', name: '空間瞬移', icon: '🌀', color: '#22d3ee' },
  blizzard: { id: 'blizzard', name: '冰風暴法術', icon: '🌨️', color: '#38bdf8' },
  meteor: { id: 'meteor', name: '流星雨法術', icon: '☄️', color: '#ff6b00' },
  dragon: { id: 'dragon', name: '神龍附身', icon: '🐉', color: '#ef4444' },
};

const ITEM_POOL = ['blizzard', 'meteor', 'blizzard', 'meteor', 'cannon', 'teleport', 'laser', 'missile', 'waterbomb', 'devil', 'squid', 'mine', 'tornado', 'banana', 'shield', 'nitro', 'turbo_tire', 'super_engine'];

function createQuestionBoxTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 128, 128);
  grad.addColorStop(0, '#ff3b30');
  grad.addColorStop(0.35, '#ffcc00');
  grad.addColorStop(0.7, '#00e5ff');
  grad.addColorStop(1, '#a855f7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.strokeRect(6, 6, 116, 116);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 84px Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 6;
  ctx.fillText('?', 64, 68);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function attachKartStatusMeshes(kartRoot) {
  const shieldMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.15, 18, 14),
    new THREE.MeshBasicMaterial({ color: 0x38ef7d, transparent: true, opacity: 0.34 })
  );
  shieldMesh.position.set(0, 1.1, 0);
  shieldMesh.visible = false;
  kartRoot.add(shieldMesh);

  const waterMesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.3, 18, 14),
    new THREE.MeshStandardMaterial({
      color: 0x00c8ff,
      emissive: 0x0077cc,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.52,
      roughness: 0.1,
    })
  );
  waterMesh.position.set(0, 1.4, 0);
  waterMesh.visible = false;
  kartRoot.add(waterMesh);

  const freezeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2.8, 4.0),
    new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.55,
      roughness: 0.08,
    })
  );
  freezeMesh.position.set(0, 1.35, 0);
  freezeMesh.visible = false;
  kartRoot.add(freezeMesh);

  const starAura = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.16, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 0.88 })
  );
  starAura.rotation.x = Math.PI / 2;
  starAura.position.set(0, 0.45, 0);
  starAura.visible = false;
  kartRoot.add(starAura);

  // Swirling 3D Blizzard Ice-Crystal Ring for Blizzard Spell!
  const blizzardMesh = new THREE.Group();
  const iceShardMat = new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.88 });
  const frostRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.25, 0.14, 8, 22),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.72 })
  );
  frostRing.rotation.x = Math.PI / 2;
  frostRing.position.y = 1.4;
  blizzardMesh.add(frostRing);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), iceShardMat);
    shard.position.set(Math.cos(a) * 2.15, 1.3 + (i % 2) * 0.7, Math.sin(a) * 2.15);
    blizzardMesh.add(shard);
  }
  blizzardMesh.visible = false;
  kartRoot.add(blizzardMesh);

  return { shieldMesh, waterMesh, freezeMesh, starAura, blizzardMesh };
}

export class ItemManager {
  constructor(scene, audio, spawnParticle, showBannerFor) {
    this.scene = scene;
    this.audio = audio;
    this.spawnParticle = spawnParticle;
    this.showBannerFor = showBannerFor;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.boxTex = createQuestionBoxTexture();
    this.boxes = [];
    this.bananas = [];
    this.mines = [];
    this.tornadoes = [];
    this.lasers = [];
    this.cannons = [];
    this.portals = [];
    this.meteors = [];
    this.missiles = [];
    this.waterBombs = [];
    this.enabled = false;
    this.elapsed = 0;
    this.onRacerHit = null;
  }

  clear() {
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    this.boxes = [];
    this.bananas = [];
    this.mines = [];
    this.tornadoes = [];
    this.lasers = [];
    this.cannons = [];
    this.portals = [];
    this.meteors = [];
    this.missiles = [];
    this.waterBombs = [];
  }

  setupForTrack(track, enabled) {
    this.clear();
    this.enabled = enabled;
    if (!enabled) return;

    const boxGeo = new THREE.BoxGeometry(2.0, 2.0, 2.0);
    const boxMat = new THREE.MeshStandardMaterial({
      map: this.boxTex,
      emissive: 0xffffff,
      emissiveMap: this.boxTex,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    for (const anchor of track.itemBoxAnchors) {
      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.copy(anchor);
      mesh.castShadow = true;
      this.group.add(mesh);
      this.boxes.push({ mesh, baseY: anchor.y, pos: anchor.clone(), respawnTimer: 0 });
    }
  }

  rollRandomItem(rankIndex) {
    // 1st gets traps & pranks; 2nd gets all attack/troll/magic items; 3rd-4th get massive comeback + magic chaos!
    if (rankIndex === 0) {
      const leadingPool = ['blizzard', 'meteor', 'mine', 'banana', 'squid', 'shield', 'devil', 'waterbomb', 'turbo_tire'];
      return leadingPool[Math.floor(Math.random() * leadingPool.length)];
    }
    // 最後一名：35% 機率直接拿到大絕招「神龍附身」，讓落後的人永遠有翻盤機會
    if (rankIndex >= 3 && Math.random() < 0.35) return 'dragon';
    if (rankIndex >= 2) {
      const comebackPool = ['blizzard', 'meteor', 'cannon', 'teleport', 'laser', 'freeze', 'devil', 'tornado', 'star', 'super_engine', 'dragon', 'dragon'];
      return comebackPool[Math.floor(Math.random() * comebackPool.length)];
    }
    return ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
  }

  useItem(racer, racers, track = null) {
    if (!racer.items || racer.items.length === 0) return false;
    const itemId = racer.items.shift();

    if (itemId === 'dragon') {
      // 🐉 落後專用大絕招：神龍附身自動駕駛 3.6 秒、無敵、撞飛路上的對手
      racer.dragonTimer = 3.6;
      racer.starTimer = Math.max(racer.starTimer, 3.6);
      if (racer.isHuman) {
        this.audio.playBoost();
        this.showBannerFor(racer, '🐉 神龍附身！自動駕駛衝衝衝！', '#ffd700', 2.0);
        if (this.onSay) this.onSay(racer, 'dragon');
      }
    } else if (itemId === 'nitro') {
      racer.boostTimer = Math.max(racer.boostTimer, 2.5);
      if (racer.isHuman) {
        this.audio.playBoost();
        this.showBannerFor(racer, '⚡ 黃金氮氣衝刺！', '#ff9500', 1.3);
      }
    } else if (itemId === 'shield') {
      racer.shieldTimer = 4.5;
      if (racer.isHuman) {
        this.audio.playShield();
        this.showBannerFor(racer, '🛡️ 天使護盾啟動！', '#38ef7d', 1.2);
      }
    } else if (itemId === 'banana') {
      this._spawnBanana(racer);
      if (racer.isHuman) {
        this.audio.playBeep(440, 0.12, 0.12);
        this.showBannerFor(racer, '🍌 丟出香蕉皮！', '#ffdd00', 1.0);
      }
    } else if (itemId === 'missile') {
      this._spawnMissile(racer, racers);
      if (racer.isHuman) {
        this.audio.playMissileLaunch();
        this.showBannerFor(racer, '🚀 追蹤飛彈發射！', '#ff3b30', 1.2);
      }
    } else if (itemId === 'waterbomb') {
      this._spawnWaterBomb(racer);
      if (racer.isHuman) {
        this.audio.playSplash();
        this.showBannerFor(racer, '💧 水炸彈投擲！', '#00c8ff', 1.2);
      }
    } else if (itemId === 'magnet') {
      // Lock onto closest racer ahead and pull strongly!
      let target = null;
      let bestAhead = Infinity;
      for (const other of racers) {
        if (other === racer || other.finished) continue;
        const diff = other.totalProgress - racer.totalProgress;
        if (diff > 0 && diff < bestAhead) {
          bestAhead = diff;
          target = other;
        }
      }
      racer.magnetTimer = 2.6;
      racer.magnetTarget = target;
      racer.boostTimer = Math.max(racer.boostTimer, 2.2);
      if (racer.isHuman) {
        this.audio.playMagnet();
        this.showBannerFor(racer, target ? `🧲 磁鐵鎖定 ${target.name}！` : '🧲 超級磁力衝刺！', '#ff2a9d', 1.4);
      }
    } else if (itemId === 'lightning') {
      if (racer.isHuman) {
        this.audio.playLightning();
        this.showBannerFor(racer, '🌩️ 天雷閃電！全體劈擊！', '#ffea00', 1.4);
      }
      for (const other of racers) {
        if (other === racer || other.finished) continue;
        if (other.totalProgress >= racer.totalProgress - 0.05) {
          this._hitRacer(other, 'lightning', racer);
        }
      }
    } else if (itemId === 'freeze') {
      // ❄️ TIME FREEZE: Freeze ALL other racers in ice blocks for 3.5 seconds!
      if (racer.isHuman) {
        this.audio.playShield();
        this.showBannerFor(racer, '❄️ 時間凍結！全場對手暫停 3.5 秒！', '#7dd3fc', 1.8);
      }
      for (const other of racers) {
        if (other === racer || other.finished) continue;
        if (other.shieldTimer > 0 || other.starTimer > 0) {
          if (other.shieldTimer > 0) other.shieldTimer = 0;
          if (other.isHuman) this.showBannerFor(other, '🛡️ 免疫時間凍結！', '#38ef7d', 1.1);
        } else {
          other.freezeTimer = racer.isHuman ? 3.5 : 1.6;
          other.speed = 0;
          if (other.isHuman) this.showBannerFor(other, '❄️ 時間被凍結了！', '#7dd3fc', 1.5);
        }
      }
    } else if (itemId === 'turbo_tire') {
      // 🛞 GOLDEN TURBO TIRES: +10 speed, ultra drift grip & zero grass slowdown for 8s!
      racer.tireBuffTimer = 8.0;
      if (racer.isHuman) {
        this.audio.playBoost();
        this.showBannerFor(racer, '🛞 黃金超跑輪胎！抓地與極速強化 8 秒！', '#fbbf24', 1.5);
      }
    } else if (itemId === 'super_engine') {
      // 🔥 V8 OVERDRIVE ENGINE: +15 top speed & huge acceleration for 8s!
      racer.engineBuffTimer = 8.0;
      if (racer.isHuman) {
        this.audio.playBoost();
        this.showBannerFor(racer, '🔥 狂暴 V8 引擎！極速飆升 8 秒！', '#fb7185', 1.5);
      }
    } else if (itemId === 'star') {
      // ⭐ INVINCIBLE STAR: 6s speed + immunity + knock opponents spinning on contact!
      racer.starTimer = 6.0;
      racer.boostTimer = Math.max(racer.boostTimer, 2.0);
      if (racer.isHuman) {
        this.audio.playBoost();
        this.audio.playLapChime();
        this.showBannerFor(racer, '⭐ 無敵星星！6 秒無敵撞飛對手！', '#fde047', 1.6);
      }
    } else if (itemId === 'devil') {
      // 😈 RED DEVIL: Invert left/right steering of all other racers for 4.5s!
      if (racer.isHuman) {
        this.audio.playLightning();
        this.showBannerFor(racer, '😈 施放大魔王！全場對手左右顛倒！', '#e879f9', 1.6);
      }
      for (const other of racers) {
        if (other === racer || other.finished) continue;
        if (other.shieldTimer > 0 || other.starTimer > 0) {
          if (other.shieldTimer > 0) other.shieldTimer = 0;
          if (other.isHuman) this.showBannerFor(other, '🛡️ 護盾擋下大魔王！', '#38ef7d', 1.1);
        } else {
          other.devilTimer = 4.5;
          if (other.isHuman) {
            this.audio.playHit();
            this.showBannerFor(other, '😈 中了大魔王！方向鍵左右顛倒！', '#e879f9', 2.0);
          }
        }
      }
    } else if (itemId === 'squid') {
      // 🦑 INK SQUID: Splatter black ink on all opponents' screens for 4.2s!
      if (racer.isHuman) {
        this.audio.playSplash();
        this.showBannerFor(racer, '🦑 墨魚噴墨！遮住全場對手視線！', '#818cf8', 1.5);
      }
      for (const other of racers) {
        if (other === racer || other.finished) continue;
        if (other.shieldTimer > 0 || other.starTimer > 0) {
          if (other.shieldTimer > 0) other.shieldTimer = 0;
        } else {
          other.squidTimer = 4.2;
          if (other.isHuman) {
            this.audio.playSplash();
            this.showBannerFor(other, '🦑 螢幕被噴黑墨了！', '#a5b4fc', 1.5);
          }
        }
      }
    } else if (itemId === 'mine') {
      // 💣 TRIPLE LANDMINES: Drop 3 blinking explosive mines behind your kart!
      this._spawnMines(racer);
      if (racer.isHuman) {
        this.audio.playBeep(360, 0.14, 0.14);
        this.showBannerFor(racer, '💣 佈置三連爆裂地雷！', '#ff4d4d', 1.2);
      }
    } else if (itemId === 'tornado') {
      this._spawnTornado(racer);
      if (racer.isHuman) {
        this.audio.playMissileLaunch();
        this.showBannerFor(racer, '🌪️ 釋放超級龍捲風！捲飛前方對手！', '#38bdf8', 1.3);
      }
    } else if (itemId === 'laser') {
      // 🔫 LASER CANNON: Fires a blazing 3D laser beam that blasts opponent(s) BACKWARDS!
      this._fireLaserCannon(racer, racers, track);
    } else if (itemId === 'cannon') {
      // 💥 GIANT SKY CANNON: Mini-animation loads kart into a giant 3D cannon & blasts into the CLOUDS!
      this._triggerSkyCannon(racer, track);
    } else if (itemId === 'teleport') {
      // 🌀 QUANTUM TELEPORT: Swirling warp portal instantly teleports kart far ahead!
      this._triggerTeleport(racer, track);
    } else if (itemId === 'blizzard') {
      // 🌨️ BLIZZARD MAGIC SPELL: Summons an icy snowstorm that slows ALL other racers!
      if (racer.isHuman) {
        this.audio.playShield();
        this.showBannerFor(racer, '🌨️ 施放冰風暴法術！全場對手結霜減速！', '#38bdf8', 1.7);
      }
      for (const other of racers) {
        if (other === racer || other.finished) continue;
        if (other.starTimer > 0) continue;
        if (other.shieldTimer > 0) {
          other.shieldTimer = 0;
          if (other.isHuman) this.showBannerFor(other, '🛡️ 護盾擋下冰風暴法術！', '#38ef7d', 1.1);
          continue;
        }
        other.blizzardTimer = Math.max(other.blizzardTimer, racer.isHuman ? 4.5 : 2.8);
        other.speed *= 0.68;
        if (this.onRacerHit) this.onRacerHit(other, 'blizzard', racer);
        for (let k = 0; k < 16; k++) {
          this.spawnParticle(
            other.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 4, 2 + Math.random() * 4, (Math.random() - 0.5) * 4)),
            new THREE.Vector3((Math.random() - 0.5) * 10, -3 + Math.random() * 4, (Math.random() - 0.5) * 10),
            k % 2 === 0 ? 0xe0f2fe : 0x38bdf8,
            0.55,
            1.1
          );
        }
        if (other.isHuman) {
          this.audio.playHit();
          this.showBannerFor(other, '🥶 遭遇冰風暴！車速大幅減慢！', '#7dd3fc', 1.8);
        }
      }
    } else if (itemId === 'meteor') {
      // ☄️ METEOR SHOWER MAGIC SPELL: Rains fiery 3D meteors from the sky to slow ALL other racers!
      this._castMeteorShower(racer, racers);
    }
    return true;
  }

  _castMeteorShower(owner, racers) {
    if (owner.isHuman) {
      this.audio.playLightning();
      this.showBannerFor(owner, '☄️ 召喚流星雨法術！火球轟炸全場減速！', '#ff6b00', 1.7);
    }
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x7c2d12,
      emissive: 0xff4500,
      emissiveIntensity: 0.95,
      roughness: 0.6,
    });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 0.55 });

    for (const other of racers) {
      if (other === owner || other.finished) continue;
      // Spawn 3 staggered fiery meteors streaking down from the sky onto each opponent!
      for (let m = 0; m < 3; m++) {
        const g = new THREE.Group();
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.45, 0), coreMat);
        const halo = new THREE.Mesh(new THREE.SphereGeometry(1.9, 10, 8), glowMat);
        g.add(rock, halo);
        g.visible = false;
        this.group.add(g);

        const offsetX = (Math.random() - 0.5) * 16 + 10;
        const offsetZ = (Math.random() - 0.5) * 16 - 8;
        this.meteors.push({
          mesh: g,
          owner,
          target: other,
          delay: m * 0.28,
          flightTime: 0.62,
          elapsed: 0,
          startOffset: new THREE.Vector3(offsetX, 38, offsetZ),
          isPrimary: m === 0,
        });
      }
    }
  }

  _spawnBanana(owner) {
    const backX = Math.sin(owner.yaw);
    const backZ = Math.cos(owner.yaw);
    const pos = new THREE.Vector3(owner.pos.x + backX * 3.4, owner.pos.y + 0.55, owner.pos.z + backZ * 3.4);

    const g = new THREE.Group();
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.75, 1.15, 7),
      new THREE.MeshStandardMaterial({ color: 0xffdd00, roughness: 0.3 })
    );
    const tip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.16, 0.25, 6),
      new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 })
    );
    tip.position.y = 0.62;
    g.add(cone, tip);
    g.position.copy(pos);
    g.castShadow = true;
    this.group.add(g);

    this.bananas.push({ mesh: g, pos, owner, grace: 0.6, life: 25 });
  }

  _spawnMines(owner) {
    const backX = Math.sin(owner.yaw);
    const backZ = Math.cos(owner.yaw);
    const rightX = Math.cos(owner.yaw);
    const rightZ = -Math.sin(owner.yaw);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.4, metalness: 0.5 });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });

    for (const lat of [-2.8, 0, 2.8]) {
      const pos = new THREE.Vector3(
        owner.pos.x + backX * 3.8 + rightX * lat,
        owner.pos.y + 0.3,
        owner.pos.z + backZ * 3.8 + rightZ * lat
      );
      const g = new THREE.Group();
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.1, 0.42, 12), bodyMat);
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), ledMat);
      led.position.y = 0.28;
      g.add(disc, led);
      g.position.copy(pos);
      this.group.add(g);
      this.mines.push({ mesh: g, led, pos, owner, grace: 0.7, life: 28 });
    }
  }

  _spawnTornado(owner) {
    const fwdX = -Math.sin(owner.yaw);
    const fwdZ = -Math.cos(owner.yaw);
    const pos = new THREE.Vector3(owner.pos.x + fwdX * 4.0, owner.pos.y, owner.pos.z + fwdZ * 4.0);
    const g = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.72 });
    for (let k = 0; k < 5; k++) {
      const r = 0.7 + k * 0.48;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.22, 8, 16), ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.7 + k * 1.05;
      g.add(ring);
    }
    g.position.copy(pos);
    this.group.add(g);
    this.tornadoes.push({ mesh: g, pos, yaw: owner.yaw, owner, speed: 78, life: 3.6 });
  }

  _fireLaserCannon(owner, racers, track) {
    const fwdX = -Math.sin(owner.yaw);
    const fwdZ = -Math.cos(owner.yaw);
    const beamLen = 90;

    // 3D Glowing Red/White Laser Beam Cylinder!
    const beamGroup = new THREE.Group();
    const outerBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, beamLen, 10),
      new THREE.MeshBasicMaterial({ color: 0xff1744, transparent: true, opacity: 0.82 })
    );
    outerBeam.rotation.x = Math.PI / 2;
    outerBeam.position.z = -beamLen / 2 - 1.5;
    const innerBeam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, beamLen, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.96 })
    );
    innerBeam.rotation.x = Math.PI / 2;
    innerBeam.position.z = -beamLen / 2 - 1.5;
    beamGroup.add(outerBeam, innerBeam);
    beamGroup.position.set(owner.pos.x, owner.pos.y + 1.25, owner.pos.z);
    beamGroup.rotation.y = owner.yaw;
    this.group.add(beamGroup);
    this.lasers.push({ mesh: beamGroup, life: 0.45, maxLife: 0.45 });

    if (owner.isHuman) {
      this.audio.playLightning();
    }

    // Find opponents in front cone OR closest opponent ahead within 95m and BLAST them BACKWARDS!
    let hitCount = 0;
    for (const r of racers) {
      if (r === owner || r.finished) continue;
      const dx = r.pos.x - owner.pos.x;
      const dz = r.pos.z - owner.pos.z;
      const dist = Math.hypot(dx, dz);
      const forwardDot = (dx * fwdX + dz * fwdZ) / Math.max(0.001, dist);
      const isAheadOnTrack = r.totalProgress > owner.totalProgress && dist < 95;
      if ((dist < 95 && forwardDot > 0.72) || isAheadOnTrack) {
        if (r.starTimer > 0) continue;
        if (r.shieldTimer > 0) {
          r.shieldTimer = 0;
          if (r.isHuman) this.showBannerFor(r, '🛡️ 護盾擋下雷射炮！', '#38ef7d', 1.2);
          continue;
        }
        hitCount++;
        // Blast opponent BACKWARDS along the track behind the shooter!
        r.spinTimer = 1.4;
        r.velY = 17.5;
        r.speed = -16;
        if (this.onRacerHit) this.onRacerHit(r, 'laser', owner);
        if (track && !track.isBattleArena) {
          const knockIdx = (r.trackIndex - 20 + track.samples) % track.samples;
          const kp = track.points[knockIdx];
          r.pos.set(kp.x, kp.y + 1.0, kp.z);
          r.trackIndex = knockIdx;
          r.trackT = knockIdx / track.samples;
        } else {
          r.pos.x -= fwdX * 26;
          r.pos.z -= fwdZ * 26;
        }
        for (let k = 0; k < 22; k++) {
          this.spawnParticle(
            r.pos.clone().setY(r.pos.y + 1.2),
            new THREE.Vector3((Math.random() - 0.5) * 20, 5 + Math.random() * 10, (Math.random() - 0.5) * 20),
            0xff1744,
            0.55,
            1.4
          );
        }
        if (r.isHuman) {
          this.audio.playHit();
          this.showBannerFor(r, '🔫 被雷射炮炸飛到後面去了！', '#ff1744', 1.6);
        }
      }
    }

    if (owner.isHuman) {
      this.showBannerFor(
        owner,
        hitCount > 0 ? `🔫 雷射炮命中！將 ${hitCount} 位對手炸飛到後面！` : '🔫 雷射炮發射！',
        '#ff2a55',
        1.5
      );
    }
  }

  _triggerSkyCannon(racer, track) {
    if (!track) return;
    if (track.isBattleArena) {
      racer.boostTimer = Math.max(racer.boostTimer, 2.5);
      racer.velY = 18;
      if (racer.isHuman) {
        this.audio.playBoost();
        this.showBannerFor(racer, '💥 大炮衝刺跳躍！', '#f97316', 1.2);
      }
      return;
    }
    // Build Giant 3D LEGO Golden-Black Cannon right at racer's position!
    const cannon = new THREE.Group();
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffc107, roughness: 0.25, metalness: 0.55 });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 });

    // Base carriage
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.1, 3.8), woodMat);
    base.position.y = 0.65;
    // Giant tilted barrel pointing forward & 45° up into the clouds!
    const barrelGroup = new THREE.Group();
    barrelGroup.position.set(0, 1.8, 0);
    barrelGroup.rotation.x = 0.68; // tilted skyward toward -Z
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.75, 5.2, 16), barrelMat);
    barrel.rotation.x = Math.PI / 2;
    const muzzleRing = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.28, 10, 20), goldMat);
    muzzleRing.position.z = -2.55;
    const backCap = new THREE.Mesh(new THREE.SphereGeometry(1.65, 12, 10), goldMat);
    backCap.position.z = 2.5;
    barrelGroup.add(barrel, muzzleRing, backCap);
    cannon.add(base, barrelGroup);

    const exitIdx = (racer.trackIndex + 58) % track.samples;
    const exitPt = track.points[exitIdx];
    const exitTan = track.tangents[exitIdx];
    const flightYaw = Math.atan2(-(exitPt.x - racer.pos.x), -(exitPt.z - racer.pos.z));

    cannon.position.copy(racer.pos);
    cannon.rotation.y = flightYaw;
    this.group.add(cannon);
    this.cannons.push({ mesh: cannon, barrelGroup, life: 2.8, fired: false });

    // Attach 2-phase Cannon State to racer: Phase 1 (0.65s load into barrel) -> Phase 2 (1.85s cloud flight!)
    racer.cannonState = {
      phase: 'loading',
      timer: 0,
      loadDuration: 0.65,
      flyDuration: 1.85,
      cannonMesh: cannon,
      barrelGroup,
      startPos: racer.pos.clone(),
      endPos: exitPt.clone(),
      endIdx: exitIdx,
      endYaw: Math.atan2(-exitTan.x, -exitTan.z),
      flightYaw,
      peakY: Math.max(racer.pos.y, exitPt.y) + 56, // Soar straight up into the clouds!
      crossedFinish: racer.trackIndex + 58 >= track.samples,
    };

    if (racer.isHuman) {
      this.audio.playBeep(440, 0.15, 0.14);
      setTimeout(() => this.audio.playBeep(660, 0.15, 0.14), 200);
      setTimeout(() => this.audio.playBeep(880, 0.18, 0.15), 400);
      this.showBannerFor(racer, '💥 裝填雲端巨炮！準備發射！！', '#f97316', 1.4);
    }
  }

  _spawnPortalRing(pos, yaw, colorHex) {
    const g = new THREE.Group();
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.6, 0.28, 10, 24),
      new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.9 })
    );
    const inner = new THREE.Mesh(
      new THREE.CircleGeometry(2.4, 24),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    g.add(ring1, inner);
    g.position.set(pos.x, pos.y + 2.2, pos.z);
    g.rotation.y = yaw;
    this.group.add(g);
    this.portals.push({ mesh: g, life: 1.1, maxLife: 1.1 });
  }

  _triggerTeleport(racer, track) {
    if (!track) return;
    if (track.isBattleArena) {
      racer.pos.set((Math.random() - 0.5) * 60, 1.5, (Math.random() - 0.5) * 60);
      racer.shieldTimer = Math.max(racer.shieldTimer, 2.0);
      if (racer.isHuman) {
        this.audio.playShield();
        this.showBannerFor(racer, '🌀 空間閃現逃脫！', '#22d3ee', 1.2);
      }
      return;
    }
    // Entry Warp Portal at current position
    this._spawnPortalRing(racer.pos, racer.yaw, 0x00f5ff);

    const exitIdx = (racer.trackIndex + 50) % track.samples;
    const exitPt = track.points[exitIdx];
    const exitTan = track.tangents[exitIdx];
    const exitYaw = Math.atan2(-exitTan.x, -exitTan.z);
    const crossedFinish = racer.trackIndex + 50 >= track.samples;

    // Quantum Teleport State (brief 0.28s warp flash -> instant blink ahead!)
    racer.teleportState = {
      timer: 0,
      duration: 0.28,
      done: false,
      exitPos: exitPt.clone(),
      exitIdx,
      exitYaw,
      crossedFinish,
    };

    if (racer.isHuman) {
      this.audio.playMagnet();
      this.showBannerFor(racer, '🌀 空間傳送門開啟！瞬間移動！', '#22d3ee', 1.4);
    }
  }

  _spawnMissile(owner, racers) {
    let target = null;
    let bestAhead = Infinity;
    for (const r of racers) {
      if (r === owner || r.finished) continue;
      const diff = r.totalProgress - owner.totalProgress;
      if (diff > 0 && diff < bestAhead) {
        bestAhead = diff;
        target = r;
      }
    }
    if (!target) {
      let bestDist = Infinity;
      for (const r of racers) {
        if (r === owner || r.finished) continue;
        const d = r.pos.distanceTo(owner.pos);
        if (d < bestDist) {
          bestDist = d;
          target = r;
        }
      }
    }

    const fwdX = -Math.sin(owner.yaw);
    const fwdZ = -Math.cos(owner.yaw);
    const pos = new THREE.Vector3(owner.pos.x + fwdX * 3.0, owner.pos.y + 1.15, owner.pos.z + fwdZ * 3.0);

    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 1.8, 10),
      new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0x660000, roughness: 0.3 })
    );
    body.rotation.x = Math.PI / 2;
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.34, 0.65, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = -1.2;
    g.add(body, nose);
    g.position.copy(pos);
    this.group.add(g);

    this.missiles.push({ mesh: g, pos, yaw: owner.yaw, owner, target, speed: 92, life: 4.5 });
  }

  _spawnWaterBomb(owner) {
    const fwdX = -Math.sin(owner.yaw);
    const fwdZ = -Math.cos(owner.yaw);
    const pos = new THREE.Vector3(owner.pos.x + fwdX * 3.0, owner.pos.y + 1.6, owner.pos.z + fwdZ * 3.0);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 14, 12),
      new THREE.MeshStandardMaterial({
        color: 0x00c8ff,
        emissive: 0x0077ff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
      })
    );
    mesh.position.copy(pos);
    this.group.add(mesh);

    this.waterBombs.push({ mesh, pos, vel: new THREE.Vector3(fwdX * 72, 12, fwdZ * 72), owner, life: 1.65 });
  }

  _hitRacer(victim, type, attacker = null) {
    if (victim.starTimer > 0) return;
    if (victim.shieldTimer > 0) {
      victim.shieldTimer = 0;
      if (victim.isHuman) {
        this.audio.playShield();
        this.showBannerFor(victim, '🛡️ 護盾擋下攻擊！', '#38ef7d', 1.2);
      }
      for (let i = 0; i < 14; i++) {
        this.spawnParticle(
          victim.pos.clone().setY(1.2),
          new THREE.Vector3((Math.random() - 0.5) * 14, 4 + Math.random() * 6, (Math.random() - 0.5) * 14),
          0x38ef7d,
          0.45,
          1.1
        );
      }
      return;
    }
    if (this.onRacerHit) this.onRacerHit(victim, type, attacker);

    if (type === 'waterbomb') {
      victim.waterTrapTimer = 1.85;
      victim.speed *= 0.2;
      if (victim.isHuman) {
        this.audio.playSplash();
        this.showBannerFor(victim, '💧 被水炸彈困住了！', '#00c8ff', 1.3);
      }
    } else if (type === 'mine' || type === 'tornado') {
      victim.spinTimer = 1.35;
      victim.velY = 16.5;
      victim.speed *= 0.25;
      if (victim.isHuman) {
        this.audio.playHit();
        this.showBannerFor(victim, type === 'mine' ? '💣 踩到地雷炸飛啦！' : '🌪️ 被龍捲風捲上天啦！', '#ff3b30', 1.5);
      }
    } else {
      victim.spinTimer = 1.1;
      victim.speed *= 0.32;
      if (victim.isHuman) {
        this.audio.playHit();
        this.showBannerFor(victim, type === 'banana' ? '🍌 踩到香蕉皮打滑！' : type === 'lightning' ? '🌩️ 被閃電劈中！' : '💥 被飛彈擊中！', '#ff3b30', 1.3);
      }
    }

    const burstColor = type === 'waterbomb' ? 0x00d8ff : type === 'banana' ? 0xffdd00 : 0xff5500;
    for (let i = 0; i < 18; i++) {
      this.spawnParticle(
        victim.pos.clone().setY(1.2),
        new THREE.Vector3((Math.random() - 0.5) * 16, 4 + Math.random() * 8, (Math.random() - 0.5) * 16),
        burstColor,
        0.5,
        1.2
      );
    }
  }

  update(dt, racers, sortedRacers) {
    if (!this.enabled) return;
    this.elapsed += dt;

    for (const box of this.boxes) {
      if (box.respawnTimer > 0) {
        box.respawnTimer -= dt;
        if (box.respawnTimer <= 0) box.mesh.visible = true;
        continue;
      }
      box.mesh.rotation.y += dt * 2.1;
      box.mesh.rotation.x = Math.sin(this.elapsed * 2.5) * 0.25;
      box.mesh.position.y = box.baseY + Math.sin(this.elapsed * 3.2 + box.pos.x) * 0.28;

      for (const r of racers) {
        if (r.finished) continue;
        const dx = r.pos.x - box.pos.x;
        const dz = r.pos.z - box.pos.z;
        if (dx * dx + dz * dz < 6.8) {
          box.mesh.visible = false;
          box.respawnTimer = 5.0;
          if (r.items.length < 2) {
            const rankIdx = Math.max(0, sortedRacers.indexOf(r));
            const picked = this.rollRandomItem(rankIdx);
            r.items.push(picked);
            if (r.isHuman) {
              this.audio.playItemPickup();
              const info = ITEM_TYPES[picked];
              this.showBannerFor(r, `獲得 ${info.icon} ${info.name}`, info.color, 1.15);
            }
          }
          break;
        }
      }
    }

    for (let i = this.bananas.length - 1; i >= 0; i--) {
      const b = this.bananas[i];
      b.life -= dt;
      if (b.grace > 0) b.grace -= dt;
      b.mesh.rotation.y += dt * 1.5;

      let hit = false;
      for (const r of racers) {
        if (r === b.owner && b.grace > 0) continue;
        const dx = r.pos.x - b.pos.x;
        const dz = r.pos.z - b.pos.z;
        if (dx * dx + dz * dz < 4.4) {
          this._hitRacer(r, 'banana', b.owner);
          hit = true;
          break;
        }
      }
      if (hit || b.life <= 0) {
        this.group.remove(b.mesh);
        this.bananas.splice(i, 1);
      }
    }

    // 2.5 Update Landmines
    for (let i = this.mines.length - 1; i >= 0; i--) {
      const mn = this.mines[i];
      mn.life -= dt;
      if (mn.grace > 0) mn.grace -= dt;
      mn.led.visible = Math.floor(this.elapsed * 8 + i) % 2 === 0;
      let hit = false;
      for (const r of racers) {
        if (r === mn.owner && mn.grace > 0) continue;
        const dx = r.pos.x - mn.pos.x;
        const dz = r.pos.z - mn.pos.z;
        if (dx * dx + dz * dz < 6.2) {
          this._hitRacer(r, 'mine', mn.owner);
          hit = true;
          break;
        }
      }
      if (hit || mn.life <= 0) {
        this.group.remove(mn.mesh);
        this.mines.splice(i, 1);
      }
    }

    // 2.6 Update Tornadoes
    for (let i = this.tornadoes.length - 1; i >= 0; i--) {
      const td = this.tornadoes[i];
      td.life -= dt;
      const fwdX = -Math.sin(td.yaw);
      const fwdZ = -Math.cos(td.yaw);
      td.pos.x += fwdX * td.speed * dt;
      td.pos.z += fwdZ * td.speed * dt;
      td.mesh.position.copy(td.pos);
      td.mesh.rotation.y += dt * 11;

      for (const r of racers) {
        if (r === td.owner || r.spinTimer > 0) continue;
        const dx = r.pos.x - td.pos.x;
        const dz = r.pos.z - td.pos.z;
        if (dx * dx + dz * dz < 14.0) {
          this._hitRacer(r, 'tornado', td.owner);
        }
      }
      if (td.life <= 0) {
        this.group.remove(td.mesh);
        this.tornadoes.splice(i, 1);
      }
    }

    // 2.7 Update Laser Beams
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const ls = this.lasers[i];
      ls.life -= dt;
      const ratio = Math.max(0, ls.life / ls.maxLife);
      ls.mesh.scale.set(ratio * 1.4, ratio * 1.4, 1);
      if (ls.life <= 0) {
        this.group.remove(ls.mesh);
        this.lasers.splice(i, 1);
      }
    }

    // 2.8 Update Giant Cannons & Warp Portals
    for (let i = this.cannons.length - 1; i >= 0; i--) {
      const cn = this.cannons[i];
      cn.life -= dt;
      if (cn.life <= 0) {
        this.group.remove(cn.mesh);
        this.cannons.splice(i, 1);
      }
    }
    for (let i = this.portals.length - 1; i >= 0; i--) {
      const pt = this.portals[i];
      pt.life -= dt;
      const ratio = Math.max(0.01, pt.life / pt.maxLife);
      pt.mesh.rotation.z += dt * 9;
      pt.mesh.scale.setScalar(ratio);
      if (pt.life <= 0) {
        this.group.remove(pt.mesh);
        this.portals.splice(i, 1);
      }
    }

    for (let i = this.missiles.length - 1; i >= 0; i--) {
      const m = this.missiles[i];
      m.life -= dt;
      if (m.target && !m.target.finished) {
        const dx = m.target.pos.x - m.pos.x;
        const dz = m.target.pos.z - m.pos.z;
        const desiredYaw = Math.atan2(-dx, -dz);
        let diff = desiredYaw - m.yaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        m.yaw += THREE.MathUtils.clamp(diff, -4.5 * dt, 4.5 * dt);
      }

      const fwdX = -Math.sin(m.yaw);
      const fwdZ = -Math.cos(m.yaw);
      m.pos.x += fwdX * m.speed * dt;
      m.pos.z += fwdZ * m.speed * dt;
      m.mesh.position.copy(m.pos);
      m.mesh.rotation.y = m.yaw;

      this.spawnParticle(m.pos.clone(), new THREE.Vector3(-fwdX * 5, 1.5, -fwdZ * 5), 0xff8800, 0.22, 0.7);

      let hit = false;
      for (const r of racers) {
        if (r === m.owner) continue;
        const dx = r.pos.x - m.pos.x;
        const dz = r.pos.z - m.pos.z;
        if (dx * dx + dz * dz < 6.0) {
          this._hitRacer(r, 'missile', m.owner);
          hit = true;
          break;
        }
      }
      if (hit || m.life <= 0) {
        this.group.remove(m.mesh);
        this.missiles.splice(i, 1);
      }
    }

    for (let i = this.waterBombs.length - 1; i >= 0; i--) {
      const w = this.waterBombs[i];
      w.life -= dt;
      w.vel.y -= 26 * dt;
      w.pos.addScaledVector(w.vel, dt);
      if (w.pos.y < 0.9) {
        w.pos.y = 0.9;
        w.vel.y = 0;
        w.life = 0;
      }
      w.mesh.position.copy(w.pos);

      let exploded = w.life <= 0;
      if (!exploded) {
        for (const r of racers) {
          if (r === w.owner) continue;
          const dx = r.pos.x - w.pos.x;
          const dz = r.pos.z - w.pos.z;
          if (dx * dx + dz * dz < 6.5) {
            exploded = true;
            break;
          }
        }
      }

      if (exploded) {
        for (const r of racers) {
          if (r === w.owner) continue;
          const dx = r.pos.x - w.pos.x;
          const dz = r.pos.z - w.pos.z;
          if (dx * dx + dz * dz < 110) this._hitRacer(r, 'waterbomb', w.owner);
        }
        for (let k = 0; k < 16; k++) {
          this.spawnParticle(
            w.pos.clone(),
            new THREE.Vector3((Math.random() - 0.5) * 18, 4 + Math.random() * 8, (Math.random() - 0.5) * 18),
            0x00d8ff,
            0.45,
            1.3
          );
        }
        this.group.remove(w.mesh);
        this.waterBombs.splice(i, 1);
      }
    }

    // Update falling 3D Meteor Shower spells!
    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];
      if (m.delay > 0) {
        m.delay -= dt;
        continue;
      }
      m.mesh.visible = true;
      m.elapsed += dt;
      const f = Math.min(1, m.elapsed / m.flightTime);
      const targetPos = m.target.pos;
      const curPos = new THREE.Vector3(
        targetPos.x + m.startOffset.x * (1 - f),
        targetPos.y + 1.0 + m.startOffset.y * (1 - f),
        targetPos.z + m.startOffset.z * (1 - f)
      );
      m.mesh.position.copy(curPos);
      m.mesh.rotation.x += dt * 7;
      m.mesh.rotation.z += dt * 5;

      // Fiery meteor trail
      this.spawnParticle(
        curPos.clone(),
        new THREE.Vector3((Math.random() - 0.5) * 5, 2 + Math.random() * 3, (Math.random() - 0.5) * 5),
        Math.random() > 0.4 ? 0xff5500 : 0xffdd00,
        0.32,
        1.15
      );

      if (f >= 1) {
        // Meteor impact explosion!
        for (let k = 0; k < 16; k++) {
          this.spawnParticle(
            targetPos.clone().add(new THREE.Vector3(0, 1.0, 0)),
            new THREE.Vector3((Math.random() - 0.5) * 20, 4 + Math.random() * 9, (Math.random() - 0.5) * 20),
            k % 2 === 0 ? 0xff4500 : 0xffdd00,
            0.48,
            1.35
          );
        }
        if (m.isPrimary && !m.target.finished) {
          if (m.target.starTimer > 0) {
            // Immune
          } else if (m.target.shieldTimer > 0) {
            m.target.shieldTimer = 0;
            if (m.target.isHuman) this.showBannerFor(m.target, '🛡️ 護盾擋下流星雨！', '#38ef7d', 1.1);
          } else {
            m.target.meteorSlowTimer = Math.max(m.target.meteorSlowTimer, m.owner.isHuman ? 4.2 : 2.6);
            m.target.speed *= 0.62;
            if (this.onRacerHit) this.onRacerHit(m.target, 'meteor', m.owner);
            if (m.target.isHuman) {
              this.audio.playHit();
              this.showBannerFor(m.target, '☄️ 被流星雨擊中！車速大幅減慢！', '#ff6b00', 1.8);
            }
          }
        }
        this.group.remove(m.mesh);
        this.meteors.splice(i, 1);
      }
    }
  }
}
