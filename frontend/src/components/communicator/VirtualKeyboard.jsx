import { useEffect, useMemo, useRef, useState } from 'react';
import { Delete, X, Volume2, Plus, Lightbulb } from 'lucide-react';
import SwitchScanner from '../accessibility/SwitchScanner';
import { useSpeech } from '../../context/SpeechContext';
import COMMON_WORDS from '../../utils/commonWords';

// Distribución alfabética (más eficiente para escaneo secuencial que QWERTY,
// ya que el usuario no necesita conocer la disposición de un teclado físico).
const LETTER_ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
  ['J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'],
  ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
];

const MAX_SUGGESTIONS = 5;

/**
 * VirtualKeyboard: teclado en pantalla para escribir frases completas letra
 * por letra, con sugerencias predictivas de palabras (como el teclado de un
 * celular) para completar más rápido. Las sugerencias combinan el
 * vocabulario propio del usuario (texto de sus tarjetas, más relevante)
 * con un diccionario general de palabras comunes en español.
 *
 * Compatible con escaneo secuencial: tanto las letras/acciones como las
 * sugerencias se recorren automáticamente y se seleccionan con Espacio/Enter.
 * También acepta tipeo directo si el dispositivo tiene teclado físico o del
 * sistema operativo.
 */
export default function VirtualKeyboard({ onAddToPhrase, vocabulary = [] }) {
  const [text, setText] = useState('');
  const { speak } = useSpeech();
  const inputRef = useRef(null);

  // El cursor siempre vuelve al campo de texto: al abrir el teclado, y
  // después de cada tecla tocada en pantalla (que de otra forma le
  // quitaría el foco al campo, ya que son botones reales).
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const focusInput = () => {
    // requestAnimationFrame espera a que el navegador termine de mover el
    // foco al botón presionado, y recién ahí lo regresa al campo de texto.
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const runKeyAction = (key) => {
    key.action();
    focusInput();
  };

  // Vocabulario combinado: palabras individuales sacadas de las tarjetas del
  // usuario (pueden ser frases completas, así que se separan por palabra)
  // + el diccionario general, sin duplicados.
  const wordPool = useMemo(() => {
    const wordsFromCards = vocabulary
      .flatMap((phrase) => phrase.toLowerCase().split(/\s+/))
      .map((w) => w.replace(/[^a-záéíóúñü]/gi, ''))
      .filter(Boolean);
    return [...new Set([...wordsFromCards, ...COMMON_WORDS])];
  }, [vocabulary]);

  // Palabra que se está escribiendo actualmente (lo que va después del
  // último espacio), usada para filtrar las sugerencias por prefijo.
  const currentWord = text.match(/(\S+)$/)?.[1]?.toLowerCase() ?? '';

  const suggestions = useMemo(() => {
    if (!currentWord) return [];
    return wordPool
      .filter((w) => w.startsWith(currentWord) && w !== currentWord)
      .sort((a, b) => a.length - b.length)
      .slice(0, MAX_SUGGESTIONS);
  }, [currentWord, wordPool]);

  // Reemplaza la palabra que se está escribiendo por la sugerencia elegida.
  const applySuggestion = (word) => {
    setText((prev) => `${prev.replace(/\S+$/, '')}${word} `);
  };

  const suggestionKeys = suggestions.map((word) => ({
    id: `suggestion-${word}`,
    kind: 'suggestion',
    label: word,
    action: () => applySuggestion(word),
  }));

  const letterKeys = LETTER_ROWS.flat().map((letter) => ({
    id: `letter-${letter}`,
    kind: 'letter',
    label: letter,
    action: () => setText((prev) => prev + letter.toLowerCase()),
  }));

  const actionKeys = [
    {
      id: 'space',
      kind: 'action',
      label: 'Espacio',
      icon: null,
      action: () => setText((prev) => `${prev} `),
    },
    {
      id: 'backspace',
      kind: 'action',
      label: 'Borrar letra',
      icon: Delete,
      action: () => setText((prev) => prev.slice(0, -1)),
    },
    { id: 'clear', kind: 'action', label: 'Borrar todo', icon: X, action: () => setText('') },
    {
      id: 'speak',
      kind: 'action',
      label: 'Hablar',
      icon: Volume2,
      action: () => text.trim() && speak(text.trim()),
    },
    {
      id: 'add',
      kind: 'action',
      label: 'Agregar a la frase',
      icon: Plus,
      action: () => {
        if (!text.trim()) return;
        onAddToPhrase(text.trim());
        setText('');
      },
    },
  ];

  // Orden de escaneo: sugerencias primero (son el camino más rápido para
  // completar), luego letras, luego acciones.
  const allKeys = [...suggestionKeys, ...letterKeys, ...actionKeys];

  const handleKeySelect = (index) => {
    const key = allKeys[index];
    if (key) runKeyAction(key);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-3">
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700">Escribe tu frase</span>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí o usa el teclado en pantalla..."
          className="rounded-xl border-2 border-gray-300 p-3 text-base sm:text-xl"
          aria-label="Frase que estás escribiendo"
        />
      </label>

      <SwitchScanner itemsCount={allKeys.length} onSelect={handleKeySelect}>
        {({ activeIndex }) => {
          const activeKey = allKeys[activeIndex];

          return (
            <div className="flex flex-col gap-3">
              {/* Sugerencias predictivas: solo aparecen mientras se escribe una palabra */}
              {suggestionKeys.length > 0 && (
                <div
                  className="flex flex-wrap items-center gap-2 rounded-xl bg-blue-50 p-2"
                  aria-label="Sugerencias de palabras"
                >
                  <Lightbulb size={18} className="text-blue-600" aria-hidden="true" />
                  {suggestionKeys.map((key) => (
                    <button
                      key={key.id}
                      type="button"
                      onClick={() => runKeyAction(key)}
                      className={`rounded-full border-2 border-blue-400 bg-white font-semibold text-blue-700 hover:bg-blue-100 ${
                        activeKey?.id === key.id ? 'ring-4 ring-offset-1 ring-blue-600 scale-105' : ''
                      }`}
                      style={{
                        padding: 'clamp(0.35rem, 1.5vw, 0.5rem) clamp(0.6rem, 2.5vw, 0.9rem)',
                        fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                      }}
                    >
                      {key.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Filas de letras */}
              <div className="flex flex-col gap-2">
                {LETTER_ROWS.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-wrap justify-center gap-[clamp(0.2rem,1vw,0.4rem)]">
                    {row.map((letter) => {
                      const key = letterKeys.find((k) => k.label === letter);
                      return (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => runKeyAction(key)}
                          className={`aspect-square rounded-lg border-2 border-gray-300 bg-white font-bold text-gray-800 hover:bg-blue-50 ${
                            activeKey?.id === key.id ? 'ring-4 ring-offset-1 ring-blue-600 scale-105' : ''
                          }`}
                          style={{
                            width: 'clamp(2.1rem, 8vw, 3.25rem)',
                            fontSize: 'clamp(0.9rem, 3vw, 1.25rem)',
                          }}
                          aria-pressed={activeKey?.id === key.id}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Fila de acciones: espacio, borrar, hablar, agregar */}
              <div className="mt-1 flex flex-wrap justify-center gap-[clamp(0.3rem,1.2vw,0.5rem)]">
                {actionKeys.map((key) => {
                  const Icon = key.icon;
                  const isPrimary = key.kind === 'action' && (key.id === 'add' || key.id === 'speak');
                  return (
                    <button
                      key={key.id}
                      type="button"
                      onClick={() => runKeyAction(key)}
                      className={`flex items-center gap-2 rounded-xl border-2 font-semibold ${
                        isPrimary
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700'
                      } ${
                        activeKey?.id === key.id ? 'ring-4 ring-offset-1 ring-blue-600 scale-105' : ''
                      }`}
                      style={{
                        padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1.25rem)',
                        fontSize: 'clamp(0.8rem, 2.2vw, 1rem)',
                      }}
                    >
                      {Icon ? (
                        <Icon
                          className="h-[clamp(1rem,3.5vw,1.25rem)] w-[clamp(1rem,3.5vw,1.25rem)]"
                          aria-hidden="true"
                        />
                      ) : (
                        <span aria-hidden="true">␣</span>
                      )}
                      {key.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }}
      </SwitchScanner>
    </div>
  );
}
