import { API_URL } from '../constants';
import {FetchApi} from "../Api";

// function to create a house
export const createHouse2 = async (houseData, userId) => {
    try {
        const response = await fetch(`${API_URL}/houses/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(houseData)
        });

        // Add a delay here
        //await new Promise(resolve => setTimeout(resolve, 3000));

        console.log(response);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return null; //await response.json();
    } catch (error) {
        console.error("Failed to create house:", error);
        throw error;
    }
};

export const createHouse = async (houseData, navigation) => {
    return await FetchApi.putFetch(houseData, '/houses', 'Failed to create house:', navigation);
}

// Function to get the list of users of a house
export const getUsersOfAHouse2 = async (houseId, userId) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/users/${userId}`, {
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
        console.error("Failed to get house users:", error);
        throw error;
    }
}

export const getUsersOfAHouse = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/users`, 'Failed to get house users:', navigation);
}

// Function to invite a user to a house
export const inviteUser2 = async (data) => {
    try {
        const response = await fetch(`${API_URL}/inviteUser`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            // Throw an error with the message from the backend
            throw new Error(errorMessage);
        }
        return await response.text(); // This will be the success message
    } catch (error) {
        console.error("Failed to invite user:", error);
        throw error;
    }
};

export const inviteUser = async (data, navigation) => {
    return await FetchApi.putFetch(data, '/houses/inviteUser', 'Failed to invite user:', navigation);
}

// Function to delete a user from a house
export const deleteUserFromHouse2 = async (houseId, userId) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.text(); // This will be the success message
    } catch (error) {
        console.error("Failed to delete user from house:", error);
        throw error;
    }
};

export const deleteUserFromHouse = async (houseId, userId, navigation) => {
    return await FetchApi.deleteFetch({}, `/houses/${houseId}/users/${userId}`, 'Failed to delete user from house:', navigation);
}

// Function to process invitations of the inbox
export const processInvitations2 = async (invitation) => {
    // Invitations is an array of objects with the following structure:
    // {"userId": "user_id", "houseId": "house_id", "isAccepted": true_or_false}
    try {
        const response = await fetch(`${API_URL}/houses/inbox/processInvitation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invitation),
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.text(); // This will be the success message
    } catch (error) {
        console.error("Failed to process invitations:", error);
        throw error;
    }
};

export const processInvitation = async (invitation, navigation) => {
    return await FetchApi.postFetch(invitation, '/houses/inbox/processInvitation', 'Failed to process invitations:', navigation);
}
