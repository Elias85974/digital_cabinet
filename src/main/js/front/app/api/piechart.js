import { API_URL } from '../constants';
import {FetchApi} from "../Api";

// Function to get the total value of the inventory of a house grouped by category
export const getInventoryValueByCategory2 = async (houseId) => {
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

export const getInventoryValueByCategory = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/valueByCategory`, 'Failed to get inventory value by category:', navigation);
}