import React, {useState} from 'react';
import { View, Modal, Text, TextInput, Pressable } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InventoryApi} from "../../../Api";

const AddStockModal = ({updateProducts,
                           modalVisible, setModalProductInfo,
                           selectedProduct, setModalAdd, currentPage,
                           styles, navigation }) => {

    const [modalAdd1, setModalVisible] = useState(modalVisible);
    const [quantityToAdd, setQuantityToAdd] = useState('');

    const handleAddStock = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        await InventoryApi.addLowOnStockProduct(houseId, {productId: selectedProduct.product.producto_ID, quantity: quantityToAdd}, navigation);
        setModalProductInfo(false);
        setQuantityToAdd('');

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

        /*setProducts(stock)
        setSuggestions(stock)
        setFilteredProducts(stock)*/ // a falta de esto se devuelve la lista, agregarlo en los otros lados
        console.log("Products loaded after adding stock", stock);
        updateProducts(stock);
        setModalProductInfo(false);
        setModalAdd(false);
        return stock;
    }

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
                        keyboardType="numeric"
                        placeholder="Enter quantity to add"
                    />
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