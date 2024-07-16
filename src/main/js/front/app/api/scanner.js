import {FetchApi} from '../Api';

// Function to get the product by its barcode
export const getProductByBarcode = async (data, navigation) => {
    return await FetchApi.getFetch(`/products/${data}`, 'Failed to get product:', navigation);
}

// Function to create a product with the barcode
export const createProductByBarcode = async (barcode, categoryId, productData, navigation) => {
    return await FetchApi.putFetch(productData, `/products/${categoryId}/barcode/${barcode}`, 'Failed to create product:', navigation);
}

// Function to check if a product exists in the stock of a house
export const checkProductInStock = async (houseId, productId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/${productId}`, 'Failed to check product in stock:', navigation);
}
