import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Modal, TextInput, Pressable, FlatList, SafeAreaView, ScrollView,} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FetchApi, InventoryApi,} from "../../../Api";
import ModalAlert from "../../Contents/ModalAlert";
import NavBar from "../../NavBar/NavBar";
import {FontAwesome} from "@expo/vector-icons";
import GoBackButton from "../../NavBar/GoBackButton";
import ReduceStockModal from "../../Contents/Stock/ReduceStockModal";
import TupleStock from "../../Contents/Stock/TupleStock";
import ProductInfoModal from "../../Contents/Stock/ProductInfoModal";
import SearchBar from "../../Contents/SearchBar";


export default function ByCategory({navigation}) {
    const [products, setProducts] = useState([]);

    const [modalProductInfo, setModalProductInfo] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [modalReduce, setModalReduce] = useState(false);


    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantityToAdd, setQuantityToAdd] = useState('');
    const [quantityToReduce, setQuantityToReduce] = useState('');

    const [refreshKey, setRefreshKey] = useState(0);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [filteredProducts, setFilteredProducts] = useState([]);
    const isFocused = useIsFocused();

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

    const [categoryName, setCategoryName] = useState('')
    const [reduceProduct, setReduceProduct] = useState([]);


    useEffect(() => {
        if (isFocused) {
            const fetchProds = async () => {
                const newProds = await getProducts().then(r => {
                    console.log("Products loaded");
                }).catch(e => console.log("Error loading products"));
                setReduceProduct(newProds);
            }
            const loadCategoryName = async () => {
                const name = await AsyncStorage.getItem('categoryName');
                setCategoryName(name);
            }
            fetchProds();
            loadCategoryName();
        }
        console.log('refresh key puto cambiate', refreshKey)
    }, [isFocused, refreshKey]);

    const getProducts = async () => {
        try {
            const category = await AsyncStorage.getItem('categoryName');
            const houseId = await AsyncStorage.getItem('houseId');
            const products = await InventoryApi.getProductsFromHouseAndCategory(houseId, category, navigation);
            console.log('productos cargados',products);

            setProducts(products);
            setSuggestions(products);
            console.log('reduce Products:', setReduceProduct(products));

        } catch (error) {
            console.log("Error getting products:", error);
        }
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
        setModalProductInfo(true);
        setQuery(''); //esto no esta en el otro
    };

    const handleFilteredProducts = (filteredProducts) => {
        console.log("Filtered products in stock:", filteredProducts);
        setFilteredProducts(filteredProducts);
    }

    // Define la función de actualización
    const updateProducts = (updatedProducts) => {
        setProducts(updatedProducts);
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
                <View>
                    <GoBackButton navigation={navigation}/>
                    <Text style={styles.title}>Products in {categoryName}</Text>
                    <View style={styles.container2}>
                        <SearchBar
                            styles={styles}
                            handleInputChange={handleInputChange}
                            query={query}
                            products={products}
                            handleFilteredProducts={handleFilteredProducts}
                        />
                        <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                            <FlatList
                                data={filteredProducts.length > 0 ? filteredProducts : products}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                            />
                        </ScrollView>
                    </View>

                    <ProductInfoModal
                        updateProducts={updateProducts}

                        modalProductInfo={modalProductInfo}
                        setModalProductInfo={setModalProductInfo}

                        selectedProduct={selectedProduct}

                        setModalReduce={setModalReduce}
                        modalReduce={modalReduce}

                        setModalAdd={setModalAdd}
                        modalAdd={modalAdd}

                        setQuantityToReduce={setQuantityToReduce}
                        quantityToReduce={quantityToReduce}

                        setQuantityToAdd={setQuantityToAdd}
                        quantityToAdd={quantityToAdd}

                        styles={styles}
                        refreshKey={refreshKey}
                        setRefreshKey={setRefreshKey}
                    />

                    <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                </View>
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
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
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