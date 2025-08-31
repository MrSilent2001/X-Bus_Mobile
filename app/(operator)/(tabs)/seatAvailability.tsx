import {View, Text, FlatList, ActivityIndicator} from "react-native";
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusDetails = async() =>{
            try {
                setLoading(true);
                setError(null);
                
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) {
                    setError("No userId found");
                    return;
                }

                const response = await getBusById(userId);
                if (response) {
                    setBus(response);
                    console.log("Bus details loaded:", response);
                } else {
                    setError("Failed to load bus details");
                }
            } catch (error) {
                console.error("Failed to fetch bus details:", error);
                setError("Failed to load bus details");
            } finally {
                setLoading(false);
            }
        }

        fetchBusDetails();
    }, []);

    useEffect(() => {
        if (!selectedDate || !bus?.route) return;
        
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Format the date properly
                const formattedDate = selectedDate.toISOString().split('T')[0];
                console.log("Fetching schedules for date:", formattedDate, "route:", bus.route);
                
                const schedules = await getDailyRouteSchedules(formattedDate, bus.route);
                console.log("Schedules response:", schedules);
                
                if (schedules && schedules.length > 0) {
                    const formattedSchedules = schedules.map((schedule: any) => ({
                        label: schedule.scheduledTime,
                        value: schedule.id.toString(),
                    }));
                    setSchedules(formattedSchedules);
                    console.log("Formatted schedules:", formattedSchedules);
                } else {
                    setSchedules([]);
                    console.log("No schedules found for this date and route");
                }
            } catch (error) {
                console.error("Error fetching schedules:", error);
                setError("Failed to load schedules");
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [selectedDate, bus?.route]);

    useEffect(() => {
        if (!selectedDate || !selectedSchedule) return;

        const formattedDate = selectedDate.toISOString().split('T')[0];

        const fetchOccupiedSeats = async() =>{
            try {
                console.log("Fetching occupied seats for date:", formattedDate, "schedule:", selectedSchedule);
                const response = await getReservedSeats(formattedDate, selectedSchedule);
                console.log("Occupied seats response:", response);
                
                if (response && Array.isArray(response)) {
                    setOccupiedSeats(response.map((res: { seatNo: number; }) => res.seatNo));
                    setOccupiedSeatCount(response.length);
                } else {
                    setOccupiedSeats([]);
                    setOccupiedSeatCount(0);
                }
            } catch (error) {
                console.error("Error fetching occupied seats:", error);
                setOccupiedSeats([]);
                setOccupiedSeatCount(0);
            }
        }

        fetchOccupiedSeats();
    }, [selectedDate, selectedSchedule]);

    const renderContent = () => {
        return (
            <View className="flex-1 bg-gray-50">
                {/* Header */}
                <View className="bg-white pt-12 pb-6 px-6 shadow-sm">
                    <Text className="text-2xl text-center font-bold text-gray-800">Seat Availability</Text>
                    {bus?.regNo && (
                        <Text className="text-center text-gray-600 mt-1">Bus: {bus.regNo}</Text>
                    )}
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
                                {loading ? (
                                    <View className="items-center py-4">
                                        <ActivityIndicator size="small" color="#dc2626" />
                                        <Text className="text-gray-500 mt-2">Loading schedules...</Text>
                                    </View>
                                ) : schedules.length > 0 ? (
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
                                ) : (
                                    <View className="bg-gray-100 p-4 rounded-lg">
                                        <Text className="text-gray-600 text-center">
                                            No schedules available for this date
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {error && (
                            <View className="mt-4 bg-red-50 p-3 rounded-lg">
                                <Text className="text-red-600 text-center">{error}</Text>
                            </View>
                        )}
                    </View>

                    {/* Seat Map Section */}
                    {selectedSchedule && (
                        <View className="bg-white rounded-2xl p-6 shadow-sm">
                            <Text className="text-xl font-bold text-gray-800 mb-4">Seat Allocation</Text>

                            <SeatMap
                                seatCount={bus?.seatingCapacity || 50}
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
                                    <Text className="text-2xl font-bold text-green-700">
                                        {(bus?.seatingCapacity || 50) - occupiedSeatCount}
                                    </Text>
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