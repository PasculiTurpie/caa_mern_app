import { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useSpeech } from '../../context/SpeechContext';
import { useAuth } from '../../context/AuthContext';
import Toast from '../ui/Toast';

/**
 * SettingsModal: panel accesible para calibrar todas las opciones de
 * accesibilidad: velocidad de escaneo, tiempo de dwell, voz del sistema,
 * velocidad/tono de voz y tema visual.
 *
 * Los cambios se editan localmente (borrador) mientras el usuario ajusta
 * los controles, y solo se aplican/persisten todos juntos al pulsar
 * "Guardar ajustes". Cerrar el modal sin guardar descarta los cambios.
 */
export default function SettingsModal({ isOpen, onClose }) {
  const accessibility = useAccessibility();
  const speech = useSpeech();
  const { savePreferences } = useAuth();

  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Al abrir el modal, inicializa el borrador con los valores actuales
  // de accesibilidad y voz (para poder cancelar sin efectos secundarios).
  useEffect(() => {
    if (!isOpen) return;
    setDraft({
      scanningEnabled: accessibility.scanningEnabled,
      scanSpeed: accessibility.scanSpeed,
      dwellEnabled: accessibility.dwellEnabled,
      dwellTime: accessibility.dwellTime,
      theme: accessibility.theme,
      rate: speech.rate,
      pitch: speech.pitch,
      voiceURI: speech.voiceURI,
    });
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen || !draft) return null;

  const updateDraft = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  // Aplica todo el borrador de una vez: actualiza los contextos locales
  // (accesibilidad y voz) y persiste las preferencias en el backend.
  const handleSave = async () => {
    setSaving(true);
    try {
      accessibility.updateSetting('scanningEnabled', draft.scanningEnabled);
      accessibility.updateSetting('scanSpeed', draft.scanSpeed);
      accessibility.updateSetting('dwellEnabled', draft.dwellEnabled);
      accessibility.updateSetting('dwellTime', draft.dwellTime);
      accessibility.updateSetting('theme', draft.theme);
      speech.setRate(draft.rate);
      speech.setPitch(draft.pitch);
      speech.setVoiceURI(draft.voiceURI);

      await savePreferences({
        scanningEnabled: draft.scanningEnabled,
        scanSpeed: draft.scanSpeed,
        dwellEnabled: draft.dwellEnabled,
        dwellTime: draft.dwellTime,
        theme: draft.theme,
        voiceRate: draft.rate,
        voicePitch: draft.pitch,
        preferredVoiceURI: draft.voiceURI,
      });

      setToast({ message: 'Ajustes guardados correctamente', type: 'success' });
    } catch {
      setToast({ message: 'No se pudieron guardar los ajustes en el servidor', type: 'error' });
    } finally {
      setSaving(false);
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
                checked={draft.scanningEnabled}
                onChange={(e) => updateDraft('scanningEnabled', e.target.checked)}
                className="h-6 w-6"
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Velocidad de escaneo: {draft.scanSpeed} ms
              <input
                type="range"
                min="500"
                max="4000"
                step="100"
                value={draft.scanSpeed}
                onChange={(e) => updateDraft('scanSpeed', Number(e.target.value))}
              />
            </label>
          </section>

          {/* Tiempo de morada (Dwell) */}
          <section className="rounded-xl border-2 border-gray-200 p-4">
            <label className="flex items-center justify-between gap-2 font-semibold">
              Selección por tiempo de morada (eye-tracking)
              <input
                type="checkbox"
                checked={draft.dwellEnabled}
                onChange={(e) => updateDraft('dwellEnabled', e.target.checked)}
                className="h-6 w-6"
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Tiempo de morada: {draft.dwellTime} ms
              <input
                type="range"
                min="400"
                max="3000"
                step="100"
                value={draft.dwellTime}
                onChange={(e) => updateDraft('dwellTime', Number(e.target.value))}
              />
            </label>
          </section>

          {/* Voz */}
          <section className="rounded-xl border-2 border-gray-200 p-4">
            <h3 className="mb-2 font-semibold">Voz del sistema</h3>
            <label className="flex flex-col gap-1 text-sm">
              Voz
              <select
                value={draft.voiceURI}
                onChange={(e) => updateDraft('voiceURI', e.target.value)}
                className="rounded-lg border-2 border-gray-300 p-2"
              >
                {speech.voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Velocidad: {draft.rate.toFixed(1)}x
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={draft.rate}
                onChange={(e) => updateDraft('rate', Number(e.target.value))}
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Tono: {draft.pitch.toFixed(1)}
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={draft.pitch}
                onChange={(e) => updateDraft('pitch', Number(e.target.value))}
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
                  onClick={() => updateDraft('theme', opt.id)}
                  className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold ${
                    draft.theme === opt.id
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Guardado explícito de todos los ajustes */}
          <div className="flex justify-end gap-2 border-t-2 border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-200 px-4 py-3 font-semibold"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:opacity-50"
            >
              <Save size={20} aria-hidden="true" />
              {saving ? 'Guardando...' : 'Guardar ajustes'}
            </button>
          </div>
        </div>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
