import { Stack } from 'expo-router';

const TabsLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="passenger" />
            <Stack.Screen name="operator" />
        </Stack>
    );
}

export default TabsLayout;