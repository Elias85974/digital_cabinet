import {useEffect, useState} from "react";
import { inboxStyles } from './InboxStyles';
import {useIsFocused} from "@react-navigation/native";
import {FlatList, TouchableOpacity, View, Text} from "react-native";
import {HousesApi, InboxApi} from "../../../Api";
import Collapsible from "react-native-collapsible";

export function HouseInvitation({ navigation, setInvitationsLength }) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [invitations, setInvitations] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadInvitations().then(r => console.log('House invitations loaded'), e => console.error('Error loading inbox', e));
        }
    }, [isFocused]);

    const loadInvitations = async () => {
        const houseInvitations = await InboxApi.getUsersHouseInvitations(navigation);
        console.log(houseInvitations);
        setInvitations(houseInvitations);
        setInvitationsLength(houseInvitations.length);
    }

    const handleAccept = async (houseId) => {
        const invitation = {houseId: houseId.toString(), isAccepted: true};
        await processInvitation(invitation);
    }

    const handleReject = async (houseId) => {
        const invitation = {houseId: houseId.toString(), isAccepted: false};
        await processInvitation(invitation);
    }

    const processInvitation = async (invitation) => {
        try {
            await HousesApi.processInvitation(invitation, navigation);
            await loadInvitations();
        } catch (error) {
            console.error('Failed to process invitation:', error);
        }
    }

    if (invitations.length > 0) {
        return (
            <View>
                <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                    <Text style={inboxStyles.typesContainer}>House Invitations</Text>
                </TouchableOpacity>
                <Collapsible collapsed={isCollapsed}>
                    <FlatList
                        data={invitations}
                        keyExtractor={item => item.houseId.toString()}
                        renderItem={({item}) => (
                            <View style={inboxStyles.card}>
                                <View style={inboxStyles.statusInd}></View>
                                <View style={inboxStyles.right}>
                                    <View style={inboxStyles.textWrap}>
                                        <Text style={inboxStyles.textContent}>
                                            <Text style={inboxStyles.textLink}>{item.username + " "}</Text>
                                            has invited you to access to its Digital Cabinet!!!
                                        </Text>
                                        <Text style={inboxStyles.time}>1 minute</Text>
                                    </View>
                                    <View style={inboxStyles.buttonWrap}>
                                        <TouchableOpacity
                                            style={[inboxStyles.primaryCta, {backgroundColor: "green"}]}
                                            onPress={() => handleAccept(item.houseId)}
                                        >
                                            <Text style={inboxStyles.buttonText}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[inboxStyles.secondaryCta, {backgroundColor: "red"}]}
                                            onPress={() => handleReject(item.houseId)}
                                        >
                                            <Text style={inboxStyles.buttonText}>Reject</Text>
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