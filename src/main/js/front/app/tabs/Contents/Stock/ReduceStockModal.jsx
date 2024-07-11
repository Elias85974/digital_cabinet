import React, {useState} from 'react';
import { View, Modal, Text, TextInput, Pressable } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InventoryApi} from "../../../Api";
import ModalAlert from "../ModalAlert";

const ReduceStockModal = ({updateProducts, currentPage,
                              modalVisible3, setModalProductInfo,
                              selectedProduct, setModalReduce,
                              styles, navigation }) => {

    const [modalReduce1, setModalVisible3] = useState(modalVisible3);
    const [quantityToReduce, setQuantityToReduce] = useState('');

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal


    const handleReduceStock = async () => {
        if (Number(quantityToReduce) > selectedProduct.totalQuantity) {
            setModalProductInfo(false);
            setModalMessage("You cannot reduce more stock than available"); // Muestra el modal en lugar de un alert
            setModalVisible(true);
            return;
        }
        const houseId = await AsyncStorage.getItem('houseId');
        // After successful reduction, close the modal and reset the quantity to reduce
        await InventoryApi.reduceStock(houseId, selectedProduct.product.producto_ID, quantityToReduce, navigation);

        // no le llega a esto --> setModalProductInfo(false); // Close both modals
        setQuantityToReduce('');

        const category = await AsyncStorage.getItem('categoryName');
        let reduceProd;
        if (currentPage === 'allProds') {
            // Call the API for the 'allProds' page
            reduceProd = await InventoryApi.getStockProducts(houseId, navigation);
        } else if (currentPage === 'lowStock') {
            // Call the API for the 'lowStock' page
            reduceProd = await InventoryApi.getLowOnStockProducts(houseId, navigation);
        } else if (currentPage === 'ByCategory') {
            // Call the API for the 'ByCategory' page
            reduceProd = await InventoryApi.getProductsFromHouseAndCategory(houseId, category, navigation);
        } else {
            console.error('Invalid page');
        }

        setModalProductInfo(false);
        setModalReduce(false);
        updateProducts(reduceProd);
        console.log('reduceProd con getProdHC:', reduceProd);
        return reduceProd;
    }

    return (
        <View>
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible3}
            onRequestClose={() => {
                setModalVisible3(!modalVisible3);
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
                        <Pressable onPress={() => setModalReduce(false)} >
                            <Text style={styles.link}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
        <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
        </View>
            );
};

export default ReduceStockModal;