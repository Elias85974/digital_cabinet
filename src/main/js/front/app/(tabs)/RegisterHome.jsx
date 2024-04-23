import React, {useState} from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
import {Link, Redirect, router} from "expo-router";
import {authentication, createHouse} from "../Api";

export default function Homes() {
    let [newHouse, setNewHouse] = useState({nombre: '', direccion: ''});
    // no quiere funcionar con redirect ni router --> const [houseCreated, setHouseCreated] = useState(false);
    const [role, setRole] = useState(false);

    const isDirection = (direccion) =>
        /^[A-Z0-9.]+\s+[0-9]+$/i.test(direccion);

    const handleInputChange = (field, value) => {
        setNewHouse({...newHouse, [field]: value});
    };

    const handleCreateHome = async () => {
        try {
            if (newHouse.nombre && newHouse.direccion) {
                if (!isDirection(newHouse.direccion)) {
                    alert("Incorrect house format. Please try again.")
                } else {
                    await createHouse(newHouse);
                    //router.replace("Homes");  //probar despues con esto aca
                }
            }
            else {
                alert("Please fill in all fields.")
            }
            //setNewHouse({nombre: '', direccion: ''}); no se xq ponerlo aca no funciona pero si lo pongo en el finally si
        } catch (error) {
            console.log("Error creating house:", error);
        } finally {
            setNewHouse({nombre: '', direccion: ''});
        }
    };


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
                            <Link href={"/Homes"} style={{color: 'white', fontSize: 16}} >Create House</Link>
                        </Pressable>
                    </View>
                    <p></p>
                    <View style={styles.linksContainer}>
                        <Pressable style={styles.link}>
                            <Link href={"/Homes"} style={{color: 'white'}}>Select a house</Link>
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