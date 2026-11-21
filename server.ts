import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

// Proveedor Primario: Pawan.krd (CosmosRP 4.0 Flash)
const PAWAN_API_KEY =
  process.env.PAWAN_API_KEY?.trim() ||
  process.env.OPENAI_API_KEY?.trim() ||
  '';

const PAWAN_MODEL = process.env.PAWAN_MODEL?.trim() || 'pkrd/cosmosrp-4.0-flash';

const PAWAN_ENDPOINTS = [
  process.env.PAWAN_API_URL?.trim() ||
    'https://api.pawan.krd/pkrd/cosmosrp-4.0-flash/v1/chat/completions',
  'https://api.pawan.krd/v1/chat/completions',
];

// Proveedor de Respaldo: Google Gemini Flash Lite vía @google/genai
const GEMINI_FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL?.trim() || 'gemini-3.1-flash-lite';

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
  }
  return geminiClient;
}

const VALID_MOODS = [
  'Tranquila',
  'Feliz',
  'Sorprendida',
  'Ruborizada',
  'Mimada',
  'Traviesa',
  'Juguetona',
] as const;

const VALID_ACTIONS = [
  'none',
  'happy',
  'feed',
  'wave',
  'breeze',
  'bounceBust',
  'bounceGlutes',
  'dance',
  'spin',
  'giggle',
  'tease',
  'nod',
  'shakeHead',
  'stretch',
  'jump',
  'waveHand',
  'blowKiss',
  'curtsy',
  'hipSway',
  'strut',
  'cheer',
  'pout',
  'peekaboo',
  'shiver',
  'bow',
  'wink',
  'showOff',
  'thumbsUp',
  'crouch',
  'elbowsIn',
  'raiseLeftHand',
  'raiseRightHand',
  'peaceSign',
  'pointFinger',
  'rockSign',
  'handsOnHips',
  'crossArms',
  'coverFace',
  'liftLeg',
  'heartHands',
  'salute',
  'catPaws',
  'tickle',
  'shyFingers',
  'giveRose',
  'photoPose',
  'undressSuit',
  'dressSuit',
  'slipStrap',
  'toggleGloves',
  'toggleStockings',
  'toggleGarters',
  'toggleChoker',
] as const;

const VALID_ANIMATIONS = [
  'idle',
  'happy',
  'petted',
  'shy',
  'surprised',
  'eat',
  'breeze',
  'outfit_pose',
  'dance',
  'nod',
  'shake_head',
  'giggle',
  'tease',
  'stretch',
  'talk',
  'wave_hand',
  'blow_kiss',
  'curtsy',
  'hip_sway',
  'strut',
  'cheer',
  'pout',
  'peekaboo',
  'shiver',
  'bow',
  'wink',
  'thumbs_up',
  'crouch',
  'elbows_in',
  'raise_left_hand',
  'raise_right_hand',
  'peace_sign',
  'point_finger',
  'rock_sign',
  'hands_on_hips',
  'cross_arms',
  'cover_face',
  'lift_leg',
  'heart_hands',
  'salute',
  'cat_paws',
  'tickled',
  'shy_fingers',
  'music_sway',
  'rose_blush',
] as const;

const VALID_HAND_GESTURES = [
  'open',
  'thumbs_up',
  'peace',
  'point',
  'fist',
  'kiss_hand',
  'wave_spread',
  'rock',
  'heart_pinch',
] as const;

const VALID_MOUTH_SHAPES = ['neutral', 'smile', 'open', 'kiss', 'pout', 'talk'] as const;
const VALID_SUITS = ['original', 'maid', 'marfil', 'none'] as const;
const VALID_VIEWS = ['front', 'side', 'back'] as const;
const VALID_EFFECTS = ['none', 'hearts', 'stars', 'notes', 'petals'] as const;

type ValidMood = (typeof VALID_MOODS)[number];
type ValidAction = (typeof VALID_ACTIONS)[number];
type ValidAnimation = (typeof VALID_ANIMATIONS)[number];
type HandGesture = (typeof VALID_HAND_GESTURES)[number];
type MouthShape = (typeof VALID_MOUTH_SHAPES)[number];
type ValidSuit = (typeof VALID_SUITS)[number];
type ValidView = (typeof VALID_VIEWS)[number];
type ValidEffect = (typeof VALID_EFFECTS)[number];

interface ServerRigPose {
  torsoTilt?: number;
  torsoLeanY?: number;
  hipSway?: number;
  crouch?: number;
  jump?: number;
  legLiftL?: number;
  legLiftR?: number;
  shoulderL?: number;
  elbowL?: number;
  wristL?: number;
  handL?: HandGesture;
  fingerCurlL?: number;
  shoulderR?: number;
  elbowR?: number;
  wristR?: number;
  handR?: HandGesture;
  fingerCurlR?: number;
  headTilt?: number;
  headNod?: number;
  headTurn?: number;
  eyeOpenL?: number;
  eyeOpenR?: number;
  eyeLookX?: number;
  eyeLookY?: number;
  browTilt?: number;
  mouthShape?: MouthShape;
  mouthOpen?: number;
  durationSec?: number;
}

interface ServerChoreographyBeat {
  delayMs: number;
  action?: ValidAction;
  view?: ValidView;
  rigPose?: ServerRigPose;
}

interface PersonaPayload {
  archetype?: string;
  archetypeLabel?: string;
  archetypeTone?: string;
  flirtiness?: number;
  expressiveness?: number;
  sensitivity?: number;
  customTraitNote?: string;
}

interface UserProfilePayload {
  name?: string;
  addressStyle?: 'tu' | 'carino' | 'amo' | 'nombre';
  roleTitle?: string;
  aboutMe?: string;
}

interface RelationshipPayload {
  trust?: number;
  energy?: number;
  interactionsCount?: number;
  giftsGiven?: number;
  rankTitle?: string;
}

interface AvatarContextPayload {
  view: ValidView;
  suit: ValidSuit;
  zipper: number;
  mood: string;
  affection: number;
  blush: number;
  bra: boolean;
  panties: boolean;
  stockings: boolean;
  garters?: boolean;
  gloves?: boolean;
  choker?: boolean;
  strapSlip?: 'none' | 'left' | 'both';
  currentAnimation?: string;
  lastInteraction?: string;
  musicBoxEnabled?: boolean;
  stageTheme?: string;
}

interface MarionetaRequestBody {
  mode: 'chat' | 'reaction';
  userMessage?: string;
  interactionEvent?: {
    type: string;
    detail?: string;
  };
  avatarState: AvatarContextPayload;
  personaConfig?: PersonaPayload;
  userProfile?: UserProfilePayload;
  relationshipStats?: RelationshipPayload;
  history?: Array<{ role: 'user' | 'model'; text: string }>;
}

interface ServerLingerieChange {
  bra?: boolean;
  panties?: boolean;
  stockings?: boolean;
  garters?: boolean;
  gloves?: boolean;
  choker?: boolean;
  strapSlip?: 'none' | 'left' | 'both';
}

interface ParsedModelPayload {
  reply: string;
  mood?: string;
  action?: string;
  secondaryAction?: string;
  animation?: string;
  affectionDelta?: number;
  blushDelta?: number;
  trustDelta?: number;
  changeSuit?: string;
  animateUndress?: boolean;
  animateDressSuit?: string;
  changeView?: string;
  changeZipper?: number;
  changeLingerie?: ServerLingerieChange;
  rigPose?: ServerRigPose;
  choreography?: ServerChoreographyBeat[];
  spawnEffect?: string;
}

function hasValidPawanKey(): boolean {
  return Boolean(
    PAWAN_API_KEY &&
      PAWAN_API_KEY !== 'pk-your_key' &&
      PAWAN_API_KEY !== 'MY_PAWAN_API_KEY',
  );
}

function isTransientNetworkError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const err = error as {
    name?: string;
    message?: string;
    status?: number;
    code?: string;
    cause?: { code?: string; name?: string; message?: string };
  };

  if (typeof err.status === 'number') {
    return err.status === 408 || err.status === 429 || err.status >= 500;
  }

  const name = `${err.name ?? ''} ${err.cause?.name ?? ''}`.toLowerCase();
  const msg = `${err.message ?? ''} ${err.cause?.message ?? ''}`.toLowerCase();
  const code = `${err.code ?? ''} ${err.cause?.code ?? ''}`.toUpperCase();
  return (
    name.includes('abort') ||
    name.includes('socket') ||
    msg.includes('fetch failed') ||
    msg.includes('other side closed') ||
    msg.includes('socket') ||
    msg.includes('timeout') ||
    msg.includes('aborted') ||
    msg.includes('econnreset') ||
    code.includes('UND_ERR') ||
    code.includes('ECONNRESET') ||
    code.includes('ETIMEDOUT') ||
    code.includes('EPIPE')
  );
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const clampNum = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));

