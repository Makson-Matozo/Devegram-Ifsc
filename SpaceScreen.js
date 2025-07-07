// SpaceScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SpaceScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login'); 
        }, 3000); // 3000 ms = 3 segundos

        return () => clearTimeout(timer); 
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bem-vindo ao App!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
});
