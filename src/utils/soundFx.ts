import { PERSONALITY_PRESETS, type PersonalityArchetypeId } from '../types/persona';

let audioCtx: AudioContext | null = null;
let musicBoxInterval: number | null = null;
let musicBoxStep = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  durationSec: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.06,
  delaySec = 0,
): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime + delaySec;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + durationSec + 0.02);
}

export function playStudioFx(
  kind: 'chime' | 'heart' | 'shutter' | 'tickle' | 'rose' | 'pop',
  enabled: boolean,
): void {
  if (!enabled) return;
  try {
    switch (kind) {
      case 'chime':
        playTone(587.33, 0.16, 'triangle', 0.045, 0);
        playTone(880, 0.22, 'sine', 0.04, 0.06);
        break;
      case 'heart':
        playTone(523.25, 0.14, 'sine', 0.05, 0);
        playTone(659.25, 0.14, 'sine', 0.05, 0.07);
        playTone(783.99, 0.22, 'triangle', 0.05, 0.14);
        break;
      case 'rose':
        playTone(440, 0.24, 'triangle', 0.045, 0);
        playTone(554.37, 0.24, 'sine', 0.045, 0.08);
        playTone(659.25, 0.28, 'sine', 0.045, 0.16);
        playTone(880, 0.36, 'triangle', 0.04, 0.24);
        break;
      case 'tickle':
        playTone(740, 0.07, 'sine', 0.04, 0);
        playTone(880, 0.07, 'sine', 0.04, 0.06);
        playTone(1046.5, 0.09, 'sine', 0.038, 0.12);
        break;
      case 'shutter':
        playTone(180, 0.045, 'square', 0.04, 0);
        playTone(960, 0.055, 'triangle', 0.035, 0.045);
        break;
      case 'pop':
        playTone(420, 0.07, 'sine', 0.035, 0);
        break;
    }
  } catch {
    // Ignore autoplay errors
  }
}

// Gothic waltz music-box melody (D minor / harmonic minor)
const MUSIC_BOX_NOTES = [
  587.33, 698.46, 880.0, 698.46, 659.25, 587.33,
  554.37, 659.25, 880.0, 659.25, 587.33, 440.0,
  587.33, 698.46, 932.33, 880.0, 698.46, 659.25,
  587.33, 554.37, 587.33, 440.0, 587.33, 0,
];

export function startMusicBoxLoop(soundEnabled: boolean): void {
  stopMusicBoxLoop();
  if (!soundEnabled) return;
  musicBoxStep = 0;
  const playStep = () => {
    const note = MUSIC_BOX_NOTES[musicBoxStep % MUSIC_BOX_NOTES.length];
    musicBoxStep++;
    if (note > 0) {
      playTone(note, 0.42, 'triangle', 0.045, 0);
      playTone(note * 2, 0.26, 'sine', 0.015, 0.01);
    }
  };
  playStep();
  musicBoxInterval = window.setInterval(playStep, 310);
}

export function stopMusicBoxLoop(): void {
  if (musicBoxInterval !== null) {
    window.clearInterval(musicBoxInterval);
    musicBoxInterval = null;
  }
}

export function speakMarionetaReply(
  text: string,
  archetype: PersonalityArchetypeId,
  voiceEnabled: boolean,
): void {
  if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_~`]/g, '').trim();
    if (!clean) return;
    const utter = new SpeechSynthesisUtterance(clean);
    const preset = PERSONALITY_PRESETS[archetype];
    utter.lang = 'es-ES';
    utter.pitch = preset.voicePitch;
    utter.rate = preset.voiceRate;
    utter.volume = 0.85;

    const voices = window.speechSynthesis.getVoices();
    const spanishFemale =
      voices.find((v) => v.lang.toLowerCase().startsWith('es') && /female|paulina|monica|helena|sabina|lucia|sofia|google español/i.test(v.name)) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('es'));
    if (spanishFemale) {
      utter.voice = spanishFemale;
    }
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore speech synthesis errors
  }
}

export function stopMarionetaVoice(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}
