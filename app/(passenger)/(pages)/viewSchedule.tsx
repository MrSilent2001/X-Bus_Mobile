import {View, Text, Pressable, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import DatePickerField from '@/components/datepicker';
import React, {useEffect, useState, useCallback} from 'react';
import DropdownMenu from '@/components/dropdown';
import {getBusRoutes} from "@/api/busAPI";
import {Ionicons, Feather} from "@expo/vector-icons";
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

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

    const fetchSchedules = async (showLoader = true) => {
        if (!selectedDate && !selectedRoute) return;

        try {
            showLoader && setLoading(true);
            setError(null);
            const dateParam = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
            const routeParam = selectedRoute || '';

            const schedules = await getAllBusSchedules(dateParam, routeParam);
            setSchedule(schedules || []);
        } catch (error) {
            setError("Failed to load schedules");
            console.log("Error fetching schedules:", error);
        } finally {
            showLoader && setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [selectedDate, selectedRoute]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchSchedules(false);
        setRefreshing(false);
    }, [selectedDate, selectedRoute]);

    const renderScheduleItem = ({ item, index }: { item: BusSchedule; index: number }) => {
        const scheduleDate = item.date.split('T')[0];
        
        return (
            <View className="w-full bg-red-200 rounded-2xl mb-4 p-6 shadow-sm border border-red-100">
                {/* Header with Route Info */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="bg-red-100 px-3 py-2 rounded-lg">
                        <Text className="text-sm font-semibold text-red-700">Route {item.routeNo}</Text>
                    </View>
                    <View className="bg-blue-100 px-3 py-2 rounded-lg">
                        <Text className="text-sm font-semibold text-blue-700">{item.scheduledTime}</Text>
                    </View>
                </View>

                {/* Route Details */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Route</Text>
                    <Text className="text-lg font-semibold text-gray-900 leading-6">
                        {item.route}
                    </Text>
                </View>

                {/* Bus Information */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="bg-white px-3 py-2 rounded-lg border border-red-200">
                        <Text className="text-sm text-gray-600">Bus Number</Text>
                        <Text className="text-base font-semibold text-gray-900">{item.regNo}</Text>
                    </View>
                    <View className="bg-white px-3 py-2 rounded-lg border border-red-200">
                        <Text className="text-sm text-gray-600">Date</Text>
                        <Text className="text-base font-semibold text-gray-900">{scheduleDate}</Text>
                    </View>
                </View>

                {/* Seat Availability */}
                <View className="bg-white rounded-xl p-4 border border-red-200">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="bg-red-100 p-2 rounded-lg mr-3">
                                <Ionicons name="bus" size={20} color="#dc2626" />
                            </View>
                            <Text className="text-base font-semibold text-gray-900">
                                {item.seatingCapacity > 0 ? 'Seats Available' : 'No Seats'}
                            </Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${
                            item.seatingCapacity > 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                            <Text className={`text-sm font-semibold ${
                                item.seatingCapacity > 0 ? 'text-green-700' : 'text-red-700'
                            }`}>
                                {item.seatingCapacity > 0 ? `${item.seatingCapacity} seats` : 'Full'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header Section */}
            <View className="bg-white pt-12 pb-6 px-6 shadow-sm">
                <Text className="text-2xl font-bold text-center text-gray-800 mb-2">Bus Schedules</Text>
                <Text className="text-gray-500 text-center">Find available bus schedules for your route</Text>
            </View>

            {/* Filter Section */}
            <View className="mx-5 mt-6">
                <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
                    <View className="flex-row items-center mb-4">
                        <View className="bg-red-100 p-2 rounded-lg mr-3">
                            <Feather name="search" size={20} color="#dc2626" />
                        </View>
                        <Text className="text-xl font-semibold text-gray-800">Search Schedules</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-700 font-medium mb-2">Date</Text>
                        <DatePickerField
                            date={selectedDate}
                            setDate={setSelectedDate}
                            placeholder="Pick your date"
                            mode="date"
                        />
                    </View>

                    <View style={{ zIndex: 2000 }}>
                        <Text className="text-gray-700 font-medium mb-2">Route</Text>
                        <DropdownMenu
                            placeholder="Select a route"
                            options={options}
                            selectedValue={selectedRoute}
                            onSelect={(value) => setSelectedRoute(value)}
                            zIndex={2000}
                            highZIndex={true}
                            open={dropdownOpen}
                            setOpen={setDropdownOpen}
                        />
                    </View>
                </View>
            </View>

            {/* Schedules List Section */}
            <View className="mx-5 mt-4 flex-1">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#dc2626" />
                        <Text className="text-gray-500 mt-3">Loading schedules...</Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-red-600 mb-3 text-center">{error}</Text>
                        <Text 
                            className="text-blue-600 font-medium" 
                            onPress={() => fetchSchedules()}
                        >
                            Tap to retry
                        </Text>
                    </View>
                ) : schedule.length > 0 ? (
                    <FlatList
                        data={schedule}
                        keyExtractor={(item, index) => `schedule-${index}`}
                        renderItem={renderScheduleItem}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#dc2626']}
                                tintColor="#dc2626"
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <View className="bg-gray-100 p-6 rounded-full mb-4">
                            <Feather name="calendar" size={48} color="#9ca3af" />
                        </View>
                        <Text className="text-center text-lg text-gray-500 mb-2">
                            No schedules available
                        </Text>
                        <Text className="text-center text-sm text-gray-400">
                            {selectedDate || selectedRoute ? `Try adjusting your filters` : `Select a date and route to view schedules`}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default ViewSchedule;
