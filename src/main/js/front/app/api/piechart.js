const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

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
            throw new Error('Network response was not ok');
        }
        return await response.json(); // This will be a map with category names as keys and total values as values
    } catch (error) {
        console.error("Failed to get inventory value by category:", error);
        throw error;
    }
};