import React, { useState } from 'react';
import {
    View,
    TextInput,
    Alert,
    Text,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';
import styles from '../estilo/estiloLogin';
import { Feather } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [confirmarVisivel, setConfirmarVisivel] = useState(false);

    const criarConta = () => {
        if (!email || !senha || !confirmarSenha) {
            Alert.alert("Aviso", "Preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        createUserWithEmailAndPassword(auth, email, senha)
            .then(() => {
                Alert.alert("Sucesso", "Conta criada com sucesso!");
                navigation.navigate('Login');
            })
            .catch(error => Alert.alert("Erro", error.message));
    };

    return (
        <ImageBackground
            source={require('../assets/background_signup.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.titulo}>Criar Conta</Text>

                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    onChangeText={setEmail}
                    value={email}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor="#aaa"
                />

                {/* Campo senha com olho */}
                <View style={styles.senhaContainer}>
                    <TextInput
                        style={styles.inputSenha}
                        placeholder="Senha"
                        secureTextEntry={!senhaVisivel}
                        onChangeText={setSenha}
                        value={senha}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity
                        style={styles.olhoIcone}
                        onPress={() => setSenhaVisivel(!senhaVisivel)}
                    >
                        <Feather
                            name={senhaVisivel ? 'eye' : 'eye-off'}
                            size={22}
                            color="#aaa"
                        />
                    </TouchableOpacity>
                </View>

                {/* Campo confirmar senha com olho */}
                <View style={styles.senhaContainer}>
                    <TextInput
                        style={styles.inputSenha}
                        placeholder="Confirmar Senha"
                        secureTextEntry={!confirmarVisivel}
                        onChangeText={setConfirmarSenha}
                        value={confirmarSenha}
                        placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity
                        style={styles.olhoIcone}
                        onPress={() => setConfirmarVisivel(!confirmarVisivel)}
                    >
                        <Feather
                            name={confirmarVisivel ? 'eye' : 'eye-off'}
                            size={22}
                            color="#aaa"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.botao} onPress={criarConta}>
                    <Text style={styles.botaoTexto}>Criar Conta</Text>
                </TouchableOpacity>

                <Text style={styles.registroTexto}>
                    Já tem uma conta?
                    <Text style={styles.linkRegistro} onPress={() => navigation.popToTop()}>
                        {' '}Faça login
                    </Text>
                </Text>
            </View>
        </ImageBackground>
    );
}
