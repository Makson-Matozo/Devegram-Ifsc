import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Telas principais
import Home from './Home';
import Comentarios from './Comentarios';
import Perfil from './Perfil';
import Detalhes from './Detalhes';
import Pesquisa from './Pesquisa';
import EditarPerfil from './EditarPerfil';
import SelecionarAvatar from './SelecionarAvatar';

// Telas de autenticação
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ResetSenha from './ResetSenha';

// Tela SpaceScreen
import SpaceScreen from './SpaceScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

//  Pilha da Home
function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomePrincipal"
                component={Home}
                options={{
                    title: 'Feed',
                    headerLeft: () => null, // remove a seta de voltar
                }}
            />
            <Stack.Screen name="Comentarios" component={Comentarios} />
            <Stack.Screen name="Detalhes" component={Detalhes} />
        </Stack.Navigator>
    );
}

//  Pilha da Pesquisa
function PesquisaStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PesquisaPrincipal"
                component={Pesquisa}
                options={{
                    title: 'Pesquisar',
                    headerLeft: () => null,
                }}
            />
            <Stack.Screen name="Detalhes" component={Detalhes} />
            <Stack.Screen name="Comentarios" component={Comentarios} />
        </Stack.Navigator>
    );
}

//  Pilha do Perfil
function PerfilStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PerfilPrincipal"
                component={Perfil}
                options={{
                    title: 'Meu Perfil',
                    headerLeft: () => null,
                }}
            />
            <Stack.Screen
                name="EditarPerfil"
                component={EditarPerfil}
                options={{
                    title: 'Editar Perfil',
                    headerLeft: () => null,
                }}
            />
            <Stack.Screen
                name="SelecionarAvatar"
                component={SelecionarAvatar}
                options={{
                    title: 'Escolher Avatar',
                    headerLeft: () => null,
                }}
            />
        </Stack.Navigator>
    );
}

//  Abas principais
function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
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

//  Navegação principal
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
