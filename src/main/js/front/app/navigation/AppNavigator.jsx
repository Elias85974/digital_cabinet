import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '../index.js';
import LoginPage from "../tabs/UserThings/LoginPage";


const Stack = createStackNavigator();

function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{headerShown: false}} name="LoginPage" component={LoginPage} />
        </Stack.Navigator>
    );
}

export default AppNavigator;