import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Image // Import Image
} from 'react-native';
import { AuthContext } from './context/AuthContext';
import { API_URL } from './constants'; // Import API_URL
import Feather from 'react-native-vector-icons/Feather';

// Recebe { navigation } para poder navegar para "EditProfile"
const ProfileScreen = ({ navigation }) => {
  const { userInfo, signOut } = useContext(AuthContext);

  // Define os valores (com um "fallback" caso userInfo seja nulo)
  const username = userInfo ? userInfo.username : 'Nome do Usuário';
  const email = userInfo ? userInfo.email : 'email@exemplo.com';
  const initial = username.charAt(0).toUpperCase();
  
  // URL da foto de perfil (se existir)
  const profilePicUri = userInfo?.profilePictureUrl 
    ? `${API_URL}/${userInfo.profilePictureUrl.replace(/\\/g, '/')}` 
    : null;

  // Função para confirmar o logout
  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza de que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: () => signOut(), style: "destructive" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f7" />
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.screenTitle}>Meu Perfil</Text>

        {/* Card de Informações do Usuário */}
        <View style={styles.card}>
          {/* Mostra a imagem se existir, senão mostra a letra inicial */}
          {profilePicUri ? (
            <Image source={{ uri: profilePicUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarLetter}>{initial}</Text>
            </View>
          )}
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Card de Opções */}
        <View style={styles.card}>
          {/* Opção 1: Editar Perfil */}
          <TouchableOpacity 
            style={styles.optionRow}
            onPress={() => navigation.navigate('EditProfile')} // <-- NAVEGAÇÃO
          >
            <Feather name="user" size={20} color="#333" style={styles.optionIcon} />
            <Text style={styles.optionText}>Editar Perfil</Text>
            <Feather name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>
          
          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.optionRow}>
            <Feather name="settings" size={20} color="#333" style={styles.optionIcon} />
            <Text style={styles.optionText}>Configurações</Text>
            <Feather name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.optionRow}>
            <Feather name="shield" size={20} color="#333" style={styles.optionIcon} />
            <Text style={styles.optionText}>Privacidade e Segurança</Text>
            <Feather name="chevron-right" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Botão de Sair */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7', 
  },
  container: {
    padding: 20,
    alignItems: 'center', 
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center', 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e6fafc',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    flex: 1, 
    fontSize: 16,
    color: '#333',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0', 
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191923', 
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen;