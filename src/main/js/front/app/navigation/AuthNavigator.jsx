import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../tabs/UserThings/LoginPage';
import RegisterPage from '../tabs/Registros/RegisterPage';
import Homes from '../tabs/UserThings/Homes'
import Index from "../index";
import RegisterHome from "../tabs/Registros/RegisterHome";
import RegisterProduct from "../tabs/Registros/RegisterProduct";
import House from "../tabs/House/House";
import Product from "../tabs/House/Product/[categoryId]";
import AddProduct from "../tabs/AddProduct/AddStock";
import WishList from "../tabs/UserThings/WishList";

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
            <Stack.Screen options={{headerShown: false}} name="WishList" component={WishList}/>
        </Stack.Navigator>
    );
}

export default AuthNavigator;