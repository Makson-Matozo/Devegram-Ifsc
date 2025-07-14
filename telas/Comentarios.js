import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    Modal,
} from 'react-native';
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { db, auth } from '../Firebase';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import styles from '../estilo/estiloComentarios';

export default function Comentarios({ route }) {
    const { fotoId } = route.params || {};
    const [comentarios, setComentarios] = useState([]);
    const [comentarioTexto, setComentarioTexto] = useState('');
    const [comentarioSelecionado, setComentarioSelecionado] = useState(null);
    const [textoComentarioEditado, setTextoComentarioEditado] = useState('');
    const [comentarioMenuId, setComentarioMenuId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            setComentarioMenuId(null);
        }, [])
    );

    useEffect(() => {
        if (!fotoId) return;
        const q = query(
            collection(db, 'images', String(fotoId), 'comments'),
            orderBy('criadoEm', 'asc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                texto: doc.data()?.texto || '',
                autor: doc.data()?.autor || 'Anônimo',
            }));
            setComentarios(lista);
        });
        return unsubscribe;
    }, [fotoId]);

    const adicionarComentario = async () => {
        const user = auth.currentUser;
        if (!comentarioTexto.trim() || !user || !fotoId) return;
        try {
            await addDoc(collection(db, 'images', String(fotoId), 'comments'), {
                texto: comentarioTexto.trim(),
                autor: user.email,
                criadoEm: new Date(),
            });
            setComentarioTexto('');
        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
        }
    };

    const iniciarEdicao = (comentario) => {
        setComentarioSelecionado(comentario);
        setTextoComentarioEditado(comentario.texto);
    };

    const salvarEdicao = async () => {
        if (!comentarioSelecionado || !textoComentarioEditado.trim()) return;
        try {
            await updateDoc(
                doc(db, 'images', String(fotoId), 'comments', comentarioSelecionado.id),
                { texto: textoComentarioEditado.trim(), criadoEm: new Date() }
            );
            setComentarioSelecionado(null);
            setTextoComentarioEditado('');
            Alert.alert('Sucesso', 'Comentário editado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar edição:', error);
        }
    };

    const deletarComentario = async (id) => {
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja deletar este comentário?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {text: 'Deletar', style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'images', String(fotoId), 'comments', id));
                            setComentarioMenuId(null);
                            Alert.alert('Sucesso', 'Comentário deletado com sucesso!');
                        } catch (error) {
                            console.error('Erro ao deletar comentário:', error);
                        }
                    },
                },
            ]
        );
    };

    if (!fotoId) {
        return (
            <View style={styles.container}>
                <Text style={styles.semComentarios}>Erro: imagem não encontrada.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Comentários da Foto #{fotoId}</Text>

            <FlatList
                data={comentarios}
                keyExtractor={(item) => item.id}
                extraData={[comentarioMenuId, comentarioSelecionado]}
                renderItem={({ item }) => (
                    <View style={styles.comentarioContainer}>
                        <View style={styles.comentarioTopo}>
                            <Text style={styles.comentarioTexto}>
                                <Text style={{ fontWeight: 'bold' }}>{item.autor}:</Text> {item.texto}
                            </Text>
                            {auth.currentUser?.email === item.autor && (
                                <TouchableOpacity
                                    onPress={() =>
                                        setComentarioMenuId(prev => prev === item.id ? null : item.id)
                                    }
                                    style={styles.menuButton}
                                >
                                    <FontAwesome name="ellipsis-v" size={20} color="#666" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {comentarioMenuId === item.id && (
                            <View style={styles.menuInline}>
                                <TouchableOpacity onPress={() => iniciarEdicao(item)}>
                                    <Text style={styles.menuTexto}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deletarComentario(item.id)}>
                                    <Text style={[styles.menuTexto, { color: 'red' }]}>Deletar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.semComentarios}>Nenhum comentário ainda.</Text>}
                contentContainerStyle={{ flexGrow: 1 }}
            />

            <View style={styles.areaComentario}>
                <TextInput
                    value={comentarioTexto}
                    onChangeText={setComentarioTexto}
                    placeholder="Digite seu comentário..."
                    style={styles.input}
                    placeholderTextColor="#555"
                />
                <TouchableOpacity
                    onPress={adicionarComentario}
                    style={[styles.botao, !comentarioTexto.trim() && styles.botaoDesativado]}
                    disabled={!comentarioTexto.trim()}
                >
                    <Text style={styles.botaoTexto}>Enviar</Text>
                </TouchableOpacity>
            </View>

            {/* Modal de edição */}
            <Modal
                visible={!!comentarioSelecionado}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setComentarioSelecionado(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.edicaoContainer}>
                        <Text style={styles.titulo}>Editar Comentário</Text>
                        <TextInput
                            value={textoComentarioEditado}
                            onChangeText={setTextoComentarioEditado}
                            style={styles.modalInput}
                            multiline
                        />
                        <View style={styles.modalBotoes}>
                            <TouchableOpacity
                                style={[styles.botaoModal, { backgroundColor: '#28a745' }]}
                                onPress={salvarEdicao}
                            >
                                <Text style={styles.botaoTexto}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.botaoModal, { backgroundColor: '#dc3545' }]}
                                onPress={() => setComentarioSelecionado(null)}
                            >
                                <Text style={styles.botaoTexto}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