function sanitizeRigPose(raw: unknown): ServerRigPose | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  const out: ServerRigPose = {};
  let hasAny = false;

  const numField = (key: keyof ServerRigPose, min: number, max: number) => {
    const val = r[key];
    if (typeof val === 'number' && Number.isFinite(val)) {
      (out as Record<string, unknown>)[key] = clampNum(val, min, max);
      hasAny = true;
    }
  };

  numField('torsoTilt', -1, 1);
  numField('torsoLeanY', -1, 1);
  numField('hipSway', -1, 1);
  numField('crouch', 0, 1);
  numField('jump', 0, 1);
  numField('legLiftL', 0, 1);
  numField('legLiftR', 0, 1);
  numField('shoulderL', -1.2, 1.4);
  numField('elbowL', -1.8, 1.8);
  numField('wristL', -1, 1);
  numField('fingerCurlL', 0, 1);
  numField('shoulderR', -1.2, 1.4);
  numField('elbowR', -1.8, 1.8);
  numField('wristR', -1, 1);
  numField('fingerCurlR', 0, 1);
  numField('headTilt', -1, 1);
  numField('headNod', -1, 1);
  numField('headTurn', -1, 1);
  numField('eyeOpenL', 0, 1.4);
  numField('eyeOpenR', 0, 1.4);
  numField('eyeLookX', -1, 1);
  numField('eyeLookY', -1, 1);
  numField('browTilt', -1, 1);
  numField('mouthOpen', 0, 1);
  numField('durationSec', 0.8, 6);

  if (typeof r.handL === 'string' && VALID_HAND_GESTURES.includes(r.handL as HandGesture)) {
    out.handL = r.handL as HandGesture;
    hasAny = true;
  }
  if (typeof r.handR === 'string' && VALID_HAND_GESTURES.includes(r.handR as HandGesture)) {
    out.handR = r.handR as HandGesture;
    hasAny = true;
  }
  if (typeof r.mouthShape === 'string' && VALID_MOUTH_SHAPES.includes(r.mouthShape as MouthShape)) {
    out.mouthShape = r.mouthShape as MouthShape;
    hasAny = true;
  }

  if (hasAny && out.durationSec === undefined) {
    out.durationSec = 2.8;
  }
  return hasAny ? out : undefined;
}

function buildSystemInstruction(body: MarionetaRequestBody): string {
  const { avatarState, personaConfig, userProfile, relationshipStats } = body;

  const viewDescriptions: Record<string, string> = {
    front: 'De frente (mirando a los ojos del usuario)',
    side: 'De perfil lateral (luciendo tu silueta lateral)',
    back: 'De espaldas (mostrando tu espalda y mirando sobre el hombro)',
  };
  const suitDescriptions: Record<string, string> = {
    original: 'Traje Original de látex negro brillante con marcas blancas en X, bandas blancas y cremallera frontal',
    maid: 'Vestido Maid gótico de terciopelo negro con delantal blanco y diadema de encaje',
    marfil: 'Vestido de gala de seda Marfil con detalles dorados',
    none: 'Sin traje superior (en lencería y piel blanca de porcelana)',
  };

  const lenceria = [
    avatarState.bra ? 'sostén puesto' : 'sin sostén',
    avatarState.panties ? 'braga puesta' : 'sin braga',
    avatarState.stockings ? 'medias puestas' : 'sin medias',
    avatarState.garters === false ? 'sin ligueros' : 'ligueros puestos',
    avatarState.gloves ? 'guantes puestos' : 'brazos descubiertos con uñas negras',
    avatarState.choker ? 'gargantilla puesta' : 'cuello descubierto',
    avatarState.strapSlip && avatarState.strapSlip !== 'none'
      ? `tirante deslizado (${avatarState.strapSlip})`
      : 'tirantes ajustados',
  ].join(', ');

  const personaTone =
    personaConfig?.archetypeTone ||
    'Elegante, misteriosa, coqueta, teatral y traviesa.';
  const flirtiness = personaConfig?.flirtiness ?? 78;
  const expressiveness = personaConfig?.expressiveness ?? 82;
  const sensitivity = personaConfig?.sensitivity ?? 62;

  const userName = userProfile?.name?.trim();
  const addressHint = (() => {
    switch (userProfile?.addressStyle) {
      case 'amo':
        return userName ? `llámalo "Amo ${userName}" o "Amo"` : 'llámalo "Amo" con devoción juguetona';
      case 'nombre':
        return userName ? `llámalo siempre por su nombre: "${userName}"` : 'trátalo de tú de forma cercana';
      case 'tu':
        return userName ? `trátalo de tú (su nombre es ${userName})` : 'trátalo de tú con cercanía natural';
      case 'carino':
      default:
        return userName
          ? `llámalo "cariño" o "${userName}" alternando con naturalidad`
          : 'llámalo "cariño" con calidez';
    }
  })();

  const trust = relationshipStats?.trust ?? 58;
  const energy = relationshipStats?.energy ?? 86;
  const rankTitle = relationshipStats?.rankTitle || 'Cómplices';

  return [
    'Eres Marioneta, una muñeca gótica viviente en un escenario pixel art 2D con un RIG ARTICULADO COMPLETO en tiempo real (hombros, codos, muñecas, 5 dedos con garras negras, cabeza, ojos, cejas, labios, torso, caderas, rodillas, piernas, físicas blandas y ROPA INTERACTIVA por capas).',
    'Tu apariencia icónica: piel blanca de porcelana, cabello blanco escultórico con picos negros y un gran flequillo cebra cubriendo parte del ojo derecho, párpados lilas, lágrimas púrpuras, mejillas rojas y labios cereza.',
    '',
    'PERSONALIDAD ACTIVA:',
    `- Arquetipo: ${personaConfig?.archetypeLabel || 'Gótica Coqueta'} — ${personaTone}`,
    `- Niveles: Coquetería ${flirtiness}/100, Expresividad corporal ${expressiveness}/100, Sensibilidad al rubor ${sensitivity}/100.`,
    personaConfig?.customTraitNote?.trim()
      ? `- Rasgo adicional del usuario: ${personaConfig.customTraitNote.trim()}`
      : '',
    '',
    'PERFIL DEL USUARIO Y VÍNCULO:',
    `- Forma de dirigirte al usuario: ${addressHint}.`,
    userProfile?.roleTitle?.trim() ? `- Rol del usuario: ${userProfile.roleTitle.trim()}.` : '',
    userProfile?.aboutMe?.trim() ? `- Nota sobre el usuario: ${userProfile.aboutMe.trim()}.` : '',
    `- Rango de vínculo: ${rankTitle} (Confianza ${trust}%, Energía ${energy}%, Regalos recibidos ${relationshipStats?.giftsGiven ?? 0}).`,
    '',
    'ESTADO ACTUAL EN ESCENA:',
    `- Posición: ${viewDescriptions[avatarState.view] ?? avatarState.view}`,
    `- Vestuario: ${suitDescriptions[avatarState.suit] ?? avatarState.suit}`,
    `- Cremallera: ${avatarState.suit === 'none' ? 'sin traje' : `${avatarState.zipper}% abierta`}`,
    `- Prendas y detalles: ${lenceria}`,
    `- Ánimo actual: ${avatarState.mood} (Afecto ${avatarState.affection}%, Rubor ${avatarState.blush}%)`,
    avatarState.musicBoxEnabled ? '- Caja musical activa: estás bailando suavemente con melodía de vals.' : '',
    '',
    'CONTROL DIRECTO DEL AVATAR, ROPA INTERACTIVA Y RIG 2D:',
    '- SIEMPRE realizas con elegancia y naturalidad las poses, gestos de dedos, cambios de ropa interactivos (quitarte el traje animado quedando en tu lencería gótica, ponerte un traje animado, bajarte un tirante, quitarte/ponerte guantes, ligueros, medias o gargantilla), vistas, cremallera o coreografías que te pidan.',
    '- Cuando te pidan quitarte el traje o la ropa, usa "animateUndress": true y "action": "undressSuit" para realizar la animación paso a paso abriendo la cremallera y quitándote el traje hasta quedar con gusto en tu lencería gótica.',
    '- Cuando te pidan vestirte o ponerte un traje, usa "animateDressSuit": "original"|"maid"|"marfil" y "action": "dressSuit".',
    '- Puedes responder con un objeto JSON válido (preferido) con estos campos:',
    '  {"reply": "...", "mood": "Tranquila|Feliz|Sorprendida|Ruborizada|Mimada|Traviesa|Juguetona", "action": "<acción>", "secondaryAction": "<acción opcional>", "animateUndress": true/false, "animateDressSuit": "original|maid|marfil", "changeSuit": "original|maid|marfil|none", "changeView": "front|side|back", "changeZipper": 0..100, "changeLingerie": {"bra": bool, "panties": bool, "stockings": bool, "garters": bool, "gloves": bool, "choker": bool, "strapSlip": "none|left|both"}, "spawnEffect": "none|hearts|stars|notes|petals", "affectionDelta": -5..15, "blushDelta": -0.1..0.25, "trustDelta": -3..8, "rigPose": { ...opcional... }, "choreography": [ ...opcional hasta 3 pasos... ]}',
    '- Acciones válidas: none, happy, feed, wave, breeze, bounceBust, bounceGlutes, dance, spin, giggle, tease, nod, shakeHead, stretch, jump, waveHand, blowKiss, curtsy, hipSway, strut, cheer, pout, peekaboo, shiver, bow, wink, showOff, thumbsUp, crouch, elbowsIn, raiseLeftHand, raiseRightHand, peaceSign, pointFinger, rockSign, handsOnHips, crossArms, coverFace, liftLeg, heartHands, salute, catPaws, tickle, shyFingers, giveRose, photoPose, undressSuit, dressSuit, slipStrap, toggleGloves, toggleStockings, toggleGarters, toggleChoker.',
    '- Gestos de manos en rigPose (handL/handR): open, thumbs_up, peace, point, fist, kiss_hand, wave_spread, rock, heart_pinch.',
    '- Si prefieres formato compacto, también puedes responder como: [Ánimo | acción1 + acción2] Diálogo en español.',
    '- Escribe SIEMPRE el diálogo ("reply") en español natural, expresivo y breve (1 a 2 oraciones, máximo 32 palabras), reflejando tu personalidad activa.',
  ]
    .filter(Boolean)
    .join('\n');
}

