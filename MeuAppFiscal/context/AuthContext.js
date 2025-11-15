import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Função de Login
  const signIn = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Erro ao analisar JSON (Login):", responseText);
        throw new Error("Resposta inesperada do servidor.");
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      setUserToken(data.token);
      setUserInfo(data.user);
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
      setIsLoading(false);
      return { success: true };

    } catch (e) {
      setIsLoading(false);
      return { success: false, message: e.message };
    }
  };

  // Função de Logout
  const signOut = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    setIsLoading(false);
  };

  // --- FUNÇÃO NOVA ---
  // Função para atualizar o usuário (após editar perfil)
  const updateUser = async (newUserInfo) => {
    try {
      setUserInfo(newUserInfo); // Atualiza o estado
      await AsyncStorage.setItem('userInfo', JSON.stringify(newUserInfo)); // Atualiza o storage
    } catch (e) {
      console.log(`updateUser error: ${e}`);
    }
  };
  // ------------------

  // Verifica se o usuário já está logado quando o app abre
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let token = await AsyncStorage.getItem('userToken');
      let user = await AsyncStorage.getItem('userInfo');
      
      if (token) {
        setUserToken(token);
        setUserInfo(JSON.parse(user));
      }
      setIsLoading(false);
    } catch (e) {
      console.log(`isLoggedIn error: ${e}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        signIn, 
        signOut, 
        updateUser, // <-- ADICIONADO AQUI
        userToken, 
        userInfo, 
        isLoading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};