import {FetchApi} from '../Api';

// Function to get all the existing products from the database
export const getAllProducts = async (navigation) => {
    return await FetchApi.getFetch(`/products`, 'Failed to get products:', navigation);
}



