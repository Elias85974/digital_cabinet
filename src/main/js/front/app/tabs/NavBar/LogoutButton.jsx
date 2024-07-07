import React from 'react';
import {Pressable, Text, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import {AuthContext} from "../../context/AuthContext";
import {Ionicons} from "@expo/vector-icons";

const LogoutButton = ({navigation}) => {
    const {signOut} = React.useContext(AuthContext);

    const handleSignOut = () => {
        signOut()
        navigation.navigate("Index")
    }

    return (
        <><TouchableOpacity onPress={handleSignOut}  style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="white" />
            {/*<Text style={styles.logoutText}>Logout</Text>*/}
        </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3, // Add border
        borderColor: '#717336', // Set border color
        padding: 10, // Add some padding so the text isn't right up against the border
        backgroundColor: '#717336', // Set background color
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 100,
    },
    logoutText: {
        color: '#F2EFE9',
        fontSize: 16,
    },
});

export default LogoutButton;