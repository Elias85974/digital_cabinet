import {useEffect, useState} from "react";
import {useIsFocused} from "@react-navigation/native";
import { inboxStyles } from './InboxStyles';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FlatList, Pressable, Text, TouchableOpacity, View} from "react-native";
import {InboxApi} from "../../../Api";
import Collapsible from "react-native-collapsible";

export function ExpirationNotification({ navigation, setExpirationsLength }) {
    const [stocks, setStocks] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadStocks().then(r => console.log('Stocks loaded'), e => console.error('Error loading stocks', e));
        }
    }, [isFocused]);

    const loadStocks = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const nearExpirationStocks = await InboxApi.getNearExpirationStocks(userId);
        console.log(nearExpirationStocks);
        setStocks(nearExpirationStocks);
        setExpirationsLength(nearExpirationStocks.length);
    }

    if (stocks.length > 0) {
        return (
            <View>
                <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                    <Text style={inboxStyles.typesContainer}>Expiration Notifications</Text>
                </TouchableOpacity>
                <Collapsible collapsed={isCollapsed}>
                    <FlatList
                        data={stocks}
                        keyExtractor={item => item.houseId.toString()}
                        renderItem={({item}) => (
                            <View style={inboxStyles.card}>
                                <View style={inboxStyles.statusInd}></View>
                                <View style={inboxStyles.right}>
                                    <View style={inboxStyles.textWrap}>
                                        <Text style={inboxStyles.textContent}>
                                            Your {item.productName} is expiring in {item.daysLeft} days, check
                                            your {item.houseName}'s cabinet!
                                        </Text>
                                        <TouchableOpacity style={[inboxStyles.primaryCta, {backgroundColor: "green"}]}
                                                          onPress={async () => {
                                                              await AsyncStorage.setItem('houseId', item.houseId.toString());
                                                              navigation.navigate("House");
                                                          }}>
                                            <Text style={inboxStyles.buttonText}>{item.houseName}'s digital
                                                cabinet</Text>
                                        </TouchableOpacity>
                                        <Text style={inboxStyles.time}>1 minute</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </Collapsible>
            </View>
        );
    }
}