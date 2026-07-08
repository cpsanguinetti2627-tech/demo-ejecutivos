// Utilidad para reconocimiento de voz (dictado) usando la Web Speech API
// del navegador. Gratis, sin API key. Funciona en Chrome y Edge; no está
// soportado en Firefox.

export function isDictationSupported() {
  return typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createDictation({ lang = 'es-CL', onResult, onEnd, onError } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;

  const recognition = new SR();
  recognition.lang = lang;
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    onResult?.(transcript);
  };

  recognition.onerror = (event) => {
    onError?.(event.error);
  };

  recognition.onend = () => {
    onEnd?.();
  };

  return recognition;
}