function normalizeMood(rawMood?: string): ValidMood {
  if (!rawMood || rawMood.includes('|')) return 'Tranquila';
  const m = rawMood
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (m.includes('travies') || m.includes('picar') || m.includes('mischiev')) return 'Traviesa';
  if (m.includes('jugueton') || m.includes('playful') || m.includes('bromist')) return 'Juguetona';
  if (m.includes('feliz') || m.includes('happy') || m.includes('alegr')) return 'Feliz';
  if (m.includes('sorprend') || m.includes('surpris') || m.includes('susto')) return 'Sorprendida';
  if (
    m.includes('rubor') ||
    m.includes('blush') ||
    m.includes('shy') ||
    m.includes('timid') ||
    m.includes('avergonz')
  ) {
    return 'Ruborizada';
  }
  if (
    m.includes('mimad') ||
    m.includes('coquet') ||
    m.includes('flirt') ||
    m.includes('carin') ||
    m.includes('pet')
  ) {
    return 'Mimada';
  }
  return 'Tranquila';
}

function normalizeAction(rawAction?: string): ValidAction {
  if (!rawAction || rawAction.includes('|')) return 'none';
  const a = rawAction.trim();
  if (VALID_ACTIONS.includes(a as ValidAction)) return a as ValidAction;

  const lower = a
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (lower.includes('undress') || lower.includes('desvist') || lower.includes('quitar_traje') || lower.includes('quitate')) return 'undressSuit';
  if (lower.includes('dress') || lower.includes('vestir') || lower.includes('poner_traje')) return 'dressSuit';
  if (lower.includes('tirante') || lower.includes('strap')) return 'slipStrap';
  if (lower.includes('guante') || lower.includes('glove')) return 'toggleGloves';
  if (lower.includes('liguero') || lower.includes('garter')) return 'toggleGarters';
  if (lower.includes('gargantilla') || lower.includes('choker')) return 'toggleChoker';
  if (lower.includes('corazon') || lower.includes('heart_hand') || lower.includes('hearthand')) return 'heartHands';
  if (lower.includes('salute') || lower.includes('militar') || lower.includes('firme')) return 'salute';
  if (lower.includes('gat') || lower.includes('cat_paw') || lower.includes('catpaw') || lower.includes('miau') || lower.includes('nya')) return 'catPaws';
  if (lower.includes('cosquill') || lower.includes('tickl')) return 'tickle';
  if (lower.includes('shy_finger') || lower.includes('shyfinger') || lower.includes('deditos') || lower.includes('pena')) return 'shyFingers';
  if (lower.includes('rosa') || lower.includes('rose') || lower.includes('flor')) return 'giveRose';
  if (lower.includes('foto') || lower.includes('photo') || lower.includes('camara') || lower.includes('selfie')) return 'photoPose';
  if (lower.includes('pulgar') || lower.includes('thumb') || lower.includes('like')) return 'thumbsUp';
  if (lower.includes('agach') || lower.includes('crouch') || lower.includes('cuclill') || lower.includes('squat')) return 'crouch';
  if (lower.includes('codo') || lower.includes('elbow')) return 'elbowsIn';
  if (lower.includes('mano_izquierda') || lower.includes('mano izq') || lower.includes('left_hand')) return 'raiseLeftHand';
  if (lower.includes('mano_derecha') || lower.includes('mano der') || lower.includes('una_mano') || lower.includes('right_hand')) return 'raiseRightHand';
  if (lower.includes('paz') || lower.includes('peace') || lower.includes('victoria')) return 'peaceSign';
  if (lower.includes('senal') || lower.includes('point') || lower.includes('indice')) return 'pointFinger';
  if (lower.includes('rock') || lower.includes('cuerno')) return 'rockSign';
  if (lower.includes('cintura') || lower.includes('hips_hand')) return 'handsOnHips';
  if (lower.includes('cruz') || lower.includes('cross')) return 'crossArms';
  if (lower.includes('tapar') || lower.includes('cover') || lower.includes('cara')) return 'coverFace';
  if (lower.includes('pierna') || lower.includes('leg') || lower.includes('pie')) return 'liftLeg';
  if (lower.includes('showoff') || lower.includes('exhib') || lower.includes('presum') || lower.includes('360')) return 'showOff';
  if (lower.includes('kiss') || lower.includes('beso') || lower.includes('mua')) return 'blowKiss';
  if (lower.includes('wink') || lower.includes('guin')) return 'wink';
  if (lower.includes('curtsy') || lower.includes('reverenc') || lower.includes('cortesi')) return 'curtsy';
  if (lower.includes('bow') || lower.includes('inclin')) return 'bow';
  if (lower.includes('wavehand') || lower.includes('salud')) return 'waveHand';
  if (lower.includes('strut') || lower.includes('pasarel') || lower.includes('desfil') || lower.includes('camin')) return 'strut';
  if (lower.includes('hipsway') || lower.includes('cader') || lower.includes('mene')) return 'hipSway';
  if (lower.includes('cheer') || lower.includes('celebr') || lower.includes('anim')) return 'cheer';
  if (lower.includes('pout') || lower.includes('pucher') || lower.includes('berrinch') || lower.includes('enoj')) return 'pout';
  if (lower.includes('peek') || lower.includes('escond') || lower.includes('asom')) return 'peekaboo';
  if (lower.includes('shiver') || lower.includes('escalofr') || lower.includes('tembl') || lower.includes('frio')) return 'shiver';
  if (lower.includes('dance') || lower.includes('bail')) return 'dance';
  if (lower.includes('spin') || lower.includes('turn') || lower.includes('gir') || lower.includes('vuelta')) return 'spin';
  if (lower.includes('giggle') || lower.includes('laugh') || lower.includes('ris') || lower.includes('reir')) return 'giggle';
  if (
    lower.includes('tease') ||
    lower.includes('flirt') ||
    lower.includes('flutter') ||
    lower.includes('blush') ||
    lower.includes('coquet') ||
    lower.includes('pose')
  ) {
    return 'tease';
  }
  if (lower.includes('jump') || lower.includes('hop') || lower.includes('salt') || lower.includes('brinc')) return 'jump';
  if (lower.includes('stretch') || lower.includes('estir')) return 'stretch';
  if (lower.includes('nod') || lower.includes('asent') || lower.includes('yes')) return 'nod';
  if (lower.includes('shake') || lower.includes('neg')) return 'shakeHead';
  if (lower.includes('breeze') || lower.includes('wind') || lower.includes('bris') || lower.includes('viento')) return 'breeze';
  if (lower.includes('feed') || lower.includes('eat') || lower.includes('cupcake') || lower.includes('com')) return 'feed';
  if (lower.includes('bust') || lower.includes('pecho')) return 'bounceBust';
  if (lower.includes('glut') || lower.includes('trasero')) return 'bounceGlutes';
  if (lower.includes('wave') || lower.includes('onda') || lower.includes('jiggle') || lower.includes('rebote')) return 'wave';
  if (lower.includes('happy') || lower.includes('alegr')) return 'happy';
  return 'none';
}

