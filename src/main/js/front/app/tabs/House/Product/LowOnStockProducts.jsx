import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TextInput,
    Pressable,
    FlatList,
    SafeAreaView,
    ScrollView
} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {InventoryApi} from "../../../Api";
import NavBar from "../../NavBar/NavBar";
import GoBackButton from "../../NavBar/GoBackButton";
import ProductInfoModal from "../../Contents/Stock/ProductInfoModal";
import SearchBar from "../../Contents/SearchBar";

export default function LowOnStockProducts({navigation}) {
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

    const [currentPage, setCurrentPage] = useState('lowStock');


    useEffect(() => {
        getProducts();
    }, [refreshKey]);

     const getProducts = async () => {
        try {
            const houseId = await AsyncStorage.getItem('houseId');
            const stock = await InventoryApi.getLowOnStockProducts(houseId, navigation);
            console.log("getProducts?",stock);
            setProducts(stock);
            setSuggestions(stock)
            setModalReduce(false);
            setModalAdd(false);
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
    };


    const handleFilteredProducts = (filteredProducts) => {
        console.log("Filtered products in lowstock:", filteredProducts);
        setFilteredProducts(filteredProducts);
    }

    // Define la función de actualización
    const updateProducts = (updatedProducts) => {
        setProducts(updatedProducts);
        navigation.navigate('LowOnStock', {key: refreshKey});
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
                        <Text style={styles.title}>Low on Stock Products</Text>
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
                            currentPage={currentPage}
                            setModalProductInfo={setModalProductInfo}
                            modalProductInfo={modalProductInfo}
                            selectedProduct={selectedProduct}
                            modalReduce={modalReduce}
                            modalAdd={modalAdd}
                            styles={styles}
                            navigation={navigation}
                        />

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