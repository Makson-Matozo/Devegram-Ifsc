// estilo/estiloDetalhes.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#121212',
        flexGrow: 1,
    },
    image: {
        width: '100%',
        height: 350,
        borderRadius: 16,
        marginBottom: 20,
        backgroundColor: '#222',
    },
    infoContainer: {
        marginBottom: 25,
    },
    photographer: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        color: '#f0f0f0',
    },
    description: {
        fontSize: 16,
        color: '#bbb',
        fontStyle: 'italic',
    },

    // Estilos do botão de voltar
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#f0f0f0',
        marginLeft: 8,
    },
});
