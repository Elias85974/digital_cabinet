const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

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
    const token = localStorage.getItem('token');
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

export const getUserIdByEmail = async (token, email) => {
    try {
        const response = await fetch(`${API_URL}/user/email/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not nais');
        }
        return await response.text(); // Devuelve el ID del usuario como una cadena
    } catch (error) {
        console.error("Failed to get user ID:", error);
        throw error;
    }
}
