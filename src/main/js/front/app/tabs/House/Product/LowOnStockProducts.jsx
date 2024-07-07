import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Modal,
    TextInput,
    Alert,
    Pressable,
    FlatList,
    SafeAreaView,
    ScrollView
} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getLowOnStockProducts, addStock} from "../../../Api";
import Tuple from "../../Contents/Tuple";
import FilterModal from "../../Contents/FilterModal";
import {useFocusEffect} from "expo-router";
import NavBar from "../../NavBar/NavBar";

export default function LowOnStockProducts({navigation}) {
    const [products, setProducts] = useState([]);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantityToAdd, setQuantityToAdd] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const isFocused = useIsFocused();

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [filteredProducts, setFilteredProducts] = useState([]);

    //const displayedProducts = applyFilters(products);

  /* useEffect(() => {
        if (isFocused) {
            getProducts().then(r => {
                //const filteredProducts = applyFilters(r);
                console.log("Products loaded at first is 0", products);
                //setProducts(filteredProducts);
                handleFilteredProducts(products);
                console.log("Filtered products loaded", filteredProducts);

            }).catch(e => console.log("Error loading products"));
        }
        console.log("refresh puto key aberte", refreshKey);
    }, [isFocused, refreshKey]);
*/
    useEffect(() => {
        getProducts();
    }, [refreshKey]);

     const getProducts = async () => {
        try {
            const houseId = await AsyncStorage.getItem('houseId');
            const stock = await getLowOnStockProducts(houseId);
            console.log("getProducts?",stock);
            setProducts(stock);
            setSuggestions(stock)
        } catch (error) {
            console.log("Error getting products:", error);
        }
    }

    const handleAddStock = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        await addStock(houseId, {productId: selectedProduct.product.producto_ID, quantity: quantityToAdd});
        setModalVisible3(false);
        setModalVisible2(false);
        setQuantityToAdd('');
        setRefreshKey(oldKey => oldKey + 1);

        const stock = await getLowOnStockProducts(houseId);
        setProducts(stock)
        setSuggestions(stock)
        setFilteredProducts(stock)
        console.log("Products loaded after adding stock", stock);
        let key = refreshKey;
        setRefreshKey(oldKey => oldKey + 1);
navigation.navigate('LowOnStock', {key: refreshKey});
    }

    const handleInputChange = (text) => {
        setQuery(text);

        if (text === '') {
            setSuggestions(products);
        } else {
            const regex = new RegExp(`${text.trim()}`, 'i');
            setSuggestions(products.filter(product => product.product.nombre.search(regex) >= 0));
        }
    };

    const handleSuggestionPress = (suggestion) => {
        setQuery(suggestion.product.nombre);
        setSuggestions([]);
        setSelectedProduct(suggestion);
        setModalVisible2(true);
    };



    const handleFilteredProducts = (filteredProducts) => {
        console.log("Filtered products in lowstock:", filteredProducts);
        setFilteredProducts(filteredProducts);
    }

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
        <View style={styles.container} key={refreshKey}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                    <View>
                        <View style={styles.container2}>
                            <View style={{backgroundColor: '#3b0317', borderRadius: 30, flex: 2, alignItems: 'center',
                                flexDirection: 'row', justifyContent: 'space-between',margin: 5,}}>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleInputChange}
                                    value={query}
                                    placeholder="Search product"
                                />
                                <FilterModal products={products} onFilter={handleFilteredProducts} />
                            </View>
                            <FlatList
                                data={filteredProducts.length > 0 ? filteredProducts : products}
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
                                            <Text style={styles.link}>Add Stock</Text>
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
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation}/>
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
});