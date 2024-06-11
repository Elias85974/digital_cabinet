import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, Pressable, StyleSheet, ScrollView} from 'react-native';
import Picker from 'react-native-picker-select';
import { getAllProducts, updateHouseInventory } from '../../Api';
import {router, useLocalSearchParams} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddProduct({navigation}) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [expiration, setExpiration] = useState('');
    const [lowStockIndicator, setLowStockIndicator] = useState('');
    const isValidDate = (date) => {
        return /^(\d{2}\/\d{2}\/\d{4})$/.test(date);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
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
        else if (type === 'expiration') {
            setExpiration(value);
        }
        else if (type === 'lowStockIndicator') {
            setLowStockIndicator(value);
        }
    }

    const handleSubmit = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        try {
            if (!houseId) {
                alert('Please select a house');
                router.replace('../Homes');
            }
            if (!selectedProduct || !quantity) {
                alert('Please select a product and enter a quantity');
            } else if (!isValidDate(expiration)) {
                alert('Please enter a valid expiration date in the format DD/MM/YYYY');
            } else {
                const stockUpdate = {productId: selectedProduct,
                    quantity: quantity, expiration: expiration, lowStockIndicator: lowStockIndicator};
                console.log('stockUpdate:', stockUpdate);
                await updateHouseInventory(houseId, stockUpdate);
                alert('Inventory updated successfully!');
            }
            setExpiration('');
            setQuantity('');
            setLowStockIndicator('');
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
                        <View style={styles.picker}>
                            <Picker
                                onValueChange={(value) => handleChanges(value, 'product')}
                                items={products.map((product) => ({label: product.nombre, value: product.producto_ID}))}
                                value={selectedProduct}
                            />
                        </View>
                        <TextInput style={styles.input}
                                   placeholder={"Enter quantity of products"}
                                   value={quantity.toString()}
                                   onChangeText={(value) => handleChanges(value, 'quantity')}
                                   inputMode="numeric"
                        />
                        <TextInput style={styles.input}
                                   placeholder={"Enter an expiration date"}
                                   value={expiration}
                                   onChangeText={(value) => handleChanges(value, 'expiration')}
                                   inputMode="text"
                        />
                        <TextInput style={styles.input}
                                   placeholder={"Enter your low stock indicator"}
                                   value={lowStockIndicator}
                                   onChangeText={(value) => handleChanges(value, 'lowStockIndicator')}
                                   inputMode="numeric"
                        />
                        <View style={styles.linksContainer}>
                            <Pressable style={styles.link} onPress={handleSubmit}>
                                <Text style={{color: 'white', fontSize: 16}}>Add Stock</Text>
                            </Pressable>
                        </View>
                    </View>
                    <p></p>
                    <View style={styles.linksContainer}>
                        <Pressable onPress={() => navigation.navigate("House")} style={styles.link}>
                            <Text style={{color: 'white', fontSize: 16}}>Go Back</Text>
                        </Pressable>
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