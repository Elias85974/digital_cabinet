import React, { useEffect, useState } from 'react';
import {Link, router, usePathname} from 'expo-router';
import {Pressable, Text, View, StyleSheet, Animated, Modal, Alert} from 'react-native';
import {authentication, getHouseInventory} from "../../Api";

import RegisterProduct from '../RegisterProduct';
import BackButton from '../BackButton.jsx';
import AddProduct from '../AddStock/[houseId]';



export default function House() {
    const pathname = usePathname();
    const id = pathname.split('/')[2]; // Assuming your URL is in the format of '/house/:id'
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            console.log('id is', id);
            const products = await getHouseInventory(id);
            console.log('getHouseInventory response:', products);
            setProducts(products);
            // Get unique categories from products
            setCategories([...new Set(products.map(product => product.category))]);
        } catch (error) {
            console.log("Error getting products:", error);
        }
    }

    const movePage = async (url) => {
        try {
            if (await authentication() === true) {
                router.replace(url);
            }
            else {
                alert("You must be logged in to access this page (Session Expired). Going back to LoginPage");
                router.replace("LoginPage");
            }
        }
        catch (error) {
            console.log("Error moving to login page:", error);
        }
    }

    const [modalVisible_RegProd, setModalVisible_RegProd] = useState(false);
    const [modalVisible_AddStock, setModalVisible_AddStock] = useState(false);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Home!</Text>

            {/* muestra los productos creados --> agregar buscador por categoria */}
            <View style={styles.logInCont}>
                <Text style={styles.info}>Select a Category</Text>
                <View style={styles.container2}>
                    {categories.map((category, index) => (
                        <View key={index}>
                            <Link href={`/Product/${category.categoryId}`} state={{ filteredProducts: products.filter(product => product.category === category) }}>{category.nombre}</Link>
                        </View>
                    ))}
                </View>
            </View>


            <View style={{padding: 150}}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>

                    {/* empieza el modal de crear productos nuevos*/}
                    <View style={styles.centeredView}>
                        <Modal
                            animationType={"fade"}
                            transparent={true}
                            visible={modalVisible_RegProd}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                                setModalVisible_RegProd(!modalVisible_RegProd);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalViewP}>
                                    <RegisterProduct/>
                                    <View style={styles.buttonP}>
                                        <BackButton
                                            onPress={() => setModalVisible_RegProd(false)}/>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <Pressable
                            onPress={() => setModalVisible_RegProd(true)}>
                            <Text style={styles.link}>Add Product</Text>
                        </Pressable>
                    </View>

                    {/* empieza el modal de añadir stock*/}
                    <View style={styles.centeredView}>
                        <Modal
                            animationType={"fade"}
                            transparent={true}
                            visible={modalVisible_AddStock}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                                setModalVisible_AddStock(!modalVisible_AddStock);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalViewS}>
                                    <AddProduct/>
                                    <View style={styles.buttonS}>
                                        <BackButton
                                            onPress={() => setModalVisible_AddStock(false)}/>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <Pressable
                            onPress={() => setModalVisible_AddStock(true)}>
                            <Text style={styles.link}>Add Stock</Text>
                        </Pressable>
                    </View>

                </View>

                <Pressable>
                        <Link href={"../Homes"} style={styles.link}>Select another home</Link>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 50,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
    },
    logInCont: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 300,
        alignSelf: 'center',
    },
    info: {
        fontSize: 25,
        fontFamily: 'lucida grande',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        color: '#F2EFE9',
        lineHeight: 30,
    },
    linksContainer: {
        marginBottom: 20,
        marginTop: 200,
    },
    link: {
        marginTop: 10,
        marginBottom: 50,
        color: '#F2EFE9',
        textDecorationLine: 'underline',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3, // Add border
        borderColor: '#717336', // Set border color
        padding: 10, // Add some padding so the text isn't right up against the border
        backgroundColor: '#717336', // Set background color
        width: 250, // Set width
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 100,
        fontSize: 16,
    },
    container2: {
        flex: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 35,
        backgroundColor: '#BFAC9B',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    circleText: {
        color: 'white',
        fontSize: 25,
    },
    product: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pressable: {
        padding: 10,
        margin: 10,
    },


    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    modalViewP: {
        backgroundColor: '#BFAC9B',
        borderRadius: 20,
        borderColor: '#a08c78',
        borderWidth: 5,
        paddingRight: 45,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 20,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 520,

        margin: 20,
    },

    modalViewS: {
        backgroundColor: '#BFAC9B',
        borderRadius: 20,
        borderColor: '#a08c78',
        borderWidth: 5,
        paddingRight: 45,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 20,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: 470,
    },

    buttonP:{
        backgroundColor: 'white',
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        overflow: 'hidden',
        alignSelf: 'flex-end',
        width: 55,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 180,
        right: 6,
    },
    buttonS:{
        backgroundColor: 'white',
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        overflow: 'hidden',
        alignSelf: 'flex-end',
        width: 55,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 255,
        right: 6,
    },

    absolute: {
    position: "absolute",
    top: 0, left: 0, bottom: 0, right: 0,
    },

});