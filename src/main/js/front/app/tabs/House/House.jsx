import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import {InventoryApi} from "../../Api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet } from 'react-native';
import {AuthContext} from "../../context/AuthContext";
import {useIsFocused} from "@react-navigation/native";
import NavBar from "../NavBar/NavBar";
import {AntDesign, FontAwesome, FontAwesome5, FontAwesome6, Ionicons} from "@expo/vector-icons";


export default function House({navigation}) {
    const {userToken, email} = React.useContext(AuthContext)
    const [categories, setCategories] = useState([]);
    const isFocused = useIsFocused();

    const [houseName, setHouseName] = useState('');

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        const loadHouseName = async () => {
            const name = await AsyncStorage.getItem('houseName');
            setHouseName(name);
        }

        if (isFocused) {
            getProducts().then(() => {
                console.log('Products loaded');
                loadHouseName();
            }, e => console.error('Error loading Products', e));
        }
        else {
            setQuery('');
            setSuggestions(categories);
            loadHouseName();
        }
    }, [isFocused]);

    const getProducts = async () => {
        try {
            const houseId = await AsyncStorage.getItem('houseId');

            console.log('house id is:', houseId);
            const categories = await InventoryApi.getHouseInventory(houseId);
            console.log('categories are:', categories);

            setCategories(categories);
            setSuggestions(categories);
        } catch (error) {
            console.log("Error getting products:", error);
        }
    }

    const handleInputChange = (text) => {
        setQuery(text);

        if (text === '') {
            setSuggestions(categories);
        } else {
            const regex = new RegExp(`${text.trim()}`, 'i');
            setSuggestions(categories.filter(category => category.search(regex) >= 0));
        }
    };

    const handleSuggestionPress = async (suggestion) => {
        setQuery(suggestion);
        setSuggestions([]);
        await AsyncStorage.setItem('category', suggestion);
        navigation.navigate("Product");
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.circle}>
                <Pressable onPress={() => handleSuggestionPress(item)}>
                    <Text style={styles.circleText}>{item}</Text>
                </Pressable>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>

                    <Text style={styles.title}>Welcome to {houseName}!</Text>
                    <View style={styles.logInCont}>
                        <Text style={styles.info}>Select a Category</Text>
                        <View style={styles.container2}>
                            <View style={{backgroundColor: '#3b0317', borderRadius: 30, flex: 2, alignItems: 'center',
                                flexDirection: 'row', justifyContent: 'space-between',margin: 5,}}>
                                <FontAwesome style={{paddingLeft:10}} name="search" size={24} color="white" />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleInputChange}
                                    value={query}
                                    placeholder="Search category"
                                />
                            </View>
                            <FlatList
                                data={suggestions}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                            />
                        </View>
                    </View>
                    <p></p>
                    <View style={styles.linksContainer}>
                        <View style={styles.linksContainer}>
                            <Pressable onPress={()=> navigation.navigate("Homes")}>
                                <Text style={styles.link}>
                                    <AntDesign name="home" size={24} color="white" /> Select another home
                                </Text>
                            </Pressable>
                            <Pressable style={{flexDirection: 'row', alignContent: 'center'}} onPress={()=> navigation.navigate("PieChart")}>
                                <Text style={styles.link}>
                                    <AntDesign name="piechart" size={24} color="white" /> See expenses
                                </Text>
                            </Pressable>
                            <Pressable onPress={()=> navigation.navigate("HouseUsersPage")}>
                                <Text style={styles.link}>
                                    <AntDesign name="user" size={24} color="white" /> Manage users
                                </Text>
                            </Pressable>
                        </View>
                        <View style={styles.linksContainer}>
                            <Pressable onPress={() => navigation.navigate("LowOnStock")}>
                                <Text style={styles.link}>
                                    <FontAwesome5 name="cart-arrow-down" size={24} color="white" /> Low on stock products
                                </Text>
                            </Pressable>
                            <Pressable onPress={() => navigation.navigate("AddStock")}>
                                <Text style={styles.link}>
                                    <FontAwesome6 name="cart-plus" size={24} color="white" /> Add a Product
                                </Text>
                            </Pressable>
                            <Pressable onPress={()=> navigation.navigate("RegisterProduct")}>
                                <Text style={styles.link}>
                                    <Ionicons name="create" size={24} color="white" /> Create a Product
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation}/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
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
        width: '90%',
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
        marginTop: 20,
        width: '95%',
        alignSelf: 'center',
        flex: 3,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    link: {
        marginTop: 5,
        marginBottom: 1,
        color: '#F2EFE9',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3, // Add border
        borderColor: '#717336', // Set border color
        padding: 15, // Add some padding so the text isn't right up against the border
        backgroundColor: '#717336', // Set background color
        width: 'auto', // Set width
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 100,
        fontSize: 16,
    },
    text: {
        marginTop: 5,
        marginBottom: 1,
        color: '#F2EFE9',
        textDecorationLine: 'underline',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto', // Set width
        alignSelf: 'center',
        alignContent: 'center',
        fontSize: 16,
    },
    container2: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    input: {
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
});