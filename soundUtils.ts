
class SoundManager {
  private ctx: AudioContext | null = null;
  private bgMusicSource: OscillatorNode[] = [];
  private bgMusicGain: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private annoyingInterval: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playFlip() {
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playMatch() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.05 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.4);
    });
  }

  playMiss() {
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playShuffle() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const duration = 0.5;
    const osc = this.ctx.createOscillator();
    const noiseGain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + duration / 2);
    osc.frequency.exponentialRampToValueAtTime(440, now + duration);
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.1);
    noiseGain.gain.linearRampToValueAtTime(0, now + duration);
    osc.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  startBackgroundMusic(isAnnoying: boolean = false) {
    this.initCtx();
    if (!this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    const now = this.ctx.currentTime;
    this.bgMusicGain = this.ctx.createGain();
    this.bgMusicGain.gain.setValueAtTime(0, now);
    this.bgMusicGain.gain.linearRampToValueAtTime(0.04, now + 2);
    
    const createOsc = (freq: number, type: OscillatorType) => {
      const osc = this.ctx!.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(this.bgMusicGain!);
      osc.start();
      return osc;
    };

    this.bgMusicSource = [
      createOsc(60, 'sine'),
      createOsc(62, 'sine'),
      createOsc(120, 'sine'),
    ];

    if (isAnnoying) {
      // Add random chaotic beeps
      this.annoyingInterval = window.setInterval(() => {
        if (!this.ctx) return;
        const beep = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        beep.type = 'sawtooth';
        beep.frequency.setValueAtTime(Math.random() * 2000 + 100, this.ctx.currentTime);
        bGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        bGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        beep.connect(bGain);
        bGain.connect(this.ctx.destination);
        beep.start();
        beep.stop(this.ctx.currentTime + 0.1);
      }, 400);
    }

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isAnnoying ? 2000 : 400, now);
    this.bgMusicGain.connect(filter);
    filter.connect(this.ctx.destination);
  }

  stopBackgroundMusic() {
    if (this.annoyingInterval) {
      clearInterval(this.annoyingInterval);
      this.annoyingInterval = null;
    }
    if (!this.ctx || !this.bgMusicGain || !this.isMusicPlaying) return;
    const now = this.ctx.currentTime;
    this.bgMusicGain.gain.cancelScheduledValues(now);
    this.bgMusicGain.gain.setValueAtTime(this.bgMusicGain.gain.value, now);
    this.bgMusicGain.gain.linearRampToValueAtTime(0, now + 1.5);
    this.isMusicPlaying = false;
    setTimeout(() => {
      this.bgMusicSource.forEach(osc => { try { osc.stop(); } catch(e) {} });
      this.bgMusicSource = [];
    }, 1600);
  }

  playWin() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.1);
      gain.gain.setValueAtTime(0.1, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.5);
    });
  }

  playGameOver() {
    this.initCtx();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(20, this.ctx.currentTime + 1);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1);
  }
}
export const sounds = new SoundManager();
