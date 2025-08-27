import {Pressable, ScrollView, Text, View} from "react-native";
import {router} from "expo-router";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {getFormattedDate} from "@/util/formatDate";

const LostnfoundHome = () => {
    return(
        <View className="flex-1 bg-gray-50">
            <View className="m-5">
                <Text className="text-2xl text-center font-bold mt-5 mb-8 text-gray-800">
                    Lost & Found Item Information
                </Text>
                
                <View className="gap-6">
                    {/* First Row - Lost and Found Items */}
                    <View className="flex flex-row items-center gap-4">
                        <Pressable
                            className="flex-1 bg-red-200 rounded-2xl p-6 shadow-sm border border-red-100 min-h-[200px]"
                            onPress={() => router.push("/lostItems")}
                        >
                            <View className="flex-1 items-center justify-center">
                                <View className="bg-red-100 p-4 rounded-full mb-4">
                                    <MaterialCommunityIcons name="briefcase-search" size={32} color="#dc2626" />
                                </View>
                                <Text className="text-lg font-bold text-center text-red-800 mb-2">Lost Items</Text>
                                <Text className="text-sm text-center text-red-600">View reported lost items</Text>
                            </View>
                        </Pressable>
                        
                        <Pressable
                            className="flex-1 bg-red-200 rounded-2xl p-6 shadow-sm border border-red-100 min-h-[200px]"
                            onPress={() => router.push("/foundItems")}
                        >
                            <View className="flex-1 items-center justify-center">
                                <View className="bg-red-100 p-4 rounded-full mb-4">
                                    <Ionicons name="search-outline" size={32} color="#dc2626" />
                                </View>
                                <Text className="text-lg font-bold text-center text-red-800 mb-2">Found Items</Text>
                                <Text className="text-sm text-center text-red-600">View found items</Text>
                            </View>
                        </Pressable>
                    </View>
                    
                    {/* Second Row - Submit Item Info */}
                    <Pressable
                        className="w-full bg-red-200 rounded-2xl p-6 shadow-sm border border-red-100 min-h-[160px]"
                        onPress={() => router.push("/addLostnFoundItems")}
                    >
                        <View className="flex-1 items-center justify-center">
                            <View className="bg-red-100 p-4 rounded-full mb-4">
                                <MaterialIcons name="information-outline" size={32} color="#dc2626" />
                            </View>
                            <Text className="text-lg font-bold text-center text-red-800 mb-2">Submit Item Info</Text>
                            <Text className="text-sm text-center text-red-600">Add new lost or found items</Text>
                        </View>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default LostnfoundHome;