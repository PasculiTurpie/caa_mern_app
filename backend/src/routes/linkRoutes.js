import express from 'express';
import {
  generateInviteCode,
  connectWithCode,
  getLinkedUsers,
  removeLink,
} from '../controllers/linkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // todas las rutas de vinculación requieren autenticación

router.post('/invite-code', generateInviteCode);
router.post('/connect', connectWithCode);
router.get('/', getLinkedUsers);
router.delete('/:userId', removeLink);

export default router;
