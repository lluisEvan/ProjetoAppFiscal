import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { AuthContext } from './context/AuthContext';
import { API_URL } from './constants';
import Feather from 'react-native-vector-icons/Feather';

// --- Componente de Item de Comentário ---
const CommentItem = ({ comment }) => {
  const username = comment.user ? comment.user.username : 'Usuário';
  const initial = username.charAt(0).toUpperCase();
  
  const profilePicUri = comment.user?.profilePictureUrl 
    ? `${API_URL}/${comment.user.profilePictureUrl.replace(/\\/g, '/')}` 
    : null;

  return (
    <View style={styles.commentContainer}>
      {/* Mostra a foto de perfil ou a letra inicial */}
      {profilePicUri ? (
        <Image source={{ uri: profilePicUri }} style={styles.commentAvatar} />
      ) : (
        <View style={[styles.commentAvatar, styles.avatarPlaceholder]}>
          <Text style={styles.commentAvatarText}>{initial}</Text>
        </View>
      )}
      <View style={styles.commentBody}>
        <Text>
          <Text style={styles.commentUsername}>{username} </Text>
          <Text style={styles.commentText}>{comment.text}</Text>
        </Text>
      </View>
    </View>
  );
};

// --- Tela Principal de Comentários ---
const CommentsScreen = ({ route, navigation }) => {
  const { postId } = route.params; // Pega o ID do post
  const { userToken } = useContext(AuthContext);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Função para buscar os comentários
  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao buscar comentários');
      setComments(data);
    } catch (error) {
      console.error(error);
      alert('Não foi possível carregar os comentários.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para enviar um novo comentário
  const handleSendComment = async () => {
    if (newComment.trim().length === 0) return; // Não envia vazio

    setIsSending(true);
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ text: newComment }),
      });
      
      const responseText = await response.text();
      let updatedPost;
      try {
        updatedPost = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Resposta inesperada do servidor.");
      }
      
      if (!response.ok) throw new Error(updatedPost.message || 'Erro ao enviar comentário');
      
      setComments(updatedPost.comments);
      setNewComment(''); // Limpa o input

    } catch (error) {
      console.error(error);
      alert('Não foi possível enviar o comentário.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={30} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comentários</Text>
          <View style={{ width: 30 }} /> {/* Espaçador */}
        </View>

        {/* Lista de Comentários */}
        {isLoading ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : (
          <FlatList
            data={comments}
            renderItem={({ item }) => <CommentItem comment={item} />}
            keyExtractor={(item) => item._id}
            style={styles.list}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum comentário ainda.</Text>
                <Text style={styles.emptyText}>Seja o primeiro a comentar!</Text>
              </View>
            }
          />
        )}

        {/* Input de Enviar Comentário */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Adicionar um comentário..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity onPress={handleSendComment} disabled={isSending}>
            {isSending ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Text style={styles.sendButton}>Enviar</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  list: { flex: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  // Estilos do Item de Comentário
  commentContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarText: { color: '#fff', fontWeight: 'bold' },
  commentBody: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14,
  },
  commentText: {
    color: '#000',
    fontSize: 14,
    lineHeight: 18,
  },
  // Estilos do Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120, // Limita o tamanho do input
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default CommentsScreen;