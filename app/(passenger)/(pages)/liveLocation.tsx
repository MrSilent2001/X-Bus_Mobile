import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import axios from "axios";
import useLocation from "@/hooks/useLocation";
import { EXPO_GOOGLE_MAPS_API } from "@/constants/api";

type LocationType = {
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
};

const LiveLocation: React.FC = () => {
    const { location, errMsg } = useLocation();
    const mapRef = useRef<MapView>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [markers, setMarkers] = useState<LocationType[]>([]);

    // Update current location marker whenever location updates
    useEffect(() => {
        if (location) {
            setMarkers((prev) => {
                // Remove previous current-location marker
                const filtered = prev.filter((m) => m.id !== "current-location");
                return [
                    ...filtered,
                    {
                        id: "current-location",
                        latitude: location.latitude,
                        longitude: location.longitude,
                        title: "Your Current Location",
                        description: "You are here",
                    },
                ];
            });

            // If search query is empty, animate map back to current location
            if (searchQuery.trim() === "") {
                const region: Region = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };
                mapRef.current?.animateToRegion(region, 1000);
            }
        }
    }, [location]);

    // Watch for searchQuery changes - if cleared, reset markers & map
    useEffect(() => {
        if (searchQuery.trim() === "" && location) {
            // Keep only current-location marker
            //setMarkers((prev) => prev.filter((m) => m.id === "current-location"));
            setMarkers([
                { id: "test", latitude: 6.9271, longitude: 79.8612, title: "Colombo", description: "Test marker" }
            ]);


            const region: Region = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            mapRef.current?.animateToRegion(region, 1000);
        }
    }, [searchQuery, location]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    searchQuery
                )}&key=${EXPO_GOOGLE_MAPS_API}`
            );

            if (response.data.status === "OK") {
                const { lat, lng } = response.data.results[0].geometry.location;

                const newRegion: Region = {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };

                mapRef.current?.animateToRegion(newRegion, 1000);

                setMarkers((prev) => [
                    ...prev.filter((m) => m.id === "current-location"),
                    {
                        id: `search-${Date.now()}`,
                        latitude: lat,
                        longitude: lng,
                        title: searchQuery,
                        description: "Searched location",
                    },
                ]);
            } else {
                console.warn("Place not found!");
            }
        } catch (error) {
            console.error("Geocoding API error:", error);
        }
    };
    // const handleSearch = async () => {
    //     if (!searchQuery.trim()) return;
    //
    //     try {
    //         const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    //             searchQuery
    //         )}&key=${EXPO_GOOGLE_MAPS_API}`;
    //
    //         console.log("🔍 Geocoding request:", url);
    //
    //         const response = await axios.get(url);
    //         console.log("📡 Geocode response:", response.data);
    //
    //         if (response.data.status === "OK" && response.data.results.length > 0) {
    //             const { lat, lng } = response.data.results[0].geometry.location;
    //
    //             console.log("📍 Coordinates found:", lat, lng);
    //
    //             const newRegion: Region = {
    //                 latitude: lat,
    //                 longitude: lng,
    //                 latitudeDelta: 0.01,
    //                 longitudeDelta: 0.01,
    //             };
    //
    //             mapRef.current?.animateToRegion(newRegion, 1000);
    //
    //             setMarkers((prev) => [
    //                 ...prev.filter((m) => m.id === "current-location"),
    //                 {
    //                     id: `search-${Date.now()}`,
    //                     latitude: lat,
    //                     longitude: lng,
    //                     title: searchQuery,
    //                     description: "Searched location",
    //                 },
    //             ]);
    //         } else {
    //             console.warn("⚠️ Geocode returned no results:", response.data.status);
    //             alert("Place not found. Try another search.");
    //         }
    //     } catch (error: any) {
    //         console.error("❌ Geocoding API error:", error.message || error);
    //         alert("Error fetching location. Check your API key & internet.");
    //     }
    // };


    if (errMsg) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-red-600 text-lg">{errMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-2 text-gray-700">Fetching location...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Search Bar */}
            <View className="flex-row p-3 bg-white items-center z-10">
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search a place..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
                />
                <TouchableOpacity onPress={handleSearch} className="ml-2 bg-blue-600 px-4 py-2 rounded-lg">
                    <Text className="text-white font-medium">Search</Text>
                </TouchableOpacity>
            </View>

            {/* Map */}
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                provider="google"
                showsUserLocation={false}
                followsUserLocation={false}
            >
                {markers.map(({ id, latitude, longitude, title, description }) => (
                    <Marker
                        key={id}
                        coordinate={{ latitude, longitude }}
                        title={title}
                        description={description}
                        pinColor={id === "current-location" ? "blue" : "red"}
                    />
                ))}
            </MapView>
        </View>
    );
};

export default LiveLocation;
