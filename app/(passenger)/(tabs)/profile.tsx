import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import CustomButton from "@/components/customButton";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import { updateUser } from "@/api/userAPI";

const Profile = () => {
    const { logout, user, setUser } = useAuthStore(); // added setUser to update store after save
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        nic: user?.nic || "",
        contactNo: user?.contactNo || "",
        profilePicture: user?.profilePicture || "https://i.pravatar.cc/150",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (key: string, value: string) => {
        setProfileData({ ...profileData, [key]: value });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await updateUser(user, profileData);
            if (response?.status === 200 || response?.success) {
                Alert.alert("Success", "Profile updated successfully!");
                setIsEditing(false);
                // update the user in the store
                setUser({ ...user, ...profileData });
            } else {
                Alert.alert("Error", response?.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            Alert.alert("Error", "Something went wrong while updating profile");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset profileData to original user data
        setProfileData({
            name: user?.name || "",
            email: user?.email || "",
            nic: user?.nic || "",
            contactNo: user?.contactNo || "",
            profilePicture: user?.profilePicture || "https://i.pravatar.cc/150",
        });
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        router.push("/(auth)/login");
    };

    const handleChangePicture = () => {
        Alert.alert("Change Profile Picture", "Implement image picker here");
        // TODO: open image picker and update profileData.profilePicture
    };

    return (
        <View className="flex-1 bg-gray-100 p-5">
            <Text className="text-3xl font-bold text-center mb-6">My Profile</Text>

            {/* Profile Picture */}
            <View className="items-center mb-6">
                <Image
                    source={{ uri: profileData.profilePicture }}
                    className="w-48 h-48 rounded-full mb-3"
                />
                {isEditing && (
                    <TouchableOpacity
                        className="bg-blue-500 px-4 py-1 rounded-full"
                        onPress={handleChangePicture}
                    >
                        <Text className="text-white font-semibold">Change Photo</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Fields */}
            {["name", "email", "nic", "contactNo"].map((field) => (
                <View className="mb-4" key={field}>
                    <Text className="text-gray-600 font-semibold mb-1">
                        {field === "contactNo" ? "Contact No" : field.charAt(0).toUpperCase() + field.slice(1)}
                    </Text>
                    <TextInput
                        className={`p-3 rounded-lg text-base ${
                            isEditing ? "bg-white border border-blue-500" : "bg-gray-200"
                        }`}
                        value={profileData[field as keyof typeof profileData]}
                        editable={isEditing}
                        keyboardType={field === "email" ? "email-address" : field === "contactNo" ? "phone-pad" : "default"}
                        onChangeText={(text) => handleChange(field, text)}
                    />
                </View>
            ))}

            {/* Buttons */}
            {isEditing ? (
                <>
                    <CustomButton
                        title="Save"
                        onPress={handleSave}
                        disabled={loading}
                    />
                    <View className="mt-4">
                        <CustomButton title="Cancel" onPress={handleCancel} />
                    </View>
                </>
            ) : (
                <>
                    <CustomButton
                        title="Edit Profile"
                        onPress={() => setIsEditing(true)}
                    />
                    <View className="mt-4">
                        <CustomButton title="Logout" onPress={handleLogout} />
                    </View>
                </>
            )}

        </View>
    );
};

export default Profile;


