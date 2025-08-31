import {Text, View, FlatList, RefreshControl, ActivityIndicator} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import DropdownMenu from "@/components/dropdown";
import {getAllFoundItems } from "@/api/lostnfoundAPI";
import {dateOptions} from "@/constants/api";
import {Feather} from "@expo/vector-icons";

const FoundItems = () => {
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [foundItems, setFoundItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFoundItems = async (showLoader = true) => {
        try {
            showLoader && setLoading(true);
            setError(null);
            const response = await getAllFoundItems(dateFilter);
            setFoundItems(response || []);
        } catch (error) {
            setError("Failed to load found items");
            console.log(error);
        } finally {
            showLoader && setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoundItems();
    }, [dateFilter]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchFoundItems(false);
        setRefreshing(false);
    }, [dateFilter]);

    const renderFoundItem = ({ item, index }: { item: any; index: number }) => {
        const itemDate = item.date.split('T')[0];
        const itemTime = item.time.substring(0, 5);
        
        return (
            <View className="w-full bg-red-200 rounded-2xl mb-4 p-6 shadow-sm border border-red-100 min-h-[200px]">
                {/* Header with Date and Time */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="bg-red-100 px-3 py-2 rounded-lg">
                        <Text className="text-sm font-semibold text-red-700">{itemDate}</Text>
                    </View>
                    <View className="bg-blue-100 px-3 py-2 rounded-lg">
                        <Text className="text-sm font-semibold text-blue-700">{itemTime}</Text>
                    </View>
                </View>

                {/* Item Description */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Item Description</Text>
                    <Text className="text-lg font-semibold text-gray-900 leading-6">
                        {item.description}
                    </Text>
                </View>

                {/* Contact Information */}
                <View className="bg-white rounded-xl p-4 border border-red-200">
                    <View className="flex-row items-center mb-2">
                        <View className="bg-red-100 p-2 rounded-lg mr-3">
                            <Feather name="user" size={16} color="#dc2626" />
                        </View>
                        <Text className="text-base font-semibold text-gray-900">
                            {item.userName}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <View className="bg-blue-100 p-2 rounded-lg mr-3">
                            <Feather name="phone" size={16} color="#2563eb" />
                        </View>
                        <Text className="text-base font-semibold text-gray-900">
                            {item.contactNo}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header Section */}
            <View className="bg-white pt-12 pb-6 px-6 shadow-sm">
                <Text className="text-2xl font-bold text-center text-gray-800 mb-2">Found Items</Text>
                <Text className="text-gray-500 text-center">View all reported found items</Text>
            </View>

            {/* Filter Section */}
            <View className="mx-5 mt-6">
                <View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
                    <View className="flex-row items-center mb-4">
                        <View className="bg-red-100 p-2 rounded-lg mr-3">
                            <Feather name="filter" size={20} color="#dc2626" />
                        </View>
                        <Text className="text-xl font-semibold text-gray-800">Filter by Date</Text>
                    </View>
                    
                    <DropdownMenu
                        placeholder="All Dates"
                        options={dateOptions}
                        selectedValue={dateFilter}
                        onSelect={(value) => setDateFilter(value)}
                        zIndex={2000}
                        highZIndex={true}
                        open={dateDropdownOpen}
                        setOpen={setDateDropdownOpen}
                    />
                </View>
            </View>

            {/* Found Items List Section */}
            <View className="mx-5 mt-4 flex-1">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#dc2626" />
                        <Text className="text-gray-500 mt-3">Loading found items...</Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-red-600 mb-3 text-center">{error}</Text>
                        <Text 
                            className="text-blue-600 font-medium" 
                            onPress={() => fetchFoundItems()}
                        >
                            Tap to retry
                        </Text>
                    </View>
                ) : foundItems.length > 0 ? (
                    <FlatList
                        data={foundItems}
                        keyExtractor={(item, index) => `found-item-${index}`}
                        renderItem={renderFoundItem}
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
                            <Feather name="search" size={48} color="#9ca3af" />
                        </View>
                        <Text className="text-center text-lg text-gray-500 mb-2">
                            No found items available
                        </Text>
                        <Text className="text-center text-sm text-gray-400">
                            {dateFilter ? `Try adjusting your date filter` : `Found items will appear here when reported`}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default FoundItems;