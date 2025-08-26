import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
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

    const fetchPayments = async (selectedFilter: string) => {
        try {
            const userId = await AsyncStorage.getItem("userId");
            if (!userId) return;

            const response = await paymentHistory(Number(userId), selectedFilter);
            setPayments(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPayments(filter);
    }, [user, filter]);

    return (
        <View className="mx-5 my-5">
            <Text className="text-2xl font-bold text-center my-3">
                My Payment History
            </Text>

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

            <View className="mt-5">
                {payments.length > 0 ? (
                    payments.map((item) => {
                        const paymentDate = new Date(item.date).toLocaleDateString();
                        const scheduleDate = new Date(item.schedule.date).toLocaleDateString();

                        return (
                            <View
                                key={item.id}
                                className="w-full bg-[#F7D8D4] rounded-3xl mb-3 p-4"
                            >
                                <View className="flex flex-row justify-end">
                                    <Text className="text-sm text-gray-600">{paymentDate}</Text>
                                </View>

                                <View className="flex flex-row justify-center mt-1">
                                    <Text className="text-lg font-bold text-red-950 text-center">
                                        {item.schedule.bus.route} - {item.schedule.bus.regNo}
                                    </Text>
                                </View>

                                <View className="flex flex-row justify-center mt-1">
                                    <Text className="text-base text-gray-700">
                                        {scheduleDate} | {item.schedule.scheduledTime}
                                    </Text>
                                </View>

                                <View className="flex flex-row justify-center mt-3">
                                    <Text className="text-lg font-bold">
                                        Rs. {item.amount}
                                    </Text>
                                </View>

                                <View className="flex flex-row justify-center mt-3">
                                    <Text
                                        className={`text-lg font-bold ${
                                            item.status === "SUCCESS"
                                                ? "text-green-700"
                                                : "text-red-700"
                                        }`}
                                    >
                                        {item.status}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <Text className="text-center text-lg text-gray-500">
                        No payments available
                    </Text>
                )}
            </View>
        </View>
    );
};

export default Payments;
