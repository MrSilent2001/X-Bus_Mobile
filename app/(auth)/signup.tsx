import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {images} from "@/constants";
import InputField from "@/components/inputField";
import {useState} from "react";
import CustomButton from "@/components/customButton";
import {Link, useRouter} from "expo-router";
import OAuth from "@/components/OAuth";
import PasswordField from "@/components/passwordField";
import {useAuthStore} from "@/store/authStore";

interface User {
    name: string;
    email: string;
    nic:string;
    contactNo?: string;
    password: string;
    confirmPassword: string;
    profilePicture?: string;
    role?: string;
}

const SignUp = () => {
    const router = useRouter()

    const [form, setForm] = useState<User>({
        name: '',
        email: '',
        nic: '',
        password: '',
        confirmPassword: ''
    })
    const {user, isLoading,signup} = useAuthStore();

    const onSignUpPress = async(payload: User) => {
        const response = await signup({
            ...payload,
            contactNo: '',
            role: 'passenger',
            profilePicture: 'https://th.bing.com/th/id/OIP.cjgNLtmwsA5WxCI1Jr3dqgHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3'
        });
        console.log(response)

        if (!response.success){
            Alert.alert("Error:", response.error);
            return;
        }
        router.push("/login")
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
                    <View className="flex-1 bg-white">
                        <View className="relative w-full h-[250px]">
                            <Image
                                source={images.signUpCar}
                                className="z-0 w-full h-[250px]"
                            />

                            <Text className="text-4xl text-center text-black font-JakartaBold bottom-10">
                                Create Your Account
                            </Text>
                        </View>

                        <View className="p-5">
                            <View className="mt-3">
                                <Text className="text-lg font-JakartaSemiBold">Username</Text>
                                <InputField
                                    label="Username"
                                    placeholder="Enter your username"
                                    icon="person-outline"
                                    value={form.name}
                                    onChangeText={(value) => setForm({...form, name: value})}
                                />
                            </View>

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
                                <Text className="text-lg font-JakartaSemiBold">NIC</Text>
                                <InputField
                                    label="NIC "
                                    placeholder="Enter your NIC"
                                    icon="id-card-outline"
                                    value={form.nic}
                                    onChangeText={(value) => setForm({...form, nic: value})}
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

                            <View className="mt-5">
                                <CustomButton
                                    title="Sign Up"
                                    onPress={() => onSignUpPress(form)}
                                />
                            </View>

                            {/*<OAuth/>*/}

                            <Link
                                href="/login"
                                className="text-lg text-center text-general-200 mt-2"
                            >
                                Already have an account?{" "}
                                <Text className="text-danger-500">Login</Text>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

export default SignUp;