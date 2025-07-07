import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase';
import styles from './estilo/estiloLogin'; // Reutilizando os estilos

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

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
        <View style={styles.container}>
            <Text style={styles.titulo}>Criar Conta</Text>

            <TextInput 
                style={styles.input}
                placeholder="E-mail" 
                onChangeText={setEmail} 
                value={email} 
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput 
                style={styles.input}
                placeholder="Senha" 
                secureTextEntry 
                onChangeText={setSenha} 
                value={senha} 
            />

            <TextInput 
                style={styles.input}
                placeholder="Confirmar Senha" 
                secureTextEntry 
                onChangeText={setConfirmarSenha} 
                value={confirmarSenha} 
            />

            <TouchableOpacity style={styles.botao} onPress={criarConta}>
                <Text style={styles.botaoTexto}>Criar Conta</Text>
            </TouchableOpacity>

            <Text style={styles.registroTexto}>
                Já tem uma conta?
                <Text style={styles.linkRegistro} onPress={() => navigation.popToTop()}> Faça login</Text>
            </Text>
        </View>
    );
}
