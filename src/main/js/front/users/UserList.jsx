import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, TextInput, Button, useWindowDimensions} from 'react-native';
import { listUsers, createUser, getHelloWorld, getWebV1 } from '../Api';
import HTML from 'react-native-render-html';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({email: '', lastName: ''});
    const [HelloWorld, setHelloWorld] = useState('');
    const [webV1, setWebV1] = useState('');
    const windowWidth = useWindowDimensions().width;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await listUsers();
                setUsers(usersData);
            } catch (error) {
                console.log("Error fetching users:", error);
            }
        };

        const fetchHelloWorld = async () => {
            try {
                const helloWorldData = await getHelloWorld();
                setHelloWorld(helloWorldData);
            } catch (error) {
                console.log("Error fetching hello world:", error);
            }
        };

        const fetchWebV1 = async () => {
            try {
                const webV1Data = await getWebV1();
                setWebV1(webV1Data);
            } catch (error) {
                console.log("Error fetching web v1:", error);
            }
        };

        fetchUsers();
        fetchHelloWorld();
        fetchWebV1();
    }, []);

    const handleInputChange = (field, value) => {
        setNewUser({...newUser, [field]: value});
    };

    const handleCreateUser = async () => {
        try {
            const createdUser = await createUser(newUser); // Use saveUser instead of createUser
            setUsers([...users, createdUser]);
            setNewUser({email: '', lastName: ''});
        } catch (error) {
            console.log("Error creating user:", error);
        }
    };

    return (
        <ScrollView style={{ marginTop: 20 }}>
            <View style={{
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderColor: '#ddd',
                paddingBottom: 10,
                marginBottom: 10
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    flex: 1,
                    textAlign: 'center'
                }}>Email</Text>
                <Text style={{
                    fontWeight: 'bold',
                    flex: 1,
                    textAlign: 'center'
                }}>Last Name</Text>
            </View>
            {users.map((user) => (
                <View key={user.id} style={{
                    flexDirection: 'row',
                    paddingBottom: 10,
                    marginBottom: 10,
                    borderBottomWidth: 1,
                    borderColor: '#eee'
                }}>
                    <Text style={{
                        flex: 1,
                        textAlign: 'center'
                    }}>{user.email}</Text>
                    <Text style={{
                        flex: 1,
                        textAlign: 'center'
                    }}>{user.lastName}</Text>
                </View>
            ))}
            <View>
                <TextInput
                    placeholder="Email"
                    value={newUser.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                />
                <TextInput
                    placeholder="LastName"
                    value={newUser.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                />
                <Button title="Create User" onPress={handleCreateUser} />
            </View>
            <View>
                <Text>{HelloWorld}</Text>
                <HTML source={{ html: webV1 }} contentWidth={windowWidth}/>
            </View>
        </ScrollView>
    );
};

export default UsersList;