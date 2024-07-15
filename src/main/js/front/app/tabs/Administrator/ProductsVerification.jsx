import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, ScrollView} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import {getUnverifiedProducts, verifyProduct} from "../../api/products";
import Collapsible from "react-native-collapsible";
import {inboxStyles} from "../UserThings/Notification/InboxStyles";
import LogoutButton from "../NavBar/LogoutButton";

export default function ProductsVerification({navigation}) {
    const [products, setProducts] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused){
            getProductList()
        }
    }, [isFocused]);

    const getProductList = async () => {
        const prods = await getUnverifiedProducts(navigation);
        console.log(prods)
        setProducts( prods)
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

    // Agrupar productos por categoría
    const productsByCategory = products.reduce((acc, product) => {
        (acc[product.categoria] = acc[product.categoria] || []).push(product);
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <Text style={styles.title}>Unverified Products</Text>
                <ScrollView style={[inboxStyles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>

                    {Object.entries(productsByCategory).map(([category, products]) => (
                        <View key={category}>
                            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                                <Text style={styles.categoryTitle}>{category}</Text>
                            </TouchableOpacity>
                            <Collapsible collapsed={isCollapsed}>
                                <FlatList
                                    data={products}
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
                    ))}
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
        color: '#1B1A26',
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
    },
});

