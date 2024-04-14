import { useState } from 'react';
import {TextInput, View, Text, Button, Pressable, ScrollView, StyleSheet} from "react-native";
import {loginUser} from "../Api";
import {Link} from "expo-router";

export default function LoginPage() {
    const [user, setUser] = useState({email: '', password: ''});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleInputChange = (field, value) => {
        setUser({...user, [field]: value});
    };

    const handleSubmit = async () => {
        try {
            if (user.email && user.password) {
                const response = await loginUser(user); // Assume loginUser returns a promise
                if (response) { // Boolean indicating success of login
                    setIsLoggedIn(true);
                }
            }
            else {
                alert("Please fill in all fields.")
            }
        } catch (error) {
            console.log("Error logging in user:", error);
            alert("Incorrect email or password. Please try again.")
        }
        finally {
            setUser({email: '', password: ''}); // Reset user state
        }
    }

    // Use isLoggedIn state variable to conditionally render components or navigate to different routes
    if (isLoggedIn) {
        // Navigate to a different route or render a different component
        return (
            <View style={styles.container}>
                <Text style={styles.title}>You are logged in!</Text>
                <Pressable style={styles.link}>
                    <Link href={"/"}>Go to the main Page</Link>
                </Pressable>
            </View>
        );

    } else { return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 20}}>
                <View>
                    <Text style={styles.title}>Sign In</Text>
                    <Text style={styles.info}>Welcome Back</Text>
                    <TextInput style={styles.input}
                               placeholder="Email"
                               value={user.email}
                               onChangeText={(value) => handleInputChange('email', value)}
                    />
                    <TextInput style={styles.input}
                               secureTextEntry={true}
                               placeholder="Password"
                               value={user.password}
                               onChangeText={(value) => handleInputChange('password', value)}
                    />
                    <p></p>
                    <Button title="Sign in" onPress={handleSubmit} />
                    <p></p>
                    <Pressable style={styles.link}>
                        <Link href={"/RegisterPage"}>Sign up</Link>
                    </Pressable>
                    <Pressable style={styles.link}>
                        <Link href={"/"}>Go back</Link>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );}
};



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