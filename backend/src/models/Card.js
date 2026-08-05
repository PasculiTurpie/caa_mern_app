import mongoose from 'mongoose';

/**
 * Modelo de Tarjeta (pictograma) del sistema CAA.
 * La categoría determina el color aplicado según la Clave Fitzgerald
 * (ver frontend/src/utils/fitzgeraldColors.js para el mapeo de colores).
 */
const cardSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'El texto de la tarjeta es obligatorio'],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'sujeto',
        'accion',
        'objeto',
        'necesidad',
        'sentimiento',
        'lugar',
        'cortesia',
        'humor',
        'conector',
        'comida',
      ],
    },
    emoji: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '', // permite pictogramas/imágenes personalizadas
    },
    // Nota o contexto de uso pensada para el equipo de cuidado (ej. "usar
    // cuando el paciente señala la boca"). No se muestra en la tarjeta
    // misma para no saturar el tablero visualmente; aparece como tooltip
    // y en el modal de edición.
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [280, 'La descripción no puede superar los 280 caracteres'],
    },
    // Sinónimos o palabras clave para búsqueda (ej. "agua" → ["sed", "beber"]).
    tags: {
      type: [String],
      default: [],
      set: (tags) =>
        (tags || [])
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 10), // evita listas de tags descontroladas
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // tarjetas públicas visibles para todos los usuarios
    },
    // Cuántas veces se seleccionó esta tarjeta para armar una frase. Se
    // incrementa desde el backend (ver PATCH /api/cards/:id/use), nunca se
    // acepta directamente en create/update, para que el usuario no pueda
    // falsear sus propias estadísticas de uso. Sirve para ordenar
    // "más usadas primero" y para detectar tarjetas favoritas.
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

cardSchema.index({ creator: 1, category: 1 });

const Card = mongoose.model('Card', cardSchema);

export default Card;
