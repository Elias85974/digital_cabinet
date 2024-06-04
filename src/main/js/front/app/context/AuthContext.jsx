import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
    userToken: null,
    signIn: () => {},
    signOut: () => {},
});

export function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    setUserToken(token);
                }
            } catch (e) {
                console.error('Failed to load token', e);
            }
        };

        loadToken();
    }, []);

    const signIn = async () => {
        const token = 'dummy-auth-token'; // Replace with your actual sign-in logic
        try {
            await AsyncStorage.setItem('userToken', token);
            setUserToken(token);
        } catch (e) {
            console.error('Failed to save token', e);
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setUserToken(null);
        } catch (e) {
            console.error('Failed to remove token', e);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}