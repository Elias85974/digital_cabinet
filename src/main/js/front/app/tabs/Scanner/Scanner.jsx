import { Camera, CameraType } from 'expo-camera/legacy';
import { useState } from 'react';
import {getAllProducts} from '../../api/scanner';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoBackButton from "../NavBar/GoBackButton";

export default function App({navigation}) {
    const [type, setType] = useState(CameraType.back);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const handleBarCodeScanned = async ({ type, data }) => {
        console.log(`Scanned state before processing: ${scanned}`); // Debugging log
        if (scanned) return; // Check if already scanned, then return early

        console.log(`Scanned type: ${type}, data: ${data}`);
        setScanned(true); // Set scanned to true to prevent further scanning
        console.log('Scanned state set to true'); // Debugging log
        setScannedData(data); // Store the scanned data

        try {
            const houseId = await AsyncStorage.getItem('houseId'); // Retrieve the current house ID
            if (!houseId) {
                console.error('House ID not found');
                return;
            }

            const stockProducts = await getAllProducts(houseId);
            console.log(stockProducts); // Debugging log
            const productExists = stockProducts.some(product => product.productId === data); // Adjust the condition based on your data structure

            if (productExists) {
                navigation.navigate('AddStock', { productId: data }); // Pass the scanned product ID to AddStock
            } else {
                navigation.navigate('RegisterProduct', { productId: data }); // Optionally pass the scanned product ID to RegisterProduct
            }
        } catch (error) {
            console.error('Error scanning barcode or fetching products:', error);
        }
        // Note: The automatic reset of the `scanned` state to false is intentionally removed
    };

    return (
        <View style={styles.container}>

            <Camera
                onBarCodeScanned={(event) => {
                    console.log('Barcode scanned:', event);
                    handleBarCodeScanned(event);
                }}
                barCodeScannerSettings={{
                    barCodeTypes:
                        [  'ean13', 'ean8', 'upc_a', 'upc_e', 'code_39', 'code_93',
                            'code_128', 'pdf417', 'aztec', 'interleaved_2_of_5', 'itf14', 'qr','data_matrix'
                        ]
                }}
                style={[StyleSheet.absoluteFillObject, { transform: [{ scaleX: -1 }] }]}
            >

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            console.log('Resetting scanned state to false'); // Debugging log
                            setScanned(false);
                        }}
                    >
                        <Text style={styles.text}>Scan Again</Text>
                    </TouchableOpacity>
                </View>
                <GoBackButton navigation={navigation} />
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});