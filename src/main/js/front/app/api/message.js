const API_URL = 'http://localhost:4321'; // Reemplaza esto con la URL real de tu backend

// Función para crear un nuevo mensaje en un chat
export const createMessage = async (houseId, chatId, messageData) => {
    try {
        const response = await fetch(`${API_URL}/api/houses/${houseId}/chats/${chatId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to create message:", error);
        throw error;
    }
};

// Función para obtener todos los mensajes de un chat
export const getMessages = async (houseId, chatId) => {
    try {
        const response = await fetch(`${API_URL}/api/houses/${houseId}/chats/${chatId}/messages`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get messages:", error);
        throw error;
    }
};

// Función para obtener un mensaje específico de un chat
export const getMessage = async (houseId, chatId, messageId) => {
    try {
        const response = await fetch(`${API_URL}/api/houses/${houseId}/chats/${chatId}/messages/${messageId}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get message:", error);
        throw error;
    }
};

// Función para actualizar un mensaje específico de un chat
export const updateMessage = async (houseId, chatId, messageId, messageData) => {
    try {
        const response = await fetch(`${API_URL}/api/houses/${houseId}/chats/${chatId}/messages/${messageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to update message:", error);
        throw error;
    }
};

// Función para eliminar un mensaje específico de un chat
export const deleteMessage = async (houseId, chatId, messageId) => {
    try {
        const response = await fetch(`${API_URL}/api/houses/${houseId}/chats/${chatId}/messages/${messageId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to delete message:", error);
        throw error;
    }
};