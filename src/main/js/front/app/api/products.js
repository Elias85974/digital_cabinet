const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

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
