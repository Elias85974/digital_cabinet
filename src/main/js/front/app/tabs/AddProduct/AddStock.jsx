import React, { useEffect, useState } from 'react';
import {View, Text, TextInput, Pressable, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import Picker from 'react-native-picker-select';
import {InventoryApi, ProductsApi} from '../../Api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalAlert from "../Contents/ModalAlert";
import NavBar from "../NavBar/NavBar";

export default function AddProduct({navigation}) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [expiration, setExpiration] = useState('');
    const [lowStockIndicator, setLowStockIndicator] = useState('');
    const [price, setPrice] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

    const isValidDate = (date) => {
        return /^(\d{2}\/\d{2}\/\d{4})$/.test(date);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const fetchedProducts = await ProductsApi.getAllProducts();
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
        else if (type === 'price') {
            setPrice(value);
        }
    }

    const handleSubmit = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        try {
            if (!houseId) {
                setModalMessage("Please select a house."); // Muestra el modal en lugar de un alert
                setModalVisible(true);
                setTimeout(() => {
                    setModalVisible(false);
                    // Navega a la siguiente página después de un retraso
                    navigation.navigate('Homes');
                }, 5000);

            }
            if (!selectedProduct || !quantity) {
                setModalMessage("Please select a product and enter a quantity."); // Muestra el modal en lugar de un alert
                setModalVisible(true);
            } else if (!isValidDate(expiration)) {
                setModalMessage("Please enter a valid expiration date in the format DD/MM/YYYY"); // Muestra el modal en lugar de un alert
                setModalVisible(true);
            } else {
                const stockUpdate = {productId: selectedProduct,
                    quantity: quantity, expiration: expiration, lowStockIndicator: lowStockIndicator, price: price};
                console.log('stockUpdate:', stockUpdate);
                await InventoryApi.updateHouseInventory(houseId, stockUpdate);
                setModalMessage("Inventory updated successfully!"); // Muestra el modal en lugar de un alert
                setModalVisible(true);
            }
            setExpiration('');
            setQuantity('');
            setLowStockIndicator('');
            setPrice('');
        } catch (error) {
            console.log("Error updating inventory:", error);
        }
    }


    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                <View>
                    <Text style={styles.title}>Add products!</Text>
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
                                   placeholder={"Quantity of products"}
                                   value={quantity.toString()}
                                   onChangeText={(value) => handleChanges(value, 'quantity')}
                                   inputMode="numeric"
                        />
                        <TextInput style={styles.input}
                                   placeholder={"DD/MM/YYYY"}
                                   value={expiration}
                                   onChangeText={(value) => handleChanges(value, 'expiration')}
                                   inputMode="text"
                        />
                        <TextInput style={styles.input}
                                   placeholder={"Low stock indicator"}
                                   value={lowStockIndicator}
                                   onChangeText={(value) => handleChanges(value, 'lowStockIndicator')}
                                   inputMode="numeric"
                        />
                        <TextInput style={styles.input}
                                   placeholder={"Total price"}
                                   value={price}
                                   onChangeText={(value) => handleChanges(value, 'price')}
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
            </SafeAreaView>
            <NavBar navigation={navigation}/>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
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
        marginTop: 20,
        marginBottom: 40,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
    },
    info: {
        fontSize: 25,
        fontFamily: 'lucida grande',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
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