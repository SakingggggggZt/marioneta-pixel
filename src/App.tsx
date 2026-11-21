import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Feather,
  MessageSquare,
  Music,
  SlidersHorizontal,
  Sparkles,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  createPixelAvatarEngine,
  SUIT_MATERIALS,
  W,
  H,
  type AvatarAction,
  type AvatarAnimation,
  type AvatarMood,
  type AvatarRigPose,
  type AvatarSnapshot,
  type AvatarSuit,
  type AvatarView,
  type InteractionEvent,
  type PixelAvatarEngine,
} from './engine/pixelAvatarEngine';
import {
  REACTIVE_COOLDOWN_MS,
  requestMarionetaReaction,
  sendMarionetaChat,
  type ChatMessage,
  type MarionetaAIResponse,
} from './services/marionetaAI';
import {
  DEFAULT_PERSONA_CONFIG,
  DEFAULT_RELATIONSHIP_STATS,
  DEFAULT_USER_PROFILE,
  getRelationshipRank,
  PERSONALITY_PRESETS,
  type PersonaConfig,
  type RelationshipStats,
  type StageThemeId,
  type UserProfile,
} from './types/persona';
import {
  playStudioFx,
  speakMarionetaReply,
  startMusicBoxLoop,
  stopMarionetaVoice,
  stopMusicBoxLoop,
} from './utils/soundFx';
import { PixelSpeechBubble } from './components/PixelSpeechBubble';
import { ChatPanel } from './components/ChatPanel';
import { RigStudioPanel } from './components/RigStudioPanel';
import { PersonaProfilePanel } from './components/PersonaProfilePanel';

const STORAGE_KEYS = {
  persona: 'marioneta_persona_v2',
  user: 'marioneta_user_v2',
  stats: 'marioneta_stats_v2',
  audio: 'marioneta_audio_v2',
};

function readStoredJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    return fallback;
  }
}

const VIEW_TITLES: Record<AvatarView, string> = {
  front: 'VISTA FRONTAL',
  side: 'VISTA LATERAL',
  back: 'VISTA TRASERA',
};

const VIEW_LABELS: Record<AvatarView, string> = {
  front: 'Frontal',
  side: 'Lateral',
  back: 'Trasera',
};

const SUIT_LABELS: Record<AvatarSuit, string> = {
  original: 'Original',
  maid: 'Maid',
  marfil: 'Marfil',
  none: 'Sin Traje',
};

const ACTION_LABELS: Record<AvatarAction, string> = {
  bounceBust: 'Rebote busto',
  bounceGlutes: 'Rebote glúteos',
  wave: 'Onda física',
  cubeHit: 'Golpe cubo',
  happy: 'Alegría',
  feed: 'Cupcake',
  breeze: 'Brisa',
  dance: 'Baile',
  spin: 'Giro 360°',
  giggle: 'Risita',
  tease: 'Coqueteo',
  nod: 'Asentir',
  shakeHead: 'Negar',
  stretch: 'Estirarse',
  jump: 'Salto',
  waveHand: 'Saludo',
  blowKiss: 'Beso con mano',
  curtsy: 'Reverencia',
  hipSway: 'Meneo caderas',
  strut: 'Pasarela',
  cheer: 'Celebrar',
  pout: 'Puchero',
  peekaboo: 'Esconderse',
  shiver: 'Escalofrío',
  bow: 'Inclinarse',
  wink: 'Guiño',
  showOff: 'Exhibición 360°',
  thumbsUp: 'Pulgar 👍',
  crouch: 'Agacharse',
  elbowsIn: 'Juntar codos',
  raiseLeftHand: 'Mano izq.',
  raiseRightHand: 'Mano der.',
  peaceSign: 'Paz ✌️',
  pointFinger: 'Señalar ☝️',
  rockSign: 'Rock 🤘',
  handsOnHips: 'Manos cintura',
  crossArms: 'Cruzar brazos',
  coverFace: 'Tapar rostro',
  liftLeg: 'Levantar pierna',
  heartHands: 'Corazón 🫶',
  salute: 'Saludo 🫡',
  catPaws: 'Gatita 🐾',
  tickle: 'Cosquillas',
  shyFingers: 'Deditos tímidos',
  giveRose: 'Rosa gótica 🌹',
  photoPose: 'Pose foto 📸',
  undressSuit: 'Quitarse traje',
  dressSuit: 'Ponerse traje',
  slipStrap: 'Deslizar tirante',
  toggleGloves: 'Guantes',
  toggleStockings: 'Medias',
  toggleGarters: 'Ligueros',
  toggleChoker: 'Gargantilla',
};

