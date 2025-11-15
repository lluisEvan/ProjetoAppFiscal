const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  // Link para o usuário que postou (vem do seu models/User.js)
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
  // Ex: "uploads/image-12345.jpg"
  imageUrl: {
    type: String,
    required: true
  },

  // A localização (como na foto "Rua das Palmeiras, Centro")
  location: {
    type: String,
    trim: true
  },

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