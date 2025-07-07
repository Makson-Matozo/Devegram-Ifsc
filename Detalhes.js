import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore';
import { db, auth } from './Firebase';

export default function Detalhes({ route }) {
    const { foto } = route.params;
    const navigation = useNavigation();
    const user = auth.currentUser;

    const [curtido, setCurtido] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [comentarios, setComentarios] = useState([]);

    // ✔️ Verifica se o usuário curtiu essa foto
    useEffect(() => {
        if (!user || !foto?.id) return;

        async function verificarCurtida() {
            try {
                const ref = doc(db, 'userLikes', user.uid);
                const snap = await getDoc(ref);
                const curtidas = snap.exists() ? snap.data().curtidas || [] : [];
                setCurtido(curtidas.includes(foto.id));
            } catch (error) {
                console.error('Erro ao verificar curtida:', error);
            }
        }

        verificarCurtida();
    }, [foto?.id]);

    // ❤️ Atualiza contador de curtidas em tempo real
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'userLikes'), (snapshot) => {
            let total = 0;
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.curtidas?.includes(foto.id)) {
                    total++;
                }
            });
            setLikesCount(total);
        });

        return () => unsubscribe();
    }, [foto?.id]);

    // 💬 Comentários em tempo real
    useEffect(() => {
        if (!foto?.id) return;

        const q = query(
            collection(db, 'images', String(foto.id), 'comments'),
            orderBy('criadoEm', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComentarios(lista);
        });

        return () => unsubscribe();
    }, [foto?.id]);

    // ❤️ Curtir ou Descurtir
    const alternarCurtida = async () => {
        if (!user || !foto?.id) {
            alert('Você precisa estar logado para curtir.');
            return;
        }

        const ref = doc(db, 'userLikes', user.uid);

        try {
            await updateDoc(ref, {
                curtidas: curtido ? arrayRemove(foto.id) : arrayUnion(foto.id),
            });
            setCurtido(!curtido);
        } catch (error) {
            console.error('Erro ao atualizar curtida:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: foto.src.large }} style={styles.image} resizeMode="contain" />

            <View style={styles.infoContainer}>
                <Text style={styles.photographer}>📸 {foto.photographer}</Text>
                <Text style={styles.description}>
                    {foto.alt || 'Sem descrição disponível.'}
                </Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.button} onPress={alternarCurtida}>
                    <FontAwesome name="heart" size={28} color={curtido ? 'red' : '#999'} />
                    <Text style={styles.buttonText}>
                        {likesCount} {likesCount === 1 ? 'curtida' : 'curtidas'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Comentarios', { fotoId: foto.id })}
                >
                    <FontAwesome name="comment" size={28} color="#333" />
                    <Text style={styles.buttonText}>
                        {comentarios.length} comentário{comentarios.length === 1 ? '' : 's'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>Comentários:</Text>

                {comentarios.length === 0 ? (
                    <Text style={styles.noComments}>Nenhum comentário até o momento.</Text>
                ) : (
                    comentarios.map((c) => (
                        <View key={c.id} style={styles.comentarioContainer}>
                            <Text style={styles.comentarioAutor}>{c.autor}:</Text>
                            <Text style={styles.comentarioTexto}>{c.texto}</Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    image: {
        width: '100%',
        height: 350,
        borderRadius: 12,
        marginBottom: 20,
    },
    infoContainer: {
        marginBottom: 25,
    },
    photographer: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#555',
        fontStyle: 'italic',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 8,
        fontSize: 16,
    },
    commentsSection: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 16,
    },
    commentsTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    noComments: {
        fontStyle: 'italic',
        color: '#999',
    },
    comentarioContainer: {
        marginBottom: 12,
    },
    comentarioAutor: {
        fontWeight: 'bold',
        color: '#333',
    },
    comentarioTexto: {
        color: '#444',
    },
});
