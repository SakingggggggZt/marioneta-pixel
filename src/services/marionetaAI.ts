import type {
  AvatarAction,
  AvatarAnimation,
  AvatarMood,
  AvatarRigPose,
  AvatarSnapshot,
  AvatarSuit,
  AvatarView,
  ChoreographyBeat,
  InteractionEvent,
  LingerieState,
} from '../engine/pixelAvatarEngine';
import {
  getRelationshipRank,
  PERSONALITY_PRESETS,
  type PersonaConfig,
  type RelationshipStats,
  type UserProfile,
} from '../types/persona';

export type AIProviderId = 'pawan' | 'gemini-flash-lite';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  mood?: AvatarMood;
  provider?: AIProviderId;
  effectSummary?: string;
  isError?: boolean;
}

export interface MarionetaAIResponse {
  reply: string;
  mood: AvatarMood;
  affectionDelta: number;
  blushDelta: number;
  trustDelta?: number;
  action?: AvatarAction | 'none';
  secondaryAction?: AvatarAction | 'none';
  animation?: AvatarAnimation;
  changeSuit?: AvatarSuit;
  animateUndress?: boolean;
  animateDressSuit?: AvatarSuit;
  changeView?: AvatarView;
  changeZipper?: number;
  changeLingerie?: Partial<LingerieState>;
  rigPose?: AvatarRigPose;
  choreography?: ChoreographyBeat[];
  spawnEffect?: 'hearts' | 'stars' | 'notes' | 'petals' | 'none';
  provider: AIProviderId;
}

export interface MarionetaAIContextOptions {
  personaConfig: PersonaConfig;
  userProfile: UserProfile;
  relationshipStats: RelationshipStats;
}

export const REACTIVE_COOLDOWN_MS = 5500;

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
    garters: snap.garters,
    gloves: snap.gloves,
    choker: snap.choker,
    strapSlip: snap.strapSlip,
    currentAnimation: snap.currentAnimation,
    musicBoxEnabled: snap.musicBoxEnabled,
    stageTheme: snap.stageTheme,
    lastInteraction: snap.lastInteractionEvent
      ? `${snap.lastInteractionEvent.type}${snap.lastInteractionEvent.detail ? ` (${snap.lastInteractionEvent.detail})` : ''}`
      : undefined,
  };
}

function buildPersonaPayload(ctx: MarionetaAIContextOptions, snap: AvatarSnapshot) {
  const preset = PERSONALITY_PRESETS[ctx.personaConfig.archetype];
  const rank = getRelationshipRank(snap.affection, ctx.relationshipStats.trust);
  return {
    personaConfig: {
      archetype: ctx.personaConfig.archetype,
      archetypeLabel: preset.label,
      archetypeTone: preset.systemTone,
      flirtiness: ctx.personaConfig.flirtiness,
      expressiveness: ctx.personaConfig.expressiveness,
      sensitivity: ctx.personaConfig.sensitivity,
      customTraitNote: ctx.personaConfig.customTraitNote,
    },
    userProfile: ctx.userProfile,
    relationshipStats: {
      ...ctx.relationshipStats,
      rankTitle: rank.title,
    },
  };
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
  context: MarionetaAIContextOptions,
): Promise<MarionetaAIResponse> {
  const res = await fetchWithTimeout('/api/marioneta/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'chat',
      userMessage,
      avatarState: buildAvatarContext(snap),
      ...buildPersonaPayload(context, snap),
      history: history
        .filter((m) => !m.isError)
        .slice(-8)
        .map((m) => ({ role: m.role, text: m.text })),
    }),
  });

  if (!res.ok) {
    const errBody = (await res.json().catch(() => null)) as
      | { message?: string; error?: string }
      | null;
    throw new Error(
      errBody?.message ||
        'No se pudo conectar con Pawan ni con el respaldo Google Gemini Flash Lite.',
    );
  }

  const data = (await res.json()) as MarionetaAIResponse;
  if (!data || typeof data.reply !== 'string') {
    throw new Error('Respuesta inválida del servidor de IA.');
  }
  return {
    ...data,
    provider: data.provider || 'gemini-flash-lite',
  };
}

export async function requestMarionetaReaction(
  event: InteractionEvent,
  snap: AvatarSnapshot,
  history: ChatMessage[],
  context: MarionetaAIContextOptions,
): Promise<MarionetaAIResponse | null> {
  try {
    const res = await fetchWithTimeout('/api/marioneta/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'reaction',
        interactionEvent: { type: event.type, detail: event.detail },
        avatarState: buildAvatarContext(snap),
        ...buildPersonaPayload(context, snap),
        history: history
          .filter((m) => !m.isError)
          .slice(-4)
          .map((m) => ({ role: m.role, text: m.text })),
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as MarionetaAIResponse;
    if (!data || typeof data.reply !== 'string') return null;
    return {
      ...data,
      provider: data.provider || 'gemini-flash-lite',
    };
  } catch {
    return null;
  }
}
