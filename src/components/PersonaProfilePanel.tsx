import { Heart, Sparkles, User, Volume2, VolumeX } from 'lucide-react';
import {
  getRelationshipRank,
  PERSONALITY_PRESETS,
  type PersonaConfig,
  type PersonalityArchetypeId,
  type RelationshipStats,
  type UserAddressStyle,
  type UserProfile,
} from '../types/persona';

interface PersonaProfilePanelProps {
  personaConfig: PersonaConfig;
  userProfile: UserProfile;
  relationshipStats: RelationshipStats;
  affection: number;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  onChangePersona: (next: PersonaConfig) => void;
  onChangeUserProfile: (next: UserProfile) => void;
  onToggleSound: () => void;
  onToggleVoice: () => void;
}

const ADDRESS_OPTIONS: Array<{ id: UserAddressStyle; label: string }> = [
  { id: 'carino', label: 'Cariño' },
  { id: 'tu', label: 'De tú' },
  { id: 'nombre', label: 'Mi nombre' },
  { id: 'amo', label: 'Amo / Ama' },
];

export function PersonaProfilePanel({
  personaConfig,
  userProfile,
  relationshipStats,
  affection,
  soundEnabled,
  voiceEnabled,
  onChangePersona,
  onChangeUserProfile,
  onToggleSound,
  onToggleVoice,
}: PersonaProfilePanelProps) {
  const rank = getRelationshipRank(affection, relationshipStats.trust);
  const presetList = Object.values(PERSONALITY_PRESETS);

  const selectArchetype = (id: PersonalityArchetypeId) => {
    const p = PERSONALITY_PRESETS[id];
    onChangePersona({
      ...personaConfig,
      archetype: id,
      flirtiness: p.defaultFlirtiness,
      expressiveness: p.defaultExpressiveness,
      sensitivity: p.defaultSensitivity,
    });
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Vínculo y Progreso */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
        <div className="flex items-center justify-between text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
          <span className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-[#e02446]" />
            <span>Vínculo con Marioneta</span>
          </span>
          <span className="font-mono text-[10px] font-bold normal-case tracking-normal text-[#e8c674]">
            Nivel {rank.tier} · {rank.title}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <div className="mb-1 flex justify-between text-[#a8a4c4]">
              <span>Confianza</span>
              <strong className="text-[#f2f1fa] tabular-nums">{relationshipStats.trust}%</strong>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-white/[0.08] bg-[#12111d]">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${relationshipStats.trust}%`,
                  background: 'linear-gradient(90deg, #5de0b2 0%, #9b6ee8 100%)',
                }}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[#a8a4c4]">
              <span>Energía</span>
              <strong className="text-[#f2f1fa] tabular-nums">{relationshipStats.energy}%</strong>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-white/[0.08] bg-[#12111d]">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${relationshipStats.energy}%`,
                  background: 'linear-gradient(90deg, #e8c674 0%, #ff85a1 100%)',
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] pt-1.5 font-mono text-[10px] text-[#a8a4c4]">
          <span>Interacciones: {relationshipStats.interactionsCount}</span>
          <span>Regalos: {relationshipStats.giftsGiven}</span>
        </div>
      </section>

      {/* Personalidad de Marioneta */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
          <Sparkles className="h-3.5 w-3.5 text-[#e8c674]" />
          <span>Personalidad del Personaje</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {presetList.map((preset) => {
            const active = personaConfig.archetype === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectArchetype(preset.id)}
                className={`flex cursor-pointer flex-col items-start rounded-lg border px-2.5 py-1.5 text-left transition-colors ${
                  active
                    ? 'border-[#9b6ee8] bg-[#5e38a8]/35 text-white'
                    : 'border-white/[0.07] bg-[#18172a] text-[#cfcbe8] hover:border-[#9b6ee8]/50'
                }`}
              >
                <span className="text-[11.5px] font-bold">{preset.label}</span>
                <span className="text-[10px] text-[#a8a4c4]">{preset.shortDesc}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[10.5px] text-[#cfcbe8]">
              <label htmlFor="persona-flirt">Coquetería</label>
              <span className="font-mono text-[10px] text-[#e8c674] tabular-nums">
                {personaConfig.flirtiness}%
              </span>
            </div>
            <input
              id="persona-flirt"
              type="range"
              min={0}
              max={100}
              value={personaConfig.flirtiness}
              onChange={(e) =>
                onChangePersona({ ...personaConfig, flirtiness: Number(e.target.value) })
              }
              className="gothic-range"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[10.5px] text-[#cfcbe8]">
              <label htmlFor="persona-expr">Expresividad Física</label>
              <span className="font-mono text-[10px] text-[#e8c674] tabular-nums">
                {personaConfig.expressiveness}%
              </span>
            </div>
            <input
              id="persona-expr"
              type="range"
              min={30}
              max={100}
              value={personaConfig.expressiveness}
              onChange={(e) =>
                onChangePersona({ ...personaConfig, expressiveness: Number(e.target.value) })
              }
              className="gothic-range"
            />
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between text-[10.5px] text-[#cfcbe8]">
              <label htmlFor="persona-sens">Sensibilidad y Rubor</label>
              <span className="font-mono text-[10px] text-[#e8c674] tabular-nums">
                {personaConfig.sensitivity}%
              </span>
            </div>
            <input
              id="persona-sens"
              type="range"
              min={20}
              max={100}
              value={personaConfig.sensitivity}
              onChange={(e) =>
                onChangePersona({ ...personaConfig, sensitivity: Number(e.target.value) })
              }
              className="gothic-range"
            />
          </div>

          <input
            type="text"
            value={personaConfig.customTraitNote}
            onChange={(e) =>
              onChangePersona({ ...personaConfig, customTraitNote: e.target.value })
            }
            maxLength={110}
            placeholder="Rasgo extra (ej. habla con acento teatral, ama los gatos)…"
            className="font-prose mt-1 rounded-md border border-[#3c375e] bg-[#141322] px-2.5 py-1.5 text-[11px] text-[#f2f1fa] placeholder-[#7d789e] outline-none focus:border-[#9b6ee8]"
          />
        </div>
      </section>

      {/* Perfil del Usuario */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2.5">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
          <User className="h-3.5 w-3.5 text-[#5de0b2]" />
          <span>Tu Perfil (Usuario)</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <input
            type="text"
            value={userProfile.name}
            onChange={(e) => onChangeUserProfile({ ...userProfile, name: e.target.value })}
            maxLength={32}
            placeholder="Tu nombre o apodo"
            className="font-prose rounded-md border border-[#3c375e] bg-[#141322] px-2 py-1.5 text-[11px] text-[#f2f1fa] placeholder-[#7d789e] outline-none focus:border-[#9b6ee8]"
          />
          <input
            type="text"
            value={userProfile.roleTitle}
            onChange={(e) => onChangeUserProfile({ ...userProfile, roleTitle: e.target.value })}
            maxLength={36}
            placeholder="Tu rol (ej. Director)"
            className="font-prose rounded-md border border-[#3c375e] bg-[#141322] px-2 py-1.5 text-[11px] text-[#f2f1fa] placeholder-[#7d789e] outline-none focus:border-[#9b6ee8]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-[#a8a4c4]">Cómo te llama Marioneta:</span>
          <div className="grid grid-cols-4 gap-1">
            {ADDRESS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeUserProfile({ ...userProfile, addressStyle: opt.id })}
                className={`gothic-btn px-1 py-1 text-[10px] whitespace-nowrap ${
                  userProfile.addressStyle === opt.id ? 'active' : ''
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={userProfile.aboutMe}
          onChange={(e) => onChangeUserProfile({ ...userProfile, aboutMe: e.target.value })}
          maxLength={160}
          rows={2}
          placeholder="Sobre ti (gustos, humor, qué recuerde Marioneta)…"
          className="font-prose resize-none rounded-md border border-[#3c375e] bg-[#141322] px-2.5 py-1.5 text-[11px] text-[#f2f1fa] placeholder-[#7d789e] outline-none focus:border-[#9b6ee8]"
        />
      </section>

      {/* Audio y Voz */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2">
        <div className="text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
          Audio y Voz Sintetizada
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onToggleSound}
            className={`gothic-btn ${soundEnabled ? 'active' : ''}`}
          >
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>FX {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
          <button
            type="button"
            onClick={onToggleVoice}
            className={`gothic-btn ${voiceEnabled ? 'active' : ''}`}
          >
            {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            <span>Voz {voiceEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
