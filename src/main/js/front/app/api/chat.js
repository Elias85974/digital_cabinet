const API_URL = 'http://localhost:4321'; // Reemplaza esto con la URL real de tu backend

// Función para crear un nuevo chat
export const createChat = async (houseId, chatData) => {
    try {
        const response = await fetch(`${API_URL}/api/houses/${houseId}/chats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to create chat:", error);
        throw error;
    }
};

// Función para obtener todos los chats de un usuario
export const getChats = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/api/users/${userId}/chats`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get chats:", error);
        throw error;
    }
};

// Función para obtener un chat específico de una casa
export const getChat = async (houseId, chatId) => {
    try {
        const response = await fetch(`${API_URL}/api/houses/${houseId}/chats/${chatId}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get chat:", error);
        throw error;
    }
};


// Función para actualizar todos los chats de un usuario
export const updateAllUserChats = async (userId, chatsData) => {
    try {
        const updatePromises = chatsData.map((chatData) =>
            fetch(`${API_URL}/api/users/${userId}/chats/${chatData.chatId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chatData),
            })
        );

        const responses = await Promise.all(updatePromises);

        responses.forEach((response, index) => {
            if (!response.ok) {
                throw new Error(`Failed to update chat ${chatsData[index].chatId}: Network response was not ok`);
            }
        });

        return await Promise.all(responses.map(response => response.json()));
    } catch (error) {
        console.error("Failed to update chats:", error);
        throw error;
    }
};

// Función para actualizar un chat específico de una casa
export const updateChat = async (houseId, chatId, chatData) => {
    try {
        const response = await fetch(`${API_URL}/api/houses/${houseId}/chats/${chatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chatData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to update chat:", error);
        throw error;
    }
};

// Función para eliminar un chat específico de una casa
export const deleteChat = async (houseId, chatId) => {
    try {
        const response = await fetch(`${API_URL}/api/houses/${houseId}/chats/${chatId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to delete chat:", error);
        throw error;
    }
};


