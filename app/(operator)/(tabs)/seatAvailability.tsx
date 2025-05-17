import {View, Text, ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import {getBusRoutes} from "@/api/busAPI";
import {getDailyRouteSchedules} from "@/api/busScheduleAPI";
import {getReservedSeats} from "@/api/reservationAPI";
import DatePickerField from "@/components/datepicker";
import DropdownMenu from "@/components/dropdown";
import {SeatMap} from "@/components/seatMap";
import CustomButton from "@/components/customButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SeatAvailability = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
    const [dropdownOpenTime, setDropdownOpenTime] = useState(false);
    const [routes, setRoutes] = useState<{ label: string; value: string }[]>([]);
    const [schedules, setSchedules] = useState<{ label: string; value: string }[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
    const [busFare, setBusFare] = useState<number | null>(null);
    const [bus, setBus] = useState<any>(null);

    useEffect(() => {
        const user = AsyncStorage.getItem("userId");
        const fetchBusDetails = async() =>{

        }

    }, []);

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
    }, [selectedDate]);


    useEffect(() => {
        if (!selectedDate ||!selectedSchedule) return;

        const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : 'No date';

        const fetchOccupiedSeats = async() =>{
            try {
                const response = await getReservedSeats(formattedDate,selectedSchedule);
                setOccupiedSeats(response.map((res: { seatNo: number; }) => res.seatNo));

                if (response.length > 0) {
                    setBusFare(response[0].busFare);
                } else {
                    setBusFare(0);
                }
            }catch (error){
                console.log(error)
            }
        }

        fetchOccupiedSeats();
    }, [selectedDate,selectedSchedule]);

    const handleSeatPress = (seatNumber: number) => {
        console.log(`Seat ${seatNumber} selected`);
    };

    const handleReservation = () => {
        console.log("reserved");
    }

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
                        editable={false}
                    />

                    <Text className="text-xl font-bold mx-7">Bus Fare - LKR {busFare}.00</Text>

                    <View className="my-5">
                        <CustomButton
                            title="Confirm SeatAvailability"
                            onPress={handleReservation}
                        />
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

export default SeatAvailability;