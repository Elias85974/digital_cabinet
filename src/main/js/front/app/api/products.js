import {FetchApi} from "../Api";

// Function to get all the existing products from the database
export const getAllProducts = async (navigation) => {
    return await FetchApi.getFetch(`/products`, 'Failed to get products:', navigation);
}

// Function to create a product
export const createProduct = async (productData, navigation) => {
    return await FetchApi.putFetch(productData, `/products/${productData.categoryId}`, 'Failed to create product:', navigation);
}

// Function to get all the products unverified
export const getUnverifiedProducts = async (navigation) => {
    return await FetchApi.getFetch(`/productsVer`, 'Failed to get unverified products:', navigation);
}

// Function to verify a product
export const verifyProduct = async (isVerified, navigation) => {
    return await FetchApi.postFetch(isVerified, `/products/adminVerify`, 'Failed to verify product:', navigation);
}
