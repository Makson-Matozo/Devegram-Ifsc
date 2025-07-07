import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    titulo: {
        color: "black",
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    Welcome: {
        color: "black",
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    linkEsqueceu: {
        color: '#4169e1',
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    botao: {
        width: '100%',
        height: 45,
        backgroundColor: '#2d3d4f',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    botaoSair: {
        width: '100%',
        height: 45,
        backgroundColor: '#FF0000',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
    },
    registroTexto: {
        color: 'black',
    },
    linkRegistro: {
        color: '#4169e1',
    },
    card: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    },
    usuario: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5
    }
});
