import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../tabs/UserThings/LoginPage';
import RegisterPage from '../tabs/Registros/RegisterPage';
import Homes from '../tabs/UserThings/Homes'
import Index from "../index";
import RegisterHome from "../tabs/Registros/RegisterHome";
import RegisterProduct from "../tabs/Registros/RegisterProduct";
import House from "../tabs/House/House";
import Product from "../tabs/House/Product/Products";
import AddProduct from "../tabs/AddProduct/AddStock";
import WishList from "../tabs/UserThings/WishList";
import Inbox from "../tabs/UserThings/Inbox";
import HouseUsersPage from "../tabs/House/HouseUsersPage";
import HouseUsersPageDelete from "../tabs/House/HouseUsersPageDelete";
import LowOnStockProducts from "../tabs/House/Product/LowOnStockProducts";
import Settings from "../tabs/Settings/Settings";
import Chat from "../tabs/UserThings/Chat";


import Test from "../test.";
import {NavigationContainer} from "@react-navigation/native";

const Stack = createStackNavigator();

function AuthNavigator() {
    return (
            <Stack.Navigator>
                <Stack.Screen options={{headerShown: false}} name="Index" component={Index} />
                <Stack.Screen options={{headerShown: false}} name="LoginPage" component={LoginPage} />
                <Stack.Screen options={{headerShown: false}} name="RegisterPage" component={RegisterPage} />
                <Stack.Screen options={{headerShown: false}} name="Homes" component={Homes} />
                <Stack.Screen options={{headerShown: false}} name="RegisterHome" component={RegisterHome} />
                <Stack.Screen options={{headerShown: false}} name="RegisterProduct" component={RegisterProduct} />
                <Stack.Screen options={{headerShown: false}} name="House" component={House} />
                <Stack.Screen options={{headerShown: false}} name="Product" component={Product} />
                <Stack.Screen options={{headerShown: false}} name="AddStock" component={AddProduct}/>
                <Stack.Screen options={{headerShown: false}} name="WishList" component={WishList} />
                <Stack.Screen options={{headerShown: false}} name="Inbox" component={Inbox} />
                <Stack.Screen options={{headerShown: false}} name="HouseUsersPage" component={HouseUsersPage} />
                <Stack.Screen options={{headerShown: false}} name="HouseUsersPageDelete" component={HouseUsersPageDelete} />
                <Stack.Screen options={{headerShown: false}} name="LowOnStock" component={LowOnStockProducts} />
                <Stack.Screen options={{headerShown: false}} name="Settings" component={Settings} />
                <Stack.Screen options={{headerShown: false}} name="Chat" component={Chat} />
            </Stack.Navigator>
    );
}



export default AuthNavigator;
