import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
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
import { db, auth } from './Firebase';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function Comentarios({ route }) {
    const { fotoId } = route.params || {};
    const [comentarios, setComentarios] = useState([]);
    const [comentarioTexto, setComentarioTexto] = useState('');
    const [menuAbertoId, setMenuAbertoId] = useState(null);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [comentarioSelecionado, setComentarioSelecionado] = useState(null);
    const [textoComentarioEditado, setTextoComentarioEditado] = useState('');

    useFocusEffect(
        useCallback(() => {
            setMenuAbertoId(null);
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
        setModalVisivel(true);
        setMenuAbertoId(null);
    };

    const salvarEdicao = async () => {
        if (!comentarioSelecionado || !textoComentarioEditado.trim()) return;

        try {
            await updateDoc(
                doc(db, 'images', String(fotoId), 'comments', comentarioSelecionado.id),
                { texto: textoComentarioEditado.trim(), criadoEm: new Date() }
            );

            setModalVisivel(false);
            setComentarioSelecionado(null);
            setTextoComentarioEditado('');
        } catch (error) {
            console.error('Erro ao salvar edição:', error);
        }
    };

    const deletarComentario = async (id) => {
        try {
            await deleteDoc(doc(db, 'images', String(fotoId), 'comments', id));
            setMenuAbertoId(null);
        } catch (error) {
            console.error('Erro ao deletar comentário:', error);
        }
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
            <Text style={styles.titulo}>💬 Comentários da Foto #{fotoId}</Text>

            <FlatList
                data={comentarios}
                keyExtractor={(item) => item.id}
                extraData={menuAbertoId}
                renderItem={({ item }) => (
                    <View style={styles.comentarioContainer}>
                        <View style={styles.comentarioTopo}>
                            <Text style={styles.comentarioTexto}>
                                <Text style={{ fontWeight: 'bold' }}>{item.autor}:</Text> {item.texto}
                            </Text>

                            {auth.currentUser?.email === item.autor && (
                                <TouchableOpacity
                                    onPress={() => setMenuAbertoId(menuAbertoId === item.id ? null : item.id)}
                                    style={styles.menuButton}
                                >
                                    <FontAwesome name="ellipsis-v" size={20} color="#666" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {menuAbertoId === item.id && (
                            <View style={styles.menuComentario}>
                                <TouchableOpacity onPress={() => iniciarEdicao(item)} style={styles.menuOption}>
                                    <Text style={styles.menuTexto}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deletarComentario(item.id)} style={styles.menuOption}>
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
                />
                <TouchableOpacity
                    onPress={adicionarComentario}
                    style={[styles.botao, !comentarioTexto.trim() && styles.botaoDesativado]}
                    disabled={!comentarioTexto.trim()}
                >
                    <Text style={styles.botaoTexto}>Enviar</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisivel}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisivel(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitulo}>Editar Comentário</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={textoComentarioEditado}
                            onChangeText={setTextoComentarioEditado}
                            multiline
                            autoFocus
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
                                onPress={() => setModalVisivel(false)}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00CFFF',
        marginBottom: 15,
    },
    comentarioContainer: {
        position: 'relative', // ESSENCIAL
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: '#1C1F39',
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#2D2D3A',
    },
    comentarioTopo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    comentarioTexto: {
        fontSize: 16,
        color: '#87AAFF',
        flex: 1,
        paddingRight: 10,
    },
    menuButton: {
        padding: 6,
    },
    menuComentario: {
        position: 'absolute',
        right: 0,
        top: 30,
        backgroundColor: '#1C1F39',
        borderColor: '#00CFFF',
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        zIndex: 10,
        elevation: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    menuOption: {
        paddingVertical: 6,
    },
    menuTexto: {
        fontSize: 16,
        color: '#87AAFF',
    },
    semComentarios: {
        textAlign: 'center',
        color: '#aaa',
        marginTop: 40,
        fontStyle: 'italic',
    },
    areaComentario: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: '#2D2D3A',
        backgroundColor: '#0D0D0D',
    },
    input: {
        flex: 1,
        backgroundColor: '#1C1F39',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 15,
        marginRight: 10,
        color: '#87AAFF',
        borderWidth: 1,
        borderColor: '#2D2D3A',
    },
    botao: {
        backgroundColor: '#00CFFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    botaoDesativado: {
        backgroundColor: '#1C1F39',
        borderWidth: 1,
        borderColor: '#444',
    },
    botaoTexto: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#1C1F39',
        padding: 20,
        borderRadius: 12,
        width: '90%',
        maxWidth: 400,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#00CFFF',
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00CFFF',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        height: 100,
        borderColor: '#2D2D3A',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#0D0D0D',
        color: '#87AAFF',
    },
    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    botaoModal: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
});
