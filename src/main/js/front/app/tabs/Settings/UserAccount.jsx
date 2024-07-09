import {FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Collapsible from "react-native-collapsible";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {UsersApi} from "../../Api";
import {settingStyles} from "./SettingStyles";

export function UserAccount({ navigation }) {
    const [userData, setUserData] = useState({mail: '', nombre: '', apellido: '', password: '', edad: '', telefono: ''});
    const [isCollapsed, setIsCollapsed] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadUserData().then(r => console.log('Stocks loaded'), e => console.error('Error loading stocks', e));
        }
    }, [isFocused]);

    const loadUserData = async () => {
        const userId = await AsyncStorage.getItem('userId');
        //const userAccount = await UsersApi.getUser(userId);
        //setUserData(userAccount);
    }

    const handleInputChange = (name, value) => {
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        const userId = await AsyncStorage.getItem('userId');
        await UsersApi.editUser(userId, userData);
        // Aquí puedes agregar código para manejar lo que sucede después de que los datos del usuario se guardan exitosamente
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                <Text style={settingStyles.typesContainer}>Account</Text>
            </TouchableOpacity>
            <Collapsible collapsed={isCollapsed}>
                <View style={styles.signInCont}>
                    <Text style={styles.info}>Edit user</Text>
                    <TextInput style={styles.input}
                               placeholder="Mail"
                               value={userData.mail}
                               onChangeText={(value) => handleInputChange('mail', value)}
                    />
                    <TextInput style={styles.input}
                               placeholder="Nombre"
                               value={userData.nombre}
                               onChangeText={(value) => handleInputChange('nombre', value)}
                    />
                    <TextInput style={styles.input}
                               placeholder="Apellido"
                               value={userData.apellido}
                               onChangeText={(value) => handleInputChange('apellido', value)}
                    />
                    <TextInput style={styles.input}
                               placeholder="Edad"
                               value={userData.edad}
                               onChangeText={(value) => handleInputChange('edad', value)}
                    />
                    <TextInput style={styles.input}
                               placeholder="Teléfono"
                               value={userData.telefono}
                               onChangeText={(value) => handleInputChange('telefono', value)}
                    />
                    <TextInput style={styles.input}
                               secureTextEntry={true}
                               placeholder="Password"
                               value={userData.password}
                               onChangeText={(value) => handleInputChange('password', value)}
                    />
                    <Pressable style={styles.link} onPress={handleSave}>
                        <Text style={{color: 'white', fontSize: 16}} >Save changes</Text>
                    </Pressable>
                </View>
            </Collapsible>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
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
    signInCont: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    }
});