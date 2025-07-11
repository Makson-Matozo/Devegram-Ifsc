import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    Image,
    ImageBackground,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { auth, db } from './Firebase';
import { doc, getDocFromServer, setDoc } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditarPerfil() {
    const navigation = useNavigation();
    const route = useRoute();

    const [username, setUsername] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const parseDate = (str) => {
        if (!str) return new Date();
        const parts = str.split('/');
        if (parts.length !== 3) return new Date();
        const [day, month, year] = parts;
        return new Date(year, month - 1, day);
    };

    const formatDate = (date) => {
        if (!date) return '';
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

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

    const salvarAlteracao = async () => {
        const user = auth.currentUser;
        if (!user) return;

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

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDataNascimento(formatDate(selectedDate));
        }
    };

    return (
        <ImageBackground
            source={require('./assets/bg-perfil.jpg')}
            style={styles.background}
            resizeMode="cover"
            blurRadius={2}
        >
            {/* Botão Voltar */}
            <TouchableOpacity
                style={styles.botaoVoltar}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <Text style={styles.textoVoltar}>← Voltar</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.container}>
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
                        pointerEvents="none"
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
                >
                    <Text style={styles.botaoTexto}>Editar Foto de Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botao} onPress={salvarAlteracao}>
                    <Text style={styles.botaoTexto}>Salvar</Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        padding: 20,
        paddingBottom: 40,
        alignItems: 'stretch',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    avatarPreview: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#00BFFF',
        backgroundColor: '#111',
    },
    label: {
        fontSize: 16,
        color: '#00BFFF',
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 6,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#00BFFF',
        borderRadius: 10,
        paddingHorizontal: 12,
        color: '#fff',
        fontSize: 15,
        backgroundColor: '#1a1a1a',
    },
    botao: {
        backgroundColor: '#00BFFF',
        marginTop: 20,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#00BFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    botaoAvatar: {
        backgroundColor: '#6f42c1',
        marginTop: 20,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
        shadowColor: '#6f42c1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
    },
    botaoTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    botaoVoltar: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        zIndex: 10,
        shadowColor: '#00BFFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
    },
    textoVoltar: {
        color: '#00BFFF',
        fontWeight: '700',
        fontSize: 16,
    },
});
