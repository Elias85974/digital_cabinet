import React, {useEffect, useRef, useState} from 'react';
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
    <View style={styles.containers}>
      <SafeAreaView style={StyleSheet.absoluteFill}>
        <Text style={styles.title}>Chat</Text>
        <ScrollView style={[styles.contentContainer,{height: '50%'}]} showsVerticalScrollIndicator={false}>
        <View style={[chatsStyles.container]}>
              {messages.map((msg, index) => (
                  <View key={index} style={msg.senderId === userId ? styles.userMessage : styles.otherMessage}>
                    <Text>{msg.senderId === userId ? 'You' : msg.sender}: {msg.message}</Text>
                  </View>
              ))}


        </View>

        </ScrollView>
        <View style={[styles.container]}>
          <TextInput
                style={{borderRadius: 100,height: 50, borderColor: 'gray', borderWidth: 1, width: '80%', color: 'white', backgroundColor: '#3b0317',}}
                onChangeText={setMessage}
                value={message}
                multiline={true}
                numberOfLines={5} // Ajusta este número según tus necesidades
            />
            <Pressable style={chatsStyles.link} onPress={() => handleSendMessage(message)}>
              <Text style={chatsStyles.textStyle}>Send</Text>
            </Pressable>
      </View>
      </SafeAreaView>
    <NavBar navigation={navigation}/>

  </View>
);
};
//<NavBar navigation={navigation}/>
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    height: 500,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 95,
    margin: 5,
  },
  containers: {
    height: '100%',
    width: '100%',
    backgroundColor: '#BFAC9B',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
    color: '#1B1A26',
    fontFamily: 'lucida grande',
    lineHeight: 80,
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