import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, Pressable, StyleSheet, ScrollView} from 'react-native';
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
            <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>Add some products!</Text>
                    <View style={styles.addProd}>
                        <Text style={styles.info}>Select a Product</Text>
                        <View style={ styles.picker}>
                            <Picker
                                onValueChange={(value) => handleChanges(value, 'product')}
                                items={products.map((product) => ({ label: product.nombre, value: product.producto_ID }))}
                                value={selectedProduct}
                            />
                        </View>
                        <TextInput style={styles.input}
                            placeholder={"Enter quantity of products"}
                            value={quantity}
                            onChangeText={(value) => handleChanges(value, 'quantity')}
                            inputMode="numeric"
                        />
                        <View style={styles.linksContainer}>
                            <Pressable style={styles.link} onPress={handleSubmit}>
                                <Text style={{color: 'white', fontSize: 16}}>Add Stock</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 50,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
    },
    info: {
        fontSize: 25,
        fontFamily: 'lucida grande',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        color: '#F2EFE9',
        lineHeight: 30,
    },
    linksContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    addProd: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 300,
        alignSelf: 'center',
    },
    createprod: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    },
    picker:{
        width: '50%',
        alignSelf: 'center',
        height: 60,
        backgroundColor: '#717336',
        borderColor: '#5d5e24',
        borderWidth: 2,
    }
});