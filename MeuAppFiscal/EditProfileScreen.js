import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from './context/AuthContext';
import { API_URL } from './constants';
import * as ImagePicker from 'expo-image-picker';
import Feather from 'react-native-vector-icons/Feather';

const EditProfileScreen = ({ navigation }) => {
  const { userInfo, userToken, updateUser } = useContext(AuthContext);

  const [username, setUsername] = useState(userInfo.username);
  const [image, setImage] = useState(null); // Para a nova imagem selecionada
  const [isLoading, setIsLoading] = useState(false);
  
  // URL da foto de perfil (atual ou a nova selecionada)
  const profilePicUri = image?.uri || (userInfo.profilePictureUrl ? `${API_URL}/${userInfo.profilePictureUrl.replace(/\\/g, '/')}` : null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria.");
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Quadrado
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('username', username);

    if (image) {
      const uriParts = image.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      formData.append('profilePicture', {
        uri: image.uri,
        name: `profile.${fileType}`,
        type: `image/${fileType}`,
      });
    }
    
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      let data;
      try { data = JSON.parse(responseText); }
      catch (e) { throw new Error("O servidor enviou uma resposta inesperada."); }
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar perfil.');
      }

      updateUser(data.user); // Atualiza o contexto global
      Alert.alert('Sucesso', 'Perfil atualizado!');
      navigation.goBack(); // Volta para a tela de Perfil

    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f7" />
      
      {/* Cabeçalho da Tela */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.saveButton}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Card de Foto */}
        <View style={styles.card}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {profilePicUri ? (
              <Image source={{ uri: profilePicUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarLetter}>{username.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Feather name="camera" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhotoText}>Alterar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Nome */}
        <View style={styles.card}>
          <Text style={styles.label}>Nome de Usuário</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4f7' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  saveButton: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  container: { padding: 20, alignItems: 'center' },
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
  },
  avatarContainer: { marginBottom: 15 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#191923',
    padding: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  changePhotoText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 15,
    fontSize: 16,
  },
});

export default EditProfileScreen;