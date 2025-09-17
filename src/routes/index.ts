import { Router } from 'express';
import userRoutes from './userRoutes.js';
import postagemRoutes from './postagemRoutes.js';

const router = Router();

router.use(userRoutes);
router.use(postagemRoutes);

export default router;

