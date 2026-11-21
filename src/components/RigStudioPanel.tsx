import { RotateCcw, Sparkles } from 'lucide-react';
import type {
  AvatarAction,
  AvatarRigPose,
  HandGesture,
  MouthShape,
} from '../engine/pixelAvatarEngine';
import { STAGE_THEMES, type StageThemeId } from '../types/persona';

interface RigStudioPanelProps {
  rigPose: AvatarRigPose;
  manualRigActive: boolean;
  stageTheme: StageThemeId;
  onChangeRigPose: (next: AvatarRigPose) => void;
  onResetRigPose: () => void;
  onTriggerAction: (action: AvatarAction) => void;
  onChangeStageTheme: (theme: StageThemeId) => void;
}

const HAND_GESTURE_OPTIONS: Array<{ id: HandGesture; label: string }> = [
  { id: 'open', label: 'Abierta' },
  { id: 'heart_pinch', label: 'Corazón' },
  { id: 'thumbs_up', label: 'Pulgar' },
  { id: 'peace', label: 'Paz ✌️' },
  { id: 'point', label: 'Señalar' },
  { id: 'fist', label: 'Puño' },
  { id: 'rock', label: 'Rock' },
  { id: 'wave_spread', label: 'Extendida' },
];

const MOUTH_OPTIONS: Array<{ id: MouthShape; label: string }> = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'smile', label: 'Sonrisa' },
  { id: 'kiss', label: 'Beso' },
  { id: 'pout', label: 'Puchero' },
  { id: 'open', label: 'Abierta' },
];

const QUICK_RIG_PRESETS: Array<{ label: string; pose: AvatarRigPose }> = [
  {
    label: 'Corazón 🫶',
    pose: {
      shoulderL: -0.52,
      elbowL: -1.35,
      handL: 'heart_pinch',
      shoulderR: -0.52,
      elbowR: -1.35,
      handR: 'heart_pinch',
      headTilt: 0.28,
      mouthShape: 'smile',
    },
  },
  {
    label: 'Saludo 🫡',
    pose: {
      shoulderR: 1.05,
      elbowR: -1.65,
      handR: 'open',
      shoulderL: -0.05,
      elbowL: 0,
      handL: 'open',
      headTilt: -0.15,
      mouthShape: 'smile',
    },
  },
  {
    label: 'Gatita 🐾',
    pose: {
      shoulderL: -0.45,
      elbowL: -1.55,
      handL: 'fist',
      shoulderR: -0.45,
      elbowR: -1.55,
      handR: 'fist',
      headTilt: 0.45,
      mouthShape: 'smile',
    },
  },
  {
    label: 'Tímida 👉👈',
    pose: {
      shoulderL: -0.78,
      elbowL: -1.58,
      handL: 'point',
      shoulderR: -0.78,
      elbowR: -1.58,
      handR: 'point',
      headNod: 0.45,
      eyeLookX: -0.6,
      mouthShape: 'pout',
    },
  },
  {
    label: 'Paz & Guiño',
    pose: {
      shoulderR: 0.72,
      elbowR: -1.15,
      handR: 'peace',
      shoulderL: 0.28,
      elbowL: -1.25,
      handL: 'open',
      eyeOpenR: 0,
      headTilt: 0.35,
      mouthShape: 'smile',
    },
  },
  {
    label: 'Agachada',
    pose: {
      crouch: 0.85,
      shoulderL: 0.25,
      elbowL: -0.75,
      shoulderR: 0.25,
      elbowR: -0.75,
      headNod: -0.25,
      mouthShape: 'smile',
    },
  },
];

