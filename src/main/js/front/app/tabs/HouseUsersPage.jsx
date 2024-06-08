import React, { useState, useEffect } from 'react';
import {View, Text, Button, FlatList, TextInput, StyleSheet} from 'react-native';
import axios from 'axios';
import {getUserHouses} from "../Api";

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
    const { house } = route.params;
    const [users, setUsers] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        // Fetch users from API and setUsers
        // Assume fetchUsers is a function that fetches users data from an API
        const fetchedUsers = getUserHouses();
        setUsers(fetchedUsers);
    }, [house]);

    //esto creo que debe estar en el application pero de momento lo hago acá
    const handleEdit = (user) => {
        // Make a PUT request to update the user
        axios.put(`/api/users/${user.usuario_ID}`, user)
            .then(response => {
                // Handle successful response
                console.log('User updated:', response.data);
            })
            .catch(error => {
                // Handle error
                console.error('Error updating user:', error);
            });
    };

    //idem para esto
    const handleDelete = (userId) => {
        // Make a DELETE request to delete the user
        axios.delete(`/api/users/${userId}`)
            .then(response => {
                // Handle successful response
                console.log('User deleted:', response.data);
            })
            .catch(error => {
                // Handle error
                console.error('Error deleting user:', error);
            });
    };

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
        <View>
            <Text>{house.nombre}</Text>
            <FlatList
                data={users}
                keyExtractor={item => item.usuario_ID.toString()}
                renderItem={({ item }) => (
                    <User user={item} onEdit={handleEdit} onDelete={handleDelete} />
                )}
            />
            <Button title="Add User" onPress={() => {/* Handle add user */}} />
            <TextInput
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="Enter email to invite"
            />
            <Button title="Invite User" onPress={handleInvite} />
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