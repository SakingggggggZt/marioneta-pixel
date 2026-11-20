import type {
  AvatarAction,
  AvatarAnimation,
  AvatarMood,
  AvatarRigPose,
  AvatarSnapshot,
  AvatarSuit,
  AvatarView,
  InteractionEvent,
} from '../engine/pixelAvatarEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  mood?: AvatarMood;
  source?: 'gemini' | 'fallback';
  effectSummary?: string;
}

export interface MarionetaAIResponse {
  reply: string;
  mood: AvatarMood;
  affectionDelta: number;
  blushDelta: number;
  action?: AvatarAction | 'none';
  secondaryAction?: AvatarAction | 'none';
  animation?: AvatarAnimation;
  changeSuit?: AvatarSuit;
  changeView?: AvatarView;
  changeZipper?: number;
  changeLingerie?: {
    bra?: boolean;
    panties?: boolean;
    stockings?: boolean;
  };
  rigPose?: AvatarRigPose;
  source: 'gemini' | 'fallback';
}

export const REACTIVE_COOLDOWN_MS = 5500;

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildAvatarContext(snap: AvatarSnapshot) {
  return {
    view: snap.view,
    suit: snap.suit,
    zipper: snap.zipper,
    mood: snap.mood,
    affection: snap.affection,
    blush: snap.blush,
    bra: snap.bra,
    panties: snap.panties,
    stockings: snap.stockings,
    currentAnimation: snap.currentAnimation,
    lastInteraction: snap.lastInteractionEvent
      ? `${snap.lastInteractionEvent.type}${snap.lastInteractionEvent.detail ? ` (${snap.lastInteractionEvent.detail})` : ''}`
      : undefined,
  };
}

