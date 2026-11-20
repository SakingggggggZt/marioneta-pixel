export type AvatarView = 'front' | 'side' | 'back';
export type AvatarSuit = 'original' | 'maid' | 'marfil' | 'none';
export type AvatarMood = 'Tranquila' | 'Feliz' | 'Sorprendida' | 'Ruborizada' | 'Mimada';
export type HandGesture =
  | 'open'
  | 'thumbs_up'
  | 'peace'
  | 'point'
  | 'fist'
  | 'kiss_hand'
  | 'wave_spread'
  | 'rock';

export type MouthShape = 'neutral' | 'smile' | 'open' | 'kiss' | 'pout' | 'talk';

export interface AvatarRigPose {
  // Torso & Pelvis
  torsoTilt?: number;
  torsoLeanY?: number;
  hipSway?: number;
  // Legs, Knees & Jump
  crouch?: number;
  jump?: number;
  legLiftL?: number;
  legLiftR?: number;
  // Left Arm (Shoulder, Elbow, Wrist, 5 Fingers)
  shoulderL?: number;
  elbowL?: number;
  wristL?: number;
  handL?: HandGesture;
  fingerCurlL?: number;
  // Right Arm (Shoulder, Elbow, Wrist, 5 Fingers)
  shoulderR?: number;
  elbowR?: number;
  wristR?: number;
  handR?: HandGesture;
  fingerCurlR?: number;
  // Head, Eyes, Brows & Mouth
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

export type AvatarAnimation =
  | 'idle'
  | 'happy'
  | 'petted'
  | 'shy'
  | 'surprised'
  | 'eat'
  | 'breeze'
  | 'outfit_pose'
  | 'dance'
  | 'nod'
  | 'shake_head'
  | 'giggle'
  | 'tease'
  | 'stretch'
  | 'talk'
  | 'wave_hand'
  | 'blow_kiss'
  | 'curtsy'
  | 'hip_sway'
  | 'strut'
  | 'cheer'
  | 'pout'
  | 'peekaboo'
  | 'shiver'
  | 'bow'
  | 'wink'
  | 'thumbs_up'
  | 'crouch'
  | 'elbows_in'
  | 'raise_left_hand'
  | 'raise_right_hand'
  | 'peace_sign'
  | 'point_finger'
  | 'rock_sign'
  | 'hands_on_hips'
  | 'cross_arms'
  | 'cover_face'
  | 'lift_leg';

export type AvatarAction =
  | 'bounceBust'
  | 'bounceGlutes'
  | 'wave'
  | 'cubeHit'
  | 'happy'
  | 'feed'
  | 'breeze'
  | 'dance'
  | 'spin'
  | 'giggle'
  | 'tease'
  | 'nod'
  | 'shakeHead'
  | 'stretch'
  | 'jump'
  | 'waveHand'
  | 'blowKiss'
  | 'curtsy'
  | 'hipSway'
  | 'strut'
  | 'cheer'
  | 'pout'
  | 'peekaboo'
  | 'shiver'
  | 'bow'
  | 'wink'
  | 'showOff'
  | 'thumbsUp'
  | 'crouch'
  | 'elbowsIn'
  | 'raiseLeftHand'
  | 'raiseRightHand'
  | 'peaceSign'
  | 'pointFinger'
  | 'rockSign'
  | 'handsOnHips'
  | 'crossArms'
  | 'coverFace'
  | 'liftLeg';

export type InteractionEventType =
  | 'pet_hair'
  | 'pet_face'
  | 'touch_soft'
  | 'feed'
  | 'happy'
  | 'change_suit'
  | 'change_view'
  | 'cube_hit'
  | 'pull_skirt'
  | 'zipper'
  | 'breeze'
  | 'wave';

export interface InteractionEvent {
  type: InteractionEventType;
  detail?: string;
  timestamp: number;
}

export interface LingerieState {
  bra: boolean;
  panties: boolean;
  stockings: boolean;
}

export interface ToolsState {
  handEnabled: boolean;
  cubeEnabled: boolean;
  pullFabric: boolean;
  animationsEnabled: boolean;
}

export interface AIReactionPayload {
  mood?: AvatarMood;
  affectionDelta?: number;
  blushDelta?: number;
  action?: AvatarAction | 'none';
  secondaryAction?: AvatarAction | 'none';
  animation?: AvatarAnimation;
  changeSuit?: AvatarSuit;
  changeView?: AvatarView;
  changeZipper?: number;
  changeLingerie?: Partial<LingerieState>;
  rigPose?: AvatarRigPose;
}

export interface AvatarSnapshot {
  fps: number;
  view: AvatarView;
  suit: AvatarSuit;
  suitTag: string;
  zipper: number;
  bra: boolean;
  panties: boolean;
  stockings: boolean;
  handEnabled: boolean;
  cubeEnabled: boolean;
  pullFabric: boolean;
  animationsEnabled: boolean;
  currentAnimation: AvatarAnimation;
  mood: AvatarMood;
  affection: number;
  blush: number;
  zoneLabel: string;
  hintDismissed: boolean;
  lastInteractionEvent: InteractionEvent | null;
  activeRigPose?: AvatarRigPose | null;
}

export interface PixelAvatarCallbacks {
  onSnapshot?: (snapshot: AvatarSnapshot) => void;
  onInteraction?: (event: InteractionEvent, snapshot: AvatarSnapshot) => void;
}

export interface PixelAvatarEngine {
  setView: (view: AvatarView, fromAI?: boolean) => void;
  setSuit: (suit: AvatarSuit, fromAI?: boolean) => void;
  setZipper: (percent: number) => void;
  setLingerie: (partial: Partial<LingerieState>) => void;
  setTools: (partial: Partial<ToolsState>) => void;
  triggerAction: (action: AvatarAction, fromAI?: boolean) => void;
  triggerAnimation: (anim: AvatarAnimation, durationSec?: number) => void;
  setCustomRigPose: (rigPose: AvatarRigPose | null) => void;
  applyAIReaction: (reaction: AIReactionPayload) => void;
  getSnapshot: () => AvatarSnapshot;
  destroy: () => void;
}

export const W = 280;
export const H = 360;
const PIXEL_COUNT = W * H;
const CX = 140;
const SX = 140;

export const SKEL = {
  hairCrownTopY: 4, headTopY: 39, headCenterY: 61.5, headRx: 23.5, headRy: 21.5,
  eyeY: 59.0, eyeOffX: 10.2, cheekY: 69.5, mouthY: 72.2, chinY: 83.5,
  neckTopY: 81.5, neckMidY: 86.5, neckBotY: 92.5, neckHalfW: 10.8,
  shoulderY: 92.0, shoulderX: 35.5, bicepBandY: 107.0,
  elbowY: 142.0, elbowX: 63.5, wristBandY: 167.0, wristY: 176.0, wristX: 81.5, palmY: 188.0, palmX: 88.5,
  bustTopY: 96.0, bustCenterY: 136.5, bustBotY: 172.5, bustCenterX: 27.5, bustRx: 32.8, bustRy: 36.2,
  waistY: 175.5, waistHalfW: 22.5, waistBandTopY: 171.5, waistBandBotY: 192.5,
  hipTopY: 183.0, hipPeakY: 207.5, hipHalfW: 58.2,
  gluteCenterY: 206.5, gluteCenterX: 28.8, gluteRx: 33.4, gluteRy: 32.8,
  crotchY: 213.5, thighBandY: 220.5, thighBandH: 16.0,
  kneeY: 278.0, kneeCenterX: 18.5, kneeOuterX: 29.5, kneeInnerX: 5.5,
  calfPeakY: 305.0, calfOuterX: 33.0, calfInnerX: 4.5,
  ankleBandY: 341.0, ankleOuterX: 17.0, ankleInnerX: 8.5, footTipY: 359.0, footCenterX: 12.8,
  sideBustX: SX - 44.0, sideBustY: 134.5, sideBustRx: 35.5, sideBustRy: 36.5,
  sideGluteX: SX + 25.0, sideGluteY: 197.5, sideGluteRx: 32.8, sideGluteRy: 31.8,
} as const;

const IS_LE = (() => {
  const b = new ArrayBuffer(4);
  new Uint32Array(b)[0] = 0x0a0b0c0d;
  return new Uint8Array(b)[0] === 0x0d;
})();

const packRGBA = (r: number, g: number, b: number, a = 255): number => {
  r = r < 0 ? 0 : r > 255 ? 255 : r | 0;
  g = g < 0 ? 0 : g > 255 ? 255 : g | 0;
  b = b < 0 ? 0 : b > 255 ? 255 : b | 0;
  a = a < 0 ? 0 : a > 255 ? 255 : a | 0;
  return IS_LE ? ((a << 24) | (b << 16) | (g << 8) | r) >>> 0 : ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
};

const unpackR = (c: number): number => IS_LE ? (c & 255) : ((c >>> 24) & 255);
const unpackG = (c: number): number => IS_LE ? ((c >>> 8) & 255) : ((c >>> 16) & 255);
const unpackB = (c: number): number => IS_LE ? ((c >>> 16) & 255) : ((c >>> 8) & 255);
const unpackA = (c: number): number => IS_LE ? ((c >>> 24) & 255) : (c & 255);
const clamp = (v: number, lo: number, hi: number): number => v < lo ? lo : v > hi ? hi : v;
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const smoothstep = (e0: number, e1: number, x: number): number => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

export const BAYER4 = [
  -.46875, .03125, -.34375, .15625,
  .28125, -.21875, .40625, -.09375,
  -.28125, .21875, -.40625, .09375,
  .46875, -.03125, .34375, -.15625,
] as const;

const bayer = (x: number, y: number): number => BAYER4[((y & 3) << 2) | (x & 3)];

export const PAL = {
  outline: packRGBA(10, 10, 17), outlineSoft: packRGBA(30, 28, 44),
  skinDeep: packRGBA(182, 181, 210), skinMid: packRGBA(218, 218, 238), skinBase: packRGBA(246, 246, 255), skinHi: packRGBA(255, 255, 255),
  latexDeep: packRGBA(9, 9, 15), latexDark: packRGBA(15, 15, 24), latexBase: packRGBA(22, 22, 34), latexMid: packRGBA(36, 37, 54),
  latexRim: packRGBA(64, 66, 92), latexSpec1: packRGBA(68, 72, 98), latexSpec2: packRGBA(112, 118, 148), latexSpec3: packRGBA(178, 184, 214),
  ivoryDeep: packRGBA(148, 139, 126), ivoryMid: packRGBA(196, 187, 172), ivoryBase: packRGBA(236, 230, 218), ivoryHi: packRGBA(255, 253, 248),
  silkSheen: packRGBA(255, 246, 226), champagne: packRGBA(218, 204, 180),
  velvetDeep: packRGBA(16, 14, 26), velvetBase: packRGBA(32, 28, 48), velvetMid: packRGBA(52, 46, 74), velvetRim: packRGBA(82, 72, 114),
  ribbonBase: packRGBA(202, 34, 72), ribbonHi: packRGBA(248, 108, 138), lilacTrim: packRGBA(158, 114, 238),
  whiteShadow: packRGBA(218, 220, 238), whitePure: packRGBA(255, 255, 255),
  hairBlack: packRGBA(11, 10, 18), hairBlackHi: packRGBA(32, 31, 46), claw: packRGBA(11, 10, 20), clawHi: packRGBA(72, 70, 114),
  silverDark: packRGBA(74, 78, 102), silverMid: packRGBA(158, 164, 194), silverHi: packRGBA(242, 245, 255),
  goldDark: packRGBA(146, 108, 42), goldMid: packRGBA(216, 176, 92), goldHi: packRGBA(255, 240, 176),
  lidBase: packRGBA(156, 104, 244), lidShadow: packRGBA(112, 66, 198), lidHi: packRGBA(206, 172, 255),
  tear: packRGBA(138, 86, 228), tearDark: packRGBA(98, 54, 184), cheek: packRGBA(228, 26, 62), cheekSoft: packRGBA(250, 114, 142),
  lipBase: packRGBA(224, 34, 74), lipDark: packRGBA(138, 18, 46), lipHi: packRGBA(255, 172, 194),
} as const;

export interface SuitMaterialConfig {
  tag: string;
  tension: number;
  clothLag: number;
  slipGain: number;
  wrinkleAmp: number;
  glintAmp: number;
  viscoDecay: number;
}

export const SUIT_MATERIALS: Record<AvatarSuit, SuitMaterialConfig> = {
  original: { tag: 'Original · Látex', tension: .72, clothLag: .36, slipGain: .62, wrinkleAmp: 6.5, glintAmp: 24, viscoDecay: 6.4 },
  maid:     { tag: 'Maid · Terciopelo', tension: .90, clothLag: .88, slipGain: 1.15, wrinkleAmp: 13.5, glintAmp: 4, viscoDecay: 2.9 },
  marfil:   { tag: 'Marfil · Seda', tension: .82, clothLag: .74, slipGain: 1.32, wrinkleAmp: 9.5, glintAmp: 18, viscoDecay: 3.8 },
  none:     { tag: 'Sin Traje · Piel', tension: 1.0, clothLag: 0, slipGain: 0, wrinkleAmp: 1.5, glintAmp: 0, viscoDecay: 4.2 },
};

type MaterialKind = 'skin' | 'ivory' | 'velvet' | 'latex';

interface NormalMap {
  nx: Float32Array;
  ny: Float32Array;
  nz: Float32Array;
}

interface SpringState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  cx: number;
  cy: number;
  kx: number;
  ky: number;
  dx: number;
  dy: number;
  maxX: number;
  maxY: number;
  squash: number;
}

type SpringName =
  | 'bustL'
  | 'bustR'
  | 'gluteL'
  | 'gluteR'
  | 'hairTop'
  | 'hairBangs'
  | 'hairCurl'
  | 'hairBot'
  | 'clothSlipL'
  | 'clothSlipR'
  | 'skirtL'
  | 'skirtR'
  | 'lapelSpread';

interface ViscoContact {
  x: number;
  y: number;
  zone: number;
  depth: number;
  clothDepth: number;
  targetDepth: number;
  radius: number;
  shearX: number;
  shearY: number;
  hold: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  type: 'heart' | 'star' | 'crumb';
}

interface PoseState {
  bodyBounceY: number;
  hipSwayX: number;
  crouchDepth: number;
  jumpHeight: number;
  legLiftL: number;
  legLiftR: number;
  torsoOffX: number;
  torsoOffY: number;
  torsoAngle: number;
  headOffX: number;
  headOffY: number;
  headAngle: number;
  armLAngle: number;
  elbowLAngle: number;
  wristLAngle: number;
  fingerCurlL: number;
  handLGesture: HandGesture;
  armRAngle: number;
  elbowRAngle: number;
  wristRAngle: number;
  fingerCurlR: number;
  handRGesture: HandGesture;
  armLiftY: number;
  sideArmAngle: number;
  sideElbowAngle: number;
  eyeOpenL: number;
  eyeOpenR: number;
  eyeLookX: number;
  eyeLookY: number;
  browTilt: number;
  mouthShape: MouthShape;
  mouthOpen: number;
}

function shadePacked(col: number, delta: number): number {
  if (col === 0) return 0;
  const a = unpackA(col);
  return a === 0 ? 0 : packRGBA(clamp(unpackR(col) + delta, 8, 255), clamp(unpackG(col) + delta, 8, 255), clamp(unpackB(col) + delta, 12, 255), a);
}

function computeEdgeDistance(mask: Uint8Array): Uint8Array {
  const dist = new Uint8Array(PIXEL_COUNT);
  for (let i = 0; i < PIXEL_COUNT; i++) dist[i] = mask[i] ? 40 : 0;
  for (let y = 1; y < H - 1; y++) {
    const row = y * W;
    for (let x = 1; x < W - 1; x++) {
      const i = row + x; if (!mask[i]) continue;
      let d = dist[i]; if (dist[i - W] + 1 < d) d = dist[i - W] + 1; if (dist[i - 1] + 1 < d) d = dist[i - 1] + 1; dist[i] = d;
    }
  }
  for (let y = H - 2; y >= 1; y--) {
    const row = y * W;
    for (let x = W - 2; x >= 1; x--) {
      const i = row + x; if (!mask[i]) continue;
      let d = dist[i]; if (dist[i + W] + 1 < d) d = dist[i + W] + 1; if (dist[i + 1] + 1 < d) d = dist[i + 1] + 1; dist[i] = d;
    }
  }
  return dist;
}

function computeScanlineNormals(
  mask: Uint8Array,
  splitCenterY = 9999,
  yCenter: number | null = null,
  yRadius = 1,
  limbSlopeY = false,
): NormalMap {
  const nxArr = new Float32Array(PIXEL_COUNT), nyArr = new Float32Array(PIXEL_COUNT), nzArr = new Float32Array(PIXEL_COUNT);
  for (let y = 0; y < H; y++) {
    const row = y * W; let x = 0;
    let nyAuto = 0;
    if (yCenter !== null) {
      nyAuto = clamp((y - yCenter) / yRadius, -0.90, 0.90);
    } else if (limbSlopeY) {
      // Gentle anatomical curvature along thighs, knees and calves to prevent flat chrome tubes
      if (y < 175) nyAuto = clamp((y - 122) / 95, -0.35, 0.35);
      else if (y < 276) nyAuto = clamp((y - 220) / 85, -0.45, 0.45);
      else nyAuto = clamp((y - 306) / 68, -0.42, 0.48);
    }
    while (x < W) {
      while (x < W && !mask[row + x]) x++;
      if (x >= W) break;
      const start = x;
      while (x < W && mask[row + x]) { if (y >= splitCenterY && x === CX && x > start) break; x++; }
      const end = x - 1, mid = (start + end) * 0.5, hw = Math.max(1.5, (end - start) * 0.5 + 0.5);
      for (let px = start; px <= end; px++) {
        let u = clamp((px - mid) / hw, -0.96, 0.96), v = nyAuto;
        const r2 = u * u + v * v;
        if (r2 > 0.95) { const sc = Math.sqrt(0.95 / r2); u *= sc; v *= sc; }
        const i = row + px; nxArr[i] = u; nyArr[i] = v; nzArr[i] = Math.sqrt(Math.max(0.05, 1.0 - u * u - v * v));
      }
    }
  }
  return { nx: nxArr, ny: nyArr, nz: nzArr };
}

/**
 * Refined single-key studio shading:
 * Eliminates the "double-bubble specular" artifact and prevents vertical chrome stripes on limbs.
 */
function shadeMaterial3D(
  x: number,
  y: number,
  nx: number,
  ny: number,
  nz: number,
  material: MaterialKind,
  extraShadow = 0,
  specBoost = 0.72,
): number {
  // Single primary upper-left-front key light + soft fill (no second specular hotspot!)
  const ndotl1 = Math.max(0, nx * -0.28 + ny * -0.54 + nz * 0.79);
  const ndotlFill = Math.max(0, nx * 0.36 + ny * -0.20 + nz * 0.91);
  const diff = clamp(ndotl1 * 0.80 + ndotlFill * 0.22 - extraShadow, 0, 1);

  // Single sleek elongated upper-crescent specular sheen (zero circular bullseye dot!)
  const hx = (nx + 0.18) * 0.56;
  const hy = (ny + 0.44) * 1.15;
  const spec = Math.exp(-(hx * hx + hy * hy) * 9.5) * smoothstep(0.18, 0.72, nz) * specBoost * clamp(1.0 - extraShadow * 1.85, 0, 1);

  // Subtle rim light around silhouette edges
  const rim = Math.pow(clamp(1.0 - nz, 0, 1), 2.35) * clamp(0.62 - ny * 0.42, 0.14, 0.95) * clamp(1.0 - extraShadow * 1.4, 0, 1);
  const d = bayer(x, y) * 0.05;

  if (material === 'skin') {
    if (extraShadow > 0.36 || diff + d < 0.22) return PAL.skinDeep;
    if (extraShadow > 0.16 || diff + d < 0.46) return PAL.skinMid;
    return diff + d > 0.82 ? PAL.skinHi : PAL.skinBase;
  }
  if (material === 'ivory') {
    if (spec + d > 0.62) return PAL.ivoryHi;
    if (rim + d > 0.48) return PAL.silkSheen;
    if (extraShadow > 0.30 || diff + d < 0.24) return PAL.ivoryDeep;
    if (extraShadow > 0.12 || diff + d < 0.50) return PAL.ivoryMid;
    return diff + d < 0.66 ? PAL.champagne : PAL.ivoryBase;
  }
  if (material === 'velvet') {
    if (rim + d > 0.44) return PAL.velvetRim;
    if (extraShadow > 0.24 || diff + d < 0.28) return PAL.velvetDeep;
    return diff + d > 0.66 ? PAL.velvetMid : PAL.velvetBase;
  }

  // Deep satin latex matching the 3D avatar (broad sleek sheen, zero target rings!)
  if (spec + d * 0.65 > 0.62) return PAL.latexSpec3;
  if (spec + d * 0.80 > 0.40) return PAL.latexSpec2;
  if (spec + d > 0.22) return PAL.latexSpec1;
  if (rim + d > 0.48) return PAL.latexRim;
  if (diff + d > 0.68) return PAL.latexMid;
  if (diff + d > 0.36) return PAL.latexBase;
  return diff + d > 0.17 ? PAL.latexDark : PAL.latexDeep;
}

function applyOutline(buf: Uint32Array, outlineCol: number, x0 = 1, y0 = 1, x1 = W - 2, y1 = H - 2): void {
  const minX = Math.max(1, x0 | 0), minY = Math.max(1, y0 | 0), maxX = Math.min(W - 2, x1 | 0), maxY = Math.min(H - 2, y1 | 0);
  const solid = new Uint8Array(PIXEL_COUNT);
  for (let y = minY; y <= maxY; y++) { const row = y * W; for (let x = minX; x <= maxX; x++) if (buf[row + x] !== 0) solid[row + x] = 1; }
  for (let y = minY; y <= maxY; y++) {
    const row = y * W;
    for (let x = minX; x <= maxX; x++) {
      const i = row + x;
      if (!solid[i] && (solid[i - 1] || solid[i + 1] || solid[i - W] || solid[i + W])) buf[i] = outlineCol;
    }
  }
}

function traceTaperedArc(c: CanvasRenderingContext2D, ax: number, ay: number, mx: number, my: number, bx: number, by: number, halfThick: number): void {
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
  c.beginPath(); c.moveTo(ax, ay);
  c.quadraticCurveTo(mx + nx * halfThick, my + ny * halfThick, bx, by);
  c.quadraticCurveTo(mx - nx * halfThick, my - ny * halfThick, ax, ay);
  c.closePath(); c.fill();
}

function traceSharpCurvedX(c: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, bendX: number, bendY: number, halfThick: number): void {
  traceTaperedArc(c, cx - rx, cy - ry, cx + bendX, cy + bendY, cx + rx, cy + ry, halfThick);
  traceTaperedArc(c, cx + rx, cy - ry, cx + bendX, cy + bendY, cx - rx, cy + ry, halfThick);
}

// ---- TRAZADORES ANATÓMICOS BÉZIER (REFINADOS AL 3D) ----
function traceTorsoAndLegsFrontBack(c: CanvasRenderingContext2D): void {
  const S = SKEL;
  c.beginPath();
  c.moveTo(CX - S.neckHalfW, S.neckTopY); c.lineTo(CX - S.neckHalfW - 0.8, S.neckBotY - 1);
  c.bezierCurveTo(CX - 22, S.neckBotY + 1, CX - 32, S.shoulderY, CX - S.shoulderX, S.shoulderY + 5);
  // Sculpted hourglass waist taper matching 3D front & back
  c.bezierCurveTo(CX - 34, S.bustCenterY - 6, CX - 25, S.waistY - 14, CX - S.waistHalfW, S.waistY);
  c.bezierCurveTo(CX - 32, S.waistY + 6, CX - S.hipHalfW, S.hipTopY + 9, CX - S.hipHalfW, S.hipPeakY);
  c.bezierCurveTo(CX - S.hipHalfW, S.thighBandY + 18, CX - 41, S.kneeY - 24, CX - S.kneeOuterX, S.kneeY);
  c.bezierCurveTo(CX - 31, S.kneeY + 12, CX - S.calfOuterX, S.calfPeakY - 12, CX - S.calfOuterX, S.calfPeakY);
  c.bezierCurveTo(CX - 32, S.calfPeakY + 16, CX - 21, S.ankleBandY - 8, CX - S.ankleOuterX, S.ankleBandY);
  c.quadraticCurveTo(CX - 15.5, S.footTipY - 6, CX - S.footCenterX, S.footTipY);
  c.quadraticCurveTo(CX - 10, S.footTipY - 6, CX - S.ankleInnerX, S.ankleBandY);
  c.bezierCurveTo(CX - 6, S.calfPeakY + 12, CX - S.calfInnerX, S.calfPeakY, CX - S.kneeInnerX, S.kneeY);
  c.bezierCurveTo(CX - 4.5, S.kneeY - 18, CX - 1.5, S.thighBandY + 18, CX - 0.8, S.crotchY + 4);
  c.quadraticCurveTo(CX, S.crotchY, CX + 0.8, S.crotchY + 4);
  c.bezierCurveTo(CX + 1.5, S.thighBandY + 18, CX + 4.5, S.kneeY - 18, CX + S.kneeInnerX, S.kneeY);
  c.bezierCurveTo(CX + S.calfInnerX, S.calfPeakY, CX + 6, S.calfPeakY + 12, CX + S.ankleInnerX, S.ankleBandY);
  c.quadraticCurveTo(CX + 10, S.footTipY - 6, CX + S.footCenterX, S.footTipY);
  c.quadraticCurveTo(CX + 15.5, S.footTipY - 6, CX + S.ankleOuterX, S.ankleBandY);
  c.bezierCurveTo(CX + 21, S.ankleBandY - 8, CX + 32, S.calfPeakY + 16, CX + S.calfOuterX, S.calfPeakY);
  c.bezierCurveTo(CX + S.calfOuterX, S.calfPeakY - 12, CX + 31, S.kneeY + 12, CX + S.kneeOuterX, S.kneeY);
  c.bezierCurveTo(CX + 41, S.kneeY - 24, CX + S.hipHalfW, S.thighBandY + 18, CX + S.hipHalfW, S.hipPeakY);
  c.bezierCurveTo(CX + S.hipHalfW, S.hipTopY + 9, CX + 32, S.waistY + 6, CX + S.waistHalfW, S.waistY);
  c.bezierCurveTo(CX + 25, S.waistY - 14, CX + 34, S.bustCenterY - 6, CX + S.shoulderX, S.shoulderY + 5);
  c.bezierCurveTo(CX + 32, S.shoulderY, CX + 22, S.neckBotY + 1, CX + S.neckHalfW + 0.8, S.neckBotY - 1);
  c.lineTo(CX + S.neckHalfW, S.neckTopY); c.closePath(); c.fill();
}

function traceHeadFrontBack(c: CanvasRenderingContext2D): void {
  const S = SKEL;
  c.beginPath(); c.moveTo(CX, S.headTopY);
  c.bezierCurveTo(CX + S.headRx * 1.06, S.headTopY + 1, CX + S.headRx * 1.05, S.cheekY + 3, CX + 13, S.chinY - 2.5);
  c.quadraticCurveTo(CX, S.chinY + 2.0, CX - 13, S.chinY - 2.5);
  c.bezierCurveTo(CX - S.headRx * 1.05, S.cheekY + 3, CX - S.headRx * 1.06, S.headTopY + 1, CX, S.headTopY);
  c.closePath(); c.fill();
}

function traceArmsFrontBack(c: CanvasRenderingContext2D, side: number): void {
  const S = SKEL, sx = (dx: number) => CX + side * dx;
  c.beginPath();
  // Rounded deltoid shoulder cap so arm rotates smoothly from shoulder pivot without gaps!
  c.moveTo(sx(S.shoulderX - 6), S.shoulderY + 2);
  c.bezierCurveTo(sx(49), S.shoulderY + 1, sx(60), S.bicepBandY + 6, sx(S.elbowX + 8.5), S.elbowY - 3);
  c.bezierCurveTo(sx(77), S.elbowY + 12, sx(86), S.wristBandY - 4, sx(S.wristX + 7.2), S.wristY);
  // Rounded wrist cap (articulated palm & 5 fingers are rendered dynamically at wrist pivot!)
  c.quadraticCurveTo(sx(S.wristX), S.wristY + 5.5, sx(S.wristX - 6.5), S.wristY - 1);
  c.bezierCurveTo(sx(70), S.wristBandY - 6, sx(60), S.elbowY + 11, sx(S.elbowX - 6.5), S.elbowY + 3);
  c.bezierCurveTo(sx(49), S.bicepBandY + 15, sx(36), S.shoulderY + 20, sx(S.shoulderX - 8), S.shoulderY + 17);
  c.quadraticCurveTo(sx(S.shoulderX - 11), S.shoulderY + 9, sx(S.shoulderX - 6), S.shoulderY + 2);
  c.closePath();
  c.fill();
}

function traceFingerTipsWhiteFrontBack(_c: CanvasRenderingContext2D, _side: number): void {
  // Hand & 5 articulated fingers + tips are now rendered dynamically per frame
}

function traceClawsForSideFrontBack(_c: CanvasRenderingContext2D, _side: number): void {
  // Hand claws are now rendered dynamically per finger at the articulated tips
}

function traceBustFrontBezier(c: CanvasRenderingContext2D): void {
  const S = SKEL;
  for (const s of [-1, 1]) {
    const bx = CX + s * S.bustCenterX, by = S.bustCenterY, rx = S.bustRx, ry = S.bustRy;
    // Organic teardrop sweep matching 3D front reference
    c.beginPath(); c.moveTo(CX - s * 0.5, S.bustTopY + 5);
    c.bezierCurveTo(bx + s * rx * 0.36, by - ry * 1.06, bx + s * rx * 1.04, by - ry * 0.48, bx + s * rx * 1.05, by + ry * 0.18);
    c.bezierCurveTo(bx + s * rx * 0.98, by + ry * 0.98, bx - s * rx * 0.10, by + ry * 1.12, CX + s * 0.8, by + ry * 0.72);
    c.lineTo(CX - s * 0.5, by + ry * 0.65); c.closePath(); c.fill();
  }
}

function traceGlutesBackBezier(c: CanvasRenderingContext2D): void {
  const S = SKEL;
  for (const s of [-1, 1]) {
    const gx = CX + s * S.gluteCenterX, gy = S.gluteCenterY, rx = S.gluteRx, ry = S.gluteRy;
    c.beginPath(); c.moveTo(CX - s * 0.5, gy - ry * 0.82);
    c.bezierCurveTo(gx + s * rx * 0.35, gy - ry * 1.08, gx + s * rx * 1.05, gy - ry * 0.64, gx + s * rx * 1.04, gy + ry * 0.16);
    c.bezierCurveTo(gx + s * rx * 0.98, gy + ry * 0.98, gx - s * rx * 0.08, gy + ry * 1.08, CX + s * 0.8, gy + ry * 0.70);
    c.lineTo(CX - s * 0.5, gy + ry * 0.62); c.closePath(); c.fill();
  }
}

function traceTorsoAndLegsSide(c: CanvasRenderingContext2D): void {
  c.beginPath(); c.moveTo(SX - 10, 78); c.lineTo(SX - 12, 92);
  c.bezierCurveTo(SX - 22, 114, SX - 24, 148, SX - 22, 174);
  c.bezierCurveTo(SX - 26, 192, SX - 30, 224, SX - 26, 250);
  c.bezierCurveTo(SX - 24, 266, SX - 22, 274, SX - 22, 281);
  c.bezierCurveTo(SX - 20, 298, SX - 15, 326, SX - 10, 344);
  c.lineTo(SX - 6, 359); c.lineTo(SX + 11, 359); c.lineTo(SX + 14, 344);
  c.bezierCurveTo(SX + 22, 330, SX + 29, 314, SX + 28, 300);
  c.bezierCurveTo(SX + 27, 286, SX + 14, 278, SX + 7, 274);
  c.bezierCurveTo(SX + 14, 260, SX + 32, 244, SX + 36, 224);
  c.bezierCurveTo(SX + 34, 200, SX + 24, 178, SX + 16, 162);
  c.bezierCurveTo(SX + 13, 144, SX + 20, 116, SX + 17, 94);
  c.quadraticCurveTo(SX + 14, 84, SX + 10, 78); c.closePath(); c.fill();
}

function traceHeadSide(c: CanvasRenderingContext2D): void {
  c.beginPath(); c.ellipse(SX - 8, 60, 22.5, 22.5, -0.08, 0, Math.PI * 2); c.fill();
}

function traceBustSide(c: CanvasRenderingContext2D): void {
  c.beginPath(); c.moveTo(SX - 10, 96);
  c.bezierCurveTo(SX - 44, 96, SX - 81, 116, SX - 80, 140);
  c.bezierCurveTo(SX - 79, 165, SX - 52, 176, SX - 24, 170);
  c.bezierCurveTo(SX - 12, 167, SX - 8, 152, SX - 8, 134); c.closePath(); c.fill();
}

function traceGlutesSide(c: CanvasRenderingContext2D): void {
  c.beginPath(); c.moveTo(SX + 12, 164);
  c.bezierCurveTo(SX + 38, 164, SX + 58, 179, SX + 57, 200);
  c.bezierCurveTo(SX + 56, 221, SX + 38, 234, SX + 16, 228);
  c.bezierCurveTo(SX + 4, 225, SX + 2, 206, SX + 4, 184); c.closePath(); c.fill();
}

function traceFrontArmSide(c: CanvasRenderingContext2D): void {
  c.beginPath();
  c.moveTo(SX - 12, 92);
  c.bezierCurveTo(SX - 4, 86, SX + 14, 89, SX + 16, 102);
  c.bezierCurveTo(SX + 20, 122, SX + 17, 144, SX + 9, 164);
  c.bezierCurveTo(SX + 4, 174, SX, 182, SX - 8, 188);
  // Rounded side wrist cap (articulated palm & 5 fingers rendered dynamically!)
  c.quadraticCurveTo(SX - 18, 194, SX - 28, 186);
  c.bezierCurveTo(SX - 31, 176, SX - 26, 166, SX - 22, 156);
  c.bezierCurveTo(SX - 16, 138, SX - 15, 114, SX - 12, 92);
  c.closePath();
  c.fill();
}

function traceFingerTipsWhiteSide(_c: CanvasRenderingContext2D): void {
  // Hand & 5 articulated fingers rendered dynamically
}

function traceClawsSide(_c: CanvasRenderingContext2D): void {
  // Claws rendered dynamically per articulated finger
}

const ZONE_NAMES: Record<number, string> = {
  0: 'Fondo',
  1: 'Busto Izq.',
  2: 'Busto Der.',
  3: 'Glúteo / Cadera Izq.',
  4: 'Glúteo / Cadera Der.',
  5: 'Cabello Superior',
  6: 'Flequillo Cebra',
  7: 'Rizo Lateral',
  8: 'Rostro / Mejillas',
  9: 'Cuerpo',
  10: 'Tela Libre',
  11: 'Cremallera (Arrastra)',
};

const SPRING_ZONE_MAP: Record<number, SpringName> = {
  1: 'bustL',
  2: 'bustR',
  3: 'gluteL',
  4: 'gluteR',
  5: 'hairTop',
  6: 'hairBangs',
  7: 'hairCurl',
};