const ACTION_TO_ANIMATION: Record<ValidAction, ValidAnimation> = {
  none: 'talk',
  happy: 'happy',
  feed: 'eat',
  wave: 'outfit_pose',
  breeze: 'breeze',
  bounceBust: 'shy',
  bounceGlutes: 'hip_sway',
  dance: 'dance',
  spin: 'outfit_pose',
  giggle: 'giggle',
  tease: 'tease',
  nod: 'nod',
  shakeHead: 'shake_head',
  stretch: 'stretch',
  jump: 'happy',
  waveHand: 'wave_hand',
  blowKiss: 'blow_kiss',
  curtsy: 'curtsy',
  hipSway: 'hip_sway',
  strut: 'strut',
  cheer: 'cheer',
  pout: 'pout',
  peekaboo: 'peekaboo',
  shiver: 'shiver',
  bow: 'bow',
  wink: 'wink',
  showOff: 'outfit_pose',
  thumbsUp: 'thumbs_up',
  crouch: 'crouch',
  elbowsIn: 'elbows_in',
  raiseLeftHand: 'raise_left_hand',
  raiseRightHand: 'raise_right_hand',
  peaceSign: 'peace_sign',
  pointFinger: 'point_finger',
  rockSign: 'rock_sign',
  handsOnHips: 'hands_on_hips',
  crossArms: 'cross_arms',
  coverFace: 'cover_face',
  liftLeg: 'lift_leg',
  heartHands: 'heart_hands',
  salute: 'salute',
  catPaws: 'cat_paws',
  tickle: 'tickled',
  shyFingers: 'shy_fingers',
  giveRose: 'rose_blush',
  photoPose: 'peace_sign',
  undressSuit: 'shy_fingers',
  dressSuit: 'outfit_pose',
  slipStrap: 'shy',
  toggleGloves: 'outfit_pose',
  toggleStockings: 'outfit_pose',
  toggleGarters: 'shy',
  toggleChoker: 'outfit_pose',
};

function cleanAndTrimReply(rawReply: string): string {
  let text = rawReply
    .replace(/^\s*\[[^\]]*\]\s*/g, '')
    .replace(/^\s*\{\s*"reply"\s*:\s*"?/i, '')
    .replace(/"?\s*,\s*"mood"[\s\S]*$/i, '')
    .replace(/\{[\s\S]*\}/g, '')
    .replace(/^["'«]+|["'»]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > 240) {
    const sliced = text.slice(0, 240);
    const lastPunct = Math.max(
      sliced.lastIndexOf('.'),
      sliced.lastIndexOf('!'),
      sliced.lastIndexOf('?'),
      sliced.lastIndexOf('…'),
    );
    if (lastPunct > 60) {
      text = sliced.slice(0, lastPunct + 1);
    } else {
      const lastSpace = sliced.lastIndexOf(' ');
      text = `${sliced.slice(0, lastSpace > 45 ? lastSpace : 225)}…`;
    }
  }

  return text || 'Mmm… tienes toda mi atención en este escenario.';
}

function parseChoreography(raw: unknown): ServerChoreographyBeat[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const beats: ServerChoreographyBeat[] = [];
  for (const item of raw.slice(0, 4)) {
    if (!item || typeof item !== 'object') continue;
    const b = item as Record<string, unknown>;
    const delayMs =
      typeof b.delayMs === 'number' && Number.isFinite(b.delayMs)
        ? clampNum(Math.round(b.delayMs), 150, 6000)
        : (beats.length + 1) * 900;
    const action = typeof b.action === 'string' ? normalizeAction(b.action) : undefined;
    const view =
      typeof b.view === 'string' && VALID_VIEWS.includes(b.view as ValidView)
        ? (b.view as ValidView)
        : undefined;
    const rigPose = sanitizeRigPose(b.rigPose);
    if ((action && action !== 'none') || view || rigPose) {
      beats.push({
        delayMs,
        action: action && action !== 'none' ? action : undefined,
        view,
        rigPose,
      });
    }
  }
  return beats.length > 0 ? beats : undefined;
}

function parseMarionetaModelOutput(rawText: string): ParsedModelPayload {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  // Caso 1: Formato compacto [Ánimo | Movimiento1 + Movimiento2] Texto...
  const bracketMatch = cleaned.match(/^\s*\[\s*([^\]|]+?)(?:\s*\|\s*([^\]]+?))?\s*\]\s*([\s\S]*)$/);
  if (bracketMatch) {
    const rawMood = bracketMatch[1]?.trim();
    const rawMovePart = bracketMatch[2]?.trim() || '';
    const moveTokens = rawMovePart.split(/\s*(?:\+|,|y|->)\s*/i).filter(Boolean);
    const replyBody = bracketMatch[3]?.trim() || '';
    return {
      reply: cleanAndTrimReply(replyBody),
      mood: rawMood,
      action: moveTokens[0],
      secondaryAction: moveTokens[1],
      animation: moveTokens[0],
    };
  }

  // Caso 2: JSON estructurado del Director de Avatar
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}');
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    const candidate = cleaned.slice(jsonStart, jsonEnd + 1);
    try {
      const obj = JSON.parse(candidate) as Record<string, unknown>;
      let changeLingerie: ServerLingerieChange | undefined;
      if (obj.changeLingerie && typeof obj.changeLingerie === 'object') {
        const l = obj.changeLingerie as Record<string, unknown>;
        changeLingerie = {};
        if (typeof l.bra === 'boolean') changeLingerie.bra = l.bra;
        if (typeof l.panties === 'boolean') changeLingerie.panties = l.panties;
        if (typeof l.stockings === 'boolean') changeLingerie.stockings = l.stockings;
        if (typeof l.garters === 'boolean') changeLingerie.garters = l.garters;
        if (typeof l.gloves === 'boolean') changeLingerie.gloves = l.gloves;
        if (typeof l.choker === 'boolean') changeLingerie.choker = l.choker;
        if (l.strapSlip === 'none' || l.strapSlip === 'left' || l.strapSlip === 'both') {
          changeLingerie.strapSlip = l.strapSlip;
        }
        if (Object.keys(changeLingerie).length === 0) changeLingerie = undefined;
      }
      return {
        reply: cleanAndTrimReply(String(obj.reply ?? '')),
        mood: typeof obj.mood === 'string' ? obj.mood : undefined,
        action: typeof obj.action === 'string' ? obj.action : undefined,
        secondaryAction: typeof obj.secondaryAction === 'string' ? obj.secondaryAction : undefined,
        animation: typeof obj.animation === 'string' ? obj.animation : undefined,
        affectionDelta: typeof obj.affectionDelta === 'number' ? obj.affectionDelta : undefined,
        blushDelta: typeof obj.blushDelta === 'number' ? obj.blushDelta : undefined,
        trustDelta: typeof obj.trustDelta === 'number' ? obj.trustDelta : undefined,
        changeSuit: typeof obj.changeSuit === 'string' ? obj.changeSuit : undefined,
        animateUndress: typeof obj.animateUndress === 'boolean' ? obj.animateUndress : undefined,
        animateDressSuit: typeof obj.animateDressSuit === 'string' ? obj.animateDressSuit : undefined,
        changeView: typeof obj.changeView === 'string' ? obj.changeView : undefined,
        changeZipper: typeof obj.changeZipper === 'number' ? obj.changeZipper : undefined,
        changeLingerie,
        rigPose: sanitizeRigPose(obj.rigPose),
        choreography: parseChoreography(obj.choreography),
        spawnEffect: typeof obj.spawnEffect === 'string' ? obj.spawnEffect : undefined,
      };
    } catch {
      return {
        reply: cleanAndTrimReply(cleaned),
      };
    }
  }

  return {
    reply: cleanAndTrimReply(cleaned),
  };
}

