import { useState } from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
import {getUserIdByEmail, loginUser} from "../../Api";
import {AuthContext} from "../../context/AuthContext";
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalAlert from "../Contents/ModalAlert";

export default function LoginPage({navigation}) {
    const {userToken, email} = React.useContext(AuthContext)
    const {signIn} = React.useContext(AuthContext)
    const [user, setUser] = useState({mail: '', password: ''});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

    const handleInputChange = (field, value) => {
        setUser({...user, [field]: value});
    };

    const handleSubmit = async () => {
        try {
            if (user.mail && user.password) {
                const response = await loginUser(user); // Assume loginUser returns a promise
                if (response) { // Boolean indicating success of login
                    signIn("", response.email);
                    setIsLoggedIn(true);

                    // Use getUserIdByEmail to get the user ID
                    const userId = await getUserIdByEmail(userToken, response.email);
                    console.log("User ID:", userId); // Log the user ID to check if it's correct

                    // Save user ID to AsyncStorage
                    await AsyncStorage.setItem('userId', userId.toString());


                    navigation.navigate("UserThingsBeforeHouse");
                }
            }
            else {
                setModalMessage("Please fill in all fields."); // Muestra el modal en lugar de un alert
                setModalVisible(true);

            }
        } catch (error) {
            console.log("Error logging in user:", error);
            setModalMessage("Incorrect email or password. Please try again."); // Muestra el modal en lugar de un alert
            setModalVisible(true);
        }
        finally {
            setUser({mail: '', password: ''}); // Reset user state
        }
    }

    // Use isLoggedIn state variable to conditionally render components or navigate to different routes
    if (!isLoggedIn) {
        return (
            <View style={styles.container}>
                <ScrollView style={{marginTop: 20}} showsVerticalScrollIndicator={false}>
                    <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />

                    <View>
                        <Text style={styles.title}>Digital Cabinet</Text>
                        <View style={styles.logInCont}>
                            <Text style={styles.info}>Welcome Back</Text>
                            <TextInput style={styles.input}
                                       placeholder="Mail"
                                       value={user.mail}
                                       onChangeText={(value) => handleInputChange('mail', value)}
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
                            <Pressable onPress={() => navigation.navigate("RegisterPage")}>
                                <Text style={styles.link}>Sign Up</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
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
})