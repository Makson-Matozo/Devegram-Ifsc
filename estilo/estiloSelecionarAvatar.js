// estilo/estiloSelecionarAvatar.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#fff',
    },
    categorias: {
        paddingBottom: 10,
    },
    botaoCategoria: {
        backgroundColor: '#1c1c1e',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 25,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#444',
    },
    categoriaAtiva: {
        backgroundColor: '#00BFFF',
        borderColor: '#00BFFF',
    },
    textoCategoria: {
        fontSize: 15,
        color: '#aaa',
    },
    textoCategoriaAtiva: {
        color: '#fff',
        fontWeight: 'bold',
    },
    subtitulo: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        color: '#fff',
    },
    categoriaSelecionada: {
        color: '#00BFFF',
        fontWeight: 'bold',
    },
    listaAvatares: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#00BFFF',
        backgroundColor: '#1c1c1e',
        shadowColor: '#00BFFF',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 6,
    },
});
