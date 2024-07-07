import React, {useEffect, useState} from 'react';
import { View, Modal, Text, Pressable, TextInput, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de instalar @expo/vector-icons si aún no lo has hecho

export default function FilterModal(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([...props.products]);
    //const [filteredProducts, setFilteredProducts] = useState(Array.isArray(props.products) ? [...props.products] : []);
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

    function compareNumbers(a, b) {
        return a.totalQuantity - b.totalQuantity;
    }

    const sortByQuantity = (products, order) => {
        if (order === 'min') {
            return products.sort(compareNumbers);
        }
        return products.sort(compareNumbers).reverse();
    }

    const sortByExpiry = (products, expiry) => {
        if (expiry) {
            return products.sort((a, b) => new Date(a.expiry) - new Date(b.expiry));
        }
        return products;
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

    const filterByCategory = (products, category) => {
        if (category) {
            return products.filter(product => product.category === category);
        }
        return products;
    }

    const applyFilters = (filtersToApply) => {
        let newFilteredProducts = [...props.products];


        newFilteredProducts = sortByQuantity(newFilteredProducts, filtersToApply.totalQuantity);
        newFilteredProducts = sortByExpiry(newFilteredProducts, filtersToApply.expiry);
        newFilteredProducts = sortByAlphabetical(newFilteredProducts, filtersToApply.alphabetical);
        newFilteredProducts = filterByCategory(newFilteredProducts, filtersToApply.category);

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

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable style={styles.button} onPress={() => handleFilterButtonPress({totalQuantity: 'min'})}>
                                <Text style={styles.buttonText}>Menor cantidad</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={() => handleFilterButtonPress({totalQuantity: 'max'})}>
                                <Text style={styles.buttonText}>Mayor cantidad</Text>
                            </Pressable>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Pressable style={styles.button} onPress={() =>  handleFilterButtonPress({ alphabetical: 'asc' })}>
                                <Text style={styles.buttonText}>A - Z</Text>
                            </Pressable>
                            <Pressable style={styles.button} onPress={() =>  handleFilterButtonPress({ alphabetical: 'desc' })}>
                                <Text style={styles.buttonText}>Z - A</Text>
                            </Pressable>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) =>  handleFilterButtonPress({ expiry: text })}
                                placeholder="Expiry date (DD-MM-YYYY)"
                            />
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) =>  handleFilterButtonPress({ category: text })}
                                placeholder="Category"
                            />
                        </View>
                        <Pressable style={styles.button} onPress={handleClose}>
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