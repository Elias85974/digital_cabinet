import {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import { inboxStyles } from './InboxStyles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getNearExpirationStocks} from "../../../controller/InboxController";
import {FlatList, Pressable, Text, View} from "react-native";

export function ExpirationNotification({ navigation }) {
    const [stocks, setStocks] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadStocks().then(r => console.log('Stocks loaded'), e => console.error('Error loading stocks', e));
        }
    }, [isFocused]);

    const loadStocks = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const nearExpirationStocks = await getNearExpirationStocks(userId);
        console.log(nearExpirationStocks);
        setStocks(nearExpirationStocks);
    }

    return (
        <View>
            <FlatList
                data={stocks}
                keyExtractor={item => item.houseId.toString()}
                renderItem={({ item }) => (
                    <View style={inboxStyles.card}>
                        <View style={inboxStyles.statusInd}></View>
                        <View style={inboxStyles.right}>
                            <View style={inboxStyles.textWrap}>
                                <Text style={inboxStyles.textContent}>
                                    Your {item.productName} is expiring in {item.daysLeft} days, check your {item.houseName}'s cabinet!
                                </Text>
                                <Pressable style={[inboxStyles.primaryCta, {backgroundColor: "green"}]}
                                           onPress={async () => {
                                               // Settear el houseId de AsyncStorage
                                               await AsyncStorage.setItem('houseId', item.houseId.toString());
                                               // Navegar a la casa con el houseId correcto
                                               navigation.navigate("House");
                                           }}>>
                                    <Text style={inboxStyles.buttonText}>{item.houseName}'s digital cabinet</Text>
                                </Pressable>
                                <Text style={inboxStyles.time}>1 minute</Text>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}