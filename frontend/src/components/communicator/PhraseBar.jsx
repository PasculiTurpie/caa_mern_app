import { Volume2, Delete, Trash2, Sparkles } from 'lucide-react';
import { getCategoryStyles } from '../../utils/fitzgeraldColors';
import { useSpeech } from '../../context/SpeechContext';

/**
 * PhraseBar: muestra la secuencia de tarjetas seleccionadas por el usuario
 * ("la frase en construcción"), con botones para reproducirla en voz alta,
 * quitar la última tarjeta agregada (de a una, `onRemoveLast`), vaciar toda
 * la frase de una sola vez (`onClearAll`) y (opcionalmente) expandirla con
 * IA a una frase gramaticalmente completa.
 *
 * Se mantienen ambas acciones (y no solo "quitar última") pensando en
 * escaneo secuencial / dwell time: si el usuario se equivoca al principio
 * de una frase larga, cada clic extra le cuesta tiempo y esfuerzo, así que
 * "vaciar todo" sigue siendo necesario como atajo.
 */
export default function PhraseBar({
  selectedCards,
  onRemoveLast,
  onClearAll,
  onRemoveCard,
  onExpandWithAI,
}) {
  const { speak } = useSpeech();

  const phraseText = selectedCards.map((c) => c.text).join(' ');

  const handleSpeak = () => {
    if (phraseText) speak(phraseText);
  };

  return (
    <div className="flex items-center gap-2 border-b-4 border-gray-200 bg-white p-3">
      <div
        className="flex min-h-[64px] flex-1 flex-wrap items-center gap-2 overflow-x-auto rounded-xl bg-gray-50 p-2"
        aria-live="polite"
        aria-label="Frase actual"
      >
        {selectedCards.length === 0 && (
          <span className="px-2 text-gray-400">Toca tarjetas para construir una frase...</span>
        )}
        {selectedCards.map((card, index) => {
          const styles = getCategoryStyles(card.category);
          return (
            <button
              key={`${card._id}-${index}`}
              type="button"
              onClick={() => onRemoveCard(index)}
              title="Quitar de la frase"
              className={`flex items-center gap-1 rounded-lg border-2 px-3 py-1.5 font-semibold ${styles.bg} ${styles.border} ${styles.text}`}
            >
              {card.emoji && <span aria-hidden="true">{card.emoji}</span>}
              {card.text}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSpeak}
        disabled={selectedCards.length === 0}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white disabled:opacity-40"
        aria-label="Hablar frase"
      >
        <Volume2 size={22} aria-hidden="true" />
        Hablar
      </button>

      {onExpandWithAI && (
        <button
          type="button"
          onClick={() => onExpandWithAI(phraseText)}
          disabled={selectedCards.length === 0}
          className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-bold text-white disabled:opacity-40"
          aria-label="Expandir frase con inteligencia artificial"
        >
          <Sparkles size={22} aria-hidden="true" />
          Expandir
        </button>
      )}

      <button
        type="button"
        onClick={onRemoveLast}
        disabled={selectedCards.length === 0}
        className="flex items-center gap-2 rounded-xl bg-gray-200 px-4 py-3 font-bold text-gray-700 disabled:opacity-40"
        aria-label="Quitar la última tarjeta de la frase"
        title="Quitar la última tarjeta"
      >
        <Delete size={22} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onClearAll}
        disabled={selectedCards.length === 0}
        className="flex items-center gap-2 rounded-xl bg-red-100 px-4 py-3 font-bold text-red-700 disabled:opacity-40"
        aria-label="Borrar toda la frase"
        title="Borrar toda la frase"
      >
        <Trash2 size={22} aria-hidden="true" />
      </button>
    </div>
  );
}
