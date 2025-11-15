const Post = require('../models/Post');
const User = require('../models/User');
const fs = require('fs'); 

// --- 1. Criar um novo Post ---
exports.createPost = async (req, res) => {
  try {
    // 1. Recebe 'category' do corpo da requisição
    const { caption, location, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo de imagem enviado.' });
    }

    const newPost = new Post({
      user: req.user.id,
      caption: caption,
      location: location || '',
      imageUrl: req.file.path,
      category: category || 'Outros' // 2. Salva a categoria
    });

    const post = await newPost.save();
    const populatedPost = await post.populate('user', 'username email profilePictureUrl');
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
      .populate('user', 'username email profilePictureUrl') 
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
      post.likes.splice(userIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    const populatedPost = await post.populate('user', 'username email profilePictureUrl');
    res.json(populatedPost);
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
    const populatedPost = await post.populate('comments.user', 'username profilePictureUrl');
    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao comentar post.' });
  }
};

// --- 5. Buscar Comentários de um Post ---
exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('comments.user', 'username profilePictureUrl'); 
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao buscar comentários.' });
  }
};

// --- 6. Deletar um Post ---
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Não autorizado. Você não é o dono deste post.' });
    }

    fs.unlink(post.imageUrl, (err) => {
      if (err) {
        console.error("Erro ao deletar imagem do post:", err);
      }
    });

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deletado com sucesso' });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao deletar post.' });
  }
};