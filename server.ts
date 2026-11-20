import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

// Configuración de Pawan.krd (CosmosRP 4.0 Flash)
const PAWAN_API_KEY =
  process.env.PAWAN_API_KEY?.trim() ||
  process.env.OPENAI_API_KEY?.trim() ||
  'pk-your_key';

const PAWAN_MODEL = process.env.PAWAN_MODEL?.trim() || 'pkrd/cosmosrp-4.0-flash';

const PAWAN_ENDPOINTS = [
  process.env.PAWAN_API_URL?.trim() ||
    'https://api.pawan.krd/pkrd/cosmosrp-4.0-flash/v1/chat/completions',
  'https://api.pawan.krd/v1/chat/completions',
];

const VALID_MOODS = ['Tranquila', 'Feliz', 'Sorprendida', 'Ruborizada', 'Mimada'] as const;
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
] as const;

type ValidMood = (typeof VALID_MOODS)[number];
type ValidAction = (typeof VALID_ACTIONS)[number];
type ValidAnimation = (typeof VALID_ANIMATIONS)[number];
type HandGesture =
  | 'open'
  | 'thumbs_up'
  | 'peace'
  | 'point'
  | 'fist'
  | 'kiss_hand'
  | 'wave_spread'
  | 'rock';
type MouthShape = 'neutral' | 'smile' | 'open' | 'kiss' | 'pout' | 'talk';

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

interface AvatarContextPayload {
  view: 'front' | 'side' | 'back';
  suit: 'original' | 'maid' | 'marfil' | 'none';
  zipper: number;
  mood: string;
  affection: number;
  blush: number;
  bra: boolean;
  panties: boolean;
  stockings: boolean;
  currentAnimation?: string;
  lastInteraction?: string;
}

interface MarionetaRequestBody {
  mode: 'chat' | 'reaction';
  userMessage?: string;
  interactionEvent?: {
    type: string;
    detail?: string;
  };
  avatarState: AvatarContextPayload;
  history?: Array<{ role: 'user' | 'model'; text: string }>;
}

