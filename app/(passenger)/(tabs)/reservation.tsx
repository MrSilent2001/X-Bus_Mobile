import {View, Text, FlatList, ActivityIndicator, Dimensions} from "react-native";
import React, {useEffect, useState} from "react";
import {getReservationsByUserId} from "@/api/reservationAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReusableCard from "@/components/reusableCard";
import { Ionicons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get('window');

const Reservation = () => {
   const [reservations, setReservations] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) {
                    console.log("No userId found");
                    return;
                }

                const response = await getReservationsByUserId(userId);
                setReservations(response || []);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    const todayDate = new Date().toISOString().slice(0, 10);

    const todayReservations = reservations.filter(
        (r) => r.reservationDate === todayDate
    );
    const upcomingReservations = reservations.filter(
        (r) => r.reservationDate > todayDate
    );
    const previousReservations = reservations.filter(
        (r) => r.reservationDate < todayDate
    );

    const renderSectionHeader = (title: string, count: number, icon: string) => (
        <View className="flex-row items-center mx-5 mb-3 mt-6">
            <Ionicons name={icon as any} size={24} color="#78232A" />
            <Text className="text-xl font-bold ml-2 text-gray-800">{title}</Text>
            <View className="ml-auto bg-gray-100 px-3 py-1 rounded-full">
                <Text className="text-sm font-semibold text-gray-600">{count}</Text>
            </View>
        </View>
    );

    const renderEmptyState = (message: string) => (
        <View className="flex-1 items-center justify-center py-8">
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-center mt-2 text-base">{message}</Text>
        </View>
    );

    const renderReservationCard = ({ item }: { item: any }) => (
        <View className="mr-4" style={{ width: screenWidth * 0.85 }}>
            <ReusableCard item={item} />
        </View>
    );

    const renderReservationSection = (reservations: any[], title: string, icon: string, emptyMessage: string) => {
        if (reservations.length === 0) {
            return (
                <View className="mx-5 mb-6">
                    {renderSectionHeader(title, 0, icon)}
                    {renderEmptyState(emptyMessage)}
                </View>
            );
        }

        return (
            <View className="mx-5 mb-6">
                {renderSectionHeader(title, reservations.length, icon)}
                <FlatList
                    data={reservations}
                    renderItem={renderReservationCard}
                    keyExtractor={(item, index) => `${title}-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 0 }}
                    snapToInterval={screenWidth * 0.85 + 16} // card width + margin
                    decelerationRate="fast"
                    snapToAlignment="start"
                />
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#78232A" />
                <Text className="mt-3 text-gray-600">Loading reservations...</Text>
            </View>
        );
    }

    const renderContent = () => (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-gradient-to-b from-red-50 to-white pt-8 pb-6">
                <Text className="text-3xl text-center font-bold text-gray-800">My Reservations</Text>
                <Text className="text-center text-gray-600 mt-2">Track your bus journeys</Text>
            </View>

            {/* Today's Reservations */}
            {renderReservationSection(
                todayReservations,
                "Today's Trips",
                "today-outline",
                "No reservations for today"
            )}

            {/* Upcoming Reservations */}
            {renderReservationSection(
                upcomingReservations,
                "Upcoming Trips",
                "calendar-outline",
                "No upcoming reservations"
            )}

            {/* Previous Reservations */}
            {renderReservationSection(
                previousReservations,
                "Previous Trips",
                "time-outline",
                "No previous reservations"
            )}

            {/* Bottom Spacing */}
            <View className="h-8" />
        </View>
    );

    return (
        <FlatList
            data={[{ key: 'content' }]}
            renderItem={renderContent}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            className="bg-white"
        />
    );
}

export default Reservation;