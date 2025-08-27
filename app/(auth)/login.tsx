import {Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View} from "react-native";
import {images} from "@/constants";
import InputField from "@/components/inputField";
import CustomButton from "@/components/customButton";
import OAuth from "@/components/OAuth";
import {Link, useRouter} from "expo-router";
import {useEffect, useState} from "react";
import PasswordField from "@/components/passwordField";
import {useAuthStore} from "@/store/authStore";
import {Alert} from "react-native";
import {parseJwt} from "@/util/parseJwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Feather} from "@expo/vector-icons";

interface User{
    identifier: string;
    password: string;
}

const Login = () => {
    const router = useRouter();

    const {user, isLoading,token,checkAuth, login} = useAuthStore();
    const [form, setForm] = useState<User>({
        identifier: '',
        password: ''
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const onSignInPress = async(form: User) => {
        const response = await login(form);
        console.log(response)

        if (!response.success){
            Alert.alert("Error:", response.error);
            return;
        }

        const freshToken = await AsyncStorage.getItem('token');
        if (!freshToken){
            Alert.alert("Login Error", "Token not found after login");
            return;
        }

        const decodedToken = parseJwt(freshToken);
        const role = decodedToken.role;

        if (role === "passenger") {
            router.push("/(passenger)/(tabs)/home")
        } else if (role === "operator") {
            router.push("/(operator)/(tabs)/home")
        } else {
            router.push("/+not-found")
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
                                Welcome to X-Bus!
                            </Text>
                            <Text className="text-gray-500 text-center">
                                Sign in to access your account
                            </Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="mx-5 mt-6">
                        <View className="bg-white rounded-2xl p-6 shadow-sm">
                            <View className="flex-row items-center justify-center mb-4">
                                <View className="bg-red-100 p-2 rounded-lg mr-3">
                                    <Feather name="shield" size={20} color="#dc2626" />
                                </View>
                                <Text className="text-xl font-semibold text-gray-800">Sign In</Text>
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Email/Registration No</Text>
                                <InputField
                                    label="Email"
                                    placeholder="Enter your email or registration number"
                                    icon="mail-outline"
                                    value={form.identifier}
                                    onChangeText={(value) => setForm({...form, identifier: value})}
                                    keyboardType="email-address"
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-700 font-medium mb-2">Password</Text>
                                <PasswordField
                                    label="Password"
                                    placeholder="Enter your password"
                                    icon="lock-closed-outline"
                                    value={form.password}
                                    onChangeText={(value) => setForm({...form, password: value})}
                                />
                            </View>

                            <CustomButton
                                title="Sign In"
                                onPress={() => onSignInPress(form)}
                                disabled={!form.identifier || !form.password || isLoading}
                                loading={isLoading}
                                bgVariant="primary"
                            />

                            <Link href="/forgotPassword" className="mt-4">
                                <Text className="text-center text-blue-600 font-medium">
                                    Forgot Password?
                                </Text>
                            </Link>
                        </View>

                        {/* Sign Up Link */}
                        <View className="bg-white rounded-2xl p-6 shadow-sm mt-4">
                            <View className="flex-row items-center justify-center">
                                <Text className="text-gray-600">Don't have an account? </Text>
                                <Link href="/signup">
                                    <Text className="text-red-600 font-semibold">Sign Up</Text>
                                </Link>
                            </View>
                        </View>

                        {/* OAuth Section (commented out for now) */}
                        {/*<View className="mt-4">
                            <OAuth/>
                        </View>*/}
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default Login;