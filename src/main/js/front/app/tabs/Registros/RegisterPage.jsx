import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, Pressable, StyleSheet, Text, SafeAreaView, Animated } from 'react-native';
import { UsersApi } from '../../Api';
import ModalAlert from "../Contents/ModalAlert";
import GoBackButton from "../NavBar/GoBackButton";

export default function RegisterPage({ navigation }) {
    let [newUser, setNewUser] = useState({ mail: '', nombre: '', apellido: '', password: '', age: '', phone: '' });
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

    const isEmail = (email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(email);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    const handleInputChange = (field, value) => {
        if (field === 'mail' || field === 'password') {
            value = value;
        } else if (field === 'phone') {
            // Format phone number for the 'telefono' field
            value = formatPhoneNumber(value);
        }
        else {
            // Capitalize the first letter for other fields
            value = capitalizeFirstLetter(value);
        }
        // Update the newUser state with the formatted value
        setNewUser({...newUser, [field]: value});
    };

    const formatPhoneNumber = (input) => {
        // Remove any non-numeric characters
        const digits = input.replace(/\D/g, '');

        // Assuming the format XX XXXX XXXX, slice the digits and format
        if (digits.length === 10) {
            return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
        }

        // Return the original input if it doesn't match the expected length
        return input;
    };

    const handleCreateUser = async () => {
        try {
            if (newUser.mail && newUser.nombre && newUser.apellido
                && newUser.age && newUser.phone && newUser.password) {
                if (!isEmail(newUser.mail)) {
                    setModalMessage("Incorrect email format. Please try again."); // Muestra el modal en lugar de un alert
                    setModalVisible(true);
                } else if (!isValidPhoneNumber(newUser.phone)) {
                    setModalMessage("Invalid phone number format. Expected format: XX XXXX XXXX");
                    setModalVisible(true);
                } else if(newUser.age < 12) {
                    setModalMessage("You are too young to have an account.");
                    setModalVisible(true);
                } else {
                    await UsersApi.createUser(newUser);
                    setModalMessage("User created successfully!"); // Muestra el modal en lugar de un alert
                    setModalVisible(true);

                    setTimeout(() => {
                        setModalVisible(false);
                        // Navega a la siguiente página después de un retraso
                        navigation.navigate('LoginPage');
                    }, 2500);
                }
            }
            else {
                setModalMessage("Please fill in all fields."); // Muestra el modal en lugar de un alert
                setModalVisible(true);

            }
            setNewUser({mail: '', name: '', lastName: '', password: '', age: '', phone: ''});
        } catch (error) {
            console.log("Error creating user:", error);
        }
    };

    const isValidPhoneNumber = (phoneNumber) => {
        const pattern = /\d{2} \d{4} \d{4}$/; // New pattern for +12 3456 7890 format
        return pattern.test(phoneNumber);
    };

    return (
        <Animated.View style={[styles.container, { backgroundColor }]}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                <View>
                    <GoBackButton navigation={navigation}/>
                    <Text style={styles.title}>Sign Up</Text>
                    <View style={styles.signInCont}>
                        <Text style={styles.info}>Please fill in all fields to create your user</Text>
                        <TextInput style={styles.input}
                                   placeholder="E-Mail"
                                   value={newUser.mail}
                                   onChangeText={(value) => handleInputChange('mail', value)}
                        />
                        <TextInput style={styles.input}
                                   placeholder="Name"
                                   value={newUser.nombre}
                                   onChangeText={(value) => handleInputChange('nombre', value)}
                        />
                        <TextInput style={styles.input}
                                   placeholder="Surname"
                                   value={newUser.apellido}
                                   onChangeText={(value) => handleInputChange('apellido', value)}
                        />
                        <TextInput style={styles.input}
                                   placeholder="Age"
                                   value={newUser.age}
                                   onChangeText={(value) => handleInputChange('age', value)}
                        />
                        <TextInput style={styles.input}
                                   placeholder="Phone number XX XXXX XXXX"
                                   value={newUser.phone}
                                   onChangeText={(value) => handleInputChange('phone', value)}
                        />
                        <TextInput style={styles.input}
                                     secureTextEntry={true}
                                     placeholder="Password"
                                     value={newUser.password}
                                     onChangeText={(value) => handleInputChange('password', value)}
                        />
                        <Pressable style={styles.link} onPress={handleCreateUser}>
                            <Text style={{color: 'white', fontSize: 16}} >Create User</Text>
                        </Pressable>
                    </View>
                    <View style={{marginTop: 20}}>
                    </View>
                    <View style={styles.linksContainer}>
                        <Pressable style={styles.link} onPress={() => navigation.navigate("LoginPage")}>
                            <Text style={{color: 'white'}}>Log In</Text>
                        </Pressable>
                    </View>
                </View>
                </ScrollView>
            </SafeAreaView>
        </Animated.View>
    );
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
        marginBottom: 30,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
    },
    info: {
        fontSize: 20,
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
    signInCont: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    }
});