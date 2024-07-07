const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

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