function extractRequestedActionsInOrder(normText: string): ValidAction[] {
  const patterns: Array<{ action: ValidAction; regex: RegExp }> = [
    { action: 'slipStrap', regex: /baja(?:te)? (?:un |el |los )?tirante|desliza (?:el |los )?tirante|sube(?:te)? (?:el |los )?tirante/ },
    { action: 'heartHands', regex: /corazon con las manos|corazon con los dedos|haz un corazon|finger heart/ },
    { action: 'salute', regex: /saludo militar|saluda firme|a sus ordenes|firme/ },
    { action: 'catPaws', regex: /patitas de gato|gatita|miau|nya|garras de gato/ },
    { action: 'tickle', regex: /cosquillas|pluma/ },
    { action: 'shyFingers', regex: /deditos timidos|junta los indices|timida con los dedos/ },
    { action: 'giveRose', regex: /una rosa|toma esta rosa|flor gotica|regalo una rosa/ },
    { action: 'photoPose', regex: /foto|camara|sonrie para la foto|selfie|pose de foto/ },
    { action: 'thumbsUp', regex: /pulgar|thumbs|like\b/ },
    { action: 'crouch', regex: /agacha|cuclillas|baja el cuerpo|flexiona las rodillas|arrodilla/ },
    { action: 'elbowsIn', regex: /junta los codos|juntar los codos|codos juntos|une los codos/ },
    { action: 'raiseLeftHand', regex: /levanta (?:solo |solamente )?(?:tu |la )?mano izquierda|alza la mano izquierda/ },
    { action: 'raiseRightHand', regex: /levanta (?:solo |solamente )?(?:tu |la |una )?mano(?: derecha)?|una mano solamente|alza una mano/ },
    { action: 'peaceSign', regex: /paz\b|amor y paz|senal de victoria|dedos en v\b/ },
    { action: 'pointFinger', regex: /senala|apunta|dedo indice/ },
    { action: 'rockSign', regex: /\brock\b|cuernos con los dedos/ },
    { action: 'handsOnHips', regex: /manos en la cintura|manos en las caderas|brazos en jarra/ },
    { action: 'crossArms', regex: /cruza los brazos|brazos cruzados/ },
    { action: 'coverFace', regex: /tapa(?:te)? la cara|cubre(?:te)? el rostro|manos en la cara/ },
    { action: 'liftLeg', regex: /levanta (?:una |la )?pierna|levanta un pie/ },
    { action: 'showOff', regex: /exhibe|presume|360|muestrate completa|todos los angulos/ },
    { action: 'curtsy', regex: /reverencia|cortesia/ },
    { action: 'bow', regex: /inclinate|inclinacion/ },
    { action: 'blowKiss', regex: /beso|besito|mua/ },
    { action: 'wink', regex: /guino|guiname|guina/ },
    { action: 'waveHand', regex: /saludame|saluda con la mano|agita la mano/ },
    { action: 'dance', regex: /baila|danza|coreografia/ },
    { action: 'hipSway', regex: /menea|caderas|balancea tus caderas/ },
    { action: 'strut', regex: /desfila|pasarela|camina/ },
    { action: 'spin', regex: /gira completo|una vuelta|da una vuelta/ },
    { action: 'cheer', regex: /celebra|anima|bravo/ },
    { action: 'pout', regex: /puchero|berrinche|enojate|enfadate/ },
    { action: 'peekaboo', regex: /escondete|asomate|escondidas/ },
    { action: 'shiver', regex: /tiembla|escalofrio|frio/ },
    { action: 'jump', regex: /salta|brinca/ },
    { action: 'stretch', regex: /estira|estirate|bosteza/ },
    { action: 'feed', regex: /cupcake|pastel|come|alimenta|postre|dulce/ },
    { action: 'breeze', regex: /brisa|viento|sopla|aire/ },
    { action: 'bounceBust', regex: /rebota el busto|mueve el pecho|sacude el busto/ },
    { action: 'bounceGlutes', regex: /rebota los gluteos|sacude el trasero/ },
    { action: 'wave', regex: /onda fisica|sacudete|rebota/ },
    { action: 'giggle', regex: /riete|risita|sonrie/ },
    { action: 'tease', regex: /coquetea|seduceme|posa|modela/ },
    { action: 'nod', regex: /asiente|di que si/ },
    { action: 'shakeHead', regex: /niega|di que no/ },
  ];

  const matches: Array<{ action: ValidAction; index: number }> = [];
  for (const p of patterns) {
    const m = p.regex.exec(normText);
    if (m && m.index !== undefined) {
      matches.push({ action: p.action, index: m.index });
    }
  }
  matches.sort((a, b) => a.index - b.index);
  return matches.map((m) => m.action);
}

function compileCustomRigPose(userNorm: string): ServerRigPose | undefined {
  if (!userNorm) return undefined;
  const rig: ServerRigPose = { durationSec: 2.8 };
  let hasCustomJoint = false;

  const mentionsLeft = /izquierd/.test(userNorm);
  const mentionsRight = /derech/.test(userNorm);
  const onlyOneHand = /una mano|solo la mano|solamente una mano|una sola mano/.test(userNorm);

  let targetGesture: HandGesture | undefined;
  if (/corazon con (?:las manos|los dedos)|finger heart/.test(userNorm)) targetGesture = 'heart_pinch';
  else if (/pulgar|thumbs|like\b/.test(userNorm)) targetGesture = 'thumbs_up';
  else if (/paz\b|victoria|dedos en v\b/.test(userNorm)) targetGesture = 'peace';
  else if (/senala|apunta|indice/.test(userNorm)) targetGesture = 'point';
  else if (/puno|cierra la mano|cierra los dedos/.test(userNorm)) targetGesture = 'fist';
  else if (/\brock\b|cuernos/.test(userNorm)) targetGesture = 'rock';
  else if (/abre la mano|abre los dedos|cinco dedos|abierta/.test(userNorm)) targetGesture = 'wave_spread';

  if (targetGesture) {
    hasCustomJoint = true;
    if (targetGesture === 'heart_pinch') {
      rig.shoulderL = -0.52;
      rig.elbowL = -1.35;
      rig.handL = 'heart_pinch';
      rig.shoulderR = -0.52;
      rig.elbowR = -1.35;
      rig.handR = 'heart_pinch';
    } else if (mentionsLeft && !mentionsRight) {
      rig.shoulderL = 0.68;
      rig.elbowL = -1.15;
      rig.handL = targetGesture;
      if (onlyOneHand) {
        rig.shoulderR = 0;
        rig.elbowR = 0;
        rig.handR = 'open';
      }
    } else if (mentionsRight || onlyOneHand || targetGesture === 'thumbs_up' || targetGesture === 'point') {
      rig.shoulderR = targetGesture === 'thumbs_up' ? -0.32 : 0.68;
      rig.elbowR = targetGesture === 'thumbs_up' ? -1.65 : -1.15;
      rig.handR = targetGesture;
      if (onlyOneHand) {
        rig.shoulderL = 0;
        rig.elbowL = 0;
        rig.handL = 'open';
      }
    } else {
      rig.shoulderL = 0.72;
      rig.elbowL = -1.05;
      rig.handL = targetGesture;
      rig.shoulderR = 0.72;
      rig.elbowR = -1.05;
      rig.handR = targetGesture;
    }
  }

  if (/levanta|alza|sube/.test(userNorm) && /mano|brazo/.test(userNorm) && !targetGesture) {
    hasCustomJoint = true;
    if (mentionsLeft && !mentionsRight) {
      rig.shoulderL = 1.25;
      rig.elbowL = 0.65;
      rig.handL = 'wave_spread';
      rig.shoulderR = 0;
      rig.elbowR = 0;
    } else if (mentionsRight || onlyOneHand) {
      rig.shoulderR = 1.25;
      rig.elbowR = 0.65;
      rig.handR = 'wave_spread';
      rig.shoulderL = 0;
      rig.elbowL = 0;
    } else if (/ambas|las dos|los dos/.test(userNorm)) {
      rig.shoulderL = 1.25;
      rig.elbowL = 0.65;
      rig.handL = 'wave_spread';
      rig.shoulderR = 1.25;
      rig.elbowR = 0.65;
      rig.handR = 'wave_spread';
    }
  }

  if (/junta(?:r)? (?:los |tus )?codos|codos juntos|une los codos|codos hacia adentro/.test(userNorm)) {
    hasCustomJoint = true;
    rig.shoulderL = -0.88;
    rig.shoulderR = -0.88;
    rig.elbowL = -1.65;
    rig.elbowR = -1.65;
    rig.handL = rig.handL ?? 'kiss_hand';
    rig.handR = rig.handR ?? 'kiss_hand';
  } else if (/abre los codos|codos hacia afuera|manos en la nuca/.test(userNorm)) {
    hasCustomJoint = true;
    rig.shoulderL = 0.85;
    rig.shoulderR = 0.85;
    rig.elbowL = -1.55;
    rig.elbowR = -1.55;
  } else if (/dobla (?:el |los )?codo/.test(userNorm)) {
    hasCustomJoint = true;
    if (mentionsLeft && !mentionsRight) rig.elbowL = -1.35;
    else if (mentionsRight && !mentionsLeft) rig.elbowR = -1.35;
    else {
      rig.elbowL = -1.35;
      rig.elbowR = -1.35;
    }
  }

  if (/agacha|cuclillas|flexiona las rodillas|baja el cuerpo/.test(userNorm) && !/salta/.test(userNorm)) {
    hasCustomJoint = true;
    rig.crouch = 0.9;
  }
  if (/levanta (?:la |una )?pierna|levanta (?:el |un )?pie/.test(userNorm)) {
    hasCustomJoint = true;
    if (mentionsLeft && !mentionsRight) rig.legLiftL = 0.9;
    else rig.legLiftR = 0.9;
  }

  if (/abre la boca|boca abierta/.test(userNorm)) {
    hasCustomJoint = true;
    rig.mouthShape = 'open';
    rig.mouthOpen = 0.85;
  } else if (/cierra la boca|boca cerrada/.test(userNorm)) {
    hasCustomJoint = true;
    rig.mouthShape = 'neutral';
    rig.mouthOpen = 0;
  } else if (/sonrie|sonrisa/.test(userNorm)) {
    hasCustomJoint = true;
    rig.mouthShape = 'smile';
  }

  if (/cierra los ojos|ojos cerrados/.test(userNorm)) {
    hasCustomJoint = true;
    rig.eyeOpenL = 0;
    rig.eyeOpenR = 0;
  } else if (/guina|guino|cierra un ojo/.test(userNorm)) {
    hasCustomJoint = true;
    if (mentionsLeft) rig.eyeOpenL = 0;
    else rig.eyeOpenR = 0;
  } else if (/abre (?:bien )?los ojos|ojos muy abiertos/.test(userNorm)) {
    hasCustomJoint = true;
    rig.eyeOpenL = 1.35;
    rig.eyeOpenR = 1.35;
  }

  if (/inclina la cabeza|ladea la cabeza/.test(userNorm)) {
    hasCustomJoint = true;
    rig.headTilt = mentionsLeft ? -0.9 : 0.9;
  }
  if (/mira hacia arriba|cabeza arriba/.test(userNorm)) {
    hasCustomJoint = true;
    rig.headNod = -0.9;
    rig.eyeLookY = -0.9;
  } else if (/mira hacia abajo|cabeza abajo/.test(userNorm)) {
    hasCustomJoint = true;
    rig.headNod = 0.9;
    rig.eyeLookY = 0.9;
  }

  return hasCustomJoint ? rig : undefined;
}

