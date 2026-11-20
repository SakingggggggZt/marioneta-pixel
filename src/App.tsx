import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare, SlidersHorizontal } from 'lucide-react';
import {
  createPixelAvatarEngine,
  SUIT_MATERIALS,
  W,
  H,
  type AvatarAction,
  type AvatarAnimation,
  type AvatarMood,
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
import { PixelSpeechBubble } from './components/PixelSpeechBubble';
import { ChatPanel } from './components/ChatPanel';

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
  thumbsUp: 'Pulgar arriba 👍',
  crouch: 'Agacharse',
  elbowsIn: 'Juntar codos',
  raiseLeftHand: 'Levantar mano izq.',
  raiseRightHand: 'Levantar mano der.',
  peaceSign: 'Paz ✌️',
  pointFinger: 'Señalar ☝️',
  rockSign: 'Rock 🤘',
  handsOnHips: 'Manos cintura',
  crossArms: 'Cruzar brazos',
  coverFace: 'Tapar rostro',
  liftLeg: 'Levantar pierna',
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
  raise_left_hand: 'Mano izq. arriba',
  raise_right_hand: 'Mano der. arriba',
  peace_sign: 'Paz ✌️',
  point_finger: 'Señalando ☝️',
  rock_sign: 'Rock 🤘',
  hands_on_hips: 'Manos cintura',
  cross_arms: 'Brazos cruzados',
  cover_face: 'Rostro cubierto',
  lift_leg: 'Pierna arriba',
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
  handEnabled: true,
  cubeEnabled: false,
  pullFabric: false,
  animationsEnabled: true,
  currentAnimation: 'idle',
  mood: 'Tranquila',
  affection: 74,
  blush: 15,
  zoneLabel: '—',
  hintDismissed: false,
  lastInteractionEvent: null,
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'model',
    text: 'Buenas noches… soy Marioneta. Puedes hablarme, cambiar mi vestuario o probar mis físicas cuando gustes.',
    mood: 'Tranquila',
  },
];

function getMoodChipClasses(mood: AvatarMood): string {
  switch (mood) {
    case 'Feliz':
      return 'bg-[#5de0b2]/15 border-[#5de0b2]/55 text-[#a9f7db]';
    case 'Sorprendida':
      return 'bg-[#e8c674]/15 border-[#e8c674]/55 text-[#fae5aa]';
    case 'Ruborizada':
    case 'Mimada':
      return 'bg-[#e02446]/20 border-[#e02446]/55 text-[#ffb0c0]';
    default:
      return 'bg-[#9b6ee8]/20 border-[#9b6ee8]/50 text-[#e6d8ff]';
  }
}

