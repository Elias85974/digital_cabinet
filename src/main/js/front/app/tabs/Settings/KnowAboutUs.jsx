import {FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Collapsible from "react-native-collapsible";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import {UsersApi} from "../../Api";
import {settingStyles} from "./SettingStyles";
import {AntDesign, MaterialIcons} from "@expo/vector-icons";

export function KnowAboutUs({ navigation }) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => setIsCollapsed(!isCollapsed)}>

                <Text style={settingStyles.typesContainer}>
                    <MaterialIcons name="personal-video" size={24} color="white" />  Know about us
                </Text>
            </TouchableOpacity>
            <Collapsible collapsed={isCollapsed}>
                <View style={styles.signInCont}>
                    <Text style={styles.info}>Know about us!</Text>
                    <Text style={styles.info}></Text>
                    <Text style={styles.info}>¿Quiénes Somos?</Text>
                    <Text style={{flexWrap: 'wrap' ,color: 'white', fontSize: 16, textAlign: 'justify' }} >  Somos más que una simple aplicación; somos tu aliado perfecto para mantener un registro detallado de los productos en la alacena de tu hogar. Con nuestra app, llevar el control de la cantidad y tipos de productos almacenados es fácil y accesible, permitiéndote gestionar no solo una, sino varias alacenas a la vez, gracias a nuestra funcionalidad Multicasa.
                    </Text>

                    <Text style={styles.info}></Text>
                    <Text style={styles.info}>Nuestra Propuesta de Valor</Text>
                    <Text style={{flexWrap: 'wrap' ,color: 'white', fontSize: 16, textAlign: 'justify' }} >  A diferencia de otras aplicaciones, ofrecemos una experiencia comunitaria alrededor de la gestión de alacenas. No solo puedes administrar el stock por casa, sino también disfrutar de funcionalidades diseñadas para mejorar la comunicación y la planificación financiera de tu hogar.
                    </Text>

                    <Text style={styles.info}></Text>
                    <Text style={styles.info}>Demostración Práctica</Text>
                    <Text style={{flexWrap: 'wrap' ,color: 'white', fontSize: 16, textAlign: 'justify' }} >  Imagina que, después de un evento importante, decides verificar si tienes suficiente stock para un asado. Con nuestra app, puedes revisar rápidamente la categoría de Carnes, identificar qué productos están en bajo stock, y agregar lo necesario a tu wishlist. Después del asado, mientras actualizas tu alacena y revisas los próximos vencimientos, puedes incluso planificar tu próxima receta basada en los productos que necesitas utilizar pronto.
                    </Text>

                    <Text style={styles.info}></Text>
                    <Text style={styles.info}>Únete a Nuestra Comunidad</Text>
                    <Text style={{flexWrap: 'wrap' ,color: 'white', fontSize: 16, textAlign: 'justify' }} >  Descubre la facilidad de administrar tus alacenas con nuestra app. Ya sea que estés gestionando los productos de tu hogar o coordinando la compra de la semana con tu familia, nuestra aplicación está aquí para simplificar tu vida. ¡Bienvenido a la comunidad!
                    </Text>

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