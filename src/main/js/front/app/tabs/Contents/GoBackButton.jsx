import React from 'react';
import { Pressable, Text, Alert, StyleSheet } from 'react-native';


const GoBackButton = ({navigation}) => {

    const handleGoBack = () => {
        navigation.goBack();
    }

    return (
        <><Pressable onPress={handleGoBack}  style={styles.logoutButton}>
            <Text style={styles.logoutText}>Go Back</Text>
        </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        marginTop: 15,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
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

export default GoBackButton;