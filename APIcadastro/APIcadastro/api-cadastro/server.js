// --- Importação dos Módulos ---
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors'); // <-- 1. IMPORTA O CORS

// --- Configuração Inicial ---
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const app = express();

// --- Middlewares de Segurança ---
app.use(helmet());
app.use(express.json({ limit: '10kb' })); 
app.use(mongoSanitize()); 

// --- Configuração do CORS ---
// Permite que seu app web acesse a API
app.use(cors()); // <-- 2. USA O CORS (ANTES DAS ROTAS)

// --- Rate Limiting ---
// Limita requisições gerais
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Muitas requisições deste IP, tente novamente mais tarde'
});
app.use('/api/', limiter);

// Rate limit específico para login (proteção contra força bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login, tente novamente em 15 minutos'
});
app.use('/api/auth/login', loginLimiter);

// --- Conexão com o Banco de Dados (MongoDB) ---
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

// --- Rotas ---
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Cadastro de Usuários está funcionando!',
    version: '1.0.0'
  });
});

// A linha app.use(cors()) deve vir ANTES desta linha
app.use('/api/auth', authRoutes);

// --- Middleware de Erro Global ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// --- Rota Não Encontrada ---
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});