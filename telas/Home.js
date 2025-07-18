import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../estilo/estiloHome';

import { db, auth } from '../Firebase';
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

    useEffect(() => {
        async function carregarFotos() {
            try {
                const res = await axios.get('https://api.pexels.com/v1/curated?per_page=40', {
                    headers: {
                        Authorization: 'fUePkpFVOod140JnDH6Djpx0HhRdbZCvLkahA6cw7Ui86MzhAjuUIIK3',
                    },
                });

                const fotosCarregadas = res.data.photos;
                setFotos(fotosCarregadas);
                escutarCurtidasTempoReal(fotosCarregadas);
                escutarComentariosTempoReal(fotosCarregadas);
            } catch (error) {
                console.log('Erro ao carregar fotos:', error);
            } finally {
                setLoading(false);
            }
        }

        carregarFotos();
    }, []);

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
    };

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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3399ff" />
                <Text style={styles.loadingText}>Carregando fotos...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.listContainer}>
            {fotos.map((item) => {
                const estaCurtido = curtidasUsuario.includes(item.id);
                const totalCurtidas = curtidasPorFoto[item.id] || 0;
                const totalComentarios = comentariosPorFoto[item.id] || 0;

                return (
                    <View key={item.id} style={styles.card}>
                        <TouchableOpacity onPress={() => navigation.navigate('Detalhes', { foto: item })}>
                            <Image source={{ uri: item.src.medium }} style={styles.image} />
                        </TouchableOpacity>

                        <Text style={styles.photographer}>📸 {item.photographer}</Text>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.button}
                                onPress={() => alternarCurtida(item.id)}
                            >
                                <FontAwesome
                                    name="heart"
                                    size={24}
                                    color={estaCurtido ? 'red' : '#fff'}
                                />
                                <Text style={styles.buttonText}>
                                    {totalCurtidas} {totalCurtidas === 1 ? 'curtida' : 'curtidas'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={styles.button}
                                onPress={() => navigation.navigate('Comentarios', { fotoId: item.id })}
                            >
                                <FontAwesome name="comment" size={24} color="#aaa" />
                                <Text style={styles.buttonText}>
                                    {totalComentarios} comentário{totalComentarios === 1 ? '' : 's'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
}
