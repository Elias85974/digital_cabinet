import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button, Modal, TextInput, Alert, Pressable, ScrollView} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getProductsFromHouseAndCategory, reduceStock} from "../../../Api";
import Tuple from "../../Contents/Tuple";
import ModalAlert from "../../Contents/ModalAlert";


export default function Product({navigation}) {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantityToReduce, setQuantityToReduce] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const isFocused = useIsFocused();

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

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
            setModalMessage("You cannot reduce more stock than available"); // Muestra el modal en lugar de un alert
            setModalVisible(true);
            return;
        }
        const houseId = await AsyncStorage.getItem('houseId');
        // Call your API method here to reduce the stock
        // After successful reduction, close the modal and reset the quantity to reduce
        await reduceStock(houseId, selectedProduct.product.producto_ID, quantityToReduce);
        setModalVisible2(false);
        setQuantityToReduce('');
        setRefreshKey(oldKey => oldKey + 1);
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                <View>
                    <View style={styles.container}>
                        {filteredProducts.map((productInfo, index) => (
                            <View key={index} style={styles.productSquare}>
                                <Text style={styles.productText}>Producto: {productInfo.product.nombre}</Text>
                                <Text style={styles.productText}>Marca: {productInfo.product.marca}</Text>
                                <Text style={styles.productText}>Cantidad total: {productInfo.totalQuantity}</Text>
                                <Text style={styles.productText}>Próximo a vencer en: {new Date(productInfo.nearestExpirationDate).toLocaleDateString()}</Text>
                                <View style={styles.linksContainer}>
                                    <Pressable onPress={() => {setSelectedProduct(productInfo); setModalVisible2(true);}}>
                                        <Text style={styles.link}>Reduce Stock</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                        <Tuple navigation={navigation}/>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible2}
                            onRequestClose={() => {
                                setModalVisible2(!modalVisible2);
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
                                    <View style={styles.linksContainer}>
                                        <Pressable onPress={handleReduceStock}>
                                            <Text style={styles.link}>Confirm Reduction</Text>
                                        </Pressable>
                                    </View>
                                    <View style={styles.linksContainer}>
                                        <Pressable onPress={() => setModalVisible2(false)} >
                                            <Text style={styles.link}>Cancel</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>
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
        justifyContent: 'center',
    },
    productSquare: {
        width: 300,
        backgroundColor: '#4B5940',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    productText: {
        fontSize: 16,
        color: '#fff',
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
            width: 10,
            height: 20,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 15
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
    linksContainer: {
        marginTop: 20,
    },
});