function buildEffectSummary(res: MarionetaAIResponse): string | undefined {
  const parts: string[] = [];
  if (res.changeSuit) parts.push(`Traje: ${SUIT_LABELS[res.changeSuit]}`);
  if (res.changeView) parts.push(`Vista: ${VIEW_LABELS[res.changeView]}`);
  if (typeof res.changeZipper === 'number') parts.push(`Cremallera: ${res.changeZipper}%`);
  if (res.changeLingerie) {
    if (typeof res.changeLingerie.bra === 'boolean') parts.push(`Sostén: ${res.changeLingerie.bra ? 'ON' : 'OFF'}`);
    if (typeof res.changeLingerie.panties === 'boolean') parts.push(`Braga: ${res.changeLingerie.panties ? 'ON' : 'OFF'}`);
    if (typeof res.changeLingerie.stockings === 'boolean') parts.push(`Medias: ${res.changeLingerie.stockings ? 'ON' : 'OFF'}`);
  }
  if (res.action && res.action !== 'none') parts.push(`Acción: ${ACTION_LABELS[res.action]}`);
  if (res.secondaryAction && res.secondaryAction !== 'none') {
    parts.push(`+ ${ACTION_LABELS[res.secondaryAction]}`);
  }
  if (res.animation && res.animation !== 'idle') parts.push(`Mov: ${ANIMATION_LABELS[res.animation]}`);
  if (res.rigPose) {
    const rigTags: string[] = [];
    if (res.rigPose.handL && res.rigPose.handL !== 'open') rigTags.push(`Mano Izq: ${res.rigPose.handL}`);
    if (res.rigPose.handR && res.rigPose.handR !== 'open') rigTags.push(`Mano Der: ${res.rigPose.handR}`);
    if (typeof res.rigPose.crouch === 'number' && res.rigPose.crouch > 0.2) rigTags.push('Rodillas: Flex');
    if (typeof res.rigPose.jump === 'number' && res.rigPose.jump > 0.2) rigTags.push('Salto: Aire');
    if (typeof res.rigPose.elbowL === 'number' || typeof res.rigPose.elbowR === 'number') rigTags.push('Codos: Rig');
    if (rigTags.length > 0) parts.push(`Rig 2D (${rigTags.join(', ')})`);
  }
  return parts.length > 0 ? parts.join(' · ') : undefined;
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<PixelAvatarEngine | null>(null);

  const [snapshot, setSnapshot] = useState<AvatarSnapshot>(INITIAL_SNAPSHOT);
  const [activeTab, setActiveTab] = useState<'controls' | 'chat'>('controls');
  const [reactiveAI, setReactiveAI] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [bubbleText, setBubbleText] = useState<string | null>(
    'Buenas noches… tócame, jala la cremallera o háblame en Chat IA.',
  );
  const [bubbleMood, setBubbleMood] = useState<AvatarMood>('Tranquila');

  const reactiveAIRef = useRef(reactiveAI);
  const isSendingRef = useRef(isSending);
  const messagesRef = useRef(messages);
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

  const showSpeechBubble = useCallback((text: string, mood: AvatarMood, durationMs = 8500) => {
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

  const handleEngineInteraction = useCallback(
    (event: InteractionEvent, currentSnap: AvatarSnapshot) => {
      if (!reactiveAIRef.current || isSendingRef.current) return;
      const now = Date.now();
      if (now - lastReactionAtRef.current < REACTIVE_COOLDOWN_MS) return;

      lastReactionAtRef.current = now;
      isSendingRef.current = true;
      setIsSending(true);

      void requestMarionetaReaction(event, currentSnap, messagesRef.current)
        .then((res) => {
          engineRef.current?.applyAIReaction({
            mood: res.mood,
            affectionDelta: res.affectionDelta,
            blushDelta: res.blushDelta,
            action: res.action,
            secondaryAction: res.secondaryAction,
            animation: res.animation,
            changeSuit: res.changeSuit,
            changeView: res.changeView,
            changeZipper: res.changeZipper,
            changeLingerie: res.changeLingerie,
            rigPose: res.rigPose,
          });
          showSpeechBubble(res.reply, res.mood);
          setMessages((prev) => [
            ...prev.slice(-28),
            {
              id: `react-${Date.now()}`,
              role: 'model',
              text: res.reply,
              mood: res.mood,
              source: res.source,
              effectSummary: buildEffectSummary(res),
            },
          ]);
        })
        .finally(() => {
          isSendingRef.current = false;
          setIsSending(false);
        });
    },
    [showSpeechBubble],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createPixelAvatarEngine(canvas, {
      onSnapshot: (nextSnap) => setSnapshot(nextSnap),
      onInteraction: handleEngineInteraction,
    });
    engineRef.current = engine;

    return () => {
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
        const res = await sendMarionetaChat(text, currentSnap, nextHistory);
        engineRef.current?.applyAIReaction({
          mood: res.mood,
          affectionDelta: res.affectionDelta,
          blushDelta: res.blushDelta,
          action: res.action,
          secondaryAction: res.secondaryAction,
          animation: res.animation,
          changeSuit: res.changeSuit,
          changeView: res.changeView,
          changeZipper: res.changeZipper,
          changeLingerie: res.changeLingerie,
          rigPose: res.rigPose,
        });
        showSpeechBubble(res.reply, res.mood, 10000);
        setMessages((prev) => [
          ...prev.slice(-30),
          {
            id: `model-${Date.now()}`,
            role: 'model',
            text: res.reply,
            mood: res.mood,
            source: res.source,
            effectSummary: buildEffectSummary(res),
          },
        ]);
      } finally {
        isSendingRef.current = false;
        setIsSending(false);
      }
    },
    [showSpeechBubble, snapshot],
  );

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
            className={`pixel-canvas block h-full w-full ${snapshot.handEnabled ? 'hand-active' : ''}`}
          />

          {/* Stage Top-Left View & FPS Readout */}
          <div className="pointer-events-none absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full border border-[#9b6ee8]/40 bg-[#12111e]/85 px-2.5 py-1 text-[11px] tracking-[0.4px] text-[#f2f1fa] backdrop-blur-xs">
            <span className="h-[7px] w-[7px] rounded-full bg-[#5de0b2] shadow-[0_0_8px_#5de0b2]" />
            <span>{VIEW_TITLES[snapshot.view]}</span>
            <span className="opacity-45">|</span>
            <span className="tabular-nums">{snapshot.fps} FPS</span>
          </div>

          {/* Stage Top-Right Hovered Zone */}
          <div className="pointer-events-none absolute top-2.5 right-2.5 rounded-full border border-white/12 bg-[#12111e]/85 px-2.5 py-1 text-[11px] text-[#a8a4c4] backdrop-blur-xs">
            Zona: {snapshot.zoneLabel}
          </div>

          {/* Discreet Pixel-Art Dialogue Bubble */}
          <PixelSpeechBubble
            text={bubbleText}
            mood={bubbleMood}
            thinking={isSending}
            onDismiss={dismissBubble}
          />

          {/* Stage Bottom Interaction Hint (only when bubble is dismissed and user hasn't interacted yet) */}
          {!bubbleText && !isSending && !snapshot.hintDismissed && (
            <div className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#9b6ee8]/30 bg-[#12111e]/85 px-3 py-1 text-[11px] text-[#cfcbe8] backdrop-blur-xs">
              Presiona, jala la cremallera o prueba la Vista Lateral
            </div>
          )}
        </div>
      </section>

      {/* Right: Gothic HUD Side Panel with Clean Tabs */}
      <aside
        className="hud-scroll flex w-full max-w-[520px] shrink-0 flex-col gap-2.5 self-center rounded-[14px] border-2 border-[#3c375e] p-3 shadow-[0_14px_36px_rgba(0,0,0,0.5)] md:max-h-[calc(100vh-28px)] md:w-[348px] md:overflow-y-auto"
        style={{
          background:
            'linear-gradient(180deg, rgba(28,26,45,0.96) 0%, rgba(20,19,34,0.98) 100%)',
        }}
        aria-label="Panel de Control Tamagotchi, Vestuario y Chat IA"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#9b6ee8]/25 pb-2">
          <div className="flex items-center gap-2 text-[14px] font-extrabold tracking-[0.6px]">
            <span
              className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-[6px] text-[12px] shadow-[0_0_10px_rgba(155,110,232,0.35)]"
              style={{
                background: 'linear-gradient(135deg, #9b6ee8, #e02446)',
              }}
            >
              ✦
            </span>
            <span>MARIONETA PIXEL</span>
          </div>
          <span className="text-[10px] text-[#a8a4c4] tabular-nums">
            280×360 · 3 VISTAS
          </span>
        </header>

        {/* Clean Segmented Tabs */}
        <div
          className="grid grid-cols-2 gap-1.5 rounded-[9px] border border-[#3c375e]/70 bg-[#141322] p-1"
          role="tablist"
          aria-label="Secciones del panel"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'controls'}
            onClick={() => setActiveTab('controls')}
            className={`gothic-btn py-1.5 ${activeTab === 'controls' ? 'active' : ''}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Controles</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            className={`gothic-btn py-1.5 ${activeTab === 'chat' ? 'active' : ''}`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat IA</span>
          </button>
        </div>

        {activeTab === 'controls' ? (
          <>
            {/* Section 1: Estado Tamagotchi */}
            <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                <span>Estado Tamagotchi</span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold normal-case tracking-normal ${getMoodChipClasses(snapshot.mood)}`}
                >
                  {snapshot.mood}
                </span>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-[11px] text-[#a8a4c4]">
                  <span>Ánimo / Afecto</span>
                  <strong className="text-[#f2f1fa] tabular-nums">
                    {snapshot.affection}%
                  </strong>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full border border-white/[0.08] bg-[#12111d]">
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
                <div className="mb-1 flex justify-between text-[11px] text-[#a8a4c4]">
                  <span>Rubor</span>
                  <strong className="text-[#f2f1fa] tabular-nums">
                    {snapshot.blush}%
                  </strong>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full border border-white/[0.08] bg-[#12111d]">
                  <div
                    className="h-full rounded-full transition-[width] duration-250 ease-out"
                    style={{
                      width: `${snapshot.blush}%`,
                      background: 'linear-gradient(90deg, #ff7a99 0%, #e02446 100%)',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  className="gothic-btn cherry"
                  onClick={() => engineRef.current?.triggerAction('happy')}
                >
                  ♥ Alegrarse
                </button>
                <button
                  type="button"
                  className="gothic-btn"
                  onClick={() => engineRef.current?.triggerAction('feed')}
                >
                  🧁 Alimentar
                </button>
              </div>
            </section>

            {/* Section 2: Físicas Blandas 2D & Animaciones */}
            <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                <span>Físicas y Animación</span>
                <span className="text-[9.5px] font-semibold text-[#5de0b2]">
                  {snapshot.animationsEnabled
                    ? `ANIM: ${ANIMATION_LABELS[snapshot.currentAnimation].toUpperCase()}`
                    : 'POSE FIJA'}
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
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'thumbs_up' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('thumbsUp')}
                >
                  👍 Pulgar
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'crouch' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('crouch')}
                >
                  Agacharse
                </button>
                <button
                  type="button"
                  className="gothic-btn"
                  onClick={() => engineRef.current?.triggerAction('jump')}
                >
                  Saltar
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'raise_right_hand' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('raiseRightHand')}
                >
                  ✋ 1 Mano
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'elbows_in' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('elbowsIn')}
                >
                  Juntar Codos
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'blow_kiss' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('blowKiss')}
                >
                  ♥ Beso Mano
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'peace_sign' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('peaceSign')}
                >
                  ✌️ Paz
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'point_finger' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('pointFinger')}
                >
                  ☝️ Señalar
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'dance' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('dance')}
                >
                  ♪ Baile
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'hands_on_hips' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('handsOnHips')}
                >
                  Cintura
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.currentAnimation === 'curtsy' ? 'active' : ''}`}
                  onClick={() => engineRef.current?.triggerAction('curtsy')}
                >
                  Reverencia
                </button>
                <button
                  type="button"
                  className="gothic-btn"
                  onClick={() => engineRef.current?.triggerAction('showOff')}
                >
                  Giro 360°
                </button>
              </div>
            </section>

            {/* Section 3: Herramientas y Cámara */}
            <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                <span>Herramientas y Cámara</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.animationsEnabled ? 'active' : ''}`}
                  onClick={() =>
                    engineRef.current?.setTools({ animationsEnabled: !snapshot.animationsEnabled })
                  }
                >
                  <span>Anim</span>
                  <span className="btn-indicator">
                    {snapshot.animationsEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.handEnabled ? 'active' : ''}`}
                  onClick={() =>
                    engineRef.current?.setTools({ handEnabled: !snapshot.handEnabled })
                  }
                >
                  <span>Mano</span>
                  <span className="btn-indicator">
                    {snapshot.handEnabled ? 'ON' : 'OFF'}
                  </span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.cubeEnabled ? 'active' : ''}`}
                  onClick={() =>
                    engineRef.current?.setTools({ cubeEnabled: !snapshot.cubeEnabled })
                  }
                >
                  <span>Cubo</span>
                  <span className="btn-indicator">
                    {snapshot.cubeEnabled ? 'ON' : 'OFF'}
                  </span>
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

            {/* Section 4: Vestuario por Capas & Lencería */}
            <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                <span>Traje Superior (Capa 4)</span>
                <span className="text-[10px] font-semibold normal-case tracking-normal text-[#f4dca0]">
                  {snapshot.suitTag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {(['original', 'maid', 'marfil', 'none'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`gothic-btn ${snapshot.suit === s ? 'active' : ''}`}
                    onClick={() => engineRef.current?.setSuit(s)}
                  >
                    {SUIT_LABELS[s]}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  className={`gothic-btn gold ${snapshot.pullFabric ? 'active' : ''}`}
                  onClick={() =>
                    engineRef.current?.setTools({ pullFabric: !snapshot.pullFabric })
                  }
                >
                  <span>✦ Jalar Tela</span>
                  <span className="btn-indicator">
                    {snapshot.pullFabric ? 'ON' : 'OFF'}
                  </span>
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
                <div className="text-[10px] leading-snug text-[#a8a4c4]">
                  {zipperHint}
                </div>
              </div>

              <div className="mt-0.5 text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
                Lencería Independiente (Capas 1–3)
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.bra ? 'active' : ''}`}
                  onClick={() =>
                    engineRef.current?.setLingerie({ bra: !snapshot.bra })
                  }
                >
                  <span>Sostén</span>
                  <span className="btn-indicator">
                    {snapshot.bra ? 'ON' : 'OFF'}
                  </span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.panties ? 'active' : ''}`}
                  onClick={() =>
                    engineRef.current?.setLingerie({ panties: !snapshot.panties })
                  }
                >
                  <span>Braga</span>
                  <span className="btn-indicator">
                    {snapshot.panties ? 'ON' : 'OFF'}
                  </span>
                </button>
                <button
                  type="button"
                  className={`gothic-btn ${snapshot.stockings ? 'active' : ''}`}
                  onClick={() =>
                    engineRef.current?.setLingerie({ stockings: !snapshot.stockings })
                  }
                >
                  <span>Medias</span>
                  <span className="btn-indicator">
                    {snapshot.stockings ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </section>
          </>
        ) : (
          <ChatPanel
            messages={messages}
            isSending={isSending}
            reactiveAI={reactiveAI}
            onToggleReactiveAI={() => setReactiveAI((v) => !v)}
            onSendMessage={handleSendMessage}
          />
        )}
      </aside>
    </main>
  );
}
