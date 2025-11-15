const express = require('express');
const router = express.Router();

// Importa os controladores e middlewares
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// --- Rotas de Posts ---

// POST /api/posts
// Rota para criar um novo post
// 1. authMiddleware: Garante que o usuário está logado
// 2. upload.single('image'): Pega o arquivo de imagem ('image' é o nome do campo)
// 3. postController.createPost: Executa a lógica de salvar
router.post(
  '/', 
  authMiddleware, 
  upload.single('image'), 
  postController.createPost
);

// GET /api/posts
// Rota para buscar os posts (o feed)
router.get('/', authMiddleware, postController.getPosts);

// POST /api/posts/:id/like
// Rota para curtir/descurtir um post
router.post('/:id/like', authMiddleware, postController.likePost);

// POST /api/posts/:id/comment
// Rota para comentar em um post
router.post('/:id/comment', authMiddleware, postController.commentPost);
// Rota para buscar todos os comentários de um post
router.get('/:id/comments', authMiddleware, postController.getComments);
// DELETE /api/posts/:id (Deletar Post)
router.delete('/:id', authMiddleware, postController.deletePost);
module.exports = router;