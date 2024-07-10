import React, {useState } from 'react';
import {View, ScrollView, TextInput, Pressable, StyleSheet, Text, SafeAreaView} from 'react-native';
import {UsersApi} from '../../Api';
import ModalAlert from "../Contents/ModalAlert";
import GoBackButton from "../NavBar/GoBackButton";

export default function RegisterPage({navigation}) {
    let [newUser, setNewUser] = useState({mail: '', nombre: '', apellido: '', password: '', edad: '', telefono: ''});

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

    const isEmail = (email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(email);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    const handleInputChange = (field, value) => {
        if (field === 'mail') {
            // Convert email to lowercase
            value = value.toLowerCase();
        } else if (field === 'telefono') {
            // Format phone number for the 'telefono' field
            value = formatPhoneNumber(value);
        } else if (field === 'password') {
            // Do nothing for the 'password' field
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
                && newUser.edad && newUser.telefono && newUser.password) {
                if (!isEmail(newUser.mail)) {
                    setModalMessage("Incorrect email format. Please try again."); // Muestra el modal en lugar de un alert
                    setModalVisible(true);
                } else if (!isValidPhoneNumber(newUser.telefono)) {
                    setModalMessage("Invalid phone number format. Expected format: XX XXXX XXXX");                    setModalVisible(true);
                } else if(newUser.edad < 12) {
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
            setNewUser({mail: '', nombre: '', apellido: '', password: '', edad: '', telefono: ''});
        } catch (error) {
            console.log("Error creating user:", error);
        }
    };

    const isValidPhoneNumber = (phoneNumber) => {
        const pattern = /\d{2} \d{4} \d{4}$/; // New pattern for +12 3456 7890 format
        return pattern.test(phoneNumber);
};

    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                <View>
                    <GoBackButton navigation={navigation}/>
                    <Text style={styles.title}>Sign Up</Text>
                    <View style={styles.signInCont}>
                        <Text style={styles.info}>Please fill in all fields to create your user</Text>
                        <TextInput style={styles.input}
                                   placeholder="Mail"
                                   value={newUser.mail}
                                   onChangeText={(value) => handleInputChange('mail', value)}
                        />
                        <TextInput style={styles.input}
                                   placeholder="Nombre"
                                   value={newUser.nombre}
                                   onChangeText={(value) => handleInputChange('nombre', value)}
                        />
                        <TextInput style={styles.input}
                                   placeholder="Apellido"
                                   value={newUser.apellido}
                                   onChangeText={(value) => handleInputChange('apellido', value)}
                        />
                        <TextInput style={styles.input}
                                   placeholder="Edad"
                                   value={newUser.edad}
                                   onChangeText={(value) => handleInputChange('edad', value)}
                        />
                        <TextInput style={styles.input}
                                   placeholder="Teléfono: XX XXXX XXXX"
                                   value={newUser.telefono}
                                   onChangeText={(value) => handleInputChange('telefono', value)}
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
                    <p></p>
                    <View style={styles.linksContainer}>
                        <Pressable style={styles.link} onPress={() => navigation.navigate("LoginPage")}>
                            <Text style={{color: 'white'}}>Log In</Text>
                        </Pressable>
                    </View>
                </View>
                </ScrollView>
            </SafeAreaView>
        </View>
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