import CustomButton from "@/components/customButton";
import {Text, View} from "react-native";
import {router} from "expo-router";
import {useAuthStore} from "@/store/authStore";
import {useEffect, useState} from "react";
import {getFormattedDate} from "@/util/formatDate";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Home = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(()=>{
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);


    const onSignInPress = () =>{
        router.push("/login")
    }

    const {user} = useAuthStore();

    return(
        <View className="m-5 bg-white">
            <Text className="text-xl font-bold">
                Hi {user}
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
                        <View className="text-center m-auto gap-2">
                            <Ionicons name="location-sharp" size={40} color="red" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Live Location</Text>
                        </View>
                    </View>
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <View className="text-center m-auto gap-2">
                            <Ionicons name="time-outline" size={40} color="red" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Bus Schedule</Text>
                        </View>
                    </View>
                </View>
                <View className="w-full flex flex-row items-center gap-4">
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <View className="text-center m-auto gap-2">
                            <MaterialCommunityIcons name="seat-passenger" size={40} color="red" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Seat Reservation</Text>
                        </View>
                    </View>
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <View className="text-center m-auto gap-2">
                            <Ionicons name="card" size={40} color="red" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Online Payments</Text>
                        </View>
                    </View>
                </View>
                <View className="w-full flex flex-row items-center gap-4">
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <View className="text-center m-auto gap-2">
                            <MaterialCommunityIcons name="briefcase-search" size={40} color="red" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Lost & Found</Text>
                        </View>
                    </View>
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <View className="text-center m-auto gap-2">
                            <MaterialIcons name="feedback" size={40} color="red" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Feedbacks</Text>
                        </View>
                    </View>
                </View>
                <View className="w-full flex flex-row items-center gap-4">
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <View className="text-center m-auto gap-2">
                            <MaterialIcons name="attach-money" size={40} color="red" className="text-center m-auto"/>
                            <Text className="text-lg font-bold text-center text-red-950">Expenses</Text>
                        </View>
                    </View>
                    <View className="w-52 h-40 bg-[#F7D8D4] rounded-3xl">
                        <Text className="text-center m-auto">2</Text>
                    </View>
                </View>
            </View>

            {/*<CustomButton*/}
            {/*    title="Sign In"*/}
            {/*    onPress={onSignInPress}*/}
            {/*/>*/}
        </View>
    )
}

export default Home;