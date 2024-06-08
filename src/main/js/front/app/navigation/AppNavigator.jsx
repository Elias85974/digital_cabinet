import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Index from '../index.js';


const Stack = createStackNavigator();

function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Index" component={Index} />
        </Stack.Navigator>
    );
}

export default AppNavigator;