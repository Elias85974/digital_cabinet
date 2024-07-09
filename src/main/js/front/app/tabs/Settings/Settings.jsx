import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {UserAccount} from "./UserAccount";
import {settingStyles} from "./SettingStyles";
import {HouseEdit} from "./HouseEdit";
import {Support} from "./Support";
import LogoutButton from "../NavBar/LogoutButton";

export default function Settings({navigation}) {
  const handleGoBack = () => {
    navigation.goBack();
  }

  return (
      <View style={settingStyles.container}>
        <SafeAreaView style={StyleSheet.absoluteFill}>
          <ScrollView style={[settingStyles.contentContainer, {marginBottom: 95}]} showsVerticalScrollIndicator={false}>
            <View style={{justifyContent:'space-evenly', padding: 50}}>
              <Ionicons name="close" size={24} color="black" onPress={handleGoBack}/>
              <Text style={settingStyles.title}>Settings</Text>
            </View>
            <View style={{flexDirection: 'column', justifyContent: 'center'}}>
              <UserAccount navigation={navigation}/>
              <HouseEdit navigation={navigation}/>
              <Support navigation={navigation}/>
              <LogoutButton navigation={navigation}/>
            </View>
          </ScrollView>
        </SafeAreaView>
    </View>
  );
};

