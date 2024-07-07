import { API_URL } from '../constants';

// Function that get the list of stocks of a house
export const getHouseInventory = async (houseId) => {
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/inventory`, {
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
            const errorMessage = await response.text();
            throw new Error(errorMessage);
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
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to get low on stock products:", error);
        throw error;
    }
}

// Function to get the total value of the inventory of a house grouped by category
export const getInventoryValueByCategory = async (houseId) => {
    // [{category: category, value: totalValue}, {category: category, value: totalValue}, ...]
    try {
        const response = await fetch(`${API_URL}/houses/${houseId}/inventory/valueByCategory`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json(); // This will be a map with category names as keys and total values as values
    } catch (error) {
        console.error("Failed to get inventory value by category:", error);
        throw error;
    }
};

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
            const errorMessage = await response.text();
            throw new Error(errorMessage);
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
            const errorMessage = await response.text();
            throw new Error(errorMessage);
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
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Failed to reduce stock:", error);
        throw error;
    }
}
