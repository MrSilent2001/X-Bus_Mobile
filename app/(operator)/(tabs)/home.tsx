import {Pressable, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {getFormattedDate} from "@/util/formatDate";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {Bus } from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import {getBusById} from "@/api/busAPI";

const Home = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [bus, setBus] = useState<Bus | null>(null);
    const userId = AsyncStorage.getItem("userId");

    useEffect(() => {
        const timer = setInterval(()=>{
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (userId) {
                    const bus = await getBusById(await userId);
                    if (bus) {
                        setBus(bus);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserData();
    }, [userId]);

    return(
        <View className="m-5 bg-white">
            <Text className="text-xl font-bold">
                Hi {bus?.regNo}
            </Text>

            <View className="mt-5">
                <Text className="text-4xl font-extrabold text-center">
                    {currentDateTime.toLocaleTimeString()}
                </Text>
                <Text className="text-xl font-extrabold text-center">
                    {getFormattedDate(currentDateTime)}
                </Text>
            </View>

            <View className="mt-5 gap-2">
                <View className="w-full flex flex-row items-center gap-4">
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/(passenger)/(pages)/liveLocation")}

                        >
                            <Ionicons name="location-sharp" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Live Location</Text>
                        </Pressable>
                    </View>
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/(operator)/(pages)/createSchedule")}
                        >
                            <Ionicons name="time-outline" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Bus Schedule</Text>
                        </Pressable>
                    </View>
                </View>
                <View className="w-full flex flex-row items-center gap-4">
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/(passenger)/(pages)/seatAvailability")}

                        >
                            <MaterialCommunityIcons name="seat-passenger" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Seat Reservation</Text>
                        </Pressable>
                    </View>
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/(passenger)/(pages)/onlinePayment")}

                        >
                            <Ionicons name="card" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Online Payments</Text>
                        </Pressable>
                    </View>
                </View>
                <View className="w-full flex flex-row items-center gap-4">
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/(passenger)/(pages)/lostnfound")}
                        >
                            <MaterialCommunityIcons name="briefcase-search" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Lost & Found</Text>
                        </Pressable>
                    </View>
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/(passenger)/(pages)/createFeedback")}
                        >
                            <MaterialIcons name="feedback" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Feedbacks</Text>
                        </Pressable>
                    </View>
                </View>
                <View className="w-full flex flex-row items-center gap-4">
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <Pressable
                            className="text-center m-auto gap-2"
                            onPress={() => router.push("/(passenger)/(pages)/createFeedback")}
                        >
                            <MaterialIcons name="attach-money" size={40} color="#78232A" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Expenses</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Home;