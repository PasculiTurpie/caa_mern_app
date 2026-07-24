import { Pencil, Trash2 } from 'lucide-react';
import { getCategoryStyles } from '../../utils/fitzgeraldColors';
import DwellDetector from '../accessibility/DwellDetector';

/**
 * CardItem: representa una tarjeta/pictograma individual dentro del CardGrid.
 * Aplica el color de la Clave Fitzgerald según su categoría, y soporta
 * resaltado de escaneo (`isScanning`) y selección por tiempo de morada
 * (a través de DwellDetector). Si `canEdit` es true (el usuario es el
 * creador de la tarjeta), muestra botones de editar y eliminar en la esquina.
 */
export default function CardItem({ card, onSelect, onEdit, onDelete, canEdit, isScanning }) {
  const styles = getCategoryStyles(card.category);

  const handleEditClick = (e) => {
    e.stopPropagation(); // evita que el clic también seleccione la tarjeta en la frase
    onEdit(card);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(card);
  };

  const handleSelectKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(card);
    }
  };

  return (
    <DwellDetector onSelect={() => onSelect(card)}>
      {({ dwelling, progress, handlers }) => (
        // Nota: se usa un <div role="button"> en vez de <button> porque los
        // botones de editar/eliminar (reales <button>) van anidados dentro;
        // anidar un <button> dentro de otro <button> es inválido en HTML y
        // rompe la navegación por teclado/lectores de pantalla.
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelect(card)}
          onKeyDown={handleSelectKeyDown}
          className={`card relative flex flex-col items-center justify-center gap-1 rounded-2xl border-4 p-3 min-h-[110px] transition-transform focus:scale-105 ${
            styles.bg
          } ${styles.border} ${styles.text} ${
            isScanning ? 'ring-4 ring-offset-2 ring-blue-600 scale-105' : ''
          }`}
          aria-pressed={isScanning}
          {...handlers}
        >
          {/* Botones de editar/eliminar: solo visibles para el creador de la tarjeta */}
          {canEdit && (
            <div className="absolute right-1.5 top-1.5 z-10 flex gap-1">
              <button
                type="button"
                onClick={handleEditClick}
                aria-label={`Editar tarjeta ${card.text}`}
                className="rounded-full bg-white/90 p-1.5 text-gray-700 shadow hover:bg-white"
              >
                <Pencil size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                aria-label={`Eliminar tarjeta ${card.text}`}
                className="rounded-full bg-white/90 p-1.5 text-red-600 shadow hover:bg-white"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Indicador circular de progreso para selección por Dwell Time */}
          {dwelling && (
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(37,99,235,0.85)"
                strokeWidth="6"
                strokeDasharray="289"
                strokeDashoffset={289 - (289 * progress) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
          )}

          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt=""
              className="h-12 w-12 object-contain"
              draggable={false}
            />
          ) : (
            <span className="text-4xl" aria-hidden="true">
              {card.emoji || '🔲'}
            </span>
          )}

          <span className="text-card-lg font-bold leading-tight text-center break-words">
            {card.text}
          </span>
        </div>
      )}
    </DwellDetector>
  );
}
