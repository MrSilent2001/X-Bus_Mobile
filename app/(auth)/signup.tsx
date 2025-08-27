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
import {Feather} from "@expo/vector-icons";

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
        if (!form.name || !form.email || !form.nic || !form.password || !form.confirmPassword) {
            Alert.alert("Missing Information", "Please fill in all fields");
            return;
        }

        if (form.password !== form.confirmPassword) {
            Alert.alert("Password Mismatch", "Passwords do not match");
            return;
        }

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
        Alert.alert("Success", "Account created successfully! Please sign in.");
        router.push("/login")
    }

    const isFormValid = form.name && form.email && form.nic && form.password && form.confirmPassword && (form.password === form.confirmPassword);

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
                                Create Your Account
                            </Text>
                            <Text className="text-gray-500 text-center">
                                Join X-Bus and start your journey
                            </Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View className="mx-5 mt-6">
                        <View className="bg-white rounded-2xl p-6 shadow-sm">
                            <View className="flex-row items-center justify-center mb-4">
                                <View className="bg-red-100 p-2 rounded-lg mr-3">
                                    <Feather name="user-check" size={20} color="#dc2626" />
                                </View>
                                <Text className="text-xl font-semibold text-gray-800">Account Details</Text>
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
                                <InputField
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    icon="person-outline"
                                    value={form.name}
                                    onChangeText={(value) => setForm({...form, name: value})}
                                />
                            </View>

                            <View className="mb-4">
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

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">NIC Number</Text>
                                <InputField
                                    label="NIC"
                                    placeholder="Enter your NIC number"
                                    icon="id-card-outline"
                                    value={form.nic}
                                    onChangeText={(value) => setForm({...form, nic: value})}
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-700 font-medium mb-2">Password</Text>
                                <PasswordField
                                    label="Password"
                                    placeholder="Create a strong password"
                                    icon="lock-closed-outline"
                                    value={form.password}
                                    onChangeText={(value) => setForm({...form, password: value})}
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
                                <PasswordField
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    icon="lock-closed-outline"
                                    value={form.confirmPassword}
                                    onChangeText={(value) => setForm({...form, confirmPassword: value})}
                                />
                            </View>

                            <CustomButton
                                title="Create Account"
                                onPress={() => onSignUpPress(form)}
                                disabled={!isFormValid || isLoading}
                                loading={isLoading}
                                bgVariant="primary"
                            />
                        </View>

                        {/* Login Link */}
                        <View className="bg-white rounded-2xl p-6 shadow-sm mt-4">
                            <View className="flex-row items-center justify-center">
                                <Text className="text-gray-600">Already have an account? </Text>
                                <Link href="/login">
                                    <Text className="text-red-600 font-semibold">Sign In</Text>
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

export default SignUp;