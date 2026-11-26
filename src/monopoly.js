// 🎲 大富翁搶地地圖模式（直接串接原版 12 張真實 3D 卡丁車賽道：贏家才能買地！）
export const MONOPOLY_TILES = [
  { id: 0,  r: 0, c: 0, type: 'start',    name: '起點發財',   icon: '🏁', color: '#22c55e', price: 0,   rent: 0 },
  { id: 1,  r: 0, c: 1, type: 'property', trackId: 'village', name: '積木城鎮', icon: '🌲', color: '#84cc16', price: 200, rent: 65 },
  { id: 2,  r: 0, c: 2, type: 'property', trackId: 'desert',  name: '黃金沙漠', icon: '🏜️', color: '#f59e0b', price: 240, rent: 80 },
  { id: 3,  r: 0, c: 3, type: 'property', trackId: 'neon',    name: '霓虹夜市', icon: '🌃', color: '#a855f7', price: 280, rent: 95 },
  { id: 4,  r: 0, c: 4, type: 'card',     name: '道具卡站',   icon: '🃏', color: '#ec4899', price: 0,   rent: 0 },
  { id: 5,  r: 1, c: 4, type: 'property', trackId: 'ice',     name: '極地冰原', icon: '❄️', color: '#38bdf8', price: 320, rent: 110 },
  { id: 6,  r: 2, c: 4, type: 'property', trackId: 'beach',   name: '熱帶海島', icon: '🏖️', color: '#06b6d4', price: 360, rent: 125 },
  { id: 7,  r: 3, c: 4, type: 'property', trackId: 'sakura',  name: '櫻花大道', icon: '🌸', color: '#f472b6', price: 400, rent: 145 },
  { id: 8,  r: 4, c: 4, type: 'parking',  name: '補血加氣',   icon: '⚡', color: '#0ea5e9', price: 0,   rent: 0 },
  { id: 9,  r: 4, c: 3, type: 'property', trackId: 'volcano', name: '熔岩火山', icon: '🌋', color: '#ef4444', price: 440, rent: 165 },
  { id: 10, r: 4, c: 2, type: 'property', trackId: 'rainbow', name: '彩虹星空', icon: '🌈', color: '#8b5cf6', price: 480, rent: 185 },
  { id: 11, r: 4, c: 1, type: 'property', trackId: 'island',  name: '海島冒險', icon: '🏝️', color: '#14b8a6', price: 520, rent: 205 },
  { id: 12, r: 4, c: 0, type: 'chance',   name: '機會命運',   icon: '❓', color: '#f43f5e', price: 0,   rent: 0 },
  { id: 13, r: 3, c: 0, type: 'property', trackId: 'candy',   name: '糖果王國', icon: '🍬', color: '#f472b6', price: 560, rent: 225 },
  { id: 14, r: 2, c: 0, type: 'property', trackId: 'dino',    name: '恐龍侏羅紀', icon: '🦖', color: '#16a34a', price: 620, rent: 255 },
  { id: 15, r: 1, c: 0, type: 'property', trackId: 'sky',     name: '雲端天國', icon: '☁️', color: '#fbbf24', price: 700, rent: 300 },
];

const MONO_CARDS = [
  { id: 'remote',   name: '🎯 遙控骰子',   desc: '指定走 1～6 步！' },
  { id: 'missile',  name: '🚀 飛彈炸房子', desc: '炸毀對手最高級建築 -1 級！' },
  { id: 'blizzard', name: '🌨️ 冰風暴凍結', desc: '冰凍第一名對手跳過 1 回合！' },
  { id: 'double',   name: '🧧 財神雙倍租', desc: '下次收過路費直接變 2 倍！' },
  { id: 'build',    name: '🏗️ 免費蓋樓卡', desc: '免費升級自己一塊地 +1 級！' },
];

const MONO_CHANCES = [
  { icon: '💰', title: '樂高大樂透！', desc: '恭喜中獎 +$280！', fn: (p) => { p.money += 280; } },
  { icon: '🦖', title: '暴龍踩扁車庫！', desc: '緊急修車 -$130！', fn: (p) => { p.money = Math.max(0, p.money - 130); } },
  { icon: '🎁', title: '全場粉絲打賞！', desc: '其他玩家每人送你 $70！', fn: (p, all) => { for (const o of all) if (o !== p) { const v = Math.min(o.money, 70); o.money -= v; p.money += v; } } },
  { icon: '🚀', title: '傳送門飛回起點！', desc: '直飛起點領獎金 +$300！', fn: (p) => { p.tile = 0; p.money += 300; } },
];

