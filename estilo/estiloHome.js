// estilo/estiloHome.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    listContainer: {
        padding: 12,
        backgroundColor: '#0b1220',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D0D0D',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#00CFFF',
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#1C1F39',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.7,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 10,
        borderWidth: 2,
        borderColor: 'white',
    },
    image: {
        width: '100%',
        height: 280,
        borderRadius: 16,
    },
    photographer: {
        marginTop: 14,
        fontWeight: '700',
        fontSize: 18,
        color: '#6EA8FF',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 18,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#1A1A1A',
    },
    buttonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#87AAFF',
        fontWeight: '600',
    },
});
