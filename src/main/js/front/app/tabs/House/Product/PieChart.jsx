import React, {useEffect, useState} from 'react';
import {Pie} from 'react-chartjs-2';
import {ArcElement, Chart, Legend, Tooltip} from 'chart.js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getInventoryValueByCategory, getProductsFromHouseAndCategory} from '../../../api/piechart';
import {Picker, SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import NavBar from "../../NavBar/NavBar";

Chart.register(ArcElement, Tooltip, Legend);

export default function PieChartComponent({navigation}){
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Total Value ',
            data: [],
            backgroundColor: [
                // Define your colors for each category
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(199, 199, 199, 0.2)',
                'rgba(83, 102, 255, 0.2)',
            ],
            borderColor: [
                // Define border colors for each category
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)',
                'rgba(83, 102, 255, 1)',
            ],
            borderWidth: 1,
        }],

    });

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const houseId = await AsyncStorage.getItem('houseId');
                if (houseId) {
                    const inventoryValueResponse = await getInventoryValueByCategory(houseId);
                    const fetchedCategories = Object.keys(inventoryValueResponse);
                    console.log('Fetched categories:', fetchedCategories);
                    setCategories(fetchedCategories);
                    if (fetchedCategories.length > 0) {
                        setSelectedCategory(fetchedCategories[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const houseId = await AsyncStorage.getItem('houseId');
                if (houseId && selectedCategory) {
                    const response = await getProductsFromHouseAndCategory(houseId, selectedCategory);
                    console.log("Response received:", response);
                    if (response && Array.isArray(response)) {
                        const dataArray = response.map((item) => {
                            console.log('Item:', item);
                            const categoryName = selectedCategory; // Use the selectedCategory state
                            const productName = item.product.nombre;
                            return {
                                product: productName,
                                value: item.price,
                            };
                        });
                        console.log('Data array:', dataArray);
                        // Calculate total value
                        const totalValue = dataArray.reduce((acc, item) => acc + item.value, 0);
                        // Calculate percentages and update labels with percentages
                        const categoriesWithPercentages = dataArray.map((item) => {
                            const percentage = ((item.value / totalValue) * 100).toFixed(2);
                            return `${item.product} (${percentage}%)`;
                        });
                        const values = dataArray.map((item) => item.value);
                        const newChartData = {
                            labels: categoriesWithPercentages,
                            datasets: [{
                                label: 'Total Value',
                                data: values,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(199, 199, 199, 0.2)',
                                    'rgba(83, 102, 255, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(199, 199, 199, 1)',
                                    'rgba(83, 102, 255, 1)',
                                ],
                                borderWidth: 1,
                            }],
                        };
                        setChartData(newChartData);
                        // After calculating newChartData, calculate total expense
                        const totalExpense = values.reduce((acc, currentValue) => acc + currentValue, 0);
                        setTotal(totalExpense); // Update total state

                    } else {
                        console.error('Expected an array but received:', response);
                    }
                }
            } catch (error) {
                console.error('Error fetching inventory value by category:', error);
            }
        };

        fetchData();
    }, [selectedCategory]);

    const handleInputChange = (name, value) => {
        console.log('Selected category:', value);
        setSelectedCategory(value);
        if (value === 'totalValues') {
            fetchTotalData(); // This function should fetch and aggregate data across all categories
        } else {
            fetchData(); // This function should fetch data for the selected category
        }
    };

    const fetchTotalData = async () => {
        try {
            const houseId = await AsyncStorage.getItem('houseId');
            if (houseId) {
                const response = await getInventoryValueByCategory(houseId);
                if (response && typeof response === 'object' && !Array.isArray(response)) {
                    const totalData = Object.entries(response).map(([category, value]) => ({
                        category,
                        value
                    }));
                    const totalValue = totalData.reduce((acc, item) => acc + item.value, 0);
                    const categoriesWithPercentages = totalData.map(item => {
                        const percentage = ((item.value / totalValue) * 100).toFixed(2);
                        return `${item.category} (${percentage}%)`;
                    });
                    const values = totalData.map(item => item.value);
                    const totalChartData = {
                        labels: categoriesWithPercentages,
                        datasets: [{
                            label: 'Total Value',
                            data: values,
                            backgroundColor: chartData.datasets[0].backgroundColor,
                            borderColor: chartData.datasets[0].borderColor,
                            borderWidth: 1,
                        }],
                    };
                    setChartData(totalChartData);
                    // After calculating totalChartData, calculate total expense
                    const totalExpense = values.reduce((acc, currentValue) => acc + currentValue, 0);
                    setTotal(totalExpense); // Update total state

                } else {
                    console.error('Invalid response:', response);
                }
            } else {
                console.error('No house ID found');
            }
        } catch (error) {
            console.error('Error fetching inventory value by category:', error);
        }
    };



    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Inventory Value by Category</Text>
                    <View style={styles.picker}>
                        <Text style={styles.label}>Select Category:</Text>
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue) => handleInputChange('category', itemValue)}
                        >
                            {categories.map((category, index) => (
                                <Picker.Item key={index} label={category} value={category} />
                            ))}
                            <Picker.Item label="Total Values" value="totalValues" />
                        </Picker>
                </View>
                    <View style={{width: '35%', alignSelf: 'center'}}>
                        <Pie data={chartData} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.label}>Total expense: ${total.toFixed(2)}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation} />
        </View>
    );

}

const styles = StyleSheet.create({
    pickerContainer: {
        marginVertical: 20,
        marginHorizontal: "auto",
    },
    picker:{
        width: '50%',
        alignSelf: 'center',
        height: 60,
        backgroundColor: '#717336',
        borderColor: '#5d5e24',
        borderWidth: 2,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
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
    signInCont: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    },
});