import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ImageBackground,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../Firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import styles from '../estilo/estiloPerfil';


export default function Perfil() {
    const navigation = useNavigation();

    const [perfil, setPerfil] = useState({
        username: '',
        email: '',
        descricao: '',
        dataNascimento: '',
        avatar: null,  // pode ser URL ou caminho inválido
    });

    // Estado para controlar se houve erro no carregamento da imagem avatar
    const [avatarErro, setAvatarErro] = useState(false);

    const carregarPerfil = useCallback(async () => {
        const user = auth.currentUser;
        if (!user) return;

        setAvatarErro(false); // resetar erro de avatar antes de carregar

        try {
            const docRef = doc(db, 'usuarios', user.uid);
            const snapshot = await getDocFromServer(docRef);

            if (snapshot.exists()) {
                const data = snapshot.data();
                setPerfil({
                    username: data.username?.trim() || '',
                    email: user.email || '',
                    descricao: data.descricao?.trim() || '',
                    dataNascimento: data.dataNascimento?.trim() || '',
                    avatar: data.avatar || null,
                });
            } else {
                setPerfil({
                    username: '',
                    email: user.email || '',
                    descricao: '',
                    dataNascimento: '',
                    avatar: null,
                });
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
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
            Alert.alert('Erro', 'Não foi possível sair da conta.');
        }
    };

    const InfoSection = ({ label, content, placeholder }) => (
        <View style={styles.secao}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.textoInfo} numberOfLines={3}>
                {content && content.trim() !== '' ? content : placeholder}
            </Text>
        </View>
    );

    return (
        <ImageBackground
            source={require('../assets/bg.jpg')}
            style={styles.background}
            resizeMode="cover"
            blurRadius={2}
        >
            <TouchableOpacity
                onPress={handleLogout}
                style={styles.iconeSair}
                activeOpacity={0.7}
            >
                <Feather name="log-out" size={26} color="#00BFFF" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <Image
                        source={
                            // Se avatarErro for true, usar a imagem local user.png
                            !avatarErro && perfil.avatar && perfil.avatar.trim() !== ''
                                ? { uri: perfil.avatar }
                                : require('../assets/user.png')
                        }
                        style={styles.avatar}
                        onError={() => setAvatarErro(true)} // Se imagem falhar, muda o estado para true
                        resizeMode="cover"
                    />

                    <Text style={styles.nome}>
                        {perfil.username || 'Sem apelido'}
                    </Text>
                    <Text style={styles.email}>{perfil.email}</Text>

                    <InfoSection
                        label="Descrição"
                        content={perfil.descricao}
                        placeholder="Sem descrição"
                    />
                    <InfoSection
                        label="Data de Nascimento"
                        content={perfil.dataNascimento}
                        placeholder="Sem data de nascimento informada"
                    />

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={() => navigation.navigate('EditarPerfil')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.botaoTexto}>Editar Perfil</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}