/**
 * Envoltorio ligero sobre la Web Speech API (SpeechSynthesis) del navegador.
 * Centraliza la lógica de síntesis de voz para que los componentes/contexto
 * no dependan directamente del objeto global `window.speechSynthesis`.
 */

export const isSpeechSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Obtiene la lista de voces disponibles en el navegador.
 *
 * Las voces cargan de forma asíncrona, y en Android/Chrome el evento
 * `onvoiceschanged` a veces nunca se dispara (bug conocido de Chromium en
 * Android), lo que dejaba esta función esperando para siempre y la lista
 * de voces se veía vacía en el selector. Por eso se combinan 3 estrategias:
 * 1) un intento inmediato, 2) el evento oficial `onvoiceschanged`, y
 * 3) reintentos por temporizador como respaldo, con un límite de tiempo
 * para no quedar esperando indefinidamente si el dispositivo simplemente
 * no tiene más voces que ofrecer.
 */
export const getAvailableVoices = () =>
  new Promise((resolve) => {
    if (!isSpeechSupported()) return resolve([]);

    let settled = false;

    const trySettle = () => {
      if (settled) return;
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        settled = true;
        resolve(voices);
      }
    };

    trySettle();
    if (settled) return;

    window.speechSynthesis.onvoiceschanged = trySettle;

    let attempts = 0;
    const maxAttempts = 15; // ~4.5 segundos de reintentos como respaldo
    const interval = setInterval(() => {
      attempts += 1;
      trySettle();
      if (settled || attempts >= maxAttempts) {
        clearInterval(interval);
        if (!settled) {
          settled = true;
          resolve(window.speechSynthesis.getVoices()); // puede seguir vacío; el dispositivo no ofrece más
        }
      }
    }, 300);
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
