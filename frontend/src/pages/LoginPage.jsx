import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle, WifiOff, ServerCrash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage: pantalla de acceso con alternancia entre inicio de sesión
 * y registro. Formulario grande y de alto contraste, pensado para ser
 * usado también por tutores/terapeutas en nombre del usuario con CAA.
 */
export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('paciente');
  const [error, setError] = useState(null); // { type: 'auth' | 'network' | 'server' | 'other', message }
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Detecta si Bloq Mayús está activo mientras se escribe la contraseña,
  // para avisar antes de que un intento de login falle por error de tipeo.
  const handlePasswordKeyEvent = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      navigate('/');
    } catch (err) {
      if (err.response) {
        // El servidor respondió, pero con un error (credenciales, validación, etc.)
        const { status, data } = err.response;
        if (status === 401) {
          setError({
            type: 'auth',
            message:
              mode === 'login'
                ? 'Correo o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.'
                : data?.message || 'Ocurrió un error al registrarte.',
          });
        } else if (status >= 500) {
          setError({
            type: 'server',
            message: 'El servidor tuvo un problema (posiblemente con la base de datos). Inténtalo de nuevo en unos minutos.',
          });
        } else {
          setError({ type: 'other', message: data?.message || 'Ocurrió un error. Inténtalo de nuevo.' });
        }
      } else if (err.request) {
        // La petición se envió pero no hubo respuesta: sin conexión al servidor/base de datos
        setError({
          type: 'network',
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet o que el servidor esté en línea.',
        });
      } else {
        setError({ type: 'other', message: 'Ocurrió un error inesperado. Inténtalo de nuevo.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const errorIcon = {
    auth: <AlertTriangle size={16} aria-hidden="true" />,
    network: <WifiOff size={16} aria-hidden="true" />,
    server: <ServerCrash size={16} aria-hidden="true" />,
    other: <AlertTriangle size={16} aria-hidden="true" />,
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-extrabold">
          {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <label className="flex flex-col gap-1">
              <span className="font-semibold">Nombre</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-lg border-2 border-gray-300 p-2"
              />
            </label>
          )}

          <label className="flex flex-col gap-1">
            <span className="font-semibold">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border-2 border-gray-300 p-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-semibold">Contraseña</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handlePasswordKeyEvent}
                onKeyUp={handlePasswordKeyEvent}
                required
                minLength={6}
                className="w-full rounded-lg border-2 border-gray-300 p-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
            {capsLockOn && (
              <span
                role="alert"
                className="flex items-center gap-1 text-sm font-semibold text-amber-600"
              >
                <AlertTriangle size={16} aria-hidden="true" />
                Bloq Mayús está activado
              </span>
            )}
          </label>

          {mode === 'register' && (
            <label className="flex flex-col gap-1">
              <span className="font-semibold">Rol</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg border-2 border-gray-300 p-2"
              >
                <option value="paciente">Paciente</option>
                <option value="tutor">Tutor</option>
                <option value="terapeuta">Terapeuta</option>
              </select>
            </label>
          )}

          {error && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-lg bg-red-50 p-2 text-sm font-semibold text-red-600"
            >
              {errorIcon[error.type]}
              {error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-xl bg-blue-600 py-3 font-bold text-white disabled:opacity-50"
          >
            {mode === 'login' ? 'Entrar' : 'Registrarme'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="mt-4 w-full text-center text-sm font-semibold text-blue-600 underline"
        >
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}
