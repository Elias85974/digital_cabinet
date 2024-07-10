import {FetchApi} from "../Api";

// Function to get the categories from the backend
export const getCategories = async (navigation) => {
    return await FetchApi.getFetch('/categories', 'Failed to get categories:', navigation);
}

// Function to create a new category
export const createCategory = async (categoryData, navigation) => {
    return await FetchApi.putFetch(categoryData, '/categories', 'Failed to create category:', navigation);
}