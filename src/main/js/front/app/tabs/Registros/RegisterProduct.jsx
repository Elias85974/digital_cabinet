import React, {useState, useEffect} from 'react';
import {
    TextInput,
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from "react-native";

import {CategoriesApi, ProductsApi} from "../../Api";
import ModalAlert from "../Contents/ModalAlert";
import {useIsFocused} from "@react-navigation/native";
import NavBar from "../NavBar/NavBar";
import GoBackButton from "../NavBar/GoBackButton";
import CustomHover from "../Contents/CustomHover"

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

    const [selectedQuantityType, setSelectedQuantityType] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const handleQuantityTypePress = (type) => {
        setSelectedQuantityType(type);
        handleInputChange('tipoDeCantidad', type);
    };


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
        const fetchedCategories = await CategoriesApi.getCategories(navigation);
        setCategories(fetchedCategories);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    const handleInputChange = (field, value) => {
        setNewProduct({...newProduct, [field]: capitalizeFirstLetter(value)});
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
            const createdCategory = await CategoriesApi.createCategory({nombre: formattedCategoryName}, navigation);
            console.log('createdCategory:', createdCategory);
            setCategories([...categories, createdCategory]);
            setNewProduct({...newProduct, categoryId: createdCategory.categoria_ID});
            setQuery('');
            // Show modal with success message
            setModalMessage("Category Created Successfully!");
            setModalVisible(true);
            // Hide modal after 2.5 seconds
            setTimeout(() => {
                setModalVisible(false);
            }, 2500);
        }
        setSuggestions([]);
        setNewCategory('');
    };

    const handleKeyPress = (e) => {
        if (e.nativeEvent.key === "Enter") {
            handleCreateCategory(query);
            setQuery(''); // Establece la categoría recién creada como la categoría seleccionada
        }
    };

    const handleCreateProduct = async() => {
        try {
            if (newProduct.nombre && newProduct.marca && newProduct.tipoDeCantidad && newProduct.categoryId) {
                ProductsApi.createProduct(newProduct, navigation).then(r => {
                    setModalMessage("Product created successfully!"); // Muestra el modal en lugar de un alert
                    setModalVisible(true)
                });
                setTimeout(() => {
                    setModalVisible(false);
                    // Navega a la siguiente página después de un retraso
                    navigation.navigate('House');
                }, 2500);
            } else {
                setModalMessage("Please fill in all fields."); // Muestra el modal en lugar de un alert
                setModalVisible(true);
            }
        } catch (error) {
            console.log("Error creating product:", error);
        }
    }


    return (
        <View style={styles.container} key={key}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                    <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
                    <View>
                        <GoBackButton navigation={navigation}/>
                        <Text style={styles.title}>Register your Product</Text>
                        <View style={styles.createprod}>
                            <Text style={styles.info}>Please fill in all the fields to create your product:</Text>

                            <TextInput style={styles.input}
                                       placeholder="Name"
                                       value={newProduct.nombre}
                                       onChangeText={(value) => handleInputChange('nombre', value)}
                            />

                            <TextInput style={styles.input}
                                       placeholder="Brand"
                                       value={newProduct.marca}
                                       onChangeText={(value) => handleInputChange('marca', value)}
                            />

                            <View style={styles.quantityTypesContainer}>
                                {quantityTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.quantityTypeButton,
                                            selectedQuantityType === type && styles.selectedQuantityTypeButton
                                        ]}
                                        onPress={() => handleQuantityTypePress(type)}
                                    >
                                        <Text
                                            style={[
                                                styles.quantityTypeButtonText,
                                                selectedQuantityType === type && styles.selectedQuantityTypeButtonText
                                            ]}
                                        >
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View
                                onStartShouldSetResponder={() => true}
                                onResponderGrant={() => setIsHovered(true)}
                                onResponderRelease={() => setIsHovered(false)}
                            >
                                <TextInput
                                    style={styles.input}
                                    placeholder={'Select or create a category'}
                                    value={query}
                                    onChangeText={handleInputChangeCat}
                                    onKeyPress={handleKeyPress}
                                />
                                {isHovered &&
                                    <Text style={styles.quantityTypeButtonText}>
                                        Pressing enter creates the category or the button, then you will need to search for it again and select it.
                                    </Text>}
                                {suggestions.length === 0 && query.trim() !== '' && (
                                    <Pressable style={styles.link} onPress={() => handleCreateCategory(query)}>
                                        <Text style={{color: 'white', fontSize: 16}}>Add a new Category</Text>
                                    </Pressable>
                                )}
                            </View>
                            <FlatList
                                data={suggestions}
                                numColumns={4}
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
        marginBottom: 30,
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
    },
    quantityTypesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    quantityTypeButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#4B5940',
        borderRadius: 5,
    },
    selectedQuantityTypeButton: {
        backgroundColor: '#717336',
    },
    quantityTypeButtonText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
    selectedQuantityTypeButtonText: {
        color: 'white',
    },
});