import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {Camera, CameraView} from 'expo-camera';
import GoBackButton from "../NavBar/GoBackButton";
import { StyleSheet } from 'react-native';

export default function ScannerScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    //const [torchOn, setTorchOn] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            console.log('Permission status:', status);
            setHasPermission(status === 'granted');
            setLoading(false);
        })();
    }, []);


    const handleBarCodeScanned = ({ type, data }) => {
        console.log('Barcode scanning callback called!');
        setScanned(true);
        setScannedData(data);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    if (loading) {
        return <Text>Loading...</Text>;
    }


    // Define allowed barcode types
    const allowedBarcodeTypes = [
        'qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code_39', 'code_93',
        'code_128', 'pdf417', 'aztec', 'interleaved_2_of_5', 'itf14', 'data_matrix'
    ];

// Your barcodeTypes array
    const barcodeTypes = [
        'qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code_39', 'code_93',
        'code_128', 'pdf417', 'aztec', 'interleaved_2_of_5', 'itf14', 'data_matrix'
    ];

    return (
        <View style={{ flex: 1 }}>
            <Camera
                onBarCodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: barcodeTypes
                }}
            >
            </Camera>
            <View
                style={{
                    backgroundColor: 'transparent',
                    justifyContent: 'flex-end',
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 5,
                        padding: 10,
                        paddingHorizontal: 20,
                    }}
                >
                    <Text style={{ fontSize: 20 }}>Toggle Torch</Text>
                </TouchableOpacity>

                <GoBackButton navigation={navigation} />
            </View>
            {scanned && (
                <Text style={{ position: 'absolute', top: 20, left: 20, color: 'white' }}>
                    Scanned Data: {scannedData}
                </Text>
            )}
        </View>
    );
}