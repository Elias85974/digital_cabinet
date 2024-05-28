import React from "react";
import {View, Text, StyleSheet, Pressable} from "react-native";
import {authentication} from "../Api";
import {router} from "expo-router";

export default function HomePage() {
    const movePage = async (url) => {
        try {
            if (await authentication() === true) {
                router.replace(url);
            }
            else {
                alert("You must be logged in to access this page. Going back to LoginPage");
                router.replace("LoginPage");
            }
        }
        catch (error) {
            console.log("Error moving to login page:", error);
        }
    }
    return (
        <View>
            <Pressable onPress={() => movePage("TestingPage")}>
                <Text>Testing Page</Text>
            </Pressable>
        </View>
    )
}