import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e1a22',
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 25,
        letterSpacing: 4,
        textShadowColor: 'rgba(255, 255, 255, 0.7)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 8,
        fontFamily: 'Arial Black',
    },

});