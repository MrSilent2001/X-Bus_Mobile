import React, { useEffect, useState } from "react";
import {View, Text, TextInput, Image, TouchableOpacity, Alert, ScrollView} from "react-native";
import CustomButton from "@/components/customButton";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { getUserById, updateUser } from "@/api/userAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "@/util/fileUpload";
import {Feather} from "@expo/vector-icons";

const Profile = () => {
    const { user, setUser, logout } = useAuthStore();
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
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // correct for your SDK
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
        logout();
        router.push("/(auth)/login");
    };

    if (!profileData) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-100 p-5">
            <Text className="text-3xl font-bold text-center mb-6">My Profile</Text>

            {/* Profile Picture */}
            <View className="items-center mb-6">
                <Image
                    source={{ uri: profileData.profilePicture }}
                    className="w-48 h-48 rounded-full mb-3"
                />
                {isEditing && (
                    <TouchableOpacity
                        className="absolute bottom-0 right-28 bg-blue-500 p-2 rounded-full"
                        onPress={handleChangePicture}
                    >
                        <Feather name="camera" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Input Fields */}
            {["name", "email", "nic", "contactNo"].map((field) => (
                <View className="mb-8" key={field}>
                    <Text className="text-gray-600 font-semibold mb-1">
                        {field === "contactNo"
                            ? "Contact No"
                            : field.charAt(0).toUpperCase() + field.slice(1)}
                    </Text>
                    <TextInput
                        className={`p-3 rounded-lg text-base ${
                            isEditing ? "bg-white border border-blue-500" : "bg-gray-200"
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
                    />
                </View>
            ))}

            {/* Buttons */}
            {isEditing ? (
                <>
                    <CustomButton title="Save" onPress={handleSave} disabled={loading} />
                    <View className="mt-4">
                        <CustomButton title="Cancel" onPress={handleCancel} />
                    </View>
                </>
            ) : (
                <>
                    <CustomButton title="Edit Profile" onPress={() => setIsEditing(true)} />
                    <View className="mt-4">
                        <CustomButton title="Logout" onPress={handleLogout} />
                    </View>
                </>
            )}
        </ScrollView>
    );
};

export default Profile;
