import {Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {Bus, Feedback, FeedbackResponse} from "@/types/type";
import DropdownMenu from "@/components/dropdown";
import {getBusById} from "@/api/busAPI";
import {getAllFeedbacks} from "@/api/feedbackAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {dateOptions} from "@/constants/api";

const ViewFeedback = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);
    const [bus, setBus] = useState<Bus | null>(null);
    const [feedback, setFeedback] = useState<FeedbackResponse[]>([]);

    useEffect(() => {
        const fetchBus = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                const response = await getBusById(userId);
                setBus(response);

            } catch (error) {
                console.log(error);
            }
        };

        fetchBus();
    }, [filter]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                if (bus?.regNo) {
                    const response = await getAllFeedbacks(bus.regNo, filter);
                    setFeedback(response);
                }

            } catch (error) {
                console.log(error);
            }
        };

        fetchFeedback();
    }, [filter]);

    return(
        <View className="mx-5 my-5">
            <Text className="text-2xl font-bold text-center my-3">Feedback / Complaints</Text>

            <View className="mt-3">
                <Text className="text-lg font-JakartaSemiBold mx-2 mb-3">Filter</Text>
                <DropdownMenu
                    placeholder="All"
                    options={dateOptions}
                    selectedValue={filter}
                    onSelect={(value) => setFilter(value)}
                    zIndex={2000}
                    open={dropdownOpen}
                    setOpen={setDropdownOpen}
                />
            </View>

            <View className="mt-5">
                {feedback.length > 0 ? (
                    feedback.map((item, index) => (
                        <View key={index} className="w-full h-40 bg-[#F7D8D4] rounded-3xl mb-3">
                            <View className="flex flex-row w-full h-full p-4">
                                <View className="w-full flex justify-center">
                                    <View className="flex flex-row justify-between mx-2">
                                        <Text className="text-lg font-bold text-red-950">{item.createdAt}</Text>
                                        <Text className="text-lg font-bold text-red-950">{item.time.substring(0, 5)}</Text>
                                    </View>

                                    <View className="flex flex-row justify-evenly">
                                        <Text className="text-lg font-bold text-red-950">{item.message}</Text>
                                    </View>

                                    <View className="flex flex-row justify-center">
                                        <Text className="text-lg font-bold text-red-950">{item.passengerName}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text className="text-center text-lg text-gray-500">No schedules available</Text>
                )}
            </View>
        </View>
    );
}

export default ViewFeedback;