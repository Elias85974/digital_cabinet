import React, {useState, useEffect} from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
import { Image } from 'react-native';
import {router, useLocalSearchParams} from "expo-router";
import RNPickerSelect from 'react-native-picker-select';

import {authentication, createProduct, getCategories, createCategory} from "../Api";
import BackButton from "./BackButton";

export default function RegisterProduct() {
    const { houseId } = useLocalSearchParams();

    const initialProductState = {nombre: '', marca: '', tipoDeCantidad: ''};
    let [newProduct, setNewProduct] = useState(initialProductState);

    let [categories, setCategories] = useState([]);
    let [newCategory, setNewCategory] = useState('');
    let [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

    const quantityTypes = ['Gramos', 'Litros', 'Unidades', 'Kilogramos'];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
    };

    const handleInputChange = (field, value) => {
        console.log(`handleInputChange called with field: ${field} and value: ${value}`);
        setNewProduct({...newProduct, [field]: value});
    };

    const handleCategoryChange = (selectedCategory) => {
        console.log(`handleCategoryChange called with selectedCategory: ${selectedCategory}`);
        if (selectedCategory === 'addNew') {
            setShowNewCategoryInput(true);
        } else {
            setShowNewCategoryInput(false);
            setNewProduct({...newProduct, categoryId: selectedCategory});
        }
    };

    const handleNewCategoryChange = (value) => {
        setNewCategory(value);
    };

    const handleCreateCategory = async () => {
        const createdCategory = await createCategory({nombre: newCategory});
        setCategories([...categories, createdCategory]);
        setNewProduct({...newProduct, categoryId: createdCategory.id});
        setShowNewCategoryInput(false);
    };

    const handleCreateProduct = async() => {
        try {
            if (newProduct.nombre && newProduct.marca && newProduct.tipoDeCantidad && newProduct.categoryId) {
                if (await authentication() === true) {
                    createProduct(newProduct).then(r => {
                        alert("Product created successfully!");
                        setNewProduct(initialProductState);
                    });
                }
                else {
                    alert("You must be logged in to access this page. Going back to LoginPage");
                    router.replace("LoginPage");
                }
            } else {
                alert("Please fill in all fields.")
            }
        } catch (error) {
            console.log("Error creating product:", error);
        }
    }

    const movePage = async (url) => {
        try {
            if (await authentication() === true) {
                router.replace(url);
            }
            else {
                alert("Session expired. Going back to LoginPage");
                router.replace("LoginPage");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
                <View style={{flexDirection: 'row', alignItems: 'flex-start' }}>

                    <View>
                        <Text style={styles.title}>Products</Text>
                        <View style={styles.createProd}>
                            <Text style={styles.info}>Please fill in all fields to create your product</Text>
                            <TextInput style={styles.input}
                                       placeholder="Nombre"
                                       value={newProduct.nombre}
                                       onChangeText={(value) => handleInputChange('nombre', value)}
                            />
                            <TextInput style={styles.input}
                                       placeholder="Marca"
                                       value={newProduct.marca}
                                       onChangeText={(value) => handleInputChange('marca', value)}
                            />
                            <p></p>
                            <View style={styles.picker}>
                                <RNPickerSelect
                                    onValueChange={(value) => handleInputChange('tipoDeCantidad', value)}
                                    items={[
                                        ...quantityTypes.map((type) => ({
                                            label: type,
                                            value: type,
                                        })),
                                    ]}
                                    placeholder={{label: "Select a quantity type", value: null}}
                                    style={styles.pickerSelectStyles}
                                />
                            </View>

                            {showNewCategoryInput ? (
                                <View>
                                    <TextInput style={styles.input}
                                               placeholder="New Category"
                                               value={newCategory}
                                               onChangeText={handleNewCategoryChange}
                                    />
                                    <View style={styles.linksContainer}>
                                        <Pressable style={styles.link} onPress={handleCreateCategory}>
                                            <Text style={{color: 'white', fontSize: 16}}>Create Category</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.picker}>
                                    <RNPickerSelect
                                        onValueChange={(value) => {
                                            handleCategoryChange(value);
                                        }}
                                        items={[
                                            ...categories.map((category) => ({
                                                label: category.nombre,
                                                value: category.categoria_ID,
                                            })),
                                            {label: "Add new category", value: "addNew"},
                                        ]}
                                        placeholder={{label: "Select a category", value: null}}
                                        style={styles.pickerSelectStyles}
                                    />
                                </View>
                            )}
                            <p></p>
                            <Pressable style={styles.link} onPress={handleCreateProduct}>
                                <Text style={{color: 'white', fontSize: 16}}>Create Product</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center',marginTop: 170}}>
                        <Pressable style={styles.button} >
                            <BackButton />
                        </Pressable>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
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
        marginBottom: 30,
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
    },
    createProd: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    },
    picker:{
        padding: 10,
    },
    pickerSelectStyles: {
        inputIOS: {
            color: 'white',
            backgroundColor: '#4B5940',
            padding: 10,
            justifyContent: 'center',
            alignContent: 'center',
            height: 50,
            width: 200,
            textAlign: 'center',
            borderWidth: 2,
            borderColor: '#717336',
        },
        inputWeb: {color: 'white',
            backgroundColor: '#4B5940',
            padding: 10,
            justifyContent: 'center',
            alignContent: 'center',
            height: 50,
            width: 200,
            textAlign: 'center',
            borderWidth: 2,
            borderColor: '#717336',
        },
        inputAndroid: {color: 'white',
            backgroundColor: '#4B5940',
            padding: 10,
            justifyContent: 'center',
            alignContent: 'center',
            height: 50,
            width: 200,
            textAlign: 'center',
            borderWidth: 2,
            borderColor: '#717336',
        }
    },

    button:{
        backgroundColor: 'white',
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        overflow: 'hidden',
        alignSelf: 'flex-end',
        width: 55,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});