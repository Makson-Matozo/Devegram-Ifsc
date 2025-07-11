import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a', // preto mais profundo
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    innerContainer: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },

    logo: {
        width: 220,
        height: 220,
        resizeMode: 'contain',
        marginBottom: 10,
    },

    titulo: {
        color: '#00BFFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 25,
        fontFamily: 'monospace',
        textShadowColor: '#003366',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
        textAlign: 'center',
    },

    input: {
        width: '100%',
        height: 50,
        borderWidth: 1.5,
        borderColor: '#00BFFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontSize: 16,
        shadowColor: '#00BFFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
    },

    linkEsqueceu: {
        color: '#00BFFF',
        alignSelf: 'flex-end',
        marginBottom: 25,
        textDecorationLine: 'underline',
        fontSize: 14,
    },

    botao: {
        width: '100%',
        height: 50,
        backgroundColor: '#00BFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 8,
        shadowColor: '#00BFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
    },

    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },

    registroTexto: {
        color: '#bbb',
        marginTop: 10,
        fontSize: 14,
    },

    linkRegistro: {
        color: '#00BFFF',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        fontSize: 15,
    },
});
