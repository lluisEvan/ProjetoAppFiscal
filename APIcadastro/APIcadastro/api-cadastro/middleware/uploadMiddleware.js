const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define o local de armazenamento
const uploadDir = 'uploads/';

// Garante que o diretório 'uploads/' exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configura o armazenamento do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Salva os arquivos na pasta 'uploads/'
  },
  filename: function (req, file, cb) {
    // Cria um nome de arquivo único para evitar conflitos
    // Ex: image-1678886400000-123456789.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtra para aceitar apenas arquivos de imagem
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // Rejeita o arquivo se não for uma imagem
    cb(new Error('Somente arquivos de imagem são permitidos!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // Limita o tamanho do arquivo (ex: 10MB)
  }
});

module.exports = upload;