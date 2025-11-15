import React, { useState, useEffect, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons'; 
import { AuthContext } from './context/AuthContext';
import { API_URL } from './constants';

// --- Componente do Card (Atualizado) ---
const PostCard = ({ post, userId, onLike, onDelete, navigation }) => {
  const imageUrl = `${API_URL}/${post.imageUrl.replace(/\\/g, '/')}`;
  const username = post.user ? post.user.username : 'Usuário';
  const location = post.location || 'Localização não informada';
  const profilePicUri = post.user?.profilePictureUrl
    ? `${API_URL}/${post.user.profilePictureUrl.replace(/\\/g, '/')}`
    : null;
  const initial = username.charAt(0).toUpperCase();

  // --- ATUALIZAÇÃO DA CATEGORIA (TAG) ---
  const category = post.category || 'Outros'; // Pega a categoria do post

  const isLiked = post.likes.includes(userId);
  const likeCount = post.likes.length;
  const commentCount = post.comments.length; 
  const isOwner = post.user?._id === userId;

  const confirmDelete = () => {
    Alert.alert(
      "Deletar Post",
      "Tem certeza que deseja deletar este post? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Deletar", style: "destructive", onPress: () => onDelete(post._id) }
      ]
    );
  };
  
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        {profilePicUri ? (
          <Image source={{ uri: profilePicUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          {location ? (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={12} color="#555" />
              <Text style={styles.locationText}>{location}</Text>
            </View>
          ) : null}
        </View>
        {isOwner && (
          <TouchableOpacity onPress={confirmDelete}>
            <Feather name="trash-2" size={20} color="#E91E63" /> 
          </TouchableOpacity>
        )}
      </View>

      <Image
        source={{ uri: imageUrl }}
        style={styles.postImage}
      />

      <View style={styles.actionBar}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={() => onLike(post._id)} style={styles.icon}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={26}
              color={isLiked ? "#E91E63" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.icon}
            onPress={() => navigation.navigate('CommentsScreen', { postId: post._id })}
          >
            <Ionicons name="chatbubble-outline" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Feather name="send" size={26} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.rightActions}>
          <Feather name="bookmark" size={26} color="black" />
        </View>
      </View>

      <View style={styles.contentArea}>
        <Text style={styles.likes}>{likeCount} curtidas</Text>

        {/* --- TAG DE CATEGORIA DINÂMICA --- */}
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{category}</Text>
        </View>

        <Text style={styles.caption} numberOfLines={2}>
          <Text style={styles.username}>{username} </Text>
          {post.caption}
        </Text>
        {commentCount > 0 && (
          <TouchableOpacity 
            onPress={() => navigation.navigate('CommentsScreen', { postId: post._id })}
          >
            <Text style={styles.commentCountText}>
              Ver todos os {commentCount} comentários
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// --- Componente da Tela Principal (Sem alterações) ---
const HomeScreen = ({ navigation }) => {
  const { userToken, userInfo, signOut } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const currentUserId = userInfo?.id || userInfo?._id;

  const fetchPosts = async (page = 1, refreshing = false) => {
    if (!refreshing) setIsLoading(true);
    setError(null); 
    try {
      const response = await fetch(`${API_URL}/api/posts?page=${page}&limit=5`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      const responseText = await response.text();
      let data;
      try { data = JSON.parse(responseText); }
      catch (e) { throw new Error("O servidor enviou uma resposta inesperada."); }
      if (!response.ok) throw new Error(data.message || 'Erro ao buscar posts');

      setPosts(refreshing ? data.posts : [...posts, ...data.posts]);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      setError(error.message); 
      if (error.message.includes('Token')) signOut(); 
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      const responseText = await response.text();
      let updatedPost;
      try { updatedPost = JSON.parse(responseText); }
      catch (e) { throw new Error("Resposta inesperada do servidor ao curtir."); }
      if (!response.ok) {
        throw new Error(updatedPost.message || 'Erro ao curtir post');
      }
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post._id === postId ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Erro no handleLike:", error);
      alert("Não foi possível curtir o post.");
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao deletar post');
      }
      setPosts(currentPosts => 
        currentPosts.filter(post => post._id !== postId)
      );
      Alert.alert('Sucesso', 'Post deletado.');
    } catch (error) {
      console.error("Erro no handleDelete:", error);
      alert(error.message || "Não foi possível deletar o post.");
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchPosts(1, true); 
  };

  const loadMore = () => {
    if (!isLoading && currentPage < totalPages) {
      fetchPosts(currentPage + 1);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts(1, true); 
    });
    return unsubscribe;
  }, [navigation]);

  const renderFooter = () => {
    if (isLoading && !isRefreshing) {
      return <ActivityIndicator size="large" color="#000" style={{ marginVertical: 20 }} />;
    }
    return null;
  };

  const renderContent = () => {
    if (error && !posts.length) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar o feed:</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!posts.length && !isLoading) {
      return (
         <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Nenhum post encontrado.</Text>
          <Text style={styles.errorText}>Seja o primeiro a postar!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('HomeTab', { screen: 'CreatePost' })} style={styles.retryButton}>
            <Text style={styles.retryText}>Criar Primeiro Post</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard 
            post={item} 
            userId={currentUserId} 
            onLike={handleLike} 
            onDelete={handleDelete} 
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.scrollView}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appHeader}> 
        <Text style={styles.appHeaderTitle}>Fiscal Cidadão</Text>
        <TouchableOpacity onPress={signOut}>
            <Feather name="log-out" size={24} color="#E91E63" />
        </TouchableOpacity>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appHeaderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: { backgroundColor: '#f0f0f0' },
  postCard: { backgroundColor: '#fff', marginBottom: 10 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  userInfo: { flex: 1 },
  username: { fontWeight: 'bold', fontSize: 14, color: '#000' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationText: { fontSize: 12, color: '#555', marginLeft: 3 },
  postImage: { width: '100%', height: 400, backgroundColor: '#eee' },
  actionBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  leftActions: { flexDirection: 'row' },
  rightActions: {},
  icon: { marginRight: 15 },
  contentArea: { paddingHorizontal: 12, paddingBottom: 15 },
  likes: { fontWeight: 'bold', fontSize: 14, color: '#000' },
  tagContainer: { // Estilo para a tag
    backgroundColor: '#FFEBEE', 
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
  },
  tagText: { // Estilo para o texto da tag
    color: '#E91E63', 
    fontSize: 12,
    fontWeight: '500',
  },
  caption: { fontSize: 14, color: '#000', marginTop: 4, lineHeight: 18 },
  commentCountText: {
    fontSize: 14,
    color: '#888', 
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  retryButton: {
    backgroundColor: '#191923',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;