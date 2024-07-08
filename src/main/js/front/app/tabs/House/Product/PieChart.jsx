import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getInventoryValueByCategory } from '../../../api/piechart';
import {View, Text, ScrollView, StyleSheet, SafeAreaView} from "react-native";
import NavBar from "../../NavBar/NavBar";

export const PieChartComponent = () => {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const houseId = await AsyncStorage.getItem('houseId');
                if (houseId) {
                    const response = await getInventoryValueByCategory(houseId);
                    console.log("Response received:", response);
                    if (response && typeof response === 'object' && !Array.isArray(response)) {
                        const dataArray = Object.entries(response).map(([category, value]) => ({
                            category,
                            value
                        }));
                        // Calculate total value
                        const totalValue = dataArray.reduce((acc, item) => acc + item.value, 0);
                        // Calculate percentages and update labels with percentages
                        const categoriesWithPercentages = dataArray.map(item => {
                            const percentage = ((item.value / totalValue) * 100).toFixed(2); // Keep two decimal places
                            return `${item.category} (${percentage}%)`;
                        });
                        const values = dataArray.map(item => item.value);
                        setChartData({
                            labels: categoriesWithPercentages,
                            datasets: [{
                                ...chartData.datasets[0],
                                data: values,
                            }],
                        });
                    } else {
                        console.error('Expected an object but received:', response);
                    }
                }
            } catch (error) {
                console.error('Error fetching inventory value by category:', error);
            }
        };

        fetchData();
    }, []);

    const chartOptions = {
        plugins: {
            legend: {
                position: 'left', // Position the legend on the left side of the chart
            },
        },
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={StyleSheet.absoluteFill}>
                <ScrollView style={[styles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Inventory Value by Category</Text>
                    <View style={{width: '35%', alignSelf: 'center'}}>
                        <Pie data={chartData} options={chartOptions}/>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <NavBar navigation={navigation}/>
        </View>
    );
};

export default PieChartComponent;

const styles = StyleSheet.create({
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