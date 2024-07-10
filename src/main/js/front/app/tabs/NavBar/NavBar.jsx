import React, {useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import ChatButton from "./ChatButton";
import InboxButton from "./InboxButton";
import SettingsButton from "./SettingsButton";
import WishlistButton from "./WishlistButton";
import HomesButton from "./HomesButton";
import {getChatNotifications, getChats, getMessages} from "../../api/chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getInboxSize, getNearExpirationStocks, getUsersHouseInvitations} from "../../api/inbox";
import {useIsFocused} from "@react-navigation/native";

const NavBar = ({ navigation }) => {
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused){
            const checkForUpdates = async () => {
                await checkForNewMessages();
                await checkForNewNotifications();
            }

            checkForUpdates();

            // Configura un intervalo para llamar a checkForUpdates cada 5 minutos
            const intervalId = setInterval(checkForUpdates, 5 * 60 * 1000); // 5 * 60 * 1000 ms = 5 mins
            console.log('intervalId', intervalId);
            // Limpia el intervalo cuando el componente se desmonta
            return () => clearInterval(intervalId);
        }
    }, [isFocused]);


    const checkForNewMessages = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const chats = await getChats(userId);
        let newMessageCount = 0;
        for (let chat of chats) {
            const messages = await getMessages(chat.id, userId);
            newMessageCount += messages.length;
        }
        if (newMessageCount > messageCount) {
            setHasNewMessage(true);
            setMessageCount(newMessageCount);
        }
        console.log('newMessageCount', newMessageCount);
    }

    const checkForNewNotifications = async () => {
        const userId = await AsyncStorage.getItem('userId');

        // Obtén cada tipo de notificación
        const houseInvitations = await getUsersHouseInvitations(userId);
        const nearExpirations = await getNearExpirationStocks(userId);
        const chatNotifications = await getChatNotifications(userId);

        // Suma las longitudes de cada tipo de notificación
        const totalNotifications = houseInvitations.length + nearExpirations.length + chatNotifications.length;

        // Si el total de notificaciones es mayor que el conteo de notificaciones actual, actualiza el estado
        if (totalNotifications > notificationCount) {
            setHasNewNotification(true);
            setNotificationCount(totalNotifications);
        }

        console.log('totalNotifications', totalNotifications);
    }

    return (
    <View style={styles.bottom}>
        <View style={styles.navBar}>
            <WishlistButton navigation={navigation}/>

            <ChatButton navigation={navigation} hasNewMessage={hasNewMessage}/>

            <HomesButton navigation={navigation}/>

            <InboxButton navigation={navigation} hasNewNotification={hasNewNotification}/>

            <SettingsButton navigation={navigation}/>
        </View>
    </View>
);
};

const styles = StyleSheet.create({
    navBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#a08f80',
    },
    bottom: {

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        marginTop: 100,

    },
});

export default NavBar;