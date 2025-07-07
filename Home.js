import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

import { db, auth } from './Firebase';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    collection,
    onSnapshot,
} from 'firebase/firestore';

export default function Home() {
    const [fotos, setFotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [curtidasUsuario, setCurtidasUsuario] = useState([]);
    const [curtidasPorFoto, setCurtidasPorFoto] = useState({});
    const [comentariosPorFoto, setComentariosPorFoto] = useState({});
    const navigation = useNavigation();
    const user = auth.currentUser;

    // 🔄 Carregar fotos da API + Iniciar contagens em tempo real
    useEffect(() => {
        let stopCurtidas = null;
        let stopComentarios = null;

        async function carregarFotos() {
            try {
                const res = await axios.get('https://api.pexels.com/v1/curated?per_page=40', {
                    headers: {
                        Authorization: 'fUePkpFVOod140JnDH6Djpx0HhRdbZCvLkahA6cw7Ui86MzhAjuUIIK3',
                    },
                });

                const fotosCarregadas = res.data.photos;
                setFotos(fotosCarregadas);

                stopCurtidas = escutarCurtidasTempoReal(fotosCarregadas);
                stopComentarios = escutarComentariosTempoReal(fotosCarregadas);
            } catch (error) {
                console.log('Erro ao carregar fotos:', error);
            } finally {
                setLoading(false);
            }
        }

        carregarFotos();

        return () => {
            if (stopCurtidas) stopCurtidas();
            if (stopComentarios) stopComentarios();
        };
    }, []);

    // 💾 Carregar curtidas salvas do usuário
    useEffect(() => {
        if (!user) return;

        async function carregarCurtidasUsuario() {
            const ref = doc(db, 'userLikes', user.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                setCurtidasUsuario(snap.data().curtidas || []);
            } else {
                await setDoc(ref, { curtidas: [] });
                setCurtidasUsuario([]);
            }
        }

        carregarCurtidasUsuario();
    }, [user]);

    // 📡 Escutar curtidas em tempo real
    const escutarCurtidasTempoReal = (fotos) => {
        const unsubscribe = onSnapshot(collection(db, 'userLikes'), (snapshot) => {
            const contagem = {};

            for (const foto of fotos) {
                let total = 0;

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.curtidas?.includes(foto.id)) {
                        total++;
                    }
                });

                contagem[foto.id] = total;
            }

            setCurtidasPorFoto(contagem);
        });

        return unsubscribe;
    };

    // 📡 Escutar comentários em tempo real
    const escutarComentariosTempoReal = (fotos) => {
        const unsubscribes = fotos.map((foto) => {
            const ref = collection(db, 'images', String(foto.id), 'comments');

            return onSnapshot(ref, (snapshot) => {
                setComentariosPorFoto((prev) => ({
                    ...prev,
                    [foto.id]: snapshot.size,
                }));
            });
        });

        return () => unsubscribes.forEach((unsub) => unsub());
    };

    // ❤️ Curtir / Descurtir
    const alternarCurtida = async (fotoId) => {
        if (!user) {
            alert('Você precisa estar logado para curtir.');
            return;
        }

        const ref = doc(db, 'userLikes', user.uid);

        try {
            if (curtidasUsuario.includes(fotoId)) {
                await updateDoc(ref, { curtidas: arrayRemove(fotoId) });
                setCurtidasUsuario((prev) => prev.filter((id) => id !== fotoId));
            } else {
                await updateDoc(ref, { curtidas: arrayUnion(fotoId) });
                setCurtidasUsuario((prev) => [...prev, fotoId]);
            }
        } catch (error) {
            console.error('Erro ao atualizar curtida:', error);
        }
    };

    // 📷 Renderizar item da lista
    const renderItem = ({ item }) => {
        const estaCurtido = curtidasUsuario.includes(item.id);
        const totalCurtidas = curtidasPorFoto[item.id] || 0;
        const totalComentarios = comentariosPorFoto[item.id] || 0;

        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => navigation.navigate('Detalhes', { foto: item })}>
                    <Image source={{ uri: item.src.medium }} style={styles.image} />
                </TouchableOpacity>

                <Text style={styles.photographer}>📸 {item.photographer}</Text>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.button} onPress={() => alternarCurtida(item.id)}>
                        <FontAwesome
                            name="heart"
                            size={22}
                            color={estaCurtido ? 'red' : '#999'}
                        />
                        <Text style={styles.buttonText}>
                            {totalCurtidas} {totalCurtidas === 1 ? 'curtida' : 'curtidas'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Comentarios', { fotoId: item.id })}
                    >
                        <FontAwesome name="comment" size={22} color="#333" />
                        <Text style={styles.buttonText}>
                            {totalComentarios} comentário{totalComentarios === 1 ? '' : 's'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Carregando fotos...</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={fotos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 8,
    },
    photographer: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 6,
        fontSize: 15,
        color: '#444',
    },
});
