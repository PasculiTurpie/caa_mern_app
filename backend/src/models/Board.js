import mongoose from 'mongoose';

/**
 * Modelo de Tablero: agrupa un conjunto de tarjetas para un usuario
 * (por ejemplo, "Tablero del colegio", "Tablero de casa", etc.).
 */
const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título del tablero es obligatorio'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
  },
  { timestamps: true }
);

const Board = mongoose.model('Board', boardSchema);

export default Board;
