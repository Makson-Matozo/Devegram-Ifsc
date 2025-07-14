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
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: '#1f1f1f',
    },
    buttonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#ccc',
        fontWeight: '600',
    },
    commentsSection: {
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 16,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#eee',
    },
    noComments: {
        fontStyle: 'italic',
        color: '#777',
    },
    comentarioContainer: {
        marginBottom: 14,
    },
    comentarioAutor: {
        fontWeight: '700',
        color: '#ddd',
        marginBottom: 2,
    },
    comentarioTexto: {
        color: '#bbb',
        lineHeight: 20,
    },
});
