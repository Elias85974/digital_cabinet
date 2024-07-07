const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

// Function to add stock to a house
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
        const response = await fetch(`${API_URL}/houses/${houseId}/addLowStock`, {
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
export const reduceStock = async (houseId, productId, quantity) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/inventory/reduceStock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({productId: productId, quantity: quantity})
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error("Failed to reduce stock:", error);
        throw error;
    }
}

