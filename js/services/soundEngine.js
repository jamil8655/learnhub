/**
 * LearnHub Adventure Sound Synthesis Engine (Web Audio API)
 * Zero-dependency, lightweight, high-fidelity procedural audio effects.
 * Designed respectfully with soft harmonic chimes, bells, and gentle feedback tones.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.4; // Soft background ambient level

    // Load user audio preferences
    try {
      const savedMute = localStorage.getItem('learnhub_sound_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch (e) {}
  }

  _initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('learnhub_sound_muted', this.isMuted);
    } catch (e) {}
    if (!this.isMuted) {
      this.playTap();
    }
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    try {
      localStorage.setItem('learnhub_sound_muted', this.isMuted);
    } catch (e) {}
  }

  // 1. Soft UI Tap / Pop
  playTap() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {}
  }

  // 2. Harmonious Correct Answer Chime (Major Triad Chord)
  playCorrect() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      frequencies.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.04);
        gain.gain.linearRampToValueAtTime(this.volume * 0.3, this.ctx.currentTime + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.45);
      });
    } catch (e) {}
  }

  // 3. Gentle Low Thud for Mistake (Non-harsh)
  playWrong() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(this.volume * 0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch (e) {}
  }

  // 4. Sparkling Coin Sound
  playCoin() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, this.ctx.currentTime); // B5
      osc1.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.07); // E6
      osc2.frequency.setValueAtTime(1318.51, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(1760.00, this.ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.36);
      osc2.stop(this.ctx.currentTime + 0.36);
    } catch (e) {}
  }

  // 5. Dynamic Combo Chime (Pitch scales with combo length)
  playCombo(comboCount = 1) {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const baseFreq = 440 + Math.min(comboCount * 45, 600);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  // 6. Star Unlock Swell
  playStar(starIndex = 1) {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const notes = [587.33, 739.99, 880.00]; // D5, F#5, A5
      const freq = notes[Math.min(starIndex - 1, notes.length - 1)] || 880;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(freq * 1.33, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.4, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch (e) {}
  }

  // 7. Power-Up Activated Whistle / Whoosh
  playPowerUp() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.volume * 0.35, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.32);
    } catch (e) {}
  }

  // 8. Royal Victory Fanfare (Celebratory melody)
  playVictory() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    try {
      const sequence = [
        { f: 523.25, t: 0.0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.12 },
        { f: 1046.50, t: 0.36, d: 0.5 }
      ];

      sequence.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, this.ctx.currentTime + item.t);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + item.t);
        gain.gain.linearRampToValueAtTime(this.volume * 0.4, this.ctx.currentTime + item.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + item.t + item.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + item.t);
        osc.stop(this.ctx.currentTime + item.t + item.d + 0.05);
      });
    } catch (e) {}
  }
}

// Global Singleton Sound Engine
window.GameSound = new SoundEngine();
