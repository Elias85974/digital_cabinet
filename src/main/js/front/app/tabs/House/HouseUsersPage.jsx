import React, { useState, useEffect } from 'react';
import {View, Text, Button, FlatList, TextInput, StyleSheet, ScrollView, Pressable, SafeAreaView} from 'react-native';
import axios from 'axios';
import {getUserHouses, getUserIdByEmail, inviteUser} from "../../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused} from "@react-navigation/native";
import {AuthContext} from "../../context/AuthContext";
import LogoutButton from "../NavBar/LogoutButton";
import GoBackButton from "../NavBar/GoBackButton";
import Tuple from "../Contents/Tuple";
import ModalAlert from "../Contents/ModalAlert";
import NavBar from "../NavBar/NavBar";

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
const HouseUsersPage = ({ navigation }) => {
    const {userToken, email} = React.useContext(AuthContext)
    const [house, setHouse] = useState(null);
    const [users, setUsers] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const isFocused = useIsFocused();

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal


    // Envío invitación a usuarios para mi casa
    const handleInvite = async () => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const houseId = await AsyncStorage.getItem('houseId');
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('userToken');

        // Check if the email is valid
        if (emailRegex.test(inviteEmail)) {
            // If the email is valid, check if the user exists
            try {
                const invitedUserId = await getUserIdByEmail(token, inviteEmail);
                if (invitedUserId) {
                    // If the user exists, call the inviteUser function
                    await inviteUser({invitingUser: userId, invitedUser: inviteEmail, houseId: houseId});
                    setModalMessage("The invitation was sent"); // Muestra el modal en lugar de un alert
                    setModalVisible(true);

                    setInviteEmail('');
                } else {
                    // If the user does not exist, show an alert
                    setModalMessage("User does not exist."); // Muestra el modal en lugar de un alert
                    setModalVisible(true);

                }
            } catch (error) {
                // Handle the error from getUserIdByEmail
                alert('An error occurred while checking if the user exists :(');
            }
        } else {
            // If the email is not valid, show an alert
            setModalMessage("Please enter a valid email."); // Muestra el modal en lugar de un alert
            setModalVisible(true);

        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)}/>
                <Text style={styles.title}>Digital Cabinet</Text>
                <View style={styles.addUser}>
                    <TextInput style={styles.input}
                               placeholder="Mail"
                               value={inviteEmail} // Use the mail state variable here
                               onChangeText={(value) => setInviteEmail(value)} // Update the mail state when the text input changes
                    />
                    <Pressable style={styles.link} onPress={async () => await handleInvite()}>
                        <Text style={{color: 'white', fontSize: 16}}>Invite a user</Text>
                    </Pressable>
                </View>
                <p></p>
                <View style={styles.deleteUsers}>
                    <Pressable style={{alignSelf:'center'}} onPress={() => navigation.navigate("HouseUsersPageDelete")}>
                        <Text style={styles.linkdel}>Delete a user</Text>
                    </Pressable>
                </View>
                <p></p>
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation}/>

        </View>
    );

};

export default HouseUsersPage;

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
    createprod: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    },
    picker:{
        width: '20%',
        alignSelf: 'center',
        height: 20,
        backgroundColor: '#717336',
        borderColor: '#5d5e24',
        borderWidth: 2,
    },
    addUser: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 300,
        alignSelf: 'center',
    },
    deleteUsers: {
        backgroundColor: '#4B5940',
        borderRadius: 20,
        width: 150,
        height: 70,
        alignSelf: 'center',
        alignItems: 'center',
    },
    linkdel: {
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
});