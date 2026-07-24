/**
 * Mapeo de categorías gramaticales a la Clave Fitzgerald (Fitzgerald Key),
 * un estándar ampliamente usado en tableros de Comunicación Aumentativa
 * y Alternativa para dar consistencia visual y facilitar la construcción
 * de frases con estructura gramatical correcta.
 */
export const FITZGERALD_CATEGORIES = {
  sujeto: {
    label: 'Sujetos / Pronombres',
    bg: 'bg-fitz-subject',
    border: 'border-yellow-500',
    text: 'text-yellow-950',
  },
  accion: {
    label: 'Acciones / Verbos',
    bg: 'bg-fitz-action',
    border: 'border-green-600',
    text: 'text-green-950',
  },
  objeto: {
    label: 'Objetos / Cosas',
    bg: 'bg-fitz-object',
    border: 'border-orange-500',
    text: 'text-orange-950',
  },
  necesidad: {
    label: 'Urgencias / Respuestas rápidas',
    bg: 'bg-fitz-urgent',
    border: 'border-red-500',
    text: 'text-red-950',
  },
  sentimiento: {
    label: 'Emociones',
    bg: 'bg-fitz-feeling',
    border: 'border-purple-500',
    text: 'text-purple-950',
  },
  lugar: {
    label: 'Lugares',
    bg: 'bg-fitz-place',
    border: 'border-sky-500',
    text: 'text-sky-950',
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
