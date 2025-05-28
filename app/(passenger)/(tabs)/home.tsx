import {Pressable, Text, View} from "react-native";
import {getFormattedDate} from "@/util/formatDate";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {User} from "@/types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getUserById} from "@/api/userAPI";
import {router} from "expo-router";

const Home = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [user, setUser] = useState<User | null>(null);
    const userId = AsyncStorage.getItem("userId")

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
                    const user = await getUserById(await userId);
                    if (user) {
                        setUser(user);
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
                Hi {user?.name}
            </Text>

            <View className="mt-10">
                <Text className="text-4xl font-extrabold text-center">
                    {currentDateTime.toLocaleTimeString()}
                </Text>
                <Text className="text-xl font-extrabold text-center">
                    {getFormattedDate(currentDateTime)}
                </Text>
            </View>

            <View className="mt-10 gap-5">
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
                            onPress={() => router.push("/(passenger)/(pages)/viewSchedule")}
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
                            onPress={() => router.push("/(passenger)/(pages)/seatReservation")}

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
                            onPress={() => router.push("/(passenger)/(pages)/lostnfoundHome")}
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
            </View>
        </View>
    )
}

export default Home;