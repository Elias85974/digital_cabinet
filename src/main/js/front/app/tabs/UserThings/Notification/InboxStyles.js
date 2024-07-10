import {StyleSheet} from "react-native";

export const inboxStyles = StyleSheet.create({
    // ... other styles
    emptyInbox: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10, // adjust this to control the roundness of the corners
        backgroundColor: '#4B5940', // or any color you want
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    link: {
        marginTop: 15,
        marginBottom: 10,
        color: '#F2EFE9',
        textDecorationLine: 'underline',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3, // Add border
        borderColor: '#717336', // Set border color
        padding: 10, // Add some padding so the text isn't right up against the border
        backgroundColor: '#717336', // Set background color
        width: 200, // Set width
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 100,
        fontSize: 16,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        color: 'white',
        backgroundColor: '#4B5940',
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
    },
    info: {
        fontSize: 25,
        fontFamily: 'lucida grande',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        color: '#BFAC9B',
        lineHeight: 30,
    },
    linksContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    contentWishList: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: '100%',
        alignSelf: 'center',
    },


    card: {
        flexDirection: 'row',
        backgroundColor: '#f2f3f7',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    statusInd: {
        width: 10,
        height: 10,
        backgroundColor: '#ff0000',
        borderRadius: 5,
        marginRight: 10,
    },
    right: {
        flex: 1,
    },
    textWrap: {
        flexDirection: 'column',
    },
    textContent: {
        color: '#333',
    },
    textLink: {
        fontWeight: 'bold',
    },
    time: {
        color: '#777',
    },
    buttonWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        margin: 8,

    },
    primaryCta: {
        backgroundColor: 'transparent',
        borderRadius: 15,
    },
    secondaryCta: {
        backgroundColor: 'transparent',
        borderRadius: 15,
    },
    buttonText: {
        fontSize: 15,
        color: '#fff',
        margin: 8,
    },

    typesContainer:{
        color: 'white',
        textAlign: 'center',
        backgroundColor: '#3b0317',
        padding: 10,
        borderRadius: 100,
        alignItems: 'center',
        margin: 5,
    }
});