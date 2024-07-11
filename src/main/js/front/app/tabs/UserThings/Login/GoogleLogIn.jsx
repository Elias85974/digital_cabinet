import React, { useState } from 'react';
import {Button, Text, View} from 'react-native';
import * as Google from 'expo-google-app-auth';

export default function GoogleLogIn({navigator}) {
  const [user, setUser] = useState(null);

  async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        androidClientId: '<TU_ANDROID_CLIENT_ID>', // reemplaza esto con tu Android client ID
        iosClientId: '<TU_IOS_CLIENT_ID>', // reemplaza esto con tu iOS client ID
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        setUser(result.user);
        navigator.navigate("Homes");
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  return (
    <View>
      <Button title="Iniciar sesión con Google" onPress={signInWithGoogleAsync} />
      {user && <Text>Bienvenido, {user.name}!</Text>}
    </View>
  );
}

