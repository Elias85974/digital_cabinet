import {FetchApi} from "../Api";

// Function to get the wish list of the user
export const getWishList = async (navigation) => {
    return await FetchApi.getFetch(`/wishList`, 'Failed to get wish list:', navigation);
}

// Function to add a product to the wish list
export const addProductToWishList = async (product, navigation) => {
    return await FetchApi.putFetch({productName: product}, `/wishList`, 'Failed to add product to wish list:', navigation);
}

// Function to delete a product from the wish list
export const deleteProductsFromWishList = async (product, navigation) => {
    return await FetchApi.deleteFetch(product, `/wishList`, 'Failed to delete product from wish list:', navigation);
}
