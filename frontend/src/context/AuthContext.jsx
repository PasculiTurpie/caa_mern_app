import { createContext, useContext, useEffect, useState } from 'react';
import {
  loginRequest,
  registerRequest,
  getProfileRequest,
  updatePreferencesRequest,
} from '../services/api';
import { useAccessibility } from './AccessibilityContext';

const AuthContext = createContext(null);

const TOKEN_KEY = 'caa_token';

/**
 * Maneja el estado de autenticación del usuario: login, registro, logout
 * y sincronización de sus preferencias de accesibilidad con AccessibilityContext.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { loadFromPreferences } = useAccessibility();

  // Al montar, intenta restaurar la sesión desde el token guardado
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    getProfileRequest()
      .then(({ data }) => {
        setUser(data);
        loadFromPreferences(data.accessibilityPreferences);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const { data } = await loginRequest({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data);
    loadFromPreferences(data.accessibilityPreferences);
    return data;
  };

  const register = async (name, email, password, role) => {
    const { data } = await registerRequest({ name, email, password, role });
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data);
    loadFromPreferences(data.accessibilityPreferences);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const savePreferences = async (partialPrefs) => {
    const { data } = await updatePreferencesRequest(partialPrefs);
    setUser((prev) => (prev ? { ...prev, accessibilityPreferences: data } : prev));
    return data;
  };

  const value = { user, loading, login, register, logout, savePreferences };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return ctx;
};
