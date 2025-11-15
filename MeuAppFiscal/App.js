import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Feather } from '@expo/vector-icons'; 

// Contexto
import { AuthContext, AuthProvider } from './context/AuthContext';

// Telas
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import CreatePostScreen from './CreatePostScreen'; 
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import CommentsScreen from './CommentsScreen'; // <-- 1. IMPORTA A NOVA TELA

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator(); 

// --- Stacks de Autenticação ---
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// --- Stack da Home (para modal de Criar Post e Comentários) ---
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Feed" component={HomeScreen} />
    <Stack.Screen 
      name="CreatePost" 
      component={CreatePostScreen} 
      options={{ presentation: 'modal' }} 
    />
    {/* --- 2. ADICIONA A TELA DE COMENTÁRIOS AO STACK --- */}
    <Stack.Screen
      name="CommentsScreen"
      component={CommentsScreen}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);

// --- Stack do Perfil (para modal de Editar Perfil) ---
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
  </Stack.Navigator>
);

// --- Tabs Principais do App (O Rodapé) ---
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false, 
      tabBarShowLabel: false, 
      tabBarActiveTintColor: '#191923', 
      tabBarInactiveTintColor: '#888', 
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        height: 60,
        paddingBottom: 5,
      },
    }}
  >
    {/* Aba 1: Home/Feed */}
    <Tab.Screen
      name="HomeTab"
      component={HomeStack} 
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
      component={View} // Dummy
      options={{
        tabBarIcon: ({ size }) => (
          <View style={styles.addPostButton}>
            <Feather name="plus-square" color="#fff" size={size + 5} />
          </View>
        ),
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault(); 
          navigation.navigate('HomeTab', { screen: 'CreatePost' }); 
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
    
    {/* Aba 5: Perfil (Tela Real) */}
    <Tab.Screen
      name="ProfileTab"
      component={ProfileStack} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="user" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

// --- Navegador Principal ---
const AppNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppTabs /> : <AuthStack />} 
    </NavigationContainer>
  );
};

// --- Exportação Principal ---
export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

// --- Estilos ---
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
  addPostButton: { 
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