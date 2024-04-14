import React, {useState } from 'react';
import {View, ScrollView, TextInput, Button, Pressable, StyleSheet, Text} from 'react-native';
import {createUser} from '../Api';
import {Link} from "expo-router";

export default function RegisterPage() {
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
        <View style={styles.container}>
            <ScrollView style={{marginTop: 20}}>
                <View>
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={styles.info}>Please fill in all fields to create your user</Text>
                    <TextInput style={styles.input}
                        placeholder="Email"
                        value={newUser.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                    />
                    <TextInput style={styles.input}
                        placeholder="FirstName"
                        value={newUser.firstName}
                        onChangeText={(value) => handleInputChange('firstName', value)}
                    />
                    <TextInput style={styles.input}
                        placeholder="LastName"
                        value={newUser.lastName}
                        onChangeText={(value) => handleInputChange('lastName', value)}
                    />
                    <TextInput style={styles.input}
                        secureTextEntry={true}
                        placeholder="Password"
                        value={newUser.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                    />
                    <p></p>
                    <Button title="Create User" onPress={handleCreateUser}/>
                    <p></p>
                    <Pressable style={styles.link}>
                        <Link href={"/LoginPage"}>Sign in</Link>
                    </Pressable>
                    <Pressable style={styles.link}>
                        <Link href={"/"}>Go back</Link>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#2fb2e8',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        color: 'white',
        backgroundColor: '#561dbd',
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
        color: '#333',
        fontFamily: 'Georgia, serif',
        lineHeight: 30,
    },
    info: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
        color: '#333',
        lineHeight: 30,
    }
});