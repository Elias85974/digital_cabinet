import { API_URL } from '../constants';
import {FetchApi} from "../Api";

// Function to get all the existing products from the database
export const getAllProducts2 = async () => {
    try {
        const response = await fetch(`${API_URL}/products`, {
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

export const getAllProducts = async (navigation) => {
    return await FetchApi.getFetch(`/products`, 'Failed to get products:', navigation);
}

// Function to create a product
export const createProduct2 = async (productData) => {
    try {
        const response = await fetch(`${API_URL}/products/${productData.categoryId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to create product:", error);
        throw error;
    }
}

export const createProduct = async (productData, navigation) => {
    return await FetchApi.putFetch(productData, `/products/${productData.categoryId}`, 'Failed to create product:', navigation);
}
