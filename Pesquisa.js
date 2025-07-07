import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Text,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function Pesquisa() {
    const [query, setQuery] = useState('');
    const [fotos, setFotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [historico, setHistorico] = useState([]);

    const navigation = useNavigation();

    const buscarFotos = async (buscaManual) => {
        const termo = buscaManual || query.trim();
        if (!termo) return;

        setLoading(true);
        setErrorMsg('');
        Keyboard.dismiss();

        try {
            const res = await axios.get(
                `https://api.pexels.com/v1/search?query=${encodeURIComponent(termo)}&per_page=15`,
                {
                    headers: {
                        Authorization: 'fUePkpFVOod140JnDH6Djpx0HhRdbZCvLkahA6cw7Ui86MzhAjuUIIK3',
                    },
                }
            );

            setFotos(res.data.photos);

            setHistorico((prev) => {
                const novoHist = prev.filter(item => item !== termo);
                return [termo, ...novoHist].slice(0, 5);
            });
        } catch (error) {
            console.log('Erro na busca:', error);
            setErrorMsg('Erro ao buscar imagens. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const limparBusca = () => {
        setQuery('');
        setFotos([]);
        setErrorMsg('');
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Detalhes', { foto: item })}
            activeOpacity={0.8}
            style={styles.card}
        >
            <Image source={{ uri: item.src.medium }} style={styles.image} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.searchRow}>
                <TextInput
                    placeholder="Buscar imagens..."
                    value={query}
                    onChangeText={setQuery}
                    style={styles.input}
                    returnKeyType="search"
                    onSubmitEditing={() => buscarFotos()}
                    editable={!loading}
                />

                <TouchableOpacity
                    style={[styles.button, (!query.trim() || loading) && styles.buttonDisabled]}
                    onPress={() => buscarFotos()}
                    disabled={loading || !query.trim()}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.clearButton} onPress={limparBusca}>
                    <Text style={styles.clearButtonText}>❌</Text>
                </TouchableOpacity>
            </View>

            {/* Histórico de buscas */}
            {historico.length > 0 && (
                <View style={styles.historicoContainer}>
                    <Text style={styles.historicoTitulo}>🔍 Pesquisas recentes:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {historico.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.historicoItem}
                                onPress={() => buscarFotos(item)}
                            >
                                <Text style={styles.historicoTexto}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Mensagens de erro ou carregamento */}
            {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
            ) : loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={fotos}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    style={{ marginTop: 20 }}
                    contentContainerStyle={fotos.length === 0 && { flexGrow: 1, justifyContent: 'center' }}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        !loading && (
                            <Text style={styles.emptyText}>
                                Comece digitando algo e toque em buscar para ver imagens.
                            </Text>
                        )
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#fff' },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
        marginRight: 8,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 15,
        justifyContent: 'center',
        borderRadius: 8,
        height: 40,
    },
    buttonDisabled: {
        backgroundColor: '#a1cafc',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    clearButton: {
        marginLeft: 8,
        paddingHorizontal: 8,
    },
    clearButtonText: {
        fontSize: 20,
    },
    card: {
        flex: 1,
        margin: 5,
        height: 150,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 50,
    },
    historicoContainer: {
        marginBottom: 10,
    },
    historicoTitulo: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    historicoItem: {
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    historicoTexto: {
        fontSize: 14,
        color: '#333',
    },
});
