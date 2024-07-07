const API_URL = 'http://localhost:4321'; // Replace this with your actual backend URL

// Api.js
import * as UsersApi from './api/users';
import * as HousesApi from './api/houses';
import * as ProductsApi from './api/products';
import * as CategoriesApi from './api/categories';
import * as InventoryApi from './api/inventory';
import * as WishlistApi from './api/wishlist';
import * as InboxApi from './api/inbox';

export {
    UsersApi,
    HousesApi,
    ProductsApi,
    CategoriesApi,
    InventoryApi,
    WishlistApi,
    InboxApi,
};