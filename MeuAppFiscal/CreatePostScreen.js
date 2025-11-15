import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform, // Import Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from './context/AuthContext';
import { API_URL } from './constants';
import Feather from 'react-native-vector-icons/Feather';

const CreatePostScreen = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função para pedir permissão e escolher imagem
  const pickImage = async () => {
    // Pedindo permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria para postar fotos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4], // Quadrado
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Função para enviar o post para a API
  const handlePost = async () => {
    if (!image) {
      Alert.alert('Erro', 'Por favor, selecione uma imagem para postar.');
      return;
    }

    setIsLoading(true);

    // FormData é usado para enviar arquivos (imagens)
    const formData = new FormData();
    
    // O 'uri' no React Native precisa ser formatado
    const uriParts = image.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('image', {
      uri: image.uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });
    
    formData.append('caption', caption);
    formData.append('location', location);

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          // 'Content-Type' é definido automaticamente pelo FormData
        },
        body: formData,
      });

      // Lê a resposta como texto
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Erro ao analisar JSON (Postar):", responseText);
        throw new Error("O servidor enviou uma resposta inesperada.");
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar o post.');
      }

      Alert.alert('Sucesso', 'Post criado!');
      navigation.goBack(); // Volta para o feed

    } catch (error) {
      console.error('Erro ao postar:', error);
      Alert.alert('Erro', error.message || 'Não foi possível criar o post.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Novo Post</Text>
        <TouchableOpacity onPress={handlePost} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.postButton}>Postar</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Conteúdo */}
      <View style={styles.container}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        ) : (
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Feather name="camera" size={40} color="#ccc" />
            <Text style={styles.imagePickerText}>Escolher uma foto</Text>
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.input}
          placeholder="Escreva uma legenda..."
          value={caption}
          onChangeText={setCaption}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Adicionar localização (opcional)"
          value={location}
          onChangeText={setLocation}
        />
        
        {/* Overlay de Loading */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </View>
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
  postButton: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  container: { padding: 15, flex: 1 },
  imagePicker: {
    height: 200,
    width: '100%',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  imagePickerText: { color: '#aaa', marginTop: 10 },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 15,
    minHeight: 50,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Cobre a tela inteira
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePostScreen;