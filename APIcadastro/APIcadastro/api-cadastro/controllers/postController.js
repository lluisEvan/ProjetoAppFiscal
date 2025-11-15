const Post = require('../models/Post');
const User = require('../models/User');

// --- 1. Criar um novo Post ---
exports.createPost = async (req, res) => {
  try {
    const { caption, location } = req.body;

    // Verifica se a imagem foi enviada (o 'uploadMiddleware' faz isso)
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo de imagem enviado.' });
    }

    // req.user.id vem do 'authMiddleware' (usuário logado)
    // req.file.path vem do 'uploadMiddleware' (caminho da imagem salva)
    const newPost = new Post({
      user: req.user.id,
      caption: caption,
      location: location || '',
      imageUrl: req.file.path // Salva o caminho do arquivo
    });

    const post = await newPost.save();
    
    // Retorna o post recém-criado com os dados do usuário
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
    // Paginação: Pega a 'página' e o 'limite' da URL
    // Ex: /api/posts?page=1&limit=10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Busca os posts no banco de dados
    const posts = await Post.find()
      .populate('user', 'username email') // Substitui o ID do usuário pelos dados dele
      .sort({ createdAt: -1 }) // Mais novos primeiro
      .skip(skip)
      .limit(limit);

    // Conta o total de posts (para o app saber se há mais para carregar)
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

    // Verifica se o usuário (req.user.id) já curtiu
    const userIndex = post.likes.indexOf(req.user.id);

    if (userIndex > -1) {
      // Já curtiu, então descurte (remove o ID)
      post.likes.splice(userIndex, 1);
    } else {
      // Não curtiu, então curte (adiciona o ID)
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);

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
    
    // Retorna o post atualizado com o novo comentário
    const populatedPost = await post.populate('comments.user', 'username');

    res.json(populatedPost);

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor ao comentar post.' });
  }
};