/**
 * Diccionario de palabras comunes en español, usado como respaldo general
 * para las sugerencias predictivas del teclado (además del vocabulario
 * propio de las tarjetas del usuario, que se prioriza por ser más
 * relevante a lo que esa persona realmente usa).
 *
 * Incluye pronombres, conjugaciones de verbos frecuentes (para no limitar
 * las sugerencias solo al infinitivo) y palabras de uso diario.
 */
const COMMON_WORDS = [
  // Pronombres y posesivos
  'yo', 'tú', 'usted', 'él', 'ella', 'nosotros', 'nosotras', 'ellos', 'ellas',
  'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'nuestro', 'nuestra',

  // Querer
  'quiero', 'quieres', 'quiere', 'queremos', 'quieren',
  // Necesitar
  'necesito', 'necesitas', 'necesita', 'necesitamos', 'necesitan',
  // Ir
  'voy', 'vas', 'va', 'vamos', 'van', 'ir',
  // Ser / Estar
  'soy', 'eres', 'es', 'somos', 'son', 'estoy', 'estás', 'está', 'estamos', 'están',
  // Tener
  'tengo', 'tienes', 'tiene', 'tenemos', 'tienen',
  // Poder
  'puedo', 'puedes', 'puede', 'podemos', 'pueden',
  // Comer / Beber
  'como', 'comes', 'come', 'comemos', 'comen', 'comer',
  'bebo', 'bebes', 'bebe', 'bebemos', 'beben', 'beber',
  // Jugar / Dormir
  'juego', 'juegas', 'juega', 'jugamos', 'juegan', 'jugar',
  'duermo', 'duermes', 'duerme', 'dormimos', 'duermen', 'dormir',
  // Ayudar / Gustar
  'ayudo', 'ayudas', 'ayuda', 'ayudamos', 'ayudan', 'ayudar',
  'gusta', 'gustan', 'gustaría',
  // Hacer / Ver / Hablar / Dar / Poner
  'hago', 'haces', 'hace', 'hacemos', 'hacen', 'hacer',
  'veo', 'ves', 've', 'vemos', 'ven', 'ver',
  'hablo', 'hablas', 'habla', 'hablamos', 'hablan', 'hablar',
  'doy', 'das', 'da', 'damos', 'dan', 'dar',
  'pongo', 'pones', 'pone', 'ponemos', 'ponen', 'poner',

  // Palabras de uso diario
  'bien', 'mal', 'mucho', 'poco', 'más', 'menos', 'todo', 'todos', 'nada', 'algo',
  'alguien', 'nadie', 'aquí', 'allí', 'ahora', 'después', 'antes', 'hoy', 'mañana',
  'ayer', 'siempre', 'nunca', 'también', 'porque', 'como', 'cuando', 'donde',
  'que', 'cuál', 'quién', 'favor', 'gracias', 'por', 'para', 'con', 'sin',

  // Sustantivos frecuentes
  'casa', 'escuela', 'agua', 'comida', 'familia', 'amigo', 'amiga', 'tiempo',
  'día', 'noche', 'mamá', 'papá', 'baño', 'dolor', 'ayuda', 'juego', 'libro',
];

export default COMMON_WORDS;