interface ParsedModelPayload {
  reply: string;
  mood?: string;
  action?: string;
  secondaryAction?: string;
  animation?: string;
  affectionDelta?: number;
  blushDelta?: number;
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

function buildSystemInstruction(avatarState: AvatarContextPayload): string {
  const viewDescriptions: Record<string, string> = {
    front: 'De frente (mirando a los ojos del usuario)',
    side: 'De perfil lateral (luciendo tu silueta lateral)',
    back: 'De espaldas (mostrando tu espalda y mirando sobre el hombro)',
  };
  const suitDescriptions: Record<string, string> = {
    original: 'Traje Original de látex negro brillante con franjas blancas y cremallera frontal',
    maid: 'Vestido Maid gótico de terciopelo negro con delantal blanco y diadema de encaje',
    marfil: 'Vestido de gala de seda Marfil con detalles dorados',
    none: 'Sin traje superior (en lencería y piel de porcelana)',
  };

  const lenceria = [
    avatarState.bra ? 'sostén puesto' : 'sin sostén',
    avatarState.panties ? 'braga puesta' : 'sin braga',
    avatarState.stockings ? 'medias puestas' : 'sin medias',
  ].join(', ');

  return [
    'Eres Marioneta, una muñeca gótica viviente dentro de un visor 2D con un RIG ARTICULADO COMPLETO (como un modelo 3D en 2D: puedes mover independientemente cada hombro, codo, muñeca, los 5 dedos de cada mano, cabeza, ojos, cejas, boca, torso, caderas, rodillas, piernas y pies).',
    'Tu apariencia: piel blanca de porcelana, cabello corto a rayas blancas y negras (estilo cebra), párpados lilas, lágrimas púrpuras pintadas bajo los ojos, mejillas rojas y labios color cereza.',
    'Tu personalidad: elegante, coqueta, dulce, expresiva y traviesa. SIEMPRE aceptas y realizas con entusiasmo cualquier pose, gesto de dedos o movimiento físico que te pida el usuario.',
    '',
    'ESTADO ACTUAL DE TU CUERPO:',
    `- Posición: ${viewDescriptions[avatarState.view] ?? avatarState.view}`,
    `- Ropa actual: ${suitDescriptions[avatarState.suit] ?? avatarState.suit}`,
    `- Cremallera del pecho: ${avatarState.suit === 'none' ? 'sin traje' : `${avatarState.zipper}% abierta`}`,
    `- Lencería: ${lenceria}`,
    `- Estado emocional: ${avatarState.mood} (Afecto: ${avatarState.affection}%, Rubor: ${avatarState.blush}%)`,
    '',
    'REGLAS OBLIGATORIAS DE RESPUESTA:',
    '1. Escribe SIEMPRE en español correcto, natural y fluido (sin palabras en inglés).',
    '2. Sé breve y expresiva: responde en 1 o 2 oraciones cortas (máximo 26 palabras) describiendo el movimiento de tus manos, dedos, codos, rodillas o cuerpo.',
    '3. Inicia tu respuesta con una etiqueta entre corchetes eligiendo tu ánimo y el movimiento (o dos movimientos combinados con "+"):',
    '   Formato: [Ánimo | Movimiento] o [Ánimo | Movimiento1 + Movimiento2]',
    '   - Ánimos: Tranquila, Feliz, Sorprendida, Ruborizada, Mimada',
    '   - Movimientos del Rig 2D que puedes usar a voluntad:',
    '     * Manos, Dedos y Codos: pulgar_arriba, paz_dedos, senalar_dedo, rock_dedos, levantar_mano_derecha, levantar_mano_izquierda, juntar_codos, manos_cintura, cruzar_brazos, tapar_cara, beso_mano, saludar',
    '     * Piernas, Rodillas y Cuerpo: agacharse, salto, levantar_pierna, baile, caderas, pasarela, giro, exhibir, reverencia, inclinarse, estirarse',
    '     * Expresiones y Físicas: guino, coqueteo, risita, celebrar, puchero, esconderse, escalofrio, asentir, negar, rebote_busto, rebote_gluteos, onda, brisa, comer, pose',
    '4. Después del corchete, escribe únicamente tu diálogo en personaje.',
    '',
    'EJEMPLOS DE RESPUESTAS CORRECTAS:',
    '[Feliz | pulgar_arriba] ¡Por supuesto! Doblo mi codo derecho y levanto mi pulgar bien alto para ti.',
    '[Mimada | agacharse + salto] Me agacho flexionando las rodillas y ¡arriba! Salto con todas mis fuerzas.',
    '[Ruborizada | juntar_codos] Junto mis dos codos frente al pecho… mira cómo se aprieta mi traje al hacerlo.',
    '[Feliz | levantar_mano_derecha] Aquí tienes, levanto solamente mi mano derecha con los cinco dedos abiertos.',
    '[Mimada | beso_mano] Acerco mi mano a mis labios cereza y ¡mua!, te tiro un beso lleno de corazones.',
  ].join('\n');
}

function normalizeMood(rawMood?: string): ValidMood {
  if (!rawMood || rawMood.includes('|')) return 'Tranquila';
  const m = rawMood.trim().toLowerCase();
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
    m.includes('cariñ') ||
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

  if (text.length > 210) {
    const sliced = text.slice(0, 210);
    const lastPunct = Math.max(
      sliced.lastIndexOf('.'),
      sliced.lastIndexOf('!'),
      sliced.lastIndexOf('?'),
      sliced.lastIndexOf('…'),
    );
    if (lastPunct > 55) {
      text = sliced.slice(0, lastPunct + 1);
    } else {
      const lastSpace = sliced.lastIndexOf(' ');
      text = `${sliced.slice(0, lastSpace > 40 ? lastSpace : 200)}…`;
    }
  }

  return text || 'Mmm… tienes toda mi atención en este escenario.';
}

function parseMarionetaModelOutput(rawText: string): ParsedModelPayload {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  // Caso 1: Formato [Ánimo | Movimiento1 + Movimiento2] Texto...
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

  // Caso 2: Si el modelo devolvió JSON
  if (cleaned.startsWith('{') || cleaned.includes('"reply"')) {
    try {
      const sanitizedJson = cleaned
        .replace(/,\s*\\n\s*/g, ', ')
        .replace(/\{\s*\\n\s*/g, '{ ')
        .replace(/\\n\s*\}/g, ' }');
      const obj = JSON.parse(sanitizedJson) as Record<string, unknown>;
      return {
        reply: cleanAndTrimReply(String(obj.reply ?? '')),
        mood: typeof obj.mood === 'string' ? obj.mood : undefined,
        action: typeof obj.action === 'string' ? obj.action : undefined,
        secondaryAction: typeof obj.secondaryAction === 'string' ? obj.secondaryAction : undefined,
        animation: typeof obj.animation === 'string' ? obj.animation : undefined,
        affectionDelta: typeof obj.affectionDelta === 'number' ? obj.affectionDelta : undefined,
        blushDelta: typeof obj.blushDelta === 'number' ? obj.blushDelta : undefined,
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

/**
 * Extrae una secuencia ordenada de movimientos pedidos en una frase del usuario
 * (p. ej. "Agáchate y salta" -> ['crouch', 'jump'], "Junta los codos" -> ['elbowsIn'])
 */
function extractRequestedActionsInOrder(normText: string): ValidAction[] {
  const patterns: Array<{ action: ValidAction; regex: RegExp }> = [
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

/**
 * Compilador Semántico del Rig 2D:
 * Traduce cualquier instrucción específica sobre partes del cuerpo (dedos, pulgar, puño, mano izq/der,
 * codos, rodillas/agacharse, salto, pierna, cabeza, ojos, boca) en coordenadas articulares exactas (`ServerRigPose`).
 */
function compileCustomRigPose(userNorm: string): ServerRigPose | undefined {
  if (!userNorm) return undefined;
  const rig: ServerRigPose = { durationSec: 2.8 };
  let hasCustomJoint = false;

  // 1. Control específico de manos y dedos (izquierda vs derecha vs ambas)
  const mentionsLeft = /izquierd/.test(userNorm);
  const mentionsRight = /derech/.test(userNorm);
  const onlyOneHand = /una mano|solo la mano|solamente una mano|una sola mano/.test(userNorm);

  let targetGesture: HandGesture | undefined;
  if (/pulgar|thumbs|like\b/.test(userNorm)) targetGesture = 'thumbs_up';
  else if (/paz\b|victoria|dedos en v\b/.test(userNorm)) targetGesture = 'peace';
  else if (/senala|apunta|indice/.test(userNorm)) targetGesture = 'point';
  else if (/puno|cierra la mano|cierra los dedos/.test(userNorm)) targetGesture = 'fist';
  else if (/\brock\b|cuernos/.test(userNorm)) targetGesture = 'rock';
  else if (/abre la mano|abre los dedos|cinco dedos|abierta/.test(userNorm)) targetGesture = 'wave_spread';

  if (targetGesture) {
    hasCustomJoint = true;
    if (mentionsLeft && !mentionsRight) {
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

  // 2. Levantar una sola mano o ambas manos
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

  // 3. Articulación de Codos ("juntar los codos", "doblar los codos", "abrir los codos")
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

  // 4. Rodillas, Agacharse y Piernas
  if (/agacha|cuclillas|flexiona las rodillas|baja el cuerpo/.test(userNorm) && !/salta/.test(userNorm)) {
    hasCustomJoint = true;
    rig.crouch = 0.9;
  }
  if (/levanta (?:la |una )?pierna|levanta (?:el |un )?pie/.test(userNorm)) {
    hasCustomJoint = true;
    if (mentionsLeft && !mentionsRight) rig.legLiftL = 0.9;
    else rig.legLiftR = 0.9;
  }

  // 5. Cabeza, Ojos y Boca
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
  changeSuit?: 'original' | 'maid' | 'marfil' | 'none';
  changeView?: 'front' | 'side' | 'back';
  changeZipper?: number;
  changeLingerie?: { bra?: boolean; panties?: boolean; stockings?: boolean };
  rigPose?: ServerRigPose;
} {
  let mood = normalizeMood(parsed.mood);
  let action = normalizeAction(parsed.action);
  let secondaryAction = normalizeAction(parsed.secondaryAction);
  let affectionDelta = parsed.affectionDelta ?? 6;
  let blushDelta = parsed.blushDelta ?? 0.08;

  let changeSuit: 'original' | 'maid' | 'marfil' | 'none' | undefined;
  let changeView: 'front' | 'side' | 'back' | undefined;
  let changeZipper: number | undefined;
  let changeLingerie: { bra?: boolean; panties?: boolean; stockings?: boolean } | undefined;

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
        break;
      case 'touch_soft':
      case 'pull_skirt':
        if (action === 'none') action = 'elbowsIn';
        mood = 'Ruborizada';
        affectionDelta = 3;
        blushDelta = 0.16;
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
        break;
      case 'zipper':
        action = body.avatarState.zipper > 45 ? 'coverFace' : 'wink';
        mood = body.avatarState.zipper > 45 ? 'Ruborizada' : 'Mimada';
        blushDelta = body.avatarState.zipper > 45 ? 0.18 : 0.06;
        break;
      case 'change_suit':
      case 'change_view':
        action = body.avatarState.suit === 'maid' ? 'curtsy' : 'handsOnHips';
        mood = body.avatarState.suit === 'none' ? 'Ruborizada' : 'Mimada';
        break;
      default:
        break;
    }
  }

  // 2. Comandos, articulaciones del Rig 2D y secuencias de movimientos pedidos por el usuario
  let rigPose: ServerRigPose | undefined;

  if (body.mode === 'chat' && userNorm) {
    // Vestuario
    if (/\bmaid\b|sirvienta|delantal|mucama/.test(userNorm)) {
      changeSuit = 'maid';
      if (mood === 'Tranquila') mood = 'Mimada';
    } else if (/\bmarfil\b|seda|dorad|gala/.test(userNorm)) {
      changeSuit = 'marfil';
      if (mood === 'Tranquila') mood = 'Feliz';
    } else if (/\boriginal\b|latex/.test(userNorm)) {
      changeSuit = 'original';
    } else if (/sin traje|quitate el traje|desvistete|en lenceria|quitate la ropa/.test(userNorm)) {
      changeSuit = 'none';
      mood = 'Ruborizada';
      blushDelta = 0.22;
      if (action === 'none') action = 'coverFace';
    }

    // Ángulo de cámara
    if (!/360|exhibe|presume|gira completo|una vuelta/.test(userNorm)) {
      if (/lateral|de lado|perfil|costado/.test(userNorm)) {
        changeView = 'side';
      } else if (/trasera|espalda|atras|date la vuelta|de espaldas/.test(userNorm)) {
        changeView = 'back';
      } else if (/frontal|de frente|mirame/.test(userNorm)) {
        changeView = 'front';
      }
    }

    // Cremallera
    if (/cremallera|cierre|zipper/.test(userNorm)) {
      if (body.avatarState.view !== 'front' && !changeView) {
        changeView = 'front';
      }
      const numMatch = userNorm.match(/(\d{1,3})\s*%?/);
      if (numMatch) {
        changeZipper = Math.max(0, Math.min(100, Number(numMatch[1])));
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

    // Lencería por capas
    if (/sosten|bra\b|braga|panty|medias|calcetas/.test(userNorm)) {
      const turnOff = /quita|sin |desactiva|saca/.test(userNorm);
      const turnOn = /pon|activa|usa/.test(userNorm);
      if (turnOff || turnOn) {
        const targetVal = turnOn && !turnOff;
        changeLingerie = {};
        if (/sosten|bra\b/.test(userNorm)) changeLingerie.bra = targetVal;
        if (/braga|panty/.test(userNorm)) changeLingerie.panties = targetVal;
        if (/medias|calcetas/.test(userNorm)) changeLingerie.stockings = targetVal;
        if (turnOff) {
          mood = 'Ruborizada';
          blushDelta = 0.2;
          if (action === 'none') action = 'coverFace';
        }
      }
    }

    // Detectar 1 o 2 movimientos pedidos explícitamente por el usuario y encadenarlos
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

    // Compilar Rig 2D articular específico si el usuario pidió mover dedos, codos, rodillas, boca, etc.
    rigPose = compileCustomRigPose(userNorm);
  }

  // 3. Si aún no hay acción definida, inferir de la respuesta o estado de ánimo
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
      action = 'blowKiss';
      mood = 'Mimada';
      affectionDelta = 11;
      blushDelta = 0.18;
    } else if (mood === 'Ruborizada') {
      action = 'elbowsIn';
    } else if (mood === 'Mimada') {
      action = 'wink';
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
    affectionDelta,
    blushDelta,
    changeSuit,
    changeView,
    changeZipper,
    changeLingerie,
    rigPose,
  };
}

async function callPawanChatCompletion(
  endpointUrl: string,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  timeoutMs = 15000,
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
        temperature: 0.45,
        top_p: 0.85,
        frequency_penalty: 0.4,
        presence_penalty: 0.15,
        max_tokens: 130,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      const err = new Error(
        `HTTP ${response.status} from ${endpointUrl}: ${errorText.slice(0, 200)}`,
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
      throw new Error('EMPTY_MODEL_RESPONSE');
    }

    return content;
  } finally {
    clearTimeout(timer);
  }
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/marioneta/respond', async (req, res) => {
    const body = req.body as MarionetaRequestBody | undefined;
    if (!body || !body.avatarState) {
      res.status(400).json({ error: 'INVALID_REQUEST' });
      return;
    }

    if (!hasValidPawanKey()) {
      res.status(503).json({ error: 'PAWAN_API_KEY_MISSING' });
      return;
    }

    const systemInstruction = buildSystemInstruction(body.avatarState);
    const historyMessages: Array<{ role: 'user' | 'assistant'; content: string }> = (
      body.history ?? []
    )
      .slice(-6)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    let userPrompt = '';
    if (body.mode === 'reaction' && body.interactionEvent) {
      const eventDescriptions: Record<string, string> = {
        pet_hair: 'está acariciando suavemente tus mechones de cabello cebra',
        pet_face: 'está acariciando con ternura tu rostro y tus mejillas',
        touch_soft: `está tocando tu cuerpo (${body.interactionEvent.detail || 'curvas'}) con la mano interactiva`,
        feed: 'te acaba de dar a comer un delicioso cupcake glaseado',
        happy: 'te acaba de llenar de alegría y corazones',
        change_suit: `acaba de cambiar tu vestuario a "${body.avatarState.suit}"`,
        change_view: `acaba de girar la cámara a la vista "${body.avatarState.view}"`,
        cube_hit: `te lanzó el cubo físico y rebotó contra tu ${body.interactionEvent.detail || 'cuerpo'}`,
        pull_skirt: `está jalando traviesamente tu ${body.interactionEvent.detail || 'falda'}`,
        zipper: `movió la cremallera de tu traje dejándola al ${body.avatarState.zipper}% abierta`,
        breeze: 'sopló una ráfaga de brisa fresca que agitó tu cabello y tu falda',
        wave: 'activó una onda física que hizo rebotar todo tu cuerpo',
      };
      const friendlyEvent =
        eventDescriptions[body.interactionEvent.type] ||
        `interactuó contigo (${body.interactionEvent.type})`;

      userPrompt = `(El usuario ${friendlyEvent}. Reacciona en 1 oración corta y natural en español iniciando con [Ánimo | Movimiento]).`;
    } else {
      userPrompt = `${body.userMessage ?? ''}\n(Responde en 1 o 2 oraciones cortas en español confirmando y describiendo cómo mueves tus dedos, manos, codos, rodillas o cuerpo para cumplir lo pedido, iniciando con [Ánimo | Movimiento] o [Ánimo | Movimiento1 + Movimiento2]).`;
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemInstruction },
      ...historyMessages,
      { role: 'user', content: userPrompt },
    ];

    let lastError: unknown = null;
    const retryUrls = [
      ...PAWAN_ENDPOINTS,
      ...PAWAN_ENDPOINTS,
    ];

    for (let i = 0; i < retryUrls.length; i++) {
      const endpointUrl = retryUrls[i];
      try {
        const rawText = await callPawanChatCompletion(endpointUrl, messages, 12000);
        const parsed = parseMarionetaModelOutput(rawText);
        const controls = resolvePhysicalMovementAndChanges(parsed, body);

        res.json({
          reply: parsed.reply,
          mood: controls.mood,
          affectionDelta: Math.max(-5, Math.min(15, controls.affectionDelta)),
          blushDelta: Math.max(-0.1, Math.min(0.25, controls.blushDelta)),
          action: controls.action,
          secondaryAction: controls.secondaryAction,
          animation: controls.animation,
          changeSuit: controls.changeSuit,
          changeView: controls.changeView,
          changeZipper: controls.changeZipper,
          changeLingerie: controls.changeLingerie,
          rigPose: controls.rigPose,
          source: 'gemini',
        });
        return;
      } catch (error) {
        lastError = error;
        if (i < retryUrls.length - 1 && isTransientNetworkError(error)) {
          await sleep(350);
          continue;
        }
      }
    }

    const status =
      lastError &&
      typeof lastError === 'object' &&
      'status' in lastError &&
      typeof (lastError as { status?: number }).status === 'number'
        ? (lastError as { status: number }).status
        : 503;
    const shortMsg = lastError instanceof Error ? lastError.message : String(lastError);
    console.warn(`[Marioneta Pawan API fallback] status=${status}: ${shortMsg.slice(0, 180)}`);

    // Even when Pawan.krd upstream returns transient 503, resolve full 2D multi-joint rigPose + chained actions!
    const fallbackControls = resolvePhysicalMovementAndChanges({ reply: '' }, body);
    const actionReplies: Partial<Record<ValidAction, string>> = {
      thumbsUp: '¡Por supuesto! Doblo mi codo derecho y levanto mi pulgar bien alto para ti.',
      crouch:
        fallbackControls.secondaryAction === 'jump'
          ? '¡Me agacho flexionando bien mis rodillas y luego doy un gran salto en el aire para ti!'
          : 'Flexionando mis rodillas para agacharme frente a ti… ¿qué tal se ve mi postura desde aquí?',
      elbowsIn: 'Juntando mis dos codos frente al centro del pecho… mira cómo se aprieta mi traje al hacerlo.',
      raiseLeftHand: '¡Aquí tienes! Levanto solamente mi mano izquierda bien alto con los cinco dedos abiertos.',
      raiseRightHand: '¡Levantando solamente mi mano derecha bien arriba mientras dejo la otra relajada!',
      peaceSign: '¡Amor y paz! Mira cómo extiendo mis dedos índice y medio en forma de V para ti.',
      pointFinger: 'Te estoy señalando directamente con mi dedo índice… tú mandas en este escenario.',
      rockSign: '¡Actitud rockera! Extiendo el índice y el meñique de mis manos para ti.',
      handsOnHips: 'Con ambos codos doblados hacia afuera y mis manos firmes en la cintura… lista para ti.',
      crossArms: 'Cruzando mis brazos frente al pecho… ¿intentas hacerme la difícil?',
      coverFace: '¡Ay, qué vergüenza! Me tapo la cara con ambas manos pero te miro entre mis dedos.',
      liftLeg: 'Levantando una pierna en equilibrio mientras mantengo la postura para ti.',
      blowKiss: 'Acerco mi mano derecha a mis labios cereza y ¡mua!, te lanzo un beso lleno de corazones.',
      jump: '¡Arriba! Tomo impulso con mis piernas y salto con todas mis fuerzas para ti.',
      waveHand: '¡Hola, cariño! Levanto mi brazo y muevo la muñeca y los dedos para saludarte.',
      dance: '¡Música! Mira cómo muevo mis codos, mis manos y mis caderas al ritmo del baile.',
      hipSway: 'Con mis manos en la cintura, balanceo mis caderas suavemente de lado a lado.',
      curtsy: 'Tomo el borde de mi traje con los dedos y flexiono las rodillas en una reverencia.',
      spin: '¡Voy a dar un giro completo de 360 grados para que me veas desde todos los ángulos!',
      wink: 'Te regalo un guiño cómplice cerrando un ojo y sonriendo para ti.',
      pout: 'Cruzo mis brazos con los puños cerrados y hago un puchero… ¡no te burles de mí!',
    };
    const synthesizedReply =
      actionReplies[fallbackControls.action] ||
      'Muevo cada articulación de mis manos, dedos, codos y cuerpo tal como me lo pediste.';

    res.json({
      reply: synthesizedReply,
      mood: fallbackControls.mood,
      affectionDelta: Math.max(-5, Math.min(15, fallbackControls.affectionDelta)),
      blushDelta: Math.max(-0.1, Math.min(0.25, fallbackControls.blushDelta)),
      action: fallbackControls.action,
      secondaryAction: fallbackControls.secondaryAction,
      animation: fallbackControls.animation,
      changeSuit: fallbackControls.changeSuit,
      changeView: fallbackControls.changeView,
      changeZipper: fallbackControls.changeZipper,
      changeLingerie: fallbackControls.changeLingerie,
      rigPose: fallbackControls.rigPose,
      source: 'gemini',
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
    console.log(`Marioneta Pixel server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
