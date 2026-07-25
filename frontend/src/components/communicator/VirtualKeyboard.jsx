import { useState } from 'react';
import { Delete, X, Volume2, Plus } from 'lucide-react';
import SwitchScanner from '../accessibility/SwitchScanner';
import { useSpeech } from '../../context/SpeechContext';

// Distribución alfabética (más eficiente para escaneo secuencial que QWERTY,
// ya que el usuario no necesita conocer la disposición de un teclado físico).
const LETTER_ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
  ['J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'],
  ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
];

/**
 * VirtualKeyboard: teclado en pantalla para escribir frases completas letra
 * por letra, como alternativa a construir la frase tocando tarjetas.
 * Compatible con escaneo secuencial (recorre cada tecla automáticamente,
 * se selecciona con Espacio/Enter) para usuarios que no tienen acceso a un
 * teclado físico. También acepta tipeo directo si el dispositivo tiene
 * teclado (físico o del sistema operativo, tocando el campo de texto).
 */
export default function VirtualKeyboard({ onAddToPhrase }) {
  const [text, setText] = useState('');
  const { speak } = useSpeech();

  // Aplana todas las teclas (letras + acciones) en una sola lista para que
  // el escaneo secuencial las recorra todas en orden, de izquierda a
  // derecha y de arriba hacia abajo.
  const letterKeys = LETTER_ROWS.flat().map((letter) => ({
    type: 'letter',
    label: letter,
    action: () => setText((prev) => prev + letter.toLowerCase()),
  }));

  const actionKeys = [
    { type: 'space', label: 'Espacio', icon: null, action: () => setText((prev) => `${prev} `) },
    {
      type: 'backspace',
      label: 'Borrar letra',
      icon: Delete,
      action: () => setText((prev) => prev.slice(0, -1)),
    },
    { type: 'clear', label: 'Borrar todo', icon: X, action: () => setText('') },
    {
      type: 'speak',
      label: 'Hablar',
      icon: Volume2,
      action: () => text.trim() && speak(text.trim()),
    },
    {
      type: 'add',
      label: 'Agregar a la frase',
      icon: Plus,
      action: () => {
        if (!text.trim()) return;
        onAddToPhrase(text.trim());
        setText('');
      },
    },
  ];

  const allKeys = [...letterKeys, ...actionKeys];

  const handleKeySelect = (index) => {
    allKeys[index]?.action();
  };

  return (
    <div className="flex flex-col gap-4 p-3">
      {/* Campo de texto: muestra lo escrito y también acepta tipeo directo
          (teclado físico, o el teclado del sistema en celular/tablet). */}
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-gray-700">Escribe tu frase</span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí o usa el teclado en pantalla..."
          className="rounded-xl border-2 border-gray-300 p-3 text-xl"
          aria-label="Frase que estás escribiendo"
        />
      </label>

      <SwitchScanner itemsCount={allKeys.length} onSelect={handleKeySelect}>
        {({ activeIndex }) => (
          <div className="flex flex-col gap-2">
            {/* Filas de letras */}
            {LETTER_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-wrap justify-center gap-1.5">
                {row.map((letter) => {
                  const keyIndex = letterKeys.findIndex((k) => k.label === letter);
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => allKeys[keyIndex].action()}
                      className={`h-12 w-12 rounded-lg border-2 border-gray-300 bg-white text-lg font-bold text-gray-800 hover:bg-blue-50 ${
                        activeIndex === keyIndex ? 'ring-4 ring-offset-1 ring-blue-600 scale-105' : ''
                      }`}
                      aria-pressed={activeIndex === keyIndex}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Fila de acciones: espacio, borrar, hablar, agregar */}
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {actionKeys.map((key) => {
                const keyIndex = letterKeys.length + actionKeys.indexOf(key);
                const Icon = key.icon;
                const isPrimary = key.type === 'add' || key.type === 'speak';
                return (
                  <button
                    key={key.type}
                    type="button"
                    onClick={key.action}
                    aria-label={key.label}
                    className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold ${
                      isPrimary
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-gray-300 bg-white text-gray-700'
                    } ${
                      activeIndex === keyIndex ? 'ring-4 ring-offset-1 ring-blue-600 scale-105' : ''
                    }`}
                  >
                    {Icon ? <Icon size={20} aria-hidden="true" /> : <span aria-hidden="true">␣</span>}
                    {key.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </SwitchScanner>
    </div>
  );
}
