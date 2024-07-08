import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, TextInput, Pressable, ScrollView, SafeAreaView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ChatApi} from "../../../Api";
import {useIsFocused} from "@react-navigation/native";
import NavBar from "../../NavBar/NavBar";
import {chatsStyles} from "./ChatsStyles";

export default function Chat({navigation}) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadMessages().then(r => console.log('Messages loaded'), e => console.error('Error loading messages', e));
    }
  }, [isFocused]);

  const loadMessages = async() => {
    let newUserId = userId;
    if (userId === '') {
      newUserId = await AsyncStorage.getItem('userId');
      setUserId(newUserId);
    }
    const chatId = await AsyncStorage.getItem('chatId');
    const messages = await ChatApi.getMessages(chatId, newUserId);
    console.log(messages);
    setMessages(messages);
  }

  const handleSendMessage = async(message) => {
    console.log(userId);
    if (message.length > 0) {
      const newUserId = await AsyncStorage.getItem('userId');
      const chatId = await AsyncStorage.getItem('chatId');
      await ChatApi.sendMessage(chatId, newUserId, message);
      setMessage('');
      await loadMessages();
    }
  }

return (
    <View style={chatsStyles.container}>
            <View style={styles.container}>
            <Text style={styles.title}>Chat</Text>
              <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={chatsStyles.contentContainer} showsVerticalScrollIndicator={false}>
                    {messages.map((msg, index) => (
                      <View key={index} style={msg.senderId === userId ? styles.userMessage : styles.otherMessage}>
                        <Text>{msg.message}</Text>
                      </View>
                  ))}
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={setMessage}
                        value={message}
                    />
                  <Pressable style={styles.link} onPress={() => handleSendMessage(message)}>
                    <Text style={styles.textStyle}>Send</Text>
                  </Pressable>
                </ScrollView>
              </SafeAreaView>
              <NavBar navigation={navigation}/>
        </View>
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
    flex: 1,
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: 'white',
    backgroundColor: '#3b0317',
    borderRadius: 30,
    borderStyle: undefined,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1f5d3',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
});
