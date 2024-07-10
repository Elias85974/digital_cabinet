import React, {useEffect, useState} from 'react';
import {Pressable, Text, Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";


const ChatButton = ({navigation, hasNewMessage}) => {

    const handleGoBack = () => {
        navigation.navigate('GroupsChats');
    }

    return (
        <><TouchableOpacity onPress={handleGoBack}  style={styles.chatButton}>
            <Ionicons
                name= {hasNewMessage ? "chatbubble-ellipses-sharp" : "chatbubble-ellipses-outline"}
                size={24}
                color="white"
            />
            {/*<Text style={styles.logoutText}>Chat</Text>*/}
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

export default ChatButton;