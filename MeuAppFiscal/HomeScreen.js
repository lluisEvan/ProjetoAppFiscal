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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from './context/AuthContext';
import { API_URL } from './constants';

const PostCard = ({ post }) => {
  const imageUrl = `${API_URL}/${post.imageUrl.replace(/\\/g, '/')}`;
  const username = post.user ? post.user.username : 'Usuário';
  const location = post.location || 'Localização não informada';
  
  return (
    <View style={styles.postCard}>
      {/* 1. Cabeçalho do Post */}
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{username.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color="#555" />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
        <Feather name="more-horizontal" size={24} color="black" />
      </View>

      {/* 2. Imagem Principal do Post */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.postImage}
        onError={(e) => console.log('Erro ao carregar imagem:', imageUrl, e.nativeEvent.error)}
      />

      {/* 3. Barra de Ações (Likes, Comentários, etc.) */}
      <View style={styles.actionBar}>
        <View style={styles.leftActions}>
          <Feather name="heart" size={26} color="black" style={styles.icon} />
          <Ionicons
            name="chatbubble-outline"
            size={26}
            color="black"
            style={styles.icon}
          />
          <Feather name="send" size={26} color="black" style={styles.icon} />
        </View>
        <View style={styles.rightActions}>
          <Feather name="bookmark" size={26} color="black" />
        </View>
      </View>

      {/* 4. Seção de Conteúdo (Curtidas, Legenda) */}
      <View style={styles.contentArea}>
        <Text style={styles.likes}>{post.likes.length || 0} curtidas</Text>
        <View style={styles.tagContainer}>
          {/* Você precisaria ter um campo 'tags' no seu modelo Post para popular isso */}
          <Text style={styles.tagText}>Lixo Doméstico</Text> 
        </View>
        <Text style={styles.caption}>
          <Text style={styles.username}>{username} </Text>
          {post.caption}
        </Text>
        {/* TO-DO: Implementar hashtags dinamicamente */}
        {/* <Text style={styles.hashtags}>#muitomatheus #oiaaiprefeito</Text> */}
      </View>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { userToken, signOut } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const fetchPosts = async (page = 1, refreshing = false) => {
    if (!refreshing) setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/posts?page=${page}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Não é JSON! Resposta da API:", responseText);
        throw new Error("O servidor enviou uma resposta inesperada.");
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar posts');
      }

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

  // Removido o renderHeader daqui, pois o cabeçalho agora está em App.js para a aba

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
          {/* Adicione um botão para ir para CreatePostScreen se quiser */}
          <TouchableOpacity onPress={() => navigation.navigate('CreatePost')} style={styles.retryButton}>
            <Text style={styles.retryText}>Criar Primeiro Post</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
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
      {/* O cabeçalho agora é controlado pelo Tab Navigator, mas podemos ter um específico se quisermos */}
      <View style={styles.appHeader}> {/* Novo cabeçalho simples para a Home */}
        <Text style={styles.appHeaderTitle}>Fiscal Cidadão</Text>
        <TouchableOpacity onPress={signOut}>
            <Feather name="log-out" size={24} color="#E91E63" />
        </TouchableOpacity>
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

// Folha de Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  appHeader: { // Novo estilo de cabeçalho da HomeScreen (dentro da Tab)
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
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
  tagContainer: { backgroundColor: '#FFEBEE', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start', marginTop: 8 },
  tagText: { color: '#E91E63', fontSize: 12, fontWeight: '500' },
  caption: { fontSize: 14, color: '#000', marginTop: 8, lineHeight: 18 },
  hashtags: { fontSize: 14, color: '#00376B', marginTop: 4 },
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