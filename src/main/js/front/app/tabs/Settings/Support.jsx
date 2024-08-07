import {FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Collapsible from "react-native-collapsible";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {UsersApi} from "../../Api";
import {settingStyles} from "./SettingStyles";
import {AntDesign} from "@expo/vector-icons";

export function Support({ navigation }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setIsCollapsed(!isCollapsed)}>

                <Text style={settingStyles.typesContainer}>
                    <AntDesign name="customerservice" size={24} color="white" />  Support
                </Text>
            </TouchableOpacity>
            <Collapsible collapsed={isCollapsed}>
                <View style={styles.signInCont}>
                    <Text style={styles.info}>How this app works</Text>
                    <Text style={{flexWrap: 'wrap' ,color: 'white', fontSize: 16, textAlign: 'justify' }} >  Lo primero que debes haces es crear tu propia casa con nombre y dirección.</Text>
                    <Text style={styles.info}></Text>
                    <Text style={{flexWrap: 'wrap' ,color: 'white', fontSize: 16, textAlign: 'justify' }} >  Luego podrás crear infinitos productos, que serán verificados con el tiempo dejándoles un tilde azul, para agregarlos a tu casa y alacena, solo deberás buscarlos en el add a product con el carrito de compra con el +.</Text>
                    <Text style={styles.info}></Text>
                    <Text style={{flexWrap: 'wrap' ,color: 'white', fontSize: 16, textAlign: 'justify'}} >  Si quieres ver los productos que tienes en tu casa, solo deberás ir a la pestaña que mas prefieras depende de como es que quieras verlos, ya sea por categoría, los que estén en bajo stock o todos juntos!</Text>
                    <Text style={styles.info}></Text>
                    <Text style={{flexWrap: 'wrap' ,color: 'white', fontSize: 16, textAlign: 'justify'}} >  También si quieres ver cuanto gastaste en el mes, solo deberás ir a la pestaña de gastos y ahí podrás ver cuanto gastaste en el mes y en que productos si pones elegir verlo por categoría.</Text>
                    <Text style={styles.info}></Text>
                    <Text style={{flexWrap: 'wrap' ,color: 'white', fontSize: 16, textAlign: 'justify'}} >  Por ultimo podes invitar a mas personas a tu casa para que puedan ver los productos que tenes y agregar los suyos, solo deberás ir a la pestaña de invitaciones y ahí podrás invitar a quien quieras!</Text>
                </View>
            </Collapsible>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#BFAC9B',
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
        borderWidth: 3, // Add border
        borderColor: '#717336', // Set border color
        padding: 10, // Add some padding so the text isn't right up against the border
        backgroundColor: '#717336', // Set background color
        width: 200, // Set width
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 100,
        fontSize: 16,
    },
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
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
    },
    info: {
        fontSize: 20,
        fontFamily: 'lucida grande',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
        color: '#F2EFE9',
        lineHeight: 30,
    },
    signInCont: {
        backgroundColor: '#4B5940',
        padding: 20,
        borderRadius: 20,
        width: 400,
        alignSelf: 'center',
    }
});