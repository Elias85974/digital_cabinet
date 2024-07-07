import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    ScrollView,
    SafeAreaView,
    TextInput,
    Modal
} from 'react-native';
import { WishlistApi} from '../../Api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NavBar from "../NavBar/NavBar";

export default function WishList({navigation}) {
    const [wishList, setWishList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const isFocused = navigation.isFocused();

    const [modalVisible, setModalVisible] = useState(false);
    const [newProduct, setNewProduct] = useState('');


    useEffect(() => {
        if (isFocused) {
            loadWishList().then(() => console.log("WishList loaded"));
        }
    }, [isFocused]);


    const loadWishList = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            const list = await WishlistApi.getWishList(userId);
            setWishList(list);
        } catch (error){
            console.log(error);
        }
    }

    const handleAddProduct = async () => {
        setModalVisible(true);
    }

    const handleSubmit = async () => {
        console.log(newProduct);
        const userId = await AsyncStorage.getItem('userId');
        await WishlistApi.addProductToWishList(newProduct, userId);
        await loadWishList();
        setModalVisible(false);
    }

    const handleCheck = (index) => {
        let newWishList = [...wishList];
        newWishList[index].checked = !newWishList[index].checked;
        setWishList(newWishList);

        if (newWishList[index].checked) {
            setSelectedItems([...selectedItems, newWishList[index]]);
        } else {
            setSelectedItems(selectedItems.filter(item => item.id !== newWishList[index].id));
        }
    }

    const handleUpdate = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const selectedProductNames = selectedItems.map(item => item.name);
        console.log(selectedProductNames);
        await WishlistApi.deleteProductFromWishList(selectedProductNames, userId);
        setSelectedItems([]);
        await loadWishList();
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Enter your wish product name</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={setNewProduct}
                                    value={newProduct}
                                />
                                <View style={styles.linksContainer}>
                                    <Pressable onPress={handleSubmit}>
                                        <Text style={styles.link}>Confirm Addition</Text>
                                    </Pressable>
                                    <Pressable onPress={() => setModalVisible(false)} >
                                        <Text style={styles.link}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <View>
                    <Text style={styles.title}>WishList</Text>
                    <View style={styles.contentWishList}>
                        <View style={styles.checklist}>
                            {wishList.map((item, index) => (
                                <View key={item.id} style={styles.item}>
                                    <TouchableOpacity style={styles.checkbox} onPress={() => handleCheck(index)}>
                                        {item.checked && <View style={styles.check} />}
                                    </TouchableOpacity>
                                    <Text style={styles.label}>{item.product}</Text>
                                </View>
                            ))}
                        </View>
                        <View >
                            <Pressable style={styles.link} onPress={handleAddProduct}>
                                <Text style={{color: 'white', fontSize: 16}}>Add Product</Text>
                            </Pressable>
                        </View>
                        <View >
                            <Pressable style={styles.link} onPress={handleUpdate}>
                                <Text style={{color: 'white', fontSize: 16}}>Update WishList</Text>
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
    checklist: {
        flex: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 16,
        height: 16,
        margin: 10,
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    check: {
        width: 8,
        height: 2,
        backgroundColor: '#717336',
    },
    label: {
        color: '#BFAC9B',
        marginRight: 20,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
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
        marginTop: 20,
    },
    contentWishList: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 150,
        alignSelf: 'center',
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#4B5940",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
})