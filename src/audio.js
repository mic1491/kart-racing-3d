export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.engineOsc = null;
    this.engineGain = null;
    this.driftNoise = null;
    this.driftGain = null;
    this.initialized = false;

    // Arcade Racing BGM sequencer
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.bgmPlaying = false;
    this.finalLap = false;
  }

  init() {
    if (this.initialized) {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    // 🔊 主音量匯流排：先放大再過壓縮器，聲音更飽滿有力、又不會爆音
    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -18;
    this.comp.knee.value = 12;
    this.comp.ratio.value = 12; // 接近限幅器：再大聲也不會爆音
    this.comp.attack.value = 0.003;
    this.comp.release.value = 0.2;
    this.out = this.ctx.createGain();
    this.out.gain.value = 2.2;
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.85;
    this.out.connect(this.comp);
    this.comp.connect(this.master);
    this.master.connect(this.ctx.destination);
    this._noiseBuf = null;

    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 65;

    const engineFilter = this.ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.value = 340;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0.0;

    // 第二顆（五度音）＋超低音，引擎聲更粗更有力
    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc2.type = 'square';
    this.engineOsc2.frequency.value = 97;
    const e2Gain = this.ctx.createGain();
    e2Gain.gain.value = 0.45;
    this.engineOsc2.connect(e2Gain);
    e2Gain.connect(engineFilter);
    this.engineOsc2.start();
    this.engineSub = this.ctx.createOscillator();
    this.engineSub.type = 'sine';
    this.engineSub.frequency.value = 32;
    const subGain = this.ctx.createGain();
    subGain.gain.value = 1.3;
    this.engineSub.connect(subGain);
    subGain.connect(this.engineGain);
    this.engineSub.start();
    this.engineFilter = engineFilter;
    this.engineOsc.connect(engineFilter);
    engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.out);
    this.engineOsc.start();

    const bufferSize = this.ctx.sampleRate * 1.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    this.driftNoise = this.ctx.createBufferSource();
    this.driftNoise.buffer = noiseBuffer;
    this.driftNoise.loop = true;

    const driftFilter = this.ctx.createBiquadFilter();
    driftFilter.type = 'bandpass';
    driftFilter.frequency.value = 1800;
    driftFilter.Q.value = 3.5;

    this.driftGain = this.ctx.createGain();
    this.driftGain.gain.value = 0.0;

    this.driftNoise.connect(driftFilter);
    driftFilter.connect(this.driftGain);
    this.driftGain.connect(this.out);
    this.driftNoise.start();

    // 🛞 輪胎尖叫聲：帶顫音的高頻嘯叫 + 高頻摩擦噪音
    this.squealOsc = this.ctx.createOscillator();
    this.squealOsc.type = 'sawtooth';
    this.squealOsc.frequency.value = 1050;
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 17;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 70;
    lfo.connect(lfoGain);
    lfoGain.connect(this.squealOsc.frequency);
    const sqFilter = this.ctx.createBiquadFilter();
    sqFilter.type = 'bandpass';
    sqFilter.frequency.value = 1500;
    sqFilter.Q.value = 5;
    this.squealGain = this.ctx.createGain();
    this.squealGain.gain.value = 0;
    this.squealOsc.connect(sqFilter);
    sqFilter.connect(this.squealGain);
    this.squealGain.connect(this.out);
    const rub = this.ctx.createBufferSource();
    rub.buffer = noiseBuffer;
    rub.loop = true;
    const rubFilter = this.ctx.createBiquadFilter();
    rubFilter.type = 'highpass';
    rubFilter.frequency.value = 2600;
    this.rubGain = this.ctx.createGain();
    this.rubGain.gain.value = 0;
    rub.connect(rubFilter);
    rubFilter.connect(this.rubGain);
    this.rubGain.connect(this.out);
    this.squealOsc.start();
    lfo.start();
    rub.start();
    this._noiseBuf = noiseBuffer;

    this.initialized = true;
    this.loadSamples();
  }

  // 0 = 安靜，1 = 最大聲（甩尾、燒胎）
  setScreech(level, pitch = 1) {
    if (!this.initialized) return;
    const now = this.ctx.currentTime;
    let lv = this.muted ? 0 : Math.max(0, Math.min(1, level));
    this.lastScreech = lv;
    if (this.samples && this.samples.screech) lv = 0; // 有錄音就用錄音
    this.squealGain.gain.setTargetAtTime(lv * 0.05, now, 0.05);
    this.rubGain.gain.setTargetAtTime(lv * 0.06, now, 0.05);
    this.squealOsc.frequency.setTargetAtTime(950 * pitch, now, 0.08);
  }

  // 低頻「碰！」撞擊聲，用在被打中、落地
  playThump(gainVal = 0.5) {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.3);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(g);
    g.connect(this.out);
    osc.start(now);
    osc.stop(now + 0.36);
    this._noiseBurst(0.18, 0.25, 900);
  }

  // 噴射「咻——」聲（噪音掃頻）
  _noiseBurst(gainVal, dur, freq, sweepTo = null) {
    if (!this._noiseBuf) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(freq, now);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, now + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(f);
    f.connect(g);
    g.connect(this.out);
    src.start(now, Math.random());
    src.stop(now + dur + 0.05);
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted && this.initialized) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.driftGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.setScreech(0);
      this._updateSampleLoops(0, false, 0);
      if (this.sampleBgm) this.sampleBgm.pause();
    } else if (!muted && this.sampleBgm) {
      this.sampleBgm.play().catch(() => {});
    }
  }

  // ===================================================================
  // 🎵 街機賽車背景音樂：鼓組＋貝斯＋和弦＋主旋律（含回音），每種賽道風格一首
  // 用「預先排程」的方式精準對拍，不會因為畫面卡頓而走音
  // ===================================================================
  setTrackMusic(trackId) {
    const map = {
      village: 'sunny', beach: 'sunny', island: 'sunny', candy: 'sunny', sakura: 'sunny',
      neon: 'night', rainbow: 'night', sky: 'night',
      desert: 'action', volcano: 'action', dino: 'action', ice: 'action',
    };
    this.songId = map[trackId] || 'sunny';
    this.trackId = trackId;
  }

  _song() {
    // 音高用半音（0 = 根音），null = 休止；每小節 16 格
    const SONGS = {
      sunny: {
        bpm: 150, key: 57, // A
        chords: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]],
        bass: [0, null, 0, null, 12, null, 0, 0, null, 0, null, 12, 0, null, 7, null],
        lead: [
          [12, null, 16, 19, null, 16, 19, 24, null, 23, 21, null, 19, null, 16, null],
          [17, null, 21, 24, null, 21, 24, 29, null, 28, 26, null, 24, null, 21, null],
          [19, null, 23, 26, null, 23, 26, 31, null, 29, 28, null, 26, null, 23, null],
          [24, null, 23, 21, 19, null, 17, null, 16, null, 14, null, 12, null, null, null],
        ],
        drums: ['k...h.s.k.k.h.s.', 'k...h.s.k...h.sh'],
      },
      night: {
        bpm: 138, key: 50, // D 小調合成器風
        chords: [[0, 3, 7], [-4, 0, 3], [-7, -3, 0], [-2, 2, 5]],
        bass: [0, 0, 12, 0, 0, 12, 0, 12, 0, 0, 12, 0, 0, 12, 0, 12],
        lead: [
          [12, null, null, 15, null, null, 19, null, 17, null, 15, null, 14, null, 12, null],
          [8, null, null, 12, null, null, 15, null, 14, null, 12, null, 10, null, 8, null],
          [5, null, null, 8, null, null, 12, null, 10, null, 8, null, 7, null, 5, null],
          [10, null, 12, null, 14, null, 15, null, 17, null, 19, null, 22, null, 24, null],
        ],
        drums: ['k.h.s.h.k.h.s.hh', 'k.h.s.h.k.k.s.ss'],
      },
      action: {
        bpm: 164, key: 52, // E 搖滾快歌
        chords: [[0, 7, 12], [3, 10, 15], [5, 12, 17], [-2, 5, 10]],
        bass: [0, 0, 0, 12, 0, 0, 10, 12, 0, 0, 0, 12, 0, 7, 10, 12],
        lead: [
          [12, 12, 15, null, 12, 17, null, 15, 12, null, 10, 12, null, null, null, null],
          [15, 15, 19, null, 15, 20, null, 19, 15, null, 13, 15, null, null, null, null],
          [17, 17, 20, null, 17, 22, null, 20, 17, null, 15, 17, null, null, null, null],
          [10, null, 12, null, 14, null, 15, null, 17, null, 19, null, 22, 24, 27, null],
        ],
        drums: ['k.hsk.hsk.hsk.hs', 'kkhsk.hsk.hskshs'],
      },
    };
    SONGS.victory = {
      bpm: 128, key: 60, // C 大調慶祝曲
      chords: [[0, 4, 7], [5, 9, 12], [-3, 0, 4], [7, 11, 14]],
      bass: [0, null, 12, null, 0, null, 12, 7, 0, null, 12, null, 0, 7, 12, null],
      lead: [
        [12, null, 16, null, 19, null, 24, null, 23, null, 19, null, 21, null, 19, null],
        [17, null, 21, null, 24, null, 29, null, 28, null, 24, null, 26, null, 24, null],
        [16, null, 19, null, 21, null, 24, null, 19, null, 16, null, 14, null, 12, null],
        [19, null, 23, null, 26, null, 31, 31, 29, null, 28, null, 26, 24, 23, null],
      ],
      drums: ['k.h.s.h.k.k.s.h.', 'k.h.s.h.k.h.s.ss'],
    };
    return SONGS[this.overrideSong || this.songId || 'sunny'];
  }

  startBgm(overrideSong = null) {
    if (!this.initialized) return;
    this.stopBgm();
    this.overrideSong = overrideSong;
    this._ensureMusicBus();
    this.musicBus.gain.value = overrideSong === 'victory' ? 0.85 : 0.55; // 頒獎音樂大聲一點
    if (this._playSampleBgm()) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.08;
    this._bgmLoop();
  }

  setFinalLap(isFinal) {
    this.finalLap = isFinal;
    if (this.sampleBgm) this.sampleBgm.playbackRate = isFinal ? 1.08 : 1;
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.victoryTimer) { clearTimeout(this.victoryTimer); this.victoryTimer = null; }
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.sampleBgm) { this.sampleBgm.pause(); this.sampleBgm = null; }
  }

  _bgmLoop() {
    if (!this.bgmPlaying) return;
    const song = this._song();
    const stepDur = 60 / (song.bpm * (this.finalLap ? 1.12 : 1)) / 4;
    while (this.nextNoteTime < this.ctx.currentTime + 0.15) {
      if (!this.muted) this._playStep(song, this.bgmStep, this.nextNoteTime, stepDur);
      this.nextNoteTime += stepDur;
      this.bgmStep++;
    }
    this.bgmTimer = setTimeout(() => this._bgmLoop(), 40);
  }

  _ensureMusicBus() {
    if (this.musicBus) return;
    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = 0.55;
    this.musicBus.connect(this.out);
    // 主旋律回音
    this.delay = this.ctx.createDelay(1);
    this.delay.delayTime.value = 0.21;
    const fb = this.ctx.createGain();
    fb.gain.value = 0.32;
    const wet = this.ctx.createGain();
    wet.gain.value = 0.35;
    this.delay.connect(fb);
    fb.connect(this.delay);
    this.delay.connect(wet);
    wet.connect(this.musicBus);
  }

  _mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  _playStep(song, step, t, stepDur) {
    this._ensureMusicBus();
    const s16 = step % 16;
    const bar = Math.floor(step / 16) % 4;
    const drumRow = song.drums[Math.floor(step / 64) % song.drums.length];
    const d = drumRow[s16];
    if (d === 'k') this._kick(t);
    if (d === 's') this._snare(t);
    if (d === 'h' || d === 's' || s16 % 2 === 0) this._hat(t, d === 'h' ? 0.09 : 0.05);
    if (this.finalLap && s16 % 4 === 2) this._hat(t, 0.07);

    const root = song.key + song.chords[bar][0];
    const bn = song.bass[s16];
    if (bn !== null) this._tone(this._mtof(root - 24 + bn), t, stepDur * 0.9, 'sawtooth', 0.13, 700);
    // 和弦：反拍短促的合成器和弦
    if (s16 % 4 === 2) {
      for (const n of song.chords[bar]) this._tone(this._mtof(song.key + n), t, stepDur * 1.6, 'square', 0.04, 2200);
    }
    const ln = song.lead[bar][s16];
    if (ln !== null) {
      const f = this._mtof(song.key + ln);
      this._tone(f, t, stepDur * 1.8, 'square', 0.08, 3200, true);
      this._tone(f * 1.006, t, stepDur * 1.8, 'sawtooth', 0.04, 2600, true);
    }
  }

  _tone(freq, t, dur, type, vol, cutoff, toDelay = false) {
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = cutoff;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f);
    f.connect(g);
    g.connect(this.musicBus);
    if (toDelay) g.connect(this.delay);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  _kick(t) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    g.gain.setValueAtTime(0.42, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    o.connect(g);
    g.connect(this.musicBus);
    o.start(t);
    o.stop(t + 0.24);
  }

  _noise(t, dur, vol, type, freq, dest) {
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(dest || this.musicBus);
    src.start(t, Math.random() * 1.2);
    src.stop(t + dur + 0.02);
  }

  _snare(t) {
    this._noise(t, 0.16, 0.32, 'highpass', 1400);
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.08);
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g);
    g.connect(this.musicBus);
    o.start(t);
    o.stop(t + 0.12);
  }

  _hat(t, vol) { this._noise(t, 0.045, vol, 'highpass', 7500); }

  // ===================================================================
  // 🎙️ 選用：真實錄音音效。把 .mp3 放進 sounds/ 資料夾再執行 node build.mjs，就會嵌進 index.html 並自動改用（沒放就用合成音）
  // ===================================================================
  loadSamples() {
    if (this.samples) return;
    this.samples = {};
    const names = ['bgm', 'bgm_sunny', 'bgm_night', 'bgm_action', 'engine', 'boost', 'hit', 'item', 'coin', 'lap', 'win', 'countdown', 'go', 'screech'];
    for (const n of names) {
      const a = new Audio();
      a.preload = 'auto';
      a.addEventListener('canplaythrough', () => { this.samples[n] = a; }, { once: true });
      a.addEventListener('error', () => {}, { once: true });
      // 打包時若有 sounds/ 資料夾，音檔會被直接嵌進 index.html（仍然是單一檔案）
      const embedded = typeof window !== 'undefined' && window.__EMBED_SOUNDS && window.__EMBED_SOUNDS[n];
      if (!embedded) continue;
      a.src = embedded;
    }
  }

  _sample(name, vol = 0.8) {
    const a = this.samples && this.samples[name];
    if (!a || this.muted) return false;
    const c = a.cloneNode();
    c.volume = Math.min(1, vol);
    c.play().catch(() => {});
    return true;
  }

  _playSampleBgm() {
    const a = this.samples && (this.samples[`bgm_${this.songId}`] || this.samples.bgm);
    if (!a || this.muted) return false;
    a.loop = true;
    a.volume = 0.45;
    a.currentTime = 0;
    a.playbackRate = this.finalLap ? 1.08 : 1;
    a.play().catch(() => {});
    this.sampleBgm = a;
    return true;
  }

  _updateSampleLoops(speedRatio, active, screech) {
    const eng = this.samples && this.samples.engine;
    if (eng) {
      eng.loop = true;
      eng.preservesPitch = false;
      if (active && !this.muted) {
        if (eng.paused) eng.play().catch(() => {});
        eng.playbackRate = Math.min(3, 0.7 + Math.abs(speedRatio) * 1.5);
        eng.volume = Math.min(1, 0.35 + Math.abs(speedRatio) * 0.35);
      } else if (!eng.paused) eng.pause();
    }
    const sc = this.samples && this.samples.screech;
    if (sc) {
      sc.loop = true;
      if (active && screech > 0.05 && !this.muted) {
        if (sc.paused) sc.play().catch(() => {});
        sc.volume = Math.min(1, screech * 0.8);
      } else if (!sc.paused) sc.pause();
    }
    return !!eng;
  }

  // 倒數「嗶、嗶、嗶」＋ GO 的長音和弦
  // 倒數：短促的和弦重擊（根音＋五度＋八度）＋鼓
  playCountdown(n) {
    if (!this.initialized || this.muted) return;
    if (this._sample('countdown')) return;
    const t = this.ctx.currentTime;
    const root = n === 1 ? 659 : 587;
    for (const m of [1, 1.5, 2]) this._rich(root * m, t, 0.22, 0.045, 'bright');
    this._tom(t, n === 1 ? 160 : 130, 0.24);
  }


  playGo() {
    if (!this.initialized || this.muted) return;
    if (this._sample('go')) return;
    const now = this.ctx.currentTime;
    for (const [f, type] of [[880, 'square'], [1109, 'square'], [1319, 'sawtooth'], [440, 'sawtooth']]) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.07, now);
      g.gain.setValueAtTime(0.07, now + 0.45);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      o.connect(g);
      g.connect(this.out);
      o.start(now);
      o.stop(now + 0.95);
    }
    this.playThump(0.5);
    this._noiseBurst(0.3, 0.7, 500, 4000);
  }

  // 甩尾起跳的「吱！」
  // 甩尾起跳的「吱！」：短促輪胎摩擦＋輕快的彈跳音
  playDriftChirp() {
    if (!this.initialized || this.muted) return;
    this._noiseBurst(0.22, 0.14, 2600, 1600);
    this._rich(420, this.ctx.currentTime, 0.06, 0.045, 'pluck');
  }


  updateDrive(speedRatio, isDrifting, isBoosting, active) {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    if (!active) {
      this.engineGain.gain.setTargetAtTime(0, now, 0.08);
      this.driftGain.gain.setTargetAtTime(0, now, 0.05);
      this.setScreech(0);
      this._updateSampleLoops(0, false, 0);
      return;
    }
    // 換檔感：每一檔轉速由低爬到高，換檔瞬間掉轉速 →「嗚～嗚～嗚～」的賽車聲
    const sr = Math.min(1.4, Math.abs(speedRatio));
    const gears = [0, 0.22, 0.45, 0.7, 1.0, 1.4];
    let gear = 0;
    while (gear < gears.length - 2 && sr > gears[gear + 1]) gear++;
    const rpm = (sr - gears[gear]) / (gears[gear + 1] - gears[gear]);
    const baseFreq = 55 + gear * 14 + rpm * 95 + (isBoosting ? 45 : 0);
    if (this.lastGear !== undefined && gear > this.lastGear && sr > 0.25) this._noiseBurst(0.08, 0.12, 300, 120);
    this.lastGear = gear;
    if (this._updateSampleLoops(speedRatio, true, this.lastScreech || 0)) {
      this.engineGain.gain.setTargetAtTime(0, now, 0.05);
      const targetDriftS = isDrifting && Math.abs(speedRatio) > 0.25 ? 0.05 : 0.0;
      this.driftGain.gain.setTargetAtTime(targetDriftS, now, 0.04);
      return;
    }
    this.engineOsc.frequency.setTargetAtTime(baseFreq, now, 0.05);
    this.engineOsc2.frequency.setTargetAtTime(baseFreq * 1.5, now, 0.05);
    this.engineSub.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.05);
    this.engineFilter.frequency.setTargetAtTime(340 + Math.abs(speedRatio) * 900 + (isBoosting ? 600 : 0), now, 0.08);
    this.engineGain.gain.setTargetAtTime(0.045 + Math.abs(speedRatio) * 0.035, now, 0.06);

    const targetDrift = isDrifting && Math.abs(speedRatio) > 0.25 ? 0.05 : 0.0;
    this.driftGain.gain.setTargetAtTime(targetDrift, now, 0.04);
  }

  // 通用提示音（已不是單音）：基音＋八度＋微走音第二層＋起音「喀」＋一點回音
  playBeep(freq = 660, duration = 0.14, gainVal = 0.12, timbre = 'pluck') {
    if (!this.initialized || this.muted) return;
    this._rich(freq, this.ctx.currentTime, duration, gainVal, timbre);
  }

  // 多層合成音色：pluck（清脆按鍵）、chime（鈴聲／金幣）、bright（街機亮音）
  _rich(freq, t, dur, vol, timbre = 'pluck') {
    this._ensureMusicBus();
    const out = this.ctx.createGain();
    out.gain.value = 1;
    out.connect(this.out);
    if (this.delay) {
      const send = this.ctx.createGain();
      send.gain.value = timbre === 'chime' ? 0.35 : 0.18;
      out.connect(send);
      send.connect(this.delay);
    }
    const layers = timbre === 'chime'
      ? [['sine', 1, 1, 0], ['sine', 2, 0.45, 0], ['sine', 3.01, 0.22, 0], ['triangle', 0.5, 0.25, 0]]
      : timbre === 'bright'
        ? [['square', 1, 0.6, -7], ['square', 1, 0.6, 7], ['sawtooth', 2, 0.25, 0], ['triangle', 0.5, 0.4, 0]]
        : [['triangle', 1, 1, 0], ['square', 2, 0.18, 5], ['sine', 1, 0.5, -9], ['sine', 3, 0.08, 0]];
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(Math.min(16000, freq * (timbre === 'chime' ? 10 : 7)), t);
    filt.frequency.exponentialRampToValueAtTime(Math.max(400, freq * 1.5), t + dur + 0.1);
    filt.connect(out);
    for (const [type, mul, v, det] of layers) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq * mul, t);
      o.detune.value = det;
      const len = timbre === 'chime' ? dur * (mul > 1.5 ? 1.2 : 2.2) : dur;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol * v, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.05);
      o.connect(g);
      g.connect(filt);
      o.start(t);
      o.stop(t + len + 0.08);
    }
    // 起音的「喀」：讓聲音有顆粒感、不會悶
    if (this._noiseBuf) this._noise(t, 0.015, vol * 0.5, 'highpass', Math.min(9000, freq * 4), out);
  }


  playCoin() {
    if (!this.initialized || this.muted) return;
    if (this._sample('coin', 0.6)) return;
    const t = this.ctx.currentTime;
    this._rich(988, t, 0.08, 0.09, 'chime');
    this._rich(1319, t + 0.06, 0.25, 0.1, 'chime');
    this._rich(2637, t + 0.06, 0.15, 0.025, 'chime'); // 閃亮泛音
  }


  playBoost() {
    if (!this.initialized || this.muted) return;
    if (this._sample('boost')) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.7);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.72);
    this._noiseBurst(0.35, 0.8, 400, 3800);
    // 第二層（走音鋸齒）＋超低音，噴射更厚實
    const o2 = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    o2.type = 'sawtooth';
    o2.detune.value = 18;
    o2.frequency.setValueAtTime(160, now);
    o2.frequency.exponentialRampToValueAtTime(560, now + 0.35);
    o2.frequency.exponentialRampToValueAtTime(220, now + 0.7);
    g2.gain.setValueAtTime(0.08, now);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.72);
    o2.connect(g2);
    g2.connect(this.out);
    o2.start(now);
    o2.stop(now + 0.75);
    this._kickAt(now, 0.3);
    osc.connect(gain);
    gain.connect(this.out);
    osc.start(now);
    osc.stop(now + 0.75);
  }

  // 小噴：上滑的雙層鋸齒＋「咻」
  playMiniBoost() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    for (const [type, det, v] of [['sawtooth', -10, 0.05], ['sawtooth', 10, 0.05], ['sine', 0, 0.07]]) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.detune.value = det;
      o.frequency.setValueAtTime(300, now);
      o.frequency.exponentialRampToValueAtTime(820, now + 0.22);
      g.gain.setValueAtTime(v, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      o.connect(g);
      g.connect(this.out);
      o.start(now);
      o.stop(now + 0.28);
    }
    this._noiseBurst(0.22, 0.35, 600, 4500);
  }


  // 道具轉盤：「噠噠噠噠…叮！」
  // 道具轉盤：「噠噠噠噠…」加速的清脆按鍵聲 →「叮～」和弦
  playItemPickup() {
    if (!this.initialized || this.muted) return;
    if (this._sample('item')) return;
    const t0 = this.ctx.currentTime;
    let t = 0;
    for (let k = 0; k < 9; k++) {
      this._rich(700 + k * 70, t0 + t, 0.04, 0.06, 'pluck');
      t += 0.045 + k * 0.012;
    }
    for (const f of [1568, 1976, 2349]) this._rich(f, t0 + t + 0.02, 0.35, 0.06, 'chime');
  }


  // 飛彈發射：點火「轟」＋下滑的雙鋸齒＋噴射氣流
  playMissileLaunch() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    for (const det of [-15, 15]) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sawtooth';
      o.detune.value = det;
      o.frequency.setValueAtTime(520, now);
      o.frequency.exponentialRampToValueAtTime(120, now + 0.4);
      g.gain.setValueAtTime(0.07, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      o.connect(g);
      g.connect(this.out);
      o.start(now);
      o.stop(now + 0.45);
    }
    this._kickAt(now, 0.35);
    this._noiseBurst(0.3, 0.6, 3000, 300);
  }


  // 磁鐵：兩層走音的嗡嗡聲＋顫音＋往上掃的濾波
  playMagnet() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.Q.value = 6;
    f.frequency.setValueAtTime(300, now);
    f.frequency.exponentialRampToValueAtTime(2800, now + 0.6);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.1, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    f.connect(g);
    g.connect(this.out);
    const lfo = this.ctx.createOscillator();
    const lg = this.ctx.createGain();
    lfo.frequency.value = 14;
    lg.gain.value = 25;
    lfo.connect(lg);
    for (const [mul, type] of [[1, 'sawtooth'], [1.007, 'sawtooth'], [0.5, 'square']]) {
      const o = this.ctx.createOscillator();
      o.type = type;
      o.frequency.value = 180 * mul;
      lg.connect(o.frequency);
      o.connect(f);
      o.start(now);
      o.stop(now + 0.72);
    }
    lfo.start(now);
    lfo.stop(now + 0.72);
  }


  // 閃電：「劈啪」爆裂＋雷鳴低頻＋電流嗡嗡
  playLightning() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    this._noise(now, 0.12, 0.5, 'highpass', 3000, this.out);
    for (let k = 0; k < 5; k++) this._noise(now + 0.03 + k * 0.035, 0.03, 0.3, 'highpass', 5000, this.out);
    this._noise(now + 0.05, 1.2, 0.35, 'lowpass', 220, this.out); // 遠方雷鳴
    this._kickAt(now, 0.5);
    for (const det of [-20, 20]) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sawtooth';
      o.detune.value = det;
      o.frequency.setValueAtTime(1400, now);
      o.frequency.exponentialRampToValueAtTime(70, now + 0.45);
      g.gain.setValueAtTime(0.06, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      o.connect(g);
      g.connect(this.out);
      o.start(now);
      o.stop(now + 0.52);
    }
  }


  // 被擊中：「碰！」低音＋金屬撞擊碎裂＋下墜的雙方波
  playHit() {
    if (!this.initialized || this.muted) return;
    if (this._sample('hit')) return;
    const now = this.ctx.currentTime;
    for (const [type, det] of [['square', -12], ['sawtooth', 12]]) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.detune.value = det;
      o.frequency.setValueAtTime(200, now);
      o.frequency.exponentialRampToValueAtTime(48, now + 0.35);
      g.gain.setValueAtTime(0.09, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      o.connect(g);
      g.connect(this.out);
      o.start(now);
      o.stop(now + 0.4);
    }
    this.playThump(0.55);
    this._noise(now, 0.25, 0.3, 'bandpass', 2400, this.out); // 金屬碎裂
  }


  // 護盾：閃閃發亮的和弦（三層鈴聲＋顫音）＋上升的光
  playShield() {
    if (!this.initialized || this.muted) return;
    const t = this.ctx.currentTime;
    [784, 988, 1175, 1568].forEach((f, k) => this._rich(f, t + k * 0.05, 0.45, 0.05, 'chime'));
    this._noiseBurst(0.08, 0.5, 2500, 8000);
  }


  // 喇叭：真正汽車喇叭是「兩個音同時響」→ 兩組方波（大三度）＋輕微嗡嗡
  playHorn() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 1800;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
    g.gain.setValueAtTime(0.09, now + 0.16);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    g.gain.setValueAtTime(0.0001, now + 0.24);
    g.gain.exponentialRampToValueAtTime(0.09, now + 0.26);
    g.gain.setValueAtTime(0.09, now + 0.5);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);
    f.connect(g);
    g.connect(this.out);
    for (const [fr, det] of [[440, -6], [440, 6], [554, -4], [554, 4]]) {
      const o = this.ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = fr;
      o.detune.value = det;
      o.connect(f);
      o.start(now);
      o.stop(now + 0.6);
    }
  }


  // 氣球爆破：「啵！」爆裂噪音＋快速下墜的音＋碎片聲
  playBalloonPop() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    this._noise(now, 0.08, 0.55, 'highpass', 1200, this.out);
    this._noise(now, 0.18, 0.25, 'bandpass', 500, this.out);
    for (const [f0, type] of [[900, 'sine'], [450, 'triangle']]) {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, now);
      o.frequency.exponentialRampToValueAtTime(f0 * 0.2, now + 0.12);
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      o.connect(g);
      g.connect(this.out);
      o.start(now);
      o.stop(now + 0.16);
    }
  }


  // 空中特技：上升的鈴聲琶音＋旋轉的「咻～」
  playTrick() {
    if (!this.initialized || this.muted) return;
    const t = this.ctx.currentTime;
    [523, 659, 784, 1047, 1319].forEach((f, k) => this._rich(f, t + k * 0.055, 0.18, 0.06, k === 4 ? 'chime' : 'bright'));
    this._noiseBurst(0.18, 0.4, 500, 5000);
  }


  // 水花：「嘩啦」水聲（濾波往下掃）＋幾個泡泡「啵啵」聲
  playSplash() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    this._noiseBurst(0.45, 0.6, 3500, 400);
    this._noise(now, 0.3, 0.25, 'lowpass', 600, this.out);
    for (let k = 0; k < 5; k++) {
      const t = now + 0.1 + k * 0.07 + Math.random() * 0.05;
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const f0 = 400 + Math.random() * 500;
      o.type = 'sine';
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(f0 * 2.2, t + 0.05);
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      o.connect(g);
      g.connect(this.out);
      o.start(t);
      o.stop(t + 0.08);
    }
  }


  // 過圈：上升的和弦琶音（亮音）＋最後一個長長的鈴聲和弦
  playLapChime() {
    if (!this.initialized || this.muted) return;
    if (this._sample('lap')) return;
    const t = this.ctx.currentTime;
    [784, 988, 1175].forEach((f, k) => this._rich(f, t + k * 0.09, 0.12, 0.08, 'bright'));
    for (const f of [1568, 1976, 2349]) this._rich(f, t + 0.27, 0.5, 0.05, 'chime');
  }


  playFireworkPop() {
    if (!this.initialized || this.muted) return;
    // 煙火：「咻～碰！」加上劈哩啪啦的火花聲
    const tb = this.ctx.currentTime;
    this._kickAt(tb, 0.35);
    this._noise(tb, 0.6, 0.18, 'lowpass', 1200, this.out);
    for (let c = 0; c < 6; c++) this._noise(tb + 0.15 + Math.random() * 0.6, 0.03, 0.12, 'highpass', 4000, this.out);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520 + Math.random() * 380, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.out);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // 🏆 頒獎典禮：鼓聲滾奏 → 鈸聲炸開＋銅管號角 → 觀眾歡呼 → 接著播慶祝音樂
  playVictory(rank = 1) {
    this.stopBgm();
    if (!this.initialized || this.muted) return;
    if (rank <= 3 && this._sample('win', 0.9)) {
      this.victoryTimer = setTimeout(() => this.startBgm('victory'), 4500);
      return;
    }
    this._ensureMusicBus();
    const t0 = this.ctx.currentTime + 0.05;
    if (rank <= 3) {
      // 1) 開場：定音鼓滾奏（音高往上爬）＋號角和弦漸強＋上升的「咻」→ 衝到「碰！」
      const rollLen = rank === 1 ? 0.9 : 0.65;
      let t = 0;
      let hitIdx = 0;
      while (t < rollLen) {
        const k = t / rollLen;
        this._tom(t0 + t, 95 + k * 110 + (hitIdx % 2) * 18, 0.18 + k * 0.32);
        t += 0.11 - k * 0.06;
        hitIdx++;
      }
      for (const n of [7, 11, 14]) this._swell(this._mtof(48 + n), t0, rollLen, 0.05); // 屬和弦（G）漸強，期待感
      this._riser(t0, rollLen, 0.16);
      const hit = t0 + rollLen;
      // 2) 鈸聲＋大鼓＋爆炸低音
      this._noise(hit, 2.2, 0.45, 'highpass', 5200, this.out);
      this._noise(hit, 0.5, 0.35, 'bandpass', 900, this.out);
      this._kickAt(hit, 0.9);
      // 3) 銅管號角：厚和弦＋主旋律
      const fan = rank === 1
        ? [[0, [0, 4, 7], 0.32, 67], [0.32, [0, 4, 7], 0.16, 67], [0.5, [0, 4, 7], 0.16, 67], [0.68, [5, 9, 12], 0.5, 72], [1.2, [7, 11, 14], 0.5, 74], [1.72, [0, 4, 7, 12], 1.6, 79]]
        : [[0, [0, 4, 7], 0.3, 67], [0.34, [5, 9, 12], 0.3, 69], [0.7, [7, 11, 14], 0.3, 71], [1.05, [0, 4, 7, 12], 1.2, 72]];
      for (const [dt, chord, dur, leadNote] of fan) {
        const tt = hit + dt;
        for (const n of chord) this._brass(this._mtof(48 + n), tt, dur, 0.06);
        this._brass(this._mtof(leadNote), tt, dur, 0.09, true);
        this._kickAt(tt, 0.5);
      }
      const end = hit + fan[fan.length - 1][0] + fan[fan.length - 1][2];
      this._noise(end - 0.1, 1.8, 0.3, 'highpass', 6000, this.out);
      // 4) 觀眾歡呼（逐漸湧起再退去）＋口哨聲
      this._crowd(hit + 0.2, rank === 1 ? 4.5 : 3.2, rank === 1 ? 0.32 : 0.22);
      for (let w = 0; w < (rank === 1 ? 5 : 3); w++) this._whistle(hit + 0.6 + w * 0.55 + Math.random() * 0.3);
      // 5) 接著播頒獎慶祝音樂
      this.victoryTimer = setTimeout(() => this.startBgm('victory'), (end - this.ctx.currentTime + 0.6) * 1000);
    } else {
      // 第 4 名：搞笑的「哇～哇～」再給個鼓勵
      [[392, 0], [370, 0.28], [349, 0.56], [311, 0.84]].forEach(([f, d]) => this._brass(f, t0 + d, d === 0.84 ? 0.9 : 0.26, 0.08, true, true));
      this._noise(t0 + 1.9, 0.12, 0.25, 'highpass', 1500, this.out);
      this._crowd(t0 + 1.9, 1.6, 0.1);
      this.victoryTimer = setTimeout(() => this.startBgm('victory'), 3200);
    }
  }

  // 定音鼓：有音高的低沉鼓聲
  _tom(t, freq, vol) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq * 1.5, t);
    o.frequency.exponentialRampToValueAtTime(freq, t + 0.05);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g);
    g.connect(this.out);
    o.start(t);
    o.stop(t + 0.3);
    this._noise(t, 0.04, vol * 0.25, 'bandpass', 1800, this.out);
  }

  // 銅管和弦漸強（從無到有）
  _swell(freq, t, dur, vol) {
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(400, t);
    f.frequency.exponentialRampToValueAtTime(2600, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.08);
    f.connect(g);
    g.connect(this.out);
    for (const det of [-8, 8]) {
      const o = this.ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = freq;
      o.detune.value = det;
      o.connect(f);
      o.start(t);
      o.stop(t + dur + 0.1);
    }
  }

  // 上升的「咻～」：濾波器從低掃到高
  _riser(t, dur, vol) {
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 2.5;
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(6000, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.05);
    src.connect(f);
    f.connect(g);
    g.connect(this.out);
    src.start(t);
    src.stop(t + dur + 0.1);
  }

  _kickAt(t, vol) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(36, t + 0.25);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.connect(g);
    g.connect(this.out);
    o.start(t);
    o.stop(t + 0.42);
  }

  // 銅管音色：三顆略微走音的鋸齒波＋濾波器「張開」的咆哮感
  _brass(freq, t, dur, vol, lead = false, wah = false) {
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.Q.value = 2;
    f.frequency.setValueAtTime(500, t);
    f.frequency.linearRampToValueAtTime(lead ? 3400 : 2400, t + 0.07);
    f.frequency.linearRampToValueAtTime(lead ? 2200 : 1500, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
    g.gain.setValueAtTime(vol, t + Math.max(0.04, dur - 0.08));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.25);
    f.connect(g);
    g.connect(this.out);
    if (lead && this.delay) g.connect(this.delay);
    for (const det of [-6, 0, 7]) {
      const o = this.ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(freq, t);
      o.detune.value = det;
      if (wah) o.frequency.linearRampToValueAtTime(freq * 0.94, t + dur);
      if (lead) {
        const vib = this.ctx.createOscillator();
        const vg = this.ctx.createGain();
        vib.frequency.value = 5.5;
        vg.gain.setValueAtTime(0, t);
        vg.gain.linearRampToValueAtTime(freq * 0.012, t + dur);
        vib.connect(vg);
        vg.connect(o.frequency);
        vib.start(t);
        vib.stop(t + dur + 0.3);
      }
      o.connect(f);
      o.start(t);
      o.stop(t + dur + 0.3);
    }
  }

  // 觀眾歡呼：寬頻噪音經過會「晃動」的濾波器，聽起來像一大群人在叫
  _crowd(t, dur, vol) {
    const src = this.ctx.createBufferSource();
    src.buffer = this._noiseBuf;
    src.loop = true;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1100;
    f.Q.value = 0.7;
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 3.3;
    const lg = this.ctx.createGain();
    lg.gain.value = 380;
    lfo.connect(lg);
    lg.connect(f.frequency);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.5);
    g.gain.setValueAtTime(vol, t + dur * 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(this.out);
    src.start(t);
    src.stop(t + dur + 0.1);
    lfo.start(t);
    lfo.stop(t + dur + 0.1);
  }

  _whistle(t) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(1500, t);
    o.frequency.exponentialRampToValueAtTime(2700, t + 0.22);
    o.frequency.exponentialRampToValueAtTime(1900, t + 0.42);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g);
    g.connect(this.out);
    o.start(t);
    o.stop(t + 0.47);
  }

}
