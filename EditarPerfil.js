import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity,
    Alert, ScrollView, Image,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { auth, db } from './Firebase';
import { doc, getDocFromServer, setDoc } from 'firebase/firestore';

export default function EditarPerfil() {
    const navigation = useNavigation();
    const route = useRoute();

    const [username, setUsername] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [avatar, setAvatar] = useState(null);

    // 🔄 Carrega os dados do perfil direto do servidor Firebase
    const carregarDados = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, 'usuarios', user.uid);

        try {
            const snap = await getDocFromServer(ref);
            if (snap.exists()) {
                const dados = snap.data();
                setUsername(dados.username || '');
                setDescricao(dados.descricao || '');
                setDataNascimento(dados.dataNascimento || '');
                if (!avatar) setAvatar(dados.avatar || null);
            }
        } catch (error) {
            console.log('Erro ao buscar dados:', error);
        }
    };

    //  Atualiza os dados sempre que a tela for focada
    useFocusEffect(useCallback(() => {
        carregarDados();
    }, []));

    //  Atualiza o avatar se veio da tela anterior
    useEffect(() => {
        if (route.params?.avatarSelecionado) {
            setAvatar(route.params.avatarSelecionado);
            navigation.setParams({ avatarSelecionado: undefined });
        }
    }, [route.params?.avatarSelecionado]);

    //  Salva alterações no Firestore
    const salvarAlteracao = async () => {
        const user = auth.currentUser;
        if (!user) return;

        //  Valida a data de nascimento se preenchida
        if (dataNascimento.trim() && !/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento.trim())) {
            Alert.alert('Data inválida', 'Use o formato dd/mm/aaaa.');
            return;
        }

        try {
            await setDoc(
                doc(db, 'usuarios', user.uid),
                {
                    username: username.trim() || null,
                    descricao: descricao.trim() || null,
                    dataNascimento: dataNascimento.trim() || null,
                    avatar: avatar || null,
                },
                { merge: true }
            );

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            navigation.navigate('PerfilPrincipal');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            Alert.alert('Erro', 'Não foi possível salvar.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {avatar && <Image source={{ uri: avatar }} style={styles.avatarPreview} />}

            <Text style={styles.label}>Apelido:</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Digite seu nome"
            />

            <Text style={styles.label}>Descrição:</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Sobre você"
                multiline
            />

            <Text style={styles.label}>Data de Nascimento:</Text>
            <TextInput
                style={styles.input}
                value={dataNascimento}
                onChangeText={(text) =>
                    setDataNascimento(text.replace(/[^0-9/]/g, ''))
                }
                placeholder="dd/mm/aaaa"
                keyboardType="numeric"
            />

            <TouchableOpacity
                style={styles.botaoAvatar}
                onPress={() => navigation.navigate('SelecionarAvatar')}
            >
                <Text style={styles.botaoTexto}>Editar Foto de Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botao} onPress={salvarAlteracao}>
                <Text style={styles.botaoTexto}>Salvar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#fff',
    },
    avatarPreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        marginTop: 15,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    botao: {
        backgroundColor: '#28a745',
        marginTop: 20,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    botaoAvatar: {
        backgroundColor: '#6f42c1',
        marginTop: 20,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
