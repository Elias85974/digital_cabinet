import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import {getUnverifiedProducts, verifyProduct} from "../../api/products";

export default function ProductsVerification({navigation}) {
    const [products, setProducts] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused){
            getUnverifiedProducts().then(setProducts);
        }
    }, [isFocused]);

    const handleVerify = (productId, isVerified) => {
        verifyProduct(productId, isVerified, navigation).then(() => {
            // Refresh the list of products after verifying
            getUnverifiedProducts().then(setProducts);
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Unverified Products</Text>
            {products.map((product) => (
                <View key={product.id} style={styles.product}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Button title="Accept" onPress={() => handleVerify(product.id, true)} />
                    <Button title="Reject" onPress={() => handleVerify(product.id, false)} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    product: {
        backgroundColor: '#4B5940',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    productName: {
        color: 'white',
    },
});

