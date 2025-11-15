const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  // Link para o usuário que postou
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // O texto/legenda da postagem
  caption: {
    type: String,
    trim: true
  },

  // O caminho da imagem que foi salva no servidor
  imageUrl: {
    type: String,
    required: true
  },

  // A localização (opcional)
  location: {
    type: String,
    trim: true
  },
  
  // --- CAMPO DE CATEGORIA (Tipo de Denúncia) ---
  category: {
    type: String,
    trim: true,
    default: 'Outros' // Valor padrão se nada for enviado
  },
  // ---------------------------------------------

  // Lista de usuários que curtiram
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Lista de comentários
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
}, {
  // Adiciona automaticamente os campos createdAt e updatedAt
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);