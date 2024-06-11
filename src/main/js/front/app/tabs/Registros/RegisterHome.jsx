import React, {useState} from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
import {createHouse, getUserIdByEmail} from "../../Api";
import {AuthContext} from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterHome({navigation}) {
    let [newHouse, setNewHouse] = useState({nombre: '', direccion: ''});
    const {userToken, email} = React.useContext(AuthContext)

    const isDirection = (direccion) =>
        /^[A-Z0-9.]+\s+[A-Z0-9.]+\s+[0-9]+$/i.test(direccion);
    //!! chequear mas de 1 palabra como se hace!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11

    const handleInputChange = (field, value) => {
        setNewHouse({...newHouse, [field]: value});
    };

    const handleCreateHome = async () => {
        try {
            if (newHouse.nombre && newHouse.direccion) {
                if (!isDirection(newHouse.direccion)) {
                    alert("Incorrect house format. Please try again.")
                } else {
                    const userId = await getUserIdByEmail(userToken,email);
                    await createHouse(newHouse, userId);
                    alert("House created successfully!");
                    setNewHouse(prevState => ({...prevState, nombre: '', direccion: ''}));
                    navigation.navigate('Homes');

                }
            }
            else {
                alert("Please fill in all fields.")
            }
        } catch (error) {
            console.log("Error creating house:", error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Homes</Text>
                    <View style={styles.signInCont}>
                        <Text style={styles.info}>Please fill in all fields to create your house</Text>
                        <TextInput style={styles.input}
                                   placeholder="Nombre"
                                   value={newHouse.nombre}
                                   onChangeText={(value) => handleInputChange('nombre', value)}
                        />
                        <TextInput style={styles.input}
                                   placeholder="Dirección"
                                   value={newHouse.direccion}
                                   onChangeText={(value) => handleInputChange('direccion', value)}
                        />
                        <Pressable style={styles.link} onPress={handleCreateHome}>
                            <Text style={{color: 'white', fontSize: 16}} >Create House</Text>
                        </Pressable>
                    </View>
                    <p></p>
                    <View style={styles.linksContainer}>
                        <Pressable onPress={() => navigation.navigate("Homes")}
                        style={styles.link}>
                            <Text style={{color: 'white', fontSize: 16}}>Select a house</Text>
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
});