export function createPixelAvatarEngine(
  canvas: HTMLCanvasElement,
  callbacks: PixelAvatarCallbacks = {},
): PixelAvatarEngine {
  canvas.width = W;
  canvas.height = H;
  const ctxRaw = canvas.getContext('2d', { alpha: false });
  if (!ctxRaw) {
    throw new Error('No se pudo inicializar el contexto 2D del visor pixel art.');
  }
  const ctx: CanvasRenderingContext2D = ctxRaw;
  ctx.imageSmoothingEnabled = false;

  const scratchCanvas = document.createElement('canvas');
  scratchCanvas.width = W;
  scratchCanvas.height = H;
  const sctxRaw = scratchCanvas.getContext('2d', { willReadFrequently: true });
  if (!sctxRaw) {
    throw new Error('No se pudo inicializar el buffer auxiliar 2D.');
  }
  const sctx: CanvasRenderingContext2D = sctxRaw;

  function rasterizeBezierMask(drawFn: (c: CanvasRenderingContext2D) => void): Uint8Array {
    sctx.clearRect(0, 0, W, H); sctx.save(); sctx.fillStyle = '#fff'; sctx.strokeStyle = '#fff';
    drawFn(sctx); sctx.restore();
    const raw = sctx.getImageData(0, 0, W, H).data, mask = new Uint8Array(PIXEL_COUNT);
    for (let i = 0; i < PIXEL_COUNT; i++) mask[i] = raw[(i << 2) + 3] >= 120 ? 1 : 0;
    return mask;
  }

  function stampBezierColor(
    targetBuf: Uint32Array,
    clipMask: Uint8Array | null,
    color: number,
    drawFn: (c: CanvasRenderingContext2D) => void,
  ): void {
    const mask = rasterizeBezierMask(drawFn);
    for (let i = 0; i < PIXEL_COUNT; i++) if (mask[i] && (!clipMask || clipMask[i])) targetBuf[i] = color;
  }

  const state: {
    view: AvatarView;
    suit: AvatarSuit;
    zipper: number;
    bra: boolean;
    panties: boolean;
    stockings: boolean;
    handEnabled: boolean;
    cubeEnabled: boolean;
    pullFabric: boolean;
    animationsEnabled: boolean;
    currentAnim: AvatarAnimation;
    animTime: number;
    animDuration: number;
    customRigPose: AvatarRigPose | null;
    customRigTime: number;
    customRigDuration: number;
    affection: number;
    blush: number;
    mood: AvatarMood;
    moodTimer: number;
    blinkTimer: number;
    blinkPhase: number;
    eatAnim: { t: number } | null;
    time: number;
  } = {
    view: 'front', suit: 'original', zipper: 0, bra: true, panties: true, stockings: true,
    handEnabled: true, cubeEnabled: false, pullFabric: false, animationsEnabled: true,
    currentAnim: 'idle', animTime: 0, animDuration: 0,
    customRigPose: null, customRigTime: 0, customRigDuration: 0,
    affection: 74, blush: .15, mood: 'Tranquila', moodTimer: 0, blinkTimer: 2.8, blinkPhase: 0, eatAnim: null, time: 0,
  };

  let currentFps = 60;
  let currentZoneLabel = '—';
  let hintDismissed = false;
  let lastInteractionEvent: InteractionEvent | null = null;
  let lastEmittedTime = 0;
  let lastEmittedAff = Math.round(state.affection);
  let lastEmittedBlush = Math.round(state.blush * 100);
  let destroyed = false;
  let rafId = 0;
  const pendingTimeouts = new Set<number>();

  const scheduleTimeout = (fn: () => void, ms: number): void => {
    const id = window.setTimeout(() => {
      pendingTimeouts.delete(id);
      if (!destroyed) fn();
    }, ms);
    pendingTimeouts.add(id);
  };

  const bgBuf = new Uint32Array(PIXEL_COUNT), hairChunkBuf = new Uint32Array(PIXEL_COUNT);
  const headFrameBuf = new Uint32Array(PIXEL_COUNT);
  const u32 = () => new Uint32Array(PIXEL_COUNT);
  const u8 = () => new Uint8Array(PIXEL_COUNT);
  const f32 = () => new Float32Array(PIXEL_COUNT);
  const emptyNorm = (): NormalMap => ({ nx: f32(), ny: f32(), nz: f32() });

  const masks: {
    torsoLegs: Uint8Array;
    head: Uint8Array;
    armL: Uint8Array;
    armR: Uint8Array;
    arms: Uint8Array;
    clawsL: Uint8Array;
    clawsR: Uint8Array;
    claws: Uint8Array;
    fixedUnion: Uint8Array;
    softDom: Uint8Array;
    softSideBust: Uint8Array | null;
    softSideGlute: Uint8Array | null;
    peekDom: Uint8Array;
    torsoNorm: NormalMap;
    armLNorm: NormalMap;
    armRNorm: NormalMap;
    armNorm: NormalMap;
    headNorm: NormalMap;
  } = {
    torsoLegs: u8(), head: u8(), armL: u8(), armR: u8(), arms: u8(),
    clawsL: u8(), clawsR: u8(), claws: u8(), fixedUnion: u8(),
    softDom: u8(), softSideBust: null, softSideGlute: null, peekDom: u8(),
    torsoNorm: emptyNorm(), armLNorm: emptyNorm(), armRNorm: emptyNorm(), armNorm: emptyNorm(), headNorm: emptyNorm(),
  };

  // Articulated garment buffers for crisp part-by-part pixel animation
  const garmentLayers = {
    torsoBody: u32(), torsoMedias: u32(), torsoBraga: u32(), torsoSosten: u32(), torsoTraje: u32(),
    headBody: u32(),
    armLBody: u32(), armLTraje: u32(),
    armRBody: u32(), armRTraje: u32(),
    frontArmBody: u32(), frontArmTraje: u32(),
    softBody: u32(), softMedias: u32(), softBraga: u32(), softSosten: u32(), softTraje: u32(),
    peekBody: u32(), peekSosten: u32(), peekTraje: u32(), skirtCloth: u32(), headAcc: u32(),
  };

  const planes = {
    torsoRGBA: u32(), torsoSuitRGBA: u32(),
    headRGBA: u32(),
    armLRGBA: u32(), armLSuitRGBA: u32(),
    armRRGBA: u32(), armRSuitRGBA: u32(),
    frontArmRGBA: u32(), frontArmSuitRGBA: u32(),
    softRGBA: u32(), softLayerID: u8(), softSuitRGBA: u32(),
    peekRGBA: u32(), peekLayerID: u8(), peekSuitRGBA: u32(),
    skirtRGBA: u32(), headAccRGBA: u32(), hairRGBA: u32(), hairZone: u8(),
    hitZoneMask: u8(),
    dynamicHitZone: u8(),
    softWeightL: f32(), softWeightR: f32(), hipWeightL: f32(), hipWeightR: f32(),
    hairWeightTop: f32(), hairWeightBangs: f32(), hairWeightCurl: f32(), hairWeightBot: f32(),
  };

  const frameImageData = ctx.createImageData(W, H);
  const frameU32 = new Uint32Array(frameImageData.data.buffer);

  // Articulated 2D Multi-Joint Rig Pose State (smoothly interpolated + physics-coupled)
  const pose: PoseState = {
    bodyBounceY: 0, hipSwayX: 0,
    crouchDepth: 0, jumpHeight: 0, legLiftL: 0, legLiftR: 0,
    torsoOffX: 0, torsoOffY: 0, torsoAngle: 0,
    headOffX: 0, headOffY: 0, headAngle: 0,
    armLAngle: 0, elbowLAngle: 0, wristLAngle: 0, fingerCurlL: 0, handLGesture: 'open',
    armRAngle: 0, elbowRAngle: 0, wristRAngle: 0, fingerCurlR: 0, handRGesture: 'open',
    armLiftY: 0, sideArmAngle: 0, sideElbowAngle: 0,
    eyeOpenL: 1, eyeOpenR: 1, eyeLookX: 0, eyeLookY: 0, browTilt: 0,
    mouthShape: 'neutral', mouthOpen: 0,
  };
  const prevPoseKinematics = {
    torsoX: 0, torsoY: 0, torsoVx: 0, torsoVy: 0,
    headX: 0, headY: 0, headVx: 0, headVy: 0,
    hipX: 0, hipY: 0, hipVx: 0, hipVy: 0,
  };

  function getSnapshot(): AvatarSnapshot {
    return {
      fps: currentFps,
      view: state.view,
      suit: state.suit,
      suitTag: SUIT_MATERIALS[state.suit].tag,
      zipper: state.zipper,
      bra: state.bra,
      panties: state.panties,
      stockings: state.stockings,
      handEnabled: state.handEnabled,
      cubeEnabled: state.cubeEnabled,
      pullFabric: state.pullFabric,
      animationsEnabled: state.animationsEnabled,
      currentAnimation: state.currentAnim,
      mood: state.mood,
      affection: Math.round(state.affection),
      blush: Math.round(state.blush * 100),
      zoneLabel: currentZoneLabel,
      hintDismissed,
      lastInteractionEvent,
      activeRigPose: state.customRigPose,
    };
  }

  function emitSnapshot(force = false): void {
    if (!callbacks.onSnapshot) return;
    const now = performance.now();
    const aff = Math.round(state.affection);
    const bl = Math.round(state.blush * 100);
    if (!force && now - lastEmittedTime < 220 && aff === lastEmittedAff && bl === lastEmittedBlush) return;
    lastEmittedTime = now;
    lastEmittedAff = aff;
    lastEmittedBlush = bl;
    callbacks.onSnapshot(getSnapshot());
  }

  function emitInteraction(type: InteractionEventType, detail?: string): void {
    const evt: InteractionEvent = { type, detail, timestamp: Date.now() };
    lastInteractionEvent = evt;
    const snap = getSnapshot();
    callbacks.onSnapshot?.(snap);
    callbacks.onInteraction?.(evt, snap);
  }

  function triggerAnimation(anim: AvatarAnimation, durationSec = 2.0): void {
    state.currentAnim = anim;
    state.animTime = 0;
    state.animDuration = anim === 'idle' ? 0 : Math.max(0.7, durationSec);
    emitSnapshot(true);
  }

  function buildBackground(): void {
    const horizon = Math.round(H * 0.475);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const idx = y * W + x, dx = (x - CX) / 170, dy = (y - 120) / 210;
      const vig = clamp(1 - (dx * dx + dy * dy) * 0.24, 0.72, 1), d = bayer(x, y) * 2.2;
      let r: number, g: number, b: number;
      if (y < horizon) { const t = y / horizon; r = lerp(63, 102, t) * vig + d; g = lerp(61, 98, t) * vig + d; b = lerp(92, 134, t) * vig + d; }
      else { const t = (y - horizon) / (H - horizon); r = lerp(39, 22, t) * vig + d; g = lerp(38, 21, t) * vig + d; b = lerp(58, 34, t) * vig + d; }
      const px = (x - CX) / 168, py = (y - 364) / 48, pd = px * px + py * py;
      if (pd <= 1) {
        const rim = smoothstep(0.92, 1, pd), grad = clamp(1 - (y - 316) / 46, 0, 1);
        r = lerp(152, 180, grad * .65) - rim * 22 + d; g = lerp(156, 184, grad * .65) - rim * 22 + d; b = lerp(186, 214, grad * .65) - rim * 18 + d;
        const sd = Math.pow((x - (CX + 4)) / 40, 2) + Math.pow((y - 355) / 9, 2);
        if (sd < 1) { const sh = (1 - sd) * 0.36; r *= 1 - sh; g *= 1 - sh; b *= 1 - sh; }
      }
      bgBuf[idx] = packRGBA(r, g, b);
    }
  }

  function clearAllGarments(): void {
    (Object.keys(garmentLayers) as Array<keyof typeof garmentLayers>).forEach((k) => garmentLayers[k].fill(0));
    const planeKeys = [
      'torsoRGBA', 'torsoSuitRGBA', 'headRGBA', 'armLRGBA', 'armLSuitRGBA', 'armRRGBA', 'armRSuitRGBA',
      'frontArmRGBA', 'frontArmSuitRGBA', 'softRGBA', 'softLayerID', 'softSuitRGBA',
      'peekRGBA', 'peekLayerID', 'peekSuitRGBA', 'skirtRGBA', 'headAccRGBA', 'hitZoneMask', 'dynamicHitZone',
    ] as const;
    for (const k of planeKeys) planes[k].fill(0);
  }

  function buildAnatomicalMasks(view: AvatarView): void {
    const S = SKEL;
    if (view === 'side') {
      masks.torsoLegs = rasterizeBezierMask(traceTorsoAndLegsSide);
      masks.head = rasterizeBezierMask(traceHeadSide);
      masks.armL = u8();
      masks.armR = u8();
      masks.arms = rasterizeBezierMask(traceFrontArmSide);
      masks.clawsL = u8();
      masks.clawsR = u8();
      masks.claws = rasterizeBezierMask(traceClawsSide);
      const u = u8(); for (let i = 0; i < PIXEL_COUNT; i++) u[i] = (masks.torsoLegs[i] || masks.head[i]) ? 1 : 0;
      masks.fixedUnion = u;
      masks.torsoNorm = computeScanlineNormals(masks.torsoLegs, 9999, null, 1, true);
      masks.armNorm = computeScanlineNormals(masks.arms, 9999, null, 1, true);
      masks.headNorm = computeScanlineNormals(masks.head, 9999, 60, 22.5);
      masks.softSideBust = rasterizeBezierMask(traceBustSide);
      masks.softSideGlute = rasterizeBezierMask(traceGlutesSide);
      const sd = u8(); for (let i = 0; i < PIXEL_COUNT; i++) sd[i] = (masks.softSideBust[i] || masks.softSideGlute[i]) ? 1 : 0;
      masks.softDom = sd; masks.peekDom = u8();
      return;
    }
    masks.torsoLegs = rasterizeBezierMask(traceTorsoAndLegsFrontBack);
    masks.head = rasterizeBezierMask(traceHeadFrontBack);
    masks.armL = rasterizeBezierMask((c) => traceArmsFrontBack(c, -1));
    masks.armR = rasterizeBezierMask((c) => traceArmsFrontBack(c, 1));
    const bothArms = u8();
    for (let i = 0; i < PIXEL_COUNT; i++) bothArms[i] = (masks.armL[i] || masks.armR[i]) ? 1 : 0;
    masks.arms = bothArms;
    masks.clawsL = rasterizeBezierMask((c) => traceClawsForSideFrontBack(c, -1));
    masks.clawsR = rasterizeBezierMask((c) => traceClawsForSideFrontBack(c, 1));
    const bothClaws = u8();
    for (let i = 0; i < PIXEL_COUNT; i++) bothClaws[i] = (masks.clawsL[i] || masks.clawsR[i]) ? 1 : 0;
    masks.claws = bothClaws;
    const u = u8(); for (let i = 0; i < PIXEL_COUNT; i++) u[i] = (masks.torsoLegs[i] || masks.head[i] || masks.arms[i]) ? 1 : 0;
    masks.fixedUnion = u;
    masks.torsoNorm = computeScanlineNormals(masks.torsoLegs, Math.round(S.crotchY - 6), null, 1, true);
    masks.armLNorm = computeScanlineNormals(masks.armL, 9999, null, 1, true);
    masks.armRNorm = computeScanlineNormals(masks.armR, 9999, null, 1, true);
    masks.armNorm = computeScanlineNormals(masks.arms, 9999, null, 1, true);
    masks.headNorm = computeScanlineNormals(masks.head, 9999, S.headCenterY, S.headRy);
    masks.softSideBust = null; masks.softSideGlute = null;
    masks.softDom = rasterizeBezierMask((c) => view === 'front' ? traceBustFrontBezier(c) : traceGlutesBackBezier(c));
    masks.peekDom = view === 'back' ? rasterizeBezierMask((c) => { for (const s of [-1, 1]) { c.beginPath(); c.ellipse(CX + s * 35, S.bustCenterY + 5, 16, 26, s * -0.1, 0, Math.PI * 2); c.fill(); } }) : u8();
  }

  function getZipperOpeningHalfWidth(y: number, zipPct: number): number {
    if (zipPct <= 0.5) return 0;
    const z = zipPct / 100, topY = SKEL.neckMidY, botY = topY + 6 + z * (SKEL.waistY - topY - 4);
    if (y < topY || y > botY) return 0;
    const t = (y - topY) / Math.max(1, botY - topY);
    return (1 - t) * (21.5 * z) * (0.68 + 0.42 * Math.sin((1 - t) * Math.PI * 0.72 + 0.24));
  }

  function buildBaseAndLingerieLayers(view: AvatarView): void {
    const S = SKEL, isFront = view === 'front', isSide = view === 'side';

    // 1. Dedicated Head Porcelain Buffer (radiant clean chin, rotates independently!)
    for (let y = 34; y <= Math.ceil(S.chinY + 6); y++) {
      const row = y * W;
      for (let x = CX - 38; x <= CX + 38; x++) {
        const idx = row + x;
        if (!masks.head[idx]) continue;
        const nx = masks.headNorm.nx[idx], ny = masks.headNorm.ny[idx], nz = masks.headNorm.nz[idx];
        // Clean porcelain shading: bright center face, gentle edge contour, zero muddy chin!
        const edgeSh = smoothstep(0.55, 0.08, nz) * 0.14;
        garmentLayers.headBody[idx] = shadeMaterial3D(x, y, nx, ny, nz, 'skin', edgeSh, 0.25);
      }
    }
    applyOutline(garmentLayers.headBody, PAL.outline, CX - 40, 32, CX + 40, Math.ceil(S.chinY + 8));

    // 2. Torso + Legs Base Body & Lingerie
    for (let y = Math.floor(S.neckTopY - 2); y < H; y++) {
      const row = y * W;
      for (let x = 20; x < W - 20; x++) {
        const idx = row + x;
        if (!masks.torsoLegs[idx]) continue;
        const nx = masks.torsoNorm.nx[idx], ny = masks.torsoNorm.ny[idx], nz = masks.torsoNorm.nz[idx], ax = Math.abs(x - CX);
        let extraSh = (y >= S.chinY - 2 && y <= S.chinY + 6 && (!isSide ? ax < 14 : Math.abs(x - SX) < 16)) ? 0.34 : 0;
        if (isFront) {
          if (y > S.bustBotY - 3 && y < S.bustBotY + 8 && ax < 40) extraSh = Math.max(extraSh, 0.22);
          if (y > S.crotchY - 10 && y < S.crotchY + 4 && ax < 14) extraSh = Math.max(extraSh, 0.22);
        } else if (!isSide) {
          if (y > S.shoulderY + 8 && y < S.waistY + 4 && ax <= 2.0) extraSh = Math.max(extraSh, 0.20 * (1 - ax / 2.2));
          if (y > S.gluteCenterY + S.gluteRy - 2 && y < S.gluteCenterY + S.gluteRy + 8 && ax < 48) extraSh = Math.max(extraSh, 0.26);
        }
        garmentLayers.torsoBody[idx] = shadeMaterial3D(x, y, nx, ny, nz, 'skin', extraSh, 0.25);

        // Choker on bare neck
        if (y >= S.neckMidY - 2 && y <= S.neckMidY + 3 && (!isSide ? ax < 13 : Math.abs(x - SX) < 15)) {
          garmentLayers.torsoBody[idx] = (y === Math.round(S.neckMidY)) ? PAL.latexMid : PAL.latexDeep;
        }

        // Medias (Stockings + garters)
        const stockTop = isSide ? (232 + (x - SX) * 0.28) : (isFront ? (S.thighBandY + 5) : (S.thighBandY + 14));
        const scallop = Math.sin(x * 0.68) * 1.8;
        if (y >= stockTop + scallop * 0.45) garmentLayers.torsoMedias[idx] = shadeMaterial3D(x, y, nx, ny, nz, 'latex', extraSh, 0.42);
        else if (y >= stockTop - 6 + scallop) garmentLayers.torsoMedias[idx] = ((x & 3) === 0 && y < stockTop - 2) ? PAL.whiteShadow : (nx < 0.25 ? PAL.whitePure : PAL.whiteShadow);
        const onStrap = isSide ? (y >= 186 && y < stockTop - 2 && Math.abs(x - (SX - 8)) <= 1.4) : (y >= (isFront ? S.waistY + 14 : S.gluteCenterY + 12) && y < stockTop - 2 && Math.abs(ax - 22) <= 1.4);
        if (onStrap) garmentLayers.torsoMedias[idx] = (y >= stockTop - 6 && y <= stockTop - 3) ? PAL.silverHi : PAL.latexDeep;

        // Braga (Brief)
        if (isSide) {
          const topP = 178 - (x - SX) * 0.22, botP = 224 + (x - SX) * 0.14;
          if (y >= topP && y <= botP && x < SX + 24) garmentLayers.torsoBraga[idx] = (y - topP < 2.4 || botP - y < 2.4) ? PAL.whitePure : shadeMaterial3D(x, y, nx, ny, nz, 'latex', 0, 0.45);
        } else if (y >= S.waistBandTopY + 4 && y <= S.crotchY + 12) {
          const topCurve = (S.waistBandTopY + 10) + Math.pow(ax / 56, 1.45) * 8;
          const botCut = isFront ? (S.crotchY + 6) - Math.pow(ax / 38, 1.15) * 28 : (S.crotchY + 2) - Math.pow(ax / 48, 1.2) * 18;
          if (y >= topCurve && y <= botCut) garmentLayers.torsoBraga[idx] = (y - topCurve < 2.4 || botCut - y < 2.3) ? (nx < 0.2 ? PAL.whitePure : PAL.whiteShadow) : shadeMaterial3D(x, y, nx, ny, nz, 'latex', 0, 0.45);
          if (isFront && Math.abs(y - (S.waistBandTopY + 14)) <= 1.8 && ax <= 4 && (ax <= 1.5 || Math.abs(y - (S.waistBandTopY + 14)) <= 0.9)) garmentLayers.torsoBraga[idx] = PAL.whitePure;
        }

        // Sostén straps & back clasp
        if (isSide) {
          if (y >= 92 && y <= 122 && Math.abs(x - (SX - 2)) <= 1.8) garmentLayers.torsoSosten[idx] = PAL.latexDeep;
          if (y >= 132 && y <= 145 && x >= SX - 18) garmentLayers.torsoSosten[idx] = (y <= 133 || y >= 144) ? PAL.whiteShadow : shadeMaterial3D(x, y, nx, ny, nz, 'latex', 0, 0.42);
        } else if (y >= S.shoulderY - 2 && y <= S.bustCenterY + 14) {
          const sPos = isFront ? lerp(20, 23, clamp((y - S.shoulderY) / 26, 0, 1)) : lerp(19, 17, clamp((y - S.shoulderY) / 36, 0, 1));
          if (y >= S.shoulderY && y <= (isFront ? S.bustTopY + 16 : S.bustCenterY - 2) && Math.abs(ax - sPos) <= 1.5) garmentLayers.torsoSosten[idx] = PAL.latexDeep;
          if (!isFront && y >= S.bustCenterY - 4 && y <= S.bustCenterY + 9 && ax < 36) {
            if (ax <= 2.2 && y >= S.bustCenterY - 1 && y <= S.bustCenterY + 6) garmentLayers.torsoSosten[idx] = Math.abs(y - (S.bustCenterY + 2.5)) < 1 ? PAL.silverHi : PAL.silverMid;
            else garmentLayers.torsoSosten[idx] = (y === Math.round(S.bustCenterY - 4) || y === Math.round(S.bustCenterY + 9)) ? PAL.whiteShadow : shadeMaterial3D(x, y, nx, ny, nz, 'latex', 0, 0.42);
          }
        }
      }
    }
    applyOutline(garmentLayers.torsoBody, PAL.outline, 18, Math.floor(S.neckTopY - 4), W - 19, H - 1);

    // 3. Dedicated Articulated Arms (Left & Right in front/back; Front Arm in side)
    if (isSide) {
      for (let y = 84; y <= 244; y++) {
        const row = y * W;
        for (let x = SX - 48; x <= SX + 26; x++) {
          const idx = row + x;
          if (masks.claws[idx]) { garmentLayers.frontArmBody[idx] = ((x + y) & 3) === 0 ? PAL.clawHi : PAL.claw; continue; }
          if (masks.arms[idx]) garmentLayers.frontArmBody[idx] = shadeMaterial3D(x, y, masks.armNorm.nx[idx], masks.armNorm.ny[idx], masks.armNorm.nz[idx], 'skin', 0, 0.25);
        }
      }
      applyOutline(garmentLayers.frontArmBody, PAL.outline, SX - 50, 82, SX + 28, 246);
    } else {
      for (const side of [-1, 1] as const) {
        const armMask = side === -1 ? masks.armL : masks.armR;
        const clawMask = side === -1 ? masks.clawsL : masks.clawsR;
        const armNorm = side === -1 ? masks.armLNorm : masks.armRNorm;
        const armBuf = side === -1 ? garmentLayers.armLBody : garmentLayers.armRBody;
        const xMin = side === -1 ? 20 : CX + 18;
        const xMax = side === -1 ? CX - 18 : W - 20;
        for (let y = 86; y <= 228; y++) {
          const row = y * W;
          for (let x = xMin; x <= xMax; x++) {
            const idx = row + x;
            if (clawMask[idx]) { armBuf[idx] = ((x + y) & 3) === 0 ? PAL.clawHi : PAL.claw; continue; }
            if (armMask[idx]) armBuf[idx] = shadeMaterial3D(x, y, armNorm.nx[idx], armNorm.ny[idx], armNorm.nz[idx], 'skin', 0, 0.25);
          }
        }
        applyOutline(armBuf, PAL.outline, xMin - 2, 84, xMax + 2, 230);
      }
    }

    // 4. Soft Domains (Bust / Glutes) Base Skin + Lingerie
    if (isFront) {
      const y0 = Math.floor(S.bustTopY - 4), y1 = Math.ceil(S.bustBotY + 8), x0 = Math.floor(CX - S.bustCenterX - S.bustRx - 6), x1 = Math.ceil(CX + S.bustCenterX + S.bustRx + 6);
      for (let y = y0; y <= y1; y++) {
        const row = y * W;
        for (let x = x0; x <= x1; x++) {
          const idx = row + x; if (!masks.softDom[idx]) continue;
          const s = x < CX ? -1 : 1, bx = CX + s * S.bustCenterX, u = clamp((x - bx) / S.bustRx, -.96, .96), v = clamp((y - S.bustCenterY) / S.bustRy, -.96, .96);
          const r2 = Math.min(.95, u * u + v * v), nz = Math.sqrt(1 - r2), cleft = smoothstep(6.0, 0, Math.abs(x - CX)) * 0.36;
          garmentLayers.softBody[idx] = shadeMaterial3D(x, y, u, v, nz, 'skin', cleft + (v > .56 ? .22 : 0), 0.28);
          const cupTopV = -.44 + Math.pow(Math.abs(u - s * .05), 1.6) * .38 + smoothstep(13, 0, Math.abs(x - CX)) * .44;
          if (v >= cupTopV) garmentLayers.softSosten[idx] = (v - cupTopV < .088 || (r2 > .84 && v > .35)) ? (u < .2 ? PAL.whitePure : PAL.whiteShadow) : shadeMaterial3D(x, y, u, v, nz, 'latex', cleft, .62);
          if (Math.abs(x - CX) <= 4 && Math.abs(y - (S.bustCenterY + 6)) <= 2 && (Math.abs(x - CX) <= 1.4 || Math.abs(y - (S.bustCenterY + 6)) <= .9)) garmentLayers.softSosten[idx] = PAL.whitePure;
        }
      }
      applyOutline(garmentLayers.softBody, PAL.outline, x0 - 2, y0 - 2, x1 + 2, y1 + 2);
      applyOutline(garmentLayers.softSosten, PAL.outline, x0 - 2, y0 - 2, x1 + 2, y1 + 2);
    } else if (isSide) {
      const sideBust = masks.softSideBust;
      const sideGlute = masks.softSideGlute;
      if (sideBust) {
        for (let y = 92; y <= 178; y++) {
          const row = y * W;
          for (let x = SX - 86; x <= SX - 4; x++) {
            const idx = row + x; if (!sideBust[idx]) continue;
            const u = clamp((x - S.sideBustX) / S.sideBustRx, -.96, .96), v = clamp((y - S.sideBustY) / S.sideBustRy, -.96, .96), nz = Math.sqrt(1 - Math.min(.95, u * u + v * v));
            garmentLayers.softBody[idx] = shadeMaterial3D(x, y, u, v, nz, 'skin', v > .58 ? .24 : 0, 0.28);
            const cupTopV = -.35 + u * .25;
            if (v >= cupTopV) garmentLayers.softSosten[idx] = (v - cupTopV < .085) ? PAL.whitePure : shadeMaterial3D(x, y, u, v, nz, 'latex', 0, .65);
          }
        }
      }
      if (sideGlute) {
        for (let y = 160; y <= 236; y++) {
          const row = y * W;
          for (let x = SX; x <= SX + 62; x++) {
            const idx = row + x; if (!sideGlute[idx]) continue;
            const u = clamp((x - S.sideGluteX) / S.sideGluteRx, -.96, .96), v = clamp((y - S.sideGluteY) / S.sideGluteRy, -.96, .96), nz = Math.sqrt(1 - Math.min(.95, u * u + v * v));
            garmentLayers.softBody[idx] = shadeMaterial3D(x, y, u, v, nz, 'skin', v > .56 ? .25 : 0, 0.28);
            const topP = 172 - (x - SX) * .06, botP = 220 - Math.max(0, x - SX - 24) * .45;
            if (y >= topP && y <= botP) garmentLayers.softBraga[idx] = (y - topP < 2.4 || botP - y < 2.4) ? PAL.whitePure : shadeMaterial3D(x, y, u, v, nz, 'latex', 0, .58);
          }
        }
      }
      applyOutline(garmentLayers.softBody, PAL.outline, SX - 88, 90, SX + 64, 238);
      applyOutline(garmentLayers.softSosten, PAL.outline, SX - 88, 90, SX, 180);
    } else {
      const y0 = Math.floor(S.gluteCenterY - S.gluteRy - 4), y1 = Math.ceil(S.gluteCenterY + S.gluteRy + 6), x0 = Math.floor(CX - S.gluteCenterX - S.gluteRx - 6), x1 = Math.ceil(CX + S.gluteCenterX + S.gluteRx + 6);
      for (let y = y0; y <= y1; y++) {
        const row = y * W;
        for (let x = x0; x <= x1; x++) {
          const idx = row + x; if (!masks.softDom[idx]) continue;
          const s = x < CX ? -1 : 1, gx = CX + s * S.gluteCenterX, u = clamp((x - gx) / S.gluteRx, -.96, .96), v = clamp((y - S.gluteCenterY) / S.gluteRy, -.96, .96);
          const nz = Math.sqrt(1 - Math.min(.95, u * u + v * v)), ax = Math.abs(x - CX), cleft = smoothstep(8, 0, ax) * smoothstep(-.68, .28, v) * .48;
          garmentLayers.softBody[idx] = shadeMaterial3D(x, y, u, v, nz, 'skin', cleft + (v > .54 ? .22 : 0), 0.28);
          if (y >= S.gluteCenterY + 6 && Math.abs(ax - 22) <= 1.35) garmentLayers.softMedias[idx] = PAL.latexDeep;
          const topCut = (S.gluteCenterY - S.gluteRy + 6) + ax * .07, botCut = (S.gluteCenterY + 20) - Math.pow(ax / 42, 1.45) * 30 + smoothstep(15, 0, ax) * 7;
          if (y >= topCut && y <= botCut) garmentLayers.softBraga[idx] = (y - topCut < 2.2 || botCut - y < 2.2) ? (u < .2 ? PAL.whitePure : PAL.whiteShadow) : shadeMaterial3D(x, y, u, v, nz, 'latex', cleft * .85, .58);
        }
      }
      applyOutline(garmentLayers.softBody, PAL.outline, x0 - 2, y0 - 2, x1 + 2, y1 + 2);
      for (let y = Math.floor(S.bustTopY); y <= Math.ceil(S.bustBotY + 6); y++) {
        const row = y * W;
        for (let x = CX - 58; x <= CX + 58; x++) {
          const idx = row + x; if (!masks.peekDom[idx] || Math.abs(x - CX) < 20) continue;
          const s = x < CX ? -1 : 1, u = clamp((x - (CX + s * 35)) / 17, -.95, .95), v = clamp((y - S.bustCenterY) / 28, -.95, .95), nz = Math.sqrt(Math.max(.05, 1 - Math.min(.95, u * u + v * v)));
          garmentLayers.peekBody[idx] = shadeMaterial3D(x, y, u, v, nz, 'skin', .22, 0.20);
          if (y >= S.bustCenterY - 12) garmentLayers.peekSosten[idx] = y <= S.bustCenterY - 9 ? PAL.whiteShadow : shadeMaterial3D(x, y, u, v, nz, 'latex', .24, .32);
        }
      }
      applyOutline(garmentLayers.peekBody, PAL.outline, CX - 60, Math.floor(S.bustTopY) - 2, CX + 60, Math.ceil(S.bustBotY) + 8);
    }
  }

  function buildSuitLayer(view: AvatarView, suit: AvatarSuit, zipPct: number): void {
    const clearKeys = ['torsoTraje', 'armLTraje', 'armRTraje', 'frontArmTraje', 'softTraje', 'peekTraje', 'skirtCloth', 'headAcc'] as const;
    for (const k of clearKeys) garmentLayers[k].fill(0);
    if (suit === 'none') return;
    const S = SKEL, isFront = view === 'front', isSide = view === 'side';
    const isOrig = suit === 'original', isMaid = suit === 'maid', isMarfil = suit === 'marfil';
    const mat: MaterialKind = isMarfil ? 'ivory' : isMaid ? 'velvet' : 'latex';
    const bandHi = isMarfil ? PAL.goldHi : PAL.whitePure, bandSh = isMarfil ? PAL.goldMid : PAL.whiteShadow, xColor = isMarfil ? PAL.goldHi : PAL.whitePure;
    const zipLight = isMarfil ? PAL.goldHi : PAL.silverHi, zipMid = isMarfil ? PAL.goldMid : PAL.silverMid, zipDark = isMarfil ? PAL.goldDark : PAL.silverDark;
    const suitTorsoMask = u8(), zipTipY = S.neckMidY + 5 + (zipPct / 100) * (S.waistY - S.neckMidY - 5);

    // 1. Torso & Legs Suit Layer (clean deep obsidian latex, NO chrome leg/back stripes!)
    for (let y = Math.floor(S.neckTopY); y < H; y++) {
      const row = y * W, openHalf = isFront ? getZipperOpeningHalfWidth(y, zipPct) : 0;
      for (let x = 20; x < W - 20; x++) {
        const idx = row + x;
        if (!masks.torsoLegs[idx]) continue;
        const ax = Math.abs(x - CX);
        if (isFront && openHalf > 0.5 && ax < openHalf && y <= S.waistY + 6) continue;
        const nx = masks.torsoNorm.nx[idx], ny = masks.torsoNorm.ny[idx], nz = masks.torsoNorm.nz[idx];

        if (isMaid && y > (isSide ? 222 : S.crotchY + 4)) {
          const maidTop = isSide ? (236 + (x - SX) * 0.25) : (S.thighBandY + 12);
          if (y >= maidTop) {
            garmentLayers.torsoTraje[idx] = y < maidTop + 6 + Math.sin(x * 0.72) * 1.8
              ? (((x & 3) === 0) ? PAL.whiteShadow : (nx < 0.25 ? PAL.whitePure : PAL.whiteShadow))
              : shadeMaterial3D(x, y, nx, ny, nz, 'velvet', 0, 0.25);
            suitTorsoMask[idx] = 1;
          }
          continue;
        }

        suitTorsoMask[idx] = 1;
        // Subtle anatomical shadows on pelvis & back spine/shoulder-blades
        let extraSh = (isFront && y >= S.waistBandBotY - 2 && y <= S.crotchY + 5 && ax < 18) ? 0.24 : 0;
        if (!isFront && !isSide && y > S.shoulderY + 4 && y < S.waistY) {
          // Subtle sculpted spine furrow & waist shadow matching 3D back reference
          if (ax <= 2.2) extraSh = Math.max(extraSh, 0.22 * (1 - ax / 2.4));
          else if (ax >= 12 && ax <= 20 && y < S.shoulderY + 34) extraSh = Math.max(extraSh, 0.08);
        }
        // Restrained specular on limbs/back (0.34 instead of 0.92!) for sleek satin latex
        let col = shadeMaterial3D(x, y, nx, ny, nz, mat, extraSh, isOrig ? 0.34 : 0.45);
        const lit = nx < 0.28;

        // Collar / Neckband (with 3D back V-collar detail!)
        if (y <= S.neckBotY + 2 && (!isSide ? ax < 16 : Math.abs(x - SX) < 16)) {
          if (isMaid) col = (y >= S.neckBotY - 1 || ((x + (y & 1)) & 3) < 2) ? PAL.whitePure : PAL.whiteShadow;
          else if (isMarfil && y >= S.neckMidY - 1 && y <= S.neckBotY - 1) col = (!isSide && ax < 3 && y === Math.round(S.neckMidY + 2)) ? PAL.lilacTrim : (lit ? PAL.goldHi : PAL.goldMid);
          else if (!isFront && !isSide) {
            // Iconic black-and-white V-shaped back collar on nape
            const vDip = Math.max(0, 4.5 - ax * 0.55);
            col = (y >= S.neckMidY + vDip - 1 && y <= S.neckBotY - 1 + vDip * 0.5) ? (lit ? bandHi : bandSh) : PAL.latexDeep;
          } else {
            col = (y >= S.neckMidY - 1 && y <= S.neckBotY - 2) ? (lit ? bandHi : bandSh) : PAL.latexDeep;
          }
        }

        if (isSide) {
          if (isOrig || isMarfil) {
            const wTop = 171 - (x - SX) * 0.34, wBot = wTop + 15, thTop = 231 + (x - SX) * 0.28, thBot = thTop + 16.5;
            if (y >= wTop && y <= wBot && y >= 154 && y <= 194) col = (y - wTop < 1.2 || wBot - y < 1.2) ? (isMarfil ? PAL.goldDark : PAL.latexDeep) : (lit ? bandHi : bandSh);
            if (y >= thTop && y <= thBot && y >= 218 && y <= 262) col = (y - thTop < 1.2 || thBot - y < 1.2) ? (isMarfil ? PAL.goldDark : PAL.latexDeep) : (lit ? bandHi : bandSh);
            if (y >= S.ankleBandY - 3 && y <= S.ankleBandY + 5) col = lit ? bandHi : bandSh;
          } else if (isMaid) { const bt = 169 - (x - SX) * 0.25; if (y >= bt && y <= bt + 8) col = PAL.whitePure; }
        } else if (isOrig) {
          // Organic curved pelvic U-band matching 3D front & back
          const uCurve = isFront
            ? (1 - Math.pow(clamp(ax / 46, 0, 1), 1.65)) * 15
            : (1 - Math.pow(clamp(ax / 46, 0, 1), 1.85)) * 4;
          const bandTop = S.waistBandTopY + uCurve * 0.42;
          const bandBot = S.waistBandTopY + 13.0 + uCurve;
          if (y >= bandTop && y <= bandBot && ax < 48) {
            col = (y - bandTop < 1.1 || bandBot - y < 1.1) ? PAL.latexDeep : (lit ? bandHi : bandSh);
            if (isFront && ax <= 2.2 && y <= bandTop + 7.2) col = PAL.latexDeep;
          }
          const thY = isFront ? S.thighBandY : S.thighBandY + 12, thArch = Math.pow(ax / 56, 2) * 4.2;
          if (y >= thY - thArch && y <= thY + S.thighBandH - thArch) col = (y - (thY - thArch) < 1.1 || (thY + S.thighBandH - thArch) - y < 1.1) ? PAL.latexDeep : (lit ? bandHi : bandSh);
          if (y >= S.ankleBandY - 3.5 && y <= S.ankleBandY + 4.5) col = lit ? bandHi : bandSh;
        } else if (isMaid) {
          if (isFront && y >= S.neckBotY && y <= S.waistY + 6 && ax < 14) col = (Math.abs(((y - S.neckBotY) % 10) - 5) < 1.2 && ax < 9) ? PAL.velvetDeep : (lit ? PAL.whitePure : PAL.whiteShadow);
          const bt = S.waistY - 3 + (1 - clamp(ax / 34, 0, 1)) * 4;
          if (y >= bt && y <= bt + 8 && ax < 38) col = (y <= bt + 1 || y >= bt + 7) ? PAL.whiteShadow : PAL.whitePure;
        } else if (isMarfil) {
          const uCurve = (1 - Math.pow(clamp(ax / 44, 0, 1), 1.75)) * 11, bandTop = S.waistBandTopY + uCurve * .55, bandBot = S.waistBandTopY + 11.5 + uCurve;
          if (y >= bandTop && y <= bandBot && ax < 48) col = (y - bandTop < 2.2 || bandBot - y < 2.2) ? (lit ? PAL.goldHi : PAL.goldMid) : PAL.silkSheen;
          const thY = isFront ? S.thighBandY : S.thighBandY + 10, thArch = Math.pow(ax / 56, 2) * 3.8;
          if (y >= thY - thArch && y <= thY + 11 - thArch) col = (y - (thY - thArch) < 2 || (thY + 11 - thArch) - y < 2) ? (lit ? PAL.goldHi : PAL.goldMid) : PAL.champagne;
          if (y >= S.ankleBandY - 3 && y <= S.ankleBandY + 4) col = lit ? PAL.goldHi : PAL.goldMid;
        }

        // Sleeker fine metallic front zipper on torso
        if (isFront && y >= S.neckMidY - 1 && y <= S.waistBandTopY + 10) {
          if (openHalf <= 0.5 && ax <= 1.65) col = (((y + (x & 1)) & 1) === 0) ? zipLight : zipDark;
          else if (openHalf > 0.5 && Math.abs(ax - openHalf) <= 1.55 && y <= zipTipY + 2) col = ((y & 1) === 0) ? zipLight : zipDark;
          if (Math.abs(y - zipTipY) <= 3.0 && ax <= 2.9) {
            const ring = Math.hypot(ax, y - (zipTipY + 1.0));
            col = (ring >= 1.1 && ring <= 2.6) ? zipLight : (ax <= 1.0 ? zipDark : zipMid);
          }
        }
        garmentLayers.torsoTraje[idx] = col;
      }
    }

    // Subtle knee specular accent matching 3D knees
    if (isOrig && (isFront || isSide)) {
      stampBezierColor(garmentLayers.torsoTraje, suitTorsoMask, PAL.latexSpec1, (c) => {
        if (isFront) { for (const s of [-1, 1]) { c.beginPath(); c.ellipse(CX + s * (S.kneeCenterX - 1.0), S.kneeY - 2, 2.8, 4.6, 0, 0, Math.PI * 2); c.fill(); } }
        else { c.beginPath(); c.ellipse(SX - 18, 279, 2.4, 4.2, -0.1, 0, Math.PI * 2); c.fill(); }
      });
      stampBezierColor(garmentLayers.torsoTraje, suitTorsoMask, PAL.latexSpec2, (c) => {
        if (isFront) { for (const s of [-1, 1]) { c.beginPath(); c.ellipse(CX + s * (S.kneeCenterX - 1.5), S.kneeY - 3, 1.2, 2.0, 0, 0, Math.PI * 2); c.fill(); } }
        else { c.beginPath(); c.ellipse(SX - 19, 278, 1.0, 1.8, 0, 0, Math.PI * 2); c.fill(); }
      });
    }

    if (isMaid && isFront) {
      stampBezierColor(garmentLayers.torsoTraje, null, PAL.ribbonBase, (c) => {
        c.beginPath(); c.ellipse(CX - 7, S.neckBotY + 3, 6.5, 4, -.25, 0, Math.PI * 2); c.ellipse(CX + 7, S.neckBotY + 3, 6.5, 4, .25, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(CX - 2, S.neckBotY + 5); c.lineTo(CX - 8, S.neckBotY + 14); c.lineTo(CX - 3, S.neckBotY + 14); c.closePath();
        c.moveTo(CX + 2, S.neckBotY + 5); c.lineTo(CX + 8, S.neckBotY + 14); c.lineTo(CX + 3, S.neckBotY + 14); c.closePath(); c.fill();
      });
      stampBezierColor(garmentLayers.torsoTraje, null, PAL.ribbonHi, (c) => { c.beginPath(); c.arc(CX, S.neckBotY + 3, 2.4, 0, Math.PI * 2); c.fill(); });
    }

    if (isFront && (isOrig || isMarfil)) {
      stampBezierColor(garmentLayers.torsoTraje, suitTorsoMask, xColor, (c) => {
        for (const s of [-1, 1]) traceSharpCurvedX(c, CX + s * 37.5, S.hipPeakY - 2.5, 9.0, 11.4, s * 1.1, 0.5, 1.25);
      });
    }

    // 2. Articulated Arms Suit Layer (Left & Right separate for front/back!)
    if (!isSide) {
      for (const side of [-1, 1] as const) {
        const armMask = side === -1 ? masks.armL : masks.armR;
        const clawMask = side === -1 ? masks.clawsL : masks.clawsR;
        const armNorm = side === -1 ? masks.armLNorm : masks.armRNorm;
        const armSuitBuf = side === -1 ? garmentLayers.armLTraje : garmentLayers.armRTraje;
        const xMin = side === -1 ? 20 : CX + 18;
        const xMax = side === -1 ? CX - 18 : W - 20;
        for (let y = 86; y <= 228; y++) {
          const row = y * W;
          for (let x = xMin; x <= xMax; x++) {
            const idx = row + x;
            if (!armMask[idx] || clawMask[idx]) continue;
            const ax = Math.abs(x - CX);
            const nx = armNorm.nx[idx], ny = armNorm.ny[idx], nz = armNorm.nz[idx], lit = nx < 0.28;
            let col = shadeMaterial3D(x, y, nx, ny, nz, mat, 0, isOrig ? 0.40 : 0.45);
            const armSlope = (ax - S.shoulderX) * 0.44, biY = S.bicepBandY - armSlope * 0.42, wrY = S.wristBandY - (ax - S.wristX) * 0.44;
            if (isMaid) {
              const puffEnd = S.bicepBandY + 11 - armSlope * 0.4;
              if (y > puffEnd && y < wrY - 8) continue;
              if (Math.abs(y - puffEnd) <= 4.5 || Math.abs(y - (wrY - 2)) <= 6.2) col = Math.sin(x * 0.8 + y * 0.5) > 0 ? PAL.whitePure : PAL.whiteShadow;
            } else if (isMarfil) {
              if (Math.abs(y - biY) <= 4.5 && y < S.elbowY - 12) col = Math.abs(y - biY) < 1.8 ? PAL.goldHi : PAL.goldMid;
              else if (Math.abs(y - wrY) <= 5.2 && y > S.elbowY + 10 && y < S.palmY - 2) col = Math.abs(y - wrY) < 2 ? PAL.goldHi : PAL.goldMid;
            } else {
              if (Math.abs(y - biY) <= 5.8 && y < S.elbowY - 12) col = Math.abs(y - biY) > 4.9 ? PAL.latexDeep : (lit ? bandHi : bandSh);
              else if (Math.abs(y - wrY) <= 6.0 && y > S.elbowY + 10 && y < S.palmY - 2) col = Math.abs(y - wrY) > 5.0 ? PAL.latexDeep : (lit ? bandHi : bandSh);
            }
            armSuitBuf[idx] = col;
          }
        }
        if (!isMaid) {
          stampBezierColor(armSuitBuf, armMask, isMarfil ? PAL.goldHi : PAL.whitePure, (c) => traceFingerTipsWhiteFrontBack(c, side));
          stampBezierColor(armSuitBuf, armMask, xColor, (c) => traceSharpCurvedX(c, CX + side * (S.palmX + 1.5), S.palmY + 0.5, 4.2, 4.5, 0, 0, 0.85));
        } else {
          stampBezierColor(armSuitBuf, armMask, PAL.ribbonBase, (c) => { c.beginPath(); c.ellipse(CX + side * (S.wristX + 2), S.wristBandY + 1, 3.8, 2.2, side * 0.4, 0, Math.PI * 2); c.fill(); });
        }
        applyOutline(armSuitBuf, PAL.outline, xMin - 2, 84, xMax + 2, 230);
      }
    } else {
      const sideArmMask = u8();
      for (let y = 84; y <= 232; y++) {
        const row = y * W;
        for (let x = SX - 46; x <= SX + 24; x++) {
          const idx = row + x; if (!masks.arms[idx] || masks.claws[idx]) continue;
          const nx = masks.armNorm.nx[idx], ny = masks.armNorm.ny[idx], nz = masks.armNorm.nz[idx], lit = nx < 0.28;
          if (isMaid) {
            if (y > 120 && y < 156) continue;
            sideArmMask[idx] = 1;
            garmentLayers.frontArmTraje[idx] = (Math.abs(y - 118) <= 4.5 || Math.abs(y - 160) <= 5.5) ? (Math.sin(x * .8 + y * .5) > 0 ? PAL.whitePure : PAL.whiteShadow) : shadeMaterial3D(x, y, nx, ny, nz, 'velvet', 0, 0.25);
            continue;
          }
          sideArmMask[idx] = 1;
          let col = shadeMaterial3D(x, y, nx, ny, nz, mat, 0, isOrig ? 0.42 : 0.48);
          const biCurve = 98 + Math.pow((x - (SX + 2)) / 14, 2) * 5.5, wrCurve = 158 + (x - (SX - 12)) * 0.14;
          if (y >= biCurve && y <= biCurve + 10.5 && y < 120) col = (y - biCurve < 1 || biCurve + 10.5 - y < 1) ? PAL.latexDeep : (lit ? bandHi : bandSh);
          if (y >= wrCurve && y <= wrCurve + 12.5 && y > 148 && y < 176) col = (y - wrCurve < 1 || wrCurve + 12.5 - y < 1) ? PAL.latexDeep : (lit ? bandHi : bandSh);
          garmentLayers.frontArmTraje[idx] = col;
        }
      }
      if (!isMaid) {
        stampBezierColor(garmentLayers.frontArmTraje, sideArmMask, isMarfil ? PAL.goldHi : PAL.whitePure, traceFingerTipsWhiteSide);
        stampBezierColor(garmentLayers.frontArmTraje, sideArmMask, xColor, (c) => traceSharpCurvedX(c, SX - 18.5, 184, 7.2, 7.6, -0.6, 0.3, 1.15));
        for (const [kx, ky] of [[SX - 28, 194], [SX - 22, 195], [SX - 16, 195], [SX - 10, 194]]) for (let dy = 0; dy <= 3; dy++) if (sideArmMask[(ky + dy) * W + kx]) garmentLayers.frontArmTraje[(ky + dy) * W + kx] = xColor;
      } else {
        stampBezierColor(garmentLayers.frontArmTraje, sideArmMask, PAL.ribbonBase, (c) => { c.beginPath(); c.ellipse(SX - 14, 162, 4.5, 2.5, 0.2, 0, Math.PI * 2); c.fill(); });
      }
      applyOutline(garmentLayers.frontArmTraje, PAL.outline, SX - 48, 84, SX + 26, 236);
    }

    // 3. Soft Bust / Glutes Suit Layer (single sleek sheen, razor-sharp X marks, iconic back stitches!)
    if (isFront) {
      const bustSuitMask = u8(), y0 = Math.floor(S.bustTopY - 4), y1 = Math.ceil(S.bustBotY + 8), x0 = Math.floor(CX - S.bustCenterX - S.bustRx - 6), x1 = Math.ceil(CX + S.bustCenterX + S.bustRx + 6);
      for (let y = y0; y <= y1; y++) {
        const row = y * W, openHalf = getZipperOpeningHalfWidth(y, zipPct);
        for (let x = x0; x <= x1; x++) {
          const idx = row + x; if (!masks.softDom[idx]) continue;
          const ax = Math.abs(x - CX); if (openHalf > 0.5 && ax < openHalf) continue;
          bustSuitMask[idx] = 1;
          const s = x < CX ? -1 : 1, bx = CX + s * S.bustCenterX, u = clamp((x - bx) / S.bustRx, -.96, .96), v = clamp((y - S.bustCenterY) / S.bustRy, -.96, .96);
          const r2 = Math.min(.95, u * u + v * v), nz = Math.sqrt(1 - r2), cleft = smoothstep(5.5, 0, ax) * .36;
          // Sleek single key light (specBoost 0.72 -> classy curved sheen, zero twin circles!)
          let col = shadeMaterial3D(x, y, u, v, nz, mat, cleft + (v > .62 ? .22 : 0), isOrig ? 0.72 : 0.58);
          if (isMaid) {
            const heartTop = -.58 + Math.pow(Math.abs(u), 1.5) * .32 + smoothstep(14, 0, ax) * .28;
            if (v < heartTop) col = ((x + y) & 2) ? PAL.whitePure : PAL.whiteShadow;
            else if (v - heartTop < .11) col = PAL.whitePure;
            else if (ax < 10 && openHalf <= .5) col = Math.abs(((y - S.bustTopY) % 9) - 4.5) < 1.3 ? PAL.ribbonBase : (ax < 6 ? PAL.whitePure : PAL.velvetDeep);
            if (openHalf > .5 && Math.abs(ax - openHalf) < 5 && y <= zipTipY + 2) col = ((y & 3) < 2) ? PAL.whitePure : PAL.whiteShadow;
          } else if (isMarfil) {
            if (r2 > .84 && v > .45) col = PAL.goldMid;
            else if (openHalf > .5 && Math.abs(ax - openHalf) < 4.5 && y <= zipTipY + 2) col = PAL.goldHi;
          }
          garmentLayers.softTraje[idx] = col;
        }
      }
      if (isOrig || isMarfil) {
        // Balanced sleek curved star-X marks matching the 3D front reference (no stray upper spike!)
        stampBezierColor(garmentLayers.softTraje, bustSuitMask, xColor, (c) => {
          for (const s of [-1, 1]) {
            const bx = CX + s * S.bustCenterX, by = S.bustCenterY;
            traceTaperedArc(c, bx - s * 3.0, by + 1.0, bx + s * 13.0, by + 16.5, bx + s * 24.5, by + 28.5, 1.35);
            traceTaperedArc(c, bx + s * 29.0, by + 3.0, bx + s * 17.5, by + 20.5, bx + s * 1.0, by + 32.5, 1.35);
          }
        });
        if (isMarfil) stampBezierColor(garmentLayers.softTraje, bustSuitMask, PAL.lilacTrim, (c) => {
          for (const s of [-1, 1]) { const cxX = CX + s * (S.bustCenterX + 15.0), cyX = S.bustCenterY + 18.0; c.beginPath(); c.moveTo(cxX, cyX - 3.2); c.lineTo(cxX + 2.6, cyX); c.lineTo(cxX, cyX + 3.2); c.lineTo(cxX - 2.6, cyX); c.closePath(); c.fill(); }
        });
      }
      if (isOrig && zipPct < 35) for (const wy of [151, 156, 161, 166]) for (let dx = -8; dx <= 8; dx++) if (Math.abs(dx) >= 3 && bustSuitMask[wy * W + CX + dx]) garmentLayers.softTraje[wy * W + CX + dx] = Math.abs(dx) < 5 ? PAL.latexRim : PAL.latexMid;
      for (let y = y0; y <= y1; y++) {
        const row = y * W, openHalf = getZipperOpeningHalfWidth(y, zipPct);
        for (let x = CX - 26; x <= CX + 26; x++) {
          const idx = row + x; if (!bustSuitMask[idx]) continue;
          const ax = Math.abs(x - CX);
          if (openHalf <= .5) { if (ax <= 1.65) garmentLayers.softTraje[idx] = (((y + (x & 1)) & 1) === 0) ? zipLight : zipDark; }
          else if (Math.abs(ax - openHalf) <= 1.55 && y <= zipTipY + 2) garmentLayers.softTraje[idx] = ((y & 1) === 0) ? zipLight : zipDark;
          else if (y > zipTipY && ax <= 1.65) garmentLayers.softTraje[idx] = (((y + (x & 1)) & 1) === 0) ? zipLight : zipDark;
          if (Math.abs(y - zipTipY) <= 3.1 && ax <= 3.0) { const ring = Math.hypot(ax, y - (zipTipY + 1.0)); garmentLayers.softTraje[idx] = (ring >= 1.1 && ring <= 2.6) ? zipLight : (ax <= 1.0 ? zipDark : zipMid); }
        }
      }
      applyOutline(garmentLayers.softTraje, PAL.outline, x0 - 2, y0 - 2, x1 + 2, y1 + 2);
    } else if (isSide) {
      const sideBustMask = u8();
      const sideBust = masks.softSideBust;
      const sideGlute = masks.softSideGlute;
      if (sideBust) {
        for (let y = 92; y <= 178; y++) {
          const row = y * W;
          for (let x = SX - 86; x <= SX - 4; x++) {
            const idx = row + x; if (!sideBust[idx]) continue;
            sideBustMask[idx] = 1;
            const u = clamp((x - S.sideBustX) / S.sideBustRx, -.96, .96), v = clamp((y - S.sideBustY) / S.sideBustRy, -.96, .96), nz = Math.sqrt(1 - Math.min(.95, u * u + v * v));
            let col = shadeMaterial3D(x, y, u, v, nz, mat, v > .62 ? .22 : 0, isOrig ? 0.72 : 0.58);
            if (isMaid && v < -.52) col = ((x + y) & 2) ? PAL.whitePure : PAL.whiteShadow;
            garmentLayers.softTraje[idx] = col;
          }
        }
      }
      if (isOrig || isMarfil) stampBezierColor(garmentLayers.softTraje, sideBustMask, xColor, (c) => {
        traceTaperedArc(c, SX - 66, 128, SX - 74, 146, SX - 76, 159, 1.3);
        traceTaperedArc(c, SX - 79, 145, SX - 73, 157, SX - 58, 166, 1.2);
      });
      if (!isMaid && sideGlute) {
        const sideGluteMask = u8();
        for (let y = 160; y <= 236; y++) {
          const row = y * W;
          for (let x = SX; x <= SX + 62; x++) {
            const idx = row + x; if (!sideGlute[idx]) continue;
            sideGluteMask[idx] = 1;
            const u = clamp((x - S.sideGluteX) / S.sideGluteRx, -.96, .96), v = clamp((y - S.sideGluteY) / S.sideGluteRy, -.96, .96), nz = Math.sqrt(1 - Math.min(.95, u * u + v * v));
            let col = shadeMaterial3D(x, y, u, v, nz, mat, v > .60 ? .24 : 0, isOrig ? 0.74 : 0.58);
            if (y <= 174 - (x - SX) * .24 && x < SX + 28) col = u < .2 ? bandHi : bandSh;
            garmentLayers.softTraje[idx] = col;
          }
        }
        if (isOrig || isMarfil) stampBezierColor(garmentLayers.softTraje, sideGluteMask, xColor, (c) => {
          traceTaperedArc(c, SX + 46, 186, SX + 54, 198, SX + 53, 212, 1.05);
          traceTaperedArc(c, SX + 55, 193, SX + 52, 204, SX + 43, 214, 0.95);
        });
      }
      applyOutline(garmentLayers.softTraje, PAL.outline, SX - 88, 90, SX + 64, 238);
    } else {
      const gluteSuitMask = u8(), y0 = Math.floor(S.gluteCenterY - S.gluteRy - 4), y1 = Math.ceil(S.gluteCenterY + S.gluteRy + 6), x0 = Math.floor(CX - S.gluteCenterX - S.gluteRx - 6), x1 = Math.ceil(CX + S.gluteCenterX + S.gluteRx + 6);
      if (!isMaid) {
        for (let y = y0; y <= y1; y++) {
          const row = y * W;
          for (let x = x0; x <= x1; x++) {
            const idx = row + x; if (!masks.softDom[idx]) continue;
            gluteSuitMask[idx] = 1;
            const s = x < CX ? -1 : 1, gx = CX + s * S.gluteCenterX, u = clamp((x - gx) / S.gluteRx, -.96, .96), v = clamp((y - S.gluteCenterY) / S.gluteRy, -.96, .96);
            const nz = Math.sqrt(1 - Math.min(.95, u * u + v * v)), ax = Math.abs(x - CX), cleft = smoothstep(8, 0, ax) * smoothstep(-.68, .28, v) * .46;
            let col = shadeMaterial3D(x, y, u, v, nz, mat, cleft + (v > .58 ? .22 : 0), isOrig ? 0.72 : 0.56);
            if (y <= S.waistBandTopY + 13 + (1 - Math.pow(clamp(ax / 44, 0, 1), 1.8)) * 5) col = u < .2 ? bandHi : bandSh;
            garmentLayers.softTraje[idx] = col;
          }
        }
        if (isOrig || isMarfil) {
          // Large razor-sharp curved X marks on each glute matching 3D back photo
          stampBezierColor(garmentLayers.softTraje, gluteSuitMask, xColor, (c) => {
            for (const s of [-1, 1]) traceSharpCurvedX(c, CX + s * (S.gluteCenterX + 1.5), S.gluteCenterY + 3.0, 16.5, 18.5, s * 2.0, 1.2, 1.45);
          });
          // Iconic white vertical seam + 3 horizontal stitches between the glutes!
          for (let y = Math.round(S.waistBandTopY + 15); y <= Math.round(S.gluteCenterY + 11); y++) {
            const idxC = y * W + CX;
            if (gluteSuitMask[idxC]) garmentLayers.softTraje[idxC] = xColor;
          }
          // Tiny top V-gusset flare at waist-to-cleft junction
          for (let dy = 0; dy <= 5; dy++) {
            const y = Math.round(S.waistBandTopY + 14) + dy;
            const spread = Math.round((5 - dy) * 0.9);
            if (gluteSuitMask[y * W + CX - spread]) garmentLayers.softTraje[y * W + CX - spread] = xColor;
            if (gluteSuitMask[y * W + CX + spread]) garmentLayers.softTraje[y * W + CX + spread] = xColor;
          }
          for (const sy of [Math.round(S.gluteCenterY - 9), Math.round(S.gluteCenterY - 2), Math.round(S.gluteCenterY + 5)]) {
            for (let dx = -3; dx <= 3; dx++) {
              const idxS = sy * W + CX + dx;
              if (gluteSuitMask[idxS]) garmentLayers.softTraje[idxS] = xColor;
            }
          }
        }
        applyOutline(garmentLayers.softTraje, PAL.outline, x0 - 2, y0 - 2, x1 + 2, y1 + 2);
      }
      // Subtle dark side-peek of bust on back view (no distracting bright grey spot!)
      for (let y = Math.floor(S.bustTopY); y <= Math.ceil(S.bustBotY + 6); y++) {
        const row = y * W;
        for (let x = CX - 58; x <= CX + 58; x++) {
          const idx = row + x; if (!masks.peekDom[idx] || Math.abs(x - CX) < 20) continue;
          const s = x < CX ? -1 : 1, u = clamp((x - (CX + s * 35)) / 17, -.95, .95), v = clamp((y - S.bustCenterY) / 28, -.95, .95), nz = Math.sqrt(Math.max(.05, 1 - Math.min(.95, u * u + v * v)));
          garmentLayers.peekTraje[idx] = shadeMaterial3D(x, y, u, v, nz, mat, .26, 0.28);
        }
      }
    }

    // 4. Maid Skirt + Headpiece / Marfil Silk Sash + Tiara
    if (isMaid) {
      const skirtTopY = isSide ? 166 : S.waistY + 1, skirtBotY = isSide ? 240 : S.thighBandY + 20;
      const skirtMask = rasterizeBezierMask((c) => {
        c.beginPath();
        if (isSide) {
          c.moveTo(SX - 24, skirtTopY + 4); c.bezierCurveTo(SX - 44, skirtTopY + 24, SX - 48, 214, SX - 42, skirtBotY);
          for (let i = 0; i < 8; i++) { const xA = lerp(SX - 42, SX + 62, i / 8), xB = lerp(SX - 42, SX + 62, (i + 1) / 8); c.quadraticCurveTo((xA + xB) * .5, skirtBotY + ((i & 1) ? 4.5 : -2), xB, skirtBotY - 1); }
          c.bezierCurveTo(SX + 66, 206, SX + 46, skirtTopY + 6, SX + 18, skirtTopY - 4);
        } else {
          c.moveTo(CX - 26, skirtTopY); c.bezierCurveTo(CX - 54, skirtTopY + 14, CX - 68, S.hipPeakY + 18, CX - 65, skirtBotY - 2);
          for (let i = 0; i < 10; i++) { const xA = lerp(CX - 65, CX + 65, i / 10), xB = lerp(CX - 65, CX + 65, (i + 1) / 10); c.quadraticCurveTo((xA + xB) * .5, skirtBotY + ((i & 1) ? 4.5 : -2.2), xB, skirtBotY - 1); }
          c.bezierCurveTo(CX + 68, S.hipPeakY + 18, CX + 54, skirtTopY + 14, CX + 26, skirtTopY);
        }
        c.closePath(); c.fill();
      });
      const sDist = computeEdgeDistance(skirtMask);
      for (let y = Math.floor(skirtTopY - 6); y <= Math.ceil(skirtBotY + 8); y++) {
        const row = y * W, tY = clamp((y - skirtTopY) / Math.max(1, skirtBotY - skirtTopY), 0, 1);
        for (let x = CX - 72; x <= CX + 72; x++) {
          const idx = row + x; if (!skirtMask[idx]) continue;
          const lit = x < CX + 10, pleat = Math.sin((x - CX) * (0.28 - tY * 0.06));
          let col: number = pleat > .35 ? PAL.velvetMid : (pleat < -.45 ? PAL.velvetDeep : PAL.velvetBase);
          if (sDist[idx] <= 3 && !lit) col = PAL.velvetRim;
          if (y >= skirtBotY - 7 + Math.sin(x * .65) * 2.2) col = ((x & 3) === 0 && y < skirtBotY - 3) ? PAL.whiteShadow : (lit ? PAL.whitePure : PAL.whiteShadow);
          if (isFront) {
            const ax = Math.abs(x - CX), apronW = 24 + tY * 18, apBot = skirtBotY - 8 + Math.sin(x * .7) * 2.5;
            if (ax <= apronW && y <= apBot) {
              col = (apronW - ax < 3.6 || apBot - y < 4.2) ? PAL.whitePure : (Math.sin((x - CX) * .42) < -.55 ? PAL.whiteShadow : PAL.whitePure);
              if (Math.abs(ax - 17) <= 3.5 && Math.abs(y - (S.hipPeakY + 4)) <= 2.2) col = PAL.ribbonBase;
            }
          } else if (isSide && x < SX - 12 && y <= skirtBotY - 6) col = Math.sin(x * .45) < -.45 ? PAL.whiteShadow : PAL.whitePure;
          garmentLayers.skirtCloth[idx] = col;
        }
      }
      if (!isFront) {
        const bowMask = rasterizeBezierMask((c) => {
          if (isSide) {
            c.beginPath(); c.ellipse(SX + 36, 174, 15, 11, -.35, 0, Math.PI * 2); c.fill();
            c.beginPath(); c.moveTo(SX + 28, 178); c.quadraticCurveTo(SX + 54, 198, SX + 62, 224); c.lineTo(SX + 48, 226); c.quadraticCurveTo(SX + 40, 202, SX + 24, 180); c.closePath(); c.fill();
          } else {
            c.beginPath(); c.ellipse(CX - 18, S.waistY + 10, 16, 10, -.22, 0, Math.PI * 2); c.ellipse(CX + 18, S.waistY + 10, 16, 10, .22, 0, Math.PI * 2); c.fill();
            c.beginPath(); c.moveTo(CX - 5, S.waistY + 14); c.quadraticCurveTo(CX - 18, S.hipPeakY + 12, CX - 24, skirtBotY + 2); c.lineTo(CX - 11, skirtBotY - 2); c.quadraticCurveTo(CX - 7, S.hipPeakY + 8, CX - 1, S.waistY + 15); c.closePath(); c.fill();
            c.beginPath(); c.moveTo(CX + 5, S.waistY + 14); c.quadraticCurveTo(CX + 18, S.hipPeakY + 12, CX + 24, skirtBotY + 2); c.lineTo(CX + 11, skirtBotY - 2); c.quadraticCurveTo(CX + 7, S.hipPeakY + 8, CX + 1, S.waistY + 15); c.closePath(); c.fill();
            c.beginPath(); c.ellipse(CX, S.waistY + 10, 6.5, 6.2, 0, 0, Math.PI * 2); c.fill();
          }
        });
        for (let y = 158; y <= Math.ceil(skirtBotY + 6); y++) for (let x = CX - 42; x <= CX + 68; x++) if (bowMask[y * W + x]) garmentLayers.skirtCloth[y * W + x] = (y < 204 && x < CX + 50) ? PAL.whitePure : PAL.whiteShadow;
      }
      applyOutline(garmentLayers.skirtCloth, PAL.outline, CX - 72, Math.floor(skirtTopY - 8), CX + 72, Math.ceil(skirtBotY + 8));

      const hx = isSide ? SX - 8 : CX, hy = isSide ? 48 : S.headTopY + 14;
      const headMask = rasterizeBezierMask((c) => {
        c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.arc(hx, hy, 25, Math.PI * 1.12, Math.PI * 1.88); c.stroke();
        for (let a = 1.15; a <= 1.86; a += 0.12) { c.beginPath(); c.arc(hx + Math.cos(a * Math.PI) * 28.5, hy + Math.sin(a * Math.PI) * 28.5, 3.4, 0, Math.PI * 2); c.fill(); }
      });
      for (let i = 0; i < PIXEL_COUNT; i++) if (headMask[i]) {
        const x = i % W, y = (i / W) | 0;
        garmentLayers.headAcc[i] = Math.hypot(x - hx, y - hy) < 23.5 ? PAL.velvetDeep : (x < hx + 6 ? PAL.whitePure : PAL.whiteShadow);
      }
      stampBezierColor(garmentLayers.headAcc, null, PAL.ribbonBase, (c) => { c.beginPath(); c.ellipse(hx - 23, hy - 8, 4.5, 2.8, -.5, 0, Math.PI * 2); c.ellipse(hx + 23, hy - 8, 4.5, 2.8, .5, 0, Math.PI * 2); c.fill(); });
      applyOutline(garmentLayers.headAcc, PAL.outline, hx - 42, 12, hx + 42, hy + 8);
    } else if (isMarfil) {
      const sashTopY = isSide ? 168 : S.waistY + 2, sashBotY = S.kneeY - 6;
      const sashMask = rasterizeBezierMask((c) => {
        if (isSide) {
          c.beginPath(); c.moveTo(SX - 6, sashTopY + 4); c.bezierCurveTo(SX + 34, sashTopY + 14, SX + 62, 210, SX + 50, sashBotY - 10);
          c.quadraticCurveTo(SX + 40, sashBotY + 2, SX + 32, sashBotY - 8); c.bezierCurveTo(SX + 36, 224, SX + 26, 198, SX - 10, sashTopY + 14); c.closePath(); c.fill();
        } else {
          for (const s of [-1, 1]) {
            c.beginPath(); c.moveTo(CX + s * 14, sashTopY + 6); c.bezierCurveTo(CX + s * 48, sashTopY + 14, CX + s * 65, S.hipPeakY + 16, CX + s * 58, sashBotY - 12);
            c.quadraticCurveTo(CX + s * 52, sashBotY + 2, CX + s * 42, sashBotY - 6); c.bezierCurveTo(CX + s * 46, S.thighBandY + 4, CX + s * 40, S.hipPeakY - 4, CX + s * 8, sashTopY + 14); c.closePath(); c.fill();
          }
          c.beginPath(); c.ellipse(CX, sashTopY + 10, 8, 5, 0, 0, Math.PI * 2); c.fill();
        }
      });
      const saDist = computeEdgeDistance(sashMask);
      for (let y = Math.floor(sashTopY); y <= Math.ceil(sashBotY + 4); y++) for (let x = CX - 68; x <= CX + 68; x++) {
        const idx = y * W + x; if (!sashMask[idx]) continue;
        let col: number = saDist[idx] <= 3 ? PAL.goldMid : (Math.sin(y * .24 + (x - CX) * .14) > .35 ? PAL.ivoryHi : PAL.silkSheen);
        if (saDist[idx] <= 2 && x < CX + 12) col = PAL.goldHi;
        if (!isSide && Math.hypot(x - CX, y - (sashTopY + 10)) < 4) col = Math.hypot(x - CX, y - (sashTopY + 10)) < 2.2 ? PAL.lilacTrim : PAL.goldHi;
        garmentLayers.skirtCloth[idx] = col;
      }
      applyOutline(garmentLayers.skirtCloth, PAL.outlineSoft, CX - 70, Math.floor(sashTopY - 2), CX + 70, Math.ceil(sashBotY + 6));
      const tx = isSide ? SX - 10 : CX;
      stampBezierColor(garmentLayers.headAcc, null, PAL.goldHi, (c) => { c.beginPath(); c.moveTo(tx - 18, S.headTopY + 3); c.quadraticCurveTo(tx - 6, S.headTopY - 9, tx + 6, S.headTopY - 1); c.quadraticCurveTo(tx - 6, S.headTopY - 2, tx - 18, S.headTopY + 3); c.fill(); });
      stampBezierColor(garmentLayers.headAcc, null, PAL.lilacTrim, (c) => { c.beginPath(); c.arc(tx - 6, S.headTopY - 3, 2.4, 0, Math.PI * 2); c.fill(); });
      applyOutline(garmentLayers.headAcc, PAL.outline, tx - 26, Math.floor(S.headTopY - 15), tx + 16, Math.ceil(S.headTopY + 12));
    }
  }

  // ---- CABELLO CEBRA ESCULTÓRICO REFINADO (CURVO Y FIEL AL 3D) ----
  function paintHairChunk(
    mask: Uint8Array,
    zoneId: number,
    stripeFn: ((x: number, y: number) => boolean) | null,
    weightArr: Float32Array | null,
    weightFn: ((x: number, y: number) => number) | null,
  ): void {
    hairChunkBuf.fill(0);
    const dist = computeEdgeDistance(mask), yMax = Math.ceil(SKEL.chinY + 16);
    for (let y = 1; y <= yMax; y++) {
      const row = y * W;
      for (let x = CX - 66; x <= CX + 66; x++) {
        const idx = row + x; if (!mask[idx]) continue;
        hairChunkBuf[idx] = (stripeFn && stripeFn(x, y))
          ? ((dist[idx] <= 3 && x < CX + 14) ? PAL.hairBlackHi : PAL.hairBlack)
          : ((dist[idx] <= 3 && x > CX - 2) ? PAL.whiteShadow : PAL.whitePure);
      }
    }
    applyOutline(hairChunkBuf, PAL.outline, CX - 66, 1, CX + 66, yMax);
    for (let y = 1; y <= yMax; y++) {
      const row = y * W;
      for (let x = CX - 66; x <= CX + 66; x++) {
        const idx = row + x;
        if (hairChunkBuf[idx] !== 0) {
          planes.hairRGBA[idx] = hairChunkBuf[idx]; planes.hairZone[idx] = zoneId;
          if (weightArr) weightArr[idx] = weightFn ? weightFn(x, y) : 0.75;
        }
      }
    }
  }

  function buildHairLayer(view: AvatarView): void {
    planes.hairRGBA.fill(0); planes.hairZone.fill(0);
    planes.hairWeightTop.fill(0); planes.hairWeightBangs.fill(0); planes.hairWeightCurl.fill(0); planes.hairWeightBot.fill(0);
    const S = SKEL;

    if (view === 'front') {
      // Sweeping lush asymmetrical white crown with 3 sharp curved horns + wispy lower tips
      const backSpikes = rasterizeBezierMask((c) => {
        c.beginPath(); c.moveTo(CX - 34, S.cheekY + 4);
        c.bezierCurveTo(CX - 44, S.headTopY + 14, CX - 38, S.headTopY - 10, CX - 16, S.headTopY - 14);
        // Main center-left tall peak
        c.quadraticCurveTo(CX - 10, 15, CX - 6, 4);
        c.quadraticCurveTo(CX + 5, 13, CX + 10, 26);
        // Second upper-right peak
        c.quadraticCurveTo(CX + 17, 17, CX + 22, 13);
        c.quadraticCurveTo(CX + 31, 22, CX + 34, 37);
        // Third outer-right peak
        c.quadraticCurveTo(CX + 43, 35, CX + 45, 45);
        c.quadraticCurveTo(CX + 41, 58, CX + 33, 64);
        // Lower spiky wisps framing right jaw
        c.quadraticCurveTo(CX + 41, 66, CX + 42, 70);
        c.quadraticCurveTo(CX + 35, 75, CX + 31, 76);
        c.quadraticCurveTo(CX + 38, 79, CX + 37, 83);
        c.quadraticCurveTo(CX + 24, 90, CX + 14, 84);
        c.lineTo(CX + 16, S.headCenterY);
        c.quadraticCurveTo(CX, S.headTopY + 6, CX - 20, S.headCenterY);
        c.lineTo(CX - 18, 85);
        c.quadraticCurveTo(CX - 30, 89, CX - 38, 79);
        c.closePath(); c.fill();
      });
      const faceCut = rasterizeBezierMask((c) => { c.beginPath(); c.ellipse(CX, S.headCenterY + 1, S.headRx - 1.5, S.headRy - 2, 0, 0, Math.PI * 2); c.fill(); });
      for (let i = 0; i < PIXEL_COUNT; i++) if (faceCut[i]) backSpikes[i] = 0;
      paintHairChunk(
        backSpikes,
        5,
        (x, y) => {
          // Curved conical black bands near each sharp spike tip (matching 3D!)
          const tip1 = y >= 9 + Math.abs(x - (CX - 6)) * 0.22 && y <= 16 + Math.abs(x - (CX - 6)) * 0.12 && x >= CX - 14 && x <= CX + 5;
          const tip2 = y >= 18 + Math.abs(x - (CX + 21)) * 0.25 && y <= 25 + Math.abs(x - (CX + 21)) * 0.14 && x >= CX + 13 && x <= CX + 31;
          const tip3 = y >= 40 + (x - (CX + 38)) * 0.2 && y <= 47 + (x - (CX + 38)) * 0.15 && x >= CX + 34;
          const wisp1 = y >= 67 && y <= 72 && x >= CX + 29;
          const wisp2 = y >= 78 && y <= 82 && x >= CX + 26;
          return tip1 || tip2 || tip3 || wisp1 || wisp2;
        },
        planes.hairWeightTop,
        (_x, y) => smoothstep(S.chinY, 4, y) * .92,
      );

      // Left striped cheek curl (diagonal flowing zebra bands)
      const leftCurl = rasterizeBezierMask((c) => {
        c.beginPath(); c.moveTo(CX - 28, 49);
        c.bezierCurveTo(CX - 38, 62, CX - 36, 82, CX - 16, 84);
        c.quadraticCurveTo(CX - 11, 82, CX - 14, 75);
        c.quadraticCurveTo(CX - 24, 73, CX - 23, 57);
        c.closePath(); c.fill();
      });
      paintHairChunk(
        leftCurl,
        7,
        (x, y) => {
          const s = (y - 53) - (x - (CX - 34)) * 0.62;
          return (s >= 6 && s <= 12.5) || (s >= 18.5 && s <= 25);
        },
        planes.hairWeightCurl,
        (_x, y) => smoothstep(49, 85, y) * .95,
      );

      // Iconic big domed front zebra bang with CURVED flowing stripes (NOT straight horizontal bars!)
      const bigBangs = rasterizeBezierMask((c) => {
        c.beginPath();
        c.moveTo(CX - 12, 41);
        c.bezierCurveTo(CX - 3, 20, CX + 33, 21, CX + 36, 51);
        c.bezierCurveTo(CX + 37, 68, CX + 27, 84, CX + 13, 84);
        c.quadraticCurveTo(CX + 18, 70, CX + 18, 57);
        c.bezierCurveTo(CX + 17, 47, CX + 4, 43, CX - 12, 41);
        c.closePath(); c.fill();
      });
      paintHairChunk(
        bigBangs,
        6,
        (x, y) => {
          // Polar/dome-curved zebra stripes sweeping naturally across the rounded bang
          const dx = x - (CX + 2);
          const dy = y - 62;
          const arcVal = Math.hypot(dx * 0.85, dy * 1.05);
          const sweep = y - dx * 0.32 + Math.pow(dx / 24, 2) * 7.5;
          return (sweep >= 40.5 && sweep <= 50.5 && arcVal > 14) || (sweep >= 59.0 && sweep <= 69.0);
        },
        planes.hairWeightBangs,
        (_x, y) => smoothstep(20, 84, y) * .95,
      );
    } else if (view === 'side') {
      const sideSpikes = rasterizeBezierMask((c) => {
        c.beginPath(); c.moveTo(SX - 10, 42);
        c.quadraticCurveTo(SX - 4, 16, SX - 6, 4); c.quadraticCurveTo(SX + 8, 11, SX + 11, 23);
        c.quadraticCurveTo(SX + 16, 14, SX + 22, 11); c.quadraticCurveTo(SX + 32, 19, SX + 31, 34);
        c.quadraticCurveTo(SX + 40, 33, SX + 39, 45); c.quadraticCurveTo(SX + 36, 58, SX + 26, 68);
        c.lineTo(SX + 29, 74); c.lineTo(SX + 18, 81); c.quadraticCurveTo(SX + 13, 89, SX + 7, 84);
        c.lineTo(SX - 6, 78); c.closePath(); c.fill();
      });
      paintHairChunk(sideSpikes, 5, (x, y) => (y >= 8 && y <= 15 && x <= SX + 8) || (y >= 16 && y <= 23 && x >= SX + 11 && x <= SX + 29) || (y >= 37 && y <= 45 && x >= SX + 27) || (y >= 61 && y <= 69 && x >= SX + 18), planes.hairWeightTop, (_x, y) => smoothstep(82, 4, y) * .92);

      const sideForelock = rasterizeBezierMask((c) => {
        c.beginPath(); c.moveTo(SX - 12, 26); c.bezierCurveTo(SX - 39, 27, SX - 42, 64, SX - 22, 85);
        c.bezierCurveTo(SX - 5, 74, SX + 4, 46, SX - 12, 26); c.closePath(); c.fill();
      });
      paintHairChunk(sideForelock, 6, (x, y) => { const cy = y - (x - (SX - 20)) * .12 + Math.pow((x - (SX - 20)) / 22, 2) * 5.5; return (cy >= 40 && cy <= 51) || (cy >= 60 && cy <= 71); }, planes.hairWeightBangs, (_x, y) => smoothstep(25, 85, y) * .95);
    } else {
      // COMPLETELY REFINED BACK HAIR matching 3D back reference (smooth flowing spikes, ZERO square notches!)
      const backHair = rasterizeBezierMask((c) => {
        c.beginPath();
        // Bottom-left fluffy nape curl
        c.moveTo(CX - 28, 82);
        // Lower-left curved wisp spike (sharp & curved)
        c.quadraticCurveTo(CX - 36, 78, CX - 43, 68);
        c.quadraticCurveTo(CX - 34, 67, CX - 29, 63);
        // Mid-left big sweeping crest
        c.bezierCurveTo(CX - 44, 54, CX - 48, 43, CX - 45, 32);
        c.quadraticCurveTo(CX - 36, 36, CX - 32, 35);
        // Upper-left prominent curved horn spike
        c.bezierCurveTo(CX - 34, 24, CX - 27, 14, CX - 19, 10);
        c.quadraticCurveTo(CX - 13, 18, CX - 9, 24);
        // Top-center tall horn peak
        c.quadraticCurveTo(CX - 4, 13, CX + 4, 5);
        c.quadraticCurveTo(CX + 16, 15, CX + 22, 28);
        // Lush round fluffy right side matching 3D silhouette
        c.bezierCurveTo(CX + 40, 38, CX + 41, 67, CX + 34, 80);
        // Soft curved bottom curls framing nape
        c.quadraticCurveTo(CX + 22, 91, CX + 4, 83);
        c.quadraticCurveTo(CX - 12, 92, CX - 28, 82);
        c.closePath(); c.fill();
      });
      paintHairChunk(
        backHair,
        5,
        (x, y) => {
          // Sleek conical curved black tips following each spike direction (zero blocky cuts!)
          const topTip = y >= 5 && y <= 14 + Math.abs(x - (CX + 4)) * 0.25 && x >= CX - 5 && x <= CX + 13;
          const upLeftTip = y >= 10 && y <= 19 + (x - (CX - 19)) * 0.35 && x >= CX - 29 && x <= CX - 11;
          const midLeftTip = x <= CX - 37 + (y - 38) * 0.32 && y >= 32 && y <= 46;
          const lowLeftTip = x <= CX - 31 + (y - 70) * 0.45 && y >= 66 && y <= 75;
          return topTip || upLeftTip || midLeftTip || lowLeftTip;
        },
        planes.hairWeightTop,
        (_x, y) => smoothstep(86, 5, y) * .9,
      );
      for (let y = 62; y <= 92; y++) for (let x = CX - 48; x <= CX + 46; x++) if (backHair[y * W + x]) planes.hairWeightBot[y * W + x] = smoothstep(56, 88, y) * .7;
    }
  }

  function compositeAllLayers(): void {
    const useM = state.stockings, useB = state.panties, useS = state.bra, useT = state.suit !== 'none';
    const isFront = state.view === 'front', isSide = state.view === 'side', S = SKEL;
    const zipTipY = S.neckMidY + 5 + (state.zipper / 100) * (S.waistY - S.neckMidY - 5);

    for (let i = 0; i < PIXEL_COUNT; i++) {
      // Torso + legs composite
      let tc = garmentLayers.torsoBody[i];
      if (useM && garmentLayers.torsoMedias[i]) tc = garmentLayers.torsoMedias[i];
      if (useB && garmentLayers.torsoBraga[i]) tc = garmentLayers.torsoBraga[i];
      if (useS && garmentLayers.torsoSosten[i]) tc = garmentLayers.torsoSosten[i];
      planes.torsoRGBA[i] = tc;
      planes.torsoSuitRGBA[i] = useT ? garmentLayers.torsoTraje[i] : 0;

      // Head composite
      planes.headRGBA[i] = garmentLayers.headBody[i];

      // Articulated Arms
      planes.armLRGBA[i] = !isSide ? garmentLayers.armLBody[i] : 0;
      planes.armLSuitRGBA[i] = (!isSide && useT) ? garmentLayers.armLTraje[i] : 0;
      planes.armRRGBA[i] = !isSide ? garmentLayers.armRBody[i] : 0;
      planes.armRSuitRGBA[i] = (!isSide && useT) ? garmentLayers.armRTraje[i] : 0;

      planes.frontArmRGBA[i] = isSide ? garmentLayers.frontArmBody[i] : 0;
      planes.frontArmSuitRGBA[i] = (isSide && useT) ? garmentLayers.frontArmTraje[i] : 0;

      // Soft domains
      let sc = garmentLayers.softBody[i], slid = sc ? 1 : 0;
      if (useM && garmentLayers.softMedias[i]) { sc = garmentLayers.softMedias[i]; slid = 2; }
      if (useB && garmentLayers.softBraga[i]) { sc = garmentLayers.softBraga[i]; slid = 3; }
      if (useS && garmentLayers.softSosten[i]) { sc = garmentLayers.softSosten[i]; slid = 4; }
      planes.softRGBA[i] = sc; planes.softLayerID[i] = slid; planes.softSuitRGBA[i] = useT ? garmentLayers.softTraje[i] : 0;

      // Back peek bust
      let pc = garmentLayers.peekBody[i], plid = pc ? 1 : 0;
      if (useS && garmentLayers.peekSosten[i]) { pc = garmentLayers.peekSosten[i]; plid = 4; }
      planes.peekRGBA[i] = pc; planes.peekLayerID[i] = plid; planes.peekSuitRGBA[i] = useT ? garmentLayers.peekTraje[i] : 0;

      planes.skirtRGBA[i] = useT ? garmentLayers.skirtCloth[i] : 0;
      planes.headAccRGBA[i] = useT ? garmentLayers.headAcc[i] : 0;

      // Rest-pose hitZoneMask (also updated dynamically every frame in dynamicHitZone!)
      let hz = 0; const x = i % W, y = (i / W) | 0;
      if (pc || planes.peekSuitRGBA[i]) hz = x < CX ? 1 : 2;
      if (tc || planes.torsoSuitRGBA[i] || planes.armLRGBA[i] || planes.armRRGBA[i]) {
        if (isFront && y >= S.hipTopY && y <= S.thighBandY + 14 && Math.abs(x - CX) >= 26) hz = x < CX ? 3 : 4;
        else hz = 9;
      }
      if (planes.headRGBA[i] && (isFront || isSide)) hz = 8;
      if (sc || planes.softSuitRGBA[i]) hz = isFront ? (x < CX ? 1 : 2) : (isSide ? (x < SX ? 1 : 3) : (x < CX ? 3 : 4));
      if (planes.skirtRGBA[i]) hz = 10;
      if (isSide && (planes.frontArmRGBA[i] || planes.frontArmSuitRGBA[i])) hz = 9;
      if (isFront && useT && Math.hypot(x - CX, y - zipTipY) <= 9) hz = 11;
      if (planes.hairRGBA[i]) hz = planes.hairZone[i] || 5;
      planes.hitZoneMask[i] = hz;
    }
  }

  function buildSoftWeightMaps(): void {
    planes.softWeightL.fill(0); planes.softWeightR.fill(0); planes.hipWeightL.fill(0); planes.hipWeightR.fill(0);
    const S = SKEL;
    if (state.view === 'front') {
      const y0 = Math.floor(S.bustTopY - 8), y1 = Math.ceil(S.bustBotY + 12), x0 = Math.floor(CX - S.bustCenterX - S.bustRx - 10), x1 = Math.ceil(CX + S.bustCenterX + S.bustRx + 10);
      for (let y = y0; y <= y1; y++) {
        const row = y * W, anchorY = smoothstep(S.bustTopY - 2, S.bustTopY + 26, y);
        for (let x = x0; x <= x1; x++) {
          const idx = row + x, blendR = smoothstep(CX - 7, CX + 7, x), blendL = 1 - blendR;
          planes.softWeightL[idx] = anchorY * blendL * (0.45 + 0.55 * smoothstep(40, 10, Math.hypot(x - (CX - S.bustCenterX), y - S.bustCenterY)));
          planes.softWeightR[idx] = anchorY * blendR * (0.45 + 0.55 * smoothstep(40, 10, Math.hypot(x - (CX + S.bustCenterX), y - S.bustCenterY)));
        }
      }
      for (let y = Math.floor(S.hipTopY); y <= Math.ceil(S.thighBandY + 16); y++) for (let x = CX - 64; x <= CX + 64; x++) {
        const dL = Math.hypot((x - (CX - 43)) / 22, (y - S.hipPeakY) / 24), dR = Math.hypot((x - (CX + 43)) / 22, (y - S.hipPeakY) / 24);
        planes.hipWeightL[y * W + x] = dL < 1 ? (1 - dL * dL) * .4 : 0;
        planes.hipWeightR[y * W + x] = dR < 1 ? (1 - dR * dR) * .4 : 0;
      }
    } else if (state.view === 'side') {
      for (let y = 86; y <= 184; y++) for (let x = SX - 94; x <= SX; x++) {
        planes.softWeightL[y * W + x] = smoothstep(SX - 6, SX - 32, x) * (0.45 + 0.55 * smoothstep(44, 12, Math.hypot(x - S.sideBustX, y - S.sideBustY)));
      }
      for (let y = 156; y <= 244; y++) for (let x = SX - 4; x <= SX + 70; x++) {
        planes.softWeightR[y * W + x] = smoothstep(SX + 4, SX + 26, x) * (0.45 + 0.55 * smoothstep(42, 12, Math.hypot(x - S.sideGluteX, y - S.sideGluteY)));
      }
    } else {
      const y0 = Math.floor(S.gluteCenterY - S.gluteRy - 8), y1 = Math.ceil(S.gluteCenterY + S.gluteRy + 12), x0 = Math.floor(CX - S.gluteCenterX - S.gluteRx - 10), x1 = Math.ceil(CX + S.gluteCenterX + S.gluteRx + 10);
      for (let y = y0; y <= y1; y++) {
        const row = y * W, anchorY = smoothstep(S.gluteCenterY - S.gluteRy, S.gluteCenterY - S.gluteRy + 24, y);
        for (let x = x0; x <= x1; x++) {
          const idx = row + x, blendR = smoothstep(CX - 7, CX + 7, x), blendL = 1 - blendR;
          planes.softWeightL[idx] = anchorY * blendL * (0.44 + 0.56 * smoothstep(42, 10, Math.hypot(x - (CX - S.gluteCenterX), y - S.gluteCenterY)));
          planes.softWeightR[idx] = anchorY * blendR * (0.44 + 0.56 * smoothstep(42, 10, Math.hypot(x - (CX + S.gluteCenterX), y - S.gluteCenterY)));
        }
      }
    }
  }

  function rebuildAllForView(): void {
    clearAllGarments();
    buildAnatomicalMasks(state.view);
    buildBaseAndLingerieLayers(state.view);
    buildSuitLayer(state.view, state.suit, state.zipper);
    buildHairLayer(state.view);
    buildSoftWeightMaps();
    compositeAllLayers();
    planes.dynamicHitZone.set(planes.hitZoneMask);
  }

  function rebuildSuitOnly(): void {
    buildSuitLayer(state.view, state.suit, state.zipper);
    compositeAllLayers();
  }

  // ---- FÍSICAS BLANDAS 2D, ANIMACIONES REACTIVAS, CUBO Y TAMAGOTCHI ----
  const mkSpring = (kx: number, ky: number, dx: number, dy: number, maxX: number, maxY: number): SpringState => ({
    x: 0, y: 0, vx: 0, vy: 0, cx: 0, cy: 0, kx, ky, dx, dy, maxX, maxY, squash: 0,
  });

  const springs: Record<SpringName, SpringState> = {
    bustL: mkSpring(195, 138, 10.5, 7.6, 5.8, 7.4), bustR: mkSpring(195, 138, 10.5, 7.6, 5.8, 7.4),
    gluteL: mkSpring(210, 152, 11.2, 8.2, 5.4, 6.8), gluteR: mkSpring(210, 152, 11.2, 8.2, 5.4, 6.8),
    hairTop: mkSpring(125, 165, 7.2, 8.8, 4.6, 3.4), hairBangs: mkSpring(115, 150, 6.8, 8.2, 4.8, 3.6),
    hairCurl: mkSpring(140, 160, 7.5, 8.5, 4, 3.2), hairBot: mkSpring(155, 170, 8.4, 9, 3, 2.4),
    clothSlipL: mkSpring(140, 140, 9.2, 9.2, 4.8, 4.8), clothSlipR: mkSpring(140, 140, 9.2, 9.2, 4.8, 4.8),
    skirtL: mkSpring(78, 92, 4.8, 5.6, 14, 16), skirtR: mkSpring(78, 92, 4.8, 5.6, 14, 16), lapelSpread: mkSpring(125, 125, 8.5, 8.5, 7.5, 4),
  };

  function applyImpulse(name: SpringName, ivx: number, ivy: number): void {
    const s = springs[name]; if (!s) return;
    s.vx += ivx; s.vy += ivy;
    const mat = SUIT_MATERIALS[state.suit];
    if (name === 'bustL') { springs.bustR.vx += ivx * .14; springs.bustR.vy += ivy * .18; if (state.suit !== 'none') { springs.clothSlipL.vx -= ivx * .18 * mat.clothLag; springs.clothSlipL.vy -= ivy * .18 * mat.clothLag; } }
    else if (name === 'bustR') { springs.bustL.vx += ivx * .14; springs.bustL.vy += ivy * .18; if (state.suit !== 'none') { springs.clothSlipR.vx -= ivx * .18 * mat.clothLag; springs.clothSlipR.vy -= ivy * .18 * mat.clothLag; } }
    else if (name === 'gluteL') { springs.gluteR.vx += ivx * .16; springs.gluteR.vy += ivy * .20; if (state.suit === 'maid' || state.suit === 'marfil') { springs.skirtL.vx += ivx * .35; springs.skirtL.vy += ivy * .22; } }
    else if (name === 'gluteR') { springs.gluteL.vx += ivx * .16; springs.gluteL.vy += ivy * .20; if (state.suit === 'maid' || state.suit === 'marfil') { springs.skirtR.vx += ivx * .35; springs.skirtR.vy += ivy * .22; } }
    else if (name === 'skirtL') { springs.skirtR.vx += ivx * .3; springs.skirtR.vy += ivy * .3; }
    else if (name === 'skirtR') { springs.skirtL.vx += ivx * .3; springs.skirtL.vy += ivy * .3; }
  }

  const contacts: ViscoContact[] = [];
  function pushViscoContact(x: number, y: number, zone: number, depth: number, radius: number, shearX = 0, shearY = 0): void {
    for (const c of contacts) {
      if (c.zone === zone && Math.hypot(c.x - x, c.y - y) < 9) {
        c.x = lerp(c.x, x, .55); c.y = lerp(c.y, y, .55); c.targetDepth = Math.max(c.targetDepth, depth);
        c.radius = Math.max(c.radius, radius); c.shearX = lerp(c.shearX, shearX, .5); c.shearY = lerp(c.shearY, shearY, .5); c.hold = .04; return;
      }
    }
    if (contacts.length >= 8) contacts.shift();
    contacts.push({ x, y, zone, depth: depth * .45, clothDepth: depth * .2, targetDepth: depth, radius, shearX, shearY, hold: .04 });
  }

  const pointer = { x: CX, y: 160, vx: 0, vy: 0, down: false, inside: false, grip: 0, petAccum: 0, activeZone: 0, draggingZipper: false, draggingSkirt: false };

  function setCustomRigPose(rigPose: AvatarRigPose | null): void {
    state.customRigPose = rigPose;
    state.customRigTime = 0;
    state.customRigDuration = rigPose ? (rigPose.durationSec ?? 2.8) : 0;
    emitSnapshot(true);
  }

  /**
   * Evaluates articulated 2D multi-joint rig animations (shoulders, elbows, wrists, 5 fingers,
   * head, eyes, mouth, torso, hips, knees, crouch & jump) & couples acceleration into soft-body springs!
   */
  function stepAnimations(dt: number): void {
    if (!state.animationsEnabled) {
      const k = Math.min(1, 10 * dt);
      pose.bodyBounceY = lerp(pose.bodyBounceY, 0, k);
      pose.hipSwayX = lerp(pose.hipSwayX, 0, k);
      pose.crouchDepth = lerp(pose.crouchDepth, 0, k);
      pose.jumpHeight = lerp(pose.jumpHeight, 0, k);
      pose.legLiftL = lerp(pose.legLiftL, 0, k);
      pose.legLiftR = lerp(pose.legLiftR, 0, k);
      pose.torsoOffX = lerp(pose.torsoOffX, 0, k);
      pose.torsoOffY = lerp(pose.torsoOffY, 0, k);
      pose.torsoAngle = lerp(pose.torsoAngle, 0, k);
      pose.headOffX = lerp(pose.headOffX, 0, k);
      pose.headOffY = lerp(pose.headOffY, 0, k);
      pose.headAngle = lerp(pose.headAngle, 0, k);
      pose.armLAngle = lerp(pose.armLAngle, 0, k);
      pose.elbowLAngle = lerp(pose.elbowLAngle, 0, k);
      pose.wristLAngle = lerp(pose.wristLAngle, 0, k);
      pose.fingerCurlL = lerp(pose.fingerCurlL, 0, k);
      pose.handLGesture = 'open';
      pose.armRAngle = lerp(pose.armRAngle, 0, k);
      pose.elbowRAngle = lerp(pose.elbowRAngle, 0, k);
      pose.wristRAngle = lerp(pose.wristRAngle, 0, k);
      pose.fingerCurlR = lerp(pose.fingerCurlR, 0, k);
      pose.handRGesture = 'open';
      pose.armLiftY = lerp(pose.armLiftY, 0, k);
      pose.sideArmAngle = lerp(pose.sideArmAngle, 0, k);
      pose.sideElbowAngle = lerp(pose.sideElbowAngle, 0, k);
      pose.eyeOpenL = lerp(pose.eyeOpenL, 1, k);
      pose.eyeOpenR = lerp(pose.eyeOpenR, 1, k);
      pose.browTilt = lerp(pose.browTilt, 0, k);
      pose.mouthShape = 'neutral';
      pose.mouthOpen = lerp(pose.mouthOpen, 0, k);
      return;
    }

    if (state.currentAnim !== 'idle') {
      state.animTime += dt;
      if (state.animDuration > 0 && state.animTime >= state.animDuration) {
        state.currentAnim = 'idle';
        state.animTime = 0;
        state.animDuration = 0;
        emitSnapshot(true);
      }
    }

    if (state.customRigPose && state.customRigDuration > 0) {
      state.customRigTime += dt;
      if (state.customRigTime >= state.customRigDuration) {
        state.customRigPose = null;
        state.customRigTime = 0;
        state.customRigDuration = 0;
        emitSnapshot(true);
      }
    }

    const t = state.time;
    const at = state.animTime;
    const dur = Math.max(0.001, state.animDuration);
    const u = clamp(at / dur, 0, 1);
    const env =
      state.currentAnim === 'idle'
        ? 0
        : smoothstep(0, 0.16, u) * smoothstep(1, 0.80, u);
    const sinEnv = state.currentAnim === 'idle' ? 0 : Math.sin(u * Math.PI);

    // Base continuous living Idle (breathing + gentle sway + subtle cursor look tilt)
    const breath = Math.sin(t * 2.1);
    const sway = Math.sin(t * 1.05);
    const lookX = pointer.inside ? clamp((pointer.x - CX) / 115, -1, 1) : Math.sin(t * 0.55) * 0.25;
    const lookY = pointer.inside ? clamp((pointer.y - SKEL.eyeY) / 140, -1, 1) : 0;

    let tBounceY = breath * 0.45;
    let tHipSwayX = sway * 1.4;
    let tCrouchDepth = 0;
    let tJumpHeight = 0;
    let tLegLiftL = 0;
    let tLegLiftR = 0;
    let tTorsoOffX = sway * 0.45;
    let tTorsoOffY = -breath * 0.95;
    let tTorsoAngle = sway * 0.018;
    let tHeadOffX = lookX * 0.85;
    let tHeadOffY = -breath * 0.35 + lookY * 0.55;
    let tHeadAngle = lookX * 0.065 + Math.sin(t * 0.85) * 0.018;

    let tArmLAngle = -0.025 + breath * 0.032 - sway * 0.02;
    let tElbowLAngle = 0.04 * breath;
    let tWristLAngle = 0;
    let tFingerCurlL = 0.08 + 0.04 * breath;
    let tHandLGesture: HandGesture = 'open';

    let tArmRAngle = 0.025 - breath * 0.032 - sway * 0.02;
    let tElbowRAngle = -0.04 * breath;
    let tWristRAngle = 0;
    let tFingerCurlR = 0.08 + 0.04 * breath;
    let tHandRGesture: HandGesture = 'open';

    let tArmLiftY = -breath * 0.7;
    let tSideArmAngle = breath * 0.035 + sway * 0.025;
    let tSideElbowAngle = 0;

    let tEyeOpenL = 1;
    let tEyeOpenR = 1;
    let tEyeLookX = lookX;
    let tEyeLookY = lookY;
    let tBrowTilt = 0;
    let tMouthShape: MouthShape = 'neutral';
    let tMouthOpen = 0;

    // Layer reactive state animation on top of idle!
    switch (state.currentAnim) {
      case 'happy': {
        // Pre-crouch on each hop, then leap into the air with elbows & hands cheering!
        const hopPhase = (u * 2) % 1;
        const isAir = hopPhase > 0.22 && hopPhase < 0.82;
        const airCurve = isAir ? Math.sin(((hopPhase - 0.22) / 0.60) * Math.PI) : 0;
        const crouchCurve = !isAir ? Math.sin((hopPhase <= 0.22 ? hopPhase / 0.22 : (1 - hopPhase) / 0.18) * Math.PI) : 0;
        const swing = Math.sin(u * Math.PI * 3);
        tJumpHeight += airCurve * 15.0 * sinEnv;
        tCrouchDepth += crouchCurve * 7.0 * sinEnv;
        tHipSwayX += swing * 2.8 * env;
        tTorsoAngle += swing * 0.042 * env;
        tHeadAngle += Math.sin(u * Math.PI * 2.5) * 0.11 * env;
        tArmLAngle += 0.45 * env + Math.sin(u * Math.PI * 4) * 0.10 * env;
        tArmRAngle -= 0.45 * env + Math.sin(u * Math.PI * 4) * 0.10 * env;
        tElbowLAngle += 0.65 * env;
        tElbowRAngle -= 0.65 * env;
        tHandLGesture = 'wave_spread';
        tHandRGesture = 'wave_spread';
        tArmLiftY -= 2.2 * env;
        tSideArmAngle -= 0.34 * env;
        tSideElbowAngle -= 0.55 * env;
        tMouthShape = 'smile';
        tMouthOpen = 0.45 * env;
        break;
      }
      case 'petted': {
        const purr = Math.sin(at * 5.2);
        const leanDir = pointer.inside ? clamp((pointer.x - CX) / 55, -1, 1) : 0.45;
        tHipSwayX += purr * 1.8 * env;
        tTorsoAngle += leanDir * 0.038 * env;
        tHeadAngle = lerp(tHeadAngle, leanDir * 0.13 + purr * 0.025, 0.85 * env);
        tHeadOffX += leanDir * 1.2 * env;
        tHeadOffY += 0.8 * env;
        tArmLAngle -= 0.12 * env;
        tArmRAngle += 0.12 * env;
        tElbowLAngle -= 0.65 * env;
        tElbowRAngle += 0.65 * env;
        tFingerCurlL = 0.35;
        tFingerCurlR = 0.35;
        tMouthShape = 'smile';
        break;
      }
      case 'shy': {
        const shiver = Math.sin(at * 18) * 0.32 * Math.max(0, 1 - u * 1.3);
        tHipSwayX += (Math.sin(at * 2.8) * 1.6 + shiver) * env;
        tCrouchDepth += 4.5 * env;
        tTorsoOffY += 1.2 * env;
        tTorsoAngle -= 0.032 * env;
        tHeadAngle += 0.11 * env;
        tHeadOffY += 1.2 * env;
        tHeadOffX += (0.9 + shiver * 0.6) * env;
        // Elbows pulled inward, forearms bent up toward chest!
        tArmLAngle -= 0.32 * env;
        tArmRAngle += 0.32 * env;
        tElbowLAngle -= 1.35 * env;
        tElbowRAngle += 1.35 * env;
        tFingerCurlL = 0.55;
        tFingerCurlR = 0.55;
        tArmLiftY += 1.2 * env;
        tSideArmAngle -= 0.15 * env;
        tSideElbowAngle -= 0.85 * env;
        tEyeLookX = -0.85;
        tBrowTilt = -0.6 * env;
        break;
      }
      case 'surprised': {
        const snap = Math.exp(-at * 4.2) * Math.sin(at * 13.5) * sinEnv;
        const lift = Math.sin(Math.min(1, u * 2.2) * Math.PI) * sinEnv;
        tJumpHeight += lift * 7.5;
        tTorsoOffY -= lift * 1.6;
        tTorsoAngle += snap * 0.052;
        tHeadOffY -= lift * 1.2;
        tHeadAngle -= snap * 0.10;
        tArmLAngle += lift * 0.48;
        tArmRAngle -= lift * 0.48;
        tElbowLAngle += lift * 0.55;
        tElbowRAngle -= lift * 0.55;
        tHandLGesture = 'wave_spread';
        tHandRGesture = 'wave_spread';
        tArmLiftY -= lift * 2.4;
        tSideArmAngle += lift * 0.24;
        tEyeOpenL = 1 + 0.35 * sinEnv;
        tEyeOpenR = 1 + 0.35 * sinEnv;
        tMouthShape = 'open';
        tMouthOpen = 0.75 * sinEnv;
        break;
      }
      case 'eat': {
        const chew = u > 0.55 ? Math.sin((u - 0.55) * 34) * 0.9 * sinEnv : 0;
        const reach = Math.sin(Math.min(1, u * 1.6) * Math.PI) * sinEnv;
        tHeadOffX -= reach * 1.4;
        tHeadOffY += reach * 1.2 + chew * 0.5;
        tHeadAngle -= reach * 0.085;
        tTorsoAngle -= reach * 0.025;
        // Both elbows bend up to hold and eat the incoming cupcake!
        tArmLAngle -= 0.28 * env;
        tArmRAngle += 0.28 * env;
        tElbowLAngle -= 1.65 * env;
        tElbowRAngle += 1.65 * env;
        tHandLGesture = 'kiss_hand';
        tHandRGesture = 'kiss_hand';
        if (u > 0.75) tJumpHeight += Math.sin(((u - 0.75) / 0.25) * Math.PI) * 5.5;
        break;
      }
      case 'breeze': {
        const gust = sinEnv * (0.75 + 0.25 * Math.sin(at * 9));
        tHipSwayX += 2.4 * gust;
        tTorsoOffX += 1.0 * gust;
        tTorsoAngle += 0.055 * gust;
        tHeadAngle += 0.085 * gust;
        // Left hand holds down skirt while right elbow bends to shield hair!
        tArmLAngle -= 0.18 * gust;
        tElbowLAngle -= 0.45 * gust;
        tArmRAngle -= 0.42 * gust;
        tElbowRAngle += 1.45 * gust;
        tSideArmAngle -= 0.18 * gust;
        tSideElbowAngle -= 0.75 * gust;
        break;
      }
      case 'outfit_pose': {
        tHipSwayX += 4.2 * sinEnv;
        tBounceY -= Math.sin(u * Math.PI * 2) * 1.6 * sinEnv;
        tTorsoOffX += 0.9 * sinEnv;
        tTorsoAngle -= 0.058 * sinEnv;
        tHeadAngle += 0.12 * sinEnv;
        tHeadOffX += 0.8 * sinEnv;
        // Left hand on hip (elbow bent inward), Right arm gracefully presented!
        tArmLAngle += 0.42 * sinEnv;
        tElbowLAngle -= 1.25 * sinEnv;
        tArmRAngle -= 0.34 * sinEnv;
        tElbowRAngle -= 0.55 * sinEnv;
        tHandRGesture = 'open';
        tSideArmAngle -= 0.16 * sinEnv;
        tSideElbowAngle -= 0.65 * sinEnv;
        tMouthShape = 'smile';
        break;
      }
      case 'dance': {
        const beat = Math.sin(at * 9.2);
        const bounce = Math.abs(Math.cos(at * 9.2));
        tHipSwayX += beat * 5.2 * env;
        tCrouchDepth += bounce * 6.5 * env;
        tLegLiftL += Math.max(0, beat) * 5.5 * env;
        tLegLiftR += Math.max(0, -beat) * 5.5 * env;
        tTorsoOffX -= beat * 1.1 * env;
        tTorsoOffY -= bounce * 1.4 * env;
        tTorsoAngle += beat * 0.065 * env;
        tHeadAngle -= beat * 0.12 * env;
        tHeadOffX -= beat * 0.9 * env;
        // Forearms & elbows groove rhythmically!
        tArmLAngle += (0.38 + beat * 0.28) * env;
        tArmRAngle += (-0.38 + beat * 0.28) * env;
        tElbowLAngle += (0.65 + beat * 0.45) * env;
        tElbowRAngle += (-0.65 + beat * 0.45) * env;
        tWristLAngle += beat * 0.35 * env;
        tWristRAngle -= beat * 0.35 * env;
        tArmLiftY -= bounce * 2.0 * env;
        tSideArmAngle += beat * 0.25 * env;
        tSideElbowAngle -= (0.65 + beat * 0.35) * env;
        tMouthShape = 'smile';
        break;
      }
      case 'nod': {
        const nodWave = Math.sin(u * Math.PI * 3);
        tHeadOffY += clamp(nodWave * 2.1, -1.0, 2.2) * env;
        tHeadAngle += nodWave * 0.045 * env;
        tTorsoOffY += Math.max(0, nodWave * 1.3) * env;
        tCrouchDepth += Math.max(0, nodWave * 2.5) * env;
        tArmLAngle += 0.12 * env;
        tArmRAngle -= 0.12 * env;
        tElbowLAngle -= 0.35 * env;
        tElbowRAngle += 0.35 * env;
        tMouthShape = 'smile';
        break;
      }
      case 'shake_head': {
        const shakeWave = Math.sin(u * Math.PI * 4);
        tHeadOffX += shakeWave * 1.9 * env;
        tHeadAngle += shakeWave * 0.14 * env;
        tTorsoAngle += shakeWave * 0.032 * env;
        tHipSwayX -= shakeWave * 1.8 * env;
        tArmLAngle += 0.22 * env;
        tArmRAngle -= 0.22 * env;
        tElbowLAngle -= 0.85 * env;
        tElbowRAngle += 0.85 * env;
        tHandRGesture = 'point';
        break;
      }
      case 'giggle': {
        const gigglePulse = Math.abs(Math.sin(at * 17));
        const swayGiggle = Math.sin(at * 6.8);
        tBounceY -= gigglePulse * 3.2 * env;
        tTorsoOffY -= gigglePulse * 1.4 * env;
        tHipSwayX += swayGiggle * 2.2 * env;
        tHeadAngle += (0.09 + swayGiggle * 0.05) * env;
        tHeadOffY -= gigglePulse * 0.9 * env;
        // Both elbows bend up bringing hands near mouth to cover giggle!
        tArmLAngle -= (0.32 + gigglePulse * 0.05) * env;
        tArmRAngle += (0.32 + gigglePulse * 0.05) * env;
        tElbowLAngle -= (1.85 + gigglePulse * 0.15) * env;
        tElbowRAngle += (1.85 + gigglePulse * 0.15) * env;
        tArmLiftY -= gigglePulse * 1.8 * env;
        tSideArmAngle -= 0.18 * env;
        tSideElbowAngle -= 1.25 * env;
        tMouthShape = 'talk';
        tMouthOpen = 0.55 * gigglePulse * env;
        break;
      }
      case 'tease': {
        const roll = Math.sin(u * Math.PI * 2);
        tHipSwayX += roll * 4.8 * env;
        tTorsoOffX -= roll * 1.1 * env;
        tTorsoOffY -= 1.4 * env;
        tBounceY -= Math.abs(roll) * 2.0 * env;
        tTorsoAngle += roll * 0.058 * env;
        tHeadAngle += (0.13 - roll * 0.05) * env;
        tHeadOffX += 0.9 * env;
        tArmLAngle += 0.38 * env;
        tElbowLAngle -= 1.20 * env;
        tArmRAngle -= 0.32 * env;
        tElbowRAngle += 1.45 * env;
        tArmLiftY -= 1.4 * env;
        tSideArmAngle += 0.22 * env;
        tSideElbowAngle -= 0.75 * env;
        tMouthShape = 'smile';
        break;
      }
      case 'stretch': {
        const arch = sinEnv;
        tBounceY -= arch * 3.8;
        tTorsoOffY -= arch * 1.8;
        tHeadOffY -= arch * 0.9;
        tHeadAngle -= arch * 0.08;
        // Arms & forearms stretch high above head!
        tArmLAngle += arch * 1.15;
        tArmRAngle -= arch * 1.15;
        tElbowLAngle += arch * 0.55;
        tElbowRAngle -= arch * 0.55;
        tHandLGesture = 'wave_spread';
        tHandRGesture = 'wave_spread';
        tArmLiftY -= arch * 3.4;
        tSideArmAngle -= arch * 1.05;
        tSideElbowAngle -= arch * 0.45;
        tEyeOpenL = 1 - arch * 0.85;
        tEyeOpenR = 1 - arch * 0.85;
        tMouthShape = 'open';
        tMouthOpen = arch * 0.55;
        break;
      }
      case 'talk': {
        const cadence = Math.sin(at * 8.5);
        const gesture = Math.sin(at * 4.2);
        tBounceY -= Math.abs(cadence) * 1.6 * env;
        tHipSwayX += gesture * 2.2 * env;
        tTorsoOffX += gesture * 0.8 * env;
        tTorsoAngle += gesture * 0.032 * env;
        tHeadAngle += (gesture * 0.085 + cadence * 0.03) * env;
        tHeadOffY -= Math.abs(cadence) * 0.7 * env;
        tArmLAngle += (0.18 + gesture * 0.12) * env;
        tElbowLAngle -= (0.55 + gesture * 0.25) * env;
        tArmRAngle -= (0.18 - gesture * 0.12) * env;
        tElbowRAngle += (0.65 + cadence * 0.25) * env;
        tArmLiftY -= Math.abs(cadence) * 1.1 * env;
        tSideArmAngle += gesture * 0.12 * env;
        tSideElbowAngle -= 0.45 * env;
        tMouthShape = 'talk';
        tMouthOpen = Math.abs(cadence) * 0.65 * env;
        break;
      }
      case 'wave_hand': {
        // Right arm raised high, elbow bent upward, wrist & spread fingers waving!
        const waveOsc = Math.sin(at * 13.5);
        tHipSwayX += Math.sin(u * Math.PI * 2) * 2.4 * env;
        tBounceY -= Math.abs(Math.sin(at * 6.5)) * 2.2 * env;
        tTorsoAngle -= 0.042 * env;
        tHeadAngle += (0.10 + waveOsc * 0.035) * env;
        tHeadOffX += 0.8 * env;
        tArmLAngle += 0.08 * env;
        tElbowLAngle -= 0.25 * env;
        tArmRAngle -= 0.95 * env;
        tElbowRAngle -= (0.95 + waveOsc * 0.32) * env;
        tWristRAngle += waveOsc * 0.38 * env;
        tHandRGesture = 'wave_spread';
        tArmLiftY -= 2.4 * env;
        tSideArmAngle -= 0.85 * env;
        tSideElbowAngle -= (0.75 + waveOsc * 0.28) * env;
        tMouthShape = 'smile';
        break;
      }
      case 'blow_kiss': {
        // True hand-to-lips kiss: Phase 1 bends right elbow so fingers touch lips; Phase 2 sweeps arm out!
        const gather = smoothstep(0, 0.34, u) * smoothstep(0.56, 0.36, u);
        const release = smoothstep(0.40, 0.68, u) * smoothstep(1.0, 0.82, u);
        tHipSwayX -= 3.0 * gather - 2.8 * release;
        tTorsoAngle += 0.045 * gather - 0.042 * release;
        tTorsoOffY += 1.1 * gather - 1.4 * release;
        tHeadAngle += 0.11 * release - 0.06 * gather;
        tHeadOffY += 1.2 * gather - 0.8 * release;
        // Left hand rests on hip; Right hand bends all the way up to lips then opens outward!
        tArmLAngle += 0.05 * env;
        tElbowLAngle -= 1.25 * env;
        tArmRAngle += 0.92 * gather - 0.82 * release;
        tElbowRAngle += 2.55 * gather - 0.75 * release;
        tWristRAngle += 0.25 * gather - 0.25 * release;
        tArmLiftY -= 5.5 * gather + 2.0 * release;
        tHandRGesture = gather > 0.25 ? 'kiss_hand' : 'wave_spread';
        tSideArmAngle += -0.55 * gather - 0.75 * release;
        tSideElbowAngle += -1.45 * gather - 0.45 * release;
        tEyeOpenR = release > 0.2 ? 0 : 1;
        tMouthShape = 'kiss';
        tMouthOpen = 0.45 * env;
        break;
      }
      case 'curtsy': {
        const dip = sinEnv;
        tCrouchDepth += dip * 13.5;
        tHipSwayX += Math.sin(u * Math.PI * 2) * 2.0 * dip;
        tTorsoOffY += dip * 1.4;
        tTorsoAngle += dip * 0.035;
        tHeadOffY += dip * 1.5;
        tHeadAngle += dip * 0.10;
        // Spread both arms and bend elbows slightly to pinch skirt hem
        tArmLAngle += dip * 0.38;
        tArmRAngle -= dip * 0.38;
        tElbowLAngle += dip * 0.28;
        tElbowRAngle -= dip * 0.28;
        tHandLGesture = 'kiss_hand';
        tHandRGesture = 'kiss_hand';
        tArmLiftY += dip * 1.2;
        tSideArmAngle += dip * 0.24;
        tMouthShape = 'smile';
        break;
      }
      case 'hip_sway': {
        const slowBeat = Math.sin(u * Math.PI * 3);
        tHipSwayX += slowBeat * 6.4 * env;
        tCrouchDepth += Math.abs(slowBeat) * 3.5 * env;
        tTorsoOffX -= slowBeat * 1.2 * env;
        tTorsoAngle -= slowBeat * 0.068 * env;
        tHeadAngle += slowBeat * 0.11 * env;
        tHeadOffX += slowBeat * 0.9 * env;
        // Both hands placed on hips with elbows bent outward!
        tArmLAngle += (0.42 - slowBeat * 0.08) * env;
        tElbowLAngle -= 1.25 * env;
        tArmRAngle += (-0.42 - slowBeat * 0.08) * env;
        tElbowRAngle += 1.25 * env;
        tSideArmAngle -= slowBeat * 0.22 * env;
        tSideElbowAngle -= 0.75 * env;
        break;
      }
      case 'strut': {
        const step = Math.sin(at * 8.2);
        const stepBounce = Math.abs(Math.cos(at * 8.2));
        tCrouchDepth += stepBounce * 5.0 * env;
        tLegLiftL += Math.max(0, step) * 8.0 * env;
        tLegLiftR += Math.max(0, -step) * 8.0 * env;
        tHipSwayX += step * 4.5 * env;
        tTorsoAngle -= step * 0.055 * env;
        tTorsoOffY -= stepBounce * 1.2 * env;
        tHeadAngle += step * 0.08 * env;
        tHeadOffY -= stepBounce * 0.7 * env;
        tArmLAngle += step * 0.32 * env;
        tArmRAngle += step * 0.32 * env;
        tElbowLAngle -= (0.55 - step * 0.25) * env;
        tElbowRAngle += (0.55 + step * 0.25) * env;
        tSideArmAngle += step * 0.26 * env;
        tSideElbowAngle -= 0.55 * env;
        break;
      }
      case 'cheer': {
        const hop = Math.abs(Math.sin(at * 11));
        const wave = Math.sin(at * 5.5);
        tJumpHeight += hop * 11.5 * env;
        tHipSwayX += wave * 3.0 * env;
        tTorsoOffY -= hop * 1.6 * env;
        tTorsoAngle += wave * 0.045 * env;
        tHeadAngle += wave * 0.10 * env;
        tHeadOffY -= hop * 0.9 * env;
        // Both arms & elbows raised high in V victory pose!
        tArmLAngle += (1.05 + hop * 0.14) * env;
        tArmRAngle -= (1.05 + hop * 0.14) * env;
        tElbowLAngle += (0.55 + wave * 0.2) * env;
        tElbowRAngle -= (0.55 - wave * 0.2) * env;
        tHandLGesture = 'peace';
        tHandRGesture = 'peace';
        tArmLiftY -= (3.0 + hop * 1.2) * env;
        tSideArmAngle -= (0.95 + hop * 0.12) * env;
        tSideElbowAngle -= 0.55 * env;
        tMouthShape = 'open';
        tMouthOpen = 0.6 * env;
        break;
      }
      case 'pout': {
        const stomp = Math.abs(Math.sin(at * 12));
        const twist = Math.sin(at * 6);
        tCrouchDepth += stomp * 4.5 * env;
        tLegLiftL += Math.max(0, twist) * 5.0 * env;
        tLegLiftR += Math.max(0, -twist) * 5.0 * env;
        tHipSwayX += twist * 2.6 * env;
        tTorsoAngle += twist * 0.048 * env;
        tTorsoOffY += 1.1 * env;
        tHeadAngle -= (0.09 + twist * 0.06) * env;
        tHeadOffY += 1.2 * env;
        tHeadOffX -= 1.0 * env;
        // Crossed arms with clenched fists!
        tArmLAngle -= 0.34 * env;
        tArmRAngle += 0.34 * env;
        tElbowLAngle -= 1.55 * env;
        tElbowRAngle += 1.55 * env;
        tHandLGesture = 'fist';
        tHandRGesture = 'fist';
        tFingerCurlL = 0.95;
        tFingerCurlR = 0.95;
        tArmLiftY += 1.5 * env;
        tSideArmAngle -= 0.20 * env;
        tSideElbowAngle -= 0.95 * env;
        tBrowTilt = 0.85 * env;
        tMouthShape = 'pout';
        break;
      }
      case 'peekaboo': {
        const phase = Math.sin(u * Math.PI * 2);
        tHipSwayX += phase * 5.2 * env;
        tTorsoAngle += phase * 0.072 * env;
        tCrouchDepth += (phase < 0 ? -phase * 8.0 : 0) * env;
        tHeadAngle += phase * 0.15 * env;
        tHeadOffX += phase * 1.6 * env;
        // When phase < 0, elbows bend up covering face; when phase > 0, arms open wide!
        const cover = clamp(-phase, 0, 1) * env;
        const peek = clamp(phase, 0, 1) * env;
        tArmLAngle += -0.38 * cover + 0.55 * peek;
        tArmRAngle += 0.38 * cover - 0.55 * peek;
        tElbowLAngle += -2.25 * cover + 0.45 * peek;
        tElbowRAngle += 2.25 * cover - 0.45 * peek;
        tHandLGesture = peek > 0.3 ? 'wave_spread' : 'open';
        tHandRGesture = peek > 0.3 ? 'wave_spread' : 'open';
        break;
      }
      case 'shiver': {
        const tremor = Math.sin(at * 28);
        tHipSwayX += tremor * 1.4 * env;
        tCrouchDepth += 5.5 * env;
        tTorsoOffX += tremor * 0.9 * env;
        tTorsoOffY += 1.3 * env;
        tHeadAngle += (0.08 + tremor * 0.04) * env;
        tHeadOffX += tremor * 0.9 * env;
        tHeadOffY += 1.1 * env;
        // Hugging herself tightly with elbows in and forearms crossed!
        tArmLAngle -= 0.42 * env;
        tArmRAngle += 0.42 * env;
        tElbowLAngle -= 1.75 * env;
        tElbowRAngle += 1.75 * env;
        tHandLGesture = 'fist';
        tHandRGesture = 'fist';
        tArmLiftY += 1.2 * env;
        tSideArmAngle -= 0.20 * env;
        tSideElbowAngle -= 1.15 * env;
        break;
      }
      case 'bow': {
        const bowCurve = sinEnv;
        tCrouchDepth += bowCurve * 8.5;
        tTorsoOffY += bowCurve * 2.0;
        tHeadOffY += bowCurve * 1.8;
        tHeadAngle += bowCurve * 0.07;
        // Right hand crosses gracefully over chest during bow
        tArmLAngle += bowCurve * 0.18;
        tArmRAngle += bowCurve * 0.28;
        tElbowRAngle += bowCurve * 1.45;
        tArmLiftY += bowCurve * 1.4;
        tSideArmAngle += bowCurve * 0.22;
        tSideElbowAngle -= bowCurve * 0.85;
        tEyeOpenL = 1 - bowCurve * 0.85;
        tEyeOpenR = 1 - bowCurve * 0.85;
        break;
      }
      case 'wink': {
        const winkEnv = sinEnv;
        tHipSwayX += 3.8 * winkEnv;
        tBounceY -= 2.0 * winkEnv;
        tTorsoAngle -= 0.048 * winkEnv;
        tHeadAngle += 0.14 * winkEnv;
        tHeadOffX += 1.1 * winkEnv;
        tArmLAngle += 0.38 * winkEnv;
        tElbowLAngle -= 1.20 * winkEnv;
        tArmRAngle -= 0.58 * winkEnv;
        tElbowRAngle += 1.65 * winkEnv;
        tHandRGesture = 'peace';
        tArmLiftY -= 1.5 * winkEnv;
        tSideArmAngle -= 0.45 * winkEnv;
        tSideElbowAngle -= 0.95 * winkEnv;
        tEyeOpenR = 1 - winkEnv;
        tMouthShape = 'smile';
        break;
      }
      case 'thumbs_up': {
        // Right arm lifts & elbow bends forward presenting a crisp Thumbs-Up gesture!
        tHipSwayX += 3.2 * env;
        tTorsoAngle -= 0.04 * env;
        tHeadAngle += 0.11 * env;
        tArmLAngle += 0.05 * env;
        tElbowLAngle -= 1.25 * env;
        tArmRAngle += 0.35 * env;
        tElbowRAngle += 2.48 * env;
        tWristRAngle -= 0.15 * env;
        tArmLiftY -= 2.5 * env;
        tHandRGesture = 'thumbs_up';
        tSideArmAngle -= 0.55 * env;
        tSideElbowAngle -= 0.95 * env;
        tEyeOpenR = 1 - 0.9 * sinEnv;
        tMouthShape = 'smile';
        break;
      }
      case 'crouch': {
        // Deep knee squat with feet planted on the ground!
        const squat = smoothstep(0, 0.25, u) * smoothstep(1, 0.75, u);
        tCrouchDepth += squat * 24.0;
        tTorsoOffY += squat * 1.8;
        tHeadOffY += squat * 1.4;
        tHeadAngle += squat * 0.08;
        // Elbows bend outward for balance while crouching
        tArmLAngle += squat * 0.45;
        tArmRAngle -= squat * 0.45;
        tElbowLAngle -= squat * 1.15;
        tElbowRAngle += squat * 1.15;
        tSideArmAngle -= squat * 0.35;
        tSideElbowAngle -= squat * 0.85;
        break;
      }
      case 'elbows_in': {
        // Bring both elbows inward together in the center of the chest, forearms angled straight up to chin!
        tCrouchDepth += 3.5 * env;
        tTorsoOffY += 1.0 * env;
        tHeadAngle += 0.10 * env;
        tHeadOffY += 1.2 * env;
        tArmLAngle -= 0.96 * env;
        tArmRAngle += 0.96 * env;
        tElbowLAngle -= 2.48 * env;
        tElbowRAngle += 2.48 * env;
        tArmLiftY -= 3.2 * env;
        tHandLGesture = 'kiss_hand';
        tHandRGesture = 'kiss_hand';
        tSideArmAngle -= 0.45 * env;
        tSideElbowAngle -= 1.45 * env;
        tMouthShape = 'smile';
        break;
      }
      case 'raise_right_hand': {
        // Raise ONLY the right arm & hand high in the air while left arm stays relaxed at her side!
        const waveSmall = Math.sin(at * 8) * 0.08;
        tHipSwayX -= 2.4 * env;
        tTorsoAngle -= 0.045 * env;
        tHeadAngle += 0.09 * env;
        tArmLAngle = 0;
        tElbowLAngle = 0;
        tHandLGesture = 'open';
        tArmRAngle -= (1.35 + waveSmall) * env;
        tElbowRAngle -= (0.85 + waveSmall) * env;
        tHandRGesture = 'wave_spread';
        tSideArmAngle -= 1.25 * env;
        tSideElbowAngle -= 0.65 * env;
        tMouthShape = 'smile';
        break;
      }
      case 'raise_left_hand': {
        // Raise ONLY the left arm & hand high in the air while right arm stays relaxed at her side!
        const waveSmall = Math.sin(at * 8) * 0.08;
        tHipSwayX += 2.4 * env;
        tTorsoAngle += 0.045 * env;
        tHeadAngle -= 0.09 * env;
        tArmRAngle = 0;
        tElbowRAngle = 0;
        tHandRGesture = 'open';
        tArmLAngle += (1.35 + waveSmall) * env;
        tElbowLAngle += (0.85 + waveSmall) * env;
        tHandLGesture = 'wave_spread';
        tSideArmAngle -= 1.25 * env;
        tSideElbowAngle -= 0.65 * env;
        tMouthShape = 'smile';
        break;
      }
      case 'peace_sign': {
        tHipSwayX += 3.5 * env;
        tTorsoAngle -= 0.045 * env;
        tHeadAngle += 0.13 * env;
        tArmLAngle += 0.05 * env;
        tElbowLAngle -= 1.25 * env;
        tArmRAngle -= 0.78 * env;
        tElbowRAngle -= 0.92 * env;
        tHandRGesture = 'peace';
        tEyeOpenL = 1 - 0.9 * sinEnv;
        tMouthShape = 'smile';
        break;
      }
      case 'point_finger': {
        tHipSwayX -= 2.6 * env;
        tTorsoAngle -= 0.038 * env;
        tHeadAngle += 0.08 * env;
        tArmLAngle += 0.05 * env;
        tElbowLAngle -= 1.25 * env;
        tArmRAngle -= 0.85 * env;
        tElbowRAngle -= 0.75 * env;
        tHandRGesture = 'point';
        tMouthShape = 'smile';
        break;
      }
      case 'rock_sign': {
        const headBang = Math.sin(at * 12) * 1.4;
        tHeadOffY += headBang * env;
        tCrouchDepth += Math.abs(headBang) * 3.5 * env;
        tArmLAngle += 0.95 * env;
        tElbowLAngle += 0.75 * env;
        tHandLGesture = 'rock';
        tArmRAngle -= 0.95 * env;
        tElbowRAngle -= 0.75 * env;
        tHandRGesture = 'rock';
        tMouthShape = 'open';
        tMouthOpen = 0.55 * env;
        break;
      }
      case 'hands_on_hips': {
        tHipSwayX += 4.2 * env;
        tTorsoAngle -= 0.048 * env;
        tHeadAngle += 0.10 * env;
        // Both elbows bowed outward at CX ± 65 with hands resting directly on hips at CX ± 39, y = 168!
        tArmLAngle += 0.05 * env;
        tElbowLAngle -= 1.25 * env;
        tHandLGesture = 'fist';
        tArmRAngle -= 0.05 * env;
        tElbowRAngle += 1.25 * env;
        tHandRGesture = 'fist';
        tMouthShape = 'smile';
        break;
      }
      case 'cross_arms': {
        tHipSwayX -= 2.2 * env;
        tTorsoAngle += 0.03 * env;
        tHeadAngle -= 0.08 * env;
        // Both elbows & forearms folded horizontally across chest
        tArmLAngle -= 0.72 * env;
        tElbowLAngle -= 2.05 * env;
        tArmRAngle += 0.72 * env;
        tElbowRAngle += 2.05 * env;
        tHandLGesture = 'fist';
        tHandRGesture = 'fist';
        break;
      }
      case 'cover_face': {
        tCrouchDepth += 4.5 * env;
        tHeadOffY += 1.4 * env;
        tHeadAngle += 0.12 * env;
        tArmLAngle -= 0.92 * env;
        tElbowLAngle -= 2.55 * env;
        tArmRAngle += 0.92 * env;
        tElbowRAngle += 2.55 * env;
        tArmLiftY -= 6.5 * env;
        tHandLGesture = 'open';
        tHandRGesture = 'open';
        tEyeOpenL = 0.2;
        tEyeOpenR = 0.2;
        break;
      }
      case 'lift_leg': {
        tHipSwayX -= 3.6 * env;
        tTorsoAngle += 0.045 * env;
        tLegLiftR += 18.0 * sinEnv;
        tArmLAngle += 0.52 * env;
        tElbowLAngle += 0.45 * env;
        tArmRAngle -= 0.42 * env;
        tElbowRAngle += 1.25 * env;
        tHandLGesture = 'wave_spread';
        tMouthShape = 'smile';
        break;
      }
      default:
        break;
    }

    // ---- DIRECT AI / USER 2D RIG POSE OVERRIDES (controls ANY individual body part at will!) ----
    if (state.customRigPose) {
      const rp = state.customRigPose;
      const ru = state.customRigDuration > 0 ? clamp(state.customRigTime / state.customRigDuration, 0, 1) : 0.5;
      const rEnv = state.customRigDuration > 0 ? smoothstep(0, 0.14, ru) * smoothstep(1, 0.84, ru) : 1;

      if (typeof rp.hipSway === 'number') tHipSwayX = lerp(tHipSwayX, rp.hipSway * 6.5, rEnv);
      if (typeof rp.torsoTilt === 'number') tTorsoAngle = lerp(tTorsoAngle, rp.torsoTilt * 0.085, rEnv);
      if (typeof rp.torsoLeanY === 'number') tTorsoOffY = lerp(tTorsoOffY, rp.torsoLeanY * 2.2, rEnv);
      if (typeof rp.crouch === 'number') tCrouchDepth = lerp(tCrouchDepth, clamp(rp.crouch, 0, 1) * 25.0, rEnv);
      if (typeof rp.jump === 'number') {
        const jCurve = state.customRigDuration > 0 ? Math.sin(ru * Math.PI) : clamp(rp.jump, 0, 1);
        tJumpHeight = lerp(tJumpHeight, clamp(rp.jump, 0, 1) * 22.0 * jCurve, rEnv);
      }
      if (typeof rp.legLiftL === 'number') tLegLiftL = lerp(tLegLiftL, clamp(rp.legLiftL, 0, 1) * 18.0, rEnv);
      if (typeof rp.legLiftR === 'number') tLegLiftR = lerp(tLegLiftR, clamp(rp.legLiftR, 0, 1) * 18.0, rEnv);

      // Left Arm (symmetric rig coordinates: +shoulderL = raise out/up, -shoulderL = bring elbow inward)
      if (typeof rp.shoulderL === 'number') tArmLAngle = lerp(tArmLAngle, rp.shoulderL * 1.1, rEnv);
      if (typeof rp.elbowL === 'number') tElbowLAngle = lerp(tElbowLAngle, rp.elbowL * 1.5, rEnv);
      if (typeof rp.wristL === 'number') tWristLAngle = lerp(tWristLAngle, rp.wristL * 0.7, rEnv);
      if (typeof rp.fingerCurlL === 'number') tFingerCurlL = lerp(tFingerCurlL, clamp(rp.fingerCurlL, 0, 1), rEnv);
      if (rp.handL && rEnv > 0.2) tHandLGesture = rp.handL;

      // Right Arm (symmetric rig coordinates: +shoulderR = raise out/up, -shoulderR = bring elbow inward)
      if (typeof rp.shoulderR === 'number') {
        tArmRAngle = lerp(tArmRAngle, -rp.shoulderR * 1.1, rEnv);
        tSideArmAngle = lerp(tSideArmAngle, -rp.shoulderR * 0.95, rEnv);
      }
      if (typeof rp.elbowR === 'number') {
        tElbowRAngle = lerp(tElbowRAngle, -rp.elbowR * 1.5, rEnv);
        tSideElbowAngle = lerp(tSideElbowAngle, -Math.abs(rp.elbowR) * 1.1, rEnv);
      }
      if (typeof rp.wristR === 'number') tWristRAngle = lerp(tWristRAngle, -rp.wristR * 0.7, rEnv);
      if (typeof rp.fingerCurlR === 'number') tFingerCurlR = lerp(tFingerCurlR, clamp(rp.fingerCurlR, 0, 1), rEnv);
      if (rp.handR && rEnv > 0.2) tHandRGesture = rp.handR;

      // Head, Eyes, Brows & Mouth
      if (typeof rp.headTilt === 'number') tHeadAngle = lerp(tHeadAngle, rp.headTilt * 0.16, rEnv);
      if (typeof rp.headNod === 'number') tHeadOffY = lerp(tHeadOffY, rp.headNod * 2.1, rEnv);
      if (typeof rp.headTurn === 'number') tHeadOffX = lerp(tHeadOffX, rp.headTurn * 2.1, rEnv);
      if (typeof rp.eyeOpenL === 'number') tEyeOpenL = lerp(tEyeOpenL, clamp(rp.eyeOpenL, 0, 1.4), rEnv);
      if (typeof rp.eyeOpenR === 'number') tEyeOpenR = lerp(tEyeOpenR, clamp(rp.eyeOpenR, 0, 1.4), rEnv);
      if (typeof rp.eyeLookX === 'number') tEyeLookX = lerp(tEyeLookX, clamp(rp.eyeLookX, -1, 1), rEnv);
      if (typeof rp.eyeLookY === 'number') tEyeLookY = lerp(tEyeLookY, clamp(rp.eyeLookY, -1, 1), rEnv);
      if (typeof rp.browTilt === 'number') tBrowTilt = lerp(tBrowTilt, clamp(rp.browTilt, -1, 1), rEnv);
      if (rp.mouthShape && rEnv > 0.2) tMouthShape = rp.mouthShape;
      if (typeof rp.mouthOpen === 'number') tMouthOpen = lerp(tMouthOpen, clamp(rp.mouthOpen, 0, 1), rEnv);
    }

    // Clamp offsets to safe anatomical limits so joints NEVER detach or tear
    tTorsoOffX = clamp(tTorsoOffX, -1.6, 1.6);
    tTorsoOffY = clamp(tTorsoOffY, -2.4, 2.2);
    tHeadOffX = clamp(tHeadOffX, -2.2, 2.2);
    tHeadOffY = clamp(tHeadOffY, -2.2, 2.2);
    tTorsoAngle = clamp(tTorsoAngle, -0.095, 0.095);
    tHeadAngle = clamp(tHeadAngle, -0.18, 0.18);
    tCrouchDepth = clamp(tCrouchDepth, 0, 26);
    tJumpHeight = clamp(tJumpHeight, 0, 26);
    tLegLiftL = clamp(tLegLiftL, 0, 20);
    tLegLiftR = clamp(tLegLiftR, 0, 20);

    // Smoothly track target pose
    const blend = Math.min(1, 14 * dt);
    pose.bodyBounceY = lerp(pose.bodyBounceY, tBounceY, blend);
    pose.hipSwayX = lerp(pose.hipSwayX, tHipSwayX, blend);
    pose.crouchDepth = lerp(pose.crouchDepth, tCrouchDepth, blend);
    pose.jumpHeight = lerp(pose.jumpHeight, tJumpHeight, blend);
    pose.legLiftL = lerp(pose.legLiftL, tLegLiftL, blend);
    pose.legLiftR = lerp(pose.legLiftR, tLegLiftR, blend);
    pose.torsoOffX = lerp(pose.torsoOffX, tTorsoOffX, blend);
    pose.torsoOffY = lerp(pose.torsoOffY, tTorsoOffY, blend);
    pose.torsoAngle = lerp(pose.torsoAngle, tTorsoAngle, blend);
    pose.headOffX = lerp(pose.headOffX, tHeadOffX, blend);
    pose.headOffY = lerp(pose.headOffY, tHeadOffY, blend);
    pose.headAngle = lerp(pose.headAngle, tHeadAngle, blend);
    pose.armLAngle = lerp(pose.armLAngle, tArmLAngle, blend);
    pose.elbowLAngle = lerp(pose.elbowLAngle, tElbowLAngle, blend);
    pose.wristLAngle = lerp(pose.wristLAngle, tWristLAngle, blend);
    pose.fingerCurlL = lerp(pose.fingerCurlL, tFingerCurlL, blend);
    pose.handLGesture = tHandLGesture;
    pose.armRAngle = lerp(pose.armRAngle, tArmRAngle, blend);
    pose.elbowRAngle = lerp(pose.elbowRAngle, tElbowRAngle, blend);
    pose.wristRAngle = lerp(pose.wristRAngle, tWristRAngle, blend);
    pose.fingerCurlR = lerp(pose.fingerCurlR, tFingerCurlR, blend);
    pose.handRGesture = tHandRGesture;
    pose.armLiftY = lerp(pose.armLiftY, tArmLiftY, blend);
    pose.sideArmAngle = lerp(pose.sideArmAngle, tSideArmAngle, blend);
    pose.sideElbowAngle = lerp(pose.sideElbowAngle, tSideElbowAngle, blend);
    pose.eyeOpenL = lerp(pose.eyeOpenL, tEyeOpenL, blend);
    pose.eyeOpenR = lerp(pose.eyeOpenR, tEyeOpenR, blend);
    pose.eyeLookX = lerp(pose.eyeLookX, tEyeLookX, blend);
    pose.eyeLookY = lerp(pose.eyeLookY, tEyeLookY, blend);
    pose.browTilt = lerp(pose.browTilt, tBrowTilt, blend);
    pose.mouthShape = tMouthShape;
    pose.mouthOpen = lerp(pose.mouthOpen, tMouthOpen, blend);

    // ---- REAL KINEMATIC COUPLING: Body acceleration -> Soft-Body Springs! ----
    const netVerticalY = pose.bodyBounceY + pose.crouchDepth - pose.jumpHeight;
    const curTorsoX = pose.torsoOffX + pose.hipSwayX;
    const curTorsoY = pose.torsoOffY + netVerticalY;
    const curHeadX = pose.headOffX + pose.hipSwayX;
    const curHeadY = pose.headOffY + netVerticalY;
    const curHipX = pose.hipSwayX;
    const curHipY = netVerticalY;

    const invDt = 1 / Math.max(0.004, dt);
    const tVx = (curTorsoX - prevPoseKinematics.torsoX) * invDt;
    const tVy = (curTorsoY - prevPoseKinematics.torsoY) * invDt;
    const tAx = clamp((tVx - prevPoseKinematics.torsoVx) * invDt, -900, 900);
    const tAy = clamp((tVy - prevPoseKinematics.torsoVy) * invDt, -900, 900);

    const hVx = (curHeadX - prevPoseKinematics.headX) * invDt;
    const hVy = (curHeadY - prevPoseKinematics.headY) * invDt;
    const hAx = clamp((hVx - prevPoseKinematics.headVx) * invDt, -900, 900);
    const hAy = clamp((hVy - prevPoseKinematics.headVy) * invDt, -900, 900);

    const pVx = (curHipX - prevPoseKinematics.hipX) * invDt;
    const pVy = (curHipY - prevPoseKinematics.hipY) * invDt;
    const pAx = clamp((pVx - prevPoseKinematics.hipVx) * invDt, -900, 900);
    const pAy = clamp((pVy - prevPoseKinematics.hipVy) * invDt, -900, 900);

    // Inject inertial counter-force (-accel * dt * gain) into soft tissue, hair & skirt!
    const bustGain = 0.24 * dt;
    springs.bustL.vx -= tAx * bustGain;
    springs.bustL.vy -= tAy * bustGain * 1.18;
    springs.bustR.vx -= tAx * bustGain;
    springs.bustR.vy -= tAy * bustGain * 1.18;

    const gluteGain = 0.20 * dt;
    springs.gluteL.vx -= pAx * gluteGain;
    springs.gluteL.vy -= pAy * gluteGain * 1.12;
    springs.gluteR.vx -= pAx * gluteGain;
    springs.gluteR.vy -= pAy * gluteGain * 1.12;

    const hairGain = 0.18 * dt;
    springs.hairTop.vx -= hAx * hairGain;
    springs.hairTop.vy -= hAy * hairGain;
    springs.hairBangs.vx -= hAx * hairGain * 1.1;
    springs.hairBangs.vy -= hAy * hairGain * 1.1;
    springs.hairCurl.vx -= hAx * hairGain * 0.9;
    springs.hairCurl.vy -= hAy * hairGain * 0.9;

    const skirtGain = 0.30 * dt;
    springs.skirtL.vx -= pAx * skirtGain;
    springs.skirtL.vy -= pAy * skirtGain;
    springs.skirtR.vx -= pAx * skirtGain;
    springs.skirtR.vy -= pAy * skirtGain;

    prevPoseKinematics.torsoX = curTorsoX; prevPoseKinematics.torsoY = curTorsoY;
    prevPoseKinematics.torsoVx = tVx; prevPoseKinematics.torsoVy = tVy;
    prevPoseKinematics.headX = curHeadX; prevPoseKinematics.headY = curHeadY;
    prevPoseKinematics.headVx = hVx; prevPoseKinematics.headVy = hVy;
    prevPoseKinematics.hipX = curHipX; prevPoseKinematics.hipY = curHipY;
    prevPoseKinematics.hipVx = pVx; prevPoseKinematics.hipVy = pVy;
  }

  function stepPhysics(dt: number): void {
    const h = dt / 4;
    const springKeys = Object.keys(springs) as SpringName[];
    for (let step = 0; step < 4; step++) for (const k of springKeys) {
      const s = springs[k];
      s.vx += (-s.kx * s.x - s.dx * s.vx) * h; s.vy += (-s.ky * s.y - s.dy * s.vy) * h;
      s.x = Math.tanh((s.x + s.vx * h) / s.maxX) * s.maxX; s.y = Math.tanh((s.y + s.vy * h) / s.maxY) * s.maxY;
      s.cx += (s.x - s.cx) * Math.min(1, 14 * h); s.cy += (s.y - s.cy) * Math.min(1, 14 * h);
      s.squash += (clamp(s.vy * .002 - s.y * .011, -.095, .095) - s.squash) * Math.min(1, 16 * h);
    }
    const mat = SUIT_MATERIALS[state.suit];
    for (let i = contacts.length - 1; i >= 0; i--) {
      const c = contacts[i];
      if (c.hold > 0) { c.hold -= dt; c.depth += (c.targetDepth - c.depth) * Math.min(1, 18 * dt); }
      else { const dec = c.zone <= 4 ? mat.viscoDecay : 4.2; c.targetDepth = 0; c.depth *= Math.exp(-dec * dt); c.shearX *= Math.exp(-(dec + .8) * dt); c.shearY *= Math.exp(-(dec + .8) * dt); }
      c.clothDepth += (c.depth - c.clothDepth) * Math.min(1, lerp(12, 5.8, mat.clothLag) * dt);
      if (c.depth < .04 && c.clothDepth < .04 && c.hold <= 0) contacts.splice(i, 1);
    }
  }

  const cube = { x: 46, y: 145, vx: 0, vy: 0, size: 22, dragging: false, grabOffX: 0, grabOffY: 0, squash: 0, hitCooldown: 0 };
  const particles: Particle[] = [];
  function spawnBurst(x: number, y: number, type: 'heart' | 'star' | 'crumb', count = 6): void {
    for (let i = 0; i < count; i++) {
      const ang = -Math.PI * .5 + (Math.random() - .5) * 2.1, spd = 22 + Math.random() * 44;
      particles.push({ x: x + (Math.random() - .5) * 10, y: y + (Math.random() - .5) * 10, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 12, life: .75 + Math.random() * .55, type });
    }
  }

  function setMood(m: AvatarMood, dur = 2): void {
    const changed = state.mood !== m;
    state.mood = m;
    state.moodTimer = Math.max(state.moodTimer, dur);
    if (changed) emitSnapshot(true);
  }

  function addAffection(a: number): void {
    state.affection = clamp(state.affection + a, 0, 100);
    emitSnapshot(false);
  }

  function addBlush(a: number): void {
    state.blush = clamp(state.blush + a, .12, 1);
    emitSnapshot(false);
  }

  function stepCube(dt: number): void {
    if (!state.cubeEnabled) return;
    if (cube.hitCooldown > 0) cube.hitCooldown -= dt;
    cube.squash *= Math.exp(-10 * dt);
    if (!cube.dragging) {
      cube.vy += 130 * dt; cube.vx *= Math.exp(-1.2 * dt); cube.vy *= Math.exp(-1.2 * dt); cube.x += cube.vx * dt; cube.y += cube.vy * dt;
      const half = cube.size * .5;
      if (cube.x < half + 4) { cube.x = half + 4; cube.vx = Math.abs(cube.vx) * .72; cube.squash = .25; }
      if (cube.x > W - half - 4) { cube.x = W - half - 4; cube.vx = -Math.abs(cube.vx) * .72; cube.squash = .25; }
      if (cube.y < half + 6) { cube.y = half + 6; cube.vy = Math.abs(cube.vy) * .72; cube.squash = .25; }
      if (cube.y > 332 - half) { cube.y = 332 - half; cube.vy = -Math.abs(cube.vy) * .58; cube.vx *= .88; cube.squash = .2; }
    }
    const half = cube.size * .5;
    for (const [px, py] of [[cube.x, cube.y], [cube.x - half * .85, cube.y], [cube.x + half * .85, cube.y], [cube.x, cube.y - half * .85], [cube.x, cube.y + half * .85]]) {
      const sx = px | 0, sy = py | 0; if (sx < 0 || sx >= W || sy < 0 || sy >= H) continue;
      const z = planes.dynamicHitZone[sy * W + sx]; if (z === 0) continue;
      const speed = Math.hypot(cube.vx, cube.vy);
      if (z === 10) {
        applyImpulse(sx < CX ? 'skirtL' : 'skirtR', clamp(cube.vx * .72, -120, 120), clamp(cube.vy * .65 - 38, -135, 110));
        if (!cube.dragging && cube.hitCooldown <= 0 && speed > 22) { cube.vx *= .82; cube.vy -= 18; cube.hitCooldown = .14; spawnBurst(sx, sy, 'star', 4); }
      } else if (z >= 1 && z <= 7) {
        pushViscoContact(sx, sy, z, clamp(2 + speed * .012, 2, 4.4), 15, clamp(cube.vx * .015, -2.6, 2.6), clamp(cube.vy * .015, -2.6, 2.6));
        if (!cube.dragging && cube.hitCooldown <= 0 && speed > 18) {
          applyImpulse(SPRING_ZONE_MAP[z], clamp(cube.vx * .65, -100, 100), clamp(cube.vy * .65 - 26, -110, 110));
          cube.vx = -cube.vx * .58 + (cube.x < CX ? -40 : 40); cube.vy = -cube.vy * .52 - 36; cube.squash = .35; cube.hitCooldown = .14;
          spawnBurst(sx, sy, 'star', 5);
          if (speed > 85) {
            setMood('Sorprendida', 1.6);
            addBlush(.14);
            triggerAnimation('surprised', 1.25);
            emitInteraction('cube_hit', ZONE_NAMES[z] || 'cuerpo');
          }
        } else if (cube.dragging && speed > 15) applyImpulse(SPRING_ZONE_MAP[z], clamp(cube.vx * .18, -32, 32), clamp(cube.vy * .18, -32, 32));
      } else if (z === 8 && !cube.dragging && cube.hitCooldown <= 0 && speed > 30) {
        cube.vx = -cube.vx * .5; cube.vy = -Math.abs(cube.vy) * .4 - 22; cube.hitCooldown = .2;
        setMood('Sorprendida', 1.4); addBlush(.12); spawnBurst(sx, sy, 'star', 4);
        triggerAnimation('surprised', 1.25);
        emitInteraction('cube_hit', 'rostro');
      }
      break;
    }
  }

  function stepParticles(dt: number): void {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]; p.life -= dt; if (p.life <= 0) { particles.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.type === 'heart') { p.vy -= 14 * dt; p.vx *= .96; } else if (p.type === 'crumb') p.vy += 125 * dt; else { p.vx *= .94; p.vy *= .94; }
    }
    if (state.eatAnim) {
      state.eatAnim.t += dt * 1.45;
      if (state.eatAnim.t >= 1) {
        state.eatAnim = null; addAffection(15); addBlush(.18); setMood('Feliz', 2.6);
        applyImpulse('hairBangs', 18, -14); applyImpulse('hairTop', -14, -18);
        spawnBurst(CX, SKEL.mouthY, 'crumb', 7); spawnBurst(CX, SKEL.headTopY + 12, 'heart', 6);
        emitSnapshot(true);
      }
    }
  }

  function stepTamagotchi(dt: number): void {
    state.time += dt; state.blinkTimer -= dt;
    if (state.blinkTimer <= 0) { state.blinkPhase += dt * 11; if (state.blinkPhase >= Math.PI) { state.blinkPhase = 0; state.blinkTimer = 2.4 + Math.random() * 3.2; } }
    state.blush += ((state.affection > 85 ? .24 : .14) - state.blush) * Math.min(1, .28 * dt);
    if (state.affection > 35) state.affection -= .18 * dt;
    if (state.moodTimer > 0) {
      state.moodTimer -= dt;
      if (state.moodTimer <= 0) {
        state.mood = state.blush > .58 ? 'Ruborizada' : 'Tranquila';
        emitSnapshot(true);
      }
    }
  }

  // ---- INTERACCIÓN DE PUNTERO (ALINEADA CON dynamicHitZone!) ----
  const getLogicalCoords = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: clamp((e.clientX - r.left) * (W / r.width), 0, W - 1), y: clamp((e.clientY - r.top) * (H / r.height), 0, H - 1) };
  };

  function applyHandContact(x: number, y: number, z: number, isInitial: boolean): void {
    const sName = SPRING_ZONE_MAP[z];
    const spd = Math.hypot(pointer.vx, pointer.vy), mat = SUIT_MATERIALS[state.suit], onSuit = state.suit !== 'none' && z <= 4;
    const pts = state.handEnabled ? [[x, y, 3.4 * mat.tension, 14], [x - 6, y - 6, 2.3 * mat.tension, 9], [x + 1, y - 8, 2.5 * mat.tension, 9], [x + 7, y - 5, 2.1 * mat.tension, 9]] : [[x, y, 3.5 * mat.tension, 14]];
    for (const [pxR, pyR, dep, rad] of pts) {
      const px = pxR | 0, py = pyR | 0;
      if (px >= 0 && px < W && py >= 0 && py < H && planes.dynamicHitZone[py * W + px] === z) pushViscoContact(px, py, z, dep, rad, clamp(pointer.vx * .012, -2.4, 2.4), clamp(pointer.vy * .012, -2.4, 2.4));
    }
    if (onSuit) {
      const slipSpring: SpringName = (state.view === 'side' ? z <= 2 : x < CX) ? 'clothSlipL' : 'clothSlipR';
      const pm = state.pullFabric ? 2.4 : 1;
      if (isInitial) applyImpulse(slipSpring, (x < CX ? -10 : 10) * mat.slipGain * pm, 16 * mat.slipGain);
      else {
        applyImpulse(slipSpring, clamp(pointer.vx * .16 * mat.slipGain * pm, -46, 46), clamp(pointer.vy * .16 * mat.slipGain * pm, -46, 46));
        if (state.view === 'front' && state.zipper > 8 && Math.abs(x - CX) < 34) {
          const out = x < CX ? -pointer.vx : pointer.vx; if (out > 15) springs.lapelSpread.vx += clamp(out * .18 * pm, 0, 55);
        }
      }
      if (spd > 210 && (state.suit === 'original' || state.suit === 'marfil') && Math.random() < .22) spawnBurst(x, y, 'star', 2);
    }
    if (isInitial) {
      applyImpulse(sName, (x < CX ? -16 : 16) * mat.tension, 36 * mat.tension);
      if (z <= 4) {
        addBlush(.08); setMood('Ruborizada', 1.6);
        triggerAnimation('shy', 1.6);
        emitInteraction('touch_soft', ZONE_NAMES[z]);
      } else {
        addAffection(1.8); setMood('Mimada', 1.6); spawnBurst(x, y - 8, 'heart', 2);
        triggerAnimation('petted', 1.8);
        emitInteraction('pet_hair', ZONE_NAMES[z]);
      }
    } else {
      const bf = (onSuit && state.pullFabric) ? .06 : .14 * mat.tension;
      applyImpulse(sName, clamp(pointer.vx * bf, -28, 28), clamp(pointer.vy * bf, -28, 28));
      pointer.petAccum += spd * .016;
      if (pointer.petAccum > 20) {
        pointer.petAccum = 0; addAffection(1.6); addBlush(.06);
        if (spd > 280) {
          setMood('Sorprendida', 1.4); spawnBurst(x, y, 'star', 3);
          triggerAnimation('surprised', 1.15);
        } else {
          setMood(z >= 5 ? 'Mimada' : 'Ruborizada', 1.8); spawnBurst(x, y - 10, 'heart', 2);
          triggerAnimation(z >= 5 ? 'petted' : 'shy', 1.6);
        }
        emitInteraction(z >= 5 ? 'pet_hair' : 'touch_soft', ZONE_NAMES[z]);
      }
    }
  }

  const onPointerDown = (e: PointerEvent): void => {
    const p = getLogicalCoords(e); pointer.x = p.x; pointer.y = p.y; pointer.down = true; pointer.inside = true;
    pointer.draggingZipper = false; pointer.draggingSkirt = false;
    if (!hintDismissed) { hintDismissed = true; emitSnapshot(true); }
    if (state.cubeEnabled && Math.abs(p.x - cube.x) <= cube.size * .65 && Math.abs(p.y - cube.y) <= cube.size * .65) {
      cube.dragging = true; cube.grabOffX = cube.x - p.x; cube.grabOffY = cube.y - p.y; cube.vx = 0; cube.vy = 0; canvas.setPointerCapture(e.pointerId); return;
    }
    const z = planes.dynamicHitZone[(p.y | 0) * W + (p.x | 0)]; pointer.activeZone = z;
    if (z === 11 && state.view === 'front' && state.suit !== 'none') { pointer.draggingZipper = true; canvas.setPointerCapture(e.pointerId); return; }
    if (z === 10) {
      pointer.draggingSkirt = true; applyImpulse(p.x < CX ? 'skirtL' : 'skirtR', p.x < CX ? -22 : 22, -42); addBlush(.09); setMood('Sorprendida', 1.3);
      triggerAnimation('shy', 1.5);
      emitInteraction('pull_skirt', state.suit === 'maid' ? 'falda' : 'faja de seda');
      canvas.setPointerCapture(e.pointerId); return;
    }
    if (z >= 1 && z <= 7) applyHandContact(p.x, p.y, z, true);
    else if (z === 8) {
      addBlush(.14); addAffection(2.5); setMood('Mimada', 1.8); spawnBurst(p.x, p.y - 6, 'heart', 3);
      triggerAnimation('petted', 1.8);
      emitInteraction('pet_face', 'mejillas');
    }
    canvas.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent): void => {
    const p = getLogicalCoords(e); pointer.inside = true;
    const dx = p.x - pointer.x, dy = p.y - pointer.y; pointer.x = p.x; pointer.y = p.y;
    pointer.vx = lerp(pointer.vx, dx * 60, .55); pointer.vy = lerp(pointer.vy, dy * 60, .55);
    const z = planes.dynamicHitZone[(p.y | 0) * W + (p.x | 0)];
    let zLabel = ZONE_NAMES[z] || '—';
    if (state.view === 'side' && z === 1) zLabel = 'Busto (Lateral)';
    if (state.view === 'side' && z === 3) zLabel = 'Glúteos (Lateral)';
    if (z === 10) zLabel = state.suit === 'maid' ? 'Falda / Delantal' : 'Faja de Seda';
    if (zLabel !== currentZoneLabel) {
      currentZoneLabel = zLabel;
      emitSnapshot(true);
    }

    if (cube.dragging) { cube.x = clamp(p.x + cube.grabOffX, 12, W - 12); cube.y = clamp(p.y + cube.grabOffY, 12, H - 24); cube.vx = pointer.vx * .7; cube.vy = pointer.vy * .7; return; }
    if (pointer.draggingZipper) {
      const nz = Math.round(clamp((p.y - (SKEL.neckMidY + 5 + pose.torsoOffY + pose.bodyBounceY)) / Math.max(1, SKEL.waistY - SKEL.neckMidY - 3), 0, 1) * 100);
      if (nz !== state.zipper) {
        state.zipper = nz;
        rebuildSuitOnly();
        if (nz > 45) { addBlush(.025); setMood('Ruborizada', 1.5); triggerAnimation('shy', 1.6); }
        emitSnapshot(true);
      }
      return;
    }
    if (pointer.draggingSkirt) {
      const m = state.pullFabric ? .42 : .28; applyImpulse(p.x < CX ? 'skirtL' : 'skirtR', clamp(pointer.vx * m, -75, 75), clamp(pointer.vy * m, -85, 65));
      if (dy < -1.5) { addBlush(.025); setMood('Ruborizada', 1.5); }
      return;
    }
    if (pointer.down) {
      const hitZ = z !== 0 ? z : pointer.activeZone;
      if (hitZ >= 1 && hitZ <= 7 && z >= 1 && z <= 7) applyHandContact(p.x, p.y, z, false);
      else if (z === 8) {
        pointer.petAccum += Math.hypot(dx, dy);
        if (pointer.petAccum > 14) {
          pointer.petAccum = 0; addAffection(2.2); addBlush(.09); setMood('Mimada', 2); spawnBurst(p.x, p.y - 8, 'heart', 2);
          triggerAnimation('petted', 1.8);
          emitInteraction('pet_face', 'rostro');
        }
      }
    }
  };

  const onPointerUp = (e: PointerEvent): void => {
    if (cube.dragging) cube.dragging = false;
    else if (pointer.draggingZipper) {
      pointer.draggingZipper = false; applyImpulse('bustL', -14, 18); applyImpulse('bustR', 14, 18);
      emitInteraction('zipper', `${state.zipper}%`);
    }
    else if (pointer.draggingSkirt) { pointer.draggingSkirt = false; applyImpulse('skirtL', clamp(pointer.vx * .25, -55, 55), clamp(pointer.vy * .25, -55, 55)); applyImpulse('skirtR', clamp(pointer.vx * .25, -55, 55), clamp(pointer.vy * .25, -55, 55)); }
    else if (pointer.down && pointer.activeZone >= 1 && pointer.activeZone <= 7) {
      applyImpulse(SPRING_ZONE_MAP[pointer.activeZone], clamp(pointer.vx * .25, -45, 45), clamp(pointer.vy * .25 - 34, -72, 72));
    }
    pointer.down = false; pointer.activeZone = 0;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
  };

  const onPointerLeave = (): void => {
    pointer.inside = false;
    if (currentZoneLabel !== '—') {
      currentZoneLabel = '—';
      emitSnapshot(true);
    }
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave);

  // ---- RENDERIZADO 60 FPS ARTICULADO Y PIXEL-ALIGNED ----
  const setPx = (x: number, y: number, col: number): void => {
    const ix = x | 0, iy = y | 0;
    if (ix >= 0 && ix < W && iy >= 0 && iy < H && col !== 0) frameU32[iy * W + ix] = col;
  };

  function evalViscoLocal(x: number, y: number, zMin: number, zMax: number): { dx: number; dy: number; shade: number; wrinkle: number } {
    let dx = 0, dy = 0, shade = 0, wrinkle = 0; const mat = SUIT_MATERIALS[state.suit];
    for (const c of contacts) {
      if (c.zone < zMin || c.zone > zMax) continue;
      const rx = x - c.x, ry = y - c.y, d2 = rx * rx + ry * ry, R = c.radius; if (d2 >= R * R) continue;
      const dist = Math.sqrt(d2) + 1e-4, t = dist / R, nx = rx / dist, ny = ry / dist;
      if (t < .62) { const core = 1 - t / .62, k = core * core * c.depth; dx += nx * k * 1.15 - c.shearX * core * .55; dy += ny * k * 1.15 - c.shearY * core * .55; shade -= core * c.depth * 4.6; wrinkle += Math.sin(t * 14) * core * c.clothDepth * (mat.wrinkleAmp * .25); }
      else { const ring = Math.sin(((t - .62) / .38) * Math.PI), k = ring * c.depth * .55; dx -= nx * k; dy -= ny * k; shade += ring * c.depth * 2.4; wrinkle += ring * Math.cos(Math.atan2(ry, rx) * 4) * c.clothDepth * (mat.wrinkleAmp * .35); }
    }
    return { dx: clamp(dx, -4.5, 4.5), dy: clamp(dy, -4.5, 4.5), shade: clamp(shade, -24, 16), wrinkle: clamp(wrinkle, -18, 18) };
  }

  /**
   * Nearest-neighbor inverse-mapped rotated pixel blitter (zero gaps, 100% crisp pixel art!).
   */
  function blitRotatedBuffer(
    srcBody: Uint32Array,
    srcSuit: Uint32Array | null,
    srcPivotX: number,
    srcPivotY: number,
    dstPivotX: number,
    dstPivotY: number,
    angleRad: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    zoneId: number,
    srcYMin = 0,
    srcYMax = H - 1,
  ): void {
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    const minX = Math.max(0, x0 | 0), maxX = Math.min(W - 1, x1 | 0);
    const minY = Math.max(0, y0 | 0), maxY = Math.min(H - 1, y1 | 0);
    for (let y = minY; y <= maxY; y++) {
      const row = y * W;
      const dy = y - dstPivotY;
      for (let x = minX; x <= maxX; x++) {
        const dx = x - dstPivotX;
        const sx = Math.round(srcPivotX + dx * cosA + dy * sinA);
        const sy = Math.round(srcPivotY - dx * sinA + dy * cosA);
        if (sx < 0 || sx >= W || sy < srcYMin || sy > srcYMax) continue;
        const sIdx = sy * W + sx;
        const col = (srcSuit && srcSuit[sIdx] !== 0) ? srcSuit[sIdx] : srcBody[sIdx];
        if (col !== 0) {
          frameU32[row + x] = col;
          if (zoneId > 0) planes.dynamicHitZone[row + x] = zoneId;
        }
      }
    }
  }

  /**
   * Draws expressive 3D-faithful face directly into headFrameBuf (local head space) so
   * eyelids, lashes, tears, cheeks & lips tilt seamlessly with the head!
   */
  function composeHeadLocalBuffer(): void {
    headFrameBuf.set(planes.headRGBA);
    const S = SKEL;
    const putFace = (x: number, y: number, col: number) => {
      const ix = Math.round(x), iy = Math.round(y);
      if (ix >= 0 && ix < W && iy >= 0 && iy < H && masks.head[iy * W + ix]) headFrameBuf[iy * W + ix] = col;
    };

    if (state.view === 'side') {
      // Expressive side-profile face (lilac eyelid, lash wing, purple tear, red cheek, cherry lip!)
      for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) if (dx * dx + dy * dy <= 9) putFace(SX - 23 + dx, 71 + dy, dx * dx + dy * dy <= 2 ? PAL.cheekSoft : PAL.cheek);
      for (let y = 63; y <= 74; y++) { putFace(SX - 25, y, PAL.tear); putFace(SX - 24, y, PAL.tearDark); }
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 3; dx++) {
        if ((dx * dx) / 14 + (dy * dy) / 16 > 1) continue;
        putFace(SX - 25 + dx, 59 + dy, dy < 0.8 ? (dy < -1.5 ? PAL.lidHi : PAL.lidBase) : PAL.outline);
      }
      for (const [lx, ly] of [[2, 0], [3, -1], [4, -2], [5, -2]]) putFace(SX - 25 + lx, 60 + ly, PAL.outline);
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (dx * dx + dy * dy <= 4) putFace(SX - 29 + dx, 73 + dy, dy === 0 ? PAL.lipDark : PAL.lipBase);
      return;
    }

    if (state.view !== 'front') return;

    const blinkAmt = Math.sin(state.blinkPhase);
    const isHappy =
      pose.mouthShape === 'smile' ||
      state.mood === 'Feliz' ||
      state.mood === 'Mimada' ||
      state.currentAnim === 'happy' ||
      state.currentAnim === 'petted' ||
      state.currentAnim === 'cheer' ||
      state.currentAnim === 'wave_hand';
    const isSurp =
      pose.eyeOpenL > 1.15 ||
      pose.eyeOpenR > 1.15 ||
      state.mood === 'Sorprendida' ||
      state.currentAnim === 'surprised';
    const isShy = state.currentAnim === 'shy' || state.currentAnim === 'peekaboo' || state.currentAnim === 'shiver';
    const isPout = pose.mouthShape === 'pout' || pose.browTilt > 0.35 || state.currentAnim === 'pout';
    const isKiss =
      pose.mouthShape === 'kiss' ||
      (state.currentAnim === 'blow_kiss' && state.animTime < Math.max(0.4, state.animDuration * 0.65));
    const isWinkL = pose.eyeOpenL < 0.35 && pose.eyeOpenR >= 0.5;
    const isWinkR =
      (pose.eyeOpenR < 0.35 && pose.eyeOpenL >= 0.5) ||
      state.currentAnim === 'wink' ||
      (state.currentAnim === 'blow_kiss' && state.animTime > 0.25 && state.animTime < 1.35) ||
      (state.currentAnim === 'tease' && state.animTime > 0.45 && state.animTime < 1.25);
    const bothEyesClosed = pose.eyeOpenL < 0.35 && pose.eyeOpenR < 0.35;
    const lookX = isShy ? -0.85 : clamp(pose.eyeLookX, -1, 1);
    const lookY = clamp(pose.eyeLookY, -1, 1);

    for (const s of [-1, 1]) {
      // Crisp 2-px purple vertical puppet tears
      const tx = Math.round(CX + s * S.eyeOffX);
      for (let y = Math.round(S.eyeY + 4); y <= Math.round(S.mouthY + 1); y++) {
        putFace(tx, y, PAL.tear);
        putFace(tx + s, y, PAL.tearDark);
      }

      // Vibrant red circular cheeks + soft blush bloom
      const mx = Math.round(CX + s * 15.2), my = Math.round(S.cheekY);
      for (let dy = -6; dy <= 6; dy++) for (let dx = -6; dx <= 6; dx++) {
        const d = Math.hypot(dx, dy);
        if (d <= 3.7) putFace(mx + dx, my + dy, d < 1.7 ? PAL.cheekSoft : PAL.cheek);
        else if (state.blush > .2 && d <= 6.2 && bayer(mx + dx, my + dy) + .5 < (1 - (d - 3.7) / 2.5) * (state.blush - .14) * 1.2) {
          putFace(mx + dx, my + dy, PAL.cheekSoft);
        }
      }

      // BIGGER, EXPRESSIVE 3D-FAITHFUL ALMOND EYES WITH LILAC HALF-CLOSED EYELIDS!
      const ex = Math.round(CX + s * S.eyeOffX), ey = Math.round(S.eyeY);
      const eyeClosedForWink = (s === -1 && isWinkL) || (s === 1 && isWinkR) || bothEyesClosed;
      for (let dy = -6; dy <= 5; dy++) for (let dx = -6; dx <= 6; dx++) {
        // Soft almond contour
        if ((dx * dx) / 38 + (dy * dy) / 30 > 1) continue;
        if ((isHappy || eyeClosedForWink) && blinkAmt < 0.5) {
          // Unmistakable joyful smiling '^ ^' or playful wink curve across the lush lilac eyelid!
          const smileArc = 0.6 + (dx * dx) * 0.10;
          if (Math.abs(dy - smileArc) <= 1.05) putFace(ex + dx, ey + dy, PAL.outline);
          else if (dy < smileArc) putFace(ex + dx, ey + dy, dy < smileArc - 2.6 ? PAL.lidHi : PAL.lidBase);
          continue;
        }
        // Upper ~58% is lush lilac-purple eyelid (lowers cleanly on blink)
        const lidLine = 0.7 + blinkAmt * 5.2 + (isSurp ? -2.8 : 0) + (dx * s) * 0.14;
        if (dy < lidLine) {
          let lidCol: number = PAL.lidBase;
          if (dy < lidLine - 3.2) lidCol = PAL.lidHi;
          else if (dy >= lidLine - 1.1) lidCol = PAL.outline; // Crisp dark upper lash crease
          else if (dy < -3.8) lidCol = PAL.lidShadow;
          putFace(ex + dx, ey + dy, lidCol);
        } else {
          putFace(ex + dx, ey + dy, PAL.outline);
        }
      }
      // Subtle glossy eye catchlight
      if (blinkAmt < .50 && !isHappy && !eyeClosedForWink) {
        putFace(ex + Math.round(lookX * 1.6), ey + 2 + Math.round(lookY * 0.7), PAL.whitePure);
      }
      // Swept winged black eyelashes extending outward
      for (const [lx, ly] of [[6, 0], [7, -1], [8, -2], [9, -2], [7, 0], [6, 1]]) {
        putFace(ex + s * lx, ey + ly + (isHappy || eyeClosedForWink ? 1 : 0), PAL.outline);
      }
      // Delicate arched eyebrows (angled inward if pouting!)
      for (let dx = -4; dx <= 4; dx++) {
        const browRaise = isSurp ? -2 : (isShy ? 1 : 0);
        const poutSlope = isPout ? Math.round(-dx * s * 0.35) : Math.round(dx * dx * 0.14);
        putFace(ex + dx, ey - 8.5 + browRaise + poutSlope, PAL.outline);
      }
    }

    // Thin horizontal puppet mouth seam
    const my = Math.round(S.mouthY);
    for (let dx = -13; dx <= 13; dx++) {
      const smileCurve = isPout
        ? -Math.round(dx * dx * 0.018)
        : Math.round(dx * dx * (isHappy || isWinkL || isWinkR ? .035 : .007));
      putFace(CX + dx, my + 1 - smileCurve, (dx & 2) === 0 ? PAL.outline : PAL.outlineSoft);
    }

    // Plush centered cherry-red doll lips (with chew / open surprise / kiss pucker / speaking cadence / direct rig mouthOpen!)
    const isSpeakingAnim =
      pose.mouthShape === 'talk' ||
      state.currentAnim === 'talk' ||
      state.currentAnim === 'giggle' ||
      state.currentAnim === 'happy' ||
      state.currentAnim === 'dance' ||
      state.currentAnim === 'cheer' ||
      state.currentAnim === 'wave_hand';
    const talkPulse = isSpeakingAnim ? Math.abs(Math.sin(state.animTime * 14.5)) * 1.35 : 0;
    const rigMouthOpen = pose.mouthOpen * 2.4;
    const chewPulse = (state.currentAnim === 'eat' && state.animTime > 0.45) ? Math.abs(Math.sin(state.animTime * 16)) * 1.4 : Math.max(talkPulse, rigMouthOpen);
    const openM = (state.eatAnim && state.eatAnim.t > .58) ? Math.sin(((state.eatAnim.t - .58) / .42) * Math.PI) * 2.8 : (isSurp ? Math.max(2.0, rigMouthOpen) : chewPulse);
    const lipRy = isKiss ? 4.2 : 3.5 + openM;
    const lipRxSq = isKiss ? 19 : (isPout ? 28 : 38);
    for (let dy = -Math.ceil(lipRy); dy <= Math.ceil(lipRy); dy++) for (let dx = -7; dx <= 7; dx++) {
      const cupid = (!isKiss && dy < 0 && Math.abs(dx) <= 1.2) ? .55 : 0;
      if ((dx * dx) / lipRxSq + ((dy + cupid) * (dy + cupid)) / (lipRy * lipRy) > 1) continue;
      if ((openM > .6 || isKiss) && (dx * dx) / (isKiss ? 5 : 12) + (dy * dy) / (lipRy * lipRy * .42) < 1) putFace(CX + dx, my + dy, PAL.lipDark);
      else if (dy === 0 && Math.abs(dx) <= (isKiss ? 3 : 5)) putFace(CX + dx, my + dy, PAL.lipDark);
      else putFace(CX + dx, my + dy, (dy === 1 && Math.abs(dx) <= 2) ? PAL.lipHi : PAL.lipBase);
    }
  }

  function renderSoftPlane(
    x0: number, y0: number, x1: number, y1: number,
    sL: SpringState, sR: SpringState,
    cxL: number, cyL: number, cxR: number, cyR: number,
    zMin: number, zMax: number, isGlute: boolean,
    baseOffX: number, baseOffY: number,
  ): void {
    const mat = SUIT_MATERIALS[state.suit], hasSuit = state.suit !== 'none', cSlipL = springs.clothSlipL, cSlipR = springs.clothSlipR;
    const spread = Math.max(0, springs.lapelSpread.x), clothLag = Math.hypot(sL.x - sL.cx, sL.y - sL.cy) + Math.hypot(sR.x - sR.cx, sR.y - sR.cy) + Math.hypot(cSlipL.x, cSlipL.y) + Math.hypot(cSlipR.x, cSlipR.y);
    const minX = Math.max(0, (x0 + baseOffX - 4) | 0), maxX = Math.min(W - 1, (x1 + baseOffX + 4) | 0);
    const minY = Math.max(0, (y0 + baseOffY - 4) | 0), maxY = Math.min(H - 1, (y1 + baseOffY + 4) | 0);
    const zipTipY = SKEL.neckMidY + 5 + (state.zipper / 100) * (SKEL.waistY - SKEL.neckMidY - 5) + baseOffY;

    for (let y = minY; y <= maxY; y++) {
      const row = y * W;
      const ly = Math.round(y - baseOffY);
      if (ly < 0 || ly >= H) continue;
      for (let x = minX; x <= maxX; x++) {
        const lx = Math.round(x - baseOffX);
        if (lx < 0 || lx >= W) continue;
        const lIdx = ly * W + lx;
        const wL = planes.softWeightL[lIdx], wR = planes.softWeightR[lIdx];
        if (wL === 0 && wR === 0) continue;

        let ox = sL.x * wL + sR.x * wR, oy = sL.y * wL + sR.y * wR;
        if (wL > .01 && Math.abs(sL.squash) > .002) { ox += (lx - cxL) * sL.squash * wL * .44; oy -= (ly - cyL) * sL.squash * wL * .52; }
        if (wR > .01 && Math.abs(sR.squash) > .002) { ox += (lx - cxR) * sR.squash * wR * .44; oy -= (ly - cyR) * sR.squash * wR * .52; }

        const visco = evalViscoLocal(x, y, zMin, zMax);
        const sx = Math.round(lx - ox + visco.dx), sy = Math.round(ly - oy + visco.dy);
        const dstIdx = row + x;
        let wroteSoft = false;

        if (sx >= 0 && sx < W && sy >= 0 && sy < H) {
          const sIdx = sy * W + sx; const uCol = planes.softRGBA[sIdx];
          if (uCol !== 0) {
            const ud = visco.shade + (planes.softLayerID[sIdx] >= 2 ? visco.wrinkle * .6 : 0);
            frameU32[dstIdx] = Math.abs(ud) > 2.4 ? shadePacked(uCol, Math.round(ud / 6) * 6) : uCol;
            wroteSoft = true;
          }
        }
        if (hasSuit) {
          let tx = lerp(sL.x, sL.cx, mat.clothLag) * wL + lerp(sR.x, sR.cx, mat.clothLag) * wR + (cSlipL.x * wL + cSlipR.x * wR) * .72;
          let ty = lerp(sL.y, sL.cy, mat.clothLag) * wL + lerp(sR.y, sR.cy, mat.clothLag) * wR + (cSlipL.y * wL + cSlipR.y * wR) * .72;
          if (!isGlute && state.view === 'front' && state.zipper > 8 && spread > .15) tx += (lx < CX ? -spread : spread) * smoothstep(38, 4, Math.abs(lx - CX));
          if (wL > .01 && Math.abs(sL.squash) > .002) { tx += (lx - cxL) * sL.squash * wL * .44; ty -= (ly - cyL) * sL.squash * wL * .52; }
          if (wR > .01 && Math.abs(sR.squash) > .002) { tx += (lx - cxR) * sR.squash * wR * .44; ty -= (ly - cyR) * sR.squash * wR * .52; }
          const csx = Math.round(lx - tx + visco.dx * (.82 + mat.clothLag * .25)), csy = Math.round(ly - ty + visco.dy * (.82 + mat.clothLag * .25));
          if (csx >= 0 && csx < W && csy >= 0 && csy < H) {
            const sCol = planes.softSuitRGBA[csy * W + csx];
            if (sCol !== 0) {
              let fd = visco.shade * mat.tension;
              if (state.suit === 'original') { fd += visco.wrinkle * .95; if (visco.shade < -3.5 && Math.sin((x - y) * .55) > .2) fd += mat.glintAmp * clamp(-visco.shade / 16, 0, 1); }
              else if (state.suit === 'maid') fd += visco.wrinkle * 1.65 + (clothLag > .25 ? Math.sin(x * .42 + y * .28) * Math.min(clothLag, 2.5) * 6.5 : 0);
              else if (state.suit === 'marfil') fd += visco.wrinkle * 1.15 + ((clothLag > .2 || Math.abs(visco.shade) > 2.5) ? Math.sin(x * .32 - y * .48 + state.time * 4.5) * (mat.glintAmp * .65) : 0);
              frameU32[dstIdx] = Math.abs(fd) > 2.4 ? shadePacked(sCol, Math.round(fd / 6) * 6) : sCol;
              wroteSoft = true;
            }
          }
        }
        if (wroteSoft) {
          let z = isGlute ? (lx < CX ? 3 : 4) : (lx < CX ? 1 : 2);
          if (state.view === 'side') z = isGlute ? 3 : 1;
          if (!isGlute && state.view === 'front' && hasSuit && Math.hypot(x - (CX + baseOffX), y - zipTipY) <= 9) z = 11;
          planes.dynamicHitZone[dstIdx] = z;
        }
      }
    }
  }

  function renderDynamicSkirtLayer(baseOffX: number, baseOffY: number): void {
    if (state.suit !== 'maid' && state.suit !== 'marfil') return;
    const S = SKEL, skL = springs.skirtL, skR = springs.skirtR, topY = state.view === 'side' ? 160 : Math.floor(S.waistY - 4), botY = state.suit === 'maid' ? Math.ceil(S.thighBandY + 34) : Math.ceil(S.kneeY + 8);
    const sway = Math.sin(state.time * 2.6) * .45;
    const minY = Math.max(0, Math.floor(topY + baseOffY - 6)), maxY = Math.min(H - 1, Math.ceil(botY + baseOffY + 6));
    for (let y = minY; y <= maxY; y++) {
      const row = y * W;
      const ly = y - baseOffY;
      // Match lower-body hip-to-knee sway curve so the skirt stays 100% locked to the thighs!
      const swayK = smoothstep(348, 200, ly);
      const rowOffX = baseOffX * swayK;
      const t = smoothstep(topY + 4, botY - 8, ly), wx = Math.sin(t * 4.2 - state.time * 5.2) * (Math.abs(skL.vx) + Math.abs(skR.vx)) * .015 * t;
      for (let x = Math.max(0, Math.floor(CX - 82 + rowOffX)); x <= Math.min(W - 1, Math.ceil(CX + 82 + rowOffX)); x++) {
        const lx = x - rowOffX;
        const bR = smoothstep(CX - 20, CX + 20, lx), bL = 1 - bR, ox = (skL.x * bL + skR.x * bR + sway) * t + wx, rl = (skL.y * bL + skR.y * bR) * t;
        const sx = Math.round(lx - ox), sy = Math.round(ly - (rl < 0 ? rl * 1.25 : rl * .45));
        if (sx < 0 || sx >= W || sy < 0 || sy >= H) continue;
        let col = planes.skirtRGBA[sy * W + sx]; if (col === 0) continue;
        const amp = (Math.hypot(skL.x, skL.y) * bL + Math.hypot(skR.x, skR.y) * bR) * t;
        if (amp > .6) { const fold = Math.sin((lx - CX) * .48 + ox * .4) * Math.min(amp, 6) * 2.6; if (Math.abs(fold) > 2.5) col = shadePacked(col, Math.round(fold / 6) * 6); }
        frameU32[row + x] = col;
        planes.dynamicHitZone[row + x] = 10;
      }
    }
  }

  function renderHairAndAccessories(
    srcPivotX: number,
    srcPivotY: number,
    dstPivotX: number,
    dstPivotY: number,
    headAngle: number,
  ): void {
    const sTop = springs.hairTop, sBng = springs.hairBangs, sCrl = springs.hairCurl, sBot = springs.hairBot;
    const cosA = Math.cos(headAngle), sinA = Math.sin(headAngle);
    const yMax = Math.min(H - 1, Math.ceil(SKEL.chinY + 32 + (dstPivotY - srcPivotY)));
    const yMin = Math.max(0, Math.floor((dstPivotY - srcPivotY) - 10));
    const xMin = Math.max(0, Math.floor(CX - 82 + (dstPivotX - srcPivotX)));
    const xMax = Math.min(W - 1, Math.ceil(CX + 82 + (dstPivotX - srcPivotX)));

    for (let y = yMin; y <= yMax; y++) {
      const row = y * W;
      const dy = y - dstPivotY;
      for (let x = xMin; x <= xMax; x++) {
        const dx = x - dstPivotX;
        // Inverse-rotate into head local coordinates
        const lx = srcPivotX + dx * cosA + dy * sinA;
        const ly = srcPivotY - dx * sinA + dy * cosA;
        const ilx = Math.round(lx), ily = Math.round(ly);
        if (ilx < 0 || ilx >= W || ily < 0 || ily >= H) continue;

        const lIdx = ily * W + ilx;
        const wT = planes.hairWeightTop[lIdx], wB = planes.hairWeightBangs[lIdx], wC = planes.hairWeightCurl[lIdx], wBt = planes.hairWeightBot[lIdx];
        let ox = sTop.x * wT + sBng.x * wB + sCrl.x * wC + sBot.x * wBt, oy = sTop.y * wT + sBng.y * wB + sCrl.y * wC + sBot.y * wBt;
        if (wT === 0 && wB === 0 && wC === 0 && wBt === 0) {
          if (ly < SKEL.headTopY) { ox = sTop.x * .8; oy = sTop.y * .8; }
          else if ((state.view === 'side' && lx < SX) || (state.view === 'front' && lx > CX - 6)) { ox = sBng.x * .85; oy = sBng.y * .85; }
          else { ox = sCrl.x * .75; oy = sCrl.y * .75; }
        }
        const v = evalViscoLocal(x, y, 5, 7);
        const sx = Math.round(lx - ox + v.dx * .7), sy = Math.round(ly - oy + v.dy * .7);
        if (sx >= 0 && sx < W && sy >= 0 && sy < H && planes.hairRGBA[sy * W + sx] !== 0) {
          frameU32[row + x] = planes.hairRGBA[sy * W + sx];
          planes.dynamicHitZone[row + x] = planes.hairZone[sy * W + sx] || 5;
        }
      }
    }

    if (state.suit === 'maid' || state.suit === 'marfil') {
      for (let y = Math.max(0, Math.floor(6 + (dstPivotY - srcPivotY))); y <= Math.min(H - 1, Math.ceil(SKEL.headCenterY + 14 + (dstPivotY - srcPivotY))); y++) {
        const dy = y - dstPivotY;
        for (let x = Math.max(0, Math.floor(CX - 58 + (dstPivotX - srcPivotX))); x <= Math.min(W - 1, Math.ceil(CX + 58 + (dstPivotX - srcPivotX))); x++) {
          const dx = x - dstPivotX;
          const sx = Math.round(srcPivotX + dx * cosA + dy * sinA - sTop.x * .48);
          const sy = Math.round(srcPivotY - dx * sinA + dy * cosA - sTop.y * .48);
          if (sx >= 0 && sx < W && sy >= 0 && sy < H && planes.headAccRGBA[sy * W + sx] !== 0) frameU32[y * W + x] = planes.headAccRGBA[sy * W + sx];
        }
      }
    }
  }

  function drawCubeParticlesAndHand(): void {
    if (state.cubeEnabled) {
      const hX = Math.round(cube.size * .5 * (1 + cube.squash * .45)), hY = Math.round(cube.size * .5 * (1 - cube.squash * .35)), cx = Math.round(cube.x), cy = Math.round(cube.y);
      for (let dx = -hX + 2; dx <= hX - 2; dx++) setPx(cx + dx, cy + hY + 2, packRGBA(14, 12, 24));
      const cTop = packRGBA(186, 152, 255), cBody = packRGBA(122, 82, 206), cDark = packRGBA(72, 46, 134), cCore = packRGBA(93, 224, 178);
      for (let dy = -hY; dy <= hY; dy++) for (let dx = -hX; dx <= hX; dx++) {
        if (Math.abs(dx) === hX && Math.abs(dy) === hY) continue;
        let col: number = cBody;
        if (Math.abs(dx) === hX || Math.abs(dy) === hY) col = PAL.outline;
        else if (dy <= -hY + 2 || dx <= -hX + 2) col = cTop;
        else if (dy >= hY - 2 || dx >= hX - 2) col = cDark;
        else if (Math.abs(dx) + Math.abs(dy) <= 4) col = (Math.abs(dx) + Math.abs(dy) <= 1) ? PAL.whitePure : cCore;
        else if (((dx + dy) & 1) === 0 && dy > 0) col = cDark;
        setPx(cx + dx, cy + dy, col);
      }
    }

    const HEART = ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'], STAR = ['00100', '01110', '11111', '01110', '00100'];
    for (const p of particles) {
      const px = Math.round(p.x), py = Math.round(p.y);
      if (p.type === 'heart') { const col = p.life > .35 ? PAL.cheek : PAL.cheekSoft; for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) if (HEART[r][c] === '1') setPx(px + c - 3, py + r - 3, (r === 1 && c === 1) ? PAL.whitePure : col); }
      else if (p.type === 'star') { for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) if (STAR[r][c] === '1') setPx(px + c - 2, py + r - 2, (r === 2 && c === 2) ? PAL.whitePure : PAL.goldHi); }
      else { setPx(px, py, PAL.cheekSoft); setPx(px + 1, py, PAL.goldHi); }
    }
    if (state.eatAnim) {
      const t = state.eatAnim.t;
      const targetX = CX + pose.headOffX + pose.hipSwayX;
      const targetY = SKEL.mouthY + pose.headOffY + pose.bodyBounceY;
      const x = Math.round(lerp(42, targetX, smoothstep(0, 1, t))), y = Math.round(lerp(145, targetY, smoothstep(0, 1, t)) - Math.sin(t * Math.PI) * 38);
      const cWrap = packRGBA(146, 92, 224), cFrost = packRGBA(255, 198, 220);
      for (let dy = 1; dy <= 5; dy++) { const w = 5 - Math.floor(dy * .35); for (let dx = -w; dx <= w; dx++) setPx(x + dx, y + dy, (Math.abs(dx) === w || dy === 5) ? PAL.outline : ((dx & 1) ? cWrap : PAL.lidShadow)); }
      for (let dy = -3; dy <= 1; dy++) { const w = 5 - Math.max(0, -dy - 1); for (let dx = -w; dx <= w; dx++) setPx(x + dx, y + dy, (Math.abs(dx) === w || dy === -3) ? PAL.outline : cFrost); }
      setPx(x, y - 4, PAL.cheek); setPx(x + 1, y - 4, PAL.cheek); setPx(x, y - 5, PAL.whitePure);
    }

    if (state.handEnabled && pointer.inside && !cube.dragging) {
      pointer.grip += ((pointer.down ? 1 : 0) - pointer.grip) * .32;
      const g = pointer.grip, hx = Math.round(pointer.x), hy = Math.round(pointer.y), curl = Math.round(g * 5);
      const cSkin = packRGBA(246, 224, 212), cShade = packRGBA(210, 178, 166), cHi = packRGBA(255, 245, 240);
      const fillR = (x0: number, y0: number, rw: number, rh: number, col: number) => { for (let dy = 0; dy < rh; dy++) for (let dx = 0; dx < rw; dx++) setPx(x0 + dx, y0 + dy, col); };
      fillR(hx - 8, hy + 1 + curl, 16, 12, PAL.outline); fillR(hx - 7, hy + 2 + curl, 14, 10, cSkin); fillR(hx - 6, hy + 8 + curl, 12, 3, cShade);
      fillR(hx - 5, hy + 13 + curl, 10, 5, PAL.outline); fillR(hx - 4, hy + 13 + curl, 8, 4, cShade);
      for (const [ox, len] of [[-7, 10 - curl], [-3, 12 - curl], [1, 11 - curl], [5, 9 - curl]]) {
        const fy = hy + 2 + curl - len; fillR(hx + ox - 1, fy - 1, 5, len + 2, PAL.outline); fillR(hx + ox, fy, 3, len, cSkin); fillR(hx + ox, fy, 3, 2, cHi);
        if (g > .35) fillR(hx + ox, fy + 2, 3, 1, cShade);
      }
      const tx = hx - 11 + Math.round(g * 2), ty = hy + 4 + curl; fillR(tx - 1, ty - 1, 5, 6, PAL.outline); fillR(tx, ty, 3, 4, cSkin);
      if (state.pullFabric) for (const [dx, dy] of [[0, -12], [-1, -11], [1, -11], [0, -10]]) setPx(hx + dx, hy + dy + curl, PAL.goldHi);
    }
  }

  /**
   * Draws a rounded shaded hinge joint cap at the elbow so upper arm & forearm bend at any angle with zero gaps!
   */
  function renderElbowBridgeJoint(elX: number, elY: number): void {
    const isOrig = state.suit === 'original', isMarfil = state.suit === 'marfil', isMaid = state.suit === 'maid', hasSuit = state.suit !== 'none';
    // Note: in Maid suit, the forearm at the elbow (y=142) is bare porcelain skin!
    const useGloveMat = hasSuit && !isMaid;
    const baseCol = !useGloveMat ? PAL.skinBase : (isMarfil ? PAL.ivoryBase : PAL.latexBase);
    const hiCol = !useGloveMat ? PAL.skinHi : (isMarfil ? PAL.ivoryHi : PAL.latexMid);
    const deepCol = !useGloveMat ? PAL.skinMid : (isMarfil ? PAL.ivoryDeep : PAL.latexDark);
    const r = 6.2;
    const x0 = Math.max(1, Math.floor(elX - r - 2)), x1 = Math.min(W - 2, Math.ceil(elX + r + 2));
    const y0 = Math.max(1, Math.floor(elY - r - 2)), y1 = Math.min(H - 2, Math.ceil(elY + r + 2));
    for (let y = y0; y <= y1; y++) {
      const row = y * W;
      for (let x = x0; x <= x1; x++) {
        const dx = x - elX, dy = y - elY, d = Math.hypot(dx, dy);
        if (d <= r) {
          const lit = dx * -0.4 + dy * -0.4;
          frameU32[row + x] = lit > 1.4 ? hiCol : (lit < -1.8 ? deepCol : baseCol);
          planes.dynamicHitZone[row + x] = 9;
        } else if (d <= r + 1.05 && frameU32[row + x] === bgBuf[row + x]) {
          frameU32[row + x] = PAL.outline;
        }
      }
    }
  }

  /**
   * Procedural 2D Articulated Hand & 5 Individual Fingers (Thumb, Index, Middle, Ring, Pinky)
   * Renders crisp outlined pixel-art capsules, glove/skin shading, white/gold fingertips, back-of-hand X emblem,
   * and gothic claws for any wrist angle, finger curl, and hand gesture!
   */
  function renderArticulatedHandAndFingers(
    side: -1 | 1,
    wrX: number,
    wrY: number,
    totalHandAngle: number,
    gesture: HandGesture,
    fingerCurl: number,
    isSideView = false,
  ): void {
    const isOrig = state.suit === 'original';
    const isMarfil = state.suit === 'marfil';
    const isMaid = state.suit === 'maid';
    const hasGlove = state.suit === 'original' || state.suit === 'marfil';

    const baseCol = hasGlove ? (isMarfil ? PAL.ivoryBase : PAL.latexBase) : PAL.skinBase;
    const hiCol = hasGlove ? (isMarfil ? PAL.ivoryHi : PAL.latexSpec1) : PAL.skinHi;
    const deepCol = hasGlove ? (isMarfil ? PAL.ivoryDeep : PAL.latexDark) : PAL.skinMid;
    const tipCol = hasGlove ? (isMarfil ? PAL.goldHi : PAL.whitePure) : PAL.skinHi;
    const xMarkCol = isMarfil ? PAL.goldHi : PAL.whitePure;

    // Base resting orientation of the forearm/wrist axis
    const restAngle = isSideView ? Math.atan2(36, -14) : Math.atan2(34, side * 18);
    const theta = restAngle + totalHandAngle;
    const fx = Math.cos(theta), fy = Math.sin(theta);
    // Outward lateral vector (from thumb side - toward pinky side +)
    const lx = side * Math.sin(theta), ly = -side * Math.cos(theta);

    const toWorld = (f: number, l: number): [number, number] => [
      wrX + f * fx + l * lx,
      wrY + f * fy + l * ly,
    ];

    interface HandCapsule {
      ax: number;
      ay: number;
      bx: number;
      by: number;
      r0: number;
      r1: number;
      hasTip: boolean;
      hasClaw: boolean;
      isCurledKnuckle: boolean;
    }

    const segments: HandCapsule[] = [];

    // 1. Sculpted Palm capsule (f = -0.5 -> 8.8)
    const [p0x, p0y] = toWorld(-0.5, 0);
    const [p1x, p1y] = toWorld(8.6, 0.2);
    segments.push({
      ax: p0x, ay: p0y, bx: p1x, by: p1y,
      r0: 5.2, r1: 5.8,
      hasTip: false, hasClaw: false, isCurledKnuckle: false,
    });

    // 2. Determine per-finger curl & spread for the 4 fingers [Index, Middle, Ring, Pinky]
    const baseC = clamp(fingerCurl, 0, 1);
    let curls: [number, number, number, number] = [baseC, baseC, baseC, baseC];
    let spreads: [number, number, number, number] = [-0.11, -0.02, 0.06, 0.15];

    switch (gesture) {
      case 'wave_spread':
        curls = [0, 0, 0, 0];
        spreads = [-0.36, -0.12, 0.12, 0.36];
        break;
      case 'thumbs_up':
      case 'fist':
        curls = [0.95, 0.95, 0.95, 0.95];
        spreads = [-0.04, -0.01, 0.02, 0.05];
        break;
      case 'point':
        curls = [0.0, 0.95, 0.95, 0.95];
        spreads = [0.0, 0, 0, 0];
        break;
      case 'peace':
        curls = [0.0, 0.0, 0.95, 0.95];
        spreads = [-0.24, 0.22, 0.04, 0.08];
        break;
      case 'rock':
        curls = [0.0, 0.95, 0.95, 0.0];
        spreads = [-0.20, 0, 0, 0.26];
        break;
      case 'kiss_hand':
        curls = [0.12, 0.08, 0.14, 0.22];
        spreads = [-0.04, -0.01, 0.02, 0.05];
        break;
      default:
        break;
    }

    const lOffsets = [-4.2, -1.4, 1.4, 4.1];
    const fullLengths = [12.0, 13.8, 12.8, 10.2];
    const fingerRadii = [1.65, 1.72, 1.62, 1.48];

    for (let i = 0; i < 4; i++) {
      const c = curls[i];
      const sp = spreads[i];
      const [knX, knY] = toWorld(8.6, lOffsets[i]);
      if (c >= 0.65) {
        // Curled finger knuckle folded into palm
        const [foldX, foldY] = toWorld(12.2, lOffsets[i] * 0.92);
        segments.push({
          ax: knX, ay: knY, bx: foldX, by: foldY,
          r0: fingerRadii[i] + 0.2, r1: fingerRadii[i],
          hasTip: false, hasClaw: false, isCurledKnuckle: true,
        });
      } else {
        const len = fullLengths[i] * (1 - c * 0.52);
        const dirAngle = theta + side * sp;
        const tipX = knX + Math.cos(dirAngle) * len;
        const tipY = knY + Math.sin(dirAngle) * len;
        segments.push({
          ax: knX, ay: knY, bx: tipX, by: tipY,
          r0: fingerRadii[i], r1: fingerRadii[i] * 0.84,
          hasTip: true, hasClaw: true, isCurledKnuckle: false,
        });
      }
    }

    // 3. Articulated Thumb (Pulgar) anchored on the inner side of the palm (f = 3.6, l = -4.6)
    const [thBaseX, thBaseY] = toWorld(3.6, -4.5);
    if (gesture === 'thumbs_up') {
      // Prominent Thumbs-Up pointing straight UPWARD (-Y in screen space, slightly angled outward)!
      const upAngle = -Math.PI * 0.5 - side * 0.12;
      const thTipX = thBaseX + Math.cos(upAngle) * 11.8;
      const thTipY = thBaseY + Math.sin(upAngle) * 11.8;
      segments.push({
        ax: thBaseX, ay: thBaseY, bx: thTipX, by: thTipY,
        r0: 2.15, r1: 1.85,
        hasTip: true, hasClaw: true, isCurledKnuckle: false,
      });
    } else if (gesture === 'fist' || gesture === 'point' || gesture === 'peace' || gesture === 'rock') {
      // Thumb tucked across the front of the curled fingers
      const [thFoldX, thFoldY] = toWorld(8.4, -0.6);
      segments.push({
        ax: thBaseX, ay: thBaseY, bx: thFoldX, by: thFoldY,
        r0: 1.9, r1: 1.65,
        hasTip: false, hasClaw: false, isCurledKnuckle: true,
      });
    } else {
      // Extended thumb (open, wave_spread, kiss_hand)
      const thSpread = gesture === 'wave_spread' ? -0.78 : (gesture === 'kiss_hand' ? -0.22 : -0.48);
      const thLen = 9.8 * (1 - baseC * 0.48);
      const thAngle = theta + side * thSpread;
      const thTipX = thBaseX + Math.cos(thAngle) * thLen;
      const thTipY = thBaseY + Math.sin(thAngle) * thLen;
      segments.push({
        ax: thBaseX, ay: thBaseY, bx: thTipX, by: thTipY,
        r0: 1.95, r1: 1.65,
        hasTip: true, hasClaw: true, isCurledKnuckle: false,
      });
    }

    // Compute bounding box of the entire hand
    let minX = W - 1, maxX = 0, minY = H - 1, maxY = 0;
    for (const seg of segments) {
      const pad = Math.max(seg.r0, seg.r1) + 7;
      minX = Math.min(minX, Math.floor(Math.min(seg.ax, seg.bx) - pad));
      maxX = Math.max(maxX, Math.ceil(Math.max(seg.ax, seg.bx) + pad));
      minY = Math.min(minY, Math.floor(Math.min(seg.ay, seg.by) - pad));
      maxY = Math.max(maxY, Math.ceil(Math.max(seg.ay, seg.by) + pad));
    }
    minX = Math.max(1, minX); maxX = Math.min(W - 2, maxX);
    minY = Math.max(1, minY); maxY = Math.min(H - 2, maxY);

    // Pass 1 & 2: Evaluate signed distance to all hand/finger capsules for crisp 1px outline + 3D shaded interior
    for (let y = minY; y <= maxY; y++) {
      const row = y * W;
      for (let x = minX; x <= maxX; x++) {
        let bestFillCol = 0;
        let minEdgeDist = 999;

        for (let i = 0; i < segments.length; i++) {
          const seg = segments[i];
          const vx = seg.bx - seg.ax, vy = seg.by - seg.ay;
          const len2 = vx * vx + vy * vy || 1;
          const t = clamp(((x - seg.ax) * vx + (y - seg.ay) * vy) / len2, 0, 1);
          const cx = seg.ax + t * vx, cy = seg.ay + t * vy;
          const dist = Math.hypot(x - cx, y - cy);
          const rad = lerp(seg.r0, seg.r1, t);
          const edgeDist = dist - rad;

          if (edgeDist < minEdgeDist) minEdgeDist = edgeDist;

          if (edgeDist <= 0) {
            if (seg.hasTip && t > 0.54) {
              bestFillCol = tipCol;
            } else {
              const lightDot = ((x - cx) * -0.45 + (y - cy) * -0.55) / Math.max(1, rad);
              bestFillCol = lightDot > 0.24 ? hiCol : (lightDot < -0.35 ? deepCol : baseCol);
            }
            if (seg.isCurledKnuckle && t > 0.82) {
              bestFillCol = PAL.outline;
            }
          }
        }

        if (bestFillCol !== 0) {
          frameU32[row + x] = bestFillCol;
          planes.dynamicHitZone[row + x] = 9;
        } else if (minEdgeDist <= 1.05) {
          frameU32[row + x] = PAL.outline;
        }
      }
    }

    // Pass 3: Iconic Gothic Claws at the tip of every extended finger & thumb
    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i];
      if (!seg.hasClaw) continue;
      const vx = seg.bx - seg.ax, vy = seg.by - seg.ay;
      const len = Math.hypot(vx, vy) || 1;
      const ux = vx / len, uy = vy / len;
      const px = -uy, py = ux;
      const clawLen = 5.2;
      for (let s = 0; s <= 5; s++) {
        const u = s / 5;
        const cx = seg.bx + ux * (u * clawLen);
        const cy = seg.by + uy * (u * clawLen);
        const halfW = (1 - u) * 1.15;
        for (let w = -halfW; w <= halfW; w += 0.65) {
          setPx(Math.round(cx + px * w), Math.round(cy + py * w), s === 2 ? PAL.clawHi : PAL.claw);
        }
      }
    }

    // Pass 4: Back-of-hand Star-X mark (Original / Marfil) or Maid crimson wrist bow
    if (isOrig || isMarfil) {
      const [cxX, cyX] = toWorld(4.4, 0.2);
      for (let d = -3; d <= 3; d++) {
        setPx(Math.round(cxX + d * (fx * 0.7 + lx * 0.7)), Math.round(cyX + d * (fy * 0.7 + ly * 0.7)), xMarkCol);
        setPx(Math.round(cxX + d * (fx * 0.7 - lx * 0.7)), Math.round(cyX + d * (fy * 0.7 - ly * 0.7)), xMarkCol);
      }
    } else if (isMaid) {
      const [bx, by] = toWorld(-1.5, 0);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -2; dx <= 2; dx++) {
        setPx(Math.round(bx + dx), Math.round(by + dy), dx === 0 && dy === 0 ? PAL.ribbonHi : PAL.ribbonBase);
      }
    }
  }

  function renderFrame(): void {
    const S = SKEL, hasSuit = state.suit !== 'none', mat = SUIT_MATERIALS[state.suit];
    frameU32.set(bgBuf);
    planes.dynamicHitZone.fill(0);

    // Combined vertical hip displacement: crouch lowers waist, jump lifts entire body into the air!
    const netVerticalY = pose.bodyBounceY + pose.crouchDepth - pose.jumpHeight;

    // Compute hierarchically locked world transforms for articulated parts (zero joint detachment!)
    const cosT = Math.cos(pose.torsoAngle), sinT = Math.sin(pose.torsoAngle);
    const waistPivotX = CX + pose.hipSwayX;
    const waistPivotY = S.waistY + netVerticalY;
    const torsoDstPivotX = waistPivotX + pose.torsoOffX * 0.45;
    const torsoDstPivotY = waistPivotY + pose.torsoOffY * 0.85;
    const upperOffX = torsoDstPivotX - CX;
    const upperOffY = torsoDstPivotY - S.waistY;

    // Exact chest center transform on the rotated upper torso (keeps bust & zipper 100% locked to chest!)
    const chestRelY = S.bustCenterY - S.waistY; // negative (above waist)
    const chestOffX = upperOffX - chestRelY * sinT;
    const chestOffY = upperOffY + chestRelY * (cosT - 1);

    // Exact neck joint transform on the rotated upper torso (keeps head & choker 100% attached to neck!)
    const headSrcPivotX = state.view === 'side' ? SX - 6 : CX;
    const headSrcPivotY = state.view === 'side' ? 82 : S.neckMidY;
    const neckRelX = headSrcPivotX - CX;
    const neckRelY = headSrcPivotY - S.waistY;
    const neckWorldX = torsoDstPivotX + neckRelX * cosT - neckRelY * sinT;
    const neckWorldY = torsoDstPivotY + neckRelX * sinT + neckRelY * cosT;
    const headDstPivotX = neckWorldX + pose.headOffX;
    const headDstPivotY = neckWorldY + pose.headOffY;

    // 1. Back View Side-Peek Bust (follows rotated chest!)
    if (state.view === 'back') {
      for (let y = Math.max(0, Math.floor(S.bustTopY - 8 + chestOffY)); y <= Math.min(H - 1, Math.ceil(S.bustBotY + 12 + chestOffY)); y++) {
        for (let x = Math.max(0, Math.floor(CX - 66 + chestOffX)); x <= Math.min(W - 1, Math.ceil(CX + 66 + chestOffX)); x++) {
          const lx = x - chestOffX, ly = y - chestOffY;
          const s = lx < CX ? springs.bustL : springs.bustR;
          const sx = Math.round(lx - s.x * .75), sy = Math.round(ly - s.y * .75);
          if (sx >= 0 && sx < W && sy >= 0 && sy < H && planes.peekRGBA[sy * W + sx]) {
            frameU32[y * W + x] = planes.peekRGBA[sy * W + sx];
            planes.dynamicHitZone[y * W + x] = lx < CX ? 1 : 2;
          }
          if (hasSuit) {
            const tsx = Math.round(lx - lerp(s.x, s.cx, mat.clothLag) * .75), tsy = Math.round(ly - lerp(s.y, s.cy, mat.clothLag) * .75);
            if (tsx >= 0 && tsx < W && tsy >= 0 && tsy < H && planes.peekSuitRGBA[tsy * W + tsx]) {
              frameU32[y * W + x] = planes.peekSuitRGBA[tsy * W + tsx];
              planes.dynamicHitZone[y * W + x] = lx < CX ? 1 : 2;
            }
          }
        }
      }
    }

    // 2. Articulated Lower Body (Waist -> Hips -> Bending Knees -> Calves -> Feet with Crouch, Jump & Leg Lift!)
    const sGL = springs.gluteL, sGR = springs.gluteR;
    const hasHip = state.view === 'front' && (Math.abs(sGL.x) > .05 || Math.abs(sGL.y) > .05 || Math.abs(sGR.x) > .05 || Math.abs(sGR.y) > .05 || contacts.length > 0);
    const hipY0 = Math.floor(S.hipTopY), hipY1 = Math.ceil(S.thighBandY + 16);
    const lowerStartY = Math.floor(S.waistY - 12);
    const dstStartY = Math.max(0, Math.floor(lowerStartY + netVerticalY - 4));
    const srcSpanY = Math.max(1, S.footTipY - lowerStartY);

    for (let y = dstStartY; y < H; y++) {
      const row = y * W;
      for (let x = 10; x < W - 10; x++) {
        const isLeftLeg = x < waistPivotX;
        const legLift = state.view === 'side' ? Math.max(pose.legLiftL, pose.legLiftR) : (isLeftLeg ? pose.legLiftL : pose.legLiftR);
        // Feet stay planted at S.footTipY during crouch, and lift up during jump or single-leg lift!
        const dstWaistTopY = lowerStartY + netVerticalY;
        const dstFootBotY = S.footTipY - pose.jumpHeight - legLift;
        if (y < dstWaistTopY - 2 || y > dstFootBotY + 1) continue;

        const tLeg = clamp((y - dstWaistTopY) / Math.max(20, dstFootBotY - dstWaistTopY), 0, 1);
        const syRaw = lowerStartY + tLeg * srcSpanY;
        const sy = Math.round(syRaw);
        if (sy < lowerStartY || sy >= H) continue;

        const swayK = smoothstep(348, 200, syRaw);
        // Outward/forward knee bend bow when crouching or lifting a leg!
        const kneeProfile = syRaw > S.crotchY ? Math.sin(clamp((syRaw - S.crotchY) / (S.footTipY - S.crotchY), 0, 1) * Math.PI) : 0;
        const kneeBendDir = state.view === 'side' ? -1.35 : (isLeftLeg ? -1 : 1);
        const kneeBowX = kneeProfile * (pose.crouchDepth * 0.34 + legLift * 0.25) * kneeBendDir;
        const rowOffX = pose.hipSwayX * swayK + kneeBowX;

        const sx = Math.round(x - rowOffX);
        if (sx < 14 || sx >= W - 14) continue;
        // Prevent left/right leg cross-bleeding when only one leg is lifted
        if (state.view !== 'side' && syRaw > S.crotchY + 3 && ((isLeftLeg && sx > CX + 1) || (!isLeftLeg && sx < CX - 1))) {
          continue;
        }

        const sIdx = sy * W + sx;
        const dstIdx = row + x;
        const inHip = hasHip && sy >= hipY0 && sy <= hipY1;
        if (inHip) {
          const wL = planes.hipWeightL[sIdx], wR = planes.hipWeightR[sIdx];
          if (wL > 0 || wR > 0) {
            const v = evalViscoLocal(x, y, 3, 4);
            const hsx = Math.round(sx - (sGL.x * wL + sGR.x * wR) + v.dx * .6), hsy = Math.round(sy - (sGL.y * wL + sGR.y * wR) + v.dy * .6);
            if (hsx >= 0 && hsx < W && hsy >= 0 && hsy < H && planes.torsoRGBA[hsy * W + hsx]) {
              frameU32[dstIdx] = planes.torsoRGBA[hsy * W + hsx];
              planes.dynamicHitZone[dstIdx] = sx < CX ? 3 : 4;
            }
            if (hasSuit) {
              const csx = Math.round(sx - (lerp(sGL.x, sGL.cx, mat.clothLag) * wL + lerp(sGR.x, sGR.cx, mat.clothLag) * wR + (springs.clothSlipL.x * wL + springs.clothSlipR.x * wR) * .65) + v.dx * .55);
              const csy = Math.round(sy - (lerp(sGL.y, sGL.cy, mat.clothLag) * wL + lerp(sGR.y, sGR.cy, mat.clothLag) * wR + (springs.clothSlipL.y * wL + springs.clothSlipR.y * wR) * .65) + v.dy * .55);
              if (csx >= 0 && csx < W && csy >= 0 && csy < H) {
                const scol = planes.torsoSuitRGBA[csy * W + csx];
                if (scol) {
                  const d = v.shade * mat.tension + v.wrinkle;
                  frameU32[dstIdx] = Math.abs(d) > 2.6 ? shadePacked(scol, Math.round(d / 6) * 6) : scol;
                  planes.dynamicHitZone[dstIdx] = sx < CX ? 3 : 4;
                }
              }
            }
            continue;
          }
        }
        const col = (hasSuit && planes.torsoSuitRGBA[sIdx] !== 0) ? planes.torsoSuitRGBA[sIdx] : planes.torsoRGBA[sIdx];
        if (col !== 0) {
          frameU32[dstIdx] = col;
          if (state.view === 'front' && sy >= S.hipTopY && sy <= S.thighBandY + 14 && Math.abs(sx - CX) >= 26) {
            planes.dynamicHitZone[dstIdx] = sx < CX ? 3 : 4;
          } else {
            planes.dynamicHitZone[dstIdx] = 9;
          }
        }
      }
    }

    // 3. Articulated Upper Torso (Waist -> Neck, pivots cleanly at Waist!)
    blitRotatedBuffer(
      planes.torsoRGBA,
      hasSuit ? planes.torsoSuitRGBA : null,
      CX, S.waistY,
      torsoDstPivotX, torsoDstPivotY,
      pose.torsoAngle,
      CX - 68 + upperOffX, S.neckTopY - 12 + upperOffY,
      CX + 68 + upperOffX, S.waistY + 12 + upperOffY,
      9,
      Math.floor(S.neckTopY - 4), Math.ceil(S.waistY + 8),
    );

    // Helper to render the 3-link arm chain (Shoulder -> Upper Arm -> Elbow -> Forearm -> Wrist -> 5-Finger Hand)
    const renderSegmentedArm = (side: -1 | 1) => {
      const shSrcX = CX + side * (S.shoulderX - 3), shSrcY = S.shoulderY + 9;
      const elSrcX = CX + side * (S.elbowX + 1), elSrcY = S.elbowY;
      const wrSrcX = CX + side * S.wristX, wrSrcY = S.wristY;

      const rawArmAngle = side === -1 ? pose.armLAngle : pose.armRAngle;
      // 3D-to-2D shoulder roll: when an arm swings inward across the chest, the shoulder pivot shifts slightly inward
      const inwardSwing = Math.max(0, -side * rawArmAngle);
      const inwardRollX = -side * Math.min(9.5, inwardSwing * 8.5);
      const relX = shSrcX - CX + inwardRollX, relY = shSrcY - S.waistY;
      const shDstX = torsoDstPivotX + relX * cosT - relY * sinT;
      const shDstY = torsoDstPivotY + relX * sinT + relY * cosT + pose.armLiftY;

      const upperArmAngle = pose.torsoAngle + rawArmAngle;
      const elbowBend = side === -1 ? pose.elbowLAngle : pose.elbowRAngle;
      const forearmAngle = upperArmAngle + elbowBend;
      const wristBend = side === -1 ? pose.wristLAngle : pose.wristRAngle;
      const totalHandAngle = forearmAngle + wristBend;

      const cosU = Math.cos(upperArmAngle), sinU = Math.sin(upperArmAngle);
      const elRelX = elSrcX - shSrcX, elRelY = elSrcY - shSrcY;
      const elDstX = shDstX + elRelX * cosU - elRelY * sinU;
      const elDstY = shDstY + elRelX * sinU + elRelY * cosU;

      const cosF = Math.cos(forearmAngle), sinF = Math.sin(forearmAngle);
      const wrRelX = wrSrcX - elSrcX, wrRelY = wrSrcY - elSrcY;
      const wrDstX = elDstX + wrRelX * cosF - wrRelY * sinF;
      const wrDstY = elDstY + wrRelX * sinF + wrRelY * cosF;

      const armBodyBuf = side === -1 ? planes.armLRGBA : planes.armRRGBA;
      const armSuitBuf = hasSuit ? (side === -1 ? planes.armLSuitRGBA : planes.armRSuitRGBA) : null;

      // Link 1: Upper Arm (Shoulder -> Elbow)
      blitRotatedBuffer(
        armBodyBuf,
        armSuitBuf,
        shSrcX, shSrcY,
        shDstX, shDstY,
        upperArmAngle,
        2, 12,
        W - 2, 275,
        9,
        84, Math.round(S.elbowY + 4),
      );

      // Elbow hinge bridge joint
      if (Math.abs(elbowBend) > 0.12) {
        renderElbowBridgeJoint(elDstX, elDstY);
      }

      // Link 2: Forearm (Elbow -> Wrist)
      blitRotatedBuffer(
        armBodyBuf,
        armSuitBuf,
        elSrcX, elSrcY,
        elDstX, elDstY,
        forearmAngle,
        2, 12,
        W - 2, 275,
        9,
        Math.round(S.elbowY - 3), Math.round(S.wristY + 4),
      );

      // Link 3: Articulated Hand & 5 Individual Fingers at Wrist
      renderArticulatedHandAndFingers(
        side,
        wrDstX,
        wrDstY,
        totalHandAngle,
        side === -1 ? pose.handLGesture : pose.handRGesture,
        side === -1 ? pose.fingerCurlL : pose.fingerCurlR,
        false,
      );
    };

    // 4. Render any NON-crossed arms behind bust/head first
    const leftArmInFront = state.view === 'front' && (pose.armLAngle < -0.18 || Math.abs(pose.elbowLAngle) > 0.45);
    const rightArmInFront = state.view === 'front' && (pose.armRAngle > 0.18 || Math.abs(pose.elbowRAngle) > 0.45);
    if (state.view !== 'side') {
      if (!leftArmInFront) renderSegmentedArm(-1);
      if (!rightArmInFront) renderSegmentedArm(1);
    }

    // 5. Articulated Head + Expressive Face (rotates cleanly around locked neck pivot!)
    composeHeadLocalBuffer();
    blitRotatedBuffer(
      headFrameBuf,
      null,
      headSrcPivotX, headSrcPivotY,
      headDstPivotX, headDstPivotY,
      pose.headAngle + pose.torsoAngle * 0.35,
      headDstPivotX - 52, headDstPivotY - 64,
      headDstPivotX + 52, headDstPivotY + 20,
      (state.view === 'front' || state.view === 'side') ? 8 : 9,
    );

    // 6. Soft Planes (Bust in Front/Side locked to chestOffX/Y, Glutes in Back/Side locked to hips!)
    if (state.view === 'front') {
      renderSoftPlane(
        CX - S.bustCenterX - S.bustRx - 14, S.bustTopY - 12,
        CX + S.bustCenterX + S.bustRx + 14, S.bustBotY + 16,
        springs.bustL, springs.bustR,
        CX - S.bustCenterX, S.bustCenterY, CX + S.bustCenterX, S.bustCenterY,
        1, 2, false,
        chestOffX, chestOffY,
      );
    } else if (state.view === 'side') {
      renderSoftPlane(
        SX - 98, 82, SX + 4, 188,
        springs.bustL, springs.gluteL,
        S.sideBustX, S.sideBustY, S.sideGluteX, S.sideGluteY,
        1, 2, false,
        chestOffX, chestOffY,
      );
      renderSoftPlane(
        SX - 6, 152, SX + 74, 248,
        springs.bustL, springs.gluteL,
        S.sideBustX, S.sideBustY, S.sideGluteX, S.sideGluteY,
        3, 4, true,
        pose.hipSwayX, netVerticalY,
      );
    } else {
      renderSoftPlane(
        CX - S.gluteCenterX - S.gluteRx - 14, S.gluteCenterY - S.gluteRy - 12,
        CX + S.gluteCenterX + S.gluteRx + 14, S.gluteCenterY + S.gluteRy + 16,
        springs.gluteL, springs.gluteR,
        CX - S.gluteCenterX, S.gluteCenterY, CX + S.gluteCenterX, S.gluteCenterY,
        3, 4, true,
        pose.hipSwayX, netVerticalY,
      );
    }

    // 7. Dynamic Skirt / Silk Sash Layer (follows hips + skirt springs)
    renderDynamicSkirtLayer(pose.hipSwayX, netVerticalY);

    // 8. Side-View 3-Link Articulated Front Arm (Shoulder -> Elbow -> Wrist -> 5-Finger Hand)
    if (state.view === 'side') {
      const sideShSrcX = SX + 2, sideShSrcY = 98;
      const sideElSrcX = SX - 4, sideElSrcY = 152;
      const sideWrSrcX = SX - 18, sideWrSrcY = 188;

      const sRelX = sideShSrcX - CX, sRelY = sideShSrcY - S.waistY;
      const sideShDstX = torsoDstPivotX + sRelX * cosT - sRelY * sinT;
      const sideShDstY = torsoDstPivotY + sRelX * sinT + sRelY * cosT + pose.armLiftY;

      const sideUpperAngle = pose.torsoAngle + pose.sideArmAngle;
      const sideForearmAngle = sideUpperAngle + pose.sideElbowAngle;
      const cosSU = Math.cos(sideUpperAngle), sinSU = Math.sin(sideUpperAngle);
      const sideElDstX = sideShDstX + (sideElSrcX - sideShSrcX) * cosSU - (sideElSrcY - sideShSrcY) * sinSU;
      const sideElDstY = sideShDstY + (sideElSrcX - sideShSrcX) * sinSU + (sideElSrcY - sideShSrcY) * cosSU;

      const cosSF = Math.cos(sideForearmAngle), sinSF = Math.sin(sideForearmAngle);
      const sideWrDstX = sideElDstX + (sideWrSrcX - sideElSrcX) * cosSF - (sideWrSrcY - sideElSrcY) * sinSF;
      const sideWrDstY = sideElDstY + (sideWrSrcX - sideElSrcX) * sinSF + (sideWrSrcY - sideElSrcY) * cosSF;

      blitRotatedBuffer(
        planes.frontArmRGBA,
        hasSuit ? planes.frontArmSuitRGBA : null,
        sideShSrcX, sideShSrcY,
        sideShDstX, sideShDstY,
        sideUpperAngle,
        2, 14,
        W - 2, 275,
        9,
        84, 156,
      );
      if (Math.abs(pose.sideElbowAngle) > 0.12) {
        renderElbowBridgeJoint(sideElDstX, sideElDstY);
      }
      blitRotatedBuffer(
        planes.frontArmRGBA,
        hasSuit ? planes.frontArmSuitRGBA : null,
        sideElSrcX, sideElSrcY,
        sideElDstX, sideElDstY,
        sideForearmAngle,
        2, 14,
        W - 2, 275,
        9,
        148, 193,
      );
      renderArticulatedHandAndFingers(
        1,
        sideWrDstX,
        sideWrDstY,
        sideForearmAngle + pose.wristRAngle,
        pose.handRGesture,
        pose.fingerCurlR,
        true,
      );
    }

    // 9. Articulated Zebra Hair + Headpiece (locked to head transform + spring bounce!)
    renderHairAndAccessories(
      headSrcPivotX,
      headSrcPivotY,
      headDstPivotX,
      headDstPivotY,
      pose.headAngle + pose.torsoAngle * 0.35,
    );

    // 9b. Render bent/foreground arms in front of bust & face (for thumbs-up, blow-kiss, elbows-in, cover-face, hands-on-hips!)
    if (state.view !== 'side') {
      if (leftArmInFront) renderSegmentedArm(-1);
      if (rightArmInFront) renderSegmentedArm(1);
    }

    // 10. Cube, Particles, Cupcake & Articulated Pixel Hand
    drawCubeParticlesAndHand();
    ctx.putImageData(frameImageData, 0, 0);
  }

  // ---- MÉTODOS PÚBLICOS ----
  function setView(newView: AvatarView, fromAI = false): void {
    if (state.view === newView) return;
    state.view = newView;
    contacts.length = 0;
    rebuildAllForView();
    applyImpulse('hairTop', newView === 'side' ? -30 : 26, -12);
    applyImpulse('hairBangs', newView === 'side' ? 32 : -26, -10);
    triggerAnimation('outfit_pose', 1.4);
    emitSnapshot(true);
    if (!fromAI) emitInteraction('change_view', newView);
  }

  function setSuit(newSuit: AvatarSuit, fromAI = false): void {
    if (state.suit === newSuit) return;
    state.suit = newSuit;
    rebuildSuitOnly();
    applyImpulse('skirtL', -24, -18);
    applyImpulse('skirtR', 24, -18);
    applyImpulse('clothSlipL', -12, 10);
    applyImpulse('clothSlipR', 12, 10);
    triggerAnimation(newSuit === 'none' ? 'shy' : 'outfit_pose', 1.8);
    emitSnapshot(true);
    if (!fromAI) emitInteraction('change_suit', newSuit);
  }

  function setZipper(percent: number): void {
    const clamped = Math.round(clamp(percent, 0, 100));
    if (state.zipper === clamped) return;
    state.zipper = clamped;
    rebuildSuitOnly();
    if (clamped > 50) triggerAnimation('shy', 1.5);
    emitSnapshot(true);
  }

  function setLingerie(partial: Partial<LingerieState>): void {
    let changed = false;
    if (typeof partial.bra === 'boolean' && partial.bra !== state.bra) { state.bra = partial.bra; changed = true; }
    if (typeof partial.panties === 'boolean' && partial.panties !== state.panties) { state.panties = partial.panties; changed = true; }
    if (typeof partial.stockings === 'boolean' && partial.stockings !== state.stockings) { state.stockings = partial.stockings; changed = true; }
    if (changed) {
      compositeAllLayers();
      emitSnapshot(true);
    }
  }

  function setTools(partial: Partial<ToolsState>): void {
    let changed = false;
    if (typeof partial.handEnabled === 'boolean' && partial.handEnabled !== state.handEnabled) {
      state.handEnabled = partial.handEnabled;
      changed = true;
    }
    if (typeof partial.cubeEnabled === 'boolean' && partial.cubeEnabled !== state.cubeEnabled) {
      state.cubeEnabled = partial.cubeEnabled;
      if (state.cubeEnabled) { cube.x = 46; cube.y = 145; cube.vx = 0; cube.vy = 0; }
      changed = true;
    }
    if (typeof partial.pullFabric === 'boolean' && partial.pullFabric !== state.pullFabric) {
      state.pullFabric = partial.pullFabric;
      changed = true;
    }
    if (typeof partial.animationsEnabled === 'boolean' && partial.animationsEnabled !== state.animationsEnabled) {
      state.animationsEnabled = partial.animationsEnabled;
      if (!state.animationsEnabled) state.currentAnim = 'idle';
      changed = true;
    }
    if (changed) emitSnapshot(true);
  }

  function triggerAction(action: AvatarAction, fromAI = false): void {
    switch (action) {
      case 'bounceBust':
        applyImpulse('bustL', state.view === 'side' ? -42 : -24, -114);
        applyImpulse('bustR', 24, -108);
        applyImpulse('hairBangs', 14, -16);
        addBlush(.08);
        triggerAnimation('shy', 1.3);
        emitSnapshot(true);
        break;
      case 'bounceGlutes':
        applyImpulse('gluteL', state.view === 'side' ? 42 : -26, -110);
        applyImpulse('gluteR', 26, -104);
        addBlush(.08);
        triggerAnimation('outfit_pose', 1.3);
        emitSnapshot(true);
        break;
      case 'wave':
        triggerAnimation('outfit_pose', 1.7);
        applyImpulse('hairTop', -44, -34);
        applyImpulse('hairBangs', 50, -28);
        applyImpulse('hairCurl', -36, -24);
        scheduleTimeout(() => {
          applyImpulse('bustL', -36, -102);
          scheduleTimeout(() => applyImpulse('bustR', 36, -102), 75);
        }, 70);
        scheduleTimeout(() => {
          applyImpulse('gluteL', state.view === 'side' ? 38 : -32, -98);
          scheduleTimeout(() => applyImpulse('gluteR', 32, -98), 75);
        }, 160);
        if (!fromAI) emitInteraction('wave');
        break;
      case 'cubeHit': {
        if (!state.cubeEnabled) {
          state.cubeEnabled = true;
          emitSnapshot(true);
        }
        const fromLeft = Math.random() < .5;
        cube.dragging = false;
        cube.hitCooldown = 0;
        cube.x = fromLeft ? 28 : W - 28;
        cube.y = state.view === 'side' ? (fromLeft ? SKEL.sideBustY : SKEL.sideGluteY) : (state.view === 'front' ? SKEL.bustCenterY : SKEL.gluteCenterY);
        cube.vx = fromLeft ? 280 : -280;
        cube.vy = -48;
        break;
      }
      case 'happy':
        addAffection(12);
        addBlush(.14);
        setMood('Feliz', 2.8);
        triggerAnimation('happy', 2.0);
        applyImpulse('hairTop', 24, -26);
        applyImpulse('hairBangs', -26, -20);
        applyImpulse('hairCurl', 20, -18);
        spawnBurst(CX, SKEL.headTopY + 12, 'heart', 8);
        emitSnapshot(true);
        if (!fromAI) emitInteraction('happy');
        break;
      case 'feed':
        if (state.view !== 'front') setView('front', true);
        if (!state.eatAnim) state.eatAnim = { t: 0 };
        triggerAnimation('eat', 1.65);
        if (!fromAI) emitInteraction('feed');
        break;
      case 'breeze':
        triggerAnimation('breeze', 1.8);
        applyImpulse('hairTop', 52, -22);
        applyImpulse('hairBangs', 64, -18);
        applyImpulse('hairCurl', 48, -14);
        applyImpulse('skirtL', 78, -68);
        applyImpulse('skirtR', 84, -62);
        applyImpulse('clothSlipL', 28, -14);
        applyImpulse('clothSlipR', 28, -14);
        if (state.zipper > 10) applyImpulse('lapelSpread', 46, 0);
        spawnBurst(CX + 26, SKEL.hipPeakY, 'star', 5);
        addBlush(.08);
        emitSnapshot(true);
        if (!fromAI) emitInteraction('breeze');
        break;
      case 'dance':
        triggerAnimation('dance', 2.6);
        applyImpulse('hairTop', -38, -28);
        applyImpulse('hairBangs', 42, -24);
        applyImpulse('skirtL', -54, -46);
        applyImpulse('skirtR', 54, -46);
        applyImpulse('bustL', -28, -88);
        applyImpulse('bustR', 28, -88);
        scheduleTimeout(() => {
          applyImpulse('gluteL', state.view === 'side' ? 36 : -30, -90);
          applyImpulse('gluteR', 30, -90);
          applyImpulse('skirtL', 52, -40);
          applyImpulse('skirtR', -52, -40);
        }, 280);
        scheduleTimeout(() => {
          applyImpulse('bustL', 26, -84);
          applyImpulse('bustR', -26, -84);
          applyImpulse('hairBangs', -38, -22);
        }, 560);
        spawnBurst(CX, SKEL.headTopY + 12, 'star', 5);
        spawnBurst(CX, SKEL.headTopY + 14, 'heart', 4);
        emitSnapshot(true);
        break;
      case 'spin': {
        const order: AvatarView[] = ['front', 'side', 'back'];
        const startIdx = order.indexOf(state.view);
        const step1 = order[(startIdx + 1) % 3];
        const step2 = order[(startIdx + 2) % 3];
        const step3 = order[startIdx];
        setView(step1, true);
        applyImpulse('skirtL', 65, -52);
        applyImpulse('skirtR', -65, -52);
        scheduleTimeout(() => {
          setView(step2, true);
          applyImpulse('hairTop', 45, -24);
          applyImpulse('skirtL', -60, -48);
        }, 280);
        scheduleTimeout(() => {
          setView(step3, true);
          triggerAnimation('outfit_pose', 1.8);
          spawnBurst(CX, SKEL.headTopY + 12, 'star', 6);
        }, 560);
        break;
      }
      case 'giggle':
        triggerAnimation('giggle', 1.8);
        applyImpulse('bustL', -18, -74);
        applyImpulse('bustR', 18, -74);
        applyImpulse('hairBangs', 22, -20);
        applyImpulse('hairCurl', -20, -18);
        addBlush(.10);
        spawnBurst(CX, SKEL.headTopY + 12, 'heart', 5);
        emitSnapshot(true);
        break;
      case 'tease':
        triggerAnimation('tease', 2.2);
        applyImpulse('bustL', state.view === 'side' ? -34 : -22, -92);
        applyImpulse('bustR', 22, -88);
        applyImpulse('gluteL', state.view === 'side' ? 34 : -22, -84);
        applyImpulse('gluteR', 22, -84);
        applyImpulse('clothSlipL', -18, 14);
        applyImpulse('clothSlipR', 18, 14);
        if (state.zipper > 8) applyImpulse('lapelSpread', 36, 0);
        addBlush(.12);
        spawnBurst(CX, SKEL.headTopY + 12, 'heart', 5);
        emitSnapshot(true);
        break;
      case 'nod':
        triggerAnimation('nod', 1.5);
        applyImpulse('hairTop', 10, 32);
        applyImpulse('hairBangs', 14, 38);
        applyImpulse('bustL', -12, -48);
        applyImpulse('bustR', 12, -48);
        emitSnapshot(true);
        break;
      case 'shakeHead':
        triggerAnimation('shake_head', 1.6);
        applyImpulse('hairTop', -36, -14);
        applyImpulse('hairBangs', 42, -16);
        applyImpulse('hairCurl', -34, -14);
        emitSnapshot(true);
        break;
      case 'stretch':
        triggerAnimation('stretch', 2.1);
        applyImpulse('bustL', -20, -96);
        applyImpulse('bustR', 20, -96);
        applyImpulse('hairTop', -18, -28);
        applyImpulse('clothSlipL', -14, -18);
        applyImpulse('clothSlipR', 14, -18);
        emitSnapshot(true);
        break;
      case 'jump':
        triggerAnimation('happy', 1.9);
        applyImpulse('hairTop', -30, -44);
        applyImpulse('hairBangs', 34, -40);
        applyImpulse('skirtL', -58, -64);
        applyImpulse('skirtR', 58, -64);
        applyImpulse('bustL', -30, -118);
        applyImpulse('bustR', 30, -118);
        applyImpulse('gluteL', -26, -104);
        applyImpulse('gluteR', 26, -104);
        spawnBurst(CX, SKEL.headTopY + 10, 'star', 6);
        emitSnapshot(true);
        break;
      case 'waveHand':
        triggerAnimation('wave_hand', 2.2);
        applyImpulse('hairBangs', 26, -22);
        applyImpulse('hairTop', -20, -18);
        applyImpulse('bustL', -16, -64);
        applyImpulse('bustR', 22, -72);
        spawnBurst(CX + 38, SKEL.headTopY + 18, 'star', 4);
        emitSnapshot(true);
        break;
      case 'blowKiss':
        if (state.view === 'back') setView('front', true);
        triggerAnimation('blow_kiss', 2.2);
        addBlush(.14);
        addAffection(8);
        applyImpulse('hairBangs', 20, -18);
        applyImpulse('bustL', -20, -76);
        applyImpulse('bustR', 20, -76);
        scheduleTimeout(() => {
          spawnBurst(CX, SKEL.mouthY - 2, 'heart', 9);
          applyImpulse('hairTop', -22, -20);
        }, 720);
        emitSnapshot(true);
        break;
      case 'curtsy':
        triggerAnimation('curtsy', 2.2);
        applyImpulse('skirtL', -48, -36);
        applyImpulse('skirtR', 48, -36);
        applyImpulse('hairTop', 14, 24);
        applyImpulse('hairBangs', -18, 26);
        applyImpulse('bustL', -18, -72);
        applyImpulse('bustR', 18, -72);
        spawnBurst(CX, SKEL.headTopY + 12, 'star', 4);
        emitSnapshot(true);
        break;
      case 'hipSway':
        triggerAnimation('hip_sway', 2.5);
        applyImpulse('gluteL', state.view === 'side' ? 40 : -34, -92);
        applyImpulse('gluteR', 34, -92);
        applyImpulse('skirtL', -52, -34);
        applyImpulse('skirtR', 52, -34);
        scheduleTimeout(() => {
          applyImpulse('gluteL', state.view === 'side' ? -36 : 34, -88);
          applyImpulse('gluteR', -34, -88);
          applyImpulse('skirtL', 52, -34);
          applyImpulse('skirtR', -52, -34);
        }, 420);
        addBlush(.10);
        emitSnapshot(true);
        break;
      case 'strut':
        triggerAnimation('strut', 2.5);
        applyImpulse('hairTop', -26, -24);
        applyImpulse('hairBangs', 30, -22);
        applyImpulse('bustL', -24, -82);
        applyImpulse('bustR', 24, -82);
        applyImpulse('gluteL', -26, -84);
        applyImpulse('gluteR', 26, -84);
        applyImpulse('skirtL', -42, -38);
        applyImpulse('skirtR', 42, -38);
        spawnBurst(CX, SKEL.headTopY + 12, 'star', 5);
        emitSnapshot(true);
        break;
      case 'cheer':
        triggerAnimation('cheer', 2.4);
        addAffection(10);
        applyImpulse('hairTop', -32, -38);
        applyImpulse('hairBangs', 36, -34);
        applyImpulse('bustL', -28, -104);
        applyImpulse('bustR', 28, -104);
        applyImpulse('skirtL', -46, -52);
        applyImpulse('skirtR', 46, -52);
        spawnBurst(CX - 28, SKEL.headTopY + 8, 'star', 5);
        spawnBurst(CX + 28, SKEL.headTopY + 8, 'heart', 5);
        emitSnapshot(true);
        break;
      case 'pout':
        triggerAnimation('pout', 2.1);
        addBlush(.12);
        applyImpulse('hairBangs', -32, 22);
        applyImpulse('hairTop', 28, 18);
        applyImpulse('bustL', -22, -68);
        applyImpulse('bustR', 22, -68);
        applyImpulse('skirtL', -34, 24);
        applyImpulse('skirtR', 34, 24);
        emitSnapshot(true);
        break;
      case 'peekaboo':
        triggerAnimation('peekaboo', 2.3);
        addBlush(.10);
        applyImpulse('hairBangs', 38, -22);
        applyImpulse('hairCurl', -34, -20);
        applyImpulse('bustL', -20, -68);
        applyImpulse('bustR', 20, -68);
        scheduleTimeout(() => {
          spawnBurst(CX + 22, SKEL.headTopY + 16, 'heart', 4);
        }, 550);
        emitSnapshot(true);
        break;
      case 'shiver':
        triggerAnimation('shiver', 1.9);
        addBlush(.14);
        applyImpulse('hairTop', -28, -16);
        applyImpulse('hairBangs', 30, -16);
        applyImpulse('bustL', -22, -74);
        applyImpulse('bustR', 22, -74);
        applyImpulse('clothSlipL', -16, 12);
        applyImpulse('clothSlipR', 16, 12);
        emitSnapshot(true);
        break;
      case 'bow':
        triggerAnimation('bow', 2.0);
        applyImpulse('hairTop', 16, 36);
        applyImpulse('hairBangs', 20, 42);
        applyImpulse('bustL', -22, -82);
        applyImpulse('bustR', 22, -82);
        scheduleTimeout(() => {
          applyImpulse('bustL', -18, -68);
          applyImpulse('bustR', 18, -68);
          applyImpulse('hairBangs', -20, -24);
        }, 620);
        emitSnapshot(true);
        break;
      case 'wink':
        if (state.view === 'back') setView('front', true);
        triggerAnimation('wink', 2.0);
        addBlush(.10);
        applyImpulse('hairBangs', 24, -18);
        applyImpulse('bustL', -20, -72);
        applyImpulse('bustR', 20, -72);
        spawnBurst(CX + 18, SKEL.eyeY - 4, 'heart', 5);
        emitSnapshot(true);
        break;
      case 'showOff': {
        // Multi-angle choreographed showcase: pose front -> side hip sway -> back glute bounce -> front wink!
        triggerAnimation('outfit_pose', 2.4);
        applyImpulse('bustL', -24, -84);
        applyImpulse('bustR', 24, -84);
        scheduleTimeout(() => {
          setView('side', true);
          triggerAnimation('hip_sway', 1.8);
          applyImpulse('bustL', -34, -88);
        }, 420);
        scheduleTimeout(() => {
          setView('back', true);
          applyImpulse('gluteL', -28, -96);
          applyImpulse('gluteR', 28, -96);
          triggerAnimation('tease', 1.8);
        }, 920);
        scheduleTimeout(() => {
          setView('front', true);
          triggerAnimation('wink', 1.9);
          spawnBurst(CX, SKEL.headTopY + 12, 'star', 6);
          spawnBurst(CX, SKEL.headTopY + 14, 'heart', 5);
        }, 1450);
        break;
      }
      case 'thumbsUp':
        triggerAnimation('thumbs_up', 2.3);
        applyImpulse('hairBangs', 20, -18);
        applyImpulse('bustL', -18, -68);
        applyImpulse('bustR', 22, -74);
        spawnBurst(CX + 26, SKEL.shoulderY + 8, 'star', 5);
        emitSnapshot(true);
        break;
      case 'crouch':
        triggerAnimation('crouch', 2.4);
        applyImpulse('skirtL', -44, -38);
        applyImpulse('skirtR', 44, -38);
        applyImpulse('bustL', -24, -88);
        applyImpulse('bustR', 24, -88);
        applyImpulse('gluteL', -26, -86);
        applyImpulse('gluteR', 26, -86);
        scheduleTimeout(() => {
          applyImpulse('bustL', -26, -94);
          applyImpulse('bustR', 26, -94);
          applyImpulse('hairTop', -20, -28);
        }, 1100);
        emitSnapshot(true);
        break;
      case 'elbowsIn':
        triggerAnimation('elbows_in', 2.3);
        // Joining elbows squeezes the bust inward & upward!
        applyImpulse('bustL', 28, -96);
        applyImpulse('bustR', -28, -96);
        applyImpulse('hairBangs', 18, -16);
        addBlush(.12);
        spawnBurst(CX, SKEL.headTopY + 12, 'heart', 4);
        emitSnapshot(true);
        break;
      case 'raiseRightHand':
        triggerAnimation('raise_right_hand', 2.3);
        applyImpulse('bustR', 22, -78);
        applyImpulse('hairTop', -18, -18);
        spawnBurst(CX + 46, SKEL.headTopY + 10, 'star', 4);
        emitSnapshot(true);
        break;
      case 'raiseLeftHand':
        triggerAnimation('raise_left_hand', 2.3);
        applyImpulse('bustL', -22, -78);
        applyImpulse('hairTop', 18, -18);
        spawnBurst(CX - 46, SKEL.headTopY + 10, 'star', 4);
        emitSnapshot(true);
        break;
      case 'peaceSign':
        triggerAnimation('peace_sign', 2.2);
        applyImpulse('hairBangs', 20, -18);
        applyImpulse('bustL', -16, -64);
        applyImpulse('bustR', 20, -68);
        spawnBurst(CX + 30, SKEL.headTopY + 16, 'heart', 5);
        emitSnapshot(true);
        break;
      case 'pointFinger':
        triggerAnimation('point_finger', 2.2);
        applyImpulse('hairBangs', -18, -16);
        applyImpulse('bustR', 18, -64);
        spawnBurst(CX + 34, SKEL.shoulderY + 6, 'star', 4);
        emitSnapshot(true);
        break;
      case 'rockSign':
        triggerAnimation('rock_sign', 2.3);
        applyImpulse('hairTop', -36, -32);
        applyImpulse('hairBangs', 40, -28);
        applyImpulse('bustL', -28, -92);
        applyImpulse('bustR', 28, -92);
        spawnBurst(CX - 34, SKEL.headTopY + 10, 'star', 4);
        spawnBurst(CX + 34, SKEL.headTopY + 10, 'star', 4);
        emitSnapshot(true);
        break;
      case 'handsOnHips':
        triggerAnimation('hands_on_hips', 2.3);
        applyImpulse('bustL', -22, -76);
        applyImpulse('bustR', 22, -76);
        applyImpulse('gluteL', -20, -72);
        applyImpulse('gluteR', 20, -72);
        emitSnapshot(true);
        break;
      case 'crossArms':
        triggerAnimation('cross_arms', 2.3);
        applyImpulse('bustL', 24, -84);
        applyImpulse('bustR', -24, -84);
        emitSnapshot(true);
        break;
      case 'coverFace':
        triggerAnimation('cover_face', 2.2);
        addBlush(.16);
        applyImpulse('hairBangs', -22, 16);
        applyImpulse('bustL', 20, -68);
        applyImpulse('bustR', -20, -68);
        emitSnapshot(true);
        break;
      case 'liftLeg':
        triggerAnimation('lift_leg', 2.2);
        applyImpulse('skirtL', -42, -46);
        applyImpulse('skirtR', 48, -54);
        applyImpulse('gluteR', 28, -88);
        applyImpulse('bustL', -20, -72);
        applyImpulse('bustR', 20, -72);
        emitSnapshot(true);
        break;
    }
  }

  function applyAIReaction(reaction: AIReactionPayload): void {
    if (reaction.changeView) setView(reaction.changeView, true);
    if (reaction.changeSuit) setSuit(reaction.changeSuit, true);
    if (typeof reaction.changeZipper === 'number' && !Number.isNaN(reaction.changeZipper)) {
      setZipper(reaction.changeZipper);
    }
    if (reaction.changeLingerie) {
      setLingerie(reaction.changeLingerie);
    }
    if (typeof reaction.affectionDelta === 'number' && reaction.affectionDelta !== 0) {
      addAffection(clamp(reaction.affectionDelta, -5, 15));
    }
    if (typeof reaction.blushDelta === 'number' && reaction.blushDelta !== 0) {
      addBlush(clamp(reaction.blushDelta, -0.1, 0.25));
    }
    if (reaction.mood) {
      setMood(reaction.mood, 3.8);
    }

    if (reaction.rigPose) {
      setCustomRigPose(reaction.rigPose);
    } else {
      state.customRigPose = null;
    }

    const hasAction = Boolean(reaction.action && reaction.action !== 'none');
    const hasAnim = Boolean(reaction.animation && reaction.animation !== 'idle');

    if (hasAction && reaction.action && reaction.action !== 'none') {
      triggerAction(reaction.action, true);
    }

    if (hasAnim && reaction.animation && reaction.animation !== 'idle') {
      if (reaction.action !== 'showOff' && reaction.action !== 'spin') {
        const longAnims: AvatarAnimation[] = ['dance', 'hip_sway', 'strut', 'cheer', 'peekaboo', 'crouch'];
        triggerAnimation(
          reaction.animation,
          longAnims.includes(reaction.animation) ? 2.6 : 2.2,
        );
      }
      if (!hasAction) {
        applyImpulse('hairBangs', 20, -16);
        applyImpulse('bustL', -16, -54);
        applyImpulse('bustR', 16, -54);
      }
    }

    // Optional chained secondary action (e.g., curtsy -> dance, or crouch -> jump)
    if (
      reaction.secondaryAction &&
      reaction.secondaryAction !== 'none' &&
      reaction.secondaryAction !== reaction.action
    ) {
      const nextAct = reaction.secondaryAction;
      scheduleTimeout(() => {
        triggerAction(nextAct, true);
      }, 1350);
    }

    // Guarantee physical movement on every AI response even if model returned action="none" & animation="idle"
    if (!hasAction && !hasAnim && !reaction.changeView && !reaction.changeSuit) {
      switch (reaction.mood) {
        case 'Feliz':
          triggerAnimation('happy', 1.8);
          applyImpulse('hairBangs', 22, -18);
          applyImpulse('bustL', -18, -62);
          applyImpulse('bustR', 18, -62);
          spawnBurst(CX, SKEL.headTopY + 12, 'heart', 4);
          break;
        case 'Mimada':
          triggerAnimation('petted', 1.9);
          applyImpulse('hairTop', 18, -14);
          applyImpulse('bustL', -14, -48);
          applyImpulse('bustR', 14, -48);
          spawnBurst(CX, SKEL.headTopY + 12, 'heart', 4);
          break;
        case 'Ruborizada':
          triggerAnimation('shy', 1.8);
          applyImpulse('hairBangs', -18, -14);
          applyImpulse('bustL', -14, -52);
          applyImpulse('bustR', 14, -52);
          break;
        case 'Sorprendida':
          triggerAnimation('surprised', 1.4);
          applyImpulse('hairTop', -26, -24);
          applyImpulse('bustL', -22, -78);
          applyImpulse('bustR', 22, -78);
          spawnBurst(CX, SKEL.headTopY + 16, 'star', 4);
          break;
        default:
          triggerAnimation('talk', 1.8);
          applyImpulse('hairBangs', 16, -12);
          applyImpulse('bustL', -12, -40);
          applyImpulse('bustR', 12, -40);
          break;
      }
    }
    emitSnapshot(true);
  }

  let lastTs = 0, fpsFrames = 0, fpsAccum = 0;
  function mainLoop(ts: number): void {
    if (destroyed) return;
    try {
      if (!lastTs) lastTs = ts;
      const rawDt = (ts - lastTs) / 1000; lastTs = ts;
      const dt = clamp(rawDt, 0.001, 0.033);
      stepAnimations(dt);
      stepPhysics(dt);
      stepCube(dt);
      stepParticles(dt);
      stepTamagotchi(dt);
      renderFrame();
      fpsFrames++;
      fpsAccum += rawDt;
      if (fpsAccum >= 0.5) {
        currentFps = Math.round(fpsFrames / fpsAccum);
        fpsFrames = 0;
        fpsAccum = 0;
        emitSnapshot(true);
      } else {
        emitSnapshot(false);
      }
    } catch (err) {
      console.error('Error en renderizado:', err);
    }
    rafId = requestAnimationFrame(mainLoop);
  }

  buildBackground();
  rebuildAllForView();
  emitSnapshot(true);
  rafId = requestAnimationFrame(mainLoop);

  function destroy(): void {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(rafId);
    pendingTimeouts.forEach((id) => window.clearTimeout(id));
    pendingTimeouts.clear();
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    canvas.removeEventListener('pointerleave', onPointerLeave);
  }

  return {
    setView,
    setSuit,
    setZipper,
    setLingerie,
    setTools,
    triggerAction,
    triggerAnimation,
    setCustomRigPose,
    applyAIReaction,
    getSnapshot,
    destroy,
  };
}
