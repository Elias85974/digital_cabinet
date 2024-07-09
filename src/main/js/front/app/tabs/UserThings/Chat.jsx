import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ChatApi} from "../../Api";
import {useIsFocused} from "@react-navigation/native";
import NavBar from "../NavBar/NavBar";

export default function Chat({navigation}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadMessages().then(r => console.log('Messages loaded'), e => console.error('Error loading messages', e));
    }
  }, [isFocused]);

  const loadMessages = async() => {
    const chatId = await AsyncStorage.getItem('chatId');
    const messages = await ChatApi.getMessages(chatId, navigation);
    console.log(messages);
    setMessages(messages);
  }

  const handleSendMessage = async(message) => {
    if (message.length > 0) {
      const chatId = await AsyncStorage.getItem('chatId');
      await ChatApi.sendMessage(chatId, message);
      setMessage('');
      await loadMessages();
    }
  }

return (
    <View style={styles.container}>
        <Text style={styles.title}>Chat</Text>
      {messages.map((msg, index) => (
          <Text key={index}>{msg.senderId === userId ? 'You' : msg.sender}: {msg.message}</Text>
      ))}
        <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={setMessage}
            value={message}
        />
        <Button
            onPress={() => handleSendMessage(message)}
            title="Send"
            color="#841584"
        />
        <NavBar navigation={navigation}/>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
