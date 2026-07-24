import { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Toast: notificación breve no intrusiva. Usa `role="status"` para que
 * los lectores de pantalla la anuncien automáticamente (aria-live implícito).
 * Se auto-cierra después de `duration` ms.
 */
export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      role="status"
      className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-lg ${
        isSuccess ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      {message}
    </div>
  );
}
