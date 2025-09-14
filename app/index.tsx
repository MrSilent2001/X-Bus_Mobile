import {View, ActivityIndicator, Text} from "react-native";

const Page = () => {
    return (
        <View className="flex-1 justify-center items-center bg-white">
            <ActivityIndicator size="large" color="#2563EB" />
            <Text className="mt-4 text-gray-600">Loading...</Text>
        </View>
    );
}

export default Page;