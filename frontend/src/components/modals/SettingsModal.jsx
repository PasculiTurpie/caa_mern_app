import { X } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useSpeech } from '../../context/SpeechContext';
import { useAuth } from '../../context/AuthContext';

/**
 * SettingsModal: panel accesible para calibrar todas las opciones de
 * accesibilidad: velocidad de escaneo, tiempo de dwell, voz del sistema,
 * velocidad/tono de voz y tema visual. Los cambios se guardan también
 * en el backend a través de AuthContext.savePreferences.
 */
export default function SettingsModal({ isOpen, onClose }) {
  const {
    scanningEnabled,
    scanSpeed,
    dwellEnabled,
    dwellTime,
    theme,
    updateSetting,
  } = useAccessibility();
  const { voices, rate, setRate, pitch, setPitch, voiceURI, setVoiceURI } = useSpeech();
  const { savePreferences } = useAuth();

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  const persist = async (partial) => {
    try {
      await savePreferences(partial);
    } catch {
      // Falla silenciosamente si no hay sesión activa; los ajustes
      // siguen aplicándose localmente vía AccessibilityContext.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onKeyDown={handleKeyDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="settings-title" className="text-xl font-bold">
            Ajustes de accesibilidad
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* Escaneo secuencial */}
          <section className="rounded-xl border-2 border-gray-200 p-4">
            <label className="flex items-center justify-between gap-2 font-semibold">
              Escaneo secuencial (pulsadores)
              <input
                type="checkbox"
                checked={scanningEnabled}
                onChange={(e) => {
                  updateSetting('scanningEnabled', e.target.checked);
                  persist({ scanningEnabled: e.target.checked });
                }}
                className="h-6 w-6"
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Velocidad de escaneo: {scanSpeed} ms
              <input
                type="range"
                min="500"
                max="4000"
                step="100"
                value={scanSpeed}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateSetting('scanSpeed', val);
                  persist({ scanSpeed: val });
                }}
              />
            </label>
          </section>

          {/* Tiempo de morada (Dwell) */}
          <section className="rounded-xl border-2 border-gray-200 p-4">
            <label className="flex items-center justify-between gap-2 font-semibold">
              Selección por tiempo de morada (eye-tracking)
              <input
                type="checkbox"
                checked={dwellEnabled}
                onChange={(e) => {
                  updateSetting('dwellEnabled', e.target.checked);
                  persist({ dwellEnabled: e.target.checked });
                }}
                className="h-6 w-6"
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Tiempo de morada: {dwellTime} ms
              <input
                type="range"
                min="400"
                max="3000"
                step="100"
                value={dwellTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateSetting('dwellTime', val);
                  persist({ dwellTime: val });
                }}
              />
            </label>
          </section>

          {/* Voz */}
          <section className="rounded-xl border-2 border-gray-200 p-4">
            <h3 className="mb-2 font-semibold">Voz del sistema</h3>
            <label className="flex flex-col gap-1 text-sm">
              Voz
              <select
                value={voiceURI}
                onChange={(e) => setVoiceURI(e.target.value)}
                className="rounded-lg border-2 border-gray-300 p-2"
              >
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Velocidad: {rate.toFixed(1)}x
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Tono: {pitch.toFixed(1)}
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
              />
            </label>
          </section>

          {/* Tema visual */}
          <section className="rounded-xl border-2 border-gray-200 p-4">
            <h3 className="mb-2 font-semibold">Tema visual</h3>
            <div className="flex gap-2">
              {[
                { id: 'light', label: 'Claro' },
                { id: 'dark', label: 'Oscuro' },
                { id: 'high-contrast', label: 'Alto contraste' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    updateSetting('theme', opt.id);
                    persist({ theme: opt.id });
                  }}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold ${
                    theme === opt.id
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
