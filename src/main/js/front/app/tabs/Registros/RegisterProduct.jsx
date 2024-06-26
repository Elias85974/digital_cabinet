import React, {useState, useEffect} from 'react';
import {TextInput, View, Text, Pressable, ScrollView, StyleSheet, TouchableOpacity, FlatList} from "react-native";
import Picker from 'react-native-picker-select';


import {createProduct, getCategories, createCategory} from "../../Api";
import Tuple from "../Contents/Tuple";
import ModalAlert from "../Contents/ModalAlert";
import {useIsFocused} from "@react-navigation/native";

export default function RegisterProduct({navigation}) {
    let [newProduct, setNewProduct] = useState({nombre: '', marca: '', tipoDeCantidad: ''});
    let [categories, setCategories] = useState([]);
    let [newCategory, setNewCategory] = useState('');
    let [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const quantityTypes = ['Gramos', 'Litros', 'Unidades', 'Kilogramos'];
    const [key, setKey] = useState(0);

    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal
    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChangeCat = (text) => {
        setQuery(text);

        if (text === '') {
            setSuggestions([]);
        } else {
            const regex = new RegExp(`${text.trim()}`, 'i');
            setSuggestions(categories.filter(category => category.nombre.search(regex) >= 0));
        }
    };

    const handleSuggestionPress = (suggestion) => {
        if (suggestion.categoria_ID === 'addNew') {
            handleCreateCategory(query);
        } else {
            setQuery(suggestion.nombre);
            setSuggestions([]);
            setNewProduct({...newProduct, categoryId: suggestion.categoria_ID});
        }
    };

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused){
            fetchCategories();
        } else{
            setQuery('');
            setSuggestions(categories);
        }
    }, [isFocused]);


    const fetchCategories = async () => {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
    };


    const handleInputChange = (field, value) => {
        console.log(`handleInputChange called with field: ${field} and value: ${value}`);
        setNewProduct({...newProduct, [field]: value});
    };

    const handleCategoryChange = async () => {
        const createdCategory = await createCategory({nombre: newCategory});
        setCategories([...categories, createdCategory]);
        setNewProduct({...newProduct, categoryId: createdCategory.id});
        setShowNewCategoryInput(false);
        setNewCategory('');

        /*console.log(`handleCategoryChange called with selectedCategory: ${selectedCategory}`);
        if (selectedCategory === 'addNew') {
            setShowNewCategoryInput(true);
        } else {
            setShowNewCategoryInput(false);
            setNewProduct({...newProduct, categoryId: selectedCategory});
        }*/
    };

    const handleNewCategoryChange = (value) => {
        setNewCategory(value);
    };

    const handleCreateCategory = async (categoryName) => {
        // Convierte la primera letra a mayúsculas
        const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

        // Verifica si la categoría ya existe
        const existingCategory = categories.find(category => category.nombre === formattedCategoryName);
        if (existingCategory) {
            // Si la categoría ya existe, no la crees de nuevo, simplemente establece el estado `query` con el nombre de la categoría existente
            setQuery(existingCategory.nombre, () => {
                setNewProduct({...newProduct, categoryId: existingCategory.id});
                setKey(prevKey => prevKey + 1); // Incrementa la clave para forzar un renderizado
            });
        } else {
            // Si la categoría no existe, créala
            const createdCategory = await createCategory({nombre: formattedCategoryName});
            setCategories([...categories, createdCategory]);
            setNewProduct({...newProduct, categoryId: createdCategory.id});
            setQuery(createdCategory.nombre);
        }
        setSuggestions([]);
    };

    const handleKeyPress = (e) => {
        if (e.nativeEvent.key === "Enter") {
            handleCreateCategory(query);
            setQuery(""); // Establece la categoría recién creada como la categoría seleccionada
        }
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
        <View style={styles.container} key = {key}>
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
                        <TextInput
                            style={styles.input}
                            value={query}
                            onChangeText={handleInputChangeCat}
                            onKeyPress={handleKeyPress}
                            placeholder="Select a category"
                        />
                        <FlatList
                            data={suggestions}
                            numColumns={6}
                            keyExtractor={(item) => item.categoria_ID.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
                                    <Text style={styles.cat}>{item.nombre}</Text>
                                </TouchableOpacity>
                            )}
                        />
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
    cat: {
        fontSize: 16,
        fontFamily: 'lucida grande',
        color: 'white',
        margin: 5,
        flex: 1, // Asegura que el elemento ocupe todo el espacio disponible
        justifyContent: 'center', // Centra el texto verticalmente
        alignItems: 'center', // Centra el texto horizontalmente
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