import React, {useState, useEffect} from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
import Picker from 'react-native-picker-select';
import {Link, Redirect, router} from "expo-router";
import {authentication, createProduct, getCategories, createCategory} from "../Api";

export default function RegisterProduct() {
    let [newProduct, setNewProduct] = useState({nombre: '', marca: '', tipoDeCantidad: ''});
    // no quiere funcionar con redirect ni router --> const [houseCreated, setHouseCreated] = useState(false);
    let [categories, setCategories] = useState([]);
    let [newCategory, setNewCategory] = useState('');
    let [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const quantityTypes = ['Gramos', 'Litros', 'Unidades', 'Kilogramos'];

    /*
    const isTipoDeCant = (tipoDeCantidad) =>
        /^[A-Z0-9.]+\s+[0-9]+$/i.test(tipoDeCantidad);
     */

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

    const handleCreateProduct = () => {
        try {
            if (newProduct.nombre && newProduct.marca && newProduct.tipoDeCantidad && newProduct.categoryId) {
                createProduct(newProduct).then(r => alert("Product created successfully!"));
            } else {
                alert("Please fill in all fields.")
            }
        } catch (error) {
            console.log("Error creating product:", error);
        } finally {
            if (authentication() === true) {
                router.replace("RegisterProduct")
            }
            else {
                alert("Session expired. Going back to LoginPage");
                router.replace("LoginPage");
            }
        }
    };

    const movePage = async () => {
        try {
            if (await authentication() === true) {
                router.replace("Homes");
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
            <TextInput
                placeholder="Nombre"
                value={newProduct.nombre}
                onChangeText={(value) => handleInputChange('nombre', value)}
            />
            <TextInput
                placeholder="Marca"
                value={newProduct.marca}
                onChangeText={(value) => handleInputChange('marca', value)}
            />
            <View style={{width: '12%', alignSelf: 'center'}}>
                <Picker
                    onValueChange={(value) => handleInputChange('tipoDeCantidad', value)}
                    items={[
                        ...quantityTypes.map((type) => ({
                            label: type,
                            value: type,
                        })),
                    ]}
                    placeholder={{ label: "Select a quantity type", value: null }}
                />
            </View>

            {showNewCategoryInput ? (
                <View>
                    <TextInput
                        placeholder="New Category"
                        value={newCategory}
                        onChangeText={handleNewCategoryChange}
                    />
                    <Pressable onPress={handleCreateCategory}>
                        <Text>Create Category</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={{width: '12%', alignSelf: 'center'}}>
                    <Picker
                        onValueChange={(value) => {
                            handleCategoryChange(value);
                        }}
                        items={[
                            ...categories.map((category) => ({
                                label: category.nombre,
                                value: category.categoria_ID,
                            })),
                            { label: "Add new category", value: "addNew" },
                        ]}
                        placeholder={{ label: "Select a category", value: null }}
                    />
                </View>
            )}
            <Pressable onPress={handleCreateProduct}>
                <Text>Create Product</Text>
            </Pressable>
            <Pressable onPress={movePage}>
                <Text>Go Back</Text>
            </Pressable>
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
});