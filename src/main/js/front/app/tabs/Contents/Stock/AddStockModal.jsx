import React from 'react';
import { View, Modal, Text, TextInput, Pressable } from 'react-native';

const AddStockModal = ({ modalVisible, setModalVisible, selectedProduct, setQuantityToAdd, quantityToAdd, handleAddStock, styles }) => {
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
                        <Pressable onPress={() => setModalVisible(false)} >
                            <Text style={styles.link}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default AddStockModal;