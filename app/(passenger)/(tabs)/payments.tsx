import { View, Text, ActivityIndicator, FlatList } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DropdownMenu from "@/components/dropdown";
import { dateOptions } from "@/constants/api";
import { useAuthStore } from "@/store/authStore";
import { paymentHistory } from "@/api/paymentAPI";
import { PaymentData } from "@/types/type";

const Payments = () => {
    const { user } = useAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter, setFilter] = useState<string>("All");
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchPayments = async (selectedFilter: string, { showLoader = true } = {}) => {
        try {
            showLoader && setLoading(true);
            setError(null);
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) return;

            const response = await paymentHistory(Number(userId), selectedFilter);
            setPayments(response || []);
        } catch (e: any) {
            setError(e?.message || "Failed to load payments");
        } finally {
            showLoader && setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments(filter);
    }, [user, filter]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchPayments(filter, { showLoader: false });
        setRefreshing(false);
    }, [filter]);

    const renderStatusBadge = (status: string) => {
        const isSuccess = status === "succeeded";
        const badgeClasses = isSuccess
            ? "bg-green-700 text-white"
            : "bg-red-500 text-white";
        return (
            <View className={`px-3 py-1 rounded-full ${badgeClasses}`}>
                <Text className="text-xs font-semibold text-white">{status}</Text>
            </View>
        );
    };

    const renderItem = ({ item }: { item: PaymentData }) => {
        const paymentDate = new Date(item.date).toLocaleDateString();
        const scheduleDate = new Date(item.schedule.date).toLocaleDateString();
        return (
            <View className="w-full bg-red-200 rounded-2xl mb-4 p-4 shadow-sm border border-gray-100">
                <View className="flex flex-row justify-between items-center">
                    <Text className="text-sm text-gray-700">{paymentDate}</Text>
                    {renderStatusBadge(item.status)}
                </View>

                <View className="mt-2">
                    <Text className="text-lg font-bold text-gray-900">
                        {item.schedule.bus.route} • {item.schedule.bus.regNo}
                    </Text>
                    <Text className="text-sm text-gray-900 mt-1">
                        {scheduleDate} • {item.schedule.scheduledTime}
                    </Text>
                </View>

                <View className="mt-4 flex flex-row items-baseline justify-between">
                    <Text className="text-base text-gray-500">Amount</Text>
                    <Text className="text-2xl font-extrabold text-gray-900">Rs. {item.amount}</Text>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <View className="mx-5 mt-6">
                <Text className="text-2xl font-bold text-center mb-3">My Payment History</Text>

                <View className="mt-3">
                    <Text className="text-lg font-JakartaSemiBold mx-2 mb-3">Filter</Text>
                    <DropdownMenu
                        placeholder="All"
                        options={dateOptions}
                        selectedValue={filter}
                        onSelect={(value) => value && setFilter(value)}
                        zIndex={2000}
                        open={dropdownOpen}
                        setOpen={setDropdownOpen}
                    />
                </View>
            </View>

            <View className="mx-5 mt-5 flex-1">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text className="text-gray-500 mt-3">Loading payments...</Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-red-600 mb-3">{error}</Text>
                        <Text className="text-blue-600" onPress={() => fetchPayments(filter)}>
                            Tap to retry
                        </Text>
                    </View>
                ) : payments.length > 0 ? (
                    <FlatList
                        data={payments}
                        keyExtractor={(it) => String(it.id)}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-center text-lg text-gray-500">No payments available</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Payments;
