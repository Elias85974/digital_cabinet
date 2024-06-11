import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, Modal, TextInput, Alert} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getLowOnStockProducts, addStock} from "../../../Api";
import GoBackButton from "../../Contents/GoBackButton";

export default function LowOnStockProducts({navigation}) {
    const [products, setProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantityToAdd, setQuantityToAdd] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getProducts().then(r => console.log("Products loaded")).catch(e => console.log("Error loading products"));
        }
    }, [isFocused, refreshKey]);

    const getProducts = async () => {
        try {
            const houseId = await AsyncStorage.getItem('houseId');
            const stock = await getLowOnStockProducts(houseId);
            console.log(stock);
            setProducts(stock);
        } catch (error) {
            console.log("Error getting products:", error);
        }
    }

    const handleAddStock = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        await addStock(houseId, {productId: selectedProduct.product.producto_ID, quantity: quantityToAdd});
        setModalVisible(false);
        setQuantityToAdd('');
        setRefreshKey(oldKey => oldKey + 1);
    }

    return (
        <View style={styles.container}>
            {products.map((productInfo, index) => (
                <View key={index} style={styles.productSquare}>
                    <Text style={styles.productText}>Producto: {productInfo.product.nombre}</Text>
                    <Text style={styles.productText}>Marca: {productInfo.product.marca}</Text>
                    <Text style={styles.productText}>Cantidad total: {productInfo.totalQuantity}</Text>
                    <Text style={styles.productText}>Proximo a vencer en: {new Date(productInfo.nearestExpirationDate).toLocaleDateString()}</Text>
                    <Button title="Add Stock" onPress={() => {setSelectedProduct(productInfo); setModalVisible(true);}} />
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
                        <Text style={styles.modalText}>Add Stock for {selectedProduct?.product.nombre}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setQuantityToAdd}
                            value={quantityToAdd}
                            keyboardType="numeric"
                            placeholder="Enter quantity to add"
                        />
                        <Button title="Confirm Addition" onPress={handleAddStock} />
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