import { useState } from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
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
            <ScrollView style={{marginTop: 20}} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Digital Cabinet</Text>
                    <View style={styles.logInCont}>
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
                        <Pressable style={styles.link} onPress={handleSubmit}>
                            <Text style={{color: 'white', fontSize: 16}}>Log In</Text>
                        </Pressable>
                    </View>
                    <p></p>
                    <View style={styles.linksContainer}>
                        <Pressable>
                            <Link href={"/RegisterPage"} style={styles.link}>Sign Up</Link>
                        </Pressable>
                        <Pressable>
                            <Link href={"/"} style={styles.link}>Go back</Link>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );}
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
    }
});