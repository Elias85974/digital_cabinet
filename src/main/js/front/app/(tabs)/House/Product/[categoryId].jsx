import React from 'react';
import {Link, useLocalSearchParams} from 'expo-router';
import {Pressable, Text, View} from 'react-native';

export default function Product() {
    const { category, filteredProducts } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Category: {category}</Text>
            <View style={styles.logInCont}>
                {filteredProducts.map((product, index) => (
                    <View key={index}>
                        <Text>{product.name}</Text>
                        <Text>{product.marca}</Text>
                        <Text>{product.tipoDeCantidad}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}