import { BarCodeScanner } from 'expo-barcode-scanner';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';

const ScanScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [barcode, setBarcode] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setBarcode(data);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission...</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View>
            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={{ height: 400, width: 400 }}
            />
            {scanned && (
                <TouchableOpacity onPress={() => setScanned(false)}>
                    <Text>Scan again</Text>
                </TouchableOpacity>
            )}
            {barcode && (
                <Text>
                    Barcode: {barcode}
                </Text>
            )}
        </View>
    );
};

export default ScanScreen;