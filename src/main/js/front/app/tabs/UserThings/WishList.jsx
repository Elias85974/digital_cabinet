import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Pressable, ScrollView} from 'react-native';
import { getWishList, addProductToWishList, deleteProductFromWishList } from '../../Api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tuple from "../Contents/Tuple";

export default function WishList({navigation}) {
    const [wishList, setWishList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const userId = AsyncStorage.getItem("userId");

    const mockWishList = [
        { id: '1', name: 'Bread', checked: false },
        { id: '2', name: 'Cheese', checked: false },
        { id: '3', name: 'Coffee', checked: false },
    ];

    useEffect(() => {
        setWishList(mockWishList);
    }, []);


    useEffect(() => {
        loadWishList();
    }, []);


    const loadWishList = async () => {
        try {
            const list = await getWishList(userId);
            setWishList(list);
        } catch (error){
            console.log(error)
        }
    }

    const handleAddProduct = async () => {
        const newProduct = prompt("Enter the new product name:");
        addProductToWishList(newProduct);
        loadWishList();
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
        const selectedProductNames = selectedItems.map(item => item.name);
        console.log(selectedProductNames);
        deleteProductFromWishList(selectedProductNames, userId);
        setSelectedItems([]);
        loadWishList();
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 20}} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>WishList</Text>
                    <View style={styles.contentWishList}>
                        <View style={styles.checklist}>
                            {wishList.map((item, index) => (
                                <View key={item.id} style={styles.item}>
                                    <TouchableOpacity style={styles.checkbox} onPress={() => handleCheck(index)}>
                                        {item.checked && <View style={styles.check} />}
                                    </TouchableOpacity>
                                    <Text style={styles.label}>{item.name}</Text>
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
                    <Tuple navigation={navigation}/>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    checklist: {
        flex: 1,
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
        width: 18,
        height: 18,
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
        marginBottom: 20,
        marginTop: 20,
    },
    contentWishList: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 150,
        alignSelf: 'center',
    }
})