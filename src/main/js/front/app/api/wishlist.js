import { API_URL } from '../constants';
import {FetchApi} from "../Api";

export const getWishList2 = async (userId) => {
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

export const getWishList = async (navigation) => {
    return await FetchApi.getFetch(`/wishList`, 'Failed to get wish list:', navigation);
}

export const addProductToWishList2 = async (product, userId) => {
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

export const addProductToWishList = async (product, navigation) => {
    return await FetchApi.putFetch({productName: product}, `/wishList`, 'Failed to add product to wish list:', navigation);
}

export const deleteProductsFromWishList2 = async (products, userId) => {
    try {
        const response = await fetch(`${API_URL}/wishList/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(products)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.text();
    } catch (error) {
        console.error("Failed to delete product from wish list:", error);
        throw error;
    }
}

export const deleteProductsFromWishList = async (product, navigation) => {
    return await FetchApi.deleteFetch(product, `/wishList`, 'Failed to delete product from wish list:', navigation);
}
