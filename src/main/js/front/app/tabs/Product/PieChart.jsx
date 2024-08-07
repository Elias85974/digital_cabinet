import React, {useEffect, useState} from 'react';
import {Pie} from 'react-chartjs-2';
import {ArcElement, Chart, Legend, Tooltip} from 'chart.js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getInventoryValueByCategory} from '../../api/piechart';
import {getProductsFromHouseAndCategory} from '../../api/inventory';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import NavBar from "../NavBar/NavBar";
import {useIsFocused} from "@react-navigation/native";
import GoBackButton from "../NavBar/GoBackButton";

Chart.register(ArcElement, Tooltip, Legend);

export default function PieChart({navigation}){
    const chartColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(199, 199, 199, 0.2)',
        'rgba(83, 102, 255, 0.2)',
        'rgba(255, 69, 0, 0.2)',
        'rgba(60, 179, 113, 0.2)',
        'rgba(123, 104, 238, 0.2)',
        'rgba(244, 164, 96, 0.2)'
    ];

    const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(11, 125, 128, 1)',
        'rgba(83, 102, 255, 1)',
        'rgba(255, 69, 0, 1)',
        'rgba(60, 179, 113, 1)',
        'rgba(123, 104, 238, 1)',
        'rgba(244, 164, 96, 1)'
    ];

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Total Values',
            data: [],
            backgroundColor: chartColors,
            borderColor: borderColors,
            borderWidth: 1,
        }],

    });

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [total, setTotal] = useState(0);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            getTotalData();
            fetchCategories();
        }
    }, [isFocused]);

    const handleInputChange = (name, value) => {
        console.log('Selected category:', value);
        setSelectedCategory(value);
        if (value === 'Total Values') {
            getTotalData(); // This function should fetch and aggregate data across all categories
        } else {
            getDataFromCategory(value); // This function should fetch data for the selected category
        }
    };

    const getDataFromCategory = async (selectedCategory) => {
        const houseId = await AsyncStorage.getItem('houseId');
        if (houseId && selectedCategory) {
            try {
                const response = await getProductsFromHouseAndCategory(houseId, selectedCategory);
                if (response && Array.isArray(response)) {
                    const dataArray = response.map(item => ({
                        product: item.product.nombre,
                        value: item.price,
                    }));
                    const labels = dataArray.map(item => item.product);
                    const values = dataArray.map(item => item.value);
                    const chartData = {
                        labels,
                        datasets: [{
                            label: 'Value by Category',
                            data: values,
                            backgroundColor: chartColors,
                            borderColor: borderColors,
                            borderWidth: 1,
                        }],
                    };
                    setChartData(chartData);
                    setTotal(values.reduce((acc, currentValue) => acc + currentValue, 0));
                } else {
                    console.error('Expected an array but received:', response);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const fetchCategories = async () => {
        try {
            const houseId = await AsyncStorage.getItem('houseId');
            if (houseId) {
                const inventoryValueResponse = await getInventoryValueByCategory(houseId, navigation);
                let fetchedCategories = Object.keys(inventoryValueResponse);
                fetchedCategories.unshift('Total Values'); // Agrega 'Total Values' al inicio del array
                setCategories(fetchedCategories);
                setSelectedCategory(fetchedCategories[0]); // Esto seleccionará 'Total Values' por defecto
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const getTotalData = async () => {
        const houseId = await AsyncStorage.getItem('houseId');
        if (!houseId) return;
        try {
            const response = await getInventoryValueByCategory(houseId, navigation);
            if (response && typeof response === 'object') {
                const totalData = Object.entries(response).map(([category, value]) => ({ category, value }));
                const labels = totalData.map(item => item.category);
                const values = totalData.map(item => item.value);
                const chartData = {
                    labels,
                    datasets: [{
                        label: 'Total Value',
                        data: values,
                        backgroundColor: chartColors,
                        borderColor: borderColors,
                        borderWidth: 1,
                    }],
                };
                setChartData(chartData);
                setTotal(values.reduce((acc, currentValue) => acc + currentValue, 0));
            } else {
                console.error('Invalid response:', response);
            }
        } catch (error) {
            console.error('Error fetching total data:', error);
        }
    };


    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                    <GoBackButton navigation={navigation}/>
                    <Text style={styles.title}>Inventory Value {selectedCategory === 'Total Values' ? '' : `for ${selectedCategory}`}</Text>
                    <View style={styles.input}>
                        <FlatList
                            data={categories}
                            numColumns={4}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleInputChange('category', item)}>
                                    <Text style={styles.cat}> {item} </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={styles.signInCont}>
                        <Text style={styles.info}>Total expense: ${total.toFixed(2)}</Text>
                    </View>
                    <View style={{width: '75%',alignSelf: 'center', marginTop:5}}>
                        <Pie data={chartData} />
                    </View>
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation} />
        </View>
    );

}

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    cat: {
        fontSize: 16,
        fontFamily: 'lucida grande',
        color: 'white',
        margin: 5,
        flex: 1, // Asegura que el elemento ocupe to do el espacio disponible
        justifyContent: 'center', // Centra el texto verticalmente
        alignItems: 'center', // Centra el texto horizontalmente
    },
    chartContainer: {
        marginVertical: 20,
    },
    container: {
        height: '100%',
        width: '100%',
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
        flex: 1,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: 'white',
        backgroundColor: '#3b0317',
        borderRadius: 30,
        borderStyle: undefined,
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
    signInCont: {
        backgroundColor: '#4B5940',
        padding: 10,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    },
});