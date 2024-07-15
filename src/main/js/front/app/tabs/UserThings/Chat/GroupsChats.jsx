import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ChatApi, InboxApi} from "../../../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused} from "@react-navigation/native";
import NavBar from "../../NavBar/NavBar";
import {chatsStyles} from "./ChatsStyles";
import GoBackButton from "../../NavBar/GoBackButton";
import {getChatNotifications} from "../../../api/inbox";

export default function GroupsChats({ navigation }) {
    const [chats, setChats] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState({});

    const [key, setKey] = useState(0);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused){
            getGroupChats();
        }
    }, [isFocused]);

    const getGroupChats = async () => {
        try {
            let messageInfos = await getChatNotifications(navigation);
            const unreadMessages = messageInfos.reduce((acc, messageInfo) => {
                acc[messageInfo.chatId] = messageInfo.unreadMessages > 0;
                return acc;
            }, {});
            setUnreadMessages(unreadMessages);

            let chats = await ChatApi.getChats(navigation);

            setChats(chats);
            setKey(oldKey => oldKey + 1)
        } catch (error) {
            console.log("Error getting chats:", error);
        }
    }

    return (
        <View style={chatsStyles.container} key={key}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                    <GoBackButton navigation={navigation}/>
                    <Text style={chatsStyles.title}>Chats</Text>
                    <View style={chatsStyles.contentWishList}>
                        {chats.map((chat, index) => (
                            <View style={ unreadMessages[chat.chatId] ? chatsStyles.cardMessages : chatsStyles.card} key={index}>
                                <Text style={chatsStyles.info}
                                      onPress={async () => {
                                          navigation.navigate('Chat');
                                          await AsyncStorage.setItem('chatId', chat.chatId.toString());
                                          await AsyncStorage.setItem('chatName', chat.chatName);
                                          setKey(oldKey => oldKey + 1)
                                      }}>
                                    {chat.chatName}
                                </Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation}/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container2: {
        width: '90%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    circle: {
        paddingVertical: 10, // Controla el tamaño vertical del círculo
        paddingHorizontal: 20, // Controla el tamaño horizontal del círculo
        borderRadius: 35,
        backgroundColor: '#BFAC9B',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    circleText: {
        color: 'white',
        fontSize: 25,
    },

    link: {
        marginTop: 15,
        marginBottom: 10,
        color: '#F2EFE9',
        textDecorationLine: 'underline',
        textAlign: 'center',
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
        fontSize: 16,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        color: 'white',
        backgroundColor: '#4B5940',
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 50,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
    },
    info: {
        fontSize: 25,
        fontFamily: 'lucida grande',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        color: '#F2EFE9',
        lineHeight: 30,
    },
    linksContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    logInCont: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: '90%',
        alignSelf: 'center',
    }
});