export function buildLocalChatFallback(
  userMessage: string,
  snap: AvatarSnapshot,
): MarionetaAIResponse {
  const msg = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (/\bmaid\b|sirvienta|delantal|mucama/.test(msg)) {
    return {
      reply: '¿El vestido maid de terciopelo? Qué capricho tan adorable… dime si el encaje te convence.',
      mood: 'Mimada',
      affectionDelta: 8,
      blushDelta: 0.14,
      action: 'breeze',
      changeSuit: 'maid',
      source: 'fallback',
    };
  }
  if (/\bmarfil\b|seda|dorad|blanco|elegante/.test(msg)) {
    return {
      reply: 'Seda marfil y destellos dorados… admito que me encanta lucir tan refinada para ti.',
      mood: 'Feliz',
      affectionDelta: 7,
      blushDelta: 0.1,
      action: 'breeze',
      changeSuit: 'marfil',
      source: 'fallback',
    };
  }
  if (/\boriginal\b|latex|negro|clasic/.test(msg)) {
    return {
      reply: 'De vuelta a mi látex clásico… nada brilla tan bien bajo esta luz oscura.',
      mood: 'Tranquila',
      affectionDelta: 6,
      blushDelta: 0.08,
      action: 'wave',
      changeSuit: 'original',
      source: 'fallback',
    };
  }
  if (/sin traje|quitate|lenceria|desvist/.test(msg)) {
    return {
      reply: 'Oh, qué atrevido… al menos dime que sabes apreciar el buen gusto gótico.',
      mood: 'Ruborizada',
      affectionDelta: 4,
      blushDelta: 0.22,
      action: 'none',
      changeSuit: 'none',
      source: 'fallback',
    };
  }
  if (/lateral|de lado|perfil|costado/.test(msg)) {
    return {
      reply: '¿Prefieres admirar mi perfil? Aquí tienes mi mejor ángulo lateral.',
      mood: 'Mimada',
      affectionDelta: 5,
      blushDelta: 0.09,
      action: 'none',
      changeView: 'side',
      source: 'fallback',
    };
  }
  if (/trasera|espalda|atras|vuelta|girate|da la vuelta/.test(msg)) {
    return {
      reply: 'Está bien, me daré la vuelta un momento… pero no me pierdas de vista.',
      mood: 'Ruborizada',
      affectionDelta: 5,
      blushDelta: 0.14,
      action: 'bounceGlutes',
      changeView: 'back',
      source: 'fallback',
    };
  }
  if (/frontal|frente|mirame|de frente/.test(msg)) {
    return {
      reply: 'Mucho mejor así, frente a frente… me gusta ver tu atención puesta en mí.',
      mood: 'Feliz',
      affectionDelta: 6,
      blushDelta: 0.08,
      action: 'none',
      changeView: 'front',
      source: 'fallback',
    };
  }
  if (/cupcake|pastel|comer|comida|dulce|hambre|postre|galleta/.test(msg)) {
    return {
      reply: '¡Un cupcake solo para mí! Mmm… sabía que tendrías detalles tan dulces conmigo.',
      mood: 'Feliz',
      affectionDelta: 12,
      blushDelta: 0.14,
      action: 'feed',
      changeView: 'front',
      source: 'fallback',
    };
  }
  if (/brisa|viento|sopla|aire/.test(msg)) {
    return {
      reply: '¡Ah! Esa brisa fría movió todo mi cabello… se siente deliciosamente dramático.',
      mood: 'Sorprendida',
      affectionDelta: 5,
      blushDelta: 0.1,
      action: 'breeze',
      source: 'fallback',
    };
  }
  if (/pulgar|thumbs|like|bien hecho/.test(msg)) {
    return {
      reply: '¡Un pulgar arriba bien alto para ti! Mis dedos articulados siempre están de tu lado.',
      mood: 'Feliz',
      affectionDelta: 9,
      blushDelta: 0.1,
      action: 'thumbsUp',
      animation: 'thumbs_up',
      source: 'fallback',
    };
  }
  if (/agacha|cuclillas|baja el cuerpo|arrodilla/.test(msg)) {
    return {
      reply: 'Flexionando mis rodillas para agacharme frente a ti… ¿qué tal se ve mi postura desde aquí?',
      mood: 'Mimada',
      affectionDelta: 8,
      blushDelta: 0.12,
      action: 'crouch',
      animation: 'crouch',
      source: 'fallback',
    };
  }
  if (/codo|codos/.test(msg)) {
    return {
      reply: 'Juntando mis codos frente al pecho… uff, siento cómo se aprieta mi traje al hacerlo.',
      mood: 'Ruborizada',
      affectionDelta: 8,
      blushDelta: 0.18,
      action: 'elbowsIn',
      animation: 'elbows_in',
      source: 'fallback',
    };
  }
  if (/una mano|mano izquierda|mano derecha|levanta la mano/.test(msg)) {
    const isLeft = /izquierda/.test(msg);
    return {
      reply: isLeft
        ? '¡Aquí tienes, levantando solamente mi mano izquierda bien alto con los cinco dedos abiertos!'
        : '¡Levantando solamente mi mano derecha bien arriba mientras dejo la otra relajada!',
      mood: 'Feliz',
      affectionDelta: 8,
      blushDelta: 0.08,
      action: isLeft ? 'raiseLeftHand' : 'raiseRightHand',
      animation: isLeft ? 'raise_left_hand' : 'raise_right_hand',
      source: 'fallback',
    };
  }
  if (/paz|victoria|\bv\b/.test(msg)) {
    return {
      reply: '¡Amor y paz! Mira cómo extiendo mis dedos índice y medio en forma de V para ti.',
      mood: 'Feliz',
      affectionDelta: 9,
      blushDelta: 0.1,
      action: 'peaceSign',
      animation: 'peace_sign',
      source: 'fallback',
    };
  }
  if (/senala|apunta|dedo indice/.test(msg)) {
    return {
      reply: 'Te estoy señalando directamente a ti con mi dedo índice… tú mandas en este escenario.',
      mood: 'Mimada',
      affectionDelta: 7,
      blushDelta: 0.1,
      action: 'pointFinger',
      animation: 'point_finger',
      source: 'fallback',
    };
  }
  if (/cintura|manos en la cadera/.test(msg)) {
    return {
      reply: 'Con ambos codos doblados y las manos en la cintura… lista para lo que me pidas.',
      mood: 'Tranquila',
      affectionDelta: 7,
      blushDelta: 0.08,
      action: 'handsOnHips',
      animation: 'hands_on_hips',
      source: 'fallback',
    };
  }
  if (/cruza los brazos|brazos cruzados/.test(msg)) {
    return {
      reply: 'Cruzando mis brazos frente al pecho… ¿intentas hacerme la difícil?',
      mood: 'Tranquila',
      affectionDelta: 5,
      blushDelta: 0.1,
      action: 'crossArms',
      animation: 'cross_arms',
      source: 'fallback',
    };
  }
  if (/tapa la cara|cubre tu rostro|manos en la cara/.test(msg)) {
    return {
      reply: '¡Ay, qué vergüenza! Me tapo la cara con ambas manos pero te sigo mirando entre mis dedos…',
      mood: 'Ruborizada',
      affectionDelta: 8,
      blushDelta: 0.2,
      action: 'coverFace',
      animation: 'cover_face',
      source: 'fallback',
    };
  }
  if (/levanta una pierna|levanta la pierna|un pie/.test(msg)) {
    return {
      reply: 'Levantando una pierna con equilibrio perfecto… mira cómo trabajan mis articulaciones.',
      mood: 'Feliz',
      affectionDelta: 8,
      blushDelta: 0.1,
      action: 'liftLeg',
      animation: 'lift_leg',
      source: 'fallback',
    };
  }
  if (/beso|besito|mua/.test(msg)) {
    return {
      reply: '¡Mua! Un beso directo desde mis labios cereza solo para ti…',
      mood: 'Mimada',
      affectionDelta: 11,
      blushDelta: 0.16,
      action: 'blowKiss',
      animation: 'blow_kiss',
      source: 'fallback',
    };
  }
  if (/reverencia|cortesia/.test(msg)) {
    return {
      reply: 'A tus órdenes… una reverencia digna de tu muñeca gótica favorita.',
      mood: 'Mimada',
      affectionDelta: 8,
      blushDelta: 0.1,
      action: 'curtsy',
      animation: 'curtsy',
      source: 'fallback',
    };
  }
  if (/desfila|pasarela|camina/.test(msg)) {
    return {
      reply: 'Mira este paso de pasarela… el escenario entero es mío cuando me miras.',
      mood: 'Feliz',
      affectionDelta: 8,
      blushDelta: 0.1,
      action: 'strut',
      animation: 'strut',
      source: 'fallback',
    };
  }
  if (/menea|cadera|caderas/.test(msg)) {
    return {
      reply: '¿Te gusta cómo se balancean mis caderas de lado a lado? No apartes la mirada…',
      mood: 'Mimada',
      affectionDelta: 9,
      blushDelta: 0.14,
      action: 'hipSway',
      animation: 'hip_sway',
      source: 'fallback',
    };
  }
  if (/guino|guiname/.test(msg)) {
    return {
      reply: 'Un pequeño guiño cómplice entre tú y yo… 😉',
      mood: 'Mimada',
      affectionDelta: 8,
      blushDelta: 0.12,
      action: 'wink',
      animation: 'wink',
      source: 'fallback',
    };
  }
  if (/presume|exhibe|muestrate|todo tu cuerpo/.test(msg)) {
    return {
      reply: 'Observa cada ángulo de mi diseño… de frente, de perfil y de espaldas solo para ti.',
      mood: 'Mimada',
      affectionDelta: 10,
      blushDelta: 0.15,
      action: 'showOff',
      animation: 'outfit_pose',
      source: 'fallback',
    };
  }
  if (/puchero|berrinche|enojate|enfadate/.test(msg)) {
    return {
      reply: '¡Hmph! No me hagas hacer pucheros… sabes que no puedo enojarme contigo de verdad.',
      mood: 'Ruborizada',
      affectionDelta: 3,
      blushDelta: 0.16,
      action: 'pout',
      animation: 'pout',
      source: 'fallback',
    };
  }
  if (/celebra|victoria|anima|bravo/.test(msg)) {
    return {
      reply: '¡Sí! ¡Celebremos juntos con toda la energía de mis hilos!',
      mood: 'Feliz',
      affectionDelta: 10,
      blushDelta: 0.12,
      action: 'cheer',
      animation: 'cheer',
      source: 'fallback',
    };
  }
  if (/baila|danza|ritmo|coreografia/.test(msg)) {
    return {
      reply: '¿Quieres verme bailar? Mira cómo mis caderas y mi cabello siguen el compás solo para ti.',
      mood: 'Feliz',
      affectionDelta: 9,
      blushDelta: 0.14,
      action: 'dance',
      animation: 'dance',
      source: 'fallback',
    };
  }
  if (/gira completo|una vuelta|360|da una vuelta/.test(msg)) {
    return {
      reply: '¡Una vuelta completa para que no te pierdas ni un solo ángulo de mi silueta!',
      mood: 'Mimada',
      affectionDelta: 8,
      blushDelta: 0.12,
      action: 'spin',
      animation: 'outfit_pose',
      source: 'fallback',
    };
  }
  if (/salta|brinca/.test(msg)) {
    return {
      reply: '¡Arriba! ¿Viste cómo rebotó todo mi cuerpo al aterrizar?',
      mood: 'Feliz',
      affectionDelta: 8,
      blushDelta: 0.12,
      action: 'jump',
      animation: 'happy',
      source: 'fallback',
    };
  }
  if (/estira|estirate|bosteza/.test(msg)) {
    return {
      reply: 'Mmm… qué rico estirarme así, siento cada hilo de mi cuerpo relajarse.',
      mood: 'Tranquila',
      affectionDelta: 6,
      blushDelta: 0.08,
      action: 'stretch',
      animation: 'stretch',
      source: 'fallback',
    };
  }
  if (/cremallera|cierre|zipper/.test(msg)) {
    const openMore = /baja|abre|abierta|100|mitad/.test(msg);
    const targetZip = openMore ? (/100|todo|completa/.test(msg) ? 95 : 60) : 0;
    return {
      reply: openMore
        ? 'O-oye… bajaré la cremallera un poco más para ti, pero no me mires con tanta intensidad.'
        : 'Subiendo la cremallera de nuevo… ahora todo está en su lugar.',
      mood: openMore ? 'Ruborizada' : 'Tranquila',
      affectionDelta: 6,
      blushDelta: openMore ? 0.2 : 0.05,
      action: openMore ? 'tease' : 'nod',
      animation: openMore ? 'shy' : 'nod',
      changeZipper: targetZip,
      source: 'fallback',
    };
  }
  if (/onda|muevete|sacud|rebote/.test(msg)) {
    return {
      reply: '¿Quieres verme en movimiento? Mira cómo responde cada detalle a mi ritmo.',
      mood: 'Feliz',
      affectionDelta: 7,
      blushDelta: 0.12,
      action: 'wave',
      animation: 'tease',
      source: 'fallback',
    };
  }
  if (/hola|buenas|hey|saludo|como estas|como te sientes/.test(msg)) {
    const suitNote =
      snap.suit === 'maid'
        ? 'con mi conjunto maid'
        : snap.suit === 'marfil'
          ? 'vestida de seda marfil'
          : snap.suit === 'none'
            ? 'un poco sonrojada ahora mismo'
            : 'luciendo mi látex oscuro';
    return {
      reply: `Hola, cariño… aquí estoy, ${suitNote} y con ${snap.affection}% de ánimo. ¿A qué jugamos hoy?`,
      mood: 'Feliz',
      affectionDelta: 6,
      blushDelta: 0.08,
      action: 'happy',
      source: 'fallback',
    };
  }
  if (/guapa|linda|bonita|hermosa|preciosa|te amo|te quiero|me gustas/.test(msg)) {
    return {
      reply: 'Vaya… sabes exactamente qué decir para hacerme ruborizar bajo este maquillaje.',
      mood: 'Ruborizada',
      affectionDelta: 11,
      blushDelta: 0.2,
      action: 'none',
      animation: 'shy',
      source: 'fallback',
    };
  }
  if (/pose|posa|presume|coqueta|modela/.test(msg)) {
    return {
      reply: '¿Una pose especial solo para ti? Observa bien este ángulo…',
      mood: 'Mimada',
      affectionDelta: 7,
      blushDelta: 0.1,
      action: 'none',
      animation: 'outfit_pose',
      source: 'fallback',
    };
  }

  return pickRandom<MarionetaAIResponse>([
    {
      reply: 'Qué curioso eres… dime si quieres cambiar mi vestuario, girar la cámara o traerme algo dulce.',
      mood: 'Tranquila',
      affectionDelta: 4,
      blushDelta: 0.05,
      action: 'none',
      source: 'fallback',
    },
    {
      reply: 'Me entretiene escucharte. Mis hilos obedecen con gusto cuando me hablas así.',
      mood: 'Mimada',
      affectionDelta: 6,
      blushDelta: 0.09,
      action: 'none',
      source: 'fallback',
    },
    {
      reply: 'Mmm… tienes toda mi atención. ¿Probamos una brisa suave o prefieres ver el traje de seda?',
      mood: 'Feliz',
      affectionDelta: 5,
      blushDelta: 0.07,
      action: 'none',
      source: 'fallback',
    },
  ]);
}

