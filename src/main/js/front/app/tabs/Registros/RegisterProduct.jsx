import React, {useState, useEffect} from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet} from "react-native";
import Picker from 'react-native-picker-select';

import {createProduct, getCategories, createCategory} from "../../Api";
import Tuple from "../Contents/Tuple";
import ModalAlert from "../Contents/ModalAlert";

export default function RegisterProduct({navigation}) {
    let [newProduct, setNewProduct] = useState({nombre: '', marca: '', tipoDeCantidad: ''});
    let [categories, setCategories] = useState([]);
    let [newCategory, setNewCategory] = useState('');
    let [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const quantityTypes = ['Gramos', 'Litros', 'Unidades', 'Kilogramos'];

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal


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
        setNewCategory('');
    };

    const handleCreateProduct = async() => {
        try {
            if (newProduct.nombre && newProduct.marca && newProduct.tipoDeCantidad && newProduct.categoryId) {
                createProduct(newProduct).then(r =>
                    setModalMessage("Product created successfully!"), // Muestra el modal en lugar de un alert
                    setModalVisible(true),
                );
                setTimeout(() => {
                    setModalVisible(false);
                    // Navega a la siguiente página después de un retraso
                    navigation.navigate('House');
                }, 5000);
            } else {
                setModalMessage("Please fill in all fields."); // Muestra el modal en lugar de un alert
                setModalVisible(true);
            }
        } catch (error) {
            console.log("Error creating product:", error);
        }
    }


    return (
        <View style={styles.container}>
            <ScrollView style={{marginTop: 10}} showsVerticalScrollIndicator={false}>
                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                <View>
                    <Text style={styles.title}>Products</Text>
                    <View style={styles.createprod}>
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
                        <View style={ styles.picker}>
                            <Picker
                                onValueChange={(value) => handleInputChange('tipoDeCantidad', value)}
                                items={[
                                    ...quantityTypes.map((type) => ({
                                        label: type,
                                        value: type,
                                    })),
                                ]}
                                placeholder={{label: "Select a quantity type", value: null}}
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
                                    <Pressable onPress={handleCreateCategory}>
                                        <Text style={styles.link}>Create Category</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ) : (
                            <View style={ styles.picker}>
                                <Picker
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
                                />
                            </View>
                        )}
                        <Pressable style={styles.link} onPress={handleCreateProduct}>
                            <Text style={{color: 'white', fontSize: 16}}>Create Product</Text>
                        </Pressable>
                    </View>
                    <p></p>
                    <Tuple navigation={navigation}/>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    link: {
        marginTop: 10,
        marginBottom: 5,
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
    },
    createprod: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: '90%',
        alignSelf: 'center',
    },
    picker:{
        width: '80%',
        height: 30,
        alignSelf: 'center',
        backgroundColor: '#717336',
        borderColor: '#5d5e24',
        borderWidth: 2,
    }
});