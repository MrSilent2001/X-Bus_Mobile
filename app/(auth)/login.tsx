import {Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableWithoutFeedback, View} from "react-native";
import {images} from "@/constants";
import InputField from "@/components/inputField";
import CustomButton from "@/components/customButton";
import OAuth from "@/components/OAuth";
import {Link, useRouter} from "expo-router";
import {useState} from "react";
import PasswordField from "@/components/passwordField";
import {useAuthStore} from "@/store/authStore";
import {Alert} from "react-native";

interface User{
    email: string;
    password: string;
}

const Login = () => {
    const router = useRouter()

    const {user, isLoading,register} = useAuthStore();
    //console.log(user)

    const [form, setForm] = useState<User>({
        email: '',
        password: ''
    });

    const role = "passenger"

    const onSignInPress = async(form: User, role: string) => {
        const response = await register(form.email, form.password);
        console.log(response)

        if (!response.success){
            Alert.alert("Error:", response.error);
            console.log(response.error);
            return;
        }

        if (role === "passenger") {
            router.push("/(root)/(tabs)/passenger/home")
        } else if (role === "operator") {
            router.push("/(root)/(tabs)/operator/home")
        } else {
            router.push("/+not-found")
        }

    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
                        <View className="flex-1 bg-white">
                            <View className="relative w-full h-[350px]">
                                <Image
                                    source={images.signUpCar}
                                    className="z-0 w-full h-[350px]"
                                />

                                <Text className="text-4xl text-center text-black font-JakartaBold bottom-10 ">
                                    Welcome to X-Bus!
                                </Text>
                            </View>

                            <View className="p-5">
                                <View className="mt-3">
                                    <Text className="text-lg font-JakartaSemiBold">Email</Text>
                                    <InputField
                                        label="Email"
                                        placeholder="Enter your email"
                                        icon="mail-outline"
                                        value={form.email}
                                        onChangeText={(value) => setForm({...form, email: value})}
                                        keyboardType="email-address"
                                    />
                                </View>

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

                                <Link href="/signup" className="text-lg text-general-200 mt-5 left-5">
                                    <Text>Don't you have an Account? </Text>
                                    <Text className="text-danger-500">SignUp</Text>
                                </Link>

                                <View className="mt-2">
                                    <CustomButton
                                        title="Sign In"
                                        onPress={() => onSignInPress(form, role)}
                                    />
                                </View>

                                {/*<OAuth/>*/}

                                <Link href="/forgotPassword" className="text-lg text-center text-general-200 mt-2">
                                    <Text>Forgot Password? </Text>
                                    <Text className="text-danger-500">Reset Password</Text>
                                </Link>
                            </View>
                        </View>
                    </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default Login;