import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 776,
        backgroundColor: 'black',
        alignItems: 'center'
    },
    topdash: {
        width: '100%',
        height: 116,
        backgroundColor: '#f8f8f8',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10
    },
    dashtext: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Roboto',
    },
    screentext: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Roboto',
        marginTop: 40
    },
    stopbtn: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '45deg' }],
        backgroundColor: 'rgba(236, 97, 35, 0.88)',
        borderRadius: 16,
        marginBottom: 44,
        marginTop: 'auto'
    },
    stopbtntext: {
        color: 'white',
        fontFamily: 'Roboto',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default styles;