import React, {useEffect, useState} from 'react';
import {View, Text, Modal, Pressable, StyleSheet} from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import AddStockModalScanner from "./AddStockModalScanner";

const ProductInfoModalScanner = ({
                              modalProductInfo,
                              selectedProduct,
                              setModalProductInfo,
                              navigation

                          }) => {

    useEffect(() => {
        setModalAdd(false)
    }, []);

    const [modalAdd1, setModalAdd] = useState(false);


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
                            {selectedProduct?.product.isVerified && <MaterialIcons name="verified" size={24} color= '#00FFFF' />}
                            <Text style={styles.modalText}>  Producto: {selectedProduct?.product.nombre}</Text>
                        </View>
                        <Text style={styles.modalText}>Marca: {selectedProduct?.product.marca}</Text>
                        <Text style={styles.modalText}>Tipo de cantidad: {selectedProduct?.quantityType}</Text>
                        <Text style={styles.modalText}>Categoría: {selectedProduct?.product.category.nombre}</Text>

                        <View style={styles.linksContainer}>
                            <Pressable onPress={() => {
                                setModalAdd(true)
                            }}>
                                <Text style={styles.link}>Add Stock</Text>
                            </Pressable>
                            <Pressable onPress={() => setModalProductInfo(false)} >
                                <Text style={styles.link}>Close</Text>
                            </Pressable>
                        </View>

                        <AddStockModalScanner
                            navigation={navigation}
                            setModalAdd={setModalAdd}
                            setModalProductInfo={setModalProductInfo}
                            modalVisibleAdd={modalAdd1}
                            selectedProduct={selectedProduct}
                            styles={styles}
                        />

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
        backgroundColor: '#BFAC9B',
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
