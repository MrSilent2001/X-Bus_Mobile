import {View, Text, ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import {getReservationsByUserId} from "@/api/reservationAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReusableCard from "@/components/reusableCard";

const Reservation = () => {
   const [reservations, setReservations] = useState<any[]>([]);

    useEffect(() => {
        const fetReservations = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                if (!userId) {
                    console.log("No userId found");
                    return;
                }

                const response = await getReservationsByUserId(userId);
                setReservations(response);

            } catch (error) {
                console.log(error);
            }
        };

        fetReservations();
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

    return(
        <ScrollView>
            <View>
                <Text className="text-2xl text-center font-bold mt-5"> My Reservations </Text>
                <View className="my-5">
                    <View className="mx-5 my-2">
                        <Text className="text-lg font-bold ml-3 mb-3">Today</Text>
                        <View>
                            {todayReservations.map((item, index) => (
                                <ReusableCard key={index} item={item} />
                            ))}
                        </View>
                    </View>

                    <View className="mx-5 my-2" style={{ zIndex: 3000 }}>
                        <Text className="text-lg font-bold ml-3 mb-3">Upcoming Trips</Text>
                        <ScrollView className="h-100">
                            {upcomingReservations.map((item, index) => (
                                <ReusableCard key={index} item={item} />
                            ))}
                        </ScrollView>
                    </View>

                    <View className="mx-5 my-2" style={{ zIndex: 3000 }}>
                        <Text className="text-lg font-bold ml-3 mb-3">Previous Trips</Text>
                        <ScrollView className="h-100">
                            {previousReservations.map((item, index) => (
                                <ReusableCard key={index} item={item} />
                            ))}
                        </ScrollView>
                    </View>

                </View>
            </View>


        </ScrollView>
    );
}

export default Reservation;