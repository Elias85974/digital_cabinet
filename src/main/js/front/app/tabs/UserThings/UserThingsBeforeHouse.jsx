import React from 'react';
import {View, Text, Pressable, StyleSheet, ScrollView, SafeAreaView} from "react-native";
import LogoutButton from "../Contents/LogoutButton";

export default function UserThingsBeforeHouse({navigation}) {
    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Digital Cabinet</Text>
                    <View style={styles.logInCont}>
                        <Text style={styles.info}>Choose your preference</Text>
                        <View style={styles.linksContainer}>
                            <Pressable onPress={() => navigation.navigate("WishList")}>
                                <Text style={styles.link}>See your WishList! :)</Text>
                            </Pressable>
                        </View>
                        <View style={styles.linksContainer}>
                            <Pressable onPress={() => navigation.navigate("Inbox")}>
                                <Text style={styles.link}>See your Inbox!</Text>
                            </Pressable>
                        </View>
                        <View style={styles.linksContainer}>
                            <Pressable onPress={() => navigation.navigate("Homes")}>
                                <Text style={styles.link}>Manage your houses!</Text>
                            </Pressable>
                        </View>
                    </View>
                    <LogoutButton navigation={navigation}/>
                </View>
            </ScrollView>
            </SafeAreaView>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#BFAC9B',
        padding: 20,
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
    }
});
