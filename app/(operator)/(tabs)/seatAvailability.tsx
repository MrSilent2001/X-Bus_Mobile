import {View, Text, FlatList} from "react-native";
import React, {useEffect, useState} from "react";
import {getBusById, getBusRoutes} from "@/api/busAPI";
import {getDailyRouteSchedules} from "@/api/busScheduleAPI";
import {getReservedSeats} from "@/api/reservationAPI";
import DatePickerField from "@/components/datepicker";
import DropdownMenu from "@/components/dropdown";
import {SeatMap} from "@/components/seatMap";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SeatAvailability = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
    const [dropdownOpenTime, setDropdownOpenTime] = useState(false);
    const [schedules, setSchedules] = useState<{ label: string; value: string }[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
    const [occupiedSeatCount, setOccupiedSeatCount] = useState(0);
    const [bus, setBus] = useState<any>(null);

    useEffect(() => {
        const fetchBusDetails = async() =>{
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) {
                    console.log("No userId found");
                    return;
                }

                const response = await getBusById(userId);
                setBus(response);
            } catch (error) {
                console.error("Failed to fetch bus details:", error);
            }
        }

        fetchBusDetails();
    }, []);


    useEffect(() => {
        if (!selectedDate) return;
        const fetchSchedules = async () => {
            try {
                const schedules = await getDailyRouteSchedules(selectedDate, bus.route);
                if (schedules && schedules.length > 0) {
                    const formattedSchedules = schedules.map((schedule: any) => ({
                        label: schedule.scheduledTime,
                        value: schedule.id.toString(),
                    }));
                    setSchedules(formattedSchedules);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchSchedules();
    }, [selectedDate]);


    useEffect(() => {
        if (!selectedDate ||!selectedSchedule) return;

        const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : 'No date';

        const fetchOccupiedSeats = async() =>{
            try {
                const response = await getReservedSeats(formattedDate,selectedSchedule);
                setOccupiedSeats(response.map((res: { seatNo: number; }) => res.seatNo));
                setOccupiedSeatCount(response.length);
            }catch (error){
                console.log(error)
            }
        }

        fetchOccupiedSeats();
    }, [selectedDate,selectedSchedule]);

    const renderContent = () => {
        return (
            <View className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white pt-12 pb-6 px-6 shadow-sm">
                    <Text className="text-2xl text-center font-bold text-gray-800">Seat Availability</Text>
                </View>

                {/* Form Section */}
                <View className="mx-5 mt-6">
                    <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
                        <Text className="text-lg font-semibold text-gray-800 mb-3">Select Date & Time</Text>
                        
                        <View className="mb-4">
                            <Text className="text-gray-700 font-medium mb-2">Date</Text>
                            <DatePickerField
                                date={selectedDate}
                                setDate={setSelectedDate}
                                placeholder="Pick your date"
                                mode="date"
                            />
                        </View>

                        {selectedDate && (
                            <View style={{ zIndex: 9999 }}>
                                <Text className="text-gray-700 font-medium mb-2">Time</Text>
                                <DropdownMenu
                                    placeholder="Select the time"
                                    options={schedules}
                                    selectedValue={selectedSchedule}
                                    onSelect={(value) => setSelectedSchedule(value)}
                                    zIndex={9999}
                                    highZIndex={true}
                                    open={dropdownOpenTime}
                                    setOpen={setDropdownOpenTime}
                                />
                            </View>
                        )}
                    </View>

                    {/* Seat Map Section */}
                    {selectedSchedule && (
                        <View className="bg-white rounded-2xl p-6 shadow-sm">
                            <Text className="text-xl font-bold text-gray-800 mb-4">Seat Allocation</Text>

                            <SeatMap
                                seatCount={50}
                                occupiedSeats={occupiedSeats}
                                editable={false}
                            />

                            <View className="flex-row justify-around items-center mt-6 p-4 bg-gray-50 rounded-xl">
                                <View className="items-center">
                                    <Text className="text-lg font-semibold text-red-600">Total Occupied</Text>
                                    <Text className="text-2xl font-bold text-red-700">{occupiedSeatCount}</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-semibold text-green-600">Total Remaining</Text>
                                    <Text className="text-2xl font-bold text-green-700">{bus?.seatingCapacity - occupiedSeatCount}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <FlatList
            data={[{ key: 'content' }]}
            renderItem={() => renderContent()}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
        />
    );
}

export default SeatAvailability;