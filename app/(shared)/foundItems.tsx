import {Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import DropdownMenu from "@/components/dropdown";
import {getAllFoundItems } from "@/api/lostnfoundAPI";
import {dateOptions} from "@/constants/api";

const FoundItems = () => {
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    // const [routeDropdownOpen, setRouteDropdownOpen] = useState(false);
    // const [routeOptions, setRouteOptions] = useState<{ label: string; value: string }[]>([])
    // const [routeFilter, setRouteFilter] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<string | null>(null);
    const [foundItems, setFoundItems] = useState<any[]>([]);

    // useEffect(() => {
    //     const fetchRoutes = async () => {
    //         try {
    //             const routes = await getBusRoutes();
    //             if (routes && routes.length > 0) {
    //                 const formattedRoutes = routes.map((route: string) => ({
    //                     label: route,
    //                     value: route,
    //                 }));
    //                 setRouteOptions(formattedRoutes);
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //
    //     fetchRoutes();
    // }, []);

    useEffect(() => {
        const fetchFoundItems = async () => {
            try {
                const response = await getAllFoundItems(dateFilter);
                setFoundItems(response);
            } catch (error) {
                console.log(error);
            }
        };

        fetchFoundItems();
    }, [dateFilter]);

    return(
        <View className="mx-5 my-5">
            <Text className="text-2xl font-bold text-center my-3">Lost Items</Text>

            <View style={{ position: 'relative', zIndex: 2000 }} className="my-5">
                <Text className="text-lg font-JakartaSemiBold mx-2 mb-3">Date</Text>
                <DropdownMenu
                    placeholder="All"
                    options={dateOptions}
                    selectedValue={dateFilter}
                    onSelect={(value) => setDateFilter(value)}
                    zIndex={2000}
                    open={dateDropdownOpen}
                    setOpen={setDateDropdownOpen}
                />
            </View>

            {/*<View style={{ position: 'relative', zIndex: 1000 }} className="mt-3">*/}
            {/*    <Text className="text-lg font-JakartaSemiBold mx-2 mb-3">Route</Text>*/}
            {/*    <DropdownMenu*/}
            {/*        placeholder="Select a route"*/}
            {/*        options={routeOptions}*/}
            {/*        selectedValue={routeFilter}*/}
            {/*        onSelect={(value) => setRouteFilter(value)}*/}
            {/*        zIndex={1000}*/}
            {/*        open={routeDropdownOpen}*/}
            {/*        setOpen={setRouteDropdownOpen}*/}
            {/*    />*/}
            {/*</View>*/}

            <View className="mt-5">
                {foundItems.length > 0 ? (
                    foundItems.map((item, index) => (
                        <View key={index} className="w-full h-40 bg-[#F7D8D4] rounded-3xl mb-3">
                            <View className="flex flex-row w-full h-full p-4">
                                <View className="w-full flex justify-center">
                                    <View className="flex flex-row justify-between mx-2">
                                        <Text className="text-lg font-bold text-red-950">{item.date.split('T')[0]}</Text>
                                        <Text className="text-lg font-bold text-red-950">{item.time.substring(0, 5)}</Text>
                                    </View>

                                    <View className="flex flex-row justify-evenly my-3">
                                        <Text className="text-lg font-bold text-red-950">{item.description}</Text>
                                    </View>

                                    <View className="flex justify-center items-center">
                                        <Text className="text-lg font-bold text-red-950">
                                            If found, plz contact
                                        </Text>
                                        <Text className="text-md font-bold text-red-950">
                                            {item.userName} - {item.contactNo}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text className="text-center text-lg text-gray-500">No schedules available</Text>
                )}
            </View>
        </View>
    );
}

export default FoundItems;