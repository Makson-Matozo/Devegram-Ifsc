// estilo/estiloPesquisa.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#0b1220', // preto azulado escuro
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#122a54', // azul escuro
        borderRadius: 10,
        paddingHorizontal: 14,
        height: 46,
        fontSize: 16,
        color: '#cbd6f7', // azul claro para texto
    },
    button: {
        backgroundColor: '#3b5bfd', // azul vibrante
        paddingHorizontal: 16,
        marginLeft: 8,
        height: 46,
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonDisabled: {
        backgroundColor: '#6379cc', // azul apagado
    },
    buttonText: {
        color: '#e6e9ff', // quase branco azulado
        fontWeight: '700',
        fontSize: 15,
    },
    clearButton: {
        marginLeft: 8,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historicoContainer: {
        marginBottom: 12,
    },
    historicoTitulo: {
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 6,
        color: '#a3b0ff',
    },
    historicoItem: {
        backgroundColor: '#1d2d7a',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 7,
        marginRight: 8,
    },
    historicoTexto: {
        fontSize: 14,
        color: '#d0dbff',
    },
    card: {
        flex: 1,
        margin: 6,
        height: 160,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#122a54',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    errorText: {
        color: '#ff6b6b',
        textAlign: 'center',
        marginTop: 20,
        fontWeight: '700',
    },
    emptyText: {
        textAlign: 'center',
        color: '#7f8aff',
        fontSize: 16,
        marginTop: 60,
        paddingHorizontal: 20,
    },
});
