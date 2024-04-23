import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import Picker from 'react-native-picker-select';
import { getAllProducts, updateHouseInventory } from '../../Api';
import {router, useLocalSearchParams} from "expo-router";

export default function AddProduct() {
    const { houseId } = useLocalSearchParams();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            console.log('id is ', houseId);
            const fetchedProducts = await getAllProducts();
            setProducts(fetchedProducts);
            console.log('fetchedProducts:', fetchedProducts)
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    }


    const handleChanges = (value, type) => {
        if (type === 'product') {
            setSelectedProduct(value);
        } else if (type === 'quantity') {
            setQuantity(Number(value));
        }
    }

    const handleSubmit = async () => {
        try {
            if (!houseId) {
                alert('Please select a house');
                router.replace('../Homes');
            }
            if (!selectedProduct || !quantity) {
                alert('Please select a product and enter a quantity');
            } else {
                await updateHouseInventory(houseId, selectedProduct, quantity);
                alert('Inventory updated successfully!');
            }
        } catch (error) {
            console.log("Error updating inventory:", error);
        }
    }

    return (
        <View style={styles.container}>
            <Picker
                onValueChange={(value) => handleChanges(value, 'product')}
                items={products.map((product) => ({ label: product.nombre, value: product.producto_ID }))}
                value={selectedProduct}
            />
            <TextInput
                placeholder={"Enter quantity of products"}
                value={quantity}
                onChangeText={(value) => handleChanges(value, 'quantity')}
                keyboardType="numeric"
            />
            <Pressable onPress={handleSubmit} style={styles.link}>
                <Text>Add Stock</Text>
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    link: {
        marginTop: 15,
        marginBottom: 10,
        color: '#F2EFE9',
        textDecorationLine: 'underline',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3, // Add border
        borderColor: '#717336', // Set border color
        padding: 10, // Add some padding so the text isn't right up against the border
        backgroundColor: '#717336', // Set background color
        width: 200, // Set width
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 100,
        fontSize: 16,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        color: 'white',
        backgroundColor: '#4B5940',
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
    },
});