import { API_URL } from '../constants';

export const getMessages = async (chatId, userId) => {
    try {
        const response = await fetch(`${API_URL}/chat/${chatId}/messages/${userId}`, {
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

export const sendMessage = async (chatId, userId, message) => {
    try {
        const response = await fetch(`${API_URL}/chat/${chatId}/messages/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
    }
}

export const getChatNotifications = async (userId) => {
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