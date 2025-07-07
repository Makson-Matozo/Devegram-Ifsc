import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from './Firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function Perfil() {
    const navigation = useNavigation();

    const [perfil, setPerfil] = useState({
        username: '',
        email: '',
        descricao: '',
        dataNascimento: '',
        avatar: null,
    });

    const carregarPerfil = useCallback(async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const docRef = doc(db, 'usuarios', user.uid);
            const snapshot = await getDocFromServer(docRef);

            setPerfil({
                username: snapshot.exists() && snapshot.data().username?.trim() !== '' ? snapshot.data().username : '',
                email: user.email || '',
                descricao: snapshot.exists() && snapshot.data().descricao?.trim() !== '' ? snapshot.data().descricao : '',
                dataNascimento: snapshot.exists() && snapshot.data().dataNascimento?.trim() !== '' ? snapshot.data().dataNascimento : '',
                avatar: snapshot.exists() ? snapshot.data().avatar || null : null,
            });
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregarPerfil();
        }, [carregarPerfil])
    );

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            console.error('Erro ao sair da conta:', error);
        }
    };

    const renderInfoSection = (label, content, placeholder) => (
        <View style={styles.secao}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.textoInfo} numberOfLines={3}>
                {content && content.trim() !== '' ? content : placeholder}
            </Text>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={
                    perfil.avatar
                        ? { uri: perfil.avatar }
                        : require('./assets/user.png')
                }
                style={styles.avatar}
            />

            <Text style={styles.nome}>
                {perfil.username && perfil.username.trim() !== '' ? perfil.username : 'Sem apelido'}
            </Text>
            <Text style={styles.email}>{perfil.email}</Text>

            {renderInfoSection('Descrição', perfil.descricao, 'Sem descrição')}
            {renderInfoSection('Data de Nascimento', perfil.dataNascimento, 'Sem data de nascimento informada')}

            <TouchableOpacity
                style={styles.botao}
                onPress={() => navigation.navigate('EditarPerfil')}
            >
                <Text style={styles.botaoTexto}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.botao, styles.botaoSair]}
                onPress={handleLogout}
            >
                <Text style={styles.botaoTexto}>Sair</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    nome: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    secao: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    textoInfo: {
        fontSize: 15,
        color: '#444',
        lineHeight: 20,
    },
    botao: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    botaoSair: {
        backgroundColor: '#ff3b30',
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
