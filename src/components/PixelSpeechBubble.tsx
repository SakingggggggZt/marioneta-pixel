import { X } from 'lucide-react';
import type { AvatarMood } from '../engine/pixelAvatarEngine';

interface PixelSpeechBubbleProps {
  text: string | null;
  mood: AvatarMood;
  thinking: boolean;
  onDismiss: () => void;
}

const MOOD_ACCENT: Record<AvatarMood, string> = {
  Tranquila: 'text-[#c9b4ff]',
  Feliz: 'text-[#5de0b2]',
  Sorprendida: 'text-[#e8c674]',
  Ruborizada: 'text-[#ff85a1]',
  Mimada: 'text-[#ff85a1]',
};

export function PixelSpeechBubble({
  text,
  mood,
  thinking,
  onDismiss,
}: PixelSpeechBubbleProps) {
  if (!text && !thinking) return null;

  return (
    <div
      className="pointer-events-auto absolute bottom-3 left-3 right-3 z-10 flex justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="pixel-bubble relative w-full max-w-[94%] px-3 py-2 text-left">
        <div className="mb-1 flex items-center justify-between gap-2 text-[10px] tracking-wide">
          <span className={`font-bold ${MOOD_ACCENT[mood]}`}>
            MARIONETA · {mood}
          </span>
          {!thinking && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Cerrar diálogo"
              className="rounded p-0.5 text-[#a8a4c4] transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        {thinking ? (
          <p className="font-prose text-xs italic text-[#cfcbe8]">
            Marioneta está pensando…
          </p>
        ) : (
          <p className="font-prose text-[12.5px] leading-snug text-[#f2f1fa]">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
