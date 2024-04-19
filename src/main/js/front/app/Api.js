const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL
const jwt = require('jsonwebtoken');
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

// Function to log in a User
export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        const result = await response.json();

        //Generate JWT Token
        const id = result(0);
        const token = jwt.sign({ id }, 'secret', { expiresIn: 300});
        localStorage.setItem('token', token);
        return result;
    } catch (error) {
        console.error("Failed to login user:", error);
        throw error;
    }
};
