import { getCategoryStyles } from '../../utils/fitzgeraldColors';
import DwellDetector from '../accessibility/DwellDetector';

/**
 * CardItem: representa una tarjeta/pictograma individual dentro del CardGrid.
 * Aplica el color de la Clave Fitzgerald según su categoría, y soporta
 * resaltado de escaneo (`isScanning`) y selección por tiempo de morada
 * (a través de DwellDetector).
 */
export default function CardItem({ card, onSelect, isScanning }) {
  const styles = getCategoryStyles(card.category);

  return (
    <DwellDetector onSelect={() => onSelect(card)}>
      {({ dwelling, progress, handlers }) => (
        <button
          type="button"
          onClick={() => onSelect(card)}
          className={`card relative flex flex-col items-center justify-center gap-1 rounded-2xl border-4 p-3 min-h-[110px] transition-transform focus:scale-105 ${
            styles.bg
          } ${styles.border} ${styles.text} ${
            isScanning ? 'ring-4 ring-offset-2 ring-blue-600 scale-105' : ''
          }`}
          aria-pressed={isScanning}
          {...handlers}
        >
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
        </button>
      )}
    </DwellDetector>
  );
}
