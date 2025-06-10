import {View, Text, ScrollView, Alert} from "react-native";
import {SeatMap} from "@/components/seatMap";
import DatePickerField from "@/components/datepicker";
import DropdownMenu from "@/components/dropdown";
import React, {useEffect, useState} from "react";
import {getBusRoutes} from "@/api/busAPI";
import CustomButton from "@/components/customButton";
import {getDailyRouteSchedules} from "@/api/busScheduleAPI";
import {getReservedSeats} from "@/api/reservationAPI";
import { useStripe} from '@stripe/stripe-react-native';
import api from '@/util/apiInterceptor';

const SeatReservation = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
    const [dropdownOpenRoute, setDropdownOpenRoute] = useState(false);
    const [dropdownOpenTime, setDropdownOpenTime] = useState(false);
    const [routes, setRoutes] = useState<{ label: string; value: string }[]>([]);
    const [schedules, setSchedules] = useState<{ label: string; value: string }[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
    const [busFare, setBusFare] = useState<number | null>(null);

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const routes = await getBusRoutes();
                if (routes && routes.length > 0) {
                    const formattedRoutes = routes.map((route: string) => ({
                        label: route,
                        value: route,
                    }));
                    setRoutes(formattedRoutes);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchRoutes();
    }, []);

    useEffect(() => {
        if (!selectedDate || !selectedRoute) return;
        const fetchSchedules = async () => {
            try {
                const schedules = await getDailyRouteSchedules(selectedDate, selectedRoute);
                if (schedules && schedules.length > 0) {
                    const formattedSchedules = schedules.map((schedule: any) => ({
                        label: schedule.scheduledTime,
                        value: schedule.id.toString(),
                    }));
                    setSchedules(formattedSchedules);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchSchedules();
    }, [selectedDate, selectedRoute]);


    useEffect(() => {
        if (!selectedDate || !selectedRoute || !selectedSchedule) return;

        const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : 'No date';

        const fetchOccupiedSeats = async() =>{
            try {
                const response = await getReservedSeats(formattedDate,selectedSchedule);
                console.log(response);
                setOccupiedSeats(response.map((res: { seatNo: number; }) => res.seatNo));

                if (response.length > 0) {
                    setBusFare(response[0].busFare);
                } else {
                    setBusFare(1000);
                }
            }catch (error){
                console.log(error)
            }
        }

        fetchOccupiedSeats();
    }, [selectedDate, selectedRoute, selectedSchedule]);

    const handleSeatPress = (seatNumber: number) => {
        console.log(`Seat ${seatNumber} selected`);
    };

    const fetchPaymentSheetParams = async () => {
        const response = await api.post(`/payment/payment-sheet`,{
            amount: busFare,
            scheduleId: selectedSchedule,
            date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
        });
        const { paymentIntent, ephemeralKey, customer } = await response.data;

        return {
            paymentIntent,
            ephemeralKey
        };
    };

    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({
            merchantDisplayName: "X-Bus",
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
                name: "customer",
            }
        });
        if (!error) {
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
    };

    const handleReservation = async () => {
        try {
            if (!loading) {
                await initializePaymentSheet();
            }
            await openPaymentSheet();
        } catch (error) {
            console.log("Payment error:", error);
            Alert.alert("Payment Error", "Something went wrong while processing your payment.");
        }
    };


    return(
            <ScrollView>
                <View>
                    <Text className="text-2xl text-center font-bold mt-5"> Seat Availability </Text>
                    <View>
                        <View className="mx-5 my-2">
                            <Text className="ml-3">Date</Text>
                            <DatePickerField
                                date={selectedDate}
                                setDate={setSelectedDate}
                                placeholder="Pick your date"
                                mode="date"
                            />
                        </View>

                        <View className="mx-5 my-2" style={{ zIndex: 3000 }}>
                            <Text className="ml-3">Route</Text>
                            <DropdownMenu
                                placeholder="Select the route"
                                options={routes}
                                selectedValue={selectedRoute}
                                onSelect={(value) => setSelectedRoute(value)}
                                zIndex={2000}
                                open={dropdownOpenRoute}
                                setOpen={setDropdownOpenRoute}
                            />
                        </View>

                        {selectedDate && selectedRoute && (
                            <View className="mx-5 my-2" style={{ zIndex: 2000 }}>
                                <Text className="ml-3 my-2">Time</Text>
                                <DropdownMenu
                                    placeholder="Select the time"
                                    options={schedules}
                                    selectedValue={selectedSchedule}
                                    onSelect={(value) => setSelectedSchedule(value)}
                                    zIndex={2000}
                                    open={dropdownOpenTime}
                                    setOpen={setDropdownOpenTime}
                                />
                            </View>
                        )}
                    </View>
                </View>

                {selectedSchedule && (
                    <View className="mx-7 my-3">
                        <Text className="text-xl font-bold">Seat Allocation</Text>

                        <SeatMap
                            seatCount={50}
                            occupiedSeats={occupiedSeats}
                            onSeatPress={handleSeatPress}
                            editable={true}
                        />

                        <Text className="text-xl font-bold mx-7">Bus Fare - LKR {busFare}.00</Text>

                        <View className="my-5">
                            <CustomButton
                                title="Confirm Reservation"
                                onPress={handleReservation}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>
    );
}

export default SeatReservation;