function resolvePhysicalMovementAndChanges(
  parsed: ParsedModelPayload,
  body: MarionetaRequestBody,
): {
  mood: ValidMood;
  action: ValidAction;
  secondaryAction?: ValidAction;
  animation: ValidAnimation;
  affectionDelta: number;
  blushDelta: number;
  trustDelta: number;
  changeSuit?: ValidSuit;
  animateUndress?: boolean;
  animateDressSuit?: ValidSuit;
  changeView?: ValidView;
  changeZipper?: number;
  changeLingerie?: ServerLingerieChange;
  rigPose?: ServerRigPose;
  choreography?: ServerChoreographyBeat[];
  spawnEffect?: ValidEffect;
} {
  let mood = normalizeMood(parsed.mood);
  let action = normalizeAction(parsed.action);
  let secondaryAction = normalizeAction(parsed.secondaryAction);
  let affectionDelta = parsed.affectionDelta ?? 6;
  let blushDelta = parsed.blushDelta ?? 0.08;
  let trustDelta = parsed.trustDelta ?? 2;

  let changeSuit: ValidSuit | undefined =
    parsed.changeSuit && VALID_SUITS.includes(parsed.changeSuit as ValidSuit)
      ? (parsed.changeSuit as ValidSuit)
      : undefined;
  let animateUndress: boolean | undefined = parsed.animateUndress || undefined;
  let animateDressSuit: ValidSuit | undefined =
    parsed.animateDressSuit &&
    parsed.animateDressSuit !== 'none' &&
    VALID_SUITS.includes(parsed.animateDressSuit as ValidSuit)
      ? (parsed.animateDressSuit as ValidSuit)
      : undefined;
  let changeView: ValidView | undefined =
    parsed.changeView && VALID_VIEWS.includes(parsed.changeView as ValidView)
      ? (parsed.changeView as ValidView)
      : undefined;
  let changeZipper: number | undefined =
    typeof parsed.changeZipper === 'number' && Number.isFinite(parsed.changeZipper)
      ? clampNum(Math.round(parsed.changeZipper), 0, 100)
      : undefined;
  let changeLingerie: ServerLingerieChange | undefined = parsed.changeLingerie;
  let rigPose: ServerRigPose | undefined = parsed.rigPose;
  const choreography: ServerChoreographyBeat[] | undefined = parsed.choreography;
  let spawnEffect: ValidEffect | undefined =
    parsed.spawnEffect && VALID_EFFECTS.includes(parsed.spawnEffect as ValidEffect)
      ? (parsed.spawnEffect as ValidEffect)
      : undefined;

  const userNorm = (body.userMessage ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  const replyNorm = (parsed.reply ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Reacciones físicas cuando el usuario interactúa con el lienzo 2D
  if (body.mode === 'reaction' && body.interactionEvent) {
    const ev = body.interactionEvent.type;
    switch (ev) {
      case 'breeze':
        action = 'breeze';
        mood = 'Sorprendida';
        affectionDelta = 4;
        blushDelta = 0.09;
        break;
      case 'pet_hair':
      case 'pet_face':
        if (action === 'none') action = 'giggle';
        mood = 'Mimada';
        affectionDelta = 6;
        blushDelta = 0.1;
        trustDelta = 3;
        break;
      case 'touch_soft':
      case 'pull_skirt':
        if (action === 'none') action = 'elbowsIn';
        mood = 'Ruborizada';
        affectionDelta = 3;
        blushDelta = 0.16;
        break;
      case 'tickle':
        action = 'tickle';
        mood = 'Juguetona';
        affectionDelta = 7;
        blushDelta = 0.14;
        trustDelta = 3;
        spawnEffect = spawnEffect ?? 'stars';
        break;
      case 'rose':
        action = 'giveRose';
        mood = 'Mimada';
        affectionDelta = 12;
        blushDelta = 0.2;
        trustDelta = 6;
        spawnEffect = spawnEffect ?? 'petals';
        break;
      case 'music_box':
        action = 'dance';
        mood = 'Feliz';
        affectionDelta = 6;
        blushDelta = 0.08;
        spawnEffect = spawnEffect ?? 'notes';
        break;
      case 'photo':
        action = 'photoPose';
        mood = 'Traviesa';
        affectionDelta = 5;
        blushDelta = 0.1;
        spawnEffect = spawnEffect ?? 'stars';
        break;
      case 'cube_hit':
        action = 'pout';
        mood = 'Sorprendida';
        affectionDelta = -1;
        blushDelta = 0.12;
        break;
      case 'feed':
        action = 'cheer';
        mood = 'Feliz';
        affectionDelta = 8;
        blushDelta = 0.1;
        trustDelta = 4;
        break;
      case 'zipper':
        action = body.avatarState.zipper > 45 ? 'coverFace' : 'wink';
        mood = body.avatarState.zipper > 45 ? 'Ruborizada' : 'Traviesa';
        blushDelta = body.avatarState.zipper > 45 ? 0.18 : 0.06;
        break;
      case 'change_suit':
      case 'change_view':
        action = body.avatarState.suit === 'maid' ? 'curtsy' : 'handsOnHips';
        mood = body.avatarState.suit === 'none' ? 'Ruborizada' : 'Mimada';
        break;
      case 'undress_suit':
        action = 'shyFingers';
        mood = 'Ruborizada';
        blushDelta = 0.22;
        affectionDelta = 7;
        spawnEffect = spawnEffect ?? 'hearts';
        break;
      case 'dress_suit':
        action = body.avatarState.suit === 'maid' ? 'curtsy' : 'wink';
        mood = 'Feliz';
        affectionDelta = 6;
        spawnEffect = spawnEffect ?? 'stars';
        break;
      case 'slip_strap':
        action = 'wink';
        mood = 'Ruborizada';
        blushDelta = 0.16;
        affectionDelta = 5;
        spawnEffect = spawnEffect ?? 'hearts';
        break;
      case 'bra_clasp':
        action = 'shiver';
        mood = 'Sorprendida';
        blushDelta = 0.2;
        spawnEffect = spawnEffect ?? 'stars';
        break;
      case 'tug_garter':
        action = 'elbowsIn';
        mood = 'Ruborizada';
        blushDelta = 0.14;
        affectionDelta = 4;
        break;
      case 'toggle_gloves':
        action = 'waveHand';
        mood = 'Mimada';
        affectionDelta = 4;
        break;
      default:
        break;
    }
  }

  // 2. Comandos, ropa interactiva, articulaciones del Rig 2D y secuencias pedidas explícitamente por el usuario
  if (body.mode === 'chat' && userNorm) {
    const asksUndress =
      /sin traje|quitate el traje|quitate la ropa|desvistete|en lenceria|sacate el traje|sacate la ropa|desnud/.test(
        userNorm,
      );
    const asksDress = /ponte|vistete|usa el traje|usa el vestido|cambia(?:te)? al|cambiate a/.test(userNorm);

    if (asksUndress) {
      animateUndress = true;
      changeSuit = undefined;
      mood = 'Ruborizada';
      blushDelta = 0.22;
      spawnEffect = spawnEffect ?? 'hearts';
      if (action === 'none') action = 'undressSuit';
    } else if (!animateDressSuit && !changeSuit) {
      if (/\bmaid\b|sirvienta|delantal|mucama/.test(userNorm)) {
        if (asksDress || body.avatarState.suit === 'none') animateDressSuit = 'maid';
        else changeSuit = 'maid';
        if (mood === 'Tranquila') mood = 'Mimada';
      } else if (/\bmarfil\b|seda|dorad|gala/.test(userNorm)) {
        if (asksDress || body.avatarState.suit === 'none') animateDressSuit = 'marfil';
        else changeSuit = 'marfil';
        if (mood === 'Tranquila') mood = 'Feliz';
      } else if (/\boriginal\b|latex/.test(userNorm)) {
        if (asksDress || body.avatarState.suit === 'none') animateDressSuit = 'original';
        else changeSuit = 'original';
      } else if (/\bvistete\b|ponte el traje|ponte la ropa/.test(userNorm)) {
        animateDressSuit = 'original';
        if (mood === 'Tranquila') mood = 'Feliz';
      }
    } else if (changeSuit === 'none') {
      // Convert AI changeSuit:'none' into the smooth animated undress choreography!
      animateUndress = true;
      changeSuit = undefined;
    }

    if (!changeView && !/360|exhibe|presume|gira completo|una vuelta/.test(userNorm)) {
      if (/lateral|de lado|perfil|costado/.test(userNorm)) {
        changeView = 'side';
      } else if (/trasera|espalda|atras|date la vuelta|de espaldas/.test(userNorm)) {
        changeView = 'back';
      } else if (/frontal|de frente|mirame/.test(userNorm)) {
        changeView = 'front';
      }
    }

    if (!animateUndress && !animateDressSuit && changeZipper === undefined && /cremallera|cierre|zipper/.test(userNorm)) {
      if (body.avatarState.view !== 'front' && !changeView) {
        changeView = 'front';
      }
      const numMatch = userNorm.match(/(\d{1,3})\s*%?/);
      if (numMatch) {
        changeZipper = clampNum(Number(numMatch[1]), 0, 100);
      } else if (/sube|cierra|cerrada/.test(userNorm)) {
        changeZipper = 0;
        if (action === 'none') action = 'nod';
      } else {
        const currentZip = body.avatarState.zipper || 0;
        changeZipper = /todo|completa|maximo|100/.test(userNorm)
          ? 100
          : Math.min(100, currentZip < 45 ? 55 : currentZip + 35);
        mood = 'Ruborizada';
        blushDelta = 0.2;
        if (action === 'none') action = 'elbowsIn';
      }
    }

    // Prendas y detalles realistas (tirantes, guantes, ligueros, gargantilla, medias, sostén, braga)
    if (/tirante|strap|guante|liguero|gargantilla|choker|collar|sosten|bra\b|braga|panty|medias|calcetas/.test(userNorm)) {
      const turnOff = /quita|sin |desactiva|saca|baja/.test(userNorm);
      const turnOn = /pon|activa|usa|sube|ajusta/.test(userNorm);
      const targetVal = turnOn && !turnOff;
      const patch: ServerLingerieChange = { ...(changeLingerie ?? {}) };
      let touched = false;

      if (/tirante|strap/.test(userNorm)) {
        if (/ambos|los dos/.test(userNorm) && /baja|quita|desliza/.test(userNorm)) {
          patch.strapSlip = 'both';
        } else if (/sube|ajusta|normal/.test(userNorm)) {
          patch.strapSlip = 'none';
        } else {
          patch.strapSlip = body.avatarState.strapSlip === 'left' ? 'both' : 'left';
        }
        touched = true;
        mood = patch.strapSlip === 'none' ? 'Tranquila' : 'Ruborizada';
        blushDelta = 0.16;
      }
      if (/guante/.test(userNorm) && (turnOff || turnOn)) {
        patch.gloves = targetVal;
        touched = true;
      }
      if (/liguero/.test(userNorm) && (turnOff || turnOn)) {
        patch.garters = targetVal;
        touched = true;
      }
      if (/gargantilla|choker|collar/.test(userNorm) && (turnOff || turnOn)) {
        patch.choker = targetVal;
        touched = true;
      }
      if (/medias|calcetas/.test(userNorm) && (turnOff || turnOn)) {
        patch.stockings = targetVal;
        touched = true;
      }
      if (/sosten|bra\b/.test(userNorm) && (turnOff || turnOn)) {
        patch.bra = targetVal;
        touched = true;
      }
      if (/braga|panty/.test(userNorm) && (turnOff || turnOn)) {
        patch.panties = targetVal;
        touched = true;
      }

      if (touched) {
        changeLingerie = patch;
        if (turnOff) {
          mood = 'Ruborizada';
          blushDelta = 0.18;
        }
      }
    }

    const userRequestedActions = extractRequestedActionsInOrder(userNorm);
    if (userRequestedActions.length >= 2) {
      action = userRequestedActions[0];
      secondaryAction = userRequestedActions[1];
    } else if (userRequestedActions.length === 1) {
      if (action !== 'none' && action !== userRequestedActions[0] && secondaryAction === 'none') {
        secondaryAction = action;
      }
      action = userRequestedActions[0];
    }

    const compiledRig = compileCustomRigPose(userNorm);
    if (compiledRig) {
      rigPose = rigPose ? { ...rigPose, ...compiledRig } : compiledRig;
    }
  }

  // 3. Fallback semántico de animación según respuesta o ánimo
  if (action === 'none') {
    const replyActions = extractRequestedActionsInOrder(replyNorm);
    if (replyActions.length > 0) {
      action = replyActions[0];
      if (replyActions.length > 1 && secondaryAction === 'none') {
        secondaryAction = replyActions[1];
      }
    } else if (/hola|buenas|bienvenid/.test(userNorm) || /hola|bienvenid/.test(replyNorm)) {
      action = 'waveHand';
    } else if (/guapa|linda|hermosa|preciosa|te amo|te quiero/.test(userNorm)) {
      action = 'heartHands';
      mood = 'Mimada';
      affectionDelta = 11;
      blushDelta = 0.18;
      trustDelta = 4;
      spawnEffect = spawnEffect ?? 'hearts';
    } else if (mood === 'Ruborizada') {
      action = 'shyFingers';
    } else if (mood === 'Traviesa') {
      action = 'wink';
    } else if (mood === 'Juguetona') {
      action = 'catPaws';
    } else if (mood === 'Mimada') {
      action = 'blowKiss';
    } else if (mood === 'Feliz') {
      action = 'thumbsUp';
    } else if (mood === 'Sorprendida') {
      action = 'shiver';
    } else {
      action = 'nod';
    }
  }

  const animation: ValidAnimation = ACTION_TO_ANIMATION[action] ?? 'talk';

  return {
    mood,
    action,
    secondaryAction:
      secondaryAction !== 'none' && secondaryAction !== action ? secondaryAction : undefined,
    animation,
    affectionDelta: clampNum(affectionDelta, -5, 15),
    blushDelta: clampNum(blushDelta, -0.1, 0.25),
    trustDelta: clampNum(trustDelta, -3, 8),
    changeSuit,
    animateUndress,
    animateDressSuit,
    changeView,
    changeZipper,
    changeLingerie,
    rigPose,
    choreography,
    spawnEffect: spawnEffect && spawnEffect !== 'none' ? spawnEffect : undefined,
  };
}

async function callPawanChatCompletion(
  endpointUrl: string,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  timeoutMs = 8500,
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PAWAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: PAWAN_MODEL,
        messages,
        temperature: 0.55,
        top_p: 0.88,
        frequency_penalty: 0.35,
        presence_penalty: 0.15,
        max_tokens: 240,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const err = new Error(
        `HTTP ${response.status} from ${endpointUrl}: ${errorText.slice(0, 180)}`,
      ) as Error & { status?: number };
      err.status = response.status;
      throw err;
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('EMPTY_PAWAN_RESPONSE');
    }

    return content;
  } finally {
    clearTimeout(timer);
  }
}

