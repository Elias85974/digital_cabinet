import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../tabs/LoginPage';
import RegisterPage from '../tabs/RegisterPage';
import Homes from '../tabs/Homes'
import Index from "../index";
import RegisterHome from "../tabs/RegisterHome";
import RegisterProduct from "../tabs/RegisterProduct";
import House from "../tabs/House/[houseId]";
import Product from "../tabs/House/Product/[categoryId]";
import AddProduct from "../tabs/AddProduct/[houseId]";

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
            <Stack.Screen options={{headerShown: false}} name="AddProduct" component={AddProduct}/>
        </Stack.Navigator>
    );
}

export default AuthNavigator;