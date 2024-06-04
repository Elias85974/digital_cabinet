import React, { useContext, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { AuthContext, AuthProvider } from './context/AuthContext';

function App() {
    const { userToken } = useContext(AuthContext);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {userToken ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}

export default function Root() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});