import { CATEGORY_LIST, getCategoryStyles } from '../../utils/fitzgeraldColors';

/**
 * CategoryFilter: barra de botones para filtrar el CardGrid por categoría
 * gramatical (Clave Fitzgerald). Incluye la opción "Todas".
 */
export default function CategoryFilter({ activeCategory, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar tarjetas por categoría"
      className="flex flex-wrap gap-2 p-2"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeCategory === null}
        onClick={() => onChange(null)}
        className={`rounded-full border-2 px-4 py-2 font-semibold text-sm ${
          activeCategory === null
            ? 'bg-gray-800 text-white border-gray-800'
            : 'bg-white text-gray-800 border-gray-300'
        }`}
      >
        Todas
      </button>

      {CATEGORY_LIST.map((category) => {
        console.log(category)
        const styles = getCategoryStyles(category);
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={`rounded-full border-2 px-4 py-2 font-semibold text-sm ${styles.bg} ${
              styles.text
            } ${isActive ? 'ring-4 ring-offset-1 ring-blue-600' : ''} ${styles.border}`}
          >
            {styles.label}
          </button>
        );
      })}
    </div>
  );
}
