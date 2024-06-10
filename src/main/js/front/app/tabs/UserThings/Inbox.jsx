import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { getInbox, acceptInvitation, rejectInvitation } from '../../Api';

export default function Inbox() {
    const [inbox, setInbox] = useState([]);

    useEffect(() => {
        loadInbox();
    }, []);

    const loadInbox = async () => {
        const messages = await getInbox();
        setInbox(messages);
    }

    const handleAccept = async (messageId) => {
        await acceptInvitation(messageId);
        loadInbox();
    }

    const handleReject = async (messageId) => {
        await rejectInvitation(messageId);
        loadInbox();
    }

    return (
        <View>
            <FlatList
                data={inbox}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.content}</Text>
                        <Button title="Accept" onPress={() => handleAccept(item.id)} />
                        <Button title="Reject" onPress={() => handleReject(item.id)} />
                    </View>
                )}
            />
        </View>
    );
}