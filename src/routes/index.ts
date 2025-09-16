import { Router } from 'express';
import userRoutes from './userRoutes.js';

const router = Router();

/**
 * Adiciona as rotas de usuário ao roteador principal
 */
router.use(userRoutes);

export default router;

