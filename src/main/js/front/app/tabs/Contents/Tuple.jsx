import {View} from "react-native";
import React from "react";
import LogoutButton from "./LogoutButton";
import GoBackButton from "./GoBackButton";

const Tuple = ({navigation}) => {

    return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap',justifyContent: 'space-around'}}>
            <GoBackButton navigation={navigation}/>
            <LogoutButton navigation={navigation} />

        </View>
    );
}

export default Tuple;