export function buildLocalReactionFallback(
  event: InteractionEvent,
  snap: AvatarSnapshot,
): MarionetaAIResponse {
  switch (event.type) {
    case 'pet_hair':
      return {
        reply: pickRandom([
          'Mmm… cuidado con mis mechones cebra, aunque admito que se siente muy bien.',
          'Sigue acariciando mi cabello así y terminarás malcriándome.',
        ]),
        mood: 'Mimada',
        affectionDelta: 3,
        blushDelta: 0.06,
        action: 'none',
        source: 'fallback',
      };
    case 'pet_face':
      return {
        reply: pickRandom([
          'Oye… me vas a arruinar el rubor de las mejillas, aunque no me quejo.',
          'Qué tacto tan suave… me haces sonreír sin darme cuenta.',
        ]),
        mood: 'Ruborizada',
        affectionDelta: 4,
        blushDelta: 0.1,
        action: 'none',
        source: 'fallback',
      };
    case 'touch_soft':
      return {
        reply: pickRandom([
          '¡E-eh! Qué manos tan traviesas tienes hoy…',
          'Mmph… te encanta probar las físicas conmigo, ¿verdad?',
        ]),
        mood: 'Ruborizada',
        affectionDelta: 2,
        blushDelta: 0.12,
        action: 'none',
        source: 'fallback',
      };
    case 'feed':
      return {
        reply: '¡Ooh, un cupcake glaseado! Justo lo que necesitaba para subir el ánimo.',
        mood: 'Feliz',
        affectionDelta: 5,
        blushDelta: 0.08,
        action: 'none',
        source: 'fallback',
      };
    case 'happy':
      return {
        reply: '¡Qué energía tan bonita! Hoy me siento radiante en mi escenario.',
        mood: 'Feliz',
        affectionDelta: 4,
        blushDelta: 0.06,
        action: 'none',
        source: 'fallback',
      };
    case 'change_suit': {
      const suitLines: Record<AvatarSuit, string> = {
        original: 'El látex oscuro nunca falla… elegante, brillante e inconfundible.',
        maid: 'Encaje blanco y terciopelo… ¿te sirvo un té gótico, amo?',
        marfil: 'Seda marfil y oro… me siento salida de una gala de medianoche.',
        none: 'Vaya cambio tan atrevido… al menos no dejes entrar corrientes frías.',
      };
      return {
        reply: suitLines[snap.suit],
        mood: snap.suit === 'none' ? 'Ruborizada' : 'Mimada',
        affectionDelta: 3,
        blushDelta: snap.suit === 'none' ? 0.16 : 0.06,
        action: 'none',
        source: 'fallback',
      };
    }
    case 'change_view': {
      const viewLines: Record<AvatarView, string> = {
        front: 'De frente otra vez… me gusta ver tu mirada de cerca.',
        side: 'Perfil lateral listo. ¿Aprecias la silueta?',
        back: 'Vista trasera… dime que los detalles de mi traje se ven impecables.',
      };
      return {
        reply: viewLines[snap.view],
        mood: 'Tranquila',
        affectionDelta: 2,
        blushDelta: 0.04,
        action: 'none',
        source: 'fallback',
      };
    }
    case 'cube_hit':
      return {
        reply: pickRandom([
          '¡Ay! ¿De dónde salió ese cubo? ¡Casi me despeinas!',
          '¡Oye! Ese cubo rebota demasiado fuerte… ¡qué susto me diste!',
        ]),
        mood: 'Sorprendida',
        affectionDelta: -1,
        blushDelta: 0.1,
        action: 'none',
        source: 'fallback',
      };
    case 'pull_skirt':
      return {
        reply: '¡Eh, suelta la tela! Qué poco disimulo tienes…',
        mood: 'Ruborizada',
        affectionDelta: 1,
        blushDelta: 0.14,
        action: 'none',
        source: 'fallback',
      };
    case 'zipper':
      return {
        reply:
          snap.zipper > 45
            ? 'O-oye, bajaste bastante la cremallera… me haces sonrojar.'
            : 'Ajustando la cremallera, ¿eh? Qué meticuloso eres.',
        mood: snap.zipper > 45 ? 'Ruborizada' : 'Tranquila',
        affectionDelta: 2,
        blushDelta: snap.zipper > 45 ? 0.14 : 0.03,
        action: 'none',
        source: 'fallback',
      };
    case 'breeze':
      return {
        reply: '¡Qué brisa tan fresca! Me encanta cómo ondea todo a mi alrededor.',
        mood: 'Sorprendida',
        affectionDelta: 3,
        blushDelta: 0.06,
        action: 'none',
        source: 'fallback',
      };
    default:
      return {
        reply: 'Mmm… sigue jugando conmigo, me encanta sentir el escenario vivo.',
        mood: 'Feliz',
        affectionDelta: 2,
        blushDelta: 0.05,
        action: 'none',
        source: 'fallback',
      };
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = 26000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

export async function sendMarionetaChat(
  userMessage: string,
  snap: AvatarSnapshot,
  history: ChatMessage[],
): Promise<MarionetaAIResponse> {
  try {
    const res = await fetchWithTimeout('/api/marioneta/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'chat',
        userMessage,
        avatarState: buildAvatarContext(snap),
        history: history.slice(-6).map((m) => ({ role: m.role, text: m.text })),
      }),
    });

    if (!res.ok) {
      return buildLocalChatFallback(userMessage, snap);
    }

    const data = (await res.json()) as MarionetaAIResponse;
    if (!data || typeof data.reply !== 'string') {
      return buildLocalChatFallback(userMessage, snap);
    }
    return { ...data, source: 'gemini' };
  } catch {
    return buildLocalChatFallback(userMessage, snap);
  }
}

export async function requestMarionetaReaction(
  event: InteractionEvent,
  snap: AvatarSnapshot,
  history: ChatMessage[],
): Promise<MarionetaAIResponse> {
  try {
    const res = await fetchWithTimeout('/api/marioneta/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'reaction',
        interactionEvent: { type: event.type, detail: event.detail },
        avatarState: buildAvatarContext(snap),
        history: history.slice(-4).map((m) => ({ role: m.role, text: m.text })),
      }),
    });

    if (!res.ok) {
      return buildLocalReactionFallback(event, snap);
    }

    const data = (await res.json()) as MarionetaAIResponse;
    if (!data || typeof data.reply !== 'string') {
      return buildLocalReactionFallback(event, snap);
    }
    return { ...data, source: 'gemini' };
  } catch {
    return buildLocalReactionFallback(event, snap);
  }
}
