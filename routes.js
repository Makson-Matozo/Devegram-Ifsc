import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Telas principais
import Home from './telas/Home';
import Comentarios from './telas/Comentarios';
import Perfil from './telas/Perfil';
import Detalhes from './telas/Detalhes';
import Pesquisa from './telas/Pesquisa';
import EditarPerfil from './telas/EditarPerfil';
import SelecionarAvatar from './telas/SelecionarAvatar';

// Telas de autenticação
import LoginScreen from './telas/LoginScreen';
import SignUpScreen from './telas/SignUpScreen';
import ResetSenha from './telas/ResetSenha';

// Tela SpaceScreen
import SpaceScreen from './telas/SpaceScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Pilha da Home com header estilizado
function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#1a2144', // azul escuro
                    shadowColor: 'transparent', // remove sombra iOS
                    elevation: 0, // remove sombra Android
                },
                headerTintColor: '#adb1f5', // azul clarinho
                headerTitleStyle: {
                    fontWeight: '700',
                },
                headerLeft: () => null, // remove seta voltar na tela principal
            }}
        >
            <Stack.Screen
                name="HomePrincipal"
                component={Home}
                options={{ title: 'Feed' }}
            />
            <Stack.Screen name="Comentarios" component={Comentarios} />
            <Stack.Screen name="Detalhes" component={Detalhes} />
        </Stack.Navigator>
    );
}

// Pilha da Pesquisa com header estilizado
function PesquisaStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#1a2144',
                    shadowColor: 'transparent',
                    elevation: 0,
                },
                headerTintColor: '#adb1f5',
                headerTitleStyle: {
                    fontWeight: '700',
                },
                headerLeft: () => null,
            }}
        >
            <Stack.Screen
                name="PesquisaPrincipal"
                component={Pesquisa}
                options={{ title: 'Pesquisar' }}
            />
            <Stack.Screen name="Detalhes" component={Detalhes} />
            <Stack.Screen name="Comentarios" component={Comentarios} />
        </Stack.Navigator>
    );
}

// Pilha do Perfil com header estilizado
function PerfilStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#1a2144',
                    shadowColor: 'transparent',
                    elevation: 0,
                },
                headerTintColor: '#adb1f5',
                headerTitleStyle: {
                    fontWeight: '700',
                },
                headerLeft: () => null,
            }}
        >
            <Stack.Screen
                name="PerfilPrincipal"
                component={Perfil}
                options={{ title: 'Meu Perfil' }}
            />
            <Stack.Screen
                name="EditarPerfil"
                component={EditarPerfil}
                options={{ title: 'Editar Perfil' }}
            />
            <Stack.Screen
                name="SelecionarAvatar"
                component={SelecionarAvatar}
                options={{ title: 'Escolher Avatar' }}
            />
        </Stack.Navigator>
    );
}

// Abas principais com estilo do rodapé e ícones
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#1a2144', // fundo azul escuro do rodapé
                    borderTopWidth: 0,
                    elevation: 10,
                },
                tabBarActiveTintColor: '#adb1f5', // azul clarinho para ícone ativo
                tabBarInactiveTintColor: 'white', // branco para ícone inativo
                tabBarIcon: ({ color, size }) => {
                    let icon;
                    if (route.name === 'Home') icon = 'home';
                    else if (route.name === 'Pesquisa') icon = 'search';
                    else if (route.name === 'Perfil') icon = 'person';
                    return <Ionicons name={icon} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Pesquisa" component={PesquisaStack} />
            <Tab.Screen name="Perfil" component={PerfilStack} />
        </Tab.Navigator>
    );
}

// Navegação principal
export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Tela inicial que aparece primeiro */}
                <Stack.Screen name="SpaceScreen" component={SpaceScreen} />

                {/* Telas de autenticação */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ResetSenha" component={ResetSenha} />

                {/* Pilha principal do app após login */}
                <Stack.Screen name="Main" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
