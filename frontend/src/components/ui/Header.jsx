import { Settings, Plus, LogOut, MessageSquareText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Header: barra superior con el nombre de la app, y accesos rápidos
 * a ajustes de accesibilidad, añadir tarjeta y cerrar sesión.
 * Todos los botones son grandes y tienen etiquetas accesibles (aria-label).
 */
export default function Header({ onOpenSettings, onOpenAddCard }) {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b-4 border-gray-100 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <MessageSquareText size={28} className="text-blue-600" aria-hidden="true" />
        <span className="text-lg font-extrabold">Comunicador CAA</span>
      </div>

      <div className="flex items-center gap-2">
        {user && <span className="hidden sm:inline text-sm text-gray-600">Hola, {user.name}</span>}

        <button
          type="button"
          onClick={onOpenAddCard}
          aria-label="Añadir nueva tarjeta"
          className="rounded-xl bg-green-100 p-3 text-green-700 hover:bg-green-200"
        >
          <Plus size={22} />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Abrir ajustes de accesibilidad"
          className="rounded-xl bg-gray-100 p-3 text-gray-700 hover:bg-gray-200"
        >
          <Settings size={22} />
        </button>

        {user && (
          <button
            type="button"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="rounded-xl bg-red-100 p-3 text-red-700 hover:bg-red-200"
          >
            <LogOut size={22} />
          </button>
        )}
      </div>
    </header>
  );
}
