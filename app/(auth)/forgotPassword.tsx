import CustomButton from "@/components/customButton";
import {Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View, Alert} from "react-native";
import {router} from "expo-router";
import {images} from "@/constants";
import InputField from "@/components/inputField";
import {useState} from "react";
import axios from "axios";
import {API_URL} from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Feather} from "@expo/vector-icons";

const ForgotPassword = () => {
    const [form, setForm] = useState({
        email: ''
    });
    const [loading, setLoading] = useState(false);

    const onSendOTP = async() => {
        if (!form.email) {
            Alert.alert("Missing Information", "Please enter your email address");
            return;
        }

        setLoading(true);
        try{
            const response = await axios.post(`${API_URL}/auth/forgot-password/${form.email}`)
            if (response.status === 200) {
                Alert.alert("Success", "OTP sent successfully to your email!");
                await AsyncStorage.setItem("userEmail", form.email);
                router.push("/verifyOTP");
            }
        }catch(error){
            Alert.alert("Error", "Failed to send OTP. Please check your email and try again.");
            console.error("OTP sending failed:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView className="flex-1 bg-gray-50" keyboardShouldPersistTaps="handled">
                    {/* Header Section with Logo */}
                    <View className="bg-white pt-12 pb-8 px-6 shadow-sm">
                        <View className="items-center">
                            <View className="bg-red-100 p-5 rounded-full mb-4">
                                <Image
                                    source={images.BusLogo}
                                    className="w-48 h-48"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
                                Forgot Password?
                            </Text>
                            <Text className="text-gray-500 text-center text-base">
                                Don't worry! We'll help you reset it
                            </Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="mx-5 mt-6">
                        <View className="bg-white rounded-2xl p-6 shadow-sm">
                            <View className="flex-row items-center justify-center mb-4">
                                <View className="bg-red-100 p-2 rounded-lg mr-3">
                                    <Feather name="key" size={20} color="#dc2626" />
                                </View>
                                <Text className="text-xl font-semibold text-gray-800">Reset Password</Text>
                            </View>

                            <Text className="text-gray-600 text-center mb-6 leading-6">
                                Enter your email address below. We'll send you a verification code to reset your password.
                            </Text>

                            <View className="mb-6">
                                <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
                                <InputField
                                    label="Email"
                                    placeholder="Enter your email address"
                                    icon="mail-outline"
                                    value={form.email}
                                    onChangeText={(value) => setForm({...form, email: value})}
                                    keyboardType="email-address"
                                />
                            </View>

                            <CustomButton
                                title={
                                    loading ? "Sending Verification Code..." : "Send Verification Code"
                                }
                                onPress={onSendOTP}
                                disabled={!form.email || loading}
                                bgVariant="primary"
                            />

                            <View className="mt-4">
                                <Text className="text-center text-gray-500 text-sm">
                                    Remember your password?{" "}
                                    <Text 
                                        className="text-red-600 font-medium"
                                        onPress={() => router.back()}
                                    >
                                        Sign In
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default ForgotPassword;