const MONO_COLORS = ['#fbbf24', '#00e5ff', '#ff4d4d', '#c084fc'];

export class MonopolyController {
  constructor(hooks) {
    this.hooks = hooks; // { audio, launchTrackRace, onExitToLobby, onAwardGarageCoins }
    this.screenEl = document.getElementById('monopoly-screen');
    this.gridEl = document.getElementById('mono-board-grid');
    this.playersEl = document.getElementById('mono-players-bar');
    this.roundEl = document.getElementById('mono-round-tag');
    this.centerEl = document.getElementById('mono-center-box');
    this.exitBtn = document.getElementById('mono-exit-btn');
    this.finishNowBtn = document.getElementById('mono-finish-btn');

    this.active = false;
    this.maxRounds = 8;
    this.round = 1;
    this.turnIdx = 0;
    this.busy = false;
    this.players = [];
    this.props = new Map(); // tileId -> { ownerIdx, level }
    this.pendingRace = null;

    if (this.exitBtn) this.exitBtn.addEventListener('click', () => this.closeToLobby());
    if (this.finishNowBtn) this.finishNowBtn.addEventListener('click', () => this.finishGame());
  }

  startNew(roster) {
    // roster: [{ name, isHuman, slotIndex }] (4 players matching 1P or 2P lobby setup!)
    this.active = true;
    this.round = 1;
    this.turnIdx = 0;
    this.busy = false;
    this.props.clear();
    this.pendingRace = null;

    this.players = roster.map((r, i) => ({
      idx: i,
      name: r.name,
      isHuman: r.isHuman,
      color: MONO_COLORS[i % MONO_COLORS.length],
      icon: ['🏎️', '⚡', '🔥', '👾'][i % 4],
      money: 1500,
      tile: 0,
      frozen: 0,
      doubleRent: false,
      cards: [MONO_CARDS[i % MONO_CARDS.length]],
    }));

    this.screenEl.classList.remove('hidden');
    this._renderAll();
    this._beginTurn();
  }

  closeToLobby() {
    this.active = false;
    this.screenEl.classList.add('hidden');
    if (this.hooks.onExitToLobby) this.hooks.onExitToLobby();
  }

  _netWorth(p) {
    let val = 0;
    for (const [tid, info] of this.props.entries()) {
      if (info.ownerIdx === p.idx) {
        const t = MONOPOLY_TILES[tid];
        val += t.price + (info.level - 1) * Math.round(t.price * 0.5);
      }
    }
    return p.money + val;
  }

  _calcRent(tile, level) {
    return Math.round(tile.rent * (1 + (level - 1) * 0.85));
  }

