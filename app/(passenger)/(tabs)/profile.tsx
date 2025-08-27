import React, { useEffect, useState } from "react";
import {View, Text, TextInput, Image, TouchableOpacity, Alert, ScrollView} from "react-native";
import CustomButton from "@/components/customButton";
import { useAuthStore } from "@/store/authStore";
import { router, useRouter } from "expo-router";
import { getUserById, updateUser } from "@/api/userAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "@/util/fileUpload";
import {Feather} from "@expo/vector-icons";

const Profile = () => {
    const { user, setUser, logout } = useAuthStore();
    const navigation = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<{
        name: string;
        email: string;
        nic: string;
        contactNo: string;
        profilePicture: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) return;

                const response = await getUserById(userId);

                // Update store
                setUser(response);

                // Set profile data for input fields
                setProfileData({
                    name: response.name || "",
                    email: response.email || "",
                    nic: response.nic || "",
                    contactNo: response.contactNo || "",
                    profilePicture: response.profilePicture || "https://i.pravatar.cc/150",
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchUser();
    }, []);

    // Handle input changes
    const handleChange = (key: string, value: string) => {
        if (profileData) {
            setProfileData({ ...profileData, [key]: value });
        }
    };

    // Handle profile picture change
    const handleChangePicture = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("Permission required", "Permission to access media library is required.");
                return;
            }

            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });

            if (pickerResult.canceled) return;

            const uploadedUrl = await uploadToCloudinary(pickerResult.assets[0].uri);
            if (!uploadedUrl) {
                Alert.alert("Upload failed", "Failed to upload image");
                return;
            }

            setProfileData(prev => prev ? { ...prev, profilePicture: uploadedUrl } : prev);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Something went wrong while changing the picture");
        }
    };

    // Save profile updates
    const handleSave = async () => {
        if (!profileData) return;

        try {
            setLoading(true);

            // Send profileData to backend (email must exist)
            const userId = await AsyncStorage.getItem("userId");
            const data = { id: userId, ...profileData }
            const updatedUser = await updateUser(data);

            if (updatedUser) {
                Alert.alert("Success", "Profile updated successfully!");
                setIsEditing(false);
                setUser(updatedUser);
            } else {
                Alert.alert("Error", "Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong while updating profile");
        } finally {
            setLoading(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                nic: user.nic || "",
                contactNo: user.contactNo || "",
                profilePicture: user.profilePicture || "",
            });
        }
        setIsEditing(false);
    };

    // Logout
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
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-gray-600 text-lg">Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header Section */}
            <View className="bg-white pt-12 pb-8 px-6 shadow-sm">
                <Text className="text-3xl font-bold text-center text-gray-800 mb-2">My Profile</Text>
                <Text className="text-gray-500 text-center">Manage your account information</Text>
            </View>

            {/* Profile Picture Section */}
            <View className="bg-white mx-6 mt-6 rounded-2xl p-6 shadow-sm">
                <View className="items-center">
                    <View className="relative">
                        <Image
                            source={{ uri: profileData.profilePicture }}
                            className="w-48 h-48 rounded-full"
                        />
                        {isEditing && (
                            <TouchableOpacity
                                className="absolute bottom-0 right-0 bg-blue-500 p-3 rounded-full shadow-lg"
                                onPress={handleChangePicture}
                            >
                                <Feather name="camera" size={20} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text className="text-lg font-semibold text-gray-800 mt-3">
                        {profileData.name || "User Name"}
                    </Text>
                </View>
            </View>

            {/* Form Section */}
            <View className="bg-white mx-6 mt-4 rounded-2xl p-6 shadow-sm">
                <Text className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</Text>
                
                {["name", "email", "nic", "contactNo"].map((field) => (
                    <View className="mb-5" key={field}>
                        <Text className="text-gray-900 font-xl mb-2 text-base">
                            {field === "contactNo"
                                ? "Contact Number"
                                : field === "nic"
                                    ? "NIC Number"
                                    : field.charAt(0).toUpperCase() + field.slice(1)}
                        </Text>
                        <TextInput
                            className={`p-4 rounded-xl text-base font-medium border ${
                                isEditing 
                                    ? "bg-white border-blue-300 border-2" 
                                    : "bg-gray-100 border-gray-200"
                            }`}
                            value={profileData[field as keyof typeof profileData]}
                            editable={isEditing}
                            keyboardType={
                                field === "email"
                                    ? "email-address"
                                    : field === "contactNo"
                                        ? "phone-pad"
                                        : "default"
                            }
                            onChangeText={(text) => handleChange(field, text)}
                            placeholder={`Enter your ${field === "nic" ? "NIC" : field}`}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                ))}
            </View>

            {/* Action Buttons */}
            <View className="mx-6 mt-6 mb-8">
                {isEditing ? (
                    <View className="space-y-4">
                        <CustomButton 
                            title="Save Changes" 
                            onPress={handleSave} 
                            disabled={loading} 
                            loading={loading}
                            bgVariant="warning"
                        />
                        <View className="h-2" />
                        <CustomButton 
                            title="Cancel" 
                            onPress={handleCancel} 
                            bgVariant="danger"
                        />
                    </View>
                ) : (
                    <View className="space-y-4">
                        <CustomButton 
                            title="Edit Profile" 
                            onPress={() => setIsEditing(true)}
                            bgVariant="primary"
                        />
                        <View className="h-2" />
                        <CustomButton 
                            title="Logout" 
                            onPress={handleLogout} 
                            bgVariant="danger"
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Profile;
