import React, {useState } from 'react';
import {View, ScrollView, TextInput, Pressable, StyleSheet, Text} from 'react-native';
import {createUser} from '../../Api';
import Tuple from "../Contents/Tuple";
import ModalAlert from "../Contents/ModalAlert";

export default function RegisterPage({navigation}) {
    let [newUser, setNewUser] = useState({mail: '', nombre: '', apellido: '', password: ''});

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

    const isEmail = (email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(email);

    const handleInputChange = (field, value) => {
        setNewUser({...newUser, [field]: value});
    };

    const handleCreateUser = async () => {
        try {
            if (newUser.mail && newUser.nombre && newUser.apellido && newUser.password) {
                if (!isEmail(newUser.mail)) {
                    setModalMessage("Incorrect email format. Please try again."); // Muestra el modal en lugar de un alert
                    setModalVisible(true);
                } else {
                    await createUser(newUser);
                    setModalMessage("User created successfully!"); // Muestra el modal en lugar de un alert
                    setModalVisible(true);

                    setTimeout(() => {
                        setModalVisible(false);
                        // Navega a la siguiente página después de un retraso
                        navigation.navigate('LoginPage');
                    }, 5000);
                }
            }
            else {
                setModalMessage("Please fill in all fields."); // Muestra el modal en lugar de un alert
                setModalVisible(true);

            }
            setNewUser({mail: '', nombre: '', apellido: '', password: ''});
        } catch (error) {
            console.log("Error creating user:", error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                <View>
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
        marginTop: 20,
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