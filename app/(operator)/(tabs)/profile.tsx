import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "@/store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/components/customButton";
import { router, useRouter } from "expo-router";
import { getBusById } from "@/api/busAPI";
import { Feather } from "@expo/vector-icons";

const Profile = () => {
    const { setUser, logout } = useAuthStore();
    const navigation = useRouter();
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
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => {
                        logout();
                        // Use setTimeout to ensure logout completes before navigation
                        setTimeout(() => {
                            try {
                                navigation.push("/(auth)/login");
                            } catch (error) {
                                console.log("Navigation error:", error);
                            }
                        }, 100);
                    }
                }
            ]
        );
    };

    if (!profileData) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <Text className="text-gray-600 text-lg">Loading bus profile...</Text>
            </View>
        );
    }

    const fields: { label: string; value: string | number; icon: string }[] = [
        { label: "Fleet Name", value: profileData.fleetName, icon: "truck" },
        { label: "Registration No", value: profileData.regNo, icon: "hash" },
        { label: "Route No", value: profileData.routeNo, icon: "map-pin" },
        { label: "Route", value: profileData.route, icon: "navigation" },
        { label: "Seating Capacity", value: profileData.seatingCapacity, icon: "users" },
        { label: "Bus Fare", value: `Rs. ${profileData.busFare}`, icon: "dollar-sign" },
    ];

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header Section */}
            <View className="bg-white pt-12 pb-8 px-6 shadow-sm">
                <Text className="text-3xl font-bold text-center text-gray-800 mb-2">Bus Profile</Text>
                <Text className="text-gray-500 text-center">Manage your bus information</Text>
            </View>

            {/* Profile Picture Section */}
            <View className="bg-red-200 mx-6 mt-6 rounded-2xl p-6 shadow-sm border border-red-100">
                <View className="items-center">
                    <View className="relative">
                        <Image
                            source={{ uri: profileData.profilePicture }}
                            className="w-48 h-48 rounded-full border-4 border-white shadow-lg"
                        />
                        <View className="absolute bottom-0 right-0 bg-red-100 p-3 rounded-full shadow-lg">
                            <Feather name="truck" size={24} color="#dc2626" />
                        </View>
                    </View>
                    <Text className="text-xl font-semibold text-red-800 mt-4 text-center">
                        {profileData.fleetName || "Bus Fleet"}
                    </Text>
                    <Text className="text-lg font-medium text-red-700 mt-1">
                        {profileData.regNo}
                    </Text>
                </View>
            </View>

            {/* Bus Information Section */}
            <View className="bg-white mx-6 mt-4 rounded-2xl p-6 shadow-sm">
                <Text className="text-2xl font-semibold text-gray-800 mb-6">Bus Information</Text>

                {fields.map((field) => (
                    <View className="mb-5" key={field.label}>
                        <View className="flex-row items-center mb-2">
                            <View className="bg-red-100 p-2 rounded-lg mr-3">
                                <Feather name={field.icon as any} size={18} color="#dc2626" />
                            </View>
                            <Text className="text-gray-700 font-medium text-base">
                                {field.label}
                            </Text>
                        </View>
                        <View className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <Text className="text-base font-semibold text-gray-900">
                                {field.value}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Action Buttons */}
            <View className="mx-6 mt-6 mb-8">
                <CustomButton
                    title="Logout"
                    onPress={handleLogout}
                    bgVariant="danger"
                />
            </View>
        </ScrollView>
    );
};

export default Profile;
