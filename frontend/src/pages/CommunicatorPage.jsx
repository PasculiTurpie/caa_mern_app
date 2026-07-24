import { useEffect, useState, useCallback } from 'react';
import Header from '../components/ui/Header';
import PhraseBar from '../components/communicator/PhraseBar';
import CategoryFilter from '../components/communicator/CategoryFilter';
import CardGrid from '../components/communicator/CardGrid';
import AddCardModal from '../components/modals/AddCardModal';
import SettingsModal from '../components/modals/SettingsModal';
import Toast from '../components/ui/Toast';
import { getCardsRequest, createCardRequest } from '../services/api';

/**
 * CommunicatorPage: pantalla principal de la aplicación. Combina la barra
 * de frase, el filtro de categorías y la cuadrícula de tarjetas, y coordina
 * la carga/creación de tarjetas contra el backend.
 */
export default function CommunicatorPage() {
  const [cards, setCards] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    setSelectedCards((prev) => [...prev, card]);
  };

  const handleRemoveFromPhrase = (index) => {
    setSelectedCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearPhrase = () => setSelectedCards([]);

  const handleAddCard = async (cardData) => {
    try {
      const { data } = await createCardRequest(cardData);
      setCards((prev) => [data, ...prev]);
      setToast({ message: 'Tarjeta creada correctamente', type: 'success' });
    } catch {
      setToast({ message: 'No se pudo crear la tarjeta', type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddCard={() => setIsAddCardOpen(true)}
      />

      <PhraseBar
        selectedCards={selectedCards}
        onClear={handleClearPhrase}
        onRemoveCard={handleRemoveFromPhrase}
      />

      <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />

      <main className="flex-1">
        {loading ? (
          <p className="p-8 text-center text-gray-500" role="status">
            Cargando tarjetas...
          </p>
        ) : (
          <CardGrid cards={cards} onCardSelect={handleSelectCard} />
        )}
      </main>

      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onSubmit={handleAddCard}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
