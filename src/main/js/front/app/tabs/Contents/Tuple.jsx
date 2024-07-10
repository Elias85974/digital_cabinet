import {View} from "react-native";
import React from "react";
import LogoutButton from "../NavBar/LogoutButton";
import GoBackButton from "../NavBar/GoBackButton";
import {FetchApi} from "../../Api";

const Tuple = ({navigation}) => {
    return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap',justifyContent: 'space-around'}}>
            <GoBackButton navigation={navigation}/>
            <LogoutButton navigation={navigation} />

        </View>
    );
}

export default Tuple;