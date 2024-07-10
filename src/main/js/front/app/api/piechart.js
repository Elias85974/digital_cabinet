import {FetchApi} from "../Api";

// Function to get the total value of the inventory of a house grouped by category
export const getInventoryValueByCategory = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/valueByCategory`, 'Failed to get inventory value by category:', navigation);
}


import { API_URL } from '../constants';


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
};