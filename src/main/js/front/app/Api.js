const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL
/*const jwt = require('jsonwebtoken');*/
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
            throw new Error('Network response was not okeyyyyyy girl');
        }

        return null; //await response.json();
    } catch (error) {
        console.error("Failed to create house:", error);
        throw error;
    }
};


export const getUserHouses = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}/houses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not oooooooook');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get user houses:", error);
        throw error;
    }
}

// Function to get the list of users of a house
export const getUsersOfAHouse = async (houseId) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get house users:", error);
        throw error;
    }
}

// function that get the list of stocks of a house
export const getHouseInventory = async (houseId) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/inventory`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get house inventory:", error);
        throw error;
    }
}

// Function that gets the list of products of a house and a category
export const getProductsFromHouseAndCategory = async (houseId, category) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/products/${category}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get products:", error);
        throw error;
    }
}

// Function that gets the list of products low on stock of a house
export const getLowOnStockProducts = async (houseId) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/lowOnStock`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get low on stock products:", error);
        throw error;
    }
}

// function to create a product
export const createProduct = async (productData) => {
    try {
        const response = await fetch(`${API_URL}/products/${productData.categoryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        if (!response.ok) {
            throw new Error('Network response was not okeydoki');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to create product:", error);
        throw error;
    }
}

export const getCategories = async () => {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not lol');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get categories:", error);
        throw error;
    }
}

export const createCategory = async (categoryData) => {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to create category:", error);
        throw error;
    }
}

export const getAllProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get products:", error);
        throw error;
    }
}

export const updateHouseInventory = async (houseId, stockData) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stockData)
        });
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error("Failed to update house inventory:", error);
        throw error;
    }
}

// Function to add stock directly to a house
export const addStock = async (houseId, stockData) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/inventory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stockData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error("Failed to add stock:", error);
        throw error;
    }

}

// Route to reduce stock of a house
export const reduceStock = async (houseId, stockData) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/inventory/addStock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(stockData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error("Failed to reduce stock:", error);
        throw error;
    }
}


//WishList logic here
export const getWishList = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/wishList/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get wish list:", error);
        throw error;
    }
}

export const addProductToWishList = async (product) => {
    try {
        const response = await fetch(`${API_URL}/wishList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to add product to wish list:", error);
        throw error;
    }

}

export const deleteProductFromWishList = async (products, userId) => {
    try {
        const response = await fetch(`${API_URL}/wishList/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: products
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to delete product from wish list:", error);
        throw error;
    }
}

export const updateProductInWishList = async (product) => {
    try {
        const response = await fetch(`${API_URL}/wishList/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to update product in wish list:", error);
        throw error;
    }
}




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
export const processInvitations = async (invitations) => {
    // Invitations is an array of objects with the following structure:
    // {"userId": "user_id", "houseId": "house_id", "isAccepted": true_or_false}
    try {
        const response = await fetch(`${API_URL}/processInvitations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invitations),
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