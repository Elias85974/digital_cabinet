import React, {useState} from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView} from "react-native";
import {HousesApi, UsersApi} from "../../Api";
import {AuthContext} from "../../context/AuthContext";
import ModalAlert from "../Contents/ModalAlert";
import NavBar from "../NavBar/NavBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoBackButton from "../NavBar/GoBackButton";

export default function RegisterHome({navigation}) {
    let [newHouse, setNewHouse] = useState({nombre: '', direccion: ''});
    const {userToken, email} = React.useContext(AuthContext)

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal


    const isDirection = (direccion) =>
        /^[A-Z0-9.]+\s+[A-Z0-9.]+\s+[0-9]+$/i.test(direccion);
    //!! chequear mas de 1 palabra como se hace!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    const handleInputChange = (field, value) => {
        setNewHouse({...newHouse, [field]: capitalizeFirstLetter(value)});
    };

    const handleCreateHome = async () => {
        try {
            if (newHouse.nombre && newHouse.direccion) {
                if (!isDirection(newHouse.direccion)) {
                    setModalMessage("Incorrect house format. Please try again."); // Muestra el modal en lugar de un alert
                    setModalVisible(true);
                } else {
                    const userId = await AsyncStorage.getItem('userId');
                    await HousesApi.createHouse(newHouse, userId);
                    setModalMessage("House created successfully!"); // Muestra el modal en lugar de un alert
                    setModalVisible(true);
                    setNewHouse(prevState => ({...prevState, nombre: '', direccion: ''}));
                    setTimeout(() => {
                        setModalVisible(false);
                        // Navega a la siguiente página después de un retraso
                        navigation.navigate('Homes');
                    }, 5000);

                }
            }
            else {
                setModalMessage("Please fill in all fields."); // Muestra el modal en lugar de un alert
                setModalVisible(true);
            }
        } catch (error) {
            console.log("Error creating house:", error);
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                <View>
                        <GoBackButton navigation={navigation}/>
                        <Text style={styles.title}>Register your Home</Text>
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
                    <View style={styles.linksContainer}>
                        <Pressable onPress={() => navigation.navigate("Homes")}
                        style={styles.link}>
                            <Text style={{color: 'white', fontSize: 16}}>Select a house</Text>
                        </Pressable>
                    </View>
                </View>
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
    signInCont: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    },
});