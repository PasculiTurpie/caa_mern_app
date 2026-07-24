import SwitchScanner from '../accessibility/SwitchScanner';
import CardItem from './CardItem';

/**
 * CardGrid: cuadrícula de tarjetas seleccionables. Se integra con SwitchScanner
 * para resaltar automáticamente cada tarjeta en modo escaneo secuencial,
 * permitiendo selección con un único pulsador (Espacio/Enter).
 */
export default function CardGrid({ cards, onCardSelect }) {
  if (cards.length === 0) {
    return (
      <p className="p-8 text-center text-gray-500" role="status">
        No hay tarjetas en esta categoría todavía. Usa "Añadir tarjeta" para crear una.
      </p>
    );
  }

  return (
    <SwitchScanner itemsCount={cards.length} onSelect={(index) => onCardSelect(cards[index])}>
      {({ activeIndex }) => (
        <div
          className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          role="grid"
          aria-label="Tablero de tarjetas de comunicación"
        >
          {cards.map((card, index) => (
            <CardItem
              key={card._id}
              card={card}
              onSelect={onCardSelect}
              isScanning={activeIndex === index}
            />
          ))}
        </div>
      )}
    </SwitchScanner>
  );
}
