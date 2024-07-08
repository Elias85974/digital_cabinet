import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, View, SafeAreaView, ScrollView} from 'react-native';

import {chatsStyles} from "./chatsStyles";

import {useIsFocused} from "@react-navigation/native";
import NavBar from "../../NavBar/NavBar";

export default function MultiChat({navigation}) {

    const [chatsSize, setChatSize] = useState({chatNotificationSize: 0, expirationNotificationSize: 0, houseInvitationSize: 0});
    const isFocused = useIsFocused();

    return (
        <View style={chatsStyles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={chatsStyles.contentContainer} showsVerticalScrollIndicator={false}>
                    <Text style={chatsStyles.title}>Chats</Text>
                        <View style={chatsStyles.contentChats}>

                        </View>
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation}/>
        </View>
    );
}