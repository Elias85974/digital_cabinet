const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

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
            throw new Error('Network response was not ok');
        }
        return await response.text(); // This will be the success message
    } catch (error) {
        console.error("Failed to invite user:", error);
        throw error;
    }
};

// Function to delete a user from a house
export const deleteUserFromHouse = async (houseId, userId) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.text(); // This will be the success message
    } catch (error) {
        console.error("Failed to delete user from house:", error);
        throw error;
    }
};

// Function to get the inbox of a user
export const getUsersInbox = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/getInbox/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json(); // This will be the list of house IDs
    } catch (error) {
        console.error("Failed to get inbox:", error);
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
            throw new Error('Network response was not ok');
        }
        return await response.text(); // This will be the success message
    } catch (error) {
        console.error("Failed to process invitations:", error);
        throw error;
    }
};