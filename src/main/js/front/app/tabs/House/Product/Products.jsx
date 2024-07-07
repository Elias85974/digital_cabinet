import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Modal, TextInput, Pressable, FlatList, SafeAreaView, ScrollView,} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getProductsFromHouseAndCategory, reduceStock} from "../../../controller/InventoryController";
import Tuple from "../../Contents/Tuple";
import ModalAlert from "../../Contents/ModalAlert";


export default function Product({navigation}) {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantityToReduce, setQuantityToReduce] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const isFocused = useIsFocused();

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (isFocused) {
            getProducts().then(r => console.log("Products loaded")).catch(e => console.log("Error loading products"));
        }
    }, [isFocused, refreshKey]);

    const getProducts = async () => {
        try {
            const category = await AsyncStorage.getItem('category');
            const houseId = await AsyncStorage.getItem('houseId');
            const products = await getProductsFromHouseAndCategory(houseId, category);
            console.log(products);
            setFilteredProducts(products);
            if (query === '') {
                setSuggestions(products); // Initialize suggestions with the fetched products only if query is empty
            }
        } catch (error) {
            console.log("Error getting products:", error);
        }
    }

    const handleReduceStock = async () => {
        if (Number(quantityToReduce) > selectedProduct.totalQuantity) {
            setModalMessage("You cannot reduce more stock than available"); // Muestra el modal en lugar de un alert
            setModalVisible(true);
            return;
        }
        const houseId = await AsyncStorage.getItem('houseId');
        // Call your API method here to reduce the stock
        // After successful reduction, close the modal and reset the quantity to reduce
        await reduceStock(houseId, selectedProduct.product.producto_ID, quantityToReduce);
        setModalVisible3(false);
        setQuantityToReduce('');
        setRefreshKey(oldKey => oldKey + 1);
    }


    const handleInputChange = (text) => {
        setQuery(text);

        if (text === '') {
            setSuggestions(filteredProducts);
        } else {
            const regex = new RegExp(`${text.trim()}`, 'i');
            setSuggestions(filteredProducts.filter(product => product.product.nombre.search(regex) >= 0));
        }
    };

    const handleSuggestionPress = (suggestion) => {
        setQuery(suggestion.product.nombre);
        setSelectedProduct(suggestion);
        setModalVisible2(true);

    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.productSquare}>
                <Pressable onPress={() => handleSuggestionPress(item)}>
                    <Text style={styles.productText}>{item.product.nombre}</Text>
                </Pressable>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                <View>
                    <View style={styles.container2}>
                        <View style={{backgroundColor: '#3b0317', borderRadius: 30}}>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleInputChange}
                                value={query}
                                placeholder="Search product"
                            />
                        </View>
                        <FlatList
                            data={suggestions}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                        />
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible2}
                        onRequestClose={() => {
                            setModalVisible2(!modalVisible2);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Producto: {selectedProduct?.product.nombre}</Text>
                                <Text style={styles.modalText}>Marca: {selectedProduct?.product.marca}</Text>
                                <Text style={styles.modalText}>Cantidad total: {selectedProduct?.totalQuantity}</Text>
                                <Text style={styles.modalText}>Próximo a vencer en: {new Date(selectedProduct?.nearestExpirationDate).toLocaleDateString()}</Text>
                                <View style={styles.linksContainer}>
                                    <Pressable onPress={() => setModalVisible3(true)}>
                                        <Text style={styles.link}>Reduce Stock</Text>
                                    </Pressable>
                                    <Pressable onPress={() => setModalVisible2(false)} >
                                        <Text style={styles.link}>Cerrar</Text>
                                    </Pressable>
                                </View>

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
                            </View>
                        </View>
                    </Modal>

                </View>
                <Tuple navigation={navigation}/>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

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
        marginBottom: 15,
        textAlign: "center"
    },
    input: {
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
});