import { API_URL } from '../constants';
import {FetchApi} from "../Api";

// Function that get the list of stocks of a house
export const getHouseInventory2 = async (houseId) => {
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

export const getHouseInventory = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/categories`, 'Failed to get the house inventory:', navigation);
}

// Function that gets the list of products of a house and a category
export const getProductsFromHouseAndCategory2 = async (houseId, category) => {
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

export const getProductsFromHouseAndCategory = async (houseId, category, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/${category}/products`, 'Failed to get products:', navigation);
}

// Function that gets the list of products low on stock of a house
export const getLowOnStockProducts2 = async (houseId) => {
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

export const getLowOnStockProducts = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/lowOnStock`, 'Failed to get low on stock products:', navigation);
}

// Function to add stock to a house
export const updateHouseInventory2 = async (houseId, stockData) => {
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

export const updateHouseInventory = async (houseId, stockData, navigation) => {
    return await FetchApi.postFetch(stockData, `/houses/${houseId}/inventory`, 'Failed to update house inventory:', navigation);
}

// Function to add stock directly to a house
export const addStock2 = async (houseId, stockData) => {
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

export const addLowOnStockProduct = async (houseId, stockData, navigation) => {
    return await FetchApi.postFetch(stockData, `/houses/${houseId}/inventory/addLowStock`, 'Failed to add stock:', navigation);
}

// Route to reduce stock of a house
export const reduceStock2 = async (houseId, productId, quantity) => {
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

export const reduceStock = async (houseId, productId, quantity, navigation) => {
    return await FetchApi.postFetch({productId: productId, quantity: quantity}, `/houses/${houseId}/inventory/reduceStock`, 'Failed to reduce stock:', navigation);
}
