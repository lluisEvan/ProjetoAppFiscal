const Post = require('../models/Post');
const User = require('../models/User');

// --- 1. Criar um novo Post ---
exports.createPost = async (req, res) => {
  try {
    const { caption, location } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo de imagem enviado.' });
    }

    const newPost = new Post({
      user: req.user.id,
      caption: caption,
      location: location || '',
      imageUrl: req.file.path // Salva o caminho do arquivo
    });

    const post = await newPost.save();
    
    const populatedPost = await post.populate('user', 'username email');

    res.status(201).json(populatedPost);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor ao criar post.', error: error.message });
  }
};

// --- 2. Buscar Posts (O Feed com Paginação) ---
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('user', 'username email profilePictureUrl') // Adicionado profilePictureUrl
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao buscar posts.' });
  }
};

// --- 3. Curtir / Descurtir um Post ---
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    const userIndex = post.likes.indexOf(req.user.id);

    if (userIndex > -1) {
      post.likes.splice(userIndex, 1); // Descurtir
    } else {
      post.likes.push(req.user.id); // Curtir
    }

    await post.save();
    
    // Popula o usuário para garantir que o front-end tenha os dados
    const populatedPost = await post.populate('user', 'username email profilePictureUrl');
    res.json(populatedPost); // Retorna o post atualizado

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao curtir post.' });
  }
};

// --- 4. Comentar em um Post ---
exports.commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'O texto do comentário é obrigatório' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    const newComment = {
      user: req.user.id,
      text: text
    };

    post.comments.push(newComment);
    await post.save();
    
    // Retorna o post atualizado, populando o usuário de todos os comentários
    const populatedPost = await post.populate('comments.user', 'username profilePictureUrl');

    res.json(populatedPost);

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao comentar post.' });
  }
};

// --- 5. Buscar Comentários de um Post ---
// (Esta era a função que estava faltando)
exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('comments.user', 'username profilePictureUrl'); // Popula o usuário de cada comentário

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Retorna apenas a lista de comentários
    res.json(post.comments);

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao buscar comentários.' });
  }
};