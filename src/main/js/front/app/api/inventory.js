import {FetchApi} from "../Api";

// Function that get the list of stocks of a house
export const getHouseInventory = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/categories`, 'Failed to get the house inventory:', navigation);
}

// Function that gets the list of products of a house and a category
export const getProductsFromHouseAndCategory = async (houseId, category, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/${category}/products`, 'Failed to get products:', navigation);
}

// Function that gets the list of products low on stock of a house
export const getLowOnStockProducts = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/lowOnStock`, 'Failed to get low on stock products:', navigation);
}

// Function that gets the list of products of a house
export const getStockProducts = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/stock`, 'Failed to get stock products:', navigation);
}

// Function to add stock to a house
export const updateHouseInventory = async (houseId, stockData, navigation) => {
    return await FetchApi.postFetch(stockData, `/houses/${houseId}/inventory`, 'Failed to update house inventory:', navigation);
}

// Function to add stock directly to a house
export const addLowOnStockProduct = async (houseId, stockData, navigation) => {
    return await FetchApi.postFetch(stockData, `/houses/${houseId}/inventory/addLowStock`, 'Failed to add stock:', navigation);
}

// Route to reduce stock of a house
export const reduceStock = async (houseId, productId, quantity, navigation) => {
    return await FetchApi.postFetch({productId: productId, quantity: quantity}, `/houses/${houseId}/inventory/reduceStock`, 'Failed to reduce stock:', navigation);
}
