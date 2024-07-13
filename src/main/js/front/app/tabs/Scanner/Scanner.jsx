import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import GoBackButton from "../NavBar/GoBackButton";

export default function ScannerScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [torchOn, setTorchOn] = useState(false);
    const [scannedData, setScannedData] = useState(''); // Step 1: State to hold scanned data

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        console.log(`Scanned type: ${type}, data: ${data}`); // Debugging output
        setScanned(true);
        setScannedData(data);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        // Reset scanning after a delay to allow continuous scanning
        setTimeout(() => setScanned(false), 5); // Adjust delay as needed
    };

    const handleNotScanning = () => {
        setScanned(false);
        alert(`Bar code was not able to be scanned!`);
    }

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <Camera
                style={{ flex: 1 }}
                type={Camera.Constants.Type.back}
                flashMode={torchOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
                onBarCodeScanned={scanned ? handleNotScanning : handleBarCodeScanned}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        justifyContent: 'flex-end',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flex: 0.1,
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
                    <GoBackButton navigation={navigation}/>
                </View>
            </Camera>
            {scanned && <Text style={{ position: 'absolute', top: 20, left: 20, color: 'white' }}>Scanned Data: {scannedData}</Text>}
        </View>
    );
}