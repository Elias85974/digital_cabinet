import {Pressable, View, Text, StyleSheet, Image} from "react-native";
import {Link} from 'expo-router';

// Main Page for now
export default function index() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Digital Cabinet</Text>
            <Image
                style={styles.image}
                source={require('../assets/favicon.png')}
                resizeMode="contain"
            />
            <View style={styles.linksContainer}>
                <Pressable style={styles.link}>
                    <Link href={"/RegisterPage"}>
                        <Text style={styles.linkText}>Sign Up</Text>
                    </Link>
                </Pressable>
                <Pressable style={styles.link}>
                    <Link href={"/LoginPage"}>
                        <Text style={styles.linkText}>Log In</Text>
                    </Link>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    link: {
        marginTop: 25,
        color: '#F2EFE9',
        textDecorationLine: 'underline',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3, // Add border
        borderColor: '#717336', // Set border color
        padding: 10, // Add some padding so the text isn't right up against the border
        backgroundColor: '#4B5940', // Set background color
        width: 200, // Set width
        alignSelf: 'center',
        borderRadius: 100,

    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#BFAC9B',
        alignItems: 'center',
    },
    linksContainer: {
        marginBottom: 40,
        marginTop: 10,
    },
    linkText: {
        fontSize: 18,
        color: '#F2EFE9',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 0,
        color: '#1B1A26',
        fontFamily: 'lucida grande',
        lineHeight: 80,
    },
    image: {
        width: 400, // Set the width of the image
        height: 400, // Set the height of the image
    }
});