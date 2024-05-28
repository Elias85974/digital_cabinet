import React from 'react';
import { Pressable, Text, Alert, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const logout = async () => {
    try {
        localStorage.clear();
        alert('Session logged out successfully');
        router.replace('/');
    } catch (error) {
        console.log('Error during logout:', error);
    }
};

const LogoutButton = () => (
    <Pressable onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    logoutButton: {
        marginTop: 15,
        marginBottom: 10,
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
    },
    logoutText: {
        color: '#F2EFE9',
        fontSize: 16,
    },
});

export default LogoutButton;