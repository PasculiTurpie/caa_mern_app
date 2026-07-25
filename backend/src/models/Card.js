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
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // tarjetas públicas visibles para todos los usuarios
    },
  },
  { timestamps: true }
);

cardSchema.index({ creator: 1, category: 1 });

const Card = mongoose.model('Card', cardSchema);

export default Card;
