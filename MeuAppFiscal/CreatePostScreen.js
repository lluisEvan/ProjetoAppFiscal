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
  Platform,
  ScrollView,
  StatusBar,
  Modal, 
  Pressable 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from './context/AuthContext';
import { API_URL } from './constants';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker'; 

const CreatePostScreen = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('Lixo Doméstico');
  const [modalVisible, setModalVisible] = useState(false);

  const categories = [
    "Lixo Doméstico",
    "Animais Abandonados",
    "Buraco na Via",
    "Falta de Iluminação",
    "Terreno Baldio",
    "Outros"
  ];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handlePost = async () => {
    if (!image) {
      Alert.alert('Erro', 'Por favor, selecione uma imagem para postar.');
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    const uriParts = image.uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('image', {
      uri: image.uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    });
    
    formData.append('caption', caption);
    formData.append('location', location);
    formData.append('category', category); 

    try {
      const response = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${userToken}` },
        body: formData,
      });
      const responseText = await response.text();
      let data;
      try { data = JSON.parse(responseText); }
      catch (e) { throw new Error("O servidor enviou uma resposta inesperada."); }
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar o post.');
      }
      Alert.alert('Sucesso', 'Post criado!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao postar:', error);
      Alert.alert('Erro', error.message || 'Não foi possível criar o post.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryPicker = () => {
    if (Platform.OS === 'android') {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
            mode="dropdown" 
          >
            {categories.map((cat) => (
              <Picker.Item label={cat} value={cat} key={cat} />
            ))}
          </Picker>
        </View>
      );
    }

    return (
      <>
        <TouchableOpacity 
          style={styles.pickerContainer} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.pickerText}>{category}</Text>
          <Feather name="chevron-down" size={20} color="#888" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Pronto</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.modalPicker}
                itemStyle={styles.modalPickerItem} 
              >
                {categories.map((cat) => (
                  <Picker.Item label={cat} value={cat} key={cat} />
                ))}
              </Picker>
            </View>
          </Pressable>
        </Modal>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={30} color="#333" />
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
      
      <ScrollView contentContainerStyle={styles.container}>
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
          placeholderTextColor="#aaa" // <-- CORREÇÃO AQUI
          value={caption}
          onChangeText={setCaption}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Adicionar localização (opcional)"
          placeholderTextColor="#aaa" // <-- CORREÇÃO AQUI
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Tipo de Denúncia</Text>
        
        {renderCategoryPicker()}
        
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
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
  postButton: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  container: { padding: 15 },
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 15,
    minHeight: 50,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 15,
    marginBottom: 8,
  },
  pickerContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    height: 50, 
    paddingHorizontal: 15, 
  },
  picker: { 
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
  },
  pickerText: { 
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    alignItems: 'flex-end',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  modalPicker: {
    width: '100%',
    height: 250, 
  },
  modalPickerItem: {
    color: '#000', 
    fontSize: 20,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreatePostScreen;