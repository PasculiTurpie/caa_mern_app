/**
 * Conjunto de tarjetas predefinidas para poblar el sistema CAA sin partir
 * de cero. Cubre las 8 categorías de la Clave Fitzgerald, incluyendo las
 * dos categorías añadidas: "cortesia" (fórmulas sociales) y "humor"
 * (frases chistosas para aligerar la comunicación diaria).
 *
 * Estas tarjetas se crean como públicas (isPublic: true) para que estén
 * disponibles para todos los usuarios de la aplicación.
 */
const defaultCards = [
  // --- Sujetos / Pronombres ---
  { text: 'Yo', category: 'sujeto', emoji: '🙋' },
  { text: 'Tú', category: 'sujeto', emoji: '👉' },
  { text: 'Él', category: 'sujeto', emoji: '👦' },
  { text: 'Ella', category: 'sujeto', emoji: '👧' },
  { text: 'Nosotros', category: 'sujeto', emoji: '👨‍👩‍👧' },
  { text: 'Mamá', category: 'sujeto', emoji: '👩' },
  { text: 'Papá', category: 'sujeto', emoji: '👨' },
  { text: 'Doctor/a', category: 'sujeto', emoji: '🩺' },
  { text: 'Maestro/a', category: 'sujeto', emoji: '🍎' },
  { text: 'Amigo/a', category: 'sujeto', emoji: '🤝' },

  // --- Acciones / Verbos ---
  { text: 'Quiero', category: 'accion', emoji: '🙏' },
  { text: 'Necesito', category: 'accion', emoji: '❗' },
  { text: 'Ir', category: 'accion', emoji: '🚶' },
  { text: 'Comer', category: 'accion', emoji: '🍽️' },
  { text: 'Beber', category: 'accion', emoji: '🥤' },
  { text: 'Jugar', category: 'accion', emoji: '🎲' },
  { text: 'Dormir', category: 'accion', emoji: '😴' },
  { text: 'Ayudar', category: 'accion', emoji: '🆘' },
  { text: 'Ver', category: 'accion', emoji: '👀' },
  { text: 'Escuchar', category: 'accion', emoji: '👂' },
  { text: 'Hablar', category: 'accion', emoji: '🗣️' },
  { text: 'Ducharse', category: 'accion', emoji: '🚿' },

  // --- Objetos / Cosas ---
  { text: 'Agua', category: 'objeto', emoji: '💧' },
  { text: 'Comida', category: 'objeto', emoji: '🍎' },
  { text: 'Teléfono', category: 'objeto', emoji: '📱' },
  { text: 'Libro', category: 'objeto', emoji: '📖' },
  { text: 'Pelota', category: 'objeto', emoji: '⚽' },
  { text: 'Televisión', category: 'objeto', emoji: '📺' },
  { text: 'Silla de ruedas', category: 'objeto', emoji: '🦽' },
  { text: 'Medicina', category: 'objeto', emoji: '💊' },
  { text: 'Manta', category: 'objeto', emoji: '🧣' },
  { text: 'Juguete', category: 'objeto', emoji: '🧸' },

  // --- Urgencias / Respuestas rápidas ---
  { text: 'Sí', category: 'necesidad', emoji: '✅' },
  { text: 'No', category: 'necesidad', emoji: '❌' },
  { text: 'Ayuda', category: 'necesidad', emoji: '🆘' },
  { text: 'Baño', category: 'necesidad', emoji: '🚻' },
  { text: 'Dolor', category: 'necesidad', emoji: '⚠️' },
  { text: 'Más', category: 'necesidad', emoji: '➕' },
  { text: 'Basta', category: 'necesidad', emoji: '🛑' },
  { text: 'Espera', category: 'necesidad', emoji: '⏳' },
  { text: 'Emergencia', category: 'necesidad', emoji: '🚨' },

  // --- Emociones ---
  { text: 'Feliz', category: 'sentimiento', emoji: '😄' },
  { text: 'Triste', category: 'sentimiento', emoji: '😢' },
  { text: 'Enojado/a', category: 'sentimiento', emoji: '😠' },
  { text: 'Cansado/a', category: 'sentimiento', emoji: '😪' },
  { text: 'Asustado/a', category: 'sentimiento', emoji: '😨' },
  { text: 'Aburrido/a', category: 'sentimiento', emoji: '🥱' },
  { text: 'Sorprendido/a', category: 'sentimiento', emoji: '😲' },
  { text: 'Tranquilo/a', category: 'sentimiento', emoji: '😌' },

  // --- Lugares ---
  { text: 'Casa', category: 'lugar', emoji: '🏠' },
  { text: 'Escuela', category: 'lugar', emoji: '🏫' },
  { text: 'Hospital', category: 'lugar', emoji: '🏥' },
  { text: 'Parque', category: 'lugar', emoji: '🌳' },
  { text: 'Cocina', category: 'lugar', emoji: '🍳' },
  { text: 'Dormitorio', category: 'lugar', emoji: '🛏️' },
  { text: 'Baño', category: 'lugar', emoji: '🚽' },
  { text: 'Tienda', category: 'lugar', emoji: '🏬' },

  // --- Social / Cortesía ---
  { text: 'Hola', category: 'cortesia', emoji: '👋' },
  { text: 'Adiós', category: 'cortesia', emoji: '👋' },
  { text: 'Por favor', category: 'cortesia', emoji: '🙏' },
  { text: 'Gracias', category: 'cortesia', emoji: '😊' },
  { text: 'De nada', category: 'cortesia', emoji: '🤗' },
  { text: 'Perdón', category: 'cortesia', emoji: '😔' },
  { text: 'Buenos días', category: 'cortesia', emoji: '☀️' },
  { text: 'Buenas noches', category: 'cortesia', emoji: '🌙' },
  { text: '¿Cómo estás?', category: 'cortesia', emoji: '🤔' },

  // --- Frases chistosas (humor) ---
  { text: '¡Estoy que exploto de hambre!', category: 'humor', emoji: '🤯' },
  { text: 'Tengo pilas nuevas hoy', category: 'humor', emoji: '🔋' },
  { text: 'Mi estómago está cantando', category: 'humor', emoji: '🎤' },
  { text: '¡Modo turbo activado!', category: 'humor', emoji: '🚀' },
  { text: 'Necesito una siesta de campeón', category: 'humor', emoji: '🏆' },
  { text: 'Hoy vengo con superpoderes', category: 'humor', emoji: '🦸' },
  { text: '¡Alerta de cosquillas!', category: 'humor', emoji: '🤪' },
  { text: 'Mi cerebro pidió vacaciones', category: 'humor', emoji: '🏖️' },

  // --- Conectores / Artículos ---
  { text: 'El', category: 'conector', emoji: '' },
  { text: 'La', category: 'conector', emoji: '' },
  { text: 'Los', category: 'conector', emoji: '' },
  { text: 'Las', category: 'conector', emoji: '' },
  { text: 'Un', category: 'conector', emoji: '' },
  { text: 'Una', category: 'conector', emoji: '' },
  { text: 'Unos', category: 'conector', emoji: '' },
  { text: 'Unas', category: 'conector', emoji: '' },
  { text: 'Y', category: 'conector', emoji: '' },
  { text: 'O', category: 'conector', emoji: '' },
  { text: 'Pero', category: 'conector', emoji: '' },
  { text: 'Porque', category: 'conector', emoji: '' },
  { text: 'Para', category: 'conector', emoji: '' },
  { text: 'Con', category: 'conector', emoji: '' },
  { text: 'Sin', category: 'conector', emoji: '' },
  { text: 'De', category: 'conector', emoji: '' },
  { text: 'A', category: 'conector', emoji: '' },
  { text: 'En', category: 'conector', emoji: '' },
  { text: 'Sobre', category: 'conector', emoji: '⬆️' },
  { text: 'Bajo', category: 'conector', emoji: '⬇️' },
  { text: 'Dentro de', category: 'conector', emoji: '📦' },
  { text: 'Fuera de', category: 'conector', emoji: '🚪' },
  { text: 'Antes de', category: 'conector', emoji: '⏮️' },
  { text: 'Después de', category: 'conector', emoji: '⏭️' },

  // --- Comidas ---
  { text: 'Pan', category: 'comida', emoji: '🍞' },
  { text: 'Leche', category: 'comida', emoji: '🥛' },
  { text: 'Fruta', category: 'comida', emoji: '🍎' },
  { text: 'Verdura', category: 'comida', emoji: '🥦' },
  { text: 'Arroz', category: 'comida', emoji: '🍚' },
  { text: 'Pollo', category: 'comida', emoji: '🍗' },
  { text: 'Carne', category: 'comida', emoji: '🥩' },
  { text: 'Pescado', category: 'comida', emoji: '🐟' },
  { text: 'Huevo', category: 'comida', emoji: '🥚' },
  { text: 'Queso', category: 'comida', emoji: '🧀' },
  { text: 'Yogurt', category: 'comida', emoji: '🥣' },
  { text: 'Sopa', category: 'comida', emoji: '🍲' },
  { text: 'Ensalada', category: 'comida', emoji: '🥗' },
  { text: 'Jugo', category: 'comida', emoji: '🧃' },
  { text: 'Galleta', category: 'comida', emoji: '🍪' },
  { text: 'Chocolate', category: 'comida', emoji: '🍫' },
  { text: 'Pizza', category: 'comida', emoji: '🍕' },
  { text: 'Sándwich', category: 'comida', emoji: '🥪' },
  { text: 'Cereal', category: 'comida', emoji: '🥣' },
  { text: 'Helado', category: 'comida', emoji: '🍦' },
];

export default defaultCards;
