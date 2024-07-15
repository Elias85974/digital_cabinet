import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, ScrollView} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import {getUnverifiedProducts, verifyProduct} from "../../api/products";
import Collapsible from "react-native-collapsible";
import {inboxStyles} from "../UserThings/Notification/InboxStyles";
import LogoutButton from "../NavBar/LogoutButton";
import {CategoriesApi} from "../../Api";
import {getCategories} from "../../api/categories";

export default function ProductsVerification({navigation}) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [isCollapsed, setIsCollapsed] = useState({});

    const toggleCollapse = (categoryName) => {
        setIsCollapsed(prevState => ({
            ...prevState,
            [categoryName]: !prevState[categoryName]
        }));
    }

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused){
            getProductList()
            getCategoryList();
        }
    }, [isFocused]);

    const getProductList = async () => {
        const prods = await getUnverifiedProducts(navigation);
        console.log(prods)
        setProducts( prods)
    }

    const getCategoryList = async () => {
        const cats = await getCategories(navigation);
        console.log(cats)
        setCategories(cats)

        // Inicializar isCollapsed para que todas las categorías estén colapsadas
        const initialIsCollapsed = cats.reduce((acc, category) => {
            acc[category.nombre] = true;
            return acc;
        }, {});
        setIsCollapsed(initialIsCollapsed);
    }

    const handleAccept = async (productId) => {
        const verified = {productId: productId.toString(), isAccepted: true};
        await processVerification(verified);
    }

    const handleReject = async (productId) => {
        const verified = {productId: productId.toString(), isAccepted: false};
        await processVerification(verified);
    }

    const processVerification = async (verified) => {
        try {
            await verifyProduct(verified, navigation);
            await getProductList();
        } catch (error) {
            console.error('Failed to process verification:', error);
        }
    }


    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <Text style={styles.title}>Unverified Products</Text>
                <ScrollView style={[inboxStyles.contentContainer, {marginBottom: 55}]} showsVerticalScrollIndicator={false}>

                    {categories.filter(category => {
                        const productsInCategory = products.filter(product => product.category.nombre === category.nombre);
                        return productsInCategory.length > 0;
                    }).map((category) => {
                        const productsInCategory = products.filter(product => product.category.nombre === category.nombre);

                        return (
                            <View key={category.nombre}>
                                <TouchableOpacity style={styles.categoryTitleCon} onPress={() => toggleCollapse(category.nombre)}>
                                    <Text style={styles.categoryTitle}>{category.nombre}</Text>
                                </TouchableOpacity>
                                <Collapsible collapsed={isCollapsed[category.nombre]}>
                                    <FlatList
                                        data={productsInCategory}
                                        numColumns={2}
                                        keyExtractor={item => item.producto_ID.toString()}
                                        renderItem={({item}) => (
                                            <View style={styles.product}>
                                                <Text style={styles.productName}>{item.nombre}</Text>
                                                <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.producto_ID)}>
                                                    <Text style={styles.buttonText}>Accept</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.producto_ID)}>
                                                    <Text style={styles.buttonText}>Reject</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                </Collapsible>
                            </View>
                        );
                    })}
                </ScrollView>
                <LogoutButton navigation={navigation}/>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    // ... tus otros estilos ...
    product: {
        flex: 1,
        margin: 5,

        backgroundColor: '#4B5940',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        width: '80%',
    },
    acceptButton: {
        backgroundColor: 'green',
        padding: 10,
        marginVertical: 5,
    },
    rejectButton: {
        backgroundColor: 'red',
        padding: 10,
        marginVertical: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'sans-serif',
        justifyContent: 'center',
        textAlign: 'center',
    },
    categoryTitleCon: {
        backgroundColor: '#3b0317',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        width: '60%',
        alignSelf: 'center',
    },
    container: {
        height: '100%',
        width: '100%',
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
    productName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        justifyContent: 'center',
        textAlign: 'center',
    },
});

