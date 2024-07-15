import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button, TextInput, Pressable, ScrollView, SafeAreaView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ChatApi} from "../../../Api";
import {useIsFocused} from "@react-navigation/native";
import NavBar from "../../NavBar/NavBar";
import {chatsStyles} from "./ChatsStyles";
import GoBackButton from "../../NavBar/GoBackButton";

export default function Chat({navigation}) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState('');
    const [chatId, setChatId] = useState('');
    const isFocused = useIsFocused();

    const [chatName, setChatName] = useState('');


    useEffect(() => {
      const loadChatName = async () => {
        const name = await AsyncStorage.getItem('chatName');
        setChatName(name);
      }

      if (isFocused) {
        loadMessages().then(() => {
          loadChatName();

        }, e => console.error('Error loading messages', e));
      } else {
        loadChatName();
      }
    }, [isFocused]);

    const loadMessages = async() => {
      let newChatId = chatId;
      if (chatId === '') {
        newChatId = await AsyncStorage.getItem('chatId');
        setChatId(newChatId);
      }
      if (userId === '') {
        setUserId(await AsyncStorage.getItem('userId'));
      }
      const messages = await ChatApi.getMessages(newChatId, navigation);
      setMessages(messages);
    }

    const handleSendMessage = async(message) => {
      if (message.length > 0) {
        await ChatApi.sendMessage(chatId, message, navigation);
        setMessage('');
        await loadMessages();
      }
    }

    const [containerWidth, setContainerWidth] = useState(null);

    const handleLayout = (event) => {
        const {width} = event.nativeEvent.layout;
        setContainerWidth(width);
      };

    const splitMessage = (message) => {
      let maxLength = Math.floor(containerWidth / 10); // Adjust this number according to your needs
      maxLength = Math.max(1, maxLength); // Ensure maxLength is at least 1
      const words = message.split(' ');
      let line = [];
      let lineLength = 0;
      const splitLines = [];
      words.forEach(word => {
        if (word.length > maxLength) {
          const regex = new RegExp(`(.{1,${maxLength}})`, 'g');
          const splitWord = word.match(regex);
          splitLines.push(...splitWord);
          lineLength = 0;
          line = [];
        } else if (lineLength + word.length > maxLength) {
          splitLines.push(line.join(' '));
          line = [word];
          lineLength = word.length;
        } else {
          line.push(word);
          lineLength += word.length;
        }
      });
      if (line.length > 0) {
        splitLines.push(line.join(' '));
      }
      return splitLines;
    };

    return (
        <View style={styles.containers} >
          <SafeAreaView style={StyleSheet.absoluteFill}>
              <GoBackButton navigation={navigation}/>
              <Text style={styles.title}>{chatName}</Text>
            <ScrollView style={[styles.contentContainer,{height: '50%'}]} showsVerticalScrollIndicator={false}>

              <View style={[chatsStyles.container]} onLayout={handleLayout}>
                  {messages.map((msg, index) => (
                      <View  key={index} style={msg.senderId === userId ? styles.userMessage : styles.otherMessage}>
                        {splitMessage(msg.message).map((line, lineIndex) => (
                            <Text key={lineIndex} style={styles.messageText}>
                              {msg.senderId === userId ? '' : msg.sender + ":"} {line}
                            </Text>
                        ))}
                      </View>
                  ))}
            </View>

            </ScrollView>
            <View style={[styles.container]}>
              <TextInput
                    style={{borderRadius: 10,padding:10,height: 50, borderColor: 'gray', borderWidth: 1, width: '80%', color: 'white', backgroundColor: '#3b0317',}}
                    onChangeText={setMessage}
                    value={message}
                    multiline={true}
                    numberOfLines={50} // Ajusta este número según tus necesidades
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
  messageText: {
    wordWrap: 'break-word', // Agrega esta línea
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1B1A26',
    fontFamily: 'lucida grande',
    lineHeight: 80,
  },
  userMessage: {
    maxWidth: '80%',
    alignSelf: 'flex-end',
    backgroundColor: '#d1f5d3',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'column',

  },
  otherMessage: {
    maxWidth: '80%',
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'column',

  },
});
