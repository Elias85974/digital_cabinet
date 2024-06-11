import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../tabs/UserThings/LoginPage';
import RegisterPage from '../tabs/Registros/RegisterPage';
import Homes from '../tabs/UserThings/Homes'
import Index from "../index";
import RegisterHome from "../tabs/Registros/RegisterHome";
import RegisterProduct from "../tabs/Registros/RegisterProduct";
import House from "../tabs/House/House";
import FilteredProducts from "../tabs/House/Product/FilteredProducts";
import AddProduct from "../tabs/AddProduct/AddStock";
import UserThingsBeforeHouse from "../tabs/UserThings/UserThingsBeforeHouse";
import WishList from "../tabs/UserThings/WishList";
import Inbox from "../tabs/UserThings/Inbox";
import HouseUsersPage from "../tabs/House/HouseUsersPage";
import HouseUsersPageEdit from "../tabs/House/HouseUsersPageEdit";
import HouseUsersPageDelete from "../tabs/House/HouseUsersPageDelete";

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
            <Stack.Screen options={{headerShown: false}} name="Product" component={FilteredProducts} />
            <Stack.Screen options={{headerShown: false}} name="AddStock" component={AddProduct}/>
            <Stack.Screen options={{headerShown: false}} name="UserThingsBeforeHouse" component={UserThingsBeforeHouse}/>
            <Stack.Screen options={{headerShown: false}} name="WishList" component={WishList} />
            <Stack.Screen options={{headerShown: false}} name="Inbox" component={Inbox} />
            <Stack.Screen options={{headerShown: false}} name="HouseUsersPage" component={HouseUsersPage} />
            <Stack.Screen options={{headerShown: false}} name="HouseUsersPageDelete" component={HouseUsersPageDelete} />
            <Stack.Screen options={{headerShown: false}} name="HouseUsersPageEdit" component={HouseUsersPageEdit} />



        </Stack.Navigator>
    );
}

export default AuthNavigator;
