import {View, Text, Pressable, ScrollView} from 'react-native';
import DatePickerField from '@/components/datepicker';
import React, {useEffect, useState} from 'react';
import {getBusById} from "@/api/busAPI";
import {Ionicons} from "@expo/vector-icons";
import {addNewSchedule, getSchedulesByBusId} from "@/api/busScheduleAPI";
import TimePickerField from "@/components/timepicker";
import CustomButton from "@/components/customButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Bus, BusSchedule} from "@/types/type";

const CreateSchedule = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [schedule, setSchedule] = useState<BusSchedule[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [bus, setBus] = useState<Bus | null>(null);


    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem("userId");
            setUserId(storedUserId);
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchSchedules = async () => {
            try {
                const schedules = await getSchedulesByBusId(userId);
                setSchedule(schedules || []);
            } catch (error) {
                console.log("Error fetching schedules:", error);
            }
        };

        fetchSchedules();
    }, [userId]);

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


    const handleCreateSchedule = async () => {
        const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : 'No date';
        const formattedTime = selectedTime
            ? `${selectedTime.getHours()}:${selectedTime.getMinutes().toString().padStart(2, '0')}`
            : 'No time';

        const data: BusSchedule = {
            busId: bus!.id,
            date: formattedDate,
            scheduledTime: formattedTime,
            seatingCapacity: bus?.seatingCapacity || 0,
        };

        try {
            await addNewSchedule(data);
            if (userId) {
                const updatedSchedules = await getSchedulesByBusId(userId);
                setSchedule(updatedSchedules || []);
            }
        } catch (error) {
            console.log("Error creating schedule:", error);
        }
    };


    return (
        <View className="flex-1 bg-white">
            <View className="mx-5 my-2">
                <Text className="ml-3">Date</Text>
                <DatePickerField
                    date={selectedDate}
                    setDate={setSelectedDate}
                    placeholder="Pick your date"
                    mode="date"
                />
            </View>

            <View className="mx-5 my-2">
                <Text className="ml-3">Time</Text>
                <TimePickerField
                    time={selectedTime}
                    setTime={setSelectedTime}
                />
            </View>

            <View className="mx-5 my-2">
                <CustomButton
                    title="+ Add Schedule"
                    onPress={handleCreateSchedule}
                />
            </View>

            <ScrollView className="mx-5 mt-10 gap-3">
                {schedule.length > 0 ? (
                    schedule.map((item, index) => (
                        <View key={index} className="w-full h-40 bg-[#F7D8D4] rounded-3xl mb-3">
                            <Pressable className="flex flex-row w-full h-full p-4">
                                <View className="w-20 flex items-left justify-center mx-3">
                                    <Ionicons name="bus" size={30} color="#78232A" />
                                </View>

                                <View className="w-2/3 flex justify-center gap-4">
                                    <View className="flex flex-row justify-between mx-2">
                                        <Text className="text-lg font-bold text-red-950">{item.routeNo}</Text>
                                        <Text className="text-lg font-bold text-red-950">{item.route}</Text>
                                    </View>

                                    <View className="flex flex-row justify-center gap-8 mx-3">
                                        <Text className="text-lg font-bold text-red-950">{item.date.split('T')[0]}</Text>
                                        <Text className="text-lg font-bold text-red-950">{item.scheduledTime}</Text>
                                    </View>

                                    <View className="flex flex-row justify-center gap-8">
                                        <Text className="text-lg font-bold text-red-950">{item.seatingCapacity>0 ? 'Seats Available' : 'No Seats'}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    ))
                ) : (
                    <Text className="text-center text-lg text-gray-500">No schedules available</Text>
                )}

            </ScrollView>
        </View>
    );
};

export default CreateSchedule;
