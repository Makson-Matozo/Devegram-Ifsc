import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../Firebase';
import { doc, setDoc } from 'firebase/firestore';
import styles from '../estilo/estiloSelecionarAvatar';


const avatares = {
    'Devil May Cry': [
        require('../assets/dante.png'),
        require('../assets/vergil.png'),
        require('../assets/nero.png'),
    ],
    Naruto: [
        require('../assets/naruto.png'),
        require('../assets/sasuke.png'),
        require('../assets/kakashi.png'),
    ],
    'Jujutsu Kaisen': [
        require('../assets/gojo.png'),
        require('../assets/yuji.png'),
        require('../assets/megumi.png'),
    ],
    'Dragon Ball': [
        require('../assets/goku.png'),
        require('../assets/vegeta.png'),
        require('../assets/gohan.png'),
    ],
    'One Piece': [
        require('../assets/luffy.png'),
        require('../assets/zoro.png'),
        require('../assets/sanji.png'),
    ],
    'Demon Slayer': [
        require('../assets/tanjiro.png'),
        require('../assets/nezuko.png'),
        require('../assets/zenitsu.png'),
    ],
    'solo leveling': [
        require('../assets/Sung.png'),
        require('../assets/Cha.png'),
        require('../assets/igris.png'),
    ],
    'Resident Evil': [
        require('../assets/leon.png'),
        require('../assets/Ada.png'),
        require('../assets/Albert.png'),
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

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categorias}
            >
                {Object.keys(avatares).map((categoria) => (
                    <TouchableOpacity
                        key={categoria}
                        style={[
                            styles.botaoCategoria,
                            categoria === categoriaAtiva && styles.categoriaAtiva,
                        ]}
                        onPress={() => setCategoriaAtiva(categoria)}
                    >
                        <Text
                            style={[
                                styles.textoCategoria,
                                categoria === categoriaAtiva && styles.textoCategoriaAtiva,
                            ]}
                        >
                            {categoria}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.subtitulo}>
                Avatares de <Text style={styles.categoriaSelecionada}>{categoriaAtiva}</Text>:
            </Text>

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
