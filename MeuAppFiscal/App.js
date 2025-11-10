import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Importe as suas telas
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
// 2. IMPORTE A NOVA TELA HOME
import HomeScreen from './HomeScreen'; 

// 3. Crie o "Navegador" do tipo pilha
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // 4. O "Container" envolve toda a navegação do app
    <NavigationContainer>
      {/* 5. O "Stack.Navigator" gerencia a pilha de telas */}
      <Stack.Navigator
        // Opção para esconder o cabeçalho (nome da tela) em todas as telas
        screenOptions={{
          headerShown: false,
        }}
        // Define qual tela é a primeira a ser mostrada
        initialRouteName="Login"
      >
        {/* 6. Defina suas telas */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* 7. ADICIONE A NOVA TELA HOME AQUI */}
        <Stack.Screen name="Home" component={HomeScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}