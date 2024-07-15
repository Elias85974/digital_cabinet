import React, {useState} from 'react';
import { View, Modal, Text, TextInput, Pressable } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InventoryApi} from "../../../Api";
import {updateHouseInventory} from "../../../api/inventory";

const AddStockModal = ({updateProducts,
                           modalVisible, setModalProductInfo,
                           selectedProduct, setModalAdd, currentPage,
                           styles, navigation }) => {

    const [modalAdd1, setModalVisible] = useState(modalVisible);
    const [quantityToAdd, setQuantityToAdd] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [newPrice, setNewPrice] = useState('');


    const handleAddStock = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        if (currentPage === 'lowStock') {
            await InventoryApi.addLowOnStockProduct(houseId, {
                productId: selectedProduct.product.producto_ID,
                quantity: quantityToAdd
            }, navigation);
        } else {
            await InventoryApi.updateHouseInventory(houseId, {
                productId: selectedProduct.product.producto_ID,
                quantity: quantityToAdd.toString(),
                expiration: expirationDate,
                lowStockIndicator: selectedProduct.lowStockIndicator,
                price: newPrice
            }, navigation);
        }


        setModalProductInfo(false);
        setQuantityToAdd('');

        let stock = await getProducts();

        console.log("Products loaded after adding stock", stock);
        updateProducts(stock);
        setModalProductInfo(false);
        setModalAdd(false);
        return stock;
    }

    const getProducts = async () => {
        let stock;
        const category = await AsyncStorage.getItem('categoryName');
        if (currentPage === 'allProds') {
            // Call the API for the 'allProds' page
            stock = await InventoryApi.getStockProducts(houseId, navigation);
        } else if (currentPage === 'lowStock') {
            // Call the API for the 'lowStock' page
            stock = await InventoryApi.getLowOnStockProducts(houseId, navigation);
        } else if (currentPage === 'ByCategory') {
            // Call the API for the 'ByCategory' page
            stock = await InventoryApi.getProductsFromHouseAndCategory(houseId, category, navigation);
        } else {
            console.error('Invalid page');
        }
        return stock;
    }

    const handleChanges = (value, type) => {
        if (type === 'expiration') {
            const formattedValue = formatDate(value);
            setExpirationDate(formattedValue);
        }
        else if (type === 'price') {
            setNewPrice(value);
        }
    }

    const formatDate = (value) => {
        // Remove all non-digit characters
        const cleaned = value.replace(/\D+/g, '');
        // Split the cleaned string into parts for day, month, and year
        const day = cleaned.slice(0, 2);
        const month = cleaned.slice(2, 4);
        const year = cleaned.slice(4, 8);

        // Reassemble the parts with slashes between them
        return `${day}${month.length ? '/' : ''}${month}${year.length ? '/' : ''}${year}`;
    };

    return (
        <Modal
            animationType="fade"
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
                        inputMode="numeric"
                        placeholder="Enter quantity to add"
                    />
                    {currentPage !== 'lowStock' && (
                        <>
                            <TextInput
                                style={styles.input}
                                onChangeText={(value) => handleChanges(value, 'price')}
                                value={newPrice}
                                inputMode="numeric"
                                placeholder="Enter new total price"
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={(value) => handleChanges(value, 'expiration')}
                                value={expirationDate}
                                inputMode="text"
                                placeholder="Enter expiration DD/MM/YYYY"
                            />
                            </>
                        )}
                    <View style={styles.linksContainer}>
                        <Pressable onPress={handleAddStock}>
                            <Text style={styles.link}>Confirm Addition</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalAdd(false)} >
                            <Text style={styles.link}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddStockModal;