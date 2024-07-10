import {FetchApi} from "../Api";

// Function to create a house
export const createHouse = async (houseData, navigation) => {
    return await FetchApi.putFetch(houseData, '/houses', 'Failed to create house:', navigation);
}

// Function to get the list of users of a house
export const getUsersOfAHouse = async (houseId, navigation) => {
    return await FetchApi.getFetch(`/houses/${houseId}/users`, 'Failed to get house users:', navigation);
}

// Function to invite a user to a house
export const inviteUser = async (data, navigation) => {
    return await FetchApi.putFetch(data, '/houses/inviteUser', 'Failed to invite user:', navigation);
}

// Function to delete a user from a house
export const deleteUserFromHouse = async (houseId, userId, navigation) => {
    return await FetchApi.deleteFetch({}, `/houses/${houseId}/users/${userId}`, 'Failed to delete user from house:', navigation);
}

// Function to process invitations of the inbox
export const processInvitation = async (invitation, navigation) => {
    return await FetchApi.postFetch(invitation, '/houses/inbox/processInvitation', 'Failed to process invitations:', navigation);
}
