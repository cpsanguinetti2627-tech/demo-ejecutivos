'use client';

import { useEffect, useRef, useState } from 'react';
import TypingDots from './TypingDots';
import CallStage from './CallStage';
import { speak, stopSpeaking, isSpeechSupported } from '@/lib/speech';
import { isDictationSupported, createDictation } from '@/lib/dictation';

// Pausa simulada según el largo del texto, para cuando la voz no está
// disponible (navegadores sin soporte de Web Speech API).
function typingDelay(text) {
  const base = 500;
  const perChar = 18;
  const ms = base + Math.min(text.length * perChar, 2200);
  return ms;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function speakAndWait(text, voiceConfig, onSpeakStart) {
  return new Promise((resolve) => {
    speak(text, voiceConfig, {
      onStart: onSpeakStart,
      onEnd: resolve,
    });
  });
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
}

// Intenta reproducir voz natural (ElevenLabs). Si no está configurada o falla,
// hace fallback silencioso a la voz del navegador.
async function speakBubble(text, executive) {
  if (executive.elevenVoiceId) {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: executive.elevenVoiceId }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        await withTimeout(
          new Promise((resolve) => {
            audio.onended = resolve;
            audio.onerror = resolve;
            audio.play().catch(resolve);
          }),
          typingDelay(text) + 8000
        );
        URL.revokeObjectURL(url);
        return;
      }
    } catch (e) {
      // sigue al fallback
    }
  }
  if (isSpeechSupported()) {
    await withTimeout(speakAndWait(text, executive.voice, () => {}), typingDelay(text) + 6000);
  } else {
    await sleep(typingDelay(text));
  }
}

export default function ChatScreen({ executive, onBack }) {
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sending, setSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef(null);
  const startedRef = useRef(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    // El ejecutivo abre la conversación, como si ya te hubiese visto entrar.
    (async () => {
      await sleep(600);
      await requestReply([]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function requestReply(historyForApi) {
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executiveId: executive.id, messages: historyForApi }),
      });
      const data = await res.json();
      const reply = data.reply || 'Perdona, se cortó un poco la conexión, ¿me repites eso?';

      // Divide la respuesta en "burbujas" cortas, como varios mensajes seguidos.
      const bubbles = reply
        .split(/\n\s*\n/)
        .map((b) => b.trim())
        .filter(Boolean);

      for (let i = 0; i < bubbles.length; i++) {
        setIsTyping(true);
        await sleep(i === 0 ? 500 : typingDelay(bubbles[i]) * 0.4);
        setIsTyping(false);
        setMessages((prev) => [...prev, { role: 'assistant', content: bubbles[i] }]);

        setIsSpeaking(true);
        await speakBubble(bubbles[i], executive);
        setIsSpeaking(false);
      }
    } catch (e) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Se me cortó la conexión un momento, ¿me escribes de nuevo?' },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    setSending(true);

    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);

    const historyForApi = next.map(({ role, content }) => ({ role, content }));
    try {
      await requestReply(historyForApi);
    } finally {
      setSending(false);
    }
  }

  function toggleDictation() {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = createDictation({
      lang: 'es-CL',
      onResult: (transcript) => setInput(transcript),
      onEnd: () => {
        setIsRecording(false);
        recognitionRef.current = null;
      },
      onError: () => {
        setIsRecording(false);
        recognitionRef.current = null;
      },
    });

    if (!recognition) return;
    recognitionRef.current = recognition;
    setIsRecording(true);
    recognition.start();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const statusText = isSpeaking ? 'hablando...' : isTyping ? 'escribiendo...' : 'en línea';

  return (
    <div className="relative flex flex-col h-full bg-mist">
      <button
        onClick={onBack}
        aria-label="Volver"
        className="absolute top-4 left-4 z-10 text-paper bg-black/30 backdrop-blur-sm rounded-full p-1.5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <CallStage executive={executive} isSpeaking={isSpeaking} statusText={statusText} />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.map((m, idx) =>
          m.role === 'user' ? (
            <div
              key={idx}
              className="animate-rise self-end max-w-[78%] px-4 py-2.5 rounded-2xl rounded-br-md text-[15px] leading-relaxed bg-navy text-paper"
            >
              {m.content}
            </div>
          ) : (
            <div
              key={idx}
              className="animate-rise self-start max-w-[85%] px-1 py-1 text-[14px] leading-relaxed text-slate italic"
            >
              {m.content}
            </div>
          )
        )}
        {isTyping && (
          <div className="self-start bg-paper border border-line rounded-2xl rounded-bl-md">
            <TypingDots />
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 px-3 py-3 bg-paper border-t border-line">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? 'Escuchando...' : 'Escribe un mensaje...'}
          className="flex-1 resize-none bg-mist rounded-2xl px-4 py-2.5 text-[15px] text-ink outline-none max-h-28"
        />
        {isDictationSupported() && (
          <button
            onClick={toggleDictation}
            aria-label={isRecording ? 'Detener dictado' : 'Hablar'}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              isRecording ? 'bg-red-500 text-paper animate-pulse' : 'bg-mist text-slate'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 11a7 7 0 01-14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          aria-label="Enviar"
          className="w-10 h-10 rounded-full bg-navy text-paper flex items-center justify-center disabled:opacity-40 flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
