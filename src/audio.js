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

    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 65;

    const engineFilter = this.ctx.createBiquadFilter();
    engineFilter.type = 'lowpass';
    engineFilter.frequency.value = 340;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0.0;

    this.engineOsc.connect(engineFilter);
    engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);
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
    this.driftGain.connect(this.ctx.destination);
    this.driftNoise.start();

    this.initialized = true;
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted && this.initialized) {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.driftGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }
  }

  startBgm() {
    if (!this.initialized) return;
    this.stopBgm();
    this.bgmPlaying = true;
    this.bgmStep = 0;
    this._scheduleBgmTick();
  }

  setFinalLap(isFinal) {
    this.finalLap = isFinal;
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  _scheduleBgmTick() {
    if (!this.bgmPlaying) return;
    const stepMs = this.finalLap ? 105 : 126; // Final lap speeds up ~20%!

    if (this.initialized && !this.muted && this.ctx.state === 'running') {
      // Catchy KartRider-inspired upbeat synth melody + pumping octave bass
      const melody = [
        523, 0, 659, 784, 659, 0, 784, 1046,
        880, 0, 784, 659, 587, 659, 784, 0,
        523, 0, 659, 784, 1046, 0, 987, 880,
        784, 659, 587, 523, 587, 0, 659, 0,
      ];
      const bass = [
        130, 130, 261, 130, 146, 146, 293, 146,
        174, 174, 349, 174, 196, 196, 392, 196,
      ];
      const mFreq = melody[this.bgmStep % melody.length];
      const bFreq = bass[this.bgmStep % bass.length];
      const now = this.ctx.currentTime;

      if (mFreq > 0) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(this.finalLap ? mFreq * 1.06 : mFreq, now);
        g.gain.setValueAtTime(0.024, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }

      const bOsc = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bOsc.type = 'triangle';
      bOsc.frequency.setValueAtTime(bFreq, now);
      bGain.gain.setValueAtTime(0.042, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      bOsc.connect(bGain);
      bGain.connect(this.ctx.destination);
      bOsc.start(now);
      bOsc.stop(now + 0.11);
    }

    this.bgmStep++;
    this.bgmTimer = setTimeout(() => this._scheduleBgmTick(), stepMs);
  }

  updateDrive(speedRatio, isDrifting, isBoosting, active) {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    if (!active) {
      this.engineGain.gain.setTargetAtTime(0, now, 0.08);
      this.driftGain.gain.setTargetAtTime(0, now, 0.05);
      return;
    }
    const baseFreq = 60 + Math.abs(speedRatio) * 145 + (isBoosting ? 55 : 0);
    this.engineOsc.frequency.setTargetAtTime(baseFreq, now, 0.05);
    this.engineGain.gain.setTargetAtTime(0.036 + Math.abs(speedRatio) * 0.028, now, 0.06);

    const targetDrift = isDrifting && Math.abs(speedRatio) > 0.25 ? 0.05 : 0.0;
    this.driftGain.gain.setTargetAtTime(targetDrift, now, 0.04);
  }

  playBeep(freq = 660, duration = 0.14, gainVal = 0.12) {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  playCoin() {
    if (!this.initialized || this.muted) return;
    this.playBeep(988, 0.07, 0.09);
    setTimeout(() => this.playBeep(1318, 0.12, 0.09), 55);
  }

  playBoost() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.35);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.7);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.72);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.75);
  }

  playMiniBoost() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.22);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playItemPickup() {
    if (!this.initialized || this.muted) return;
    this.playBeep(660, 0.08, 0.11);
    setTimeout(() => this.playBeep(880, 0.08, 0.11), 65);
    setTimeout(() => this.playBeep(1174, 0.14, 0.12), 130);
  }

  playMissileLaunch() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.32);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  playMagnet() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.45);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playLightning() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.42);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  playHit() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.35);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  playShield() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.28);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.34);
  }

  playHorn() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    // Playful dual-tone kart horn (beep-beep!)
    [0, 0.16].forEach((offset) => {
      [440, 554.37].forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + offset);
        gain.gain.setValueAtTime(0.06, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.13);
      });
    });
  }

  playBalloonPop() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.11);
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  playTrick() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.05);
      gain.gain.setValueAtTime(0.11, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.2);
    });
  }

  playSplash() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.32);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  playLapChime() {
    this.playBeep(587, 0.12, 0.12);
    setTimeout(() => this.playBeep(880, 0.22, 0.14), 110);
  }

  playFireworkPop() {
    if (!this.initialized || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520 + Math.random() * 380, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playVictory(rank = 1) {
    this.stopBgm();
    if (rank === 1) {
      // Grand Champion Fanfare!
      const notes = [
        [523, 0], [659, 110], [784, 220], [1046, 340],
        [784, 520], [1046, 650], [1318, 800],
      ];
      notes.forEach(([n, ms]) => setTimeout(() => this.playBeep(n, 0.28, 0.15), ms));
    } else if (rank <= 3) {
      // Upbeat Podium Fanfare (2nd / 3rd)
      const notes = [[523, 0], [659, 120], [784, 240], [988, 380]];
      notes.forEach(([n, ms]) => setTimeout(() => this.playBeep(n, 0.24, 0.13), ms));
    } else {
      // Comedic 4th place wah-wah + encouraging ding!
      const notes = [[392, 0], [370, 220], [349, 440], [311, 660], [523, 1020]];
      notes.forEach(([n, ms]) => setTimeout(() => this.playBeep(n, 0.22, 0.12), ms));
    }
  }
}
