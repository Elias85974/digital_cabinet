import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {UserAccount} from "./UserAccount";
import {settingStyles} from "./SettingStyles";
import {HouseEdit} from "./HouseEdit";
import {Support} from "./Support";
import LogoutButton from "../NavBar/LogoutButton";
import WishlistButton from "../NavBar/WishlistButton";
import InboxButton from "../NavBar/InboxButton";
import GoBackButton from "../NavBar/GoBackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
                <WishlistButton navigation={navigation}/>
                <InboxButton navigation={navigation}/>
                <LogoutButton navigation={navigation}/>
            </View>
          </ScrollView>
        </SafeAreaView>
    </View>
    );
};

