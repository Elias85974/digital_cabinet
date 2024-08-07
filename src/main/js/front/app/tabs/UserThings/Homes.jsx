import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet, ScrollView, SafeAreaView} from "react-native";
import {UsersApi} from "../../Api";
import {AuthContext} from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused} from "@react-navigation/native";
import NavBar from "../NavBar/NavBar";
import GoBackButton from "../NavBar/GoBackButton";
import LogoutButton from "../NavBar/LogoutButton";

export default function Homes({navigation}) {
    const {userToken, email} = React.useContext(AuthContext)
    const [houses, setHouses] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused){
            getHouses();
        }
    }, [isFocused]);

    const getHouses = async () => {
        try {
            const userHouses = await UsersApi.getUserHouses(navigation);

            setHouses(userHouses);
        } catch (error) {
            console.log("Error getting houses:", error);
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Select your home</Text>
                    <View style={styles.logInCont}>
                        <View style={styles.container2}>
                            {houses.map((house, index) => (
                                <View key={index} style={styles.circle}>
                                    <Pressable onPress={async () => {
                                        // Obtener el houseId de AsyncStorage
                                        await AsyncStorage.setItem('houseId', house.houseId.toString());
                                        await AsyncStorage.setItem('houseName', house.name.toString());
                                        // Navegar a la página House con el houseId correcto
                                        navigation.navigate("House");
                                    }}>
                                        <Text style={styles.circleText}>{house.name}</Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={{marginTop: 20}}>
                    </View>
                    <View style={styles.linksContainer}>
                        <Pressable onPress={() => navigation.navigate("RegisterHome")}>
                            <Text style={styles.link}>Create a Home</Text>
                        </Pressable>
                    </View>
                    <LogoutButton navigation={navigation}/>
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container2: {
        width: '90%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    circle: {
        paddingVertical: 10, // Controla el tamaño vertical del círculo
        paddingHorizontal: 20, // Controla el tamaño horizontal del círculo
        borderRadius: 35,
        backgroundColor: '#BFAC9B',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    circleText: {
        color: 'white',
        fontSize: 25,
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
        width: '90%',
        alignSelf: 'center',
    }
});
