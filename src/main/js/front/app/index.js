// src/main/js/front/app/index.js
import React from 'react';
import {Pressable, StyleSheet, View, Image, Text} from "react-native";


export default function index({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Digital Cabinet</Text>
            <Image
                style={styles.image}
                source={require('../assets/favicon.png')}
                resizeMode="contain"
            />
            <View style={styles.linksContainer}>
                <Pressable style={styles.link} onPress={() => navigation.navigate("LoginPage")}>
                        <Text style={styles.linkText}>Log In</Text>
                </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginTop: 30,
        marginBottom: 50,
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
        color: '#F2EFE9',
        lineHeight: 30,
    },
    linksContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    logInCont: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 300,
        alignSelf: 'center',
    },
    linkText: {
        color: '#F2EFE9',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
});