import { useEffect, useState } from 'react';
import { X, Users, Copy, Trash2 } from 'lucide-react';
import {
  generateInviteCodeRequest,
  connectWithCodeRequest,
  getLinkedUsersRequest,
  removeLinkRequest,
} from '../../services/api';
import Toast from '../ui/Toast';

const ROLE_LABELS = {
  paciente: 'Paciente',
  tutor: 'Tutor',
  terapeuta: 'Terapeuta',
};

/**
 * CareTeamModal: permite vincular la cuenta actual con otras (paciente,
 * tutor o terapeuta) mediante un código de invitación temporal, y muestra
 * el equipo de cuidado ya conectado.
 *
 * El vínculo es lo que determina, además de la autoría, quién puede ver
 * las tarjetas privadas de otro miembro y quién puede editarlas/eliminarlas
 * (ver reglas en backend/src/controllers/cardController.js).
 */
export default function CareTeamModal({ isOpen, onClose }) {
  const [inviteCode, setInviteCode] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [codeInput, setCodeInput] = useState('');
  const [linkedUsers, setLinkedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [toast, setToast] = useState(null);

  const loadLinkedUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getLinkedUsersRequest();
      setLinkedUsers(data);
    } catch {
      setToast({ message: 'No se pudo cargar el equipo de cuidado', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadLinkedUsers();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateCode = async () => {
    try {
      const { data } = await generateInviteCodeRequest();
      setInviteCode(data.inviteCode);
      setExpiresAt(data.expiresAt);
    } catch {
      setToast({ message: 'No se pudo generar el código', type: 'error' });
    }
  };

  const handleCopyCode = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setToast({ message: 'Código copiado al portapapeles', type: 'success' });
    } catch {
      // Si el navegador bloquea el portapapeles, el código igual queda visible en pantalla
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    setConnecting(true);
    try {
      const { data } = await connectWithCodeRequest(codeInput.trim());
      setToast({ message: data.message, type: 'success' });
      setCodeInput('');
      loadLinkedUsers();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'No se pudo vincular con ese código',
        type: 'error',
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleRemoveLink = async (userId, name) => {
    const confirmed = window.confirm(`¿Quitar a ${name} de tu equipo de cuidado?`);
    if (!confirmed) return;
    try {
      await removeLinkRequest(userId);
      setLinkedUsers((prev) => prev.filter((u) => u._id !== userId));
      setToast({ message: 'Vínculo eliminado', type: 'success' });
    } catch {
      setToast({ message: 'No se pudo eliminar el vínculo', type: 'error' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onKeyDown={handleKeyDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="care-team-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="care-team-title" className="flex items-center gap-2 text-xl font-bold">
            <Users size={22} aria-hidden="true" />
            Equipo de cuidado
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Vincula tu cuenta con la de tu paciente, tutor o terapeuta para compartir tarjetas
          privadas. Un paciente vinculado puede usar tus tarjetas, pero solo tú (o los
          profesionales vinculados a él) pueden editarlas o eliminarlas.
        </p>

        <div className="flex flex-col gap-6">
          {/* Generar código para que otro se vincule conmigo */}
          <section className="rounded-xl border-2 border-gray-200 p-4">
            <h3 className="mb-2 font-semibold">Invitar a alguien a tu equipo</h3>
            <button
              type="button"
              onClick={handleGenerateCode}
              className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white"
            >
              Generar código de invitación
            </button>

            {inviteCode && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div>
                  <p className="text-2xl font-mono font-bold tracking-widest">{inviteCode}</p>
                  <p className="text-xs text-gray-500">
                    Válido hasta {new Date(expiresAt).toLocaleString('es-ES')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  aria-label="Copiar código"
                  className="rounded-lg bg-white p-2 shadow hover:bg-gray-100"
                >
                  <Copy size={18} />
                </button>
              </div>
            )}
          </section>

          {/* Ingresar código de otra persona */}
          <section className="rounded-xl border-2 border-gray-200 p-4">
            <h3 className="mb-2 font-semibold">Unirme a un equipo con un código</h3>
            <form onSubmit={handleConnect} className="flex gap-2">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="Ej: A1B2C3"
                maxLength={6}
                className="flex-1 rounded-lg border-2 border-gray-300 p-2 font-mono tracking-widest"
              />
              <button
                type="submit"
                disabled={connecting}
                className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
              >
                {connecting ? 'Conectando...' : 'Vincular'}
              </button>
            </form>
          </section>

          {/* Lista de vínculos actuales */}
          <section className="rounded-xl border-2 border-gray-200 p-4">
            <h3 className="mb-2 font-semibold">Tu equipo actual</h3>
            {loading && <p className="text-sm text-gray-500">Cargando...</p>}
            {!loading && linkedUsers.length === 0 && (
              <p className="text-sm text-gray-500">Aún no tienes a nadie vinculado.</p>
            )}
            <ul className="flex flex-col gap-2">
              {linkedUsers.map((u) => (
                <li
                  key={u._id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-2 px-3"
                >
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-xs text-gray-500">
                      {ROLE_LABELS[u.role] || u.role} · {u.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(u._id, u.name)}
                    aria-label={`Quitar a ${u.name} del equipo`}
                    className="rounded-full p-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
