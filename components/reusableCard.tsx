import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface Bus {
    fleetName: string;
    regNo: string;
    route: string;
}

interface ReservationItem {
    reservationDate: string;
    scheduledTime: string;
    bus: Bus;
}

interface CardProps {
    item: ReservationItem;
    onPress?: () => void;
}

const ReusableCard: React.FC<CardProps> = ({ item, onPress }) => {
    return (
        <View className="w-full h-40 bg-[#F7D8D4] rounded-3xl mb-3">
            <Pressable
                className="flex flex-row w-full h-full p-4"
                onPress={onPress}
            >
                <View className="w-20 flex items-left justify-center mx-3">
                    <Ionicons name="bus" size={30} color="#78232A" />
                </View>

                <View className="w-2/3 flex justify-center gap-4">
                    <View className="flex flex-row justify-between mx-2">
                        <Text className="text-lg font-bold text-red-950">
                            {item.bus.fleetName}
                        </Text>
                        <Text className="text-lg font-bold text-red-950">
                            {item.bus.regNo}
                        </Text>
                    </View>

                    <View className="flex flex-row justify-evenly gap-8">
                        <Text className="text-lg font-bold text-red-950">
                            {item.reservationDate}
                        </Text>
                        <Text className="text-lg font-bold text-red-950">
                            {item.scheduledTime}
                        </Text>
                    </View>

                    <View className="flex flex-row justify-center gap-8">
                        <Text className="text-lg font-bold text-red-950">
                            {item.bus.route}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

export default ReusableCard;
