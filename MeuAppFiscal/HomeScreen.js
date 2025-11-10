import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';

// Ícones: Você já deve ter esta biblioteca instalada
// por causa das telas de Login/Registro
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Componente do Card do Post
const PostCard = () => {
  return (
    <View style={styles.postCard}>
      {/* 1. Cabeçalho do Post */}
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>M</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>maria_silva</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color="#555" />
            <Text style={styles.locationText}>Rua das Palmeiras, Centro</Text>
          </View>
        </View>
        <Feather name="more-horizontal" size={24} color="black" />
      </View>

      {/* 2. Imagem Principal do Post */}
      <Image
        source={{
          // Esta é a URL da imagem de exemplo
          uri: 'https://i.imgur.com/vL4Nq6G.jpeg',
        }}
        style={styles.postImage}
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
        <Text style={styles.likes}>15 curtidas</Text>

        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Lixo Doméstico</Text>
        </View>

        <Text style={styles.caption}>
          <Text style={styles.username}>maria_silva </Text>
          cheio de lixo aqui na rua gzuz, me ajuda lula
        </Text>

        <Text style={styles.hashtags}>#muitomatheus #oiaaiprefeito</Text>
      </View>
    </View>
  );
};

// Componente Principal da Tela Home
// É ele que será importado no App.js
const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <PostCard />
        {/* Você pode adicionar mais <PostCard /> aqui para simular um feed */}
      </ScrollView>
    </SafeAreaView>
  );
};

// Folha de Estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#f0f0f0', // Fundo do feed
  },
  postCard: {
    backgroundColor: '#fff',
    marginBottom: 10, // Espaço entre posts
  },
  // --- Cabeçalho ---
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc', // Cor do avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 3,
  },
  // --- Imagem ---
  postImage: {
    width: '100%',
    height: 400,
  },
  // --- Barra de Ações ---
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  rightActions: {},
  icon: {
    marginRight: 15,
  },
  // --- Conteúdo ---
  contentArea: {
    paddingHorizontal: 12,
    paddingBottom: 15,
  },
  likes: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  tagContainer: {
    backgroundColor: '#FFEBEE', // Rosa claro
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  tagText: {
    color: '#E91E63', // Rosa escuro
    fontSize: 12,
    fontWeight: '500',
  },
  caption: {
    fontSize: 14,
    color: '#000',
    marginTop: 8,
    lineHeight: 18,
  },
  hashtags: {
    fontSize: 14,
    color: '#00376B', // Azul de hashtag
    marginTop: 4,
  },
});

export default HomeScreen;