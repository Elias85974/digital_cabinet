import {Pressable, View, Text, StyleSheet} from "react-native";
import {Link} from 'expo-router';

// Main Page for now
export default function index() {
    return (
        <View>
            <Text style={styles.title}>Digital Cabinet</Text>
            <Pressable style={styles.link}>
                <Link href={{
                    pathname: "/user/[id]",
                    params: { id: 'bacon' }
                }}>
                    <Text style={styles.linkText}>View user</Text>
                </Link>
            </Pressable>
            <Pressable style={styles.link}>
                <Link href={"/RegisterPage"}>
                    <Text style={styles.linkText}>Sign Up</Text>
                </Link>
            </Pressable>
            <Pressable style={styles.link}>
                <Link href={"/LoginPage"}>
                    <Text style={styles.linkText}>Sign In</Text>
                </Link>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    link: {
        marginTop: 20,
        color: 'blue',
        textDecorationLine: 'underline',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1, // Add border
        borderColor: 'black', // Set border color
        padding: 10, // Add some padding so the text isn't right up against the border
        backgroundColor: '#1a39d6', // Set background color
    },
    linkText: {
        fontSize: 20,
        color: 'white',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
        color: '#333',
        fontFamily: 'Georgia, serif',
        lineHeight: 30,
    }
});