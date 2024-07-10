import { API_URL } from '../constants';
import {FetchApi} from "../Api";

// Function to get all the existing products from the database
export const getAllProducts = async (navigation) => {
    return await FetchApi.getFetch(`/products`, 'Failed to get products:', navigation);
}

// Function to create a product
export const createProduct = async (productData, navigation) => {
    return await FetchApi.putFetch(productData, `/products/${productData.categoryId}`, 'Failed to create product:', navigation);
}
