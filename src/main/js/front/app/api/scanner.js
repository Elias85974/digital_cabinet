import {FetchApi} from '../Api';

// Function to get the product by its barcode
export const getProductByBarcode = async (data, navigation) => {
    return await FetchApi.getFetch(`/products/${data}`, 'Failed to get product:', navigation);
}

// Function to create a product with the barcode
export const createProductByBarcode = async (barcode, categoryId, productData, navigation) => {
    return await FetchApi.putFetch(productData, `/products/${categoryId}/barcode/${barcode}`, 'Failed to create product:', navigation);
}
