import React from 'react';
import { View, Modal, Text, TextInput, Pressable } from 'react-native';

const ReduceStockModal = ({
                              modalVisible3, setModalVisible3,
                              selectedProduct, setQuantityToReduce,
                              quantityToReduce, handleReduceStock,
                              styles }) => {
    return (
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
                        <Pressable onPress={() => setModalVisible3(false)} >
                            <Text style={styles.link}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ReduceStockModal;