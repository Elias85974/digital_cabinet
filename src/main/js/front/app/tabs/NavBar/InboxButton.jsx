import React, {useEffect, useState} from 'react';
import {Pressable, Text, Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getInboxSize} from "../../api/inbox";


const InboxButton = ({navigation, hasNewNotification}) => {

    const handleGoBack = () => {
        navigation.navigate('Inbox');
    }

    return (
        <>
            <TouchableOpacity onPress={handleGoBack}  style={styles.chatButton}>
                <Ionicons
                    name={hasNewNotification ? "mail" : "mail-outline"}
                    size={24}
                    color="white"
                />
                {/*<Text style={styles.logoutText}>Inbox</Text>*/}
            </TouchableOpacity>
        </>

    );
}

const styles = StyleSheet.create({
    chatButton: {
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

export default InboxButton;