import CustomButton from "@/components/customButton";
import {Text, View} from "react-native";
import {router} from "expo-router";

const Home = () => {
    const onSignInPress = () =>{
        router.push("/login")
    }
    return(
        <View className="mt-5">
            <Text>Operator Home</Text>

            <CustomButton
                title="Sign In"
                onPress={onSignInPress}
            />
        </View>
    )
}

export default Home;