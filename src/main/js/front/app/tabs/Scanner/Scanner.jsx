import { Camera, CameraType } from 'expo-camera/legacy';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App({navigation}) {
    const [type, setType] = useState(CameraType.back);
    const [setScanned, setScannedData] = useState(false);
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

    const handleBarCodeScanned = ({ type, data }) => {
        navigation.navigate('Index')
        console.log(`Scanned type: ${type}, data: ${data}`);
        setScannedData(data);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
                </View>
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
