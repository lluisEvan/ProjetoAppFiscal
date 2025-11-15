import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView, 
  ActivityIndicator, 
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // << 1. MUDANÇA (Consistência)
import Checkbox from 'expo-checkbox'; 

// << 2. MUDANÇA (Importando do seu arquivo central)
import { API_URL } from './constants'; 

const RegisterScreen = ({ navigation }) => {
  const [nome, setNome] = useState(''); // Será enviado como 'username'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aceitoTermos, setAceitoTermos] = useState(false);
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // << 3. MUDANÇA (Função handleRegister corrigida)
  const handleRegister = async () => {
    // Validações
    if (!nome || !email || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (!aceitoTermos) {
      setError('Você deve aceitar os termos de uso.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: nome, 
          email: email,
          password: password,
        }),
      });

      // CORREÇÃO DO JSON PARSER:
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Erro ao analisar JSON (Register):", responseText);
        throw new Error("O servidor enviou uma resposta inesperada.");
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar conta');
      }

      // Sucesso!
      Alert.alert(
        'Conta Criada!',
        'Sua conta foi criada com sucesso. Faça o login.',
      );
      navigation.navigate('Login'); // Isso está CORRETO!

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f7" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Junte-se à comunidade de fiscais cidadãos
            </Text>

            {/* --- Campo Nome completo (username) --- */}
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputContainer}>
              <Feather name="user" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome completo"
                placeholderTextColor="#aaa"
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            {/* --- Campo Email --- */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            {/* --- Campo Senha --- */}
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Crie uma senha (mín. 8 caracteres)"
                placeholderTextColor="#aaa"
                secureTextEntry={!isPasswordVisible} 
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* --- Campo Confirmar Senha --- */}
            <Text style={styles.label}>Confirmar senha</Text>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirme sua senha"
                placeholderTextColor="#aaa"
                secureTextEntry={!isConfirmPasswordVisible}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Feather
                  name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {/* --- Checkbox --- */}
            <View style={styles.checkboxContainer}>
              <Checkbox
                style={styles.checkbox}
                value={aceitoTermos}
                onValueChange={setAceitoTermos}
                color={aceitoTermos ? '#191923' : undefined}
                disabled={isLoading}
              />
              <Text style={styles.checkboxText}>
                Aceito os <Text style={styles.linkTextBold}>termos de uso</Text> e{' '}
                <Text style={styles.linkTextBold}>política de privacidade</Text>
              </Text>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity 
              style={styles.buttonPrimary}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.buttonPrimaryText}>Criar conta</Text>
              )}
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OU</Text>
              <View style={styles.separatorLine} />
            </View>

            <TouchableOpacity 
              style={styles.buttonSecondary}
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.buttonSecondaryText}>Já tenho uma conta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} disabled={isLoading}>
              <Text style={styles.linkText}>Continuar como visitante</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Seus estilos (corrigi o placeholderTextColor)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e6fafc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: '100%',
    height: 50,
    marginBottom: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    paddingLeft: 4, 
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 14,
    color: '#555',
    flex: 1, 
  },
  linkTextBold: {
    fontWeight: 'bold',
    color: '#333',
    textDecorationLine: 'underline', 
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#191923',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginBottom: 20,
  },
  linkText: {
    fontSize: 15,
    color: '#555',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  buttonSecondaryText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;