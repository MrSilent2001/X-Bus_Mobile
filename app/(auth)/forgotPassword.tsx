import CustomButton from "@/components/customButton";
import {Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View} from "react-native";
import {router} from "expo-router";
import {icons, images} from "@/constants";
import InputField from "@/components/inputField";
import {useState} from "react";

const ForgotPassword = () => {
    const [form, setForm] = useState({
        email: ''
    })

    const onSignInPress = () => {
        router.push("/verifyOTP")
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

                            <Text className="text-3xl text-center text-black font-JakartaBold bottom-10 ">
                                Forgot Password!
                            </Text>

                            <Text className="mx-5 text-lg text-justify text-black">
                                Enter your email address here. We'll send you an OTP to verify you
                            </Text>
                        </View>

                        <View className="p-5 mt-5">

                            <View className="mt-3">
                                <InputField
                                    label="Email"
                                    placeholder="Enter your email"
                                    icon="mail-outline"
                                    value={form.email}
                                    onChangeText={(value) => setForm({...form, email: value})}
                                    keyboardType="email-address"
                                />
                            </View>

                            <View className="mt-5">
                                <CustomButton
                                    title="Send OTP"
                                    onPress={() => onSignInPress()}
                                />
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default ForgotPassword;