const ANIMATION_LABELS: Record<AvatarAnimation, string> = {
  idle: 'Reposo',
  happy: 'Alegre',
  petted: 'Mimada',
  shy: 'Tímida',
  surprised: 'Sorpresa',
  eat: 'Comiendo',
  breeze: 'Brisa',
  outfit_pose: 'Pose',
  dance: 'Bailando',
  nod: 'Asintiendo',
  shake_head: 'Negando',
  giggle: 'Riendo',
  tease: 'Coqueta',
  stretch: 'Estirándose',
  talk: 'Hablando',
  wave_hand: 'Saludando',
  blow_kiss: 'Beso mano',
  curtsy: 'Reverencia',
  hip_sway: 'Caderas',
  strut: 'Desfilando',
  cheer: 'Celebrando',
  pout: 'Puchero',
  peekaboo: 'Asomándose',
  shiver: 'Temblando',
  bow: 'Reverencia',
  wink: 'Guiñando',
  thumbs_up: 'Pulgar 👍',
  crouch: 'Agachada',
  elbows_in: 'Codos juntos',
  raise_left_hand: 'Mano izq.',
  raise_right_hand: 'Mano der.',
  peace_sign: 'Paz ✌️',
  point_finger: 'Señalando',
  rock_sign: 'Rock 🤘',
  hands_on_hips: 'Manos cintura',
  cross_arms: 'Brazos cruzados',
  cover_face: 'Rostro cubierto',
  lift_leg: 'Pierna arriba',
  heart_hands: 'Corazón 🫶',
  salute: 'Saludo 🫡',
  cat_paws: 'Gatita 🐾',
  tickled: 'Cosquillas',
  shy_fingers: 'Tímida 👉👈',
  music_sway: 'Vals musical',
  rose_blush: 'Rosa gótica',
};

const INITIAL_SNAPSHOT: AvatarSnapshot = {
  fps: 60,
  view: 'front',
  suit: 'original',
  suitTag: SUIT_MATERIALS.original.tag,
  zipper: 0,
  bra: true,
  panties: true,
  stockings: true,
  garters: true,
  gloves: true,
  choker: false,
  strapSlip: 'none',
  isChangingClothes: false,
  handEnabled: true,
  featherEnabled: false,
  cubeEnabled: false,
  pullFabric: false,
  animationsEnabled: true,
  musicBoxEnabled: false,
  stageTheme: 'gothic',
  currentAnimation: 'idle',
  mood: 'Tranquila',
  affection: 74,
  blush: 15,
  zoneLabel: '—',
  hintDismissed: false,
  lastInteractionEvent: null,
  manualRigActive: false,
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'model',
    text: 'Buenas noches… soy Marioneta. Puedes personalizar mi carácter, mover mi Rig 2D, probar la pluma o hablar conmigo.',
    mood: 'Tranquila',
  },
];

function getMoodTextColor(mood: AvatarMood): string {
  switch (mood) {
    case 'Feliz':
    case 'Juguetona':
      return 'text-[#5de0b2]';
    case 'Sorprendida':
    case 'Traviesa':
      return 'text-[#e8c674]';
    case 'Ruborizada':
    case 'Mimada':
      return 'text-[#ff85a1]';
    default:
      return 'text-[#d8c7ff]';
  }
}

