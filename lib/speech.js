// Utilidades para texto a voz usando la Web Speech API del navegador.
// No requiere API key ni costo: corre 100% en el dispositivo del usuario.

let cachedVoices = null;

function loadVoices() {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length) {
      resolve(existing);
      return;
    }
    synth.onvoiceschanged = () => {
      resolve(synth.getVoices());
    };
    // Fallback por si el evento no dispara en algunos navegadores.
    setTimeout(() => resolve(synth.getVoices()), 500);
  });
}

async function pickVoice(voiceConfig) {
  if (!cachedVoices) {
    cachedVoices = await loadVoices();
  }

  // Si se especificó un nombre exacto de voz (ej. las neuronales de Edge/Windows),
  // se prioriza por sobre cualquier heurística.
  if (voiceConfig?.preferredVoiceName) {
    const exact = cachedVoices.find((v) =>
      v.name.toLowerCase().includes(voiceConfig.preferredVoiceName.toLowerCase())
    );
    if (exact) return exact;
  }

  const targetLang = (voiceConfig?.lang || 'es-CL').toLowerCase();
  const spanish = cachedVoices.filter((v) => v.lang?.toLowerCase().startsWith('es'));
  const pool = spanish.length ? spanish : cachedVoices;

  if (!pool.length) return null;

  // Heurística: nombres de voces femeninas/masculinas comunes en los
  // paquetes de voces de Windows/Edge/Chrome en español, incluyendo las
  // voces neuronales de Microsoft Edge para Chile (Catalina/Lorenzo).
  const femaleHints = ['female', 'mujer', 'catalina', 'camila', 'helena', 'laura', 'sabina', 'elvira', 'monica', 'paulina'];
  const maleHints = ['male', 'hombre', 'lorenzo', 'jorge', 'diego', 'pablo', 'carlos', 'raul'];
  const hints = voiceConfig?.preferFemale ? femaleHints : maleHints;
  const wrongGenderHints = voiceConfig?.preferFemale ? maleHints : femaleHints;

  // Puntaje: 1) coincide el género esperado (obligatorio si se puede detectar),
  // 2) idioma exacto (es-CL), 3) voces "Online/Natural" (más naturales),
  // 4) coincidencia de nombre por género.
  function score(v) {
    const name = v.name.toLowerCase();
    if (wrongGenderHints.some((h) => name.includes(h))) return -1;
    let s = 0;
    if (v.lang?.toLowerCase() === targetLang) s += 10;
    if (/online|natural|neural/i.test(v.name)) s += 5;
    if (hints.some((h) => name.includes(h))) s += 3;
    return s;
  }

  const sorted = [...pool].sort((a, b) => score(b) - score(a));
  return sorted[0];
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export async function speak(text, voiceConfig, { onStart, onEnd } = {}) {
  if (!isSpeechSupported() || !text) {
    onEnd?.();
    return;
  }

  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = await pickVoice(voiceConfig);

  if (voice) utterance.voice = voice;
  utterance.lang = voiceConfig?.lang || 'es-ES';
  utterance.pitch = voiceConfig?.pitch ?? 1;
  utterance.rate = voiceConfig?.rate ?? 1;

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  synth.speak(utterance);
}

export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
