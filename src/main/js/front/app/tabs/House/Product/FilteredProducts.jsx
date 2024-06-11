import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, Modal, TextInput, Alert} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getProductsFromHouseAndCategory, reduceStock} from "../../../Api";
import GoBackButton from "../../Contents/GoBackButton";

export default function Product({navigation}) {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantityToReduce, setQuantityToReduce] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getProducts().then(r => console.log("Products loaded")).catch(e => console.log("Error loading products"));
        }
    }, [isFocused, refreshKey]);

    const getProducts = async () => {
        try {
            const category = await AsyncStorage.getItem('category');
            const houseId = await AsyncStorage.getItem('houseId');
            const products = await getProductsFromHouseAndCategory(houseId, category);
            console.log(products);
            setFilteredProducts(products);
        } catch (error) {
            console.log("Error getting products:", error);
        }
    }

    const handleReduceStock = async () => {
        if (Number(quantityToReduce) > selectedProduct.totalQuantity) {
            alert("You cannot reduce more stock than available");
            return;
        }
        const houseId = await AsyncStorage.getItem('houseId');
        // Call your API method here to reduce the stock
        // After successful reduction, close the modal and reset the quantity to reduce
        await reduceStock(houseId, selectedProduct.product.producto_ID, quantityToReduce);
        setModalVisible(false);
        setQuantityToReduce('');
        setRefreshKey(oldKey => oldKey + 1);
    }

    return (
        <View style={styles.container}>
            {filteredProducts.map((productInfo, index) => (
                <View key={index} style={styles.productSquare}>
                    <Text style={styles.productText}>Producto: {productInfo.product.nombre}</Text>
                    <Text style={styles.productText}>Marca: {productInfo.product.marca}</Text>
                    <Text style={styles.productText}>Cantidad total: {productInfo.totalQuantity}</Text>
                    <Text style={styles.productText}>Proximo a vencer en: {new Date(productInfo.nearestExpirationDate).toLocaleDateString()}</Text>
                    <Button title="Reduce Stock" onPress={() => {setSelectedProduct(productInfo); setModalVisible(true);}} />
                </View>
            ))}
            <GoBackButton navigation={navigation}/>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Reduce Stock for {selectedProduct?.product.nombre}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setQuantityToReduce}
                            value={quantityToReduce}
                            keyboardType="numeric"
                            placeholder="Enter quantity to reduce"
                        />
                        <Button title="Confirm Reduction" onPress={handleReduceStock} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    productSquare: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    productText: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});