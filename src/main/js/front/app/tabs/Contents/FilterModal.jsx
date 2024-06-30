import React, { useState } from 'react';
import { View, Modal, Text, Pressable, TextInput, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de instalar @expo/vector-icons si aún no lo has hecho

export default function FilterModal(props) {
    const [modalVisible, setModalVisible] = useState(false);
   /* const [filters, setFilters] = useState({ minQuantity: null, maxQuantity: null, expiry: null, alphabetical: null, category: null });

    const updateFilters = (newFilters) => {
        setFilters({...filters, ...newFilters});
    }*/

    return (
        <View style={styles.container}>
            <Pressable style={{backgroundColor: '#BFAC9B', paddingVertical: 5, paddingHorizontal: 5,
                borderRadius: 100, justifyContent: 'center', alignItems: 'center', margin: 5}} onPress={() => setModalVisible(true)}>
                <Ionicons name="filter" size={24} color="black" />
            </Pressable>

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
                        <Pressable style={{alignSelf: 'flex-end'}} onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} color="black" />
                        </Pressable>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => props.updateFilters({ minQuantity: text })}
                                placeholder="Min quantity"
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => props.updateFilters({ maxQuantity: text })}
                                placeholder="Max quantity"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable style={styles.button} onPress={() =>  props.updateFilters({ alphabetical: 'asc' })}>
                                <Text style={styles.buttonText}>A - Z</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={() =>  props.updateFilters({ alphabetical: 'desc' })}>
                                <Text style={styles.buttonText}>Z - A</Text>
                            </Pressable>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) =>  props.updateFilters({ expiry: text })}
                                placeholder="Expiry date (DD-MM-YYYY)"
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) =>  props.updateFilters({ category: text })}
                                placeholder="Category"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        padding: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center', // Cambia a 'center' para que el modal aparezca en el medio de la pantalla
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: '70%', // Reduce el ancho para que los campos de entrada no se estiren demasiado
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
    },
    input: {
        flex: 1, // Asegúrate de que el TextInput ocupe todo el espacio disponible
        height: 40,
        width: '45%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        backgroundColor: '#4B5940',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        margin: 5,
    },
    buttonText: {
        color: '#F2EFE9',
        fontSize: 16,
    },

});