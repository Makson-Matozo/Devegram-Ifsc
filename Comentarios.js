import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
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

export default function Comentarios({ route }) {
    const { fotoId } = route.params || {};
    const [comentarios, setComentarios] = useState([]);
    const [comentarioTexto, setComentarioTexto] = useState('');
    const [menuAbertoId, setMenuAbertoId] = useState(null);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [comentarioSelecionado, setComentarioSelecionado] = useState(null);
    const [textoComentarioEditado, setTextoComentarioEditado] = useState('');

    // 📡 Carregar comentários em tempo real
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

    // ➕ Adicionar comentário
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

    // ✏️ Iniciar edição
    const iniciarEdicao = (comentario) => {
        setComentarioSelecionado(comentario);
        setTextoComentarioEditado(comentario.texto);
        setModalVisivel(true);
        setMenuAbertoId(null);
    };

    // 💾 Salvar edição
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

    // 🗑️ Deletar comentário
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
        <View
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={80}
        >
            <Text style={styles.titulo}>💬 Comentários da Foto #{fotoId}</Text>

            <FlatList
                data={comentarios}
                keyExtractor={(item) => item.id}
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
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 20 },
    titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    comentarioContainer: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        position: 'relative',
    },
    comentarioTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    comentarioTexto: { fontSize: 16, color: '#333', flex: 1, paddingRight: 10 },
    menuButton: { paddingHorizontal: 8, paddingVertical: 4 },
    menuComentario: {
        position: 'absolute',
        right: 10,
        top: 35,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        zIndex: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    menuOption: { paddingVertical: 6 },
    menuTexto: { fontSize: 16 },
    semComentarios: { textAlign: 'center', color: '#777', marginTop: 40, fontStyle: 'italic' },
    areaComentario: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 15,
        marginRight: 10,
    },
    botao: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    botaoDesativado: { backgroundColor: '#a0c4ff' },
    botaoTexto: { color: '#fff', fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxWidth: 400,
    },
    modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalInput: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: 15,
    },
    modalBotoes: { flexDirection: 'row', justifyContent: 'space-between' },
    botaoModal: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
});
