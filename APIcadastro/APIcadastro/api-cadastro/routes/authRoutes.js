const express = require('express');
const router = express.Router();

// Importa as funções do controller
const { 
  register, 
  login, 
  getProfile, 
  updateProfile // <-- 1. ADICIONE updateProfile
} = require('../controllers/authController');

// Importa os middlewares
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // <-- 2. IMPORTE O UPLOAD

// Rota Pública: POST /api/auth/register
router.post('/register', register);

// Rota Pública: POST /api/auth/login
router.post('/login', login);

// Rota Protegida: GET /api/auth/profile
router.get('/profile', authMiddleware, getProfile);

// --- 3. ADICIONE ESTA NOVA ROTA ---
// Rota Protegida: PUT /api/auth/profile
// (upload.single() pega a foto, authMiddleware pega o usuário)
router.put(
  '/profile',
  authMiddleware,
  upload.single('profilePicture'), 
  updateProfile
);
// ---------------------------------

module.exports = router;