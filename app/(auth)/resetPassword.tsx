import CustomButton from "@/components/customButton";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
    Alert
} from "react-native";
import {router} from "expo-router";
import {images} from "@/constants";
import {useEffect, useState} from "react";
import PasswordField from "@/components/passwordField";
import axios from "axios";
import {API_URL} from "@/constants/api";
import {useAuthStore} from "@/store/authStore";
import {Feather} from "@expo/vector-icons";

const ResetPassword = () => {
    const [form, setForm] = useState({
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const {checkAuth, user} = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    const onResetPassword = async () => {
        if (!form.password || !form.confirmPassword) {
            Alert.alert("Missing Information", "Please fill in all fields");
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert("Password Mismatch", "Passwords do not match");
            return;
        }

        if (form.password.length < 6) {
            Alert.alert("Weak Password", "Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password/${user?.email}`, {
                password: form.password,
                confirmPassword: form.confirmPassword
            })

            if (response.status === 200) {
                Alert.alert("Success", "Password reset successfully! Please sign in with your new password.");
                router.push("/login");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to reset password. Please try again.");
            console.error("Password reset failed:", error);
        } finally {
            setLoading(false);
        }
    }

    const isFormValid = form.password && form.confirmPassword && (form.password === form.confirmPassword) && (form.password.length >= 6);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
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
                                Reset Password
                            </Text>
                            <Text className="text-gray-500 text-center text-base">
                                Create a new secure password for your account
                            </Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="mx-5 mt-6">
                        <View className="bg-white rounded-2xl p-6 shadow-sm">
                            <View className="flex-row items-center justify-center mb-4">
                                <View className="bg-red-100 p-2 rounded-lg mr-3">
                                    <Feather name="lock" size={20} color="#dc2626" />
                                </View>
                                <Text className="text-xl font-semibold text-gray-800">New Password</Text>
                            </View>

                            <Text className="text-gray-600 text-center mb-6 leading-6">
                                Please enter your new password below. Make sure it's secure and easy to remember.
                            </Text>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">New Password</Text>
                                <PasswordField
                                    label="Password"
                                    placeholder="Enter your new password"
                                    icon="lock-closed-outline"
                                    value={form.password}
                                    onChangeText={(value) => setForm({...form, password: value})}
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
                                <PasswordField
                                    label="Confirm Password"
                                    placeholder="Confirm your new password"
                                    icon="lock-closed-outline"
                                    value={form.confirmPassword}
                                    onChangeText={(value) => setForm({...form, confirmPassword: value})}
                                />
                            </View>

                            <CustomButton
                                title={
                                    loading ? "Resetting Password..." : "Reset Password"
                                }
                                onPress={onResetPassword}
                                disabled={!isFormValid || loading}
                                bgVariant="success"
                            />

                            <View className="mt-4">
                                <Text className="text-center text-gray-500 text-sm">
                                    Remember your password?{" "}
                                    <Text 
                                        className="text-red-600 font-medium"
                                        onPress={() => router.push("/login")}
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

export default ResetPassword;