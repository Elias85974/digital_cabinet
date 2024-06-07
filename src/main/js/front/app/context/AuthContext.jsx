import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({
    userToken: null,
    email: null,
    signIn: () => {},
    signOut: () => {},
});

export function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(null);
    const [email, setEmail] = useState(null);

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

    const signIn = async (token, email) => {
        try {
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('email', email);
            setUserToken(token);
            setEmail(email);
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
        <AuthContext.Provider value={{ userToken, email, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}