function RigSlider({
  id,
  label,
  value,
  min,
  max,
  step = 0.05,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-[10.5px] text-[#cfcbe8]">
        <label htmlFor={id}>{label}</label>
        <span className="font-mono text-[10px] text-[#e8c674] tabular-nums">
          {value.toFixed(2)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="gothic-range"
      />
    </div>
  );
}

export function RigStudioPanel({
  rigPose,
  manualRigActive,
  stageTheme,
  onChangeRigPose,
  onResetRigPose,
  onTriggerAction,
  onChangeStageTheme,
}: RigStudioPanelProps) {
  const update = (patch: Partial<AvatarRigPose>) => {
    onChangeRigPose({ ...rigPose, ...patch });
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Pose Presets & Reset */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
        <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#e8c674]" />
            <span>Estudio Rig 2D</span>
          </span>
          <button
            type="button"
            onClick={onResetRigPose}
            className="flex cursor-pointer items-center gap-1 text-[10px] font-semibold normal-case tracking-normal text-[#cfcbe8] transition-colors hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{manualRigActive ? 'Soltar Rig' : 'Reset'}</span>
          </button>
        </div>

        <p className="text-[10px] leading-snug text-[#a8a4c4]">
          Ajusta articulaciones en tiempo real. Pulsa Soltar Rig para volver a las animaciones libres.
        </p>

        <div className="grid grid-cols-3 gap-1.5">
          {QUICK_RIG_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChangeRigPose(preset.pose)}
              className="gothic-btn whitespace-nowrap px-1.5 py-1.5 text-[10.5px]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      {/* Brazos y Codos */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
        <div className="text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
          Hombros, Codos y Manos
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          <RigSlider
            id="rig-shoulder-l"
            label="Hombro Izq"
            value={rigPose.shoulderL ?? 0}
            min={-1.0}
            max={1.35}
            onChange={(v) => update({ shoulderL: v })}
          />
          <RigSlider
            id="rig-shoulder-r"
            label="Hombro Der"
            value={rigPose.shoulderR ?? 0}
            min={-1.0}
            max={1.35}
            onChange={(v) => update({ shoulderR: v })}
          />
          <RigSlider
            id="rig-elbow-l"
            label="Codo Izq"
            value={rigPose.elbowL ?? 0}
            min={-1.75}
            max={1.1}
            onChange={(v) => update({ elbowL: v })}
          />
          <RigSlider
            id="rig-elbow-r"
            label="Codo Der"
            value={rigPose.elbowR ?? 0}
            min={-1.75}
            max={1.1}
            onChange={(v) => update({ elbowR: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="rig-hand-l"
              className="text-[10px] font-semibold uppercase tracking-wide text-[#a8a4c4]"
            >
              Gesto Mano Izq
            </label>
            <select
              id="rig-hand-l"
              value={rigPose.handL ?? 'open'}
              onChange={(e) => update({ handL: e.target.value as HandGesture })}
              className="rounded-md border border-[#3c375e] bg-[#161526] px-2 py-1 text-[11px] text-[#f2f1fa] outline-none focus:border-[#9b6ee8]"
            >
              {HAND_GESTURE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="rig-hand-r"
              className="text-[10px] font-semibold uppercase tracking-wide text-[#a8a4c4]"
            >
              Gesto Mano Der
            </label>
            <select
              id="rig-hand-r"
              value={rigPose.handR ?? 'open'}
              onChange={(e) => update({ handR: e.target.value as HandGesture })}
              className="rounded-md border border-[#3c375e] bg-[#161526] px-2 py-1 text-[11px] text-[#f2f1fa] outline-none focus:border-[#9b6ee8]"
            >
              {HAND_GESTURE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Torso, Piernas y Rostro */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
        <div className="text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
          Torso, Rodillas y Expresión
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          <RigSlider
            id="rig-torso-tilt"
            label="Torso Tilt"
            value={rigPose.torsoTilt ?? 0}
            min={-1}
            max={1}
            onChange={(v) => update({ torsoTilt: v })}
          />
          <RigSlider
            id="rig-hip-sway"
            label="Caderas"
            value={rigPose.hipSway ?? 0}
            min={-1}
            max={1}
            onChange={(v) => update({ hipSway: v })}
          />
          <RigSlider
            id="rig-crouch"
            label="Agacharse"
            value={rigPose.crouch ?? 0}
            min={0}
            max={1}
            onChange={(v) => update({ crouch: v })}
          />
          <RigSlider
            id="rig-head-tilt"
            label="Cabeza Tilt"
            value={rigPose.headTilt ?? 0}
            min={-1}
            max={1}
            onChange={(v) => update({ headTilt: v })}
          />
          <RigSlider
            id="rig-eye-x"
            label="Mirada X"
            value={rigPose.eyeLookX ?? 0}
            min={-1}
            max={1}
            onChange={(v) => update({ eyeLookX: v })}
          />
          <RigSlider
            id="rig-eye-y"
            label="Mirada Y"
            value={rigPose.eyeLookY ?? 0}
            min={-1}
            max={1}
            onChange={(v) => update({ eyeLookY: v })}
          />
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {MOUTH_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() =>
                update({
                  mouthShape: m.id,
                  mouthOpen: m.id === 'open' ? 0.85 : 0,
                })
              }
              className={`gothic-btn flex-1 px-1.5 py-1 text-[10px] ${
                (rigPose.mouthShape ?? 'neutral') === m.id ? 'active' : ''
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* Iluminación del Escenario */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
        <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
          <span>Iluminación de Escenario</span>
          <button
            type="button"
            onClick={() => onTriggerAction('showOff')}
            className="cursor-pointer text-[10px] font-semibold normal-case tracking-normal text-[#e8c674] hover:underline"
          >
            Probar Giro 360°
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(STAGE_THEMES) as StageThemeId[]).map((themeId) => {
            const theme = STAGE_THEMES[themeId];
            return (
              <button
                key={themeId}
                type="button"
                onClick={() => onChangeStageTheme(themeId)}
                className={`gothic-btn ${stageTheme === themeId ? 'active' : ''}`}
              >
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
                <span>{theme.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
