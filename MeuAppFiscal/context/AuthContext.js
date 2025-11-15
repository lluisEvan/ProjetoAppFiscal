import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importa a URL da sua API
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
      // 1. Tenta fazer o login na API
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Pega a resposta como texto primeiro
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

      // 2. Sucesso! Salva o token no estado e no Storage
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

  // Roda a verificação de login na primeira vez que o app abre
  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, userToken, userInfo, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};