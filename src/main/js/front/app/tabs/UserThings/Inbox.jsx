import React, { useEffect, useState } from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { View, Text, Button, FlatList, Pressable } from 'react-native';
import { getUsersInbox, processInvitations } from '../../Api';
import GoBackButton from "../Contents/GoBackButton";
import LogoutButton from "../Contents/LogoutButton";
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScrollViewWithEventThrottle
    from "react-native-web/dist/vendor/react-native/Animated/components/AnimatedScrollView";
import Tuple from "../Contents/Tuple";

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
            <ScrollView style={{marginTop: 20}} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Inbox</Text>
                    <View style={styles.contentWishList}>
                        <View>
                            {inbox.length > 0 ? (
                                <FlatList
                                    data={inbox}
                                    keyExtractor={item => item.houseId.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.card}>
                                            <View style={styles.statusInd}></View>
                                            <View style={styles.right}>
                                                <View style={styles.textWrap}>
                                                    <Text style={styles.textContent}>
                                                        <Text style={styles.textLink}>{item.username}</Text>
                                                          has invited you to access to its Digital Cabinet!!!
                                                    </Text>
                                                    <Text style={styles.time}>1 minute</Text>
                                                </View>
                                                <View style={styles.buttonWrap}>
                                                    <TouchableOpacity
                                                        style={[styles.primaryCta, {backgroundColor: lastPressed[item.houseId] === 'accept' ? 'darkgreen' : 'green'}]}
                                                        onPress={() => handleAccept(item.houseId)}
                                                    >
                                                        <Text style={styles.buttonText}>Accept</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.secondaryCta, {backgroundColor: lastPressed[item.houseId] === 'reject' ? 'darkred' : 'red'}]}
                                                        onPress={() => handleReject(item.houseId)}
                                                    >
                                                        <Text style={styles.buttonText}>Reject</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                />
                            ) : (
                                <View style={styles.emptyInbox}>
                                    <Text style={{alignSelf: 'center'}}>You have no recent invitations</Text>
                                </View>
                            )}
                            {inbox.length > 0 &&
                                <View style={styles.linksContainer}>
                                    <Pressable onPress={sendUpdates}>
                                        <Text style={styles.link}>Send Updates</Text>
                                    </Pressable>
                                </View>
                            }
                        </View>
                    </View>
                    <Tuple navigation={navigation}/>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // ... other styles
    emptyInbox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10, // adjust this to control the roundness of the corners
        backgroundColor: '#4B5940', // or any color you want
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        color: '#BFAC9B',
        lineHeight: 30,
    },
    linksContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    contentWishList: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: '90%',
        alignSelf: 'center',
    },


    card: {
        flexDirection: 'row',
        backgroundColor: '#f2f3f7',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    statusInd: {
        width: 10,
        height: 10,
        backgroundColor: '#ff0000',
        borderRadius: 5,
        marginRight: 10,
    },
    right: {
        flex: 1,
    },
    textWrap: {
        flexDirection: 'column',
    },
    textContent: {
        color: '#333',
    },
    textLink: {
        fontWeight: 'bold',
    },
    time: {
        color: '#777',
    },
    buttonWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        margin: 8,

    },
    primaryCta: {
        backgroundColor: 'transparent',
        borderRadius: 15,
    },
    secondaryCta: {
        backgroundColor: 'transparent',
        borderRadius: 15,
    },
    buttonText: {
        fontSize: 15,
        color: '#fff',
        margin: 8,
    },
});