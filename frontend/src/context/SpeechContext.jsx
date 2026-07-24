import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAvailableVoices, speak as speakService, cancelSpeech } from '../services/speechService';

const SpeechContext = createContext(null);

/**
 * Provee acceso global a la síntesis de voz (Web Speech API) y a la
 * configuración de voz elegida por el usuario (velocidad, tono, voz).
 * Cualquier componente puede llamar a `speak(text)` para leer en voz alta.
 */
export function SpeechProvider({ children }) {
  const [voices, setVoices] = useState([]);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [voiceURI, setVoiceURI] = useState('');

  useEffect(() => {
    getAvailableVoices().then((availableVoices) => {
      setVoices(availableVoices);
      // Selecciona por defecto la primera voz en español disponible, si existe
      const spanishVoice = availableVoices.find((v) => v.lang?.startsWith('es'));
      if (spanishVoice && !voiceURI) setVoiceURI(spanishVoice.voiceURI);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const speak = useCallback(
    (text) => {
      speakService(text, { rate, pitch, voiceURI, lang: 'es-ES' });
    },
    [rate, pitch, voiceURI]
  );

  const stop = useCallback(() => cancelSpeech(), []);

  const value = {
    voices,
    rate,
    setRate,
    pitch,
    setPitch,
    voiceURI,
    setVoiceURI,
    speak,
    stop,
  };

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
}

// Hook de conveniencia para consumir el contexto de voz
export const useSpeech = () => {
  const ctx = useContext(SpeechContext);
  if (!ctx) throw new Error('useSpeech debe usarse dentro de un SpeechProvider');
  return ctx;
};
