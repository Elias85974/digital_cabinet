import React, { useEffect, useState } from 'react';
import {Pressable, Text, View} from 'react-native';
import {getHouseInventory} from "../../Api";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function House({navigation}) {
    const {userToken, email} = React.useContext(AuthContext)
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        try {
            const houseId = await AsyncStorage.getItem('houseId');

            console.log('house id is:', houseId);
            const categories = await getHouseInventory(houseId);
            console.log('categories are:', categories);

            setCategories(categories);
        } catch (error) {
            console.log("Error getting products:", error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Home!</Text>
            <View style={styles.logInCont}>
                <Text style={styles.info}>Select a Category</Text>
                <View style={styles.container2}>
                    {categories.map((category, index) => (
                        <View key={index}>
                            <Pressable onPress={async () => {
                                // Obtener el houseId de AsyncStorage
                                await AsyncStorage.setItem('category', category.toString());
                                // Navegar a la página House con el houseId correcto
                                navigation.navigate("Product");
                            }}>
                                <Text>{category}</Text>
                            </Pressable>
                        </View>
                    ))}
                </View>
            </View>
            <p></p>
            <View style={styles.linksContainer}>
                <Pressable onPress={() => navigation.navigate("AddStock")}>
                    <Text style={styles.link}>Add a Product</Text>
                </Pressable>
                <Pressable onPress={()=> navigation.navigate("RegisterProduct")}>
                    <Text style={styles.link}>Create a Product</Text>
                </Pressable>
                <Pressable onPress={()=> navigation.navigate("Homes")}>
                    <Text style={styles.link}>Select another home</Text>
                </Pressable>
                <Pressable onPress={()=> navigation.navigate("HouseUsersPage")}>
                    <Text style={styles.link}>Manage users</Text>
                </Pressable>
            </View>
        </View>
    );
}

import { StyleSheet } from 'react-native';
import {AuthContext} from "../../context/AuthContext";

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
        marginTop: 20,
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
});