  _renderAll() {
    if (!this.gridEl) return;
    this.roundEl.textContent = `🎲 第 ${this.round} / ${this.maxRounds} 回合`;

    // Players wealth bar
    this.playersEl.innerHTML = this.players.map((p, i) => {
      let lands = 0;
      for (const info of this.props.values()) if (info.ownerIdx === i) lands++;
      return `<div class="mono-p-chip ${i === this.turnIdx ? 'active' : ''}" style="--pc:${p.color}">
        <span class="mono-dot" style="background:${p.color}"></span>
        <b>${p.name}</b>
        <span class="mono-money">$${p.money}</span>
        <span class="mono-lands">🏠${lands}</span>
        ${p.frozen > 0 ? '<span>🥶</span>' : ''}
        ${p.doubleRent ? '<span>🧧</span>' : ''}
      </div>`;
    }).join('');

    // Build 16 perimeter tiles around the 5x5 CSS Grid (center 3x3 is #mono-center-box!)
    this.gridEl.querySelectorAll('.mono-tile').forEach((n) => n.remove());
    for (const t of MONOPOLY_TILES) {
      const prop = this.props.get(t.id);
      const owner = prop ? this.players[prop.ownerIdx] : null;
      const tokensHere = this.players.filter((p) => p.tile === t.id);

      const el = document.createElement('div');
      el.className = 'mono-tile' + (owner ? ' owned' : '');
      el.style.gridRow = String(t.r + 1);
      el.style.gridColumn = String(t.c + 1);
      el.style.setProperty('--tc', owner ? owner.color : t.color);

      const lvStars = prop ? ['🏠', '🏠🏠', '🏨', '🏰'][Math.min(3, prop.level - 1)] : '';
      const subText = t.type === 'property'
        ? (prop ? `租$${this._calcRent(t, prop.level)}` : `$${t.price}`)
        : (t.type === 'start' ? '+$300' : t.type === 'parking' ? '+$200' : '事件');

      el.innerHTML = `
        <div class="mt-head" style="background:${t.color}">${t.name}</div>
        <div class="mt-icon">${t.icon}</div>
        <div class="mt-sub">${lvStars ? `<span class="mt-lv">${lvStars}</span> ` : ''}${subText}</div>
        <div class="mt-tokens">${tokensHere.map((p) => `<span class="mt-tok" style="background:${p.color}" title="${p.name}">${p.icon}</span>`).join('')}</div>
      `;
      this.gridEl.appendChild(el);
    }
  }

  _setCenter(html, buttons = []) {
    this.centerEl.innerHTML = `<div class="mc-body">${html}</div><div class="mc-btns"></div>`;
    const btnWrap = this.centerEl.querySelector('.mc-btns');
    for (const b of buttons) {
      const el = document.createElement('button');
      el.className = b.primary ? 'primary-btn mono-btn' : 'secondary-btn mono-btn';
      el.textContent = b.label;
      el.disabled = !!b.disabled;
      el.addEventListener('click', () => { if (b.onClick) b.onClick(); });
      btnWrap.appendChild(el);
    }
  }

  _beginTurn() {
    if (!this.active) return;
    this.busy = false;
    const p = this.players[this.turnIdx];
    this._renderAll();

    if (p.frozen > 0) {
      p.frozen--;
      this._setCenter(`<div class="mc-big">🥶</div><h3>${p.name} 被冰風暴凍住！</h3><p>本回合跳過行動</p>`);
      setTimeout(() => this._nextTurn(), 1200);
      return;
    }

    if (p.isHuman) {
      this._setCenter(
        `<div class="mc-big">🎲</div>
         <h3>輪到 <span style="color:${p.color}">${p.name}</span>！</h3>
         <p>踩到空地 ➔ 跑 <b>1 圈真實 3D 賽道</b>，<b>第 1 名才能買地！</b></p>`,
        [
          { label: '🎲 擲骰子！', primary: true, onClick: () => this._rollDice() },
          { label: `🃏 道具卡 (${p.cards.length})`, primary: false, disabled: p.cards.length === 0, onClick: () => this._openCards() },
        ]
      );
    } else {
      this._setCenter(`<div class="mc-big">🤖</div><h3>${p.name} 正在擲骰子…</h3>`);
      setTimeout(() => this._rollDice(), 650);
    }
  }

  _openCards() {
    const p = this.players[this.turnIdx];
    const btns = p.cards.map((c, idx) => ({
      label: c.name,
      primary: true,
      onClick: () => this._useCard(p, idx),
    }));
    btns.push({ label: '返回', primary: false, onClick: () => this._beginTurn() });
    this._setCenter(`<h3>🃏 選擇戰術道具卡</h3><p>用完後依然可以擲骰子！</p>`, btns);
  }

