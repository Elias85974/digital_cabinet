const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL


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