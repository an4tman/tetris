// Sound effect frequencies and durations
const SOUNDS = {
  MOVE: { frequency: 220, duration: 0.05 },      // Low A note, very short
  ROTATE: { frequency: 330, duration: 0.05 },    // Higher E note, very short
  LAND: { frequency: 440, duration: 0.1 },       // A4 note, short
  LINE: { frequency: 587.33, duration: 0.2 },    // D5 note, medium
  LEVEL_UP: {                                    // Ascending notes
    frequencies: [440, 554.37, 659.25, 880],
    duration: 0.1
  },
  GAME_OVER: {                                   // Descending notes
    frequencies: [440, 349.23, 293.66, 220],
    duration: 0.2
  },
  HARD_DROP: { frequency: 880, duration: 0.1 },  // A5 note, short
  PAUSE: { frequency: 523.25, duration: 0.15 }   // C5 note, medium
};

class SoundManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;
  private isMuted = false;

  private initialize() {
    if (!this.isInitialized) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.isInitialized = true;
    }
  }

  private playTone(frequency: number, duration: number) {
    if (this.isMuted || !this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // Create a gain node for this specific tone
    const toneGain = this.audioContext.createGain();
    toneGain.gain.setValueAtTime(0.1, this.audioContext.currentTime); // Lower volume
    toneGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.connect(toneGain);
    toneGain.connect(this.gainNode);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private playSequence(frequencies: number[], duration: number) {
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, duration);
      }, index * duration * 1000);
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  move() {
    this.initialize();
    this.playTone(SOUNDS.MOVE.frequency, SOUNDS.MOVE.duration);
  }

  rotate() {
    this.initialize();
    this.playTone(SOUNDS.ROTATE.frequency, SOUNDS.ROTATE.duration);
  }

  land() {
    this.initialize();
    this.playTone(SOUNDS.LAND.frequency, SOUNDS.LAND.duration);
  }

  line() {
    this.initialize();
    this.playTone(SOUNDS.LINE.frequency, SOUNDS.LINE.duration);
  }

  levelUp() {
    this.initialize();
    this.playSequence(SOUNDS.LEVEL_UP.frequencies, SOUNDS.LEVEL_UP.duration);
  }

  gameOver() {
    this.initialize();
    this.playSequence(SOUNDS.GAME_OVER.frequencies, SOUNDS.GAME_OVER.duration);
  }

  hardDrop() {
    this.initialize();
    this.playTone(SOUNDS.HARD_DROP.frequency, SOUNDS.HARD_DROP.duration);
  }

  pause() {
    this.initialize();
    this.playTone(SOUNDS.PAUSE.frequency, SOUNDS.PAUSE.duration);
  }
}

export const soundManager = new SoundManager();