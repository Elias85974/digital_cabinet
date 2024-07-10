import {FetchApi} from "../Api";

// Function to get the total value of the inventory of a house grouped by category
export const getInventoryValueByCategory = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/inventory/valueByCategory`, 'Failed to get inventory value by category:', navigation);
}