import { API_URL } from '../constants';
import {FetchApi} from "../Api";

// Function to get the house invitations of a user
export const getUsersHouseInvitations2 = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/getHouseInvitations/${userId}`, {
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

export const getUsersHouseInvitations = async (navigation) => {
    return await FetchApi.getFetch(`/inbox/getHouseInvitations`, 'Failed to get house invitations:', navigation);
}

// Function to get the near expirations products of the house of a user
export const getNearExpirationStocks2 = async (userId) => {
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

export const getNearExpirationStocks = async (navigation) => {
    return await FetchApi.getFetch(`/inbox/getSoonToExpire`, 'Failed to get near expiration stocks:', navigation);
}

// Function to receive chat notifications of a user
export const getChatNotifications2 = async (userId) => {
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

export const getChatNotifications = async (navigation) => {
    return await FetchApi.getFetch(`/inbox/getChatNotifications`, 'Failed to get chat notifications:', navigation);
}
