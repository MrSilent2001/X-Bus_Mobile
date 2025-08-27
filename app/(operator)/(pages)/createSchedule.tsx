import {View, Text, Pressable, ScrollView, Alert} from 'react-native';
import DatePickerField from '@/components/datepicker';
import React, {useEffect, useState} from 'react';
import {getBusById} from "@/api/busAPI";
import {Ionicons, Feather} from "@expo/vector-icons";
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
    const [loading, setLoading] = useState(false);

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
        if (!selectedDate || !selectedTime) {
            Alert.alert("Missing Information", "Please select both date and time");
            return;
        }

        setLoading(true);
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
            Alert.alert("Success", "Schedule created successfully!");
            setSelectedDate(null);
            setSelectedTime(null);
        } catch (error) {
            Alert.alert("Error", "Failed to create schedule");
            console.log("Error creating schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View className="bg-white pt-12 pb-8 px-6 shadow-sm">
                <Text className="text-3xl font-bold text-center text-gray-800 mb-2">Create Schedule</Text>
                <Text className="text-gray-500 text-center">Add new bus schedules for your route</Text>
            </View>

            {/* Form Section */}
            <View className="mx-5 mt-6">
                <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <Text className="text-xl font-semibold text-gray-800 mb-4">Schedule Details</Text>
                    
                    <View className="mb-4">
                        <Text className="text-gray-700 font-medium mb-2">Date</Text>
                        <DatePickerField
                            date={selectedDate}
                            setDate={setSelectedDate}
                            placeholder="Pick your date"
                            mode="date"
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">Time</Text>
                        <TimePickerField
                            time={selectedTime}
                            setTime={setSelectedTime}
                        />
                    </View>

                    <CustomButton
                        title="+ Add Schedule"
                        onPress={handleCreateSchedule}
                        disabled={!selectedDate || !selectedTime || loading}
                        loading={loading}
                        bgVariant="success"
                    />
                </View>

                {/* Schedules List Section */}
                <View className="bg-white rounded-2xl p-6 shadow-sm">
                    <View className="flex-row items-center mb-4">
                        <View className="bg-red-100 p-2 rounded-lg mr-3">
                            <Feather name="calendar" size={20} color="#dc2626" />
                        </View>
                        <Text className="text-xl font-semibold text-gray-800">Your Schedules</Text>
                    </View>

                    {schedule.length > 0 ? (
                        schedule.map((item, index) => (
                            <View key={index} className="w-full bg-red-200 rounded-2xl mb-4 p-5 shadow-sm border border-red-100">
                                <View className="flex-row items-center mb-3">
                                    <View className="bg-red-100 p-3 rounded-full mr-3">
                                        <Ionicons name="bus" size={24} color="#dc2626" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-red-800">
                                            Route {item.routeNo}
                                        </Text>
                                        <Text className="text-sm text-red-700">{item.route}</Text>
                                    </View>
                                </View>

                                <View className="flex-row justify-between items-center mb-3">
                                    <View className="bg-white px-3 py-2 rounded-lg">
                                        <Text className="text-sm text-gray-600">Date</Text>
                                        <Text className="text-base font-semibold text-gray-900">
                                            {item.date.split('T')[0]}
                                        </Text>
                                    </View>
                                    <View className="bg-white px-3 py-2 rounded-lg">
                                        <Text className="text-sm text-gray-600">Time</Text>
                                        <Text className="text-base font-semibold text-gray-900">
                                            {item.scheduledTime}
                                        </Text>
                                    </View>
                                </View>

                                <View className="bg-white px-3 py-2 rounded-lg">
                                    <Text className="text-sm text-gray-600">Status</Text>
                                    <Text className={`text-base font-semibold ${
                                        item.seatingCapacity > 0 ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                        {item.seatingCapacity > 0 ? 'Seats Available' : 'No Seats'}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="items-center py-8">
                            <View className="bg-gray-100 p-4 rounded-full mb-3">
                                <Feather name="calendar" size={32} color="#9ca3af" />
                            </View>
                            <Text className="text-center text-lg text-gray-500 mb-2">No schedules available</Text>
                            <Text className="text-center text-sm text-gray-400">Create your first schedule above</Text>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default CreateSchedule;
