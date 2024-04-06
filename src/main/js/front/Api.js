const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

// Function to list users
export const listUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users1`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw error;
    }
};

// Function to create a user
export const createUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
    }
};

// Function to edit a user
export const editUser = async (userId, userData) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to edit user:", error);
        throw error;
    }
};

// Function to delete a user
export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw error;
    }
};

// Function to get a simple "Hello, World" message
export const getHelloWorld = async () => {
    try {
        const response = await fetch(`${API_URL}/hello`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.text();
    } catch (error) {
        console.error("Failed to fetch hello world:", error);
        throw error;
    }
};

// Function to get a webpage with the current date and time
export const getWebV1 = async () => {
    try {
        const response = await fetch(`${API_URL}/web/v1`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.text();
    } catch (error) {
        console.error("Failed to fetch web v1:", error);
        throw error;
    }
};