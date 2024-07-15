import React, { useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

export default function ModalAlert({ message, isVisible, onClose }) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{message}</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={onClose}
                    >
                        <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 10,
            height: 20
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#4B5940",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});