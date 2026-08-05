import { useEffect, useState, useCallback } from 'react';
import { LayoutGrid, Keyboard, Star } from 'lucide-react';
import Header from '../components/ui/Header';
import PhraseBar from '../components/communicator/PhraseBar';
import CategoryFilter from '../components/communicator/CategoryFilter';
import CardGrid from '../components/communicator/CardGrid';
import VirtualKeyboard from '../components/communicator/VirtualKeyboard';
import AddCardModal from '../components/modals/AddCardModal';
import SettingsModal from '../components/modals/SettingsModal';
import CareTeamModal from '../components/modals/CareTeamModal';
import Toast from '../components/ui/Toast';
import {
  getCardsRequest,
  createCardRequest,
  updateCardRequest,
  deleteCardRequest,
  markCardUsedRequest,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { playClickSound } from '../services/soundService';

/**
 * CommunicatorPage: pantalla principal de la aplicación. Combina la barra
 * de frase, el filtro de categorías y la cuadrícula de tarjetas, y coordina
 * la carga/creación/edición de tarjetas contra el backend.
 */
export default function CommunicatorPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'keyboard'
  const [sortByUsage, setSortByUsage] = useState(false); // 'más usadas primero'
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null); // null = modo "crear"
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCareTeamOpen, setIsCareTeamOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCards = useCallback(async (category) => {
    setLoading(true);
    try {
      const { data } = await getCardsRequest(category || undefined);
      setCards(data);
    } catch {
      setToast({ message: 'No se pudieron cargar las tarjetas', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards(activeCategory);
  }, [activeCategory, loadCards]);

  const handleSelectCard = (card) => {
    playClickSound();
    setSelectedCards((prev) => [...prev, card]);

    // Registra el uso solo para tarjetas reales (con id de Mongo), no para
    // las entradas armadas con el teclado virtual (id "typed-...", no
    // existen en la base de datos). Fire-and-forget: si falla, no debe
    // interrumpir la construcción de la frase, que es lo importante.
    if (!card._id?.toString().startsWith('typed-')) {
      markCardUsedRequest(card._id).catch(() => {});
    }
  };

  const handleRemoveFromPhrase = (index) => {
    setSelectedCards((prev) => prev.filter((_, i) => i !== index));
  };

  // Quita la última tarjeta agregada a la frase, de a una por cada clic
  // ("backspace"). Útil para correcciones puntuales al final de la frase.
  const handleRemoveLastCard = () => {
    setSelectedCards((prev) => prev.slice(0, -1));
  };

  // Vacía toda la frase de una sola vez. Se mantiene como acción separada
  // de "quitar última" porque en escaneo secuencial/dwell time, deshacer
  // una frase larga tarjeta por tarjeta cuesta demasiado tiempo/esfuerzo.
  const handleClearAllCards = () => {
    setSelectedCards([]);
  };

  // Agrega el texto escrito con el teclado como un elemento más de la frase,
  // igual que si fuera una tarjeta (así se lee junto con el resto al presionar
  // "Hablar" en la barra de frase, y se puede quitar tocándolo).
  const handleAddTypedPhrase = (typedText) => {
    setSelectedCards((prev) => [
      ...prev,
      { _id: `typed-${Date.now()}`, text: typedText, category: null, emoji: '⌨️' },
    ]);
  };

  const handleOpenAddCard = () => {
    setEditingCard(null); // asegura que el modal abra en modo "crear"
    setIsCardModalOpen(true);
  };

  const handleOpenEditCard = (card) => {
    setEditingCard(card);
    setIsCardModalOpen(true);
  };

  const handleCloseCardModal = () => {
    setIsCardModalOpen(false);
    setEditingCard(null);
  };

  // Crea o actualiza una tarjeta según si `editingCard` está definido.
  const handleSubmitCard = async (cardData) => {
    try {
      if (editingCard) {
        const { data } = await updateCardRequest(editingCard._id, cardData);
        setCards((prev) => prev.map((c) => (c._id === data._id ? data : c)));
        setSelectedCards((prev) => prev.map((c) => (c._id === data._id ? data : c)));
        setToast({ message: 'Tarjeta actualizada correctamente', type: 'success' });
      } else {
        const { data } = await createCardRequest(cardData);
        setCards((prev) => [data, ...prev]);
        setToast({ message: 'Tarjeta creada correctamente', type: 'success' });
      }
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      setToast({
        message:
          backendMessage ||
          (editingCard ? 'No se pudo actualizar la tarjeta' : 'No se pudo crear la tarjeta'),
        type: 'error',
      });
    }
  };

  // Elimina una tarjeta tras confirmación del usuario (acción irreversible).
  const handleDeleteCard = async (card) => {
    const confirmed = window.confirm(`¿Eliminar la tarjeta "${card.text}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    try {
      await deleteCardRequest(card._id);
      setCards((prev) => prev.filter((c) => c._id !== card._id));
      setSelectedCards((prev) => prev.filter((c) => c._id !== card._id));
      setToast({ message: 'Tarjeta eliminada correctamente', type: 'success' });
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      setToast({ message: backendMessage || 'No se pudo eliminar la tarjeta', type: 'error' });
    }
  };

  // Regla de UI que refleja la del backend (ver cardController.canManageCard):
  // el dueño siempre puede gestionar su tarjeta; un paciente solo gestiona
  // las suyas; tutor/terapeuta puede gestionar además las de su equipo vinculado.
  const canManageCard = (card) => {
    if (!user) return false;
    if (card.creator === user._id) return true;
    if (user.role === 'paciente') return false;
    return true; // el backend valida el vínculo real; si no corresponde, mostrará el error
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddCard={handleOpenAddCard}
        onOpenCareTeam={() => setIsCareTeamOpen(true)}
      />

      <PhraseBar
        selectedCards={selectedCards}
        onRemoveLast={handleRemoveLastCard}
        onClearAll={handleClearAllCards}
        onRemoveCard={handleRemoveFromPhrase}
      />

      <div className="flex items-center justify-center gap-2 border-b-2 border-gray-100 bg-white py-2">
        <button
          type="button"
          onClick={() => setViewMode('cards')}
          aria-pressed={viewMode === 'cards'}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold ${
            viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <LayoutGrid size={18} aria-hidden="true" />
          Tarjetas
        </button>
        <button
          type="button"
          onClick={() => setViewMode('keyboard')}
          aria-pressed={viewMode === 'keyboard'}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-semibold ${
            viewMode === 'keyboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Keyboard size={18} aria-hidden="true" />
          Teclado
        </button>
      </div>

      {viewMode === 'cards' && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
          <button
            type="button"
            onClick={() => setSortByUsage((prev) => !prev)}
            aria-pressed={sortByUsage}
            className={`mx-3 flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-semibold ${
              sortByUsage
                ? 'border-amber-400 bg-amber-100 text-amber-800'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            <Star size={16} aria-hidden="true" fill={sortByUsage ? 'currentColor' : 'none'} />
            Más usadas primero
          </button>
        </div>
      )}

      <main className="flex-1">
        {viewMode === 'keyboard' ? (
          <VirtualKeyboard onAddToPhrase={handleAddTypedPhrase} vocabulary={cards.map((c) => c.text)} />
        ) : loading ? (
          <p className="p-8 text-center text-gray-500" role="status">
            Cargando tarjetas...
          </p>
        ) : (
          <CardGrid
            cards={
              sortByUsage
                ? [...cards].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
                : cards
            }
            onCardSelect={handleSelectCard}
            onCardEdit={handleOpenEditCard}
            onCardDelete={handleDeleteCard}
            canManageCard={canManageCard}
          />
        )}
      </main>

      <AddCardModal
        isOpen={isCardModalOpen}
        onClose={handleCloseCardModal}
        onSubmit={handleSubmitCard}
        initialCard={editingCard}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <CareTeamModal isOpen={isCareTeamOpen} onClose={() => setIsCareTeamOpen(false)} />

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