  _useCard(p, idx) {
    const card = p.cards.splice(idx, 1)[0];
    if (this.hooks.audio) this.hooks.audio.playCoin();
    if (card.id === 'remote') {
      this._setCenter(
        `<h3>🎯 遙控骰子</h3><p>選擇這回合要精準走幾步：</p>`,
        [1, 2, 3, 4, 5, 6].map((n) => ({ label: `${n} 步`, primary: true, onClick: () => this._rollDice(n) }))
      );
      return;
    }
    if (card.id === 'double') {
      p.doubleRent = true;
      this._setCenter(`<div class="mc-big">🧧</div><h3>財神附身！</h3><p>下次收過路費變 2 倍！</p>`, [{ label: '🎲 繼續擲骰', primary: true, onClick: () => this._rollDice() }]);
    } else if (card.id === 'blizzard') {
      const target = this.players.filter((o) => o !== p).sort((a, b) => this._netWorth(b) - this._netWorth(a))[0];
      if (target) target.frozen = 1;
      this._setCenter(`<div class="mc-big">🌨️</div><h3>冰風暴凍結！</h3><p>${target ? `${target.name} 跳過 1 回合！` : ''}</p>`, [{ label: '🎲 繼續擲骰', primary: true, onClick: () => this._rollDice() }]);
    } else if (card.id === 'missile') {
      let bestId = -1, bestLv = 0;
      for (const [tid, info] of this.props.entries()) {
        if (info.ownerIdx !== p.idx && info.level > bestLv) { bestLv = info.level; bestId = tid; }
      }
      if (bestId >= 0) {
        const info = this.props.get(bestId);
        info.level = Math.max(1, info.level - 1);
        this._setCenter(`<div class="mc-big">🚀</div><h3>飛彈命中！</h3><p>「${MONOPOLY_TILES[bestId].name}」降為 Lv.${info.level}！</p>`, [{ label: '🎲 繼續擲骰', primary: true, onClick: () => this._rollDice() }]);
      } else {
        p.money += 150;
        this._setCenter(`<div class="mc-big">🚀</div><h3>對手還沒蓋房！</h3><p>飛彈折現 +$150！</p>`, [{ label: '🎲 繼續擲骰', primary: true, onClick: () => this._rollDice() }]);
      }
    } else if (card.id === 'build') {
      let done = false;
      for (const [tid, info] of this.props.entries()) {
        if (info.ownerIdx === p.idx && info.level < 4) {
          info.level++;
          done = true;
          this._setCenter(`<div class="mc-big">🏗️</div><h3>免費蓋樓成功！</h3><p>「${MONOPOLY_TILES[tid].name}」升至 Lv.${info.level}！</p>`, [{ label: '🎲 繼續擲骰', primary: true, onClick: () => this._rollDice() }]);
          break;
        }
      }
      if (!done) {
        p.money += 200;
        this._setCenter(`<div class="mc-big">🏗️</div><h3>免費蓋樓折現！</h3><p>目前無可升建築，改領 +$200！</p>`, [{ label: '🎲 繼續擲骰', primary: true, onClick: () => this._rollDice() }]);
      }
    }
    this._renderAll();
  }

  _rollDice(forced = null) {
    if (this.busy) return;
    this.busy = true;
    const p = this.players[this.turnIdx];
    const steps = forced || (1 + Math.floor(Math.random() * 6));
    if (this.hooks.audio) this.hooks.audio.playBeep(660, 0.1, 0.1);
    this._setCenter(`<div class="mc-big mc-spin">🎲</div><h3>${p.name} 擲出了 <span style="color:#fde047">${steps}</span> 點！</h3>`);
    setTimeout(() => this._stepMove(p, steps), 420);
  }

  _stepMove(p, left) {
    if (left <= 0) {
      this._onLand(p);
      return;
    }
    p.tile = (p.tile + 1) % MONOPOLY_TILES.length;
    if (p.tile === 0) {
      p.money += 300;
      if (this.hooks.audio) this.hooks.audio.playCoin();
    }
    this._renderAll();
    setTimeout(() => this._stepMove(p, left - 1), 210);
  }

