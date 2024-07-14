import React, {useEffect, useState} from 'react';
import { View, Modal, Text, Pressable, TextInput, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    getProductsByCategoryAndLowOnStock,
    getProductsFromHouseAndCategory
} from "../../api/inventory";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Asegúrate de instalar @expo/vector-icons si aún no lo has hecho

export default function FilterModal(props) {
    const [modalVisible, setModalVisible] = useState(false);
    //const [filteredProducts, setFilteredProducts] = useState([...props.products]);
    const [filteredProducts, setFilteredProducts] = useState(Array.isArray(props.products) ? [...props.products] : []);
    // Asumiendo que tienes un estado para tus filtros
    const [filters, setFilters] = useState({totalQuantity: null, expiry: null, alphabetical: null, category: null });

    const bubbleSort = (arr, comparator) => {
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - i - 1; j++) {
                if (comparator(arr[j], arr[j + 1]) > 0) {
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }

    const handleClose = () => {
        props.onFilter(filteredProducts);
        console.log('filteredProducts en filterModal', filteredProducts)
        const filters = {totalQuantity: null, expiry: null, alphabetical: null, category: null };
        setFilters(filters);
        setModalVisible(false);
    }

    const handleFilterButtonPress = (newFilters) => {
        setFilters(prevFilters => {
           // updateFilters(newFilters);
            const updatedFilters = {...prevFilters, ...newFilters};
            applyFilters(updatedFilters);
            console.log('updatedFilters', updatedFilters)
            return updatedFilters;
        });
    }

    function compareCant(a, b) {
        return b.totalQuantity - a.totalQuantity;
    }

    const sortByQuantity = (products, order) => {
        if (order === 'min') {
            return products.sort(compareCant);
        }
        return products.sort(compareCant).reverse();
    }

    function compareDates(a, b) {
        return a.expiry - b.expiry;
    }

    const sortByExpiry = (products, expiry) => {
        if (expiry === 'desc') {
            return products.sort(compareDates);
        }
        return products.sort(compareDates).reverse();
    }

    const sortByAlphabetical = (products, alphabetical) => {
        if (alphabetical) {
            return bubbleSort(products, (a, b) => {
                const aName = a.product.nombre || 'zzzz';
                const bName = b.product.nombre || 'zzzz';
                return alphabetical === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
            });
        }
        return products;
    }

    function compareByCategory(a, b) {
        const categoryA = a.categoryName.toUpperCase(); // Ignora mayúsculas y minúsculas
        const categoryB = b.categoryName.toUpperCase(); // Ignora mayúsculas y minúsculas

        let comparison = 0;
        if (categoryA > categoryB) {
            comparison = 1;
        } else if (categoryA < categoryB) {
            comparison = -1;
        }
        return comparison;
    }

    const filterByCategory = async (products, category) => {
        const houseId = await AsyncStorage.getItem('houseId');
        let formattedText = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

        let currentPage = props.currentPage;
        if (currentPage === 'ByCategory') {
            return products;
        } else if (currentPage === 'lowStock') {
            return getProductsByCategoryAndLowOnStock(houseId, formattedText, props.navigation);
        } else if (currentPage === 'allProds') {
            return getProductsFromHouseAndCategory(houseId, formattedText, props.navigation);
        }
    }

    const applyFilters = async (filtersToApply) => {
        let newFilteredProducts = [...props.products];

        newFilteredProducts = await sortByQuantity(newFilteredProducts, filtersToApply.totalQuantity);
        newFilteredProducts = await sortByExpiry(newFilteredProducts, filtersToApply.expiry);
        newFilteredProducts = await sortByAlphabetical(newFilteredProducts, filtersToApply.alphabetical);
        if (filtersToApply.category) {
            newFilteredProducts = await filterByCategory(newFilteredProducts, filtersToApply.category);
        }
        console.log('newFilteredProductsssssss', newFilteredProducts)
        setFilteredProducts(newFilteredProducts);
    }


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

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                            <Pressable style={styles.button} onPress={() => handleFilterButtonPress({totalQuantity: 'min'})}>
                                <Text style={styles.buttonText}>Menor cantidad</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={() => handleFilterButtonPress({totalQuantity: 'max'})}>
                                <Text style={styles.buttonText}>Mayor cantidad</Text>
                            </Pressable>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                            <Pressable style={styles.button} onPress={() =>  handleFilterButtonPress({ expiry: 'asc' })}>
                                <Text style={styles.buttonText}>  Expiry Asc  </Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={() =>  handleFilterButtonPress({ expiry: 'desc' })}>
                                <Text style={styles.buttonText}>  Expiry Desc </Text>
                            </Pressable>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                            <Pressable style={styles.button} onPress={() =>  handleFilterButtonPress({ alphabetical: 'asc' })}>
                                <Text style={styles.buttonText}>    A - Z    </Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={() =>  handleFilterButtonPress({ alphabetical: 'desc' })}>
                                <Text style={styles.buttonText}>    Z - A    </Text>
                            </Pressable>
                        </View>
                        {props.currentPage !== 'ByCategory' && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={(text) =>  handleFilterButtonPress({ category: text })}
                                    placeholder="Category"
                                />
                            </View>
                        )}
                        <Pressable style={[styles.button, {width: '90%'}]} onPress={handleClose}>
                            <Text style={styles.buttonText}>Apply</Text>
                        </Pressable>
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
        width: '80%', // Reduce el ancho para que los campos de entrada no se estiren demasiado
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
    },
    input: {
        flex: 1, // Asegúrate de que el TextInput ocupe todo el espacio disponible
        height: 40,
        width: '45%',
        margin: 12,
        borderWidth: 1,
        backgroundColor: '#3b0317',
        padding: 10,
        borderRadius: 5,
        color: '#F2EFE9',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3b0317',
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