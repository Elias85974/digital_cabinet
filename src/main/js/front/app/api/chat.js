import { API_URL } from '../constants';
import {FetchApi} from "../Api";

export const getMessages2 = async (chatId) => {
    try {
        const response = await fetch(`${API_URL}/chat/${chatId}/messages`, {
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
        console.error("Failed to get messages:", error);
        throw error;
    }
}

export const getMessages = async (chatId, navigation) => {
    return await FetchApi.getFetch(`/chat/${chatId}/messages`, 'Failed to get messages:', navigation);
}

export const sendMessage2 = async (chatId, userId, message) => {
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
}

export const sendMessage = async (chatId, message, navigation) => {
    return await FetchApi.postFetch(message, `/chat/${chatId}/messages`, 'Failed to send message:', navigation);
}

export const getChatNotifications2 = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/chat/${userId}/notifications`, {
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
        console.error("Failed to get notifications:", error);
        throw error;
    }
}

export const getChatNotifications = async (navigation) => {
    return await FetchApi.getFetch(`/chat/user/notifications`, 'Failed to get notifications:', navigation);
}