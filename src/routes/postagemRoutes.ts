import { Router } from 'express';
import PostagemController from '../controllers/postagemController.js';
import multer from 'multer';
import multerConfig from '../config/multerConfig.js';

const router = Router();
const upload = multer(multerConfig);

/**
 * @swagger
 * tags:
 *   - name: Postagens
 *     description: API para gerenciamento de postagens
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lista todas as postagens
 *     tags: [Postagens]
 *     responses:
 *       200:
 *         description: Lista de postagens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Postagem'
 *   post:
 *     summary: Cria uma nova postagem
 *     tags: [Postagens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Postagem'
 *     responses:
 *       201:
 *         description: Postagem criada com sucesso
 *       400:
 *         description: Dados inválidos
 * /posts/feed:
 *   get:
 *     summary: Lista o feed de postagens
 *     description: Retorna as postagens ordenadas por data de publicação (mais recentes primeiro).
 *     tags: [Postagens]
 *     responses:
 *       200:
 *         description: Feed de postagens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Postagem'
 */
router.get('/posts', PostagemController.getAll);
router.post('/posts', upload.single('imagem'), PostagemController.create);
router.get('/posts/feed', PostagemController.getFeed);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Busca uma postagem pelo ID
 *     tags: [Postagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da postagem
 *     responses:
 *       200:
 *         description: Postagem encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Postagem'
 *       400:
 *         description: ID da postagem não fornecido
 *       404:
 *         description: Postagem não encontrada
 *   put:
 *     summary: Atualiza uma postagem
 *     tags: [Postagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da postagem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Postagem'
 *     responses:
 *       200:
 *         description: Postagem atualizada com sucesso
 *       400:
 *         description: ID da postagem não fornecido
 *       404:
 *         description: Postagem não encontrada
 *   delete:
 *     summary: Deleta uma postagem
 *     tags: [Postagens]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da postagem
 *     responses:
 *       204:
 *         description: Postagem deletada com sucesso
 *       400:
 *         description: ID da postagem não fornecido
 *       404:
 *         description: Postagem não encontrada
 */
router.get('/posts/:id', PostagemController.getById);
router.put('/posts/:id', upload.single('imagem'), PostagemController.update);
router.delete('/posts/:id', PostagemController.delete);

export default router;

