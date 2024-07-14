import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import GoBackButton from "../NavBar/GoBackButton";
import { StyleSheet } from 'react-native';

export default function ScannerScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [torchOn, setTorchOn] = useState(false);
    const [scannedData, setScannedData] = useState(''); // Step 1: State to hold scanned data
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
        try {
            console.log(`Scanned type: ${type}, data: ${data}`);
            setScanned(true);
            setScannedData(data);
            alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        } catch (error) {
            console.error('Error scanning barcode:', error);
        } finally {
            setScanned(false); // Reset scanning state
        }
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

    return (
        <View style={{ flex: 1 }}>
            <Camera
                quality={0}
                onBarCodeScanned={(event) => {
                    console.log('Barcode scanned:', event);
                    handleBarCodeScanned(event);
                }}
                onMountError={(error) => console.error('Camera mount error:', error)}
                barcodeScannerSettings={{ barcodeTypes: ['all'] }}
                style={StyleSheet.absoluteFillObject}
                flashMode={torchOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
                errorCallback={(error) => console.error('Camera error:', error)}
            >
                {console.log('Camera rendering...')}
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
                    onPress={() => {
                        setTorchOn(!torchOn);
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