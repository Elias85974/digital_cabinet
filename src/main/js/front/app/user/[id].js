import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

// This is a dynamic route, so we need to use the `useLocalSearchParams` hook to get the `id` parameter.
export default function Page() {
    const { id } = useLocalSearchParams();
    return <Text>User page: {id}</Text>;
}