import { API_URL } from '../constants';
import {FetchApi} from "../Api";

export const getCategories2 = async () => {
    try {
        const response = await fetch(`${API_URL}/categories`, {
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
        console.error("Failed to get categories:", error);
        throw error;
    }
}

export const getCategories = async (navigation) => {
    return await FetchApi.getFetch('/categories', 'Failed to get categories:', navigation);
}

export const createCategory2 = async (categoryData) => {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to create category:", error);
        throw error;
    }
}

export const createCategory = async (categoryData, navigation) => {
    return await FetchApi.putFetch(categoryData, '/categories', 'Failed to create category:', navigation);
}