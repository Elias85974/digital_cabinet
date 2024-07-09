import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Settings({navigation}) {


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {/* Aquí puedes agregar tus opciones de configuraci��n */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
