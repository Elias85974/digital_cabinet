import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import CreateUser from "./users/CreateUser.js";

export default function Login({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    // Aquí va la lógica de inicio de sesión autenticando al usuario
  };

    const handleCreateAccount = () => {
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Create Account" onPress={handleCreateAccount} /> {/* Actualizado para usar handleCreateAccount */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});