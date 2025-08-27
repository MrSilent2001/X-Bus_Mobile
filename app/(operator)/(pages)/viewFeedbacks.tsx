import {Text, View, FlatList, RefreshControl, ActivityIndicator} from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import {Bus, Feedback, FeedbackResponse} from "@/types/type";
import DropdownMenu from "@/components/dropdown";
import {getBusById} from "@/api/busAPI";
import {getAllFeedbacks} from "@/api/feedbackAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {dateOptions} from "@/constants/api";
import {Feather} from "@expo/vector-icons";

const ViewFeedback = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);
    const [bus, setBus] = useState<Bus | null>(null);
    const [feedback, setFeedback] = useState<FeedbackResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBus = async () => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            const response = await getBusById(userId);
            setBus(response);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchFeedback = async (showLoader = true) => {
        try {
            showLoader && setLoading(true);
            setError(null);
            if (bus?.regNo) {
                const response = await getAllFeedbacks(bus.regNo, filter);
                setFeedback(response || []);
            }
        } catch (error) {
            setError("Failed to load feedback");
            console.log(error);
        } finally {
            showLoader && setLoading(false);
        }
    };

    useEffect(() => {
        fetchBus();
    }, []);

    useEffect(() => {
        fetchFeedback();
    }, [filter, bus]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchFeedback(false);
        setRefreshing(false);
    }, [filter, bus]);

    const renderFeedbackItem = ({ item, index }: { item: FeedbackResponse; index: number }) => {
        const feedbackDate = item.createdAt.split('T')[0];
        const feedbackTime = item.time.substring(0, 5);
        
        return (
            <View className="w-full bg-red-200 rounded-2xl mb-4 p-6 shadow-sm border border-red-100">
                {/* Header with Date and Time */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="bg-red-100 px-3 py-2 rounded-lg">
                        <Text className="text-sm font-semibold text-red-700">{feedbackDate}</Text>
                    </View>
                    <View className="bg-blue-100 px-3 py-2 rounded-lg">
                        <Text className="text-sm font-semibold text-blue-700">{feedbackTime}</Text>
                    </View>
                </View>

                {/* Feedback Message */}
                <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-2">Feedback Message</Text>
                    <Text className="text-lg font-semibold text-gray-900 leading-6">
                        {item.message}
                    </Text>
                </View>

                {/* Passenger Information */}
                <View className="bg-white rounded-xl p-4 border border-red-200">
                    <View className="flex-row items-center">
                        <View className="bg-red-100 p-2 rounded-lg mr-3">
                            <Feather name="user" size={16} color="#dc2626" />
                        </View>
                        <Text className="text-base font-semibold text-gray-900">
                            {item.passengerName}
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
                <Text className="text-2xl font-bold text-center text-gray-800 mb-2">Feedback & Complaints</Text>
                <Text className="text-gray-500 text-center">View passenger feedback for your bus</Text>
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
                        selectedValue={filter}
                        onSelect={(value) => setFilter(value)}
                        zIndex={2000}
                        highZIndex={true}
                        open={dropdownOpen}
                        setOpen={setDropdownOpen}
                    />
                </View>
            </View>

            {/* Feedback List Section */}
            <View className="mx-5 mt-4 flex-1">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#dc2626" />
                        <Text className="text-gray-500 mt-3">Loading feedback...</Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-red-600 mb-3 text-center">{error}</Text>
                        <Text 
                            className="text-blue-600 font-medium" 
                            onPress={() => fetchFeedback()}
                        >
                            Tap to retry
                        </Text>
                    </View>
                ) : feedback.length > 0 ? (
                    <FlatList
                        data={feedback}
                        keyExtractor={(item, index) => `feedback-${index}`}
                        renderItem={renderFeedbackItem}
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
                            <Feather name="message-circle" size={48} color="#9ca3af" />
                        </View>
                        <Text className="text-center text-lg text-gray-500 mb-2">
                            No feedback available
                        </Text>
                        <Text className="text-center text-sm text-gray-400">
                            {filter ? `Try adjusting your date filter` : `Feedback will appear here when passengers submit`}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default ViewFeedback;