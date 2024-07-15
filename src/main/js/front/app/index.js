import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Image, Text, Pressable } from "react-native";

export default function Index({navigation}) {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [animatedValue]);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#BFAC9B', 'rgb(171,133,93)'],
    });

    return (
        <Animated.View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.title}>Digital Cabinet</Text>
            <Image
                style={styles.image}
                source={require('../assets/favicon.png')}
                resizeMode="contain"
            />
            <View style={styles.linksContainer}>
                <Pressable style={styles.link} onPress={() => navigation.navigate("LoginPage")}>
                    <Text style={styles.linkText}>Log In</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
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
        borderWidth: 3,
        borderColor: '#717336',
        padding: 10,
        backgroundColor: '#717336',
        width: 200,
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 100,
        fontSize: 16,
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
    linksContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    linkText: {
        color: '#F2EFE9',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    // Add other styles as needed
});