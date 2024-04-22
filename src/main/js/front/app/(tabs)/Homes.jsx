import {useEffect, useState} from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
import {loginUser} from "../Api";
import {Link} from "expo-router";
import {Picker} from "react-native-web";

export default function Homes() {
    const [homes, setHomes] = useState([]);
    const [newHome, setNewHome] = useState([]);

    useEffect(() => {
        fetchHomes();
    }, []);

    const fetchHomes = async () => {
        const response = await fetch('http://localhost:8080/homes'); //hay q cambiarla por la corresta
        const data = await response.json();
        setHomes(data);
    };

    const createHome = async () => {
        await fetch('http://localhost:8080/homes', {
            method: 'POST',
            body: JSON.stringify({name: newHome}),
        });
        setNewHome('');
        fetchHomes();
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 20}} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Digital Cabinet</Text>
                    <View style={styles.logInCont}>
                        <Text style={styles.info}>Select a home</Text>

                        <Picker>
                            <Text>Create a new home:</Text>
                            <TextInput style={styles.input} value={newHome} onChangeText={setNewHome}/>
                            <Pressable style={styles.link} onPress={createHome}>
                                <Text style={{color: 'white', fontSize: 16}}>Create</Text>
                            </Pressable>
                        </Picker>
                    </View>
                    <p></p>
                    <View style={styles.linksContainer}>
                        <Pressable>
                            <Link href={"/RegisterPage"} style={styles.link}>pronandooooo</Link>
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