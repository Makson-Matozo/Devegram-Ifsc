import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './Firebase';
import styles from './estilo/estiloLogin'; // Reaproveitamos o mesmo estilo do login

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        if (!email) {
            Alert.alert("Aviso", "Por favor, digite seu e-mail.");
            return;
        }

        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert("Sucesso", "Link de redefinição enviado para seu e-mail.");
                navigation.goBack();
            })
            .catch((error) => {
                Alert.alert("Erro", error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Recuperar Senha</Text>

            <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.botao} onPress={handleResetPassword}>
                <Text style={styles.botaoTexto}>Enviar link de redefinição</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botao} onPress={() => navigation.goBack()}>
                <Text style={styles.botaoTexto}>Voltar para o login</Text>
            </TouchableOpacity>
        </View>
    );
}
