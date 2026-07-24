/**
 * Envoltorio ligero sobre la Web Speech API (SpeechSynthesis) del navegador.
 * Centraliza la lógica de síntesis de voz para que los componentes/contexto
 * no dependan directamente del objeto global `window.speechSynthesis`.
 */

export const isSpeechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Obtiene la lista de voces disponibles en el navegador.
 * Las voces pueden cargar de forma asíncrona, por eso se soporta el evento onvoiceschanged.
 */
export const getAvailableVoices = () =>
  new Promise((resolve) => {
    if (!isSpeechSupported()) return resolve([]);

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });

/**
 * Reproduce un texto usando síntesis de voz.
 * @param {string} text - Texto a leer en voz alta.
 * @param {object} options - { rate, pitch, voiceURI, lang }
 */
export const speak = (text, options = {}) => {
  if (!isSpeechSupported() || !text) return;

  // Cancela cualquier locución en curso para evitar solapamientos
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  utterance.lang = options.lang ?? 'es-ES';

  if (options.voiceURI) {
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => v.voiceURI === options.voiceURI);
    if (selectedVoice) utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const cancelSpeech = () => {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
};
