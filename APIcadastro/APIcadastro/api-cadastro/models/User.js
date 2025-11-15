const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor, insira um email válido']
  },
  username: {
    type: String,
    required: [true, 'O nome de usuário é obrigatório'],
    unique: true,
    trim: true,
    minlength: [3, 'O nome de usuário deve ter no mínimo 3 caracteres'],
    maxlength: [20, 'O nome de usuário deve ter no máximo 20 caracteres']
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    minlength: [8, 'A senha deve ter no mínimo 8 caracteres'],
    select: false
  },
  
  // --- ADICIONE ESTE CAMPO ---
  profilePictureUrl: {
    type: String,
    default: '' // Começa vazio
  },
  // -------------------------

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Criptografa a senha antes de salvar o usuário
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);