  _onLand(p) {
    const tile = MONOPOLY_TILES[p.tile];
    this._renderAll();

    if (tile.type === 'start') {
      this._setCenter(`<div class="mc-big">🏁</div><h3>回到起點！</h3><p>${p.name} 領取發財金 +$300！</p>`);
      setTimeout(() => this._nextTurn(), 950);
      return;
    }
    if (tile.type === 'parking') {
      p.money += 200;
      const c = MONO_CARDS[Math.floor(Math.random() * MONO_CARDS.length)];
      p.cards.push(c);
      this._renderAll();
      this._setCenter(`<div class="mc-big">⚡</div><h3>補血加氣站！</h3><p>${p.name} 獲得 +$200 與 <b>${c.name}</b>！</p>`);
      setTimeout(() => this._nextTurn(), 1200);
      return;
    }
    if (tile.type === 'card') {
      const c = MONO_CARDS[Math.floor(Math.random() * MONO_CARDS.length)];
      p.cards.push(c);
      this._renderAll();
      this._setCenter(`<div class="mc-big">🃏</div><h3>抽到道具卡！</h3><p>${p.name} 獲得 <b>${c.name}</b>（${c.desc}）</p>`);
      setTimeout(() => this._nextTurn(), 1200);
      return;
    }
    if (tile.type === 'chance') {
      const ev = MONO_CHANCES[Math.floor(Math.random() * MONO_CHANCES.length)];
      ev.fn(p, this.players);
      this._renderAll();
      this._setCenter(`<div class="mc-big">${ev.icon}</div><h3>${ev.title}</h3><p>${p.name}：${ev.desc}</p>`);
      setTimeout(() => this._nextTurn(), 1400);
      return;
    }

    // PROPERTY TILE (Linked to REAL 3D Track!)
    const prop = this.props.get(tile.id);

    // 1. EMPTY LAND -> Human triggers REAL 1-Lap 3D Race! Winner buys land!
    if (!prop) {
      if (p.isHuman) {
        this._setCenter(
          `<div class="mc-big">${tile.icon}</div>
           <h3>搶地飆車賽：${tile.name} ($${tile.price})</h3>
           <p>立刻在 <b>「${tile.icon} ${tile.name}」真實 3D 賽道</b> 跑 1 圈！<br/><b>🏆 第 1 名才能買下這塊地</b>（再送 +$150 獎金）！</p>`,
          [{
            label: `🏎️ 開跑 1 圈搶地！`,
            primary: true,
            onClick: () => this._launchRealTrackRace('empty_land', tile, p, null, 0),
          }]
        );
      } else {
        // Fast AI turn (doesn't interrupt human with tedious forced races!)
        if (p.money >= tile.price) {
          p.money -= tile.price;
          this.props.set(tile.id, { ownerIdx: p.idx, level: 1 });
          this._renderAll();
          this._setCenter(`<div class="mc-big">${tile.icon}</div><h3>${p.name} 買下了「${tile.name}」！</h3><p>花費 $${tile.price} 蓋出 🏠 Lv.1</p>`);
        } else {
          this._setCenter(`<div class="mc-big">${tile.icon}</div><h3>${p.name} 路過「${tile.name}」</h3>`);
        }
        setTimeout(() => this._nextTurn(), 1050);
      }
      return;
    }

    // 2. OWN LAND -> Upgrade!
    if (prop.ownerIdx === p.idx) {
      const upgCost = Math.round(tile.price * 0.5);
      if (prop.level >= 4) {
        this._setCenter(`<div class="mc-big">🏰</div><h3>${tile.name} 已滿級！</h3>`);
        setTimeout(() => this._nextTurn(), 900);
        return;
      }
      if (p.isHuman) {
        this._setCenter(
          `<div class="mc-big">🏗️</div>
           <h3>升級「${tile.name}」Lv.${prop.level} ➔ Lv.${prop.level + 1}</h3>
           <p>花費 <b>$${upgCost}</b>，過路費漲到 <b>$${this._calcRent(tile, prop.level + 1)}</b>！</p>`,
          [
            {
              label: `✅ 加蓋 ($${upgCost})`,
              primary: true,
              disabled: p.money < upgCost,
              onClick: () => {
                p.money -= upgCost;
                prop.level++;
                if (this.hooks.audio) this.hooks.audio.playCoin();
                this._renderAll();
                this._nextTurn();
              },
            },
            { label: '略過', primary: false, onClick: () => this._nextTurn() },
          ]
        );
      } else {
        if (p.money >= upgCost + 200) {
          p.money -= upgCost;
          prop.level++;
          this._renderAll();
          this._setCenter(`<div class="mc-big">🏗️</div><h3>${p.name} 升級「${tile.name}」到 Lv.${prop.level}！</h3>`);
        }
        setTimeout(() => this._nextTurn(), 950);
      }
      return;
    }

    // 3. RIVAL'S LAND -> Pay Toll OR Launch 1-Lap Real 3D Track Takeover Duel!
    const owner = this.players[prop.ownerIdx];
    const baseRent = this._calcRent(tile, prop.level);
    const rent = owner.doubleRent ? baseRent * 2 : baseRent;

    if (p.isHuman) {
      this._setCenter(
        `<div class="mc-big">🔥</div>
         <h3>踩到 ${owner.name} 的「${tile.name}」Lv.${prop.level}！</h3>
         <p>過路費 <b>$${rent}</b>${owner.doubleRent ? '（🧧 雙倍！）' : ''}。<br/>要乖乖付錢，還是直接跑 <b>1 圈 3D 賽道搶地決鬥</b>？</p>`,
        [
          {
            label: `🏎️ 1 圈決鬥搶地！（贏了7折搶走）`,
            primary: true,
            onClick: () => this._launchRealTrackRace('duel', tile, p, owner, rent),
          },
          {
            label: `💸 乖乖付 $${rent}`,
            primary: false,
            onClick: () => {
              this._pay(p, owner, rent);
              setTimeout(() => this._nextTurn(), 800);
            },
          },
        ]
      );
    } else if (owner.isHuman && Math.random() < 0.35) {
      // AI challenges Human to defend their land!
      this._setCenter(
        `<div class="mc-big">⚔️</div>
         <h3>${p.name} 向你發起搶地決鬥！</h3>
         <p>它踩到你的「${tile.name}」，想在 3D 賽道跑 1 圈搶走你的地！</p>`,
        [{
          label: `🏎️ 上場守地！（贏了收 1.5 倍租）`,
          primary: true,
          onClick: () => this._launchRealTrackRace('duel', tile, p, owner, rent),
        }]
      );
    } else {
      this._pay(p, owner, rent);
      this._setCenter(`<div class="mc-big">💸</div><h3>${p.name} 付了 $${rent} 給 ${owner.name}！</h3>`);
      setTimeout(() => this._nextTurn(), 1050);
    }
  }

