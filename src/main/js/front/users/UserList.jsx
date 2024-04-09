import React, {useState } from 'react';
import {View, ScrollView, TextInput, Button} from 'react-native';
import {createUser} from '../Api';

const UsersList = () => {
    let [newUser, setNewUser] = useState({email: '', firstName: '', lastName: '', password: ''});

    const isEmail = (email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(email);

    const handleInputChange = (field, value) => {
        setNewUser({...newUser, [field]: value});
    };

    const handleCreateUser = async () => {
        try {
            if (newUser.email && newUser.firstName && newUser.lastName && newUser.password) {
                if (!isEmail(newUser.email)) {
                    alert("Incorrect email format. Please try again.")
                } else {
                    createUser(newUser);
                }
            }
            else {
                alert("Please fill in all fields.")
            }
            setNewUser({email: '', firstName: '', lastName: '', password: ''});
        } catch (error) {
            console.log("Error creating user:", error);
        }
    };

    return (
        <ScrollView style={{ marginTop: 20 }}>
            <View>
                <TextInput
                    placeholder="Email"
                    value={newUser.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                />
                <TextInput
                    placeholder="FirstName"
                    value={newUser.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                />
                <TextInput
                    placeholder="LastName"
                    value={newUser.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                />
                <TextInput
                    secureTextEntry={true}
                    placeholder="Password"
                    value={newUser.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                />
                <Button title="Create User" onPress={handleCreateUser} />
            </View>
        </ScrollView>
    );
};

export default UsersList;