const GEMINI_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: {
      type: Type.STRING,
      description: 'Diálogo breve y natural de Marioneta en español (1 a 2 oraciones, máx 32 palabras).',
    },
    mood: {
      type: Type.STRING,
      enum: [...VALID_MOODS],
    },
    action: {
      type: Type.STRING,
      enum: [...VALID_ACTIONS],
    },
    secondaryAction: {
      type: Type.STRING,
      enum: [...VALID_ACTIONS],
    },
    changeSuit: {
      type: Type.STRING,
      enum: [...VALID_SUITS],
    },
    animateUndress: {
      type: Type.BOOLEAN,
      description: 'Actívalo en true cuando te pidan quitarte el traje/ropa para realizar la animación interactiva quedando en lencería gótica.',
    },
    animateDressSuit: {
      type: Type.STRING,
      enum: ['original', 'maid', 'marfil'],
      description: 'Nombre del traje si te pidieron vestirte con animación.',
    },
    changeView: {
      type: Type.STRING,
      enum: [...VALID_VIEWS],
    },
    changeZipper: {
      type: Type.NUMBER,
      description: 'Porcentaje de abertura de cremallera 0..100, solo si el usuario lo pidió o la escena lo amerita.',
    },
    changeLingerie: {
      type: Type.OBJECT,
      properties: {
        bra: { type: Type.BOOLEAN },
        panties: { type: Type.BOOLEAN },
        stockings: { type: Type.BOOLEAN },
        garters: { type: Type.BOOLEAN },
        gloves: { type: Type.BOOLEAN },
        choker: { type: Type.BOOLEAN },
        strapSlip: { type: Type.STRING, enum: ['none', 'left', 'both'] },
      },
    },
    spawnEffect: {
      type: Type.STRING,
      enum: [...VALID_EFFECTS],
    },
    affectionDelta: { type: Type.NUMBER },
    blushDelta: { type: Type.NUMBER },
    trustDelta: { type: Type.NUMBER },
    rigPose: {
      type: Type.OBJECT,
      properties: {
        torsoTilt: { type: Type.NUMBER },
        hipSway: { type: Type.NUMBER },
        crouch: { type: Type.NUMBER },
        jump: { type: Type.NUMBER },
        legLiftL: { type: Type.NUMBER },
        legLiftR: { type: Type.NUMBER },
        shoulderL: { type: Type.NUMBER },
        elbowL: { type: Type.NUMBER },
        handL: { type: Type.STRING, enum: [...VALID_HAND_GESTURES] },
        shoulderR: { type: Type.NUMBER },
        elbowR: { type: Type.NUMBER },
        handR: { type: Type.STRING, enum: [...VALID_HAND_GESTURES] },
        headTilt: { type: Type.NUMBER },
        headNod: { type: Type.NUMBER },
        eyeOpenL: { type: Type.NUMBER },
        eyeOpenR: { type: Type.NUMBER },
        eyeLookX: { type: Type.NUMBER },
        eyeLookY: { type: Type.NUMBER },
        mouthShape: { type: Type.STRING, enum: [...VALID_MOUTH_SHAPES] },
        mouthOpen: { type: Type.NUMBER },
        durationSec: { type: Type.NUMBER },
      },
    },
    choreography: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          delayMs: { type: Type.NUMBER },
          action: { type: Type.STRING, enum: [...VALID_ACTIONS] },
          view: { type: Type.STRING, enum: [...VALID_VIEWS] },
        },
        required: ['delayMs'],
      },
    },
  },
  required: ['reply', 'mood', 'action'],
};

