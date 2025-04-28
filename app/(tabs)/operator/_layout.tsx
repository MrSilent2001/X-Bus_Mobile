import {Stack, Tabs} from 'expo-router';
import {Ionicons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const OperatorLayout = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#A62A2D',
                headerTitleStyle: {
                    color: '#A62A2D',
                    fontWeight: 600
                },
                headerShadowVisible:false,
                tabBarStyle:{
                    backgroundColor: '#FBEBE8',
                    borderTopWidth: 1,
                    borderTopColor: '#A62A2D',
                    paddingTop: 5,
                    paddingBottom: 5 + insets.bottom,
                    height: 60 + insets.bottom
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, size}) =>
                        <Ionicons name="home-outline" size={size} color={color}/>
                }}
            />
            <Tabs.Screen
                name="reservation"
                options={{
                    title: 'Reservations',
                    tabBarIcon: ({color, size}) =>
                        <Ionicons name="bookmark-outline" size={size} color={color}/>
                }}
            />
            <Tabs.Screen
                name="payments"
                options={{
                    title: 'Payments',
                    tabBarIcon: ({color, size}) =>
                        <Ionicons name="card-outline" size={size} color={color}/>
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({color, size}) =>
                        <Ionicons name="person-outline" size={size} color={color}/>
                }}
            />
        </Tabs>
    );
}

export default OperatorLayout;
