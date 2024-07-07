import { API_URL } from '../constants';

// Function to get the house invitations of a user
export const getUsersHouseInvitations = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/getInbox/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json(); // This will be the list of house IDs
    } catch (error) {
        console.error("Failed to get inbox:", error);
        throw error;
    }
};

// Function to get the near expirations products of the house of a user
export const getNearExpirationStocks = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/getSoonToExpire/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json(); // This will be the list of products
    } catch (error) {
        console.error("Failed to get near expirations:", error);
        throw error;
    }
};

// Function to receive chat notifications of a user
export const getChatNotifications = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/getChatNotifications/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json(); // This will be the list of chat notifications
    } catch (error) {
        console.error("Failed to get chat notifications:", error);
        throw error;
    }
};

// Function to get the inbox size of a user
export const getInboxSize = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/getInboxSize/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json(); // This will be the inbox size
    } catch (error) {
        console.error("Failed to get inbox size:", error);
        throw error;
    }
};