import {FetchApi} from "../Api";

// Function to get the messages of a chat
export const getMessages = async (chatId, navigation) => {
    return await FetchApi.getFetch(`/chat/${chatId}/messages`, 'Failed to get messages:', navigation);
}

// función que dado un userId traiga todos los chats en los que participa
export const getChats = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/chat/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get chats:", error);
        throw error;
    }
}


export const sendMessage = async (chatId, userId, message) => {
    try {
        const response = await fetch(`${API_URL}/chat/${1}/messages/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: message,
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.text();
    } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
    }
// Function to send a message to a chat
export const sendMessage = async (chatId, message, navigation) => {
    return await FetchApi.postFetch(message, `/chat/${chatId}/messages`, 'Failed to send message:', navigation);
}

// Function to get the chat notifications of a user
export const getChatNotifications = async (navigation) => {
    return await FetchApi.getFetch(`/chat/user/notifications`, 'Failed to get notifications:', navigation);
}