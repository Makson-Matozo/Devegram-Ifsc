import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ImageBackground,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, db } from './Firebase';
import { doc, getDocFromServer } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; // Ícone de logout

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
            source={require('./assets/bg.jpg')} // fundo azul e preto estiloso
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
                            perfil.avatar
                                ? { uri: perfil.avatar }
                                : require('./assets/user.png')
                        }
                        style={styles.avatar}
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

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        padding: 24,
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#00BFFF',
        backgroundColor: '#111',
    },
    nome: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 6,
        color: '#fff',
        textAlign: 'center',
        textShadowColor: '#00BFFF',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    email: {
        fontSize: 15,
        color: '#bbb',
        marginBottom: 18,
        textAlign: 'center',
    },
    secao: {
        width: '100%',
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#00BFFF',
        marginBottom: 4,
    },
    textoInfo: {
        fontSize: 15,
        color: '#eee',
        lineHeight: 22,
    },
    botao: {
        backgroundColor: '#00BFFF',
        paddingVertical: 14,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#00BFFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    iconeSair: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 30,
        zIndex: 10,
    },
});
