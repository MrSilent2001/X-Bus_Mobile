import CustomButton from "@/components/customButton";
import {Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View, Alert} from "react-native";
import {router} from "expo-router";
import {icons, images} from "@/constants";
import InputField from "@/components/inputField";
import {useEffect, useState} from "react";
import axios from "axios";
import {API_URL} from "@/constants/api";
import {useAuthStore} from "@/store/authStore";
import {Feather} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VerifyOTP = () => {
    const [form, setForm] = useState({
        otp: ''
    });
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState<string>('');
    const {checkAuth, email} = useAuthStore();

    useEffect(() => {
        checkAuth();
        const getUserEmail = async () => {
            const storedEmail = await AsyncStorage.getItem("userEmail");
            if (storedEmail) {
                setUserEmail(storedEmail);
            }
        };
        getUserEmail();
    }, []);

    const onVerifyOTP = async() => {
        if (!form.otp) {
            Alert.alert("Missing Information", "Please enter the OTP");
            return;
        }

        setLoading(true);
        try{
            const response = await axios.post(`${API_URL}/auth/verify-otp/${form.otp}/${userEmail || email}`)
            if (response.status === 200) {
                Alert.alert("Success", "OTP verification successful!");
                router.push("/resetPassword");
            }
        }catch(error){
            Alert.alert("Error", "Invalid OTP. Please check and try again.");
            console.error("OTP verification failed:", error);
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
                                Verify OTP
                            </Text>
                            <Text className="text-gray-500 text-center text-base">
                                Enter the verification code sent to your email
                            </Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="mx-5 mt-6">
                        <View className="bg-white rounded-2xl p-6 shadow-sm">
                            <View className="flex-row items-center justify-center mb-4">
                                <View className="bg-red-100 p-2 rounded-lg mr-3">
                                    <Feather name="shield-check" size={20} color="#dc2626" />
                                </View>
                                <Text className="text-xl font-semibold text-gray-800">Verification</Text>
                            </View>

                            <Text className="text-gray-600 text-center mb-6 leading-6">
                                We've sent a verification code to{" "}
                                <Text className="font-semibold text-gray-800">
                                    {userEmail || email}
                                </Text>
                                . Please enter it below to continue.
                            </Text>

                            <View className="mb-6">
                                <Text className="text-gray-700 font-medium mb-2">Verification Code</Text>
                                <InputField
                                    label="OTP"
                                    placeholder="Enter the 6-digit code"
                                    icon="chatbox-ellipses-outline"
                                    value={form.otp}
                                    onChangeText={(value) => setForm({...form, otp: value})}
                                    keyboardType="numeric"
                                />
                            </View>

                            <CustomButton
                                title="Verify Code"
                                onPress={onVerifyOTP}
                                disabled={!form.otp || loading}
                                loading={loading}
                                bgVariant="primary"
                            />

                            <View className="mt-4">
                                <Text className="text-center text-gray-500 text-sm">
                                    Didn't receive the code?{" "}
                                    <Text 
                                        className="text-red-600 font-medium"
                                        onPress={() => router.back()}
                                    >
                                        Resend
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

export default VerifyOTP;