function buildEffectSummary(res: MarionetaAIResponse): string | undefined {
  const parts: string[] = [];
  if (res.animateUndress) parts.push('Quitarse traje (Animado)');
  else if (res.animateDressSuit) parts.push(`Vestirse: ${SUIT_LABELS[res.animateDressSuit]}`);
  else if (res.changeSuit) parts.push(`Traje: ${SUIT_LABELS[res.changeSuit]}`);
  if (res.changeView) parts.push(`Vista: ${VIEW_LABELS[res.changeView]}`);
  if (typeof res.changeZipper === 'number') parts.push(`Cremallera: ${res.changeZipper}%`);
  if (res.changeLingerie) {
    if (typeof res.changeLingerie.bra === 'boolean') parts.push(`Sostén: ${res.changeLingerie.bra ? 'ON' : 'OFF'}`);
    if (typeof res.changeLingerie.panties === 'boolean') parts.push(`Braga: ${res.changeLingerie.panties ? 'ON' : 'OFF'}`);
    if (typeof res.changeLingerie.stockings === 'boolean') parts.push(`Medias: ${res.changeLingerie.stockings ? 'ON' : 'OFF'}`);
    if (typeof res.changeLingerie.garters === 'boolean') parts.push(`Ligueros: ${res.changeLingerie.garters ? 'ON' : 'OFF'}`);
    if (typeof res.changeLingerie.gloves === 'boolean') parts.push(`Guantes: ${res.changeLingerie.gloves ? 'ON' : 'OFF'}`);
    if (typeof res.changeLingerie.choker === 'boolean') parts.push(`Choker: ${res.changeLingerie.choker ? 'ON' : 'OFF'}`);
    if (res.changeLingerie.strapSlip) {
      parts.push(
        `Tirantes: ${
          res.changeLingerie.strapSlip === 'none'
            ? 'Ajustados'
            : res.changeLingerie.strapSlip === 'left'
              ? '1 caído'
              : 'Ambos caídos'
        }`,
      );
    }
  }
  if (res.action && res.action !== 'none') parts.push(`Acción: ${ACTION_LABELS[res.action]}`);
  if (res.secondaryAction && res.secondaryAction !== 'none') {
    parts.push(`+ ${ACTION_LABELS[res.secondaryAction]}`);
  }
  if (res.choreography && res.choreography.length > 0) {
    parts.push(`Coreografía (${res.choreography.length} pasos)`);
  }
  if (res.rigPose) {
    const rigTags: string[] = [];
    if (res.rigPose.handL && res.rigPose.handL !== 'open') rigTags.push(`Izq: ${res.rigPose.handL}`);
    if (res.rigPose.handR && res.rigPose.handR !== 'open') rigTags.push(`Der: ${res.rigPose.handR}`);
    if (typeof res.rigPose.crouch === 'number' && res.rigPose.crouch > 0.2) rigTags.push('Rodillas');
    if (typeof res.rigPose.elbowL === 'number' || typeof res.rigPose.elbowR === 'number') rigTags.push('Codos');
    if (rigTags.length > 0) parts.push(`Rig 2D (${rigTags.join(', ')})`);
  }
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

type HudTab = 'controls' | 'rig' | 'persona' | 'chat';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<PixelAvatarEngine | null>(null);

  const [snapshot, setSnapshot] = useState<AvatarSnapshot>(INITIAL_SNAPSHOT);
  const [activeTab, setActiveTab] = useState<HudTab>('controls');
  const [reactiveAI, setReactiveAI] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [bubbleText, setBubbleText] = useState<string | null>(
    'Buenas noches… prueba mis gestos, la pluma de cosquillas, el Rig 2D o háblame en Chat.',
  );
  const [bubbleMood, setBubbleMood] = useState<AvatarMood>('Tranquila');

  const [personaConfig, setPersonaConfig] = useState<PersonaConfig>(() =>
    readStoredJson(STORAGE_KEYS.persona, DEFAULT_PERSONA_CONFIG),
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    readStoredJson(STORAGE_KEYS.user, DEFAULT_USER_PROFILE),
  );
  const [relationshipStats, setRelationshipStats] = useState<RelationshipStats>(() =>
    readStoredJson(STORAGE_KEYS.stats, DEFAULT_RELATIONSHIP_STATS),
  );
  const [audioPrefs, setAudioPrefs] = useState<{ sound: boolean; voice: boolean }>(() =>
    readStoredJson(STORAGE_KEYS.audio, { sound: true, voice: false }),
  );
  const [manualRigPose, setManualRigPose] = useState<AvatarRigPose>({
    shoulderL: 0,
    shoulderR: 0,
    elbowL: 0,
    elbowR: 0,
    handL: 'open',
    handR: 'open',
    torsoTilt: 0,
    hipSway: 0,
    crouch: 0,
    headTilt: 0,
    eyeLookX: 0,
    eyeLookY: 0,
    mouthShape: 'neutral',
  });

  const reactiveAIRef = useRef(reactiveAI);
  const isSendingRef = useRef(isSending);
  const messagesRef = useRef(messages);
  const personaRef = useRef(personaConfig);
  const userProfileRef = useRef(userProfile);
  const statsRef = useRef(relationshipStats);
  const audioRef = useRef(audioPrefs);
  const lastReactionAtRef = useRef(0);
  const bubbleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    reactiveAIRef.current = reactiveAI;
  }, [reactiveAI]);
  useEffect(() => {
    isSendingRef.current = isSending;
  }, [isSending]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    personaRef.current = personaConfig;
    try {
      window.localStorage.setItem(STORAGE_KEYS.persona, JSON.stringify(personaConfig));
    } catch {
      // ignore quota errors
    }
    engineRef.current?.setExpressiveness(0.6 + (personaConfig.expressiveness / 100) * 0.7);
    engineRef.current?.setSensitivity(0.5 + (personaConfig.sensitivity / 100) * 0.9);
  }, [personaConfig]);
  useEffect(() => {
    userProfileRef.current = userProfile;
    try {
      window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);
  useEffect(() => {
    statsRef.current = relationshipStats;
    try {
      window.localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(relationshipStats));
    } catch {
      // ignore
    }
  }, [relationshipStats]);
  useEffect(() => {
    audioRef.current = audioPrefs;
    try {
      window.localStorage.setItem(STORAGE_KEYS.audio, JSON.stringify(audioPrefs));
    } catch {
      // ignore
    }
    if (!audioPrefs.voice) {
      stopMarionetaVoice();
    }
    if (!audioPrefs.sound) {
      stopMusicBoxLoop();
    } else if (snapshot.musicBoxEnabled) {
      startMusicBoxLoop(true);
    }
  }, [audioPrefs, snapshot.musicBoxEnabled]);

  useEffect(() => {
    if (snapshot.musicBoxEnabled && audioPrefs.sound) {
      startMusicBoxLoop(true);
    } else {
      stopMusicBoxLoop();
    }
    return () => {
      stopMusicBoxLoop();
    };
  }, [snapshot.musicBoxEnabled, audioPrefs.sound]);

  const showSpeechBubble = useCallback((text: string, mood: AvatarMood, durationMs = 8800) => {
    setBubbleText(text);
    setBubbleMood(mood);
    if (bubbleTimerRef.current !== null) {
      window.clearTimeout(bubbleTimerRef.current);
    }
    bubbleTimerRef.current = window.setTimeout(() => {
      setBubbleText(null);
      bubbleTimerRef.current = null;
    }, durationMs);
  }, []);

  const dismissBubble = useCallback(() => {
    if (bubbleTimerRef.current !== null) {
      window.clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }
    setBubbleText(null);
  }, []);

  const bumpStats = useCallback(
    (patch: { trustDelta?: number; energyDelta?: number; isGift?: boolean; countInteraction?: boolean }) => {
      setRelationshipStats((prev) => ({
        trust: Math.max(0, Math.min(100, prev.trust + (patch.trustDelta ?? 0))),
        energy: Math.max(10, Math.min(100, prev.energy + (patch.energyDelta ?? 0))),
        interactionsCount: prev.interactionsCount + (patch.countInteraction ? 1 : 0),
        giftsGiven: prev.giftsGiven + (patch.isGift ? 1 : 0),
      }));
    },
    [],
  );

  const handleEngineInteraction = useCallback(
    (event: InteractionEvent, currentSnap: AvatarSnapshot) => {
      // Subtle local sound FX & relationship updates
      if (event.type === 'tickle') playStudioFx('tickle', audioRef.current.sound);
      else if (event.type === 'rose') playStudioFx('rose', audioRef.current.sound);
      else if (event.type === 'feed' || event.type === 'happy' || event.type === 'undress_suit' || event.type === 'slip_strap' || event.type === 'hold_hand') {
        playStudioFx('heart', audioRef.current.sound);
      } else if (event.type === 'photo') playStudioFx('shutter', audioRef.current.sound);
      else if (event.type === 'dress_suit' || event.type === 'bra_clasp' || event.type === 'tug_garter' || event.type === 'toggle_gloves') {
        playStudioFx('chime', audioRef.current.sound);
      }

      bumpStats({
        trustDelta: event.type === 'rose' ? 4 : event.type === 'feed' ? 3 : 1,
        energyDelta: event.type === 'feed' ? 8 : event.type === 'rose' ? 5 : -1,
        isGift: event.type === 'feed' || event.type === 'rose',
        countInteraction: true,
      });

      if (!reactiveAIRef.current || isSendingRef.current) return;
      const now = Date.now();
      if (now - lastReactionAtRef.current < REACTIVE_COOLDOWN_MS) return;

      lastReactionAtRef.current = now;
      isSendingRef.current = true;
      setIsSending(true);

      void requestMarionetaReaction(event, currentSnap, messagesRef.current, {
        personaConfig: personaRef.current,
        userProfile: userProfileRef.current,
        relationshipStats: statsRef.current,
      })
        .then((res) => {
          if (!res) return;
          engineRef.current?.applyAIReaction({
            mood: res.mood,
            affectionDelta: res.affectionDelta,
            blushDelta: res.blushDelta,
            action: res.action,
            secondaryAction: res.secondaryAction,
            animation: res.animation,
            changeSuit: res.changeSuit,
            animateUndress: res.animateUndress,
            animateDressSuit: res.animateDressSuit,
            changeView: res.changeView,
            changeZipper: res.changeZipper,
            changeLingerie: res.changeLingerie,
            rigPose: res.rigPose,
            choreography: res.choreography,
            spawnEffect: res.spawnEffect,
          });
          if (res.trustDelta) {
            bumpStats({ trustDelta: res.trustDelta });
          }
          showSpeechBubble(res.reply, res.mood);
          speakMarionetaReply(res.reply, personaRef.current.archetype, audioRef.current.voice);
          setMessages((prev) => [
            ...prev.slice(-28),
            {
              id: `react-${Date.now()}`,
              role: 'model',
              text: res.reply,
              mood: res.mood,
              provider: res.provider,
              effectSummary: buildEffectSummary(res),
            },
          ]);
        })
        .finally(() => {
          isSendingRef.current = false;
          setIsSending(false);
        });
    },
    [bumpStats, showSpeechBubble],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createPixelAvatarEngine(canvas, {
      onSnapshot: (nextSnap) => setSnapshot(nextSnap),
      onInteraction: handleEngineInteraction,
    });
    engine.setExpressiveness(0.6 + (personaRef.current.expressiveness / 100) * 0.7);
    engine.setSensitivity(0.5 + (personaRef.current.sensitivity / 100) * 0.9);
    engineRef.current = engine;

    return () => {
      stopMusicBoxLoop();
      stopMarionetaVoice();
      engine.destroy();
      engineRef.current = null;
      if (bubbleTimerRef.current !== null) {
        window.clearTimeout(bubbleTimerRef.current);
      }
    };
  }, [handleEngineInteraction]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (isSendingRef.current) return;
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text,
      };
      const nextHistory = [...messagesRef.current, userMsg];
      setMessages(nextHistory);

      isSendingRef.current = true;
      setIsSending(true);
      lastReactionAtRef.current = Date.now();

      try {
        const currentSnap = engineRef.current?.getSnapshot() ?? snapshot;
        const res = await sendMarionetaChat(text, currentSnap, nextHistory, {
          personaConfig: personaRef.current,
          userProfile: userProfileRef.current,
          relationshipStats: statsRef.current,
        });
        engineRef.current?.applyAIReaction({
          mood: res.mood,
          affectionDelta: res.affectionDelta,
          blushDelta: res.blushDelta,
          action: res.action,
          secondaryAction: res.secondaryAction,
          animation: res.animation,
          changeSuit: res.changeSuit,
          animateUndress: res.animateUndress,
          animateDressSuit: res.animateDressSuit,
          changeView: res.changeView,
          changeZipper: res.changeZipper,
          changeLingerie: res.changeLingerie,
          rigPose: res.rigPose,
          choreography: res.choreography,
          spawnEffect: res.spawnEffect,
        });
        bumpStats({
          trustDelta: res.trustDelta ?? 2,
          energyDelta: 1,
          countInteraction: true,
        });
        playStudioFx('chime', audioRef.current.sound);
        showSpeechBubble(res.reply, res.mood, 10000);
        speakMarionetaReply(res.reply, personaRef.current.archetype, audioRef.current.voice);
        setMessages((prev) => [
          ...prev.slice(-30),
          {
            id: `model-${Date.now()}`,
            role: 'model',
            text: res.reply,
            mood: res.mood,
            provider: res.provider,
            effectSummary: buildEffectSummary(res),
          },
        ]);
      } catch (err) {
        const errMsg =
          err instanceof Error
            ? err.message
            : 'No se pudo obtener respuesta de los modelos de IA.';
        setMessages((prev) => [
          ...prev.slice(-30),
          {
            id: `err-${Date.now()}`,
            role: 'model',
            text: errMsg,
            isError: true,
          },
        ]);
      } finally {
        isSendingRef.current = false;
        setIsSending(false);
      }
    },
    [bumpStats, showSpeechBubble, snapshot],
  );

  const handleManualRigChange = useCallback((nextPose: AvatarRigPose) => {
    setManualRigPose(nextPose);
    engineRef.current?.setManualRigPose(nextPose);
  }, []);

  const handleResetManualRig = useCallback(() => {
    const neutral: AvatarRigPose = {
      shoulderL: 0,
      shoulderR: 0,
      elbowL: 0,
      elbowR: 0,
      handL: 'open',
      handR: 'open',
      torsoTilt: 0,
      hipSway: 0,
      crouch: 0,
      headTilt: 0,
      eyeLookX: 0,
      eyeLookY: 0,
      mouthShape: 'neutral',
    };
    setManualRigPose(neutral);
    engineRef.current?.setManualRigPose(null);
  }, []);

  const handleTakePhoto = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.triggerAction('photoPose');
    playStudioFx('shutter', audioRef.current.sound);
    window.setTimeout(() => {
      const dataUrl = engine.captureSnapshotPng();
      if (!dataUrl) return;
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `marioneta-${snapshot.suit}-${snapshot.view}.png`;
      a.click();
    }, 180);
  }, [snapshot.suit, snapshot.view]);

  const rank = getRelationshipRank(snapshot.affection, relationshipStats.trust);
  const currentPreset = PERSONALITY_PRESETS[personaConfig.archetype];
  const zipperDisabled = snapshot.suit === 'none' || snapshot.view !== 'front';
  const zipperHint =
    snapshot.suit === 'none'
      ? 'Activa un traje superior para usar la cremallera.'
      : snapshot.view !== 'front'
        ? 'Cambia a Vista Frontal para abrir la cremallera.'
        : 'Arrastra el slider o el tirador metálico en el pecho.';

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1180px] flex-col items-center justify-center gap-3.5 p-2.5 md:flex-row md:items-stretch md:gap-4 md:p-3.5">
      {/* Left: Interactive Pixel Art Stage (280x360 preserved 100%) */}
      <section
        className="flex min-w-0 flex-1 flex-col items-center justify-center"
        aria-label="Visor Interactivo Pixel Art"
      >
        <div
          className="relative flex w-full max-w-[600px] items-center justify-center overflow-hidden rounded-[14px] border-2 border-[#3c375e] bg-[#181826]"
          style={{
            aspectRatio: '280 / 360',
            maxHeight: 'calc(100vh - 34px)',
            boxShadow:
              '0 18px 50px rgba(0,0,0,.65), inset 0 0 0 1px rgba(255,255,255,.05), 0 0 28px rgba(155,110,232,.14)',
          }}
        >
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className={`pixel-canvas block h-full w-full ${
              snapshot.handEnabled || snapshot.featherEnabled ? 'hand-active' : ''
            }`}
          />

          {/* Stage Top-Left Clean Inline Readout */}
          <div className="pointer-events-none absolute top-2.5 left-3 flex items-center gap-1.5 rounded-md bg-[#12111e]/75 px-2 py-1 font-mono text-[10.5px] tracking-[0.4px] text-[#f2f1fa] backdrop-blur-xs">
            <span>{VIEW_TITLES[snapshot.view]}</span>
            <span className="opacity-45">·</span>
            <span className="tabular-nums text-[#a8a4c4]">{snapshot.fps} FPS</span>
          </div>

          {/* Stage Top-Right Clean Zone Readout */}
          <div className="pointer-events-none absolute top-2.5 right-3 rounded-md bg-[#12111e]/75 px-2 py-1 font-mono text-[10.5px] text-[#cfcbe8] backdrop-blur-xs">
            {snapshot.zoneLabel}
          </div>

          {/* Discreet Pixel-Art Dialogue Bubble */}
          <PixelSpeechBubble
            text={bubbleText}
            mood={bubbleMood}
            thinking={isSending}
            onDismiss={dismissBubble}
          />

          {/* Stage Bottom Interaction Hint */}
          {!bubbleText && !isSending && !snapshot.hintDismissed && (
            <div className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#12111e]/80 px-2.5 py-1 text-[10.5px] text-[#cfcbe8] backdrop-blur-xs">
              Arrastra sus brazos, cintura, acaricia o abre el Rig 2D
            </div>
          )}
        </div>
      </section>

      {/* Right: Gothic HUD Side Panel with 4 Clean Tabs */}
      <aside
        className="hud-scroll flex w-full max-w-[520px] shrink-0 flex-col gap-2.5 self-center rounded-[14px] border-2 border-[#3c375e] p-3 shadow-[0_14px_36px_rgba(0,0,0,0.5)] md:max-h-[calc(100vh-28px)] md:w-[362px] md:overflow-y-auto"
        style={{
          background:
            'linear-gradient(180deg, rgba(28,26,45,0.96) 0%, rgba(20,19,34,0.98) 100%)',
        }}
        aria-label="Panel de Control, Rig 2D, Personalidad y Chat IA"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#9b6ee8]/25 pb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[14px] font-extrabold tracking-[0.6px]">
              <span
                className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] text-[12px] shadow-[0_0_10px_rgba(155,110,232,0.35)]"
                style={{
                  background: 'linear-gradient(135deg, #9b6ee8, #e02446)',
                }}
              >
                ✦
              </span>
              <span className="truncate">MARIONETA PIXEL</span>
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-[#a8a4c4]">
              {currentPreset.label} · {rank.title}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleTakePhoto}
              title="Capturar foto PNG"
              aria-label="Capturar foto PNG"
              className="gothic-btn px-2 py-1.5"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setAudioPrefs((p) => ({ ...p, sound: !p.sound }))}
              title={audioPrefs.sound ? 'Silenciar FX' : 'Activar FX'}
              aria-label={audioPrefs.sound ? 'Silenciar FX' : 'Activar FX'}
              className={`gothic-btn px-2 py-1.5 ${audioPrefs.sound ? 'active' : ''}`}
            >
              {audioPrefs.sound ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <VolumeX className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </header>

        {/* Clean 4-Tab Segmented Bar */}
        <div
          className="grid grid-cols-4 gap-1 rounded-[9px] border border-[#3c375e]/70 bg-[#141322] p-1"
          role="tablist"
          aria-label="Secciones del panel"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'controls'}
            onClick={() => setActiveTab('controls')}
            className={`gothic-btn whitespace-nowrap px-1 py-1.5 text-[10.5px] ${
              activeTab === 'controls' ? 'active' : ''
            }`}
          >
            <SlidersHorizontal className="h-3 w-3 shrink-0" />
            <span>Escena</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rig'}
            onClick={() => setActiveTab('rig')}
            className={`gothic-btn whitespace-nowrap px-1 py-1.5 text-[10.5px] ${
              activeTab === 'rig' ? 'active' : ''
            }`}
          >
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>Rig 2D</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'persona'}
            onClick={() => setActiveTab('persona')}
            className={`gothic-btn whitespace-nowrap px-1 py-1.5 text-[10.5px] ${
              activeTab === 'persona' ? 'active' : ''
            }`}
          >
            <User className="h-3 w-3 shrink-0" />
            <span>Perfil</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            className={`gothic-btn whitespace-nowrap px-1 py-1.5 text-[10.5px] ${
              activeTab === 'chat' ? 'active' : ''
            }`}
          >
            <MessageSquare className="h-3 w-3 shrink-0" />
            <span>Chat</span>
          </button>
        </div>

        {activeTab === 'controls' && (
          <>
            {/* Section 1: Estado y Regalos */}
            <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                <span>Estado Tamagotchi</span>
                <span className={`font-mono text-[11px] font-bold normal-case tracking-normal ${getMoodTextColor(snapshot.mood)}`}>
                  {snapshot.mood}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 flex justify-between text-[10.5px] text-[#a8a4c4]">
                    <span>Afecto</span>
                    <strong className="text-[#f2f1fa] tabular-nums">{snapshot.affection}%</strong>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full border border-white/[0.08] bg-[#12111d]">
                    <div
                      className="h-full rounded-full transition-[width] duration-250 ease-out"
                      style={{
                        width: `${snapshot.affection}%`,
                        background: 'linear-gradient(90deg, #9b6ee8 0%, #e02446 100%)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-[10.5px] text-[#a8a4c4]">
                    <span>Rubor</span>
                    <strong className="text-[#f2f1fa] tabular-nums">{snapshot.blush}%</strong>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full border border-white/[0.08] bg-[#12111d]">
                    <div
                      className="h-full rounded-full transition-[width] duration-250 ease-out"
                      style={{
                        width: `${snapshot.blush}%`,
                        background: 'linear-gradient(90deg, #ff7a99 0%, #e02446 100%)',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  className="gothic-btn cherry whitespace-nowrap px-1.5"
                  onClick={() => engineRef.current?.triggerAction('happy')}
                >
                  ♥ Alegrar
                </button>
                <button
                  type="button"
                  className="gothic-btn whitespace-nowrap px-1.5"
                  onClick={() => engineRef.current?.triggerAction('feed')}
                >
                  🧁 Cupcake
                </button>
                <button
                  type="button"
                  className="gothic-btn cherry whitespace-nowrap px-1.5"
                  onClick={() => engineRef.current?.triggerAction('giveRose')}
                >
                  🌹 Rosa
                </button>
              </div>
            </section>

            {/* Section 2: Herramientas Interactivas y Cámara */}
            <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                <span>Herramientas y Cámara</span>
                <button
                  type="button"
                  onClick={() =>
                    engineRef.current?.setTools({ animationsEnabled: !snapshot.animationsEnabled })
                  }
                  className="cursor-pointer font-mono text-[10px] font-semibold normal-case tracking-normal text-[#5de0b2] hover:underline"
                >
                  Anim: {snapshot.animationsEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  className={`gothic-btn whitespace-nowrap px-1 py-1.5 text-[10.5px] ${
                    snapshot.handEnabled ? 'active' : ''
                  }`}
                  onClick={() =>
                    engineRef.current?.setTools({
                      handEnabled: !snapshot.handEnabled,
                      featherEnabled: false,
                    })
                  }
                >
                  Mano
                </button>
                <button
                  type="button"
                  className={`gothic-btn whitespace-nowrap px-1 py-1.5 text-[10.5px] ${
                    snapshot.featherEnabled ? 'active' : ''
                  }`}
                  onClick={() =>
                    engineRef.current?.setTools({
                      featherEnabled: !snapshot.featherEnabled,
                      handEnabled: false,
                    })
                  }
                >
                  <Feather className="h-3 w-3 shrink-0" />
                  <span>Pluma</span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn whitespace-nowrap px-1 py-1.5 text-[10.5px] ${
                    snapshot.cubeEnabled ? 'active' : ''
                  }`}
                  onClick={() =>
                    engineRef.current?.setTools({ cubeEnabled: !snapshot.cubeEnabled })
                  }
                >
                  Cubo
                </button>
                <button
                  type="button"
                  className={`gothic-btn gold whitespace-nowrap px-1 py-1.5 text-[10.5px] ${
                    snapshot.musicBoxEnabled ? 'active' : ''
                  }`}
                  onClick={() =>
                    engineRef.current?.setTools({ musicBoxEnabled: !snapshot.musicBoxEnabled })
                  }
                >
                  <Music className="h-3 w-3 shrink-0" />
                  <span>Vals</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {(['front', 'side', 'back'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`gothic-btn ${snapshot.view === v ? 'active' : ''}`}
                    onClick={() => engineRef.current?.setView(v)}
                  >
                    {VIEW_LABELS[v]}
                  </button>
                ))}
              </div>
            </section>

            {/* Section 3: Animaciones, Gestos y Físicas */}
            <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                <span>Poses, Gestos y Físicas</span>
                <span className="font-mono text-[9.5px] font-semibold text-[#5de0b2]">
                  {ANIMATION_LABELS[snapshot.currentAnimation].toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  className="gothic-btn"
                  onClick={() => engineRef.current?.triggerAction('bounceBust')}
                >
                  Rebote Busto
                </button>
                <button
                  type="button"
                  className="gothic-btn"
                  onClick={() => engineRef.current?.triggerAction('bounceGlutes')}
                >
                  Rebote Glúteos
                </button>
                <button
                  type="button"
                  className="gothic-btn"
                  onClick={() => engineRef.current?.triggerAction('wave')}
                >
                  Onda Física
                </button>
                <button
                  type="button"
                  className="gothic-btn"
                  onClick={() => engineRef.current?.triggerAction('cubeHit')}
                >
                  Golpe Cubo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    ['heartHands', 'heart_hands', '🫶 Corazón'],
                    ['salute', 'salute', '🫡 Saludo'],
                    ['catPaws', 'cat_paws', '🐾 Gatita'],
                    ['shyFingers', 'shy_fingers', '👉👈 Tímida'],
                    ['thumbsUp', 'thumbs_up', '👍 Pulgar'],
                    ['peaceSign', 'peace_sign', '✌️ Paz'],
                    ['crouch', 'crouch', 'Agacharse'],
                    ['jump', 'happy', 'Saltar'],
                    ['elbowsIn', 'elbows_in', 'Codos'],
                    ['blowKiss', 'blow_kiss', '♥ Beso'],
                    ['dance', 'dance', '♪ Baile'],
                    ['showOff', 'outfit_pose', 'Giro 360°'],
                  ] as Array<[AvatarAction, AvatarAnimation, string]>
                ).map(([act, anim, label]) => (
                  <button
                    key={act}
                    type="button"
                    className={`gothic-btn whitespace-nowrap px-1 text-[10.5px] ${
                      snapshot.currentAnimation === anim ? 'active' : ''
                    }`}
                    onClick={() => engineRef.current?.triggerAction(act)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {/* Section 4: Vestuario por Capas & Lencería */}
            <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                <span>Traje Superior</span>
                <span className="text-[10px] font-semibold normal-case tracking-normal text-[#f4dca0]">
                  {snapshot.suitTag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {(['original', 'maid', 'marfil', 'none'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={snapshot.isChangingClothes}
                    className={`gothic-btn ${snapshot.suit === s ? 'active' : ''}`}
                    onClick={() => engineRef.current?.setSuit(s)}
                  >
                    {SUIT_LABELS[s]}
                  </button>
                ))}
              </div>

              {/* Interactive Animated Undress / Dress Choreography Button */}
              <button
                type="button"
                disabled={snapshot.isChangingClothes}
                className={`gothic-btn w-full ${snapshot.suit === 'none' ? 'gold' : 'cherry'} disabled:opacity-50`}
                onClick={() => {
                  if (snapshot.suit === 'none') {
                    engineRef.current?.animateDressSuit();
                  } else {
                    engineRef.current?.animateUndressSuit();
                  }
                }}
              >
                {snapshot.isChangingClothes
                  ? '✦ Cambiando prenda…'
                  : snapshot.suit === 'none'
                    ? '✦ Ponerse Traje (Animado)'
                    : '✦ Quitarse Traje (Animado)'}
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  className={`gothic-btn gold ${snapshot.pullFabric ? 'active' : ''}`}
                  onClick={() =>
                    engineRef.current?.setTools({ pullFabric: !snapshot.pullFabric })
                  }
                >
                  <span>✦ Jalar Tela</span>
                  <span className="btn-indicator">{snapshot.pullFabric ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  type="button"
                  className="gothic-btn"
                  onClick={() => engineRef.current?.triggerAction('breeze')}
                >
                  〰 Brisa Tela
                </button>
              </div>

              <div
                className={`flex flex-col gap-1.5 pt-0.5 ${
                  zipperDisabled ? 'pointer-events-none opacity-45' : ''
                }`}
              >
                <div className="flex items-center justify-between text-[11.5px]">
                  <label htmlFor="zipperSlider">Cremallera</label>
                  <span className="min-w-[38px] text-right font-bold text-[#e8c674] tabular-nums">
                    {snapshot.zipper}%
                  </span>
                </div>
                <input
                  id="zipperSlider"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={snapshot.zipper}
                  disabled={zipperDisabled}
                  onChange={(e) =>
                    engineRef.current?.setZipper(parseInt(e.target.value, 10) || 0)
                  }
                  className="gothic-range"
                />
                <div className="text-[10px] leading-snug text-[#a8a4c4]">{zipperHint}</div>
              </div>

              <div className="mt-0.5 flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                <span>Ropa Interactiva &amp; Lencería</span>
                <span className="font-mono text-[9.5px] font-normal normal-case tracking-normal text-[#a8a4c4]">
                  Clic directo en prendas
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.bra ? 'active' : ''}`}
                  onClick={() => engineRef.current?.setLingerie({ bra: !snapshot.bra })}
                >
                  <span>Sostén</span>
                  <span className="btn-indicator">{snapshot.bra ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.panties ? 'active' : ''}`}
                  onClick={() => engineRef.current?.setLingerie({ panties: !snapshot.panties })}
                >
                  <span>Braga</span>
                  <span className="btn-indicator">{snapshot.panties ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.stockings ? 'active' : ''}`}
                  onClick={() =>
                    engineRef.current?.setLingerie({ stockings: !snapshot.stockings })
                  }
                >
                  <span>Medias</span>
                  <span className="btn-indicator">{snapshot.stockings ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.gloves ? 'active' : ''}`}
                  onClick={() => engineRef.current?.setLingerie({ gloves: !snapshot.gloves })}
                >
                  <span>Guantes</span>
                  <span className="btn-indicator">{snapshot.gloves ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.garters ? 'active' : ''}`}
                  onClick={() => engineRef.current?.setLingerie({ garters: !snapshot.garters })}
                >
                  <span>Ligueros</span>
                  <span className="btn-indicator">{snapshot.garters ? 'ON' : 'OFF'}</span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.choker ? 'active' : ''}`}
                  onClick={() => engineRef.current?.setLingerie({ choker: !snapshot.choker })}
                >
                  <span>Choker</span>
                  <span className="btn-indicator">{snapshot.choker ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              <div className="flex flex-col gap-1 pt-0.5">
                <div className="flex items-center justify-between text-[10.5px] text-[#a8a4c4]">
                  <span>Tirantes del sostén</span>
                  <span className="font-mono text-[10px] text-[#e8c674]">
                    {snapshot.strapSlip === 'none'
                      ? 'Ajustados'
                      : snapshot.strapSlip === 'left'
                        ? 'Izq. caído'
                        : 'Ambos caídos'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      ['none', 'Normal'],
                      ['left', '1 Tirante'],
                      ['both', 'Ambos'],
                    ] as const
                  ).map(([slipVal, label]) => (
                    <button
                      key={slipVal}
                      type="button"
                      disabled={!snapshot.bra}
                      className={`gothic-btn text-[10.5px] disabled:opacity-40 ${
                        snapshot.strapSlip === slipVal ? 'active' : ''
                      }`}
                      onClick={() => engineRef.current?.setLingerie({ strapSlip: slipVal })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="text-[9.5px] leading-snug text-[#8e89b0]">
                  Tip: haz clic en tirantes (frontal), broche trasero (espalda) o ligueros para interactuar.
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'rig' && (
          <RigStudioPanel
            rigPose={manualRigPose}
            manualRigActive={Boolean(snapshot.manualRigActive)}
            stageTheme={snapshot.stageTheme}
            onChangeRigPose={handleManualRigChange}
            onResetRigPose={handleResetManualRig}
            onTriggerAction={(a) => engineRef.current?.triggerAction(a)}
            onChangeStageTheme={(theme: StageThemeId) => engineRef.current?.setStageTheme(theme)}
          />
        )}

        {activeTab === 'persona' && (
          <PersonaProfilePanel
            personaConfig={personaConfig}
            userProfile={userProfile}
            relationshipStats={relationshipStats}
            affection={snapshot.affection}
            soundEnabled={audioPrefs.sound}
            voiceEnabled={audioPrefs.voice}
            onChangePersona={setPersonaConfig}
            onChangeUserProfile={setUserProfile}
            onToggleSound={() => setAudioPrefs((p) => ({ ...p, sound: !p.sound }))}
            onToggleVoice={() => setAudioPrefs((p) => ({ ...p, voice: !p.voice }))}
          />
        )}

        {activeTab === 'chat' && (
          <ChatPanel
            messages={messages}
            isSending={isSending}
            reactiveAI={reactiveAI}
            archetypeLabel={currentPreset.label}
            onToggleReactiveAI={() => setReactiveAI((v) => !v)}
            onSendMessage={handleSendMessage}
          />
        )}
      </aside>
    </main>
  );
}
