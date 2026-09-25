/**
 * Luxury Acoustic Chime Synthesizer
 * Uses Web Audio API to synthesize a high-frequency crystal coupe chime.
 * Works natively in all modern browsers (iOS Safari, Android Chrome, Desktop)
 * without external audio files or network requests.
 */

export const playLuxuryChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First fundamental tone (Crystal Bell shimmer)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1046.5, now); // C6
    osc1.frequency.exponentialRampToValueAtTime(2093.0, now + 0.35); // C7

    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Harmonic overtone (24k Gold resonance)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1567.98, now); // G6
    osc2.frequency.exponentialRampToValueAtTime(3135.96, now + 0.45); // G7

    gain2.gain.setValueAtTime(0.12, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.9);
    osc2.stop(now + 1.0);
  } catch (err) {
    // Suppress if browser requires initial user interaction before audio
    console.debug('Audio playback skipped:', err);
  }
};
