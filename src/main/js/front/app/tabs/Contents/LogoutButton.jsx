import React from 'react';
import { Pressable, Text, Alert, StyleSheet } from 'react-native';
import {AuthContext} from "../../context/AuthContext";

const LogoutButton = ({navigation}) => {
    const {signOut} = React.useContext(AuthContext);

    const handleSignOut = () => {
        signOut()
        navigation.navigate("Index")
    }

    return (
        <><Pressable onPress={handleSignOut}  style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
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
        width: 150, // Set width
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