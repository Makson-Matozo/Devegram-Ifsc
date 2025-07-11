import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './Firebase';
import { doc, setDoc } from 'firebase/firestore';

const avatares = {
    'Devil May Cry': [
        require('./assets/dante.png'),
        require('./assets/vergil.png'),
        require('./assets/nero.png'),
    ],
    Naruto: [
        require('./assets/naruto.png'),
        require('./assets/sasuke.png'),
        require('./assets/kakashi.png'),
    ],
    'Jujutsu Kaisen': [
        require('./assets/gojo.png'),
        require('./assets/yuji.png'),
        require('./assets/megumi.png'),
    ],
};

export default function SelecionarAvatar() {
    const navigation = useNavigation();
    const [categoriaAtiva, setCategoriaAtiva] = useState('Devil May Cry');

    const salvarAvatar = async (imagemSelecionada) => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const avatarUri = Image.resolveAssetSource(imagemSelecionada).uri;

            await setDoc(doc(db, 'usuarios', user.uid), {
                avatar: avatarUri,
            }, { merge: true });

            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar avatar:', error);
        }
    };

    const avataresDaCategoria = useMemo(() => avatares[categoriaAtiva] || [], [categoriaAtiva]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>Escolha uma categoria:</Text>
            <View style={styles.categorias}>
                {Object.keys(avatares).map((categoria) => (
                    <TouchableOpacity
                        key={categoria}
                        style={[
                            styles.botaoCategoria,
                            categoria === categoriaAtiva && styles.categoriaAtiva,
                        ]}
                        onPress={() => setCategoriaAtiva(categoria)}
                    >
                        <Text style={[
                            styles.textoCategoria,
                            categoria === categoriaAtiva && styles.textoCategoriaAtiva
                        ]}>
                            {categoria}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.subtitulo}>Escolha seu avatar:</Text>
            <View style={styles.listaAvatares}>
                {avataresDaCategoria.map((imagem, index) => (
                    <TouchableOpacity key={index} onPress={() => salvarAvatar(imagem)}>
                        <Image source={imagem} style={styles.avatar} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#212529',
    },
    categorias: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    botaoCategoria: {
        backgroundColor: '#e9ecef',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    categoriaAtiva: {
        backgroundColor: '#6f42c1',
    },
    textoCategoria: {
        fontSize: 15,
        color: '#495057',
    },
    textoCategoriaAtiva: {
        color: '#fff',
        fontWeight: 'bold',
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#343a40',
    },
    listaAvatares: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#dee2e6',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
});
