import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    Alert,
    TouchableOpacity,
    Image
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase';
import styles from './estilo/estiloLogin'; // Estilo atualizado com tema Devil May Cry

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = () => {
        if (!email || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                const user = userCredential.user;
                navigation.navigate('Main'); // navega para o Tab.Navigator
            })
            .catch((error) => {
                Alert.alert('Erro ao fazer login', error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('./assets/devilgrunt_logo.png')}
                style={styles.logo}
            />

            <Text style={styles.titulo}>LOGIN</Text>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#aaa"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#aaa"
                onChangeText={setSenha}
                value={senha}
                secureTextEntry
            />

            <TouchableOpacity onPress={() => navigation.navigate('ResetSenha')}>
                <Text style={styles.linkEsqueceu}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botao} onPress={handleLogin}>
                <Text style={styles.botaoTexto}>LOGIN</Text>
            </TouchableOpacity>

            <Text style={styles.registroTexto}>
                Não possui conta?
                <Text
                    style={styles.linkRegistro}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    {' '}Registre-se agora
                </Text>
            </Text>
        </View>
    );
}
