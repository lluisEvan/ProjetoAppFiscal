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
  Alert, 
  ActivityIndicator, 
} from 'react-native';
import { Feather } from '@expo/vector-icons';  // <<<< MUDANÇA AQUI


const API_URL = 'http://192.168.3.26:3000';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email e senha são obrigatórios.');
      return;
    }
    setIsLoading(true);
    setError(null); 


    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });


      const data = await response.json();


      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }
      
      navigation.replace('Home'); 


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
        <View style={styles.card}>
          <Text style={styles.title}>Fiscal Cidadão</Text>
          <Text style={styles.subtitle}>
            Entre na sua conta para fiscalizar sua cidade
          </Text>


          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="rgba(0, 0, 0, 0.2)"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>


          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Sua senha"
              placeholderTextColor="rgba(0, 0, 0, 0.2)"
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


          {error && <Text style={styles.errorText}>{error}</Text>}


          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.buttonPrimaryText}>Entrar</Text>
            )}
          </TouchableOpacity>


          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Esqueci minha senha</Text>
          </TouchableOpacity>


          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>OU</Text>
            <View style={styles.separatorLine} />
          </View>


          <TouchableOpacity 
            style={styles.buttonSecondary}
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={styles.buttonSecondaryText}>Criar nova conta</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Continuar como visitante</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  container: {
    flex: 1,
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


export default LoginScreen;
