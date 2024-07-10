import { API_URL } from '../constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const putFetch = async (putData, url, errorMessage, navigation) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('userToken');
        if (!userId || !token) {
            throw new Error("User not logged in");
        }
        const response = await fetch(`${API_URL + url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'UserId': userId,
                'Token': token,
            },
            body: JSON.stringify(putData)
        });

        console.log(response);
        await validateResponse(response, navigation);
        return await response.text();
    } catch (error) {
        console.error(errorMessage, error);
        throw error;
    }
};

export const postFetch = async (postData, url, errorMessage, navigation) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('userToken');
        if (!userId || !token) {
            throw new Error("User not logged in");
        }
        const response = await fetch(`${API_URL + url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'UserId': userId,
                'Token': token,
            },
            body: JSON.stringify(postData)
        });
        console.log(response);
        await validateResponse(response, navigation);
        return await response.text();
    } catch (error) {
        console.error(errorMessage, error);
        throw error;
    }
}

export const getFetch = async (url, errorMessage, navigation) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('userToken');
        if (!userId || !token) {
            throw new Error("User not logged in");
        }
        const response = await fetch(`${API_URL + url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'UserId': userId,
                'Token': token,
            },
        });
        console.log(response);
        await validateResponse(response, navigation);
        return await response.json();
    } catch (error) {
        console.error(errorMessage, error);
        throw error;
    }
}

export const deleteFetch = async (deleteData, url, errorMessage, navigation) => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('userToken');
        if (!userId || !token) {
            throw new Error("User not logged in");
        }
        const response = await fetch(`${API_URL + url}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'UserId': userId,
                'Token': token,
            },
            body: JSON.stringify(deleteData)
        });
        console.log(response);
        await validateResponse(response, navigation);
        return await response.text();
    } catch (error) {
        console.error(errorMessage, error);
        throw error;
    }
}

export const unauthenticatedPost = async (postData, url, errorMessage) => {
    try {
        const response = await fetch(`${API_URL + url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error(errorMessage, error);
        throw error;
    }
};

const validateResponse = async (response, navigation) => {
    if (!response.ok) {
        const errorMessage = await response.text();
        if (errorMessage === "Unauthorized") {
            await AsyncStorage.removeItem('userId');
            await AsyncStorage.removeItem('userToken');
            if (navigation) {
                navigation.navigate("Index");
            }
        }
        throw new Error(errorMessage);
    }
}