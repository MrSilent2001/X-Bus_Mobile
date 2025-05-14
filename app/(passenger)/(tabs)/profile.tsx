import {View, Text} from "react-native";
import CustomButton from "@/components/customButton";
import {useAuthStore} from "@/store/authStore";
import {router} from "expo-router";

const Profile = () => {

    const {logout} = useAuthStore();
    const onLogoutPress = () => {
        logout();
        router.push("/(auth)/login");
    }
    return(
        <View>
            <Text> Profile </Text>

            <CustomButton
                title="Logout"
                onPress={onLogoutPress}
            />
        </View>
    );
}

export default Profile;