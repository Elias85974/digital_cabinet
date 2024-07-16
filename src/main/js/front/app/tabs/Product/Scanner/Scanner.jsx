import { Camera, CameraType } from 'expo-camera/legacy';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoBackButton from "../../NavBar/GoBackButton";
import {ScannerApi} from "../../../Api";
import ProductInfoModalScanner from "../../Contents/Scanner/ProductInfoModalScanner";
import ModalAlert from "../../Contents/ModalAlert";

export default function Scanner({navigation}) {
    let scanned = false;
    const [type, setType] = useState(CameraType.back);
    const [scannedData, setScannedData] = useState(null);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    const [modalProductInfo, setModalProductInfo] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal
    const [modalVisible, setModalVisible] = useState(false); // Nuevo estado para la visibilidad del modal

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

        console.log(`Scanned type: ${type}, data: ${data}`);
        console.log('Scanned state set to true'); // Debugging log
        setScannedData(data); // Store the scanned data

        try {
            const houseId = await AsyncStorage.getItem('houseId'); // Retrieve the current house ID
            if (!houseId) {
                console.error('House ID not found');
                return;
            }

            const product = await ScannerApi.getProductByBarcode(houseId, data);
            setSelectedProduct(product);
            console.log(product);
            if (product.wasFound) {
                if (product.lowStock > 0) {
                    // show info with the data of the product
                    setModalProductInfo(true);
                    scanned = false; // Reset the scanned state to false

                } else{
                    await AsyncStorage.setItem('productNameScanner', product.name);
                    await AsyncStorage.setItem('productIdScanner', product.id);
                    setModalMessage("This product already exists but you don't have a stock of it, please add it to your house"); // Muestra el modal en lugar de un alert
                    setModalVisible(true);
                    scanned = false; // Reset the scanned state to false

                    navigation.navigate('AddStock'); // Pass the scanned product ID to AddStock
                }
            } else {
                await AsyncStorage.setItem("barCode", data); // Store the barcode in AsyncStorage
                setModalMessage("There is no product with this codeBar, please register it"); // Muestra el modal en lugar de un alert
                setModalVisible(true);
                navigation.navigate('RegisterProduct'); // Optionally pass the scanned product ID to RegisterProduct
            }

        } catch (error) {
            console.error('Error scanning barcode or fetching products:', error);
        }
        // Note: The automatic reset of the `scanned` state to false is intentionally removed
    };


    return (
        <View style={styles.container}>
            <Camera
                onBarCodeScanned={async(event) => {
                    if (scanned) return; // Check if already scanned, then return early
                    scanned = true; // Set scanned state to true
                    console.log('Barcode scanned:', event);
                    await handleBarCodeScanned(event);
                }}
                barCodeScannerSettings={{
                    barCodeTypes:
                        [  'ean13', 'ean8', 'upc_a', 'upc_e', 'code_39', 'code_93',
                            'code_128', 'pdf417', 'aztec', 'interleaved_2_of_5', 'itf14', 'qr','data_matrix'
                        ]
                }}
                style={[StyleSheet.absoluteFillObject]}
            >

                <View style={styles.buttonContainer}>
                    <GoBackButton navigation={navigation} />

                    <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            console.log('Resetting scanned state to false'); // Debugging log
                            scanned = false; // Reset the scanned state to false
                        }}
                    >
                        <Text style={styles.text}>Scan Again</Text>
                    </TouchableOpacity>
                </View>
                <ProductInfoModalScanner
                    setModalProductInfo={setModalProductInfo}
                    modalProductInfo={modalProductInfo}
                    selectedProduct={selectedProduct}
                    navigation={navigation}
                />

                <ModalAlert message={modalMessage} isVisible={modalVisible} onClose={() => setModalVisible(false)} />

            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: '#BFAC9B',

        flexDirection: 'row',
        margin: 10,
        position: 'absolute', // Posiciona el contenedor de botones de forma absoluta
        top: 0, // Asegura que esté en la parte superior de la pantalla
        width: '100%',
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