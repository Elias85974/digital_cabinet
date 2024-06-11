import React, { useEffect, useState } from 'react';
import {Pressable, Text, View} from 'react-native';
import {getHouseInventory} from "../../Api";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function House({navigation}) {
    const {userToken, email} = React.useContext(AuthContext)
    const [categories, setCategories] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused){
            getProducts().then(r => console.log("Products loaded")).catch(e => console.log("Error loading products"));
        }
    }, [isFocused]);

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
                        <View key={index} style={styles.circle}>
                            <Pressable onPress={async () => {
                                // Obtener el houseId de AsyncStorage
                                await AsyncStorage.setItem('category', category.toString());
                                // Navegar a la página House con el houseId correcto
                                navigation.navigate("Product");
                            }}>
                                <Text style={styles.circleText}>{category}</Text>
                            </Pressable>
                        </View>
                    ))}
                </View>
            </View>
            <p></p>
            <View style={styles.linksContainer}>
                <Pressable onPress={() => navigation.navigate("LowOnStock")}>
                    <Text style={styles.link}>Low on stock products</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("AddStock")}>
                    <Text style={styles.link}>Add a Product</Text>
                </Pressable>
                <Pressable onPress={()=> navigation.navigate("RegisterProduct")}>
                    <Text style={styles.link}>Create a Product</Text>
                </Pressable>
                <Pressable onPress={()=> navigation.navigate("PieChart")}>
                    <Text style={styles.link}>See your expenses</Text>
                </Pressable>
                <Pressable onPress={()=> navigation.navigate("Homes")}>
                    <Text style={styles.link}>Select another home</Text>
                </Pressable>
                <Pressable onPress={()=> navigation.navigate("HouseUsersPage")}>
                    <Text style={styles.link}>Manage users</Text>
                </Pressable>
            </View>
            <Tuple navigation={navigation}/>
        </View>
    );
}

import { StyleSheet } from 'react-native';
import {AuthContext} from "../../context/AuthContext";
import {useIsFocused} from "@react-navigation/native";
import Tuple from "../Contents/Tuple";
import ScrollViewWithEventThrottle
    from "react-native-web/dist/vendor/react-native/Animated/components/AnimatedScrollView";

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
        width: 500,
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
        flex: 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    circle: {
        paddingVertical: 10, // Controla el tamaño vertical del círculo
        paddingHorizontal: 20, // Controla el tamaño horizontal del círculo
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