  _pay(from, to, amt) {
    const v = Math.min(from.money, amt);
    from.money -= v;
    to.money += v;
    to.doubleRent = false;
    if (this.hooks.audio) this.hooks.audio.playHit();
    this._renderAll();
  }

  _launchRealTrackRace(kind, tile, challenger, owner, rent) {
    this.pendingRace = { kind, tile, challenger, owner, rent };
    this.screenEl.classList.add('hidden');
    if (this.hooks.launchTrackRace) {
      this.hooks.launchTrackRace(tile.trackId, `${tile.icon} ${tile.name}・${kind === 'duel' ? '搶地決鬥' : '贏家買地賽'}`);
    }
  }

  onRealRaceFinished(sortedRacers) {
    if (!this.active || !this.pendingRace) return;
    const ctx = this.pendingRace;
    this.pendingRace = null;
    this.screenEl.classList.remove('hidden');

    // Match 1st-place racer back to our Monopoly player by name (fallback to slot 0)
    const winRacer = sortedRacers[0];
    const winner = this.players.find((p) => p.name === winRacer.name) || this.players[0];

    if (ctx.kind === 'empty_land') {
      const tile = ctx.tile;
      winner.money += 150;
      this._renderAll();
      if (winner.isHuman) {
        this._setCenter(
          `<div class="mc-big">🏆</div>
           <h3>${winner.name} 奪冠！贏得買地權！</h3>
           <p>已發放冠軍獎金 <b>+$150</b>！<br/>要用 <b>$${tile.price}</b> 買下 <b>${tile.icon} ${tile.name}</b> 嗎？</p>`,
          [
            {
              label: `🏠 買下「${tile.name}」($${tile.price})`,
              primary: true,
              disabled: winner.money < tile.price,
              onClick: () => {
                winner.money -= tile.price;
                this.props.set(tile.id, { ownerIdx: winner.idx, level: 1 });
                if (this.hooks.audio) this.hooks.audio.playCoin();
                this._renderAll();
                this._nextTurn();
              },
            },
            { label: '暫不購買', primary: false, onClick: () => this._nextTurn() },
          ]
        );
      } else {
        if (winner.money >= tile.price) {
          winner.money -= tile.price;
          this.props.set(tile.id, { ownerIdx: winner.idx, level: 1 });
        }
        this._renderAll();
        this._setCenter(
          `<div class="mc-big">🏁</div>
           <h3>${winner.name} 搶先衝線！</h3>
           <p>${winner.name} 贏得第 1 名，直接買走了 <b>${tile.icon} ${tile.name}</b>！</p>`,
          [{ label: '下一回合 ➔', primary: true, onClick: () => this._nextTurn() }]
        );
      }
      return;
    }

    // DUEL RESULT
    const { tile, challenger, owner, rent } = ctx;
    const prop = this.props.get(tile.id);
    const buyout = Math.round(tile.price * 0.7);
    const chRank = sortedRacers.findIndex((r) => r.name === challenger.name);
    const owRank = sortedRacers.findIndex((r) => r.name === owner.name);
    const challengerWon = chRank >= 0 && (owRank < 0 || chRank < owRank);

    if (challengerWon) {
      if (challenger.isHuman) {
        this._setCenter(
          `<div class="mc-big">🔥</div>
           <h3>${challenger.name} 決鬥獲勝！免付租金！</h3>
           <p>可以 7 折 <b>$${buyout}</b> 強制收購 <b>${tile.name} (Lv.${prop.level})</b>！</p>`,
          [
            {
              label: `🏴 強制搶地 ($${buyout})`,
              primary: true,
              disabled: challenger.money < buyout,
              onClick: () => {
                challenger.money -= buyout;
                owner.money += buyout;
                prop.ownerIdx = challenger.idx;
                if (this.hooks.audio) this.hooks.audio.playCoin();
                this._renderAll();
                this._nextTurn();
              },
            },
            { label: '只要免租金就好', primary: false, onClick: () => this._nextTurn() },
          ]
        );
      } else {
        if (challenger.money >= buyout) {
          challenger.money -= buyout;
          owner.money += buyout;
          prop.ownerIdx = challenger.idx;
        }
        this._renderAll();
        this._setCenter(
          `<div class="mc-big">😱</div><h3>${challenger.name} 搶地成功！</h3><p>它跑贏了決鬥，搶走你的「${tile.name}」！</p>`,
          [{ label: '繼續遊戲 ➔', primary: true, onClick: () => this._nextTurn() }]
        );
      }
    } else {
      const penalty = Math.round(rent * 1.5);
      this._pay(challenger, owner, penalty);
      this._setCenter(
        `<div class="mc-big">🛡️</div><h3>${owner.name} 守地成功！</h3><p>${challenger.name} 挑戰失敗，付 1.5 倍過路費 <b>$${penalty}</b>！</p>`,
        [{ label: '繼續遊戲 ➔', primary: true, onClick: () => this._nextTurn() }]
      );
    }
  }

