const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    
    // Verifica se o cabeçalho de autorização existe e começa com "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
      }
      
      try {
        // Decodifica e verifica o token usando a chave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Anexa o usuário decodificado (sem a senha) ao objeto da requisição
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
          return res.status(401).json({ message: 'Usuário do token não encontrado' });
        }
        
        next(); // Passa para a próxima função (o controller da rota)
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expirado' });
        }
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'Token inválido' });
        }
        throw error;
      }
    } else {
      return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido' });
    }
  } catch (error) {
    return res.status(500).json({ 
      message: 'Erro no servidor', 
      error: error.message 
    });
  }
};

module.exports = authMiddleware;
