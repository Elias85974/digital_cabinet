import {FetchApi} from "../Api";

// Function to get the house invitations of a user
export const getUsersHouseInvitations = async (navigation) => {
    return await FetchApi.getFetch(`/inbox/getHouseInvitations`, 'Failed to get house invitations:', navigation);
}

// Function to get the near expirations products of the house of a user
export const getNearExpirationStocks = async (navigation) => {
    return await FetchApi.getFetch(`/inbox/getSoonToExpire`, 'Failed to get near expiration stocks:', navigation);
}

// Function to receive chat notifications of a user
export const getChatNotifications = async (navigation) => {
    return await FetchApi.getFetch(`/inbox/getChatNotifications`, 'Failed to get chat notifications:', navigation);
}
