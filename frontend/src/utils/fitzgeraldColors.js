/**
 * Mapeo de categorías gramaticales a la Clave Fitzgerald (Fitzgerald Key),
 * un estándar ampliamente usado en tableros de Comunicación Aumentativa
 * y Alternativa para dar consistencia visual y facilitar la construcción
 * de frases con estructura gramatical correcta.
 *
 * Se usan colores estándar de la paleta de Tailwind (no colores
 * personalizados) para que las reglas de tema oscuro/alto contraste en
 * index.css, que apuntan a estas mismas clases, siempre las alcancen sin
 * depender de que Tailwind regenere una paleta custom.
 */
export const FITZGERALD_CATEGORIES = {
  sujeto: {
    label: 'Sujetos / Pronombres',
    bg: 'bg-yellow-300',
    border: 'border-yellow-500',
    text: 'text-yellow-950',
  },
  accion: {
    label: 'Acciones / Verbos',
    bg: 'bg-green-400',
    border: 'border-green-600',
    text: 'text-green-950',
  },
  objeto: {
    label: 'Objetos / Cosas',
    bg: 'bg-orange-400',
    border: 'border-orange-500',
    text: 'text-orange-950',
  },
  necesidad: {
    label: 'Urgencias / Respuestas rápidas',
    bg: 'bg-red-400',
    border: 'border-red-500',
    text: 'text-red-950',
  },
  sentimiento: {
    label: 'Emociones',
    bg: 'bg-purple-400',
    border: 'border-purple-500',
    text: 'text-purple-950',
  },
  lugar: {
    label: 'Lugares',
    bg: 'bg-sky-400',
    border: 'border-sky-500',
    text: 'text-sky-950',
  },
  cortesia: {
    label: 'Social / Cortesía',
    bg: 'bg-teal-400',
    border: 'border-teal-500',
    text: 'text-teal-950',
  },
  humor: {
    label: 'Frases chistosas',
    bg: 'bg-pink-400',
    border: 'border-pink-500',
    text: 'text-pink-950',
  },
  conector: {
    label: 'Conectores / Artículos',
    bg: 'bg-stone-300',
    border: 'border-stone-500',
    text: 'text-stone-950',
  },
  comida: {
    label: 'Comidas',
    bg: 'bg-lime-400',
    border: 'border-lime-600',
    text: 'text-lime-950',
  },
};

/**
 * Devuelve el set de clases Tailwind correspondientes a una categoría,
 * con un valor por defecto neutro para categorías desconocidas.
 */
export const getCategoryStyles = (category) =>
  FITZGERALD_CATEGORIES[category] || {
    label: 'Otro',
    bg: 'bg-gray-200',
    border: 'border-gray-400',
    text: 'text-gray-900',
  };

export const CATEGORY_LIST = Object.keys(FITZGERALD_CATEGORIES);
