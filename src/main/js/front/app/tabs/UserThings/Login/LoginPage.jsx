import React, { useState, useEffect, useRef, useContext } from 'react';
import { TextInput, View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView, Animated } from "react-native";
import { UsersApi } from "../../../Api";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalAlert from "../../Contents/ModalAlert";
import GoogleLoginButton from "./GoogleLogin";

export default function LoginPage({ navigation }) {
    const { signIn } = useContext(AuthContext);
    const [user, setUser] = useState({ mail: '', password: '' });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [animatedValue]);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#BFAC9B', 'rgb(171,133,93)'],
    });

    const handleInputChange = (field, value) => {
        setUser({ ...user, [field]: value });
    };

    const handleSubmit = async () => {
        try {
            if (user.mail && user.password) {
                const response = await UsersApi.loginUser(user); // Assume loginUser returns a promise
                if (response) { // Boolean indicating success of login
                    signIn(response.token, response.email);
                    setIsLoggedIn(true);
                    console.log(response)
                    const userId = response.userId;

                    // Save user ID to AsyncStorage
                    await AsyncStorage.setItem('userId', userId);

                    // Check if the user is the admin (i.e., user ID is 1)
                    if (userId === '1') {
                        // Navigate to the admin page
                        navigation.navigate("Products Verification");
                    } else {
                        // Navigate to the homes page
                        navigation.navigate("Homes"); //homes
                    }
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
            <Animated.View style={[styles.container, { backgroundColor }]}>
                <SafeAreaView style={StyleSheet.absoluteFill}>
                    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
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
                            <View style={{marginTop: 20}}>
                            </View>
                            <GoogleLoginButton setIsLoggedIn={setIsLoggedIn} navigation={navigation} />
                        </View>
                        <View style={{marginTop: 20}}>
                        </View>
                        <View style={styles.linksContainer}>
                            <Pressable onPress={() => navigation.navigate("RegisterPage")}>
                                <Text style={styles.link}>Sign Up</Text>
                            </Pressable>
                        </View>
                    </View>
                        </ScrollView>
                </SafeAreaView>
            </Animated.View>
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