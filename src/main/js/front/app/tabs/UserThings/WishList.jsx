import React, { useEffect, useState } from 'react';
import {View, Text, Button, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import { getWishList, addProductToWishList, deleteProductFromWishList, updateProductInWishList } from '../../Api';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WishList() {
    const [wishList, setWishList] = useState([]);
    const userId = AsyncStorage.getItem("userId");

    const mockWishList = [
        { id: '1', name: 'Bread', checked: false },
        { id: '2', name: 'Cheese', checked: false },
        { id: '3', name: 'Coffee', checked: false },
    ];

    useEffect(() => {
        setWishList(mockWishList);
    }, []);

    /*
    useEffect(() => {
        loadWishList();
    }, []);
*/

    const loadWishList = async () => {
        const list = await getWishList(userId);
        setWishList(list);
    }

    const handleAddProduct = async (product) => {
        await addProductToWishList(product);
        await loadWishList();
    }

    // pasar lista de productos a la api en forma de lista y aparte el userId
    const handleDeleteProduct = async (products, userId) => {
        await deleteProductFromWishList(products, userId);
        await loadWishList();
    }

    const handleUpdateProduct = async (product) => {
        await updateProductInWishList(product);
        await loadWishList();
    }

    const handleCheck = (index) => {
        let newWishList = [...wishList];
        newWishList[index].checked = !newWishList[index].checked;
        setWishList(newWishList);
    }

    return (
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
    );
}


const styles = StyleSheet.create({
    checklist: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 15,
        height: 15,
        margin: 15,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    check: {
        width: 8,
        height: 2,
        backgroundColor: '#4f29f0',
    },
    label: {
        color: '#414856',
        marginRight: 20,
    },
});