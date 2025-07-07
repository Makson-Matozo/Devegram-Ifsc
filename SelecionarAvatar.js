import React, { useState } from 'react';
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
            await setDoc(doc(db, 'usuarios', user.uid), {
                avatar: Image.resolveAssetSource(imagemSelecionada).uri,
            }, { merge: true });

            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar avatar:', error);
        }
    };

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
                        <Text style={styles.textoCategoria}>{categoria}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.subtitulo}>Escolha seu avatar:</Text>
            <View style={styles.listaAvatares}>
                {avatares[categoriaAtiva].map((imagem, index) => (
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
        padding: 20,
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    categorias: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    botaoCategoria: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 8,
        marginRight: 10,
        marginBottom: 10,
    },
    categoriaAtiva: {
        backgroundColor: '#6f42c1',
    },
    textoCategoria: {
        color: '#333',
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
        marginBottom: 15,
    },
});
