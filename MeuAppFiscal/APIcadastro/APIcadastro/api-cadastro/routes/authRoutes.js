const express = require('express');
const router = express.Router();

// Importa as funções do controller
const { register, login, getProfile } = require('../controllers/authController');

// Importa o middleware de autenticação
const authMiddleware = require('../middleware/authMiddleware');

// Rota Pública: POST /api/auth/register
router.post('/register', register);

// Rota Pública: POST /api/auth/login
router.post('/login', login);

// Rota Protegida: GET /api/auth/profile
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
