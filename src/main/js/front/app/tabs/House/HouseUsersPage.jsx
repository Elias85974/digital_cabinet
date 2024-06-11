import React, { useState, useEffect } from 'react';
import {View, Text, Button, FlatList, TextInput, StyleSheet, ScrollView, Pressable} from 'react-native';
import axios from 'axios';
import {getUserHouses, getUserIdByEmail, getUsersOfAHouse, inviteUser} from "../../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused} from "@react-navigation/native";
import {AuthContext} from "../../context/AuthContext";
import LogoutButton from "../Contents/LogoutButton";
import GoBackButton from "../Contents/GoBackButton";

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
export default function HouseUsersPage({ navigation }) {
    const {userToken, email} = React.useContext(AuthContext)
    const [house, setHouse] = useState(null);
    const [users, setUsers] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const isFocused = useIsFocused();

    const houseId = AsyncStorage.getItem('houseId');
    //const [houseId, setHouseId] = useState('');


    useEffect(() => {
        if (isFocused) {
            getUsersFromHouse().then(r => console.log("Users loaded")).catch(e => console.log("Error loading users"));
        }
    },[isFocused]);

    const getUsersFromHouse = async () => {
        try {
            const houseUsers = await getUsersOfAHouse(houseId);
            console.log("House users:", houseUsers);
            setUsers(houseUsers);

        } catch (error) {
            console.log("Error getting users:", error);
        }
    }

    /*    useEffect(() => {
            if (isFocused) {
                console.log("IM HERE, PLIS");
                getHouseUsers().then(r => console.log("Users loaded")).catch(e => console.log("Error loading users"));
            }
       , [ isFocused ]);
    /*
        const getHouseUsers = async () => {
            try {
                const houseId = await AsyncStorage.getItem('houseId');
                const userId = await AsyncStorage.getItem('userId');
                console.log("what the hell");
                const houseUsers = await getUserHouses();
                console.log("is going on?");

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
        */

    // Envío invitación a usuarios para mi casa
    const handleInvite = async () => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const houseId = await AsyncStorage.getItem('houseId');
        const userId = await AsyncStorage.getItem('userId');

        // Check if the email is valid
        if (emailRegex.test(inviteEmail)) {
            // If the email is valid, call the inviteUser function
            console.log("am i calling the invite method?");
            await inviteUser({invitingUser: userId, invitedUser: inviteEmail, houseId: houseId});
            alert("The invitation was sent");
            setInviteEmail('');
        } else {
            // If the email is not valid, show an alert
            alert('Please enter a valid email.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Digital Cabinet</Text>
                <View style={styles.logInCont}>
                    {house ? <Text> Value = {house.nombre}</Text> : <Text>Loading...</Text>}
                    <View style={styles.container2}>
                        {users.map((user, index) => (
                            <View key={index} style={styles.circle}>
                                <Pressable>
                                    <Text style={styles.circleText}>{user.name}</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                </View>
                <p></p>
                <View style={styles.linksContainer}>
                    <Pressable onPress={() => navigation.navigate("HouseUsersPageDelete")}>
                        <Text style={styles.link}>Delete a user</Text>
                    </Pressable>

                    <TextInput style={styles.input}
                               placeholder="Mail"
                               value={inviteEmail} // Use the mail state variable here
                               onChangeText={(value) => setInviteEmail(value)} // Update the mail state when the text input changes
                    />
                    <Pressable style={styles.link} onPress={async() => await handleInvite()}>
                        <Text style={{color: 'white', fontSize: 16}}>Invite a user</Text>
                    </Pressable>

                    <GoBackButton navigation={navigation}/> {/* Add the GoBackButton component */}
                    <LogoutButton navigation={navigation}/> {/* Add the LogoutButton component */}

                </View>
            </ScrollView>
        </View>
    );

};


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
    }
});