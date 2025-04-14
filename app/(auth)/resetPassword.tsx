import CustomButton from "@/components/customButton";
import {Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View} from "react-native";
import {router} from "expo-router";
import {icons, images} from "@/constants";
import InputField from "@/components/inputField";
import {useState} from "react";
import PasswordField from "@/components/passwordField";

const ResetPassword = () => {
    const [form, setForm] = useState({
        password: '',
        confirmPassword: ''
    })

    const onSignUpPress = () => {
        router.push("/login")
    }
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
                    <View className="flex-1 bg-white">
                        <View className="relative w-full h-[400px]">
                            <Image
                                source={images.signUpCar}
                                className="z-0 w-full h-[350px]"
                            />

                            <Text className="text-3xl text-center text-black font-JakartaBold bottom-5">
                                Reset Your Password
                            </Text>
                        </View>

                        <View className="p-5">
                            <View className="mt-3">
                                <Text className="text-lg font-JakartaSemiBold">Password</Text>
                                <PasswordField
                                    label="Password"
                                    placeholder="Enter your password"
                                    icon="lock-closed-outline"
                                    value={form.password}
                                    onChangeText={(value) => setForm({...form, password: value})}
                                />
                            </View>

                            <View className="mt-3">
                                <Text className="text-lg font-JakartaSemiBold">Confirm Password</Text>
                                <PasswordField
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    icon="lock-closed-outline"
                                    value={form.confirmPassword}
                                    onChangeText={(value) => setForm({...form, confirmPassword: value})}
                                />
                            </View>

                            <View className="mt-10">
                                <CustomButton
                                    title="Reset"
                                    onPress={onSignUpPress}
                                />
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default ResetPassword;