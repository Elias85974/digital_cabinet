import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    FlatList, Modal
} from 'react-native';
import Picker from 'react-native-picker-select';
import {InventoryApi, ProductsApi} from '../../Api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalAlert from "../Contents/ModalAlert";
import NavBar from "../NavBar/NavBar";
import GoBackButton from "../NavBar/GoBackButton";
import {MaterialIcons} from "@expo/vector-icons";

export default function AddProduct({navigation}) {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [expiration, setExpiration] = useState('');
    const [lowStockIndicator, setLowStockIndicator] = useState('');
    const [price, setPrice] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);



    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const fetchedProducts = await ProductsApi.getAllProducts(navigation);
            setProducts(fetchedProducts);
        } catch (error) {
            console.log("Error fetching products:", error);
        }
    }

    const handleInputChangeProd = (text) => {
        setQuery(text);

        if (text === '') {
            setSuggestions([]);
        } else {
            const regex = new RegExp(`${text.trim()}`, 'i');
            setSuggestions(products.filter(product => product.nombre.search(regex) >= 0));
        }
    };

    const handleSuggestionPress = (suggestion) => {
        setQuery(suggestion.nombre);
        setSuggestions([]);
        setSelectedProduct(suggestion.producto_ID);
    };


    const isValidDate = (dateStr) => {
        // Check if date format is DD/MM/YYYY
        if (!/^(\d{2}\/\d{2}\/\d{4})$/.test(dateStr)) {
            return false;
        }

        // Parse the date from the string
        const parts = dateStr.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-based
        const year = parseInt(parts[2], 10);
        const inputDate = new Date(year, month, day);

        // Check if date is valid
        if (inputDate.getFullYear() !== year || inputDate.getMonth() !== month || inputDate.getDate() !== day) {
            return false;
        }

        // Get today's date with time reset to 00:00:00
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if the input date is earlier than today
        return inputDate >= today;
    };
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

    const handleChanges = (value, type) => {
        if (type === 'product') {
            setSelectedProduct(value);
        } else if (type === 'quantity') {
            setQuantity(Number(value));
        }
        else if (type === 'expiration') {
            const formattedValue = formatDate(value);
            setExpiration(formattedValue);
        }
        else if (type === 'lowStockIndicator') {
            setLowStockIndicator(value);
        }
        else if (type === 'price') {
            setPrice(value);
        }
    }

    const handleSubmit = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        try {
            if (!houseId) {
                setModalMessage("Please select a house."); // Muestra el modal en lugar de un alert
                setModalVisible(true);
                setTimeout(() => {
                    setModalVisible(false);
                    // Navega a la siguiente página después de un retraso
                    navigation.navigate('Homes');
                }, 5000);

            }
            if (!selectedProduct || !quantity) {
                setModalMessage("Please select a product and enter a quantity."); // Muestra el modal en lugar de un alert
                setModalVisible(true);
            } else if (!isValidDate(expiration)) {
                setModalMessage("Please enter a valid expiration date in the format DD/MM/YYYY"); // Muestra el modal en lugar de un alert
                setModalVisible(true);
            } else {
                const stockUpdate = {productId: selectedProduct,
                    quantity: quantity, expiration: expiration, lowStockIndicator: lowStockIndicator, price: price};
                console.log('stockUpdate:', stockUpdate);
                await InventoryApi.updateHouseInventory(houseId, stockUpdate, navigation);
                setModalMessage("Inventory updated successfully!"); // Muestra el modal en lugar de un alert
                setModalVisible(true);
            }
            setExpiration('');
            setQuantity('');
            setLowStockIndicator('');
            setPrice('');
        } catch (error) {
            console.log("Error updating inventory:", error);
        }
    }

    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState(null);
    const [lastPress, setLastPress] = useState(0);
    const [timerId, setTimerId] = useState(null);

    const handleSingleAndDoubleClick = (product) => {
        const now = new Date().getTime();

        if (now - lastPress <= 300) { // Si los dos clics ocurren dentro de 300ms
            // Cancela la apertura del modal si se ha programado
            if (timerId !== null) {
                clearTimeout(timerId);
                setTimerId(null);
            }
            handleSuggestionPress(product);
        } else {
            // Programa la apertura del modal para que ocurra después de un breve retraso
            const id = setTimeout(() => {
                setSelectedProductDetails(product);
                setDetailsModalVisible(true);
            }, 300);
            setTimerId(id);
        }

        setLastPress(now);
    };



    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                <View>

                    <GoBackButton navigation={navigation}/>
                    <Text style={styles.title}>Add products!</Text>

                    <View style={styles.addProd}>
                        <Text style={styles.info}>Select a Product</Text>

                        <TextInput
                            style={styles.input}
                            value={query}
                            onChangeText={handleInputChangeProd}
                            placeholder="Select a product"
                        />
                        <FlatList
                            data={suggestions}
                            numColumns={3}
                            keyExtractor={(item) => item.producto_ID.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{flexDirection: 'row'}}
                                    onPress={() => handleSingleAndDoubleClick(item)}
                                >
                                    <Text style={styles.prod}>{item.nombre}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={detailsModalVisible}
                            onRequestClose={() => {
                                setDetailsModalVisible(!detailsModalVisible);
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalTitle}>Product Details</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        {selectedProductDetails?.isVerified && <MaterialIcons name="verified" size={24} color= '#00FFFF' />}
                                        <Text style={styles.modalText}>Name: {selectedProductDetails?.nombre}</Text>
                                    </View>
                                    <Text style={styles.modalText}>Brand: {selectedProductDetails?.marca}</Text>
                                    <Text style={styles.modalText}>Quantity type: {selectedProductDetails?.tipoDeCantidad}</Text>
                                    <Text style={styles.modalText}>Category: {selectedProductDetails?.category.nombre}</Text>
                                    <View style={styles.linksContainer}>
                                        <Pressable onPress={() => {
                                            handleSuggestionPress(selectedProductDetails);
                                            setDetailsModalVisible(false);
                                        }}>
                                            <Text style={styles.link}>Select this product</Text>
                                        </Pressable>
                                        <Pressable onPress={() => setDetailsModalVisible(false)} >
                                            <Text style={styles.link}>Close</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <TextInput style={styles.input}
                                   placeholder={"Quantity of products"}
                                   value={quantity.toString()}
                                   onChangeText={(value) => handleChanges(value, 'quantity')}
                                   inputMode="numeric"
                        />

                        <TextInput style={styles.input}
                                   placeholder={"DD/MM/YYYY"}
                                   value={expiration}
                                   onChangeText={(value) => handleChanges(value, 'expiration')}
                                   inputMode="text"
                        />

                        <TextInput style={styles.input}
                                   placeholder={"Low stock indicator"}
                                   value={lowStockIndicator}
                                   onChangeText={(value) => handleChanges(value, 'lowStockIndicator')}
                                   inputMode="numeric"
                        />

                        <TextInput style={styles.input}
                                   placeholder={"Total price"}
                                   value={price}
                                   onChangeText={(value) => handleChanges(value, 'price')}
                                   inputMode="numeric"
                        />

                        <View style={styles.linksContainer}>
                            <Pressable style={styles.link} onPress={handleSubmit}>
                                <Text style={{color: 'white', fontSize: 16}}>Add Stock</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation}/>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    link: {
        marginTop: 15,
        marginBottom: 10,
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        color: 'white',
        backgroundColor: '#4B5940',
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
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
    info: {
        fontSize: 25,
        fontFamily: 'lucida grande',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        color: '#F2EFE9',
        lineHeight: 30,
    },
    linksContainer: {
        marginTop: 20,
    },
    addProd: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 300,
        alignSelf: 'center',
    },
    createprod: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    },
    picker:{
        width: '50%',
        alignSelf: 'center',
        height: 60,
        backgroundColor: '#717336',
        borderColor: '#5d5e24',
        borderWidth: 2,
    },
    prod: {
        fontSize: 16,
        fontFamily: 'lucida grande',
        color: 'white',
        margin: 5,
        flex: 1, // Asegura que el elemento ocupe to do el espacio disponible
        justifyContent: 'center', // Centra el texto verticalmente
        alignItems: 'center', // Centra el texto horizontalmente
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
    modalTitle: {
        marginBottom: 35,
        fontWeight: 'bold',
        textAlign: "center",
        textDecorationStyle: 'dashed',
    },
});