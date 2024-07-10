import {FetchApi} from "../Api";

// Function to get the messages of a chat
export const getMessages = async (chatId, navigation) => {
    return await FetchApi.getFetch(`/chat/${chatId}/messages`, 'Failed to get messages:', navigation);
}

// Function to send a message to a chat
export const sendMessage = async (chatId, message, navigation) => {
    return await FetchApi.postFetch(message, `/chat/${chatId}/messages`, 'Failed to send message:', navigation);
}

// Function to get the chat notifications of a user
export const getChatNotifications = async (navigation) => {
    return await FetchApi.getFetch(`/chat/user/notifications`, 'Failed to get notifications:', navigation);
}