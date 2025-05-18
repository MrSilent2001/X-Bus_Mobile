import {Pressable, ScrollView, Text, View} from "react-native";
import {router} from "expo-router";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {getFormattedDate} from "@/util/formatDate";

const LostnfoundHome = () => {
    return(
        <View className="m-5 bg-white">
            <Text className="text-2xl text-center font-bold mt-5">Lost & Found Item Information</Text>
            <View className="mt-10 gap-5">
                <View className="w-full flex flex-row items-center gap-4">
                    <View className="w-52 h-80 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/lostItems")}

                        >
                            <MaterialCommunityIcons name="briefcase-search" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Lost Items</Text>
                        </Pressable>
                    </View>
                    <View className="w-52 h-80 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/foundItems")}
                        >
                            <Ionicons name="search-outline" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Found Items</Text>
                        </Pressable>
                    </View>
                </View>
                <View className="w-full flex flex-row items-center gap-4">
                    <View className="w-full h-60 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/addLostnFoundItems")}

                        >
                            <MaterialCommunityIcons name="information-outline" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Submit Item Info</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default LostnfoundHome;