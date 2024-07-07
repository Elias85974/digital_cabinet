import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GoBackButton from "./GoBackButton";
import LogoutButton from "./LogoutButton";
import ChatButton from "./ChatButton";
import InboxButton from "./InboxButton";
import SettingsButton from "./SettingsButton";
import WishlistButton from "./WishlistButton";

const NavBar = ({ navigation }) => {
  return (
    <View style={styles.bottom}>
        <View style={styles.navBar}>
            <LogoutButton navigation={navigation}/>

            <ChatButton navigation={navigation} />

            <WishlistButton navigation={navigation}/>

            <GoBackButton navigation={navigation}/>

            <InboxButton navigation={navigation}/>

            <SettingsButton navigation={navigation}/>
        </View>
    </View>
);
};

const styles = StyleSheet.create({
    navBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#a08f80',
    },
    bottom: {

        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        marginTop: 100,

    },
});

export default NavBar;