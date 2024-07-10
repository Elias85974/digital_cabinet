import {FetchApi} from "../Api";

// Function to create a user
export const createUser = async (userData) => {
    await FetchApi.unauthenticatedPost(userData, '/register', 'Failed to create user:');
}

// Function to edit the user
export const editUser = async (userData, navigation) => {
    await FetchApi.postFetch(userData, '/users/editUser', 'Failed to edit user:', navigation);
}

// Function to delete the user
export const deleteUser = async (navigation) => {
    await FetchApi.deleteFetch({}, '/users/deleteUser', 'Failed to delete user:', navigation);
}

// Function to log in a User
export const loginUser = async (credentials) => {
    return await FetchApi.unauthenticatedPost(credentials, '/login', 'Failed to login user:');
}

// Function to log out a User
export const logoutUser = async (navigation) => {
    await FetchApi.deleteFetch({}, `/logout`, 'Failed to logout user:', navigation);
}

// Function to get the houses of the user
export const getUserHouses = async (navigation) => {
    return await FetchApi.getFetch(`/users/user/getHouses`, 'Failed to get user houses:', navigation);
}
