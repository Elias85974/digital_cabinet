import { API_URL } from '../constants';

// function to create a house
export const createHouse = async (houseData, userId) => {
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

// Function to get the list of users of a house
export const getUsersOfAHouse = async (houseId, userId) => {
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

// Function to delete a user from a house
export const deleteUserFromHouse = async (houseId, userId) => {
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

// Function to invite a user to a house
export const inviteUser = async (data) => {
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

// Function to process invitations of the inbox
export const processInvitations = async (invitation) => {
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