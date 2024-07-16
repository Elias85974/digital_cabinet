import React, { useState} from 'react';
import {View, Text, Modal, Pressable, StyleSheet, TextInput} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InventoryApi} from "../../../Api";

const ProductInfoModalScanner = ({
                              modalProductInfo,
                              selectedProduct,
                              setModalProductInfo,
                              navigation
                          }) => {


    const [quantityToAdd, setQuantityToAdd] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [newPrice, setNewPrice] = useState('');


    const handleAddStock = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        await InventoryApi.updateHouseInventory(houseId, {
            productId: selectedProduct.id,
            quantity: quantityToAdd.toString(),
            expiration: expirationDate,
            lowStockIndicator: selectedProduct.lowStock,
            price: newPrice
        }, navigation);


        setModalProductInfo(false);
        setQuantityToAdd('');
        console.log("Products loaded after adding stock");
        setModalProductInfo(false);
        navigation.navigate('House');
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
        <View style={styles.container}>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalProductInfo}
                onRequestClose={() => {
                    setModalProductInfo(!modalProductInfo);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{flexDirection: 'row'}}>
                            {selectedProduct?.isVerified && <MaterialIcons name="verified" size={24} color= '#00FFFF' />}
                            <Text style={styles.modalText}>  Producto: {selectedProduct?.name}</Text>
                        </View>
                        <Text style={styles.modalText}>Marca: {selectedProduct?.brand}</Text>
                        <Text style={styles.modalText}>Tipo de cantidad: {selectedProduct?.quantityType}</Text>
                        <Text style={styles.modalText}>Categoría: {selectedProduct?.category}</Text>

                        <View style={styles.modalView}>
                            <TextInput
                                style={styles.input}
                                onChangeText={setQuantityToAdd}
                                value={quantityToAdd}
                                inputMode="numeric"
                                placeholder="Enter quantity to add"
                            />
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
                        </View>

                        <View style={styles.linksContainer}>
                            <Pressable onPress={handleAddStock}>
                                <Text style={styles.link}>Confirm Addition</Text>
                            </Pressable>
                            <Pressable onPress={() => setModalProductInfo(false)} >
                                <Text style={styles.link}>Close</Text>
                            </Pressable>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ProductInfoModalScanner;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container2: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productSquare: {
        width: 150,
        backgroundColor: '#4B5940',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center',
        margin: 5,
    },
    productSquareInvisible: {
        backgroundColor: 'transparent',
    },
    productText: {
        fontSize: 16,
        color: '#fff',
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
        marginBottom: 20,
        textAlign: "center"
    },
    input: {
        flex: 1,
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: 'white',
        backgroundColor: '#3b0317',
        borderRadius: 30,
        borderStyle: undefined,
    },
    link: {
        marginTop: 5,
        marginBottom: 1,
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
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
    },
});
