# 🏙️ Projeto Fiscal Cidadão

Fiscal Cidadão é um aplicativo full-stack de rede social, construído com React Native (Expo) e uma API Node.js/Express. O objetivo é permitir que os usuários postem denúncias públicas sobre problemas em sua cidade (como lixo, buracos na rua, etc.), incluindo fotos, localização e categoria.

O aplicativo funciona com duas partes separadas:
1.  **Backend (API):** O servidor que armazena os dados no MongoDB.
2.  **Frontend (App):** O aplicativo React Native (Expo) que o usuário usa no celular.

---

## ✨ Funcionalidades Principais

* **Autenticação de Usuário:** Cadastro e Login completos usando tokens JWT.
* **Perfil de Usuário:** Visualização e edição de perfil, com upload de foto.
* **Feed de Posts:** Um feed principal, estilo Instagram, que busca os posts da API.
* **Criação de Posts:** Upload de imagem, legenda, localização e seleção de "Tipo de Denúncia".
* **Interatividade:** Funcionalidade completa de Curtir/Descurtir posts.
* **Comentários:** Sistema de comentários em modal, com envio e listagem.
* **Gerenciamento:** Usuários podem deletar seus próprios posts.
* **Segurança da API:** Proteção de rotas, `cors`, `helmet` e `express-rate-limit`.

---

## 🛠️ Tecnologias Utilizadas

| Frontend (Aplicativo) | Backend (API) |
| :--- | :--- |
| React Native (Expo) | Node.js |
| React Navigation (Stack & Tabs) | Express.js |
| React Context API (para Auth) | MongoDB (com Mongoose) |
| `@react-native-async-storage` | `jsonwebtoken` (JWT) |
| `expo-image-picker` | `bcryptjs` (Hash de Senhas) |
| `@react-native-picker/picker` | `multer` (Upload de Arquivos) |
| `react-native-vector-icons` | `cors`, `helmet` |

---

## 📋 Pré-requisitos (O que baixar)

Antes de começar, você precisa ter as seguintes ferramentas instaladas na sua máquina:

1.  **[Node.js](https://nodejs.org/)**: (Versão LTS recomendada). Essencial para rodar tanto a API quanto o App.
2.  **[Git](https://git-scm.com/)**: Para gerenciar o código (opcional, mas recomendado).
3.  **[MongoDB Community Server](https://www.mongodb.com/try/download/community)**: O banco de dados.
    * **Recomendação:** Baixe o **[MongoDB Compass](https://www.mongodb.com/try/download/compass)**. É uma interface gráfica que facilita a visualização do seu banco de dados e já inclui o servidor.
4.  **[Expo Go (App)](https://expo.dev/client)**: O aplicativo para celular (Android/iOS) que irá rodar o seu projeto.
5.  **Um Editor de Código**: Recomendado: **[VS Code](https://code.visualstudio.com/)**.

---

## ⚙️ Configuração e Instalação

Você precisará configurar as duas partes do projeto em pastas separadas.

### 1. Backend (API)

Esta é a configuração do seu servidor Node.js (a pasta `api-cadastro`).

1.  **Clone (ou copie) a pasta da API** para o seu computador.
2.  **Abra um terminal** dentro dessa pasta.
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Crie o arquivo de ambiente:** Na raiz da pasta da API, crie um arquivo chamado `.env` e cole o seguinte conteúdo nele:

    > **`.env`**
    > ```
    > # Conexão do MongoDB (mude 'api-fiscal-cidadao' para o nome que quiser)
    > MONGO_URI=mongodb://localhost:27017/api-fiscal-cidadao
    > 
    > # Chave secreta para o JWT (mude para qualquer senha longa e segura)
    > JWT_SECRET=sua-chave-secreta-super-segura-aqui-123
    > 
    > # Porta em que a API vai rodar
    > PORT=3000
    > ```

5.  **Verifique o MongoDB:** Antes de ligar a API, certifique-se de que o seu MongoDB está rodando no seu computador (se você usa o MongoDB Compass, basta abri-lo e conectar).

### 2. Frontend (Aplicativo)

Esta é a configuração do seu aplicativo React Native (a pasta `MeuAppFiscal`).

1.  **Clone (ou copie) a pasta do App** para o seu computador.
2.  **Abra um *segundo* terminal** dentro dessa pasta.
3.  **Instale as dependências:**
    ```bash
    npm install 
    ```
    *Se você tiver problemas de dependência, delete a pasta `node_modules` e o `package-lock.json` e rode:*
    ```bash
    npx expo install
    ```
4.  **Configure o IP da API:** Este é o passo mais importante. Crie um arquivo na raiz do App chamado `constants.js` e cole o código abaixo.

    > **`constants.js`**
    > ```javascript
    > // Substitua 'SEU_IP_AQUI' pelo IP da sua máquina
    > export const API_URL = 'http://SEU_IP_AQUI:3000';
    > ```
    > 
    > **Como achar seu IP:**
    > * No Windows: Abra o `cmd` e digite `ipconfig`. Procure por "Endereço IPv4".
    > * No Mac/Linux: Abra o terminal e digite `ifconfig` ou `ip addr`. Procure por `inet`.
    > * *Seu IP será algo como `192.168.1.10`.*

---

## ▶️ Como Rodar o Projeto

Você precisa de **dois terminais** abertos ao mesmo tempo.

### Terminal 1: Ligar o Backend (API)

1.  Navegue até a pasta da sua API:
    ```bash
    cd C:\caminho\para\sua\api-cadastro
    ```
2.  Inicie o servidor em modo de desenvolvimento:
    ```bash
    npm run dev
    ```
3.  Você deve ver as mensagens:
    > `[nodemon] starting node server.js`
    > `Servidor rodando na porta 3000`
    > `Conectado ao MongoDB com sucesso!`

### Terminal 2: Ligar o Frontend (App)

1.  Navegue até a pasta do seu App:
    ```bash
    cd C:\caminho\para\seu\MeuAppFiscal
    ```
2.  Inicie o servidor do Expo (usando `-c` para limpar o cache):
    ```bash
    npx expo start -c
    ```
3.  Um QR Code aparecerá no terminal.
4.  **No seu celular:**
    * Abra o aplicativo **Expo Go**.
    * Escaneie o QR Code.
    * Certifique-se de que seu celular está na **mesma rede Wi-Fi** que o seu computador.

O aplicativo irá carregar e você poderá testar todas as funcionalidades!