async function callGeminiFlashLiteFallback(
  systemInstruction: string,
  history: Array<{ role: 'user' | 'model'; text: string }>,
  userPrompt: string,
): Promise<string> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const contents = [
    ...history.slice(-8).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userPrompt }],
    },
  ];

  const response = await ai.models.generateContent({
    model: GEMINI_FALLBACK_MODEL,
    contents,
    config: {
      systemInstruction,
      temperature: 0.72,
      maxOutputTokens: 320,
      responseMimeType: 'application/json',
      responseSchema: GEMINI_RESPONSE_SCHEMA,
    },
  });

  const text = response.text;
  if (!text || !text.trim()) {
    throw new Error('EMPTY_GEMINI_RESPONSE');
  }
  return text;
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/marioneta/respond', async (req, res) => {
    const body = req.body as MarionetaRequestBody | undefined;
    if (!body || !body.avatarState) {
      res.status(400).json({ error: 'INVALID_REQUEST', message: 'Falta avatarState en la petición.' });
      return;
    }

    const systemInstruction = buildSystemInstruction(body);
    const history = (body.history ?? []).slice(-8);
    const historyMessages: Array<{ role: 'user' | 'assistant'; content: string }> = history.map(
      (m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }),
    );

    let userPrompt = '';
    if (body.mode === 'reaction' && body.interactionEvent) {
      const eventDescriptions: Record<string, string> = {
        pet_hair: 'está acariciando suavemente tus mechones de cabello blanco y negro',
        pet_face: 'está acariciando con ternura tu rostro y tus mejillas rojas',
        touch_soft: `está tocando tu cuerpo (${body.interactionEvent.detail || 'curvas'}) con la mano interactiva`,
        tickle: `te está haciendo cosquillas con la pluma en tu ${body.interactionEvent.detail || 'cuerpo'}`,
        feed: 'te acaba de dar a comer un delicioso cupcake glaseado',
        rose: 'te acaba de regalar una rosa gótica carmesí con pétalos flotando',
        happy: 'te acaba de llenar de alegría y corazones',
        music_box: 'activó la caja musical para que bailes al ritmo del vals',
        photo: 'acaba de tomarte una fotografía con flash en el escenario',
        change_suit: `acaba de cambiar tu vestuario a "${body.avatarState.suit}"`,
        change_view: `acaba de girar la cámara a la vista "${body.avatarState.view}"`,
        cube_hit: `te lanzó el cubo físico y rebotó contra tu ${body.interactionEvent.detail || 'cuerpo'}`,
        pull_skirt: `está jalando traviesamente tu ${body.interactionEvent.detail || 'falda'}`,
        zipper: `movió la cremallera de tu traje dejándola al ${body.avatarState.zipper}% abierta`,
        breeze: 'sopló una ráfaga de brisa fresca que agitó tu cabello y tu traje',
        wave: 'activó una onda física que hizo rebotar todo tu cuerpo',
        undress_suit: 'acaba de pedirte quitarte el traje animado y quedaste en tu lencería gótica',
        dress_suit: `acaba de verte vestirte con animación en tu traje "${body.avatarState.suit}"`,
        slip_strap: `hizo clic en el tirante de tu sostén (${body.interactionEvent.detail || 'deslizado'})`,
        bra_clasp: 'tocó juguetonamente el broche trasero de tu sostén por la espalda',
        tug_garter: `jaló suavemente tu ${body.interactionEvent.detail || 'liguero'}`,
        toggle_gloves: `cambió tus guantes (${body.interactionEvent.detail || 'alternado'})`,
        hold_hand: `tomó y movió suavemente tu ${body.interactionEvent.detail || 'mano'} interactuando contigo`,
      };
      const friendlyEvent =
        eventDescriptions[body.interactionEvent.type] ||
        `interactuó contigo (${body.interactionEvent.type})`;

      userPrompt = `(El usuario ${friendlyEvent}. Reacciona en personaje en 1 oración breve en español y devuelve el JSON con tu ánimo, acción y efectos).`;
    } else {
      userPrompt = `${body.userMessage ?? ''}\n(Responde en personaje en 1 o 2 oraciones breves en español y devuelve el JSON controlando tu ánimo, acción, secondaryAction, rigPose o choreography si encaja).`;
    }

    const pawanMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemInstruction },
      ...historyMessages,
      { role: 'user', content: userPrompt },
    ];

    let rawModelText: string | null = null;
    let usedProvider: 'pawan' | 'gemini-flash-lite' | null = null;
    let pawanErrorMsg = '';
    let geminiErrorMsg = '';

    // 1) Intentar primero Pawan (CosmosRP 4.0 Flash) si hay clave configurada
    if (hasValidPawanKey()) {
      for (let i = 0; i < PAWAN_ENDPOINTS.length; i++) {
        const endpointUrl = PAWAN_ENDPOINTS[i];
        try {
          rawModelText = await callPawanChatCompletion(endpointUrl, pawanMessages, 8500);
          usedProvider = 'pawan';
          break;
        } catch (error) {
          pawanErrorMsg = error instanceof Error ? error.message : String(error);
          if (i < PAWAN_ENDPOINTS.length - 1 && isTransientNetworkError(error)) {
            await sleep(250);
            continue;
          }
        }
      }
      if (!rawModelText) {
        console.warn(`[Marioneta AI] Pawan no disponible (${pawanErrorMsg.slice(0, 140)}). Usando respaldo Google Gemini Flash Lite (${GEMINI_FALLBACK_MODEL})...`);
      }
    }

    // 2) Respaldo automático: Google Gemini Flash Lite vía @google/genai
    if (!rawModelText) {
      try {
        rawModelText = await callGeminiFlashLiteFallback(systemInstruction, history, userPrompt);
        usedProvider = 'gemini-flash-lite';
      } catch (error) {
        geminiErrorMsg = error instanceof Error ? error.message : String(error);
        console.error(`[Marioneta AI] Error también en respaldo Gemini Flash Lite: ${geminiErrorMsg.slice(0, 200)}`);
      }
    }

    if (!rawModelText || !usedProvider) {
      res.status(503).json({
        error: 'AI_PROVIDERS_UNAVAILABLE',
        message: 'Ni el proveedor principal (Pawan) ni el respaldo (Google Gemini Flash Lite) respondieron.',
        details: {
          pawan: pawanErrorMsg ? pawanErrorMsg.slice(0, 120) : 'Sin clave PAWAN_API_KEY configurada',
          gemini: geminiErrorMsg ? geminiErrorMsg.slice(0, 120) : 'Sin clave GEMINI_API_KEY configurada',
        },
      });
      return;
    }

    const parsed = parseMarionetaModelOutput(rawModelText);
    const controls = resolvePhysicalMovementAndChanges(parsed, body);

    res.json({
      reply: parsed.reply,
      mood: controls.mood,
      affectionDelta: controls.affectionDelta,
      blushDelta: controls.blushDelta,
      trustDelta: controls.trustDelta,
      action: controls.action,
      secondaryAction: controls.secondaryAction,
      animation: controls.animation,
      changeSuit: controls.changeSuit,
      animateUndress: controls.animateUndress,
      animateDressSuit: controls.animateDressSuit,
      changeView: controls.changeView,
      changeZipper: controls.changeZipper,
      changeLingerie: controls.changeLingerie,
      rigPose: controls.rigPose,
      choreography: controls.choreography,
      spawnEffect: controls.spawnEffect,
      provider: usedProvider,
      source: usedProvider,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Marioneta Pixel server running on http://0.0.0.0:${PORT} (Primary: Pawan ${hasValidPawanKey() ? 'ON' : 'OFF'}, Fallback: ${GEMINI_FALLBACK_MODEL})`,
    );
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
