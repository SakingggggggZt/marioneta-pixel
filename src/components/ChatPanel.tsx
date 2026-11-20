import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Volume2, VolumeX } from 'lucide-react';
import type { ChatMessage } from '../services/marionetaAI';

interface ChatPanelProps {
  messages: ChatMessage[];
  isSending: boolean;
  reactiveAI: boolean;
  onToggleReactiveAI: () => void;
  onSendMessage: (text: string) => void;
}

const QUICK_PROMPTS = [
  'Dame un pulgar arriba',
  'Agáchate y salta',
  'Levanta solo una mano',
  'Junta los codos',
  'Tira un beso con tu mano',
  'Haz paz con los dedos y guíñame',
  'Pon las manos en la cintura',
  'Cruza los brazos y haz puchero',
];

export function ChatPanel({
  messages,
  isSending,
  reactiveAI,
  onToggleReactiveAI,
  onSendMessage,
}: ChatPanelProps) {
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isSending) return;
    setDraft('');
    onSendMessage(trimmed);
  };

  return (
    <div className="flex min-h-[420px] flex-1 flex-col gap-2.5">
      {/* Reactive AI Toggle */}
      <section className="flex flex-col gap-2 rounded-[10px] border border-white/[0.07] bg-[#222036] px-2.5 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10.5px] font-bold tracking-[0.9px] uppercase text-[#9b6ee8]">
              IA Reactiva
            </div>
            <p className="mt-0.5 text-[10px] leading-tight text-[#a8a4c4]">
              Reacciona al tacto, ropa o cubo (espera mín. 5s).
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleReactiveAI}
            className={`gothic-btn shrink-0 px-2.5 py-1.5 ${reactiveAI ? 'active' : ''}`}
          >
            {reactiveAI ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
            <span>{reactiveAI ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </section>

      {/* Conversation History */}
      <section className="flex flex-1 flex-col overflow-hidden rounded-[10px] border border-white/[0.07] bg-[#222036]">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-2.5 py-2 text-[10.5px] font-bold tracking-[0.8px] uppercase text-[#9b6ee8]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#e8c674]" />
            <span>Diálogo con Marioneta</span>
          </span>
          <span className="font-normal text-[#a8a4c4] normal-case tracking-normal">
            {messages.length} msg
          </span>
        </div>

        <div
          ref={listRef}
          className="hud-scroll flex flex-1 flex-col gap-2 overflow-y-auto p-2.5"
          style={{ maxHeight: '300px', minHeight: '210px' }}
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`font-prose max-w-[90%] rounded-lg px-2.5 py-1.5 text-[12px] leading-snug ${
                    isUser
                      ? 'border border-[#9b6ee8]/50 bg-[#5e38a8]/55 text-[#f2f1fa]'
                      : 'border border-[#3c375e] bg-[#161526] text-[#f2f1fa]'
                  }`}
                >
                  {!isUser && (
                    <div className="mb-0.5 flex items-center gap-1.5 font-mono text-[9.5px] font-bold text-[#9b6ee8]">
                      <span>Marioneta</span>
                      {msg.mood && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#e8c674]">{msg.mood}</span>
                        </>
                      )}
                    </div>
                  )}
                  <p>{msg.text}</p>
                  {msg.effectSummary && (
                    <div className="mt-1 border-t border-white/[0.08] pt-1 font-mono text-[9.5px] text-[#5de0b2]">
                      {msg.effectSummary}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-start">
              <div className="font-prose rounded-lg border border-[#3c375e] bg-[#161526] px-2.5 py-1.5 text-xs italic text-[#a8a4c4]">
                Marioneta está escribiendo…
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-1.5 border-t border-white/[0.06] bg-[#1a182b] px-2.5 py-2">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              type="button"
              disabled={isSending}
              onClick={() => onSendMessage(q)}
              className="cursor-pointer rounded-md border border-[#3c375e] bg-[#26233f] px-2 py-1 text-[10px] font-medium text-[#cfcbe8] transition-colors hover:border-[#9b6ee8] hover:text-white disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-1.5 border-t border-white/[0.08] bg-[#161526] p-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Habla con ella o pídele un traje…"
            maxLength={180}
            className="font-prose min-w-0 flex-1 rounded-md border border-[#3c375e] bg-[#12111d] px-2.5 py-1.5 text-xs text-[#f2f1fa] placeholder-[#7d789e] outline-none focus:border-[#9b6ee8]"
          />
          <button
            type="submit"
            disabled={isSending || !draft.trim()}
            aria-label="Enviar mensaje"
            className="gothic-btn active shrink-0 px-3 py-1.5 disabled:opacity-45"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </section>
    </div>
  );
}
