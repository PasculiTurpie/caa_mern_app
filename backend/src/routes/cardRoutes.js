import express from 'express';
import {
  getCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
} from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // todas las rutas de tarjetas requieren autenticación

router.route('/').get(getCards).post(createCard);
router.route('/:id').get(getCardById).put(updateCard).delete(deleteCard);

export default router;
