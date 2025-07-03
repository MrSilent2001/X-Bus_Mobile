import { useEffect, useState } from "react";
import * as Location from "expo-location";

type LocationType = {
    latitude: number;
    longitude: number;
};

const useLocation = () => {
    const [errMsg, setErrMsg] = useState<string>("");
    const [location, setLocation] = useState<LocationType | null>(null);

    useEffect(() => {
        let subscription: Location.LocationSubscription | null = null;

        const getUserLocation = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                setErrMsg("Permission to access location was denied!");
                return;
            }

            try {
                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Highest,
                        timeInterval: 1000,      // every 1 sec
                        distanceInterval: 1,     // every 1 meter
                    },
                    async (loc) => {
                        console.log("Live location", loc.coords);

                        const { latitude, longitude } = loc.coords;
                        setLocation({ latitude, longitude });

                        try {
                            const response = await Location.reverseGeocodeAsync({
                                latitude,
                                longitude,
                            });
                            console.log("UserLocation (reverse geocode):", response);
                        } catch (err) {
                            console.error("Reverse geocoding error:", err);
                        }
                    }
                );
            } catch (error) {
                console.error("Location watch error:", error);
            }
        };

        getUserLocation();

        // cleanup subscription on component unmount
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    return { location, errMsg };
};

export default useLocation;
