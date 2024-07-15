import React, { useEffect } from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import {FetchApi, UsersApi} from "../../../Api";
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
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        });
        window.google.accounts.id.renderButton(
            document.getElementById('signInDiv'),
            { theme: 'outline', size: 'large' }  // Customization attributes
        );
    };

    const handleCredentialResponse = async(response) => {
        console.log('Google info: ' + JSON.stringify(response, null, 2));
        const accessToken = response.credential; // This is the OAuth2 access token

        try {
            const userInfoResponse = await UsersApi.googleLogin(accessToken);
            if (userInfoResponse) { // Boolean indicating success of login
                signIn(userInfoResponse.token, userInfoResponse.email);
                setIsLoggedIn(true);

                const userId = userInfoResponse.userId;
                // Save user ID to AsyncStorage
                await AsyncStorage.setItem('userId', userId);

                // Check if the user is the admin (i.e., user ID is 1)
                if (userId === '1') {
                    // Navigate to the admin page
                    navigation.navigate("Products Verification");
                } else {
                    // Navigate to the homes page
                    navigation.navigate("Homes"); //homes
                }
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    return (
        <View style={{justifyContent: 'center', alignContent: 'center', alignSelf: 'center',}}>
            {Platform.OS === 'web' ? (
                <div id="signInDiv"></div>  // This div will contain the Google Sign-In button
            ) : (
                <Button title="Sign in with Google" onPress={() => Alert.alert("Platform not supported", "Google Sign-In is only supported on web platforms.")} />
            )}
        </View>
    );
};

export default GoogleLogin;