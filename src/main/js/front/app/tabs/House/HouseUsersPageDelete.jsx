import React, { useState, useEffect } from 'react';
import {View, Text, Button, FlatList, TextInput, StyleSheet, ScrollView, Pressable, SafeAreaView} from 'react-native';
import axios from 'axios';
import {deleteUserFromHouse, getUsersOfAHouse} from "../../controller/HouseController";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused} from "@react-navigation/native";
import {AuthContext} from "../../context/AuthContext";
import LogoutButton from "../Contents/LogoutButton";
import GoBackButton from "../Contents/GoBackButton";
import Tuple from "../Contents/Tuple";
import ModalAlert from "../Contents/ModalAlert";

// User Component
const User = ({ user, onEdit, onDelete }) => (
    <View>
        <Text>{user.nombre}</Text>
        <Text>{user.mail}</Text>
        <Button title="Edit" onPress={() => onEdit(user)} />
        <Button title="Delete" onPress={() => onDelete(user.usuario_ID)} />
    </View>
);

// HouseUsersPage Component
const HouseUsersPageDelete = ({ navigation }) => {
    const {userToken, email} = React.useContext(AuthContext)
    const [house, setHouse] = useState(null);
    const [users, setUsers] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const isFocused = useIsFocused();
    const userId = AsyncStorage.getItem('userId');

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal


    useEffect(() => {
        if (isFocused) {
            getHouseUsers().then(r => console.log("Users loaded")).catch(e => console.log("Error loading users"));

        }
    }, [ isFocused ]);

    const getHouseUsers = async () => {
        try {
            const houseId = await AsyncStorage.getItem('houseId');
            const userId = await AsyncStorage.getItem('userId');
            const houseUsers = await getUsersOfAHouse(houseId, userId);
            if (Array.isArray(houseUsers)) {
                setUsers(houseUsers);
            } else {
                console.error('getHouseUsers did not return an array:', houseUsers);
                setUsers([]);
            }
        } catch (error) {
            console.log("Error getting users:", error);
            setUsers([]);
        }
    }
    //idem para esto
    const handleDelete = async (userId) => {
        // Make a DELETE request to delete the user
        const houseId = await AsyncStorage.getItem('houseId');
        const currentUserId = await AsyncStorage.getItem('userId'); // Obtén el userId del usuario actual

        await deleteUserFromHouse(houseId, userId);
        setModalMessage("User deleted successfully"); // Muestra el modal en lugar de un alert
        setModalVisible(true);
        setTimeout(() => {
            setModalVisible(false);
            // Si el usuario eliminado es el usuario actual, navega a la página de Homes
            if (userId === currentUserId) {
                navigation.navigate('Homes');
            }
        }, 2500);

        // Update the users list
        await getHouseUsers();
    };
    return (
    <View style={styles.container}>
        <SafeAreaView style={StyleSheet.absoluteFill}>
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
            <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />

            <Text style={styles.title}>Digital Cabinet</Text>
            <View style={styles.signInCont}>
                <Text style={styles.info}>Press a user to delete it.</Text>
                <View style={styles.logInCont}>
                    <View style={styles.container2}>
                        {users.map((user, index) => (
                            <View key={index} style={styles.circle}>
                                <Pressable style={styles.pressableSquare} onPress={ async () => {
                                    await handleDelete(user.userId); // Call handleDelete with userId
                                }}>
                                    <Text style={styles.circleText}>{user.username}</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <p></p>
            <Tuple navigation={navigation}/>
            </ScrollView>
        </SafeAreaView>
    </View>
    );

};

export default HouseUsersPageDelete;

const styles = StyleSheet.create({
    container: {
        flex: 4,
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container2: {
        flex: 4,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    signInCont: {
        backgroundColor: '#3b0317',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    },
    link: {
        marginTop: 10,
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
        backgroundColor: '#3b0317',
        padding: 20,
        borderRadius: 20,
        width: 300,
        alignSelf: 'center',
    },
    createprod: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
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
});