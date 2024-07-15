import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { InboxApi } from "../../../Api";
import { inboxStyles } from './InboxStyles';
import Collapsible from "react-native-collapsible";

export function ChatNotification({ navigation, setChatLength }) {
    const [chatNotifications, setChatNotifications] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadChatNotifications().then(() => console.log('Chat notifications loaded'), e => console.error('Error loading chat notifications', e));
        }
    }, [isFocused]);

    const loadChatNotifications = async () => {
        const notifications = await InboxApi.getChatNotifications(navigation);
        setChatNotifications(notifications);
        setChatLength(notifications.length);
    };

    const navigateToChat = async (chatId) => {
        await AsyncStorage.setItem('chatId', chatId.toString());
        navigation.navigate("Chat");
    };

    if (chatNotifications.length > 0) {
        return (
            <View>
                <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                    <Text style={inboxStyles.typesContainer}>Chat Notifications</Text>
                </TouchableOpacity>
                <Collapsible collapsed={isCollapsed}>
                    <FlatList
                        data={chatNotifications}
                        keyExtractor={item => item.chatId.toString()}
                        renderItem={({item}) => (
                            <View style={inboxStyles.card}>
                                <View style={inboxStyles.statusInd}></View>
                                <View style={inboxStyles.right}>
                                    <View style={inboxStyles.textWrap}>
                                        <TouchableOpacity
                                            style={[inboxStyles.primaryCta, {backgroundColor: "white", borderColor: "black"}]}
                                            onPress={() => navigateToChat(item.chatId)}
                                        >
                                            <Text style={inboxStyles.textContent}>
                                                {item.sender} said: "{item.message}"
                                                <p></p>You have {item.unreadMessages} unread messages on {item.chatName}'s chat
                                                <p></p>
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </Collapsible>
            </View>
        );
    }

}