import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // IMPORTANTE: Navegação por Abas

// Ícones para as abas
import Feather from 'react-native-vector-icons/Feather';

// Contexto de Autenticação (Para saber se o usuário está logado)
import { AuthContext, AuthProvider } from './context/AuthContext';

// Telas
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import CreatePostScreen from './CreatePostScreen'; // Tela de criar post

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); // O Tab Navigator cria o rodapé

// --- Stacks de Autenticação (Login/Registro) ---
// Usado quando o usuário não está logado
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// --- Stack da Home (para permitir que CreatePost seja um modal) ---
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feed" component={HomeScreen} />
    <Stack.Screen 
      name="CreatePost" 
      component={CreatePostScreen} 
      options={{ presentation: 'modal' }} // A tela de postagem desliza de baixo para cima
    />
  </Stack.Navigator>
);

// --- Tabs Principais do App (O Rodapé) ---
// Usado quando o usuário ESTÁ logado
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false, // Esconde o cabeçalho padrão
      tabBarShowLabel: false, // Não mostra o texto dos ícones
      tabBarActiveTintColor: '#191923', // Cor do ícone ativo
      tabBarInactiveTintColor: '#888', // Cor do ícone inativo
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        height: 60,
        paddingBottom: 5,
      },
    })}
  >
    {/* Aba 1: Home/Feed */}
    <Tab.Screen
      name="HomeTab"
      component={HomeStack} // Inicia o Feed (que está dentro de um Stack)
      options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="home" color={color} size={size} />
        ),
      }}
    />
    
    {/* Aba 2: Busca (Exemplo) */}
    <Tab.Screen
      name="SearchTab"
      component={() => <View style={styles.tabPlaceholder}><Text>Tela de Busca</Text></View>}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="search" color={color} size={size} />
        ),
      }}
    />
    
    {/* Aba 3: Adicionar Post (O botão '+' no rodapé) */}
    <Tab.Screen
      name="AddPostTab"
      component={View} // Componente "dummy" (falso)
      options={{
        tabBarIcon: ({ size }) => (
          <View style={styles.addPostButton}>
            <Feather name="plus-square" color="#fff" size={size + 5} />
          </View>
        ),
      }}
      // Listener para navegar para o modal de criação
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault(); // Impede a navegação padrão
          navigation.navigate('HomeTab', { screen: 'CreatePost' }); // Abre o modal
        },
      })}
    />
    
    {/* Aba 4: Atividade (Exemplo) */}
    <Tab.Screen
      name="ActivityTab"
      component={() => <View style={styles.tabPlaceholder}><Text>Tela de Atividade</Text></View>}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="heart" color={color} size={size} />
        ),
      }}
    />
    
    {/* Aba 5: Perfil (Exemplo) */}
    <Tab.Screen
      name="ProfileTab"
      component={() => <View style={styles.tabPlaceholder}><Text>Tela de Perfil</Text></View>}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="user" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);


// --- O App Principal que decide entre AuthStack e AppTabs ---
const AppNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  // Enquanto o app verifica o token no AsyncStorage
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Se tiver token, mostra as abas; se não, mostra Login */}
      {userToken ? <AppTabs /> : <AuthStack />} 
    </NavigationContainer>
  );
};

// --- Envolva TUDO no AuthProvider ---
// O AuthProvider é o que dá ao AppNavigator o valor de userToken
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabPlaceholder: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  addPostButton: { // Estilo para o botão de '+' no rodapé
    backgroundColor: '#191923', 
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 20 : 0, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});