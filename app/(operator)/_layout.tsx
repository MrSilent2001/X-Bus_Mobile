import {router, Tabs} from 'expo-router';
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { Pressable } from 'react-native';

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
                name="(tabs)/home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, size}) =>
                        <Ionicons name="home-outline" size={size} color={color}/>
                }}
            />
            <Tabs.Screen
                name="(tabs)/seatAvailability"
                options={{
                    title: 'Seat Availability',
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()} style={{ marginLeft: 16 }}>
                            <Ionicons name="arrow-back-outline"></Ionicons>
                        </Pressable>
                    ),
                    tabBarIcon: ({color, size}) =>
                        <Ionicons name="bookmark-outline" size={size} color={color}/>
                        // <MaterialCommunityIcons name="seat-passenger" size={30} color="#aeabab" className="text-center m-auto"/>
                }}
            />
            <Tabs.Screen
                name="(tabs)/payments"
                options={{
                    title: 'Payments',
                    tabBarIcon: ({color, size}) =>
                        <Ionicons name="card-outline" size={size} color={color}/>
                }}
            />
            <Tabs.Screen
                name="(tabs)/profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({color, size}) =>
                        <Ionicons name="person-outline" size={size} color={color}/>
                }}
            />
            <Tabs.Screen
                name="(pages)/createSchedule"
                options={{
                    href: null
                }}
            />
        </Tabs>
    );
}

export default OperatorLayout;
