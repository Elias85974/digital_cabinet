import React, {useEffect, useState} from 'react';
import {FlatList, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
import {Link, router} from "expo-router";
import {Picker} from "react-native-web";
import {authentication, getUserHouses, getUserIdByEmail} from "../Api";

export default function Homes() {
    const [house, setHouse] = useState({nombre: '', direccion: ''});
    //const [role, setRole] = useState(false);
    const [houses, setHouses] = useState([]);

    useEffect(() => {
    const fetchHouses = async () => {
        const houses = await getAllHouses();
        setHouses(houses);
    };
    fetchHouses()
        .catch(error => {
            console.error("Failed to fetch houses:", error);
        });
}, []);

    const renderHouse = ({ item }) => (
        <View style={styles.circle}>
            <Text style={styles.circleText}>{item.nombre}</Text>
        </View>
    );

    const movePage = async (url) => {
        try {
            if (await authentication() === true) {
                router.replace(url);
            }
            else {
                alert("You must be logged in to access this page. Going back to LoginPage");
                router.replace("LoginPage");
            }
        }
        catch (error) {
            console.log("Error moving to login page:", error);
        }
    }
    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 20}} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Digital Cabinet</Text>
                    <View style={styles.logInCont}>
                        <Text style={styles.info}>Select a home</Text>
                        <View style={styles.container2}>
                            <FlatList
                                data={houses}
                                renderItem={renderHouse}
                                keyExtractor={item => item.casa_ID}
                            />
                        </View>
                    </View>
                    <p></p>
                    <View style={styles.linksContainer}>
                        <Pressable>
                            <Link href={"/RegisterHome"} style={styles.link}>Create a home</Link>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
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

    container2: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    circle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#4B5940',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    circleText: {
        color: 'white',
        fontSize: 16,
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
    }
});