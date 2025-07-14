import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { Video } from 'expo-av';
import styles from "../estilo/SplashEstilo.js";
import { LinearGradient } from 'expo-linear-gradient';

const SPLASH_DURATION = 5450;

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, SPLASH_DURATION);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            <Video
                source={require('../assets/splash-video.mp4')}
                rate={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={styles.backgroundVideo}
            />

            <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(22, 14, 34, 0.8)']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <View style={styles.overlay}>
                <Text style={styles.title}>Devegram</Text>
                <ActivityIndicator size="large" color="#dbe7ec" />
            </View>
        </View>
    );
}