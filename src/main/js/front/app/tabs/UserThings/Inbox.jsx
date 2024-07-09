import React, {useEffect, useState} from 'react';
import {Text, View, SafeAreaView, ScrollView} from 'react-native';
import { HouseInvitation } from './Notification/HouseInvitation';
import { ExpirationNotification } from "./Notification/ExpirationNotification";
import {inboxStyles} from "./Notification/InboxStyles";
import {useIsFocused} from "@react-navigation/native";
import NavBar from "../NavBar/NavBar";
import {ChatNotification} from "./Notification/ChatNotification";

export default function Inbox({navigation}) {
    const [invitationsLength, setInvitationsLength] = useState(0);
    const [expirationLength, setExpirationLength] = useState(0);
    const [chatLength, setChatLength] = useState(0);
    const [totalSize, setInboxSize] = useState(0);
    const isFocused = useIsFocused();

    useEffect(() => {
        setInboxSize(invitationsLength + expirationLength + chatLength);
    }, [isFocused, invitationsLength, expirationLength, chatLength]);

    const isInboxEmpty = () => {
        return totalSize === 0;
    }

    return (
    <View style={inboxStyles.container}>
        <SafeAreaView style={StyleSheet.absoluteFill}>
            <ScrollView style={inboxStyles.contentContainer} showsVerticalScrollIndicator={false}>
                <Text style={inboxStyles.title}>Inbox</Text>
                {isInboxEmpty() && (
                    <View style={inboxStyles.contentWishList}>
                        <View style={inboxStyles.emptyInbox}>
                            <Text style={{alignSelf: 'center'}}>No notifications left to read</Text>
                        </View>
                    </View>
                )}
                    <View style={inboxStyles.contentWishList}>
                        <View>
                            <HouseInvitation setInvitationsLength={setInvitationsLength}/>
                            <ExpirationNotification navigation={navigation} setExpirationsLength={setExpirationLength}/>
                            <ChatNotification navigation={navigation} setChatLength={setChatLength}/>
                        </View>
                    </View>
            </ScrollView>
        </SafeAreaView>
        <NavBar navigation={navigation}/>
    </View>
    );
}