import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, View, SafeAreaView, ScrollView} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { HouseInvitation } from './Notification/HouseInvitation';
import { ExpirationNotification } from "./Notification/ExpirationNotification";
import {inboxStyles} from "./Notification/InboxStyles";
import Tuple from "../Contents/Tuple";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused} from "@react-navigation/native";
import {InboxApi} from "../../Api";
import NavBar from "../NavBar/NavBar";

export default function Inbox({navigation}) {
    const [isHouseInvitationCollapsed, setHouseInvitationCollapsed] = useState(true);
    const [isExpirationNotificationCollapsed, setExpirationNotificationCollapsed] = useState(true);
    const [isChatNotificationCollapsed, setChatNotificationCollapsed] = useState(true);
    const [inboxSize, setInboxSize] = useState({chatNotificationSize: 0, expirationNotificationSize: 0, houseInvitationSize: 0});
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadInboxSize().then(r => console.log('Inbox size loaded'), e => console.error('Error loading inbox size', e));
        }
    }, [isFocused]);

    const loadInboxSize = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const inboxSize = await InboxApi.getInboxSize(userId);
        setInboxSize(inboxSize);
        console.log(inboxSize);
    }

    const isEmpty = (sizes) => {
        return sizes.totalSize === 0;
    }

    return (
    <View style={inboxStyles.container}>
        <SafeAreaView style={StyleSheet.absoluteFill}>
            <ScrollView style={inboxStyles.contentContainer} showsVerticalScrollIndicator={false}>
                <Text style={inboxStyles.title}>Inbox</Text>
                {isEmpty(inboxSize) ? (
                    <View style={inboxStyles.contentWishList}>
                        <View style={inboxStyles.emptyInbox}>
                            <Text style={{alignSelf: 'center'}}>No notifications left to read</Text>
                        </View>
                    </View>
                ) : (
                    <View style={inboxStyles.contentWishList}>
                        <View>
                            {inboxSize.houseInvitationSize > 0 && (
                                <>
                                    <TouchableOpacity onPress={() => setHouseInvitationCollapsed(!isHouseInvitationCollapsed)}>
                                        <Text>House Invitations</Text>
                                    </TouchableOpacity>
                                    <Collapsible collapsed={isHouseInvitationCollapsed}>
                                        <HouseInvitation/>
                                    </Collapsible>
                                </>
                            )}
                            {inboxSize.expirationNotificationSize > 0 && (
                                <>
                                    <TouchableOpacity onPress={() => setExpirationNotificationCollapsed(!isExpirationNotificationCollapsed)}>
                                        <Text>Expiration Notifications</Text>
                                    </TouchableOpacity>
                                    <Collapsible collapsed={isExpirationNotificationCollapsed}>
                                        <ExpirationNotification navigation={navigation}/>
                                    </Collapsible>
                                </>
                            )}
                            {/*<ChatNotification navigation={navigation}/> Add this view next */}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
        <NavBar navigation={navigation}/>
    </View>
    );
}