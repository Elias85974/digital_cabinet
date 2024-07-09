import { API_URL } from '../constants';
import {FetchApi} from "../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to create a user
export const createUser2 = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to create user:", error);
        throw error;
    }
};

export const createUser = async (userData) => {
    await FetchApi.unauthenticatedPost(userData, '/register', 'Failed to create user:');
}

export const editUser = async (userData, navigation) => {
    await FetchApi.postFetch(userData, '/users/editUser', 'Failed to edit user:', navigation);
}

export const deleteUser = async (navigation) => {
    await FetchApi.deleteFetch({}, '/users/deleteUser', 'Failed to delete user:', navigation);
}

// Function to log in a User
export const loginUser2 = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        const responseData = await response.json();

        // Verifica si la respuesta incluye un token
        /*if (responseData.token) {
            const saveData = (data) => {
                localStorage.setItem('myDataKey', data);
            };
            // Guarda el token y otros datos en el almacenamiento local
            saveData(JSON.stringify(responseData));

            console.log("Token guardado:", responseData.token);

        } else {
            // Si la respuesta no incluye un token, lanza un error
            throw new Error('Token not found in response');
        }*/
        return responseData; // Devuelve la respuesta completa, que puede contener otros datos además del token

    } catch (error) {
        console.error("Failed to login user:", error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    return await FetchApi.unauthenticatedPost(credentials, '/login', 'Failed to login user:');
}

// Function to log out a User
export const logoutUser2 = async () => {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
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
        console.error("Failed to logout user:", error);
        throw error;
    }
};

export const logoutUser = async (navigation) => {
    await FetchApi.deleteFetch({}, `/logout`, 'Failed to logout user:', navigation);
}

/*export const authentication = async() => {
    try {
        const data = localStorage.getItem('myDataKey');
        let parsedData = JSON.parse(data);
        const response = await fetch(`${API_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': parsedData.token,
                'Email': parsedData.email
            },
        })
        console.log(response);
        return response.status === 200;
    } catch (error) {
        console.error("Failed to authenticate user:", error);
        throw error;
    }
}*/

export const getUserHouses2 = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}/houses`, {
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
        console.error("Failed to get user houses:", error);
        throw error;
    }
}

export const getUserHouses = async (navigation) => {
    return await FetchApi.getFetch(`/users/user/getHouses`, 'Failed to get user houses:', navigation);
}
