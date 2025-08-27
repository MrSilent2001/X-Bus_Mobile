import {Text, View, ActivityIndicator, FlatList, RefreshControl} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import DropdownMenu from "@/components/dropdown";
import {getAllLostItems} from "@/api/lostnfoundAPI";
import {dateOptions} from "@/constants/api";

const LostItems = () => {
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [lostItems, setLostItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLostItems = async (showLoader = true) => {
        try {
            showLoader && setLoading(true);
            setError(null);
            const response = await getAllLostItems(dateFilter);
            setLostItems(response || []);
        } catch (err: any) {
            setError(err?.message || "Failed to load lost items");
        } finally {
            showLoader && setLoading(false);
        }
    };

    useEffect(() => {
        fetchLostItems();
    }, [dateFilter]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchLostItems(false);
        setRefreshing(false);
    }, [dateFilter]);

    const renderItem = ({ item, index }: { item: any; index: number }) => {
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

                {/* Description */}
                <View className="mb-4 flex-1">
                    <Text className="text-sm text-gray-600 mb-2">Description</Text>
                    <Text className="text-lg font-semibold text-gray-900 leading-6">
                        {item.description}
                    </Text>
                </View>

                {/* Contact Information */}
                <View className="bg-white rounded-xl p-4 border border-red-200">
                    <Text className="text-sm text-gray-600 mb-2 text-center">If found, please contact</Text>
                    <View className="flex-row justify-center items-center space-x-2">
                        <Text className="text-base font-bold text-gray-900">
                            {item.userName}
                        </Text>
                        <Text className="text-gray-500">•</Text>
                        <Text className="text-base font-semibold text-blue-600">
                            {item.contactNo}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="mx-5 mt-6">
                <Text className="text-2xl font-bold text-center mb-3">Lost Items</Text>

                <View style={{ position: 'relative', zIndex: 2000 }} className="my-5">
                    <Text className="text-lg font-JakartaSemiBold mx-2 mb-3">Filter by Date</Text>
                    <DropdownMenu
                        placeholder="All Dates"
                        options={dateOptions}
                        selectedValue={dateFilter}
                        onSelect={(value) => setDateFilter(value)}
                        zIndex={2000}
                        open={dateDropdownOpen}
                        setOpen={setDateDropdownOpen}
                    />
                </View>
            </View>

            <View className="mx-5 mt-5 flex-1">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#dc2626" />
                        <Text className="text-gray-500 mt-3">Loading lost items...</Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-red-600 mb-3 text-center">{error}</Text>
                        <Text 
                            className="text-blue-600 font-medium" 
                            onPress={() => fetchLostItems()}
                        >
                            Tap to retry
                        </Text>
                    </View>
                ) : lostItems.length > 0 ? (
                    <FlatList
                        data={lostItems}
                        keyExtractor={(item, index) => `lost-item-${index}`}
                        renderItem={renderItem}
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
                        <Text className="text-center text-lg text-gray-500 mb-2">
                            No lost items found
                        </Text>
                        <Text className="text-center text-sm text-gray-400">
                            {dateFilter ? `Try adjusting your date filter` : `Items will appear here when reported`}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default LostItems;