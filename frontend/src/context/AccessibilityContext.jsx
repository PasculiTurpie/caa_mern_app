import { createContext, useContext, useEffect, useState } from 'react';

const AccessibilityContext = createContext(null);

const DEFAULTS = {
  scanningEnabled: false,
  scanSpeed: 1500, // ms entre cada tarjeta resaltada en modo escaneo
  dwellEnabled: false,
  dwellTime: 1200, // ms que el puntero/mirada debe permanecer para seleccionar
  theme: 'light', // 'light' | 'dark' | 'high-contrast'
};

/**
 * Centraliza el estado de las funciones de accesibilidad de movilidad reducida:
 * - Escaneo secuencial (Switch Access)
 * - Tiempo de morada (Dwell Time / Eye Tracking)
 * - Tema visual (claro, oscuro, alto contraste)
 *
 * Este contexto puede inicializarse con las preferencias guardadas del usuario
 * (ver AuthContext) y sincronizarse con el backend al cambiar.
 */
export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  // Aplica la clase de tema al elemento raíz del documento
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-high-contrast');
    if (settings.theme === 'dark') root.classList.add('dark');
    if (settings.theme === 'high-contrast') root.classList.add('theme-high-contrast');
  }, [settings.theme]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const loadFromPreferences = (prefs = {}) => {
    setSettings((prev) => ({
      ...prev,
      scanningEnabled: prefs.scanningEnabled ?? prev.scanningEnabled,
      scanSpeed: prefs.scanSpeed ?? prev.scanSpeed,
      dwellEnabled: prefs.dwellEnabled ?? prev.dwellEnabled,
      dwellTime: prefs.dwellTime ?? prev.dwellTime,
      theme: prefs.theme ?? prev.theme,
    }));
  };

  const value = { ...settings, updateSetting, loadFromPreferences };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility debe usarse dentro de un AccessibilityProvider');
  return ctx;
};
