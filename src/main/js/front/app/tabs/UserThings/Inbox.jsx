import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Button, FlatList, Pressable } from 'react-native';
import { getUsersInbox, processInvitations } from '../../Api';
import GoBackButton from "../Contents/GoBackButton";
import LogoutButton from "../Contents/LogoutButton";
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Inbox({navigation}) {
    const [inbox, setInbox] = useState([]);
    const [selectedInboxes, setSelectedInboxes] = useState([]);
    const [lastPressed, setLastPressed] = useState({});
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadInbox().then(r => console.log('Inbox loaded'), e => console.error('Error loading inbox', e));
        }
    }, [isFocused]);

    const loadInbox = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const messages = await getUsersInbox(userId);
        console.log(messages);
        setInbox(messages);
    }

    const handleAccept = async (houseId) => {
        const userId = await AsyncStorage.getItem('userId');
        setSelectedInboxes(prevInboxes => prevInboxes.filter(invite => invite.houseId !== houseId));
        setSelectedInboxes(prevInboxes => [...prevInboxes, {userId: userId, houseId: houseId.toString(), isAccepted: true}]);
        setLastPressed(prevState => ({...prevState, [houseId]: 'accept'}));
    }

    const handleReject = async (houseId) => {
        const userId = await AsyncStorage.getItem('userId');
        setSelectedInboxes(prevInboxes => prevInboxes.filter(invite => invite.houseId !== houseId));
        setSelectedInboxes(prevInboxes => [...prevInboxes, {userId: userId, houseId: houseId.toString(), isAccepted: false}]);
        setLastPressed(prevState => ({...prevState, [houseId]: 'reject'}));
    }

    const sendUpdates = async () => {
        console.log(selectedInboxes);
        await processInvitations(selectedInboxes);
        await loadInbox();
        setSelectedInboxes([]);
    }

    return (
        <View style={styles.container}>
            {inbox.length > 0 ? (
                <FlatList
                    data={inbox}
                    keyExtractor={item => item.houseId.toString()}
                    renderItem={({ item }) => (
                        <View style={{borderWidth: 1, borderColor: 'black', margin: 10, padding: 10}}>
                            <Text>{item.username} has invited you to access to its digital cabinet!!!</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                                <Pressable
                                    style={{backgroundColor: lastPressed[item.houseId] === 'accept' ? 'darkgreen' : 'green', padding: 10}}
                                    onPress={() => handleAccept(item.houseId)}
                                >
                                    <Text style={{color: 'white'}}>Accept</Text>
                                </Pressable>
                                <Pressable
                                    style={{backgroundColor: lastPressed[item.houseId] === 'reject' ? 'darkred' : 'red', padding: 10}}
                                    onPress={() => handleReject(item.houseId)}
                                >
                                    <Text style={{color: 'white'}}>Reject</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <View style={styles.emptyInbox}>
                    <Text>You have no recent invitations</Text>
                </View>
            )}
            {inbox.length > 0 && <Button title="Send Updates" onPress={sendUpdates} />}
            <LogoutButton navigation={navigation} />
            <GoBackButton navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    // ... other styles
    container: {
        flex: 1,
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    emptyInbox: {
        flex: 50,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10, // adjust this to control the roundness of the corners
        backgroundColor: '#4B5940', // or any color you want
    },
});