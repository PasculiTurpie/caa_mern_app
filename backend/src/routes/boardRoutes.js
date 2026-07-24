import express from 'express';
import {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  addCardToBoard,
  deleteBoard,
} from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // todas las rutas de tableros requieren autenticación

router.route('/').get(getBoards).post(createBoard);
router.route('/:id').get(getBoardById).put(updateBoard).delete(deleteBoard);
router.put('/:id/add-card/:cardId', addCardToBoard);

export default router;
