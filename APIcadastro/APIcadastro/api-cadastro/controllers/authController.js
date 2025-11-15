const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Função auxiliar de validação de email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Função auxiliar de validação de senha
const validatePassword = (password) => {
  return password.length >= 8;
};

// Registrar novo usuário
exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Validações
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: 'Senha deve ter no mínimo 8 caracteres' 
      });
    }
    
    // Verifica se usuário ou email já existe
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Email ou usuário já cadastrado' });
    }
    
    // Cria o usuário
    const user = await User.create({ email, username, password });
    
    // Gera o token JWT
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ 
      message: 'Usuário criado com sucesso',
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        username: user.username 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar usuário', 
      error: error.message 
    });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    
    // Busca usuário com a senha
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Gera o token JWT
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.json({ 
      message: 'Login realizado com sucesso',
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        username: user.username 
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao fazer login', 
      error: error.message 
    });
  }
};

// Obter perfil do usuário autenticado
exports.getProfile = async (req, res) => {
  res.json({ 
    message: 'Perfil do usuário',
    user: req.user 
  });
};
exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // 1. Atualiza o nome de usuário (se foi enviado)
    if (username && username !== user.username) {
      // Verifica se o novo nome já está em uso
      const usernameExists = await User.findOne({ username });
      if (usernameExists && usernameExists._id.toString() !== req.user.id) {
        return res.status(400).json({ message: 'Nome de usuário já em uso' });
      }
      user.username = username;
    }

    // 2. Atualiza a foto de perfil (se foi enviada)
    if (req.file) {
      // (Opcional: aqui você poderia deletar a foto antiga do servidor)
      user.profilePictureUrl = req.file.path; // Salva o caminho da nova foto
    }

    const updatedUser = await user.save();

    // 3. Retorna o usuário ATUALIZADO (sem a senha)
    res.json({
      message: 'Perfil atualizado com sucesso',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
        profilePictureUrl: updatedUser.profilePictureUrl
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
  }
};
