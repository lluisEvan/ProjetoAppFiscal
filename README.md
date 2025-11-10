📱 Fiscal Cidadão (Projeto Completo)Este é um projeto full-stack que consiste em um aplicativo móvel (Frontend) e uma API de autenticação (Backend). O objetivo é criar uma plataforma onde usuários podem se cadastrar, fazer login e (futuramente) reportar problemas em sua cidade.🏛️ Estrutura do ProjetoO projeto está dividido em duas partes principais, localizadas na pasta FrazaoAplicativo:FrazaoAplicativo/
├── MeuAppFiscal/
│   ├── App.js              # Roteador de Navegação (React Navigation)
│   ├── LoginScreen.js      # Tela de Login
│   ├── RegisterScreen.js   # Tela de Cadastro
│   ├── HomeScreen.js       # Tela de Feed (após o login)
│   ├── package.json        # Dependências do App
│   └── ...
│
└── APICadastro/
    └── api-cadastro/       # API Node.js (Backend)
        ├── server.js       # Ponto de entrada do servidor
        ├── .env            # Arquivo de configuração (NÃO ENVIAR PARA O GITHUB)
        ├── package.json    # Dependências da API
        ├── routes/         # Definição das rotas (endpoints)
        ├── controllers/    # Lógica de negócio (o que cada rota faz)
        ├── models/         # Schemas do banco de dados (ex: User.js)
        └── middleware/     # Middlewares (ex: verificação de token)
✨ FuncionalidadesBackend (API)Autenticação de Usuário: Sistema completo de registro e login.Segurança de Senha: As senhas são criptografadas (hashed) com bcryptjs antes de serem salvas no banco.Tokens JWT: O login gera um JSON Web Token (JWT) para autenticação segura nas rotas.Rotas Protegidas: A API inclui um middleware que protege rotas, exigindo um token válido para acesso (ex: /api/auth/profile).Segurança da API: Inclui helmet para proteção contra vulnerabilidades conhecidas, express-rate-limit para prevenir ataques de força bruta e mongo-sanitize contra NoSQL Injection.Validação: Validações de email, nome de usuário e senha no momento do cadastro.Frontend (App)Navegação: Um fluxo de navegação completo usando React Navigation (createNativeStackNavigator) que gerencia as telas de Login, Registro e Home.Tela de Login: Formulário de login que consome a rota POST /api/auth/login da API.Tela de Registro: Formulário de cadastro que consome a rota POST /api/auth/register da API.Tela Home: Tela de feed (atualmente com um post estático) para onde o usuário é direcionado após o login.Feedback ao Usuário: Mostra indicadores de carregamento (ActivityIndicator) durante as chamadas de API e exibe mensagens de erro.🛠️ Tecnologias UtilizadasParteTecnologiaDescriçãoBackendNode.jsAmbiente de execução para o JavaScript no servidor.BackendExpress.jsFramework para construir a API.BackendMongoDBBanco de dados NoSQL para armazenar os usuários.BackendMongooseODM para modelar e interagir com o MongoDB.BackendjsonwebtokenPara criar e verificar os tokens de autenticação (JWT).BackendbcryptjsPara criptografar as senhas dos usuários.BackenddotenvPara gerenciar variáveis de ambiente (como chaves de API e string do banco).FrontendReact NativeFramework para criar o aplicativo móvel.FrontendExpoPlataforma e ferramentas para facilitar o desenvolvimento React Native (usado para expo-checkbox).FrontendReact NavigationPara gerenciar a navegação e o fluxo entre as telas.Frontendreact-native-vector-iconsPara usar ícones (olho, email, cadeado) nos formulários.🚀 Como Rodar o ProjetoPara o projeto funcionar, você precisa rodar o Backend e o Frontend simultaneamente.Pré-requisitosNode.js: Instalado na sua máquina.MongoDB: Instalado localmente ou uma conta em um serviço (como o MongoDB Atlas).App Expo Go: Instalado no seu celular (para testar o app).Dois Terminais: Você precisará de duas janelas de terminal abertas.1. 🖥️ Rodando o Backend (API)No seu Terminal 1:Navegue até a pasta da API:Bashcd FrazaoAplicativo/APICadastro/api-cadastro
Instale as dependências:Bashnpm install
Crie o arquivo .env:Crie um arquivo chamado .env na raiz da pasta api-cadastro e cole o seguinte conteúdo:Snippet de códigoMONGO_URI=mongodb://localhost:27017/api-cadastro
JWT_SECRET=sua_chave_secreta_muito_complexa_aqui_12345678
PORT=3000
NODE_ENV=development
(Importante: Certifique-se que seu serviço do MongoDB está rodando no localhost:27017).Inicie o servidor da API:Bashnpm run dev
Sucesso! Você deve ver as mensagens "Conectado ao MongoDB com sucesso!" e "Servidor rodando na porta 3000".Deixe este terminal aberto e rodando.2. 📱 Rodando o Frontend (App)No seu Terminal 2:Navegue até a pasta do App:Bashcd FrazaoAplicativo/MeuAppFiscal
Instale as dependências:(Se você ainda não o fez)Bashnpm install
Configure o IP da API (Passo Crucial):Sua API está rodando no seu computador (ex: http://192.168.3.26:3000).O seu app no celular/emulador precisa saber esse endereço. localhost não funciona.Abra os arquivos LoginScreen.js e RegisterScreen.js.Mude a variável API_URL no topo de ambos os arquivos para o IP do seu computador (o mesmo que você descobriu antes):JavaScript// Exemplo, use o SEU IP:
const API_URL = 'http://192.168.3.26:3000'; 
(Importante: Seu celular e seu computador devem estar conectados na mesma rede Wi-Fi).Inicie o aplicativo:Bashnpx expo start
Abra o App: Escaneie o QR Code que apareceu no terminal usando o app Expo Go no seu celula
