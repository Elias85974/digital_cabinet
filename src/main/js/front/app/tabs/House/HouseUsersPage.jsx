import React, { useState, useEffect } from 'react';
import {View, Text, Button, FlatList, TextInput, StyleSheet, ScrollView, Pressable} from 'react-native';
import axios from 'axios';
import {getUserHouses, getUserIdByEmail, inviteUser} from "../../Api";
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
const HouseUsersPage = ({ route }) => {
    const {userToken, email} = React.useContext(AuthContext)

    const [house, setHouse] = useState(null);
    const [users, setUsers] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const isFocused = useIsFocused();
    const userId = AsyncStorage.getItem('userId');
    //const houseId = AsyncStorage.getItem('houseId');
    const [houseId, setHouseId] = useState(null);

    useEffect(() => {
        const fetchHouseId = async () => {
            const id = await AsyncStorage.getItem('houseId');
            setHouseId(id);
        };

        fetchHouseId();
    }, []);

    useEffect(() => {
        if (isFocused){
            getUserHouses();
        }
    }, [isFocused]);

    const getUserHouses = async () => {
        try {
            const userId = await getUserIdByEmail(userToken, email);
            const userHouses = await getUserHouses(userId);

            setUsers(userHouses);
        } catch (error) {
            console.log("Error getting users:", error);
        }
    }

    //envío invitación a usuarios para mi casa
    const handleInvite = () => {
        // Handle invite user
        axios.post('/api/invitations', { email: inviteEmail })
            .then(response => {
                // Handle successful response
                console.log('Invitation sent:', response.data);
            })
            .catch(error => {
                // Handle error
                console.error('Error sending invitation:', error);
            });
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
                                <Pressable onPress={ () => {
                                    navigation.navigate("House");
                                }}>
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
                    <Pressable onPress={() => navigation.navigate("HouseUsersPageEdit")}>
                        <Text style={styles.link}>Edit a user</Text>
                    </Pressable>
                    <TextInput style={styles.input}
                               placeholder="Mail"
                               value={users.mail}
                               onChangeText={(value) => inviteUser(value, houseId)}
                    />
                    <Pressable style={styles.link} onPress={inviteUser}>
                        <Text style={{color: 'white', fontSize: 16}}>Invite a user</Text>
                    </Pressable>

                    <GoBackButton navigation={navigation}/> {/* Add the GoBackButton component */}

                </View>
            </ScrollView>
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
    }
});