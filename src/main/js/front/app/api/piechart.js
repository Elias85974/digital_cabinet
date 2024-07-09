import { API_URL } from '../constants';

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
};