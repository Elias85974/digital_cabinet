import React, { useEffect, useState } from 'react';
import {View, Text, Button, FlatList, Pressable} from 'react-native';
import { getWishList, addProductToWishList, deleteProductFromWishList, updateProductInWishList } from '../../Api';
import LogoutButton from "../Contents/LogoutButton";

export default function WishList() {
    const [wishList, setWishList] = useState([]);
    const lol = [{houseId: 1, username: "Elias"},{houseId: 2, username: "Juli"},
        {houseId: 3, username: "Macky"}];
    const elias = lol[0].username;

    useEffect(() => {
        loadWishList();
    }, []);

    const loadWishList = async () => {
        const list = await getWishList();
        setWishList(list);
    }

    const handleAddProduct = async (product) => {
        await addProductToWishList(product);
        loadWishList();
    }

    const handleDeleteProduct = async (productId) => {
        await deleteProductFromWishList(productId);
        loadWishList();
    }

    const handleUpdateProduct = async (product) => {
        await updateProductInWishList(product);
        loadWishList();
    }

    return (
        <View>
            <FlatList
                data={wishList}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <View>
                        <Text>{item.name}</Text>
                        <Button title="Add" onPress={() => handleAddProduct(item)}/>
                        <Button title="Delete" onPress={() => handleDeleteProduct(item.id)}/>
                        <Button title="Update" onPress={() => handleUpdateProduct(item)}/>
                    </View>
                )}
            />

            <p></p>
            <View style={styles.linksContainer}>
                <Pressable onPress={() => navigation.navigate("RegisterHome")}>
                    <Text style={styles.link}>Create a Home</Text>
                </Pressable>
                <LogoutButton navigation={navigation}/> {/* Add the LogoutButton component */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    logInCont: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 300,
        alignSelf: 'center',
    }
});