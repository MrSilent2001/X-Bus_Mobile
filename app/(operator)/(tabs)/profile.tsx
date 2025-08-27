import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useAuthStore } from "@/store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/components/customButton";
import { router } from "expo-router";
import { getBusById } from "@/api/busAPI";

const Profile = () => {
    const { setUser, logout } = useAuthStore();
    const [profileData, setProfileData] = useState<{
        fleetName: string;
        regNo: string;
        routeNo: string;
        route: string;
        seatingCapacity: number;
        busFare: number;
        profilePicture: string;
    } | null>(null);

    useEffect(() => {
        const fetchBus = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) return;

                const response = await getBusById(userId);

                setUser(response);

                setProfileData({
                    fleetName: response.fleetName || "",
                    regNo: response.regNo || "",
                    routeNo: response.routeNo || "",
                    route: response.route || "",
                    seatingCapacity: response.seatingCapacity || 0,
                    busFare: response.busFare || 0,
                    profilePicture: response.profilePicture || "https://i.pravatar.cc/150",
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchBus();
    }, []);

    const handleLogout = () => {
        logout();
        router.push("/(auth)/login");
    };

    if (!profileData) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading bus profile...</Text>
            </View>
        );
    }

    const fields: { label: string; value: string | number }[] = [
        { label: "Fleet Name", value: profileData.fleetName },
        { label: "Registration No", value: profileData.regNo },
        { label: "Route No", value: profileData.routeNo },
        { label: "Route", value: profileData.route },
        { label: "Seating Capacity", value: profileData.seatingCapacity },
        { label: "Bus Fare", value: profileData.busFare },
    ];

    return (
        <ScrollView className="flex-1 bg-gray-100 p-5" contentContainerStyle={{ paddingBottom: 40 }}>
            <Text className="text-3xl font-bold text-center mb-6">Bus Profile</Text>

            {/* Profile Picture */}
            <View className="items-center mb-6">
                <Image
                    source={{ uri: profileData.profilePicture }}
                    className="w-60 h-48 rounded-lg mb-3"
                />
            </View>

            {/* Display Fields */}
            {fields.map((field) => (
                <View className="mb-6" key={field.label}>
                    <Text className="text-gray-600 font-semibold mb-1">{field.label}</Text>
                    <View className="p-3 rounded-lg bg-gray-200">
                        <Text className="text-base">{field.value}</Text>
                    </View>
                </View>
            ))}

            {/* Logout Button */}
            <CustomButton title="Logout" onPress={handleLogout} className="mb-10" />
        </ScrollView>
    );
};

export default Profile;
