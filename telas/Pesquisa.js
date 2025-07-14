import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    Text,
    ActivityIndicator,
    Keyboard,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import styles from '../estilo/estiloPesquisa';


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
                const novoHist = prev.filter((item) => item !== termo);
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
            activeOpacity={0.85}
            style={styles.card}
        >
            <Image source={{ uri: item.src.medium }} style={styles.image} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.searchRow}>
                <TextInput
                    placeholder="Buscar imagens..."
                    placeholderTextColor="#99aaff"
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
                    <Text style={styles.buttonText}>{loading ? 'Buscando...' : 'Buscar'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.clearButton} onPress={limparBusca}>
                    <Feather name="x" size={22} color="#99aaff" />
                </TouchableOpacity>
            </View>

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

            {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
            ) : loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} color="#6699ff" />
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
                                Comece digitando algo e toque em "Buscar" para ver imagens.
                            </Text>
                        )
                    }
                />
            )}
        </SafeAreaView>
    );
}