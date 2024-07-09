import React from 'react';
import {Pressable, Text, Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";


const GoBackButton = ({navigation}) => {

    const handleGoBack = () => {
        navigation.goBack();
    }

    return (
        <><View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
            <TouchableOpacity onPress={handleGoBack}  style={styles.logoutButton}>
                <Ionicons name="arrow-back-outline" size={24} color="white" />
                {/*<Text style={styles.logoutText}>Go Back</Text>*/}
            </TouchableOpacity>
        </View></>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        marginLeft: 25,
        marginTop: 25,
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

export default GoBackButton;