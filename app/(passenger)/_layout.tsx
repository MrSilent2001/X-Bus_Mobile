import {Tabs} from 'expo-router';
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const PassengerLayout = () => {
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
                name="(tabs)/reservation"
                options={{
                    title: 'Reservations',
                    tabBarIcon: ({color, size}) =>
                        <Ionicons name="bookmark-outline" size={size} color={color}/>
                        // <MaterialCommunityIcons name="seat-passenger" size={40} color="#78232A" className="text-center m-auto"/>
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
                name="(pages)/liveLocation"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/createFeedback"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/lostnfoundHome"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/lostItems"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/foundItems"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/addLostnFoundItems"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/onlinePayment"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/seatAvailability"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/viewSchedule"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/seatReservation"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/paymentSuccess"
                options={{
                    href: null
                }}
            />
            <Tabs.Screen
                name="(pages)/paymentFailure"
                options={{
                    href: null
                }}
            />
        </Tabs>
    );
}

export default PassengerLayout;
