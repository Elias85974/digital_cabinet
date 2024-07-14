import React, { useEffect } from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import {UsersApi} from "../../../Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthContext} from "../../../context/AuthContext";

const GoogleLogin = ({navigation, setIsLoggedIn}) => {
    const {signIn} = React.useContext(AuthContext);

    useEffect(() => {
        if (Platform.OS === 'web') {
            // Dynamically load the Google Identity Services library
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.onload = () => checkAndInitializeGoogleSignIn();
            document.body.appendChild(script);
        }
    }, []);

    const checkAndInitializeGoogleSignIn = () => {
        if (window.google && window.google.accounts) {
            initializeGoogleSignIn();
        } else {
            // Retry initialization after a short delay if window.google.accounts is not available yet
            setTimeout(checkAndInitializeGoogleSignIn, 100);
        }
    };

    const initializeGoogleSignIn = () => {
        window.google.accounts.id.initialize({
            client_id: '213797815882-10kd2qmj4hmmla4oa3s4kphqp8c4btvj.apps.googleusercontent.com',
            callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
            document.getElementById('signInDiv'),
            { theme: 'outline', size: 'large' }  // Customization attributes
        );
    };

    const handleCredentialResponse = async(response) => {
        console.log('Encoded JWT ID token: ' + response.credential);
        const userInfo = await UsersApi.googleLogin(response.credentials); // Assume loginUser returns a promise
        if (userInfo) { // Boolean indicating success of login
            signIn(userInfo.token, userInfo.email);
            setIsLoggedIn(true);

            // Save user ID to AsyncStorage
            await AsyncStorage.setItem('userId', userInfo.userId);

            navigation.navigate("Homes");
        }
        // Use the JWT token to authenticate the user on your backend
    };

    return (
        <View>
            {Platform.OS === 'web' ? (
                <div id="signInDiv"></div>  // This div will contain the Google Sign-In button
            ) : (
                <Button title="Sign in with Google" onPress={() => Alert.alert("Platform not supported", "Google Sign-In is only supported on web platforms.")} />
            )}
        </View>
    );
};

export default GoogleLogin;