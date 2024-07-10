import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const CustomHover = ({placeholder, hover, value, handleInputChange, handleKeyPress}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <View
            onStartShouldSetResponder={() => true}
            onResponderGrant={() => setIsHovered(true)}
            onResponderRelease={() => setIsHovered(false)}
        >
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={handleInputChange}
                onKeyPress={handleKeyPress}
            />
            {isHovered && <Text>{hover}</Text>}
        </View>
    );
};
const styles = StyleSheet.create({
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
});
export default CustomHover;