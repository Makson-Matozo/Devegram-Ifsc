import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Image,
    ImageBackground,
    Keyboard,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../Firebase';
import { doc, getDocFromServer, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../estilo/estiloEditarPerfil';

export default function EditarPerfil() {
    const navigation = useNavigation();
    const route = useRoute();

    const [username, setUsername] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    function parseDate(str) {
        if (!str) return new Date();
        const parts = str.split('/');
        if (parts.length !== 3) return new Date();
        const [day, month, year] = parts;
        return new Date(year, month - 1, day);
    }

    function formatDate(date) {
        if (!date) return '';
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    async function carregarDados() {
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
    }

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [])
    );

    useEffect(() => {
        if (route.params?.avatarSelecionado && route.params.avatarSelecionado !== avatar) {
            setAvatar(route.params.avatarSelecionado);
            setTimeout(() => {
                navigation.setParams({ avatarSelecionado: undefined });
            }, 100);
        }
    }, [route.params?.avatarSelecionado]);

    async function salvarAlteracao() {
        const user = auth.currentUser;
        if (!user) return;

        Keyboard.dismiss();

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
    }

    function onChangeDate(event, selectedDate) {
        setShowDatePicker(false);
        if (selectedDate) {
            setDataNascimento(formatDate(selectedDate));
        }
    }

    return (
        <ImageBackground
            source={require('../assets/bg-perfil.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <Text style={styles.textoVoltar}>← Voltar</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                {avatar && <Image source={{ uri: avatar }} style={styles.avatarPreview} />}

                <Text style={styles.label}>Apelido:</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#888"
                />

                <Text style={styles.label}>Descrição:</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Sobre você"
                    placeholderTextColor="#888"
                    multiline
                />

                <Text style={styles.label}>Data de Nascimento:</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                    <TextInput
                        style={styles.input}
                        value={dataNascimento}
                        placeholder="dd/mm/aaaa"
                        placeholderTextColor="#888"
                        editable={false}
                        selectTextOnFocus={false}
                    />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={parseDate(dataNascimento)}
                        mode="date"
                        display="calendar"
                        onChange={onChangeDate}
                        maximumDate={new Date()}
                    />
                )}

                <TouchableOpacity
                    style={styles.botaoAvatar}
                    onPress={() => navigation.navigate('SelecionarAvatar')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.botaoTexto}>Editar Foto de Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={salvarAlteracao}
                    activeOpacity={0.8}
                >
                    <Text style={styles.botaoTexto}>Salvar</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}
