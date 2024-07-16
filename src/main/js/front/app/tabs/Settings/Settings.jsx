import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {UserAccount} from "./UserAccount";
import {settingStyles} from "./SettingStyles";
import {HouseEdit} from "./HouseEdit";
import {Support} from "./Support";
import LogoutButton from "../NavBar/LogoutButton";
import WishlistButton from "../NavBar/WishlistButton";
import InboxButton from "../NavBar/InboxButton";
import GoBackButton from "../NavBar/GoBackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {KnowAboutUs} from "./KnowAboutUs";

export default function Settings({navigation}) {
    const [houseId, setHouseId] = useState(null);

    useEffect(() => {
        const loadHouseId = async () => {
            const storedHouseId = await AsyncStorage.getItem('houseId');
            setHouseId(storedHouseId);
        };
        loadHouseId();
    }, []);

    return (
      <View style={settingStyles.container}>
        <SafeAreaView style={StyleSheet.absoluteFill}>
          <ScrollView style={[settingStyles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
              <GoBackButton navigation={navigation}/>
              <Text style={settingStyles.title}>Settings</Text>
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                <UserAccount navigation={navigation}/>

                {houseId && <HouseEdit navigation={navigation} houseId={houseId}/>}

                <Support navigation={navigation}/>
                <KnowAboutUs navigation={navigation}/>

                <TouchableOpacity onPress={() => navigation.navigate("Inbox")}   style={styles.logoutButton}>
                    <Ionicons
                        name={"mail-outline"}
                        size={24}
                        color="white"
                    />
                    <Text style={styles.logoutText}>  Inbox</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("WishList")}  style={styles.logoutButton}>
                    <MaterialCommunityIcons name="playlist-star" size={24} color="white" />
                    <Text style={styles.logoutText}>  WishList</Text>
                </TouchableOpacity>

                <LogoutButton navigation={navigation}/>
            </View>
          </ScrollView>
        </SafeAreaView>
    </View>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3, // Add border
        borderColor: '#717336', // Set border color
        padding: 10, // Add some padding so the text isn't right up against the border
        backgroundColor: '#717336', // Set background color
        alignSelf: 'center',
        alignContent: 'center',
        borderRadius: 100,
        flexDirection: 'row',
    },
    logoutText: {
        color: '#F2EFE9',
        fontSize: 16,
    },
});


