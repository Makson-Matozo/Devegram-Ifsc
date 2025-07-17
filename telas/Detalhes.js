import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // para o ícone de seta voltar
import { useNavigation } from '@react-navigation/native';
import styles from '../estilo/estiloDetalhes';

export default function Detalhes({ route }) {
    const { foto } = route.params;
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Botão de voltar */}
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <FontAwesome name="arrow-left" size={24} color="#333" />
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>

            <Image
                source={{ uri: foto.src.large }}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={styles.infoContainer}>
                <Text style={styles.photographer}>📸 {foto.photographer}</Text>
                <Text style={styles.description}>
                    {foto.alt || 'Sem descrição disponível.'}
                </Text>
            </View>
        </ScrollView>
    );
}
