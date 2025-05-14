import {View, Text, Pressable} from 'react-native';
import DatePickerField from '@/components/datepicker';
import React, {useEffect, useState} from 'react';
import DropdownMenu from '@/components/dropdown';
import {getBusRoutes} from "@/api/busAPI";
import {Ionicons} from "@expo/vector-icons";
import {getAllBusSchedules} from "@/api/busScheduleAPI";

interface BusSchedule {
    id: number;
    date: string;
    scheduledTime: string;
    regNo: string;
    seatingCapacity: number;
    route: string;
    routeNo: string;
}
const ViewSchedule = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
    const [schedule, setSchedule] = useState<BusSchedule[]>([]);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const routes = await getBusRoutes();
                if (routes && routes.length > 0) {
                    const formattedRoutes = routes.map((route: string) => ({
                        label: route,
                        value: route,
                    }));
                    setOptions(formattedRoutes);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchRoutes();
    }, []);

    useEffect(() => {
        if (!selectedDate && !selectedRoute) return;

        const fetchSchedules = async () => {
            try {
                const dateParam = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
                const routeParam = selectedRoute || '';

                const schedules = await getAllBusSchedules(dateParam, routeParam);
                setSchedule(schedules || []);
            } catch (error) {
                console.log("Error fetching schedules:", error);
            }
        };

        fetchSchedules();
    }, [selectedDate, selectedRoute]);


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

            <View className="mx-5 my-2" style={{ zIndex: 2000 }}>
                <Text className="ml-3 my-2">Route</Text>
                <DropdownMenu
                    placeholder="Select a route"
                    options={options}
                    selectedValue={selectedRoute}
                    onSelect={(value) => setSelectedRoute(value)}
                    zIndex={2000}
                    open={dropdownOpen}
                    setOpen={setDropdownOpen}
                />
            </View>

            <View className="mx-5 mt-10 gap-3">
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

                                    <View className="flex flex-row justify-evenly gap-8">
                                        <Text className="text-lg font-bold text-red-950">{item.scheduledTime}</Text>
                                        <Text className="text-lg font-bold text-red-950">{item.regNo}</Text>
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

            </View>
        </View>
    );
};

export default ViewSchedule;
