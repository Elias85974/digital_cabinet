import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getProductsFromHouseAndCategory} from "../../../Api";

export default function Product({navigation}) {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getProducts().then(r => console.log("Products loaded")).catch(e => console.log("Error loading products"));
        }
    }, [isFocused]);

    const getProducts = async () => {
        try {
            const category = await AsyncStorage.getItem('category');
            const houseId = await AsyncStorage.getItem('houseId');
            const products = await getProductsFromHouseAndCategory(houseId, category);
            console.log(products);
            setFilteredProducts(products);
        } catch (error) {
            console.log("Error getting products:", error);
        }
    }

    return (
        <View style={styles.container}>
            <View>
                {filteredProducts.map((product, index) => (
                    <View key={index}>
                        <Text>{product.nombre}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 4,
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
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
});
