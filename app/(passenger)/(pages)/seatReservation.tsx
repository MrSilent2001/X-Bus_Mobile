import {View, Text, Alert, FlatList} from "react-native";
import {SeatMap} from "@/components/seatMap";
import DatePickerField from "@/components/datepicker";
import DropdownMenu from "@/components/dropdown";
import React, {useEffect, useState, useCallback} from "react";
import {getBusByScheduleId, getBusRoutes} from "@/api/busAPI";
import CustomButton from "@/components/customButton";
import {getDailyRouteSchedules} from "@/api/busScheduleAPI";
import {getReservedSeats} from "@/api/reservationAPI";
import { useStripe} from '@stripe/stripe-react-native';
import {fetchPaymentSheetParams, savePaymentToDatabase} from "@/api/paymentAPI";
import {useAuthStore} from "@/store/authStore";
import {router, useFocusEffect} from "expo-router";

const SeatReservation = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
    const [selectedBus, setSelectedBus] = useState<string | null>(null);
    const [dropdownOpenRoute, setDropdownOpenRoute] = useState(false);
    const [dropdownOpenTime, setDropdownOpenTime] = useState(false);
    const [routes, setRoutes] = useState<{ label: string; value: string }[]>([]);
    const [schedules, setSchedules] = useState<{ label: string; value: string }[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
    const [busFare, setBusFare] = useState<number | null>(null);

    const [touchedDate, setTouchedDate] = useState(false);
    const [touchedRoute, setTouchedRoute] = useState(false);
    const [touchedTime, setTouchedTime] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {user} = useAuthStore();

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    // Get today's date for minimum date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    // Clear form state when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            resetReservationState();
        }, [])
    );

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
                } else {
                    setSchedules([]);
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


    useEffect(() => {
        if (!selectedSchedule) return;

        const fetchBus = async () => {
            try {
                const scheduleId = selectedSchedule.toString();
                const busData = await getBusByScheduleId(scheduleId);
                if (busData) {
                    setSelectedBus(busData.id.toString());
                }
            } catch (error) {
                console.log("Error fetching bus:", error);
            }
        };

        fetchBus();
    }, [selectedSchedule]);


    console.log("selectedBus",selectedBus)

    const handleSeatPress = (seatNumber: number) => {
        console.log(`Seat ${seatNumber} selected`);
    };

    const resetReservationState = () => {
        setSelectedDate(null);
        setSelectedRoute(null);
        setSelectedSchedule(null);
        setSelectedBus(null);
        setOccupiedSeats([]);
        setBusFare(null);
        setSchedules([]);
        setTouchedDate(false);
        setTouchedRoute(false);
        setTouchedTime(false);
        setIsSubmitting(false);
        setDropdownOpenRoute(false);
        setDropdownOpenTime(false);
    };

    const isFormValid = !!selectedDate && !!selectedRoute && !!selectedSchedule && !!busFare;

    //Handle payment gateway
    const initializePaymentSheet = async () => {
        if (!busFare || !selectedSchedule || !selectedDate) {
            Alert.alert("Incomplete Selection", "Please select date, route, time, and check seat map first.");
            return null;
        }

        try {
            const { paymentIntent } = await fetchPaymentSheetParams(
                busFare,
                selectedSchedule,
                selectedDate,
                user,
                selectedBus
            );

            const { error } = await initPaymentSheet({
                merchantDisplayName: "X-Bus",
                paymentIntentClientSecret: paymentIntent,
                allowsDelayedPaymentMethods: true,
                defaultBillingDetails: {
                    name: "customer",
                }
            });

            if (!error) {
                return paymentIntent;
            } else {
                console.log("PaymentSheet init error: ", error);
                return null;
            }
        } catch (error) {
            console.log("Error initializing payment sheet: ", error);
            Alert.alert("Error", "Failed to initialize payment sheet.");
            return null;
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            return {status: "presented"};
        }
    };

    //Handle Reservation
    const handleReservation = async () => {
        try {
            setTouchedDate(true);
            setTouchedRoute(true);
            setTouchedTime(true);
            if (!isFormValid || isSubmitting) return;
            setIsSubmitting(true);

            const intent = await initializePaymentSheet();
            if (!intent) { setIsSubmitting(false); return; }

            const presented = await openPaymentSheet();
            if (!presented) { setIsSubmitting(false); return; }

            const response = await savePaymentToDatabase(intent);
            if(response?.data.status === "succeeded"){
                resetReservationState();
                router.push("/(passenger)/(pages)/paymentSuccess");
                return;
            }
            resetReservationState();
            router.push("/(passenger)/(pages)/paymentFailure");

        } catch (error) {
            console.log("Payment error:", error);
            Alert.alert("Payment Error", "Something went wrong while processing your payment.");
            setIsSubmitting(false);
        }
    };

    const renderContent = () => (
        <View>
            <View>
                <Text className="text-2xl text-center font-bold mt-5"> Seat Availability </Text>
                <View>
                    <View className="mx-5 my-2">
                        <Text className="ml-3">Date</Text>
                        <DatePickerField
                            date={selectedDate}
                            setDate={(d) => { setSelectedDate(d); setTouchedDate(true); }}
                            placeholder="Pick your date"
                            mode="date"
                            minimumDate={today}
                            errorText={touchedDate && !selectedDate ? 'Please select a date' : undefined}
                            helperText={!selectedDate ? 'Choose your travel date' : undefined}
                        />
                    </View>

                    <View className="mx-5 my-2" style={{ zIndex: 3000 }}>
                        <Text className="ml-3">Route</Text>
                        <DropdownMenu
                            placeholder="Select the route"
                            options={routes}
                            selectedValue={selectedRoute}
                            onSelect={(value) => { setSelectedRoute(value); setTouchedRoute(true); }}
                            zIndex={2000}
                            open={dropdownOpenRoute}
                            setOpen={(o) => { setDropdownOpenRoute(o); if (o) setTouchedRoute(true); }}
                            errorText={touchedRoute && !selectedRoute ? 'Route is required' : undefined}
                            helperText={!routes.length ? 'No routes available' : undefined}
                        />
                    </View>

                    {selectedDate && selectedRoute && (
                        <View className="mx-5 my-2" style={{ zIndex: 2000 }}>
                            <Text className="ml-3 my-2">Time</Text>
                            <DropdownMenu
                                placeholder="Select the time"
                                options={schedules}
                                selectedValue={selectedSchedule}
                                onSelect={(value) => { setSelectedSchedule(value); setTouchedTime(true); }}
                                zIndex={2000}
                                open={dropdownOpenTime}
                                setOpen={(o) => { setDropdownOpenTime(o); if (o) setTouchedTime(true); }}
                                errorText={touchedTime && !selectedSchedule ? 'Time is required' : undefined}
                                helperText={!schedules.length ? 'No schedules available' : undefined}
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
                            disabled={!isFormValid || isSubmitting}
                            loading={isSubmitting}
                        />
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <FlatList
            data={[{ key: 'content' }]}
            renderItem={renderContent}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
}

export default SeatReservation;