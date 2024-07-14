import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import {getUnverifiedProducts, verifyProduct} from "../../api/products";
import {HousesApi} from "../../Api";

export default function ProductsVerification({navigation}) {
    const [products, setProducts] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused){
            getProductList()
        }
    }, [isFocused]);

    const getProductList = async () => {
        const prods = await getUnverifiedProducts(navigation);
        console.log(prods)
        setProducts( prods)
    }

    const handleAccept = async (productId) => {
        const verified = {productId: productId.toString(), isAccepted: true};
        await processVerification(verified);
    }

    const handleReject = async (productId) => {
        const verified = {productId: productId.toString(), isAccepted: false};
        await processVerification(verified);
    }

    const processVerification = async (verified) => {
        try {
            await verifyProduct(verified, navigation);
            await getProductList();
        } catch (error) {
            console.error('Failed to process verification:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Unverified Products</Text>
            {products.map((product) => (
                <View key={product.producto_ID} style={styles.product}>
                    <Text style={styles.productName}>{product.nombre} + {product.producto_ID}</Text>
                    <Button title="Accept" onPress={() => handleAccept(product.producto_ID)} />
                    <Button title="Reject" onPress={() => handleReject(product.producto_ID)} />
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
        fontSize: 18,
        justifyContent: 'center',
        width: '80%',
    },
});

