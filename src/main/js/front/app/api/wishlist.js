import { API_URL } from '../constants';

export const getWishList = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/wishList/${userId}`, {
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
        console.error("Failed to get wish list:", error);
        throw error;
    }
}

export const addProductToWishList = async (product, userId) => {
    try {
        const response = await fetch(`${API_URL}/wishList/${userId}/${product}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.text();
    } catch (error) {
        console.error("Failed to add product to wish list:", error);
        throw error;
    }
}

export const deleteProductFromWishList = async (products, userId) => {
    try {
        const response = await fetch(`${API_URL}/wishList/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: products
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to delete product from wish list:", error);
        throw error;
    }
}

export const updateProductInWishList = async (product) => {
    try {
        const response = await fetch(`${API_URL}/wishList/${product.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to update product in wish list:", error);
        throw error;
    }
}