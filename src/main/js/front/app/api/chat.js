import {FetchApi} from "../Api";

// Function to get all the chats of a user
export const getChats = async (navigation) => {
    return await FetchApi.getFetch(`/chats/user`, 'Failed to get chats:', navigation);
}

// Function to get the messages of a chat
export const getMessages = async (chatId, navigation) => {
    return await FetchApi.getFetch(`/chat/${chatId}/messages`, 'Failed to get messages:', navigation);
}

// Function to send a message to a chat
export const sendMessage = async (chatId, message, navigation) => {
    return await FetchApi.postFetch({}, `/chat/${chatId}/messages/${message}`, 'Failed to send message:', navigation);
}
