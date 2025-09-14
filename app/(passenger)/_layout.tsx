import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';

const PassengerLayout = () => {
    const insets = useSafeAreaInsets();

    // Preload icon fonts (prevents blank/empty squares)
    const [fontsLoaded] = useFonts({
        ...Ionicons.font,
        ...MaterialCommunityIcons.font,
    });

    if (!fontsLoaded) {
        // quick, simple fallback while fonts load
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#A62A2D',
                tabBarInactiveTintColor: '#6B7280',
                headerTitleStyle: {
                    color: '#A62A2D',
                    fontWeight: '600',
                },
                headerShadowVisible: false,
                tabBarStyle: {
                    backgroundColor: '#FBEBE8',
                    borderTopWidth: 1,
                    borderTopColor: '#A62A2D',
                    paddingTop: 5,
                    paddingBottom: 5 + insets.bottom,
                    height: 60 + insets.bottom,
                },
            }}
        >
            <Tabs.Screen
                name="(tabs)/home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(tabs)/reservation"
                options={{
                    title: 'Reservations',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="bookmark-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(tabs)/payments"
                options={{
                    title: 'Payments',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="card-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="(tabs)/profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* Hidden Pages */}
            {[
                'liveLocation',
                'createFeedback',
                'lostnfoundHome',
                'lostItems',
                'foundItems',
                'addLostnFoundItems',
                'onlinePayment',
                'seatAvailability',
                'viewSchedule',
                'seatReservation',
                'paymentSuccess',
                'paymentFailure',
            ].map((page) => (
                <Tabs.Screen key={page} name={`(pages)/${page}`} options={{ href: null }} />
            ))}
        </Tabs>
    );
};

export default PassengerLayout;