  _nextTurn() {
    if (!this.active) return;
    this.turnIdx++;
    if (this.turnIdx >= this.players.length) {
      this.turnIdx = 0;
      this.round++;
      if (this.round > this.maxRounds) {
        this.finishGame();
        return;
      }
    }
    this._beginTurn();
  }

  finishGame() {
    const ranked = [...this.players].sort((a, b) => this._netWorth(b) - this._netWorth(a));
    const humanBonus = ranked[0].isHuman ? 150 : 60;
    if (this.hooks.onAwardGarageCoins) this.hooks.onAwardGarageCoins(humanBonus);
    const listHtml = ranked.map((p, i) => `<div>#${i + 1} ${p.icon} <b style="color:${p.color}">${p.name}</b> — 總資產 <b>$${this._netWorth(p)}</b></div>`).join('');
    this._setCenter(
      `<div class="mc-big">🏆</div>
       <h3>大富翁總冠軍：${ranked[0].name}！</h3>
       <div class="mc-rank-list">${listHtml}</div>
       <p style="margin-top:8px;color:#fde047">已獲得車庫金幣獎勵 +${humanBonus} 🪙！</p>`,
      [
        { label: '🎲 再玩一局', primary: true, onClick: () => this.startNew(this.players.map((p, i) => ({ name: p.name, isHuman: p.isHuman, slotIndex: i }))) },
        { label: '🏠 返回大廳', primary: false, onClick: () => this.closeToLobby() },
      ]
    );
  }
}
