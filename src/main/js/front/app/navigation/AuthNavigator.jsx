import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../tabs/UserThings/Login/LoginPage';
import RegisterPage from '../tabs/Registros/RegisterPage';
import Homes from '../tabs/UserThings/Homes'
import Index from "../index";
import RegisterHome from "../tabs/Registros/RegisterHome";
import RegisterProduct from "../tabs/Registros/RegisterProduct";
import House from "../tabs/House/House";
import ByCategory from "../tabs/Product/ByCategory";
import AddProduct from "../tabs/Product/AddStock";
import WishList from "../tabs/UserThings/WishList";
import Inbox from "../tabs/UserThings/Inbox";
import HouseUsersPage from "../tabs/House/HouseUsersPage";
import HouseUsersPageDelete from "../tabs/House/HouseUsersPageDelete";
import LowOnStockProducts from "../tabs/Product/LowOnStockProducts";
import Settings from "../tabs/Settings/Settings";
import Chat from "../tabs/UserThings/Chat/Chat";
import GroupsChats from "../tabs/UserThings/GroupsChats";
import PieChart from "../tabs/Product/PieChart";
import AllProducts from "../tabs/Product/AllProducts";

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
                <Stack.Screen options={{headerShown: false}} name="Product" component={ByCategory} />
                <Stack.Screen options={{headerShown: false}} name="AddStock" component={AddProduct}/>
                <Stack.Screen options={{headerShown: false}} name="WishList" component={WishList} />
                <Stack.Screen options={{headerShown: false}} name="Inbox" component={Inbox} />
                <Stack.Screen options={{headerShown: false}} name="HouseUsersPage" component={HouseUsersPage} />
                <Stack.Screen options={{headerShown: false}} name="HouseUsersPageDelete" component={HouseUsersPageDelete} />
                <Stack.Screen options={{headerShown: false}} name="LowOnStock" component={LowOnStockProducts} />
                <Stack.Screen options={{headerShown: false}} name="Settings" component={Settings} />
                <Stack.Screen options={{headerShown: false}} name="Chat" component={Chat} />
                <Stack.Screen options={{headerShown: false}} name="GroupsChats" component={GroupsChats} />
                <Stack.Screen options={{headerShown: false}} name="PieChart" component={PieChart} />
                <Stack.Screen options={{headerShown: false}} name="All Products" component={AllProducts} />

            </Stack.Navigator>
    );
}



export default AuthNavigator;
