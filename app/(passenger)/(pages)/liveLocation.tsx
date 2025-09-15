import React, { useEffect, useRef, useState } from "react";
import { View, Text, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
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
    const webviewRef = useRef<WebView>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const [markers, setMarkers] = useState<LocationType[]>([]);

    // HTML content for Google Maps inside WebView
    const mapHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }
      .gm-style .gm-style-iw-c { padding: 8px !important; }
    </style>
    <script>
      let map = null;
      const addedMarkers = {};

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: 6.9271, lng: 79.8612 },
          zoom: 14,
          disableDefaultUI: false,
        });
      }

      function moveTo(lat, lng) {
        if (!map) return;
        map.panTo({ lat, lng });
      }

      function addOrUpdateMarker(id, lat, lng, title, isCurrent, isBus) {
        if (!map) return;
        if (addedMarkers[id]) {
          addedMarkers[id].setPosition({ lat, lng });
          if (title) addedMarkers[id].setTitle(title);
          return;
        }
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
          title: title || '',
          icon: isCurrent ? {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#2563EB',
            fillOpacity: 1,
            strokeColor: '#1E40AF',
            strokeWeight: 2,
          } : (isBus ? {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          } : undefined),
        });
        addedMarkers[id] = marker;
      }

      function handleMessage(event) {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'init') {
            initMap();
            addOrUpdateMarker('current-location', data.latitude, data.longitude, 'You are here', true, false);
            moveTo(data.latitude, data.longitude);
          } else if (data.type === 'location-update') {
            addOrUpdateMarker('current-location', data.latitude, data.longitude, 'You are here', true, false);
          } else if (data.type === 'search') {
            const id = data.id || ('search-' + Date.now());
            addOrUpdateMarker(id, data.latitude, data.longitude, data.title || 'Searched location', false, false);
            moveTo(data.latitude, data.longitude);
          } else if (data.type === 'marker') {
            const id = data.id || ('marker-' + Date.now());
            addOrUpdateMarker(id, data.latitude, data.longitude, data.title || 'Marker', false, true);
          }
        } catch (e) {
          // no-op
        }
      }

      // RN WebView -> Web bridge
      window.addEventListener('message', handleMessage);
      document.addEventListener('message', handleMessage);
    </script>
  </head>
  <body>
    <div id="map"></div>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=${EXPO_GOOGLE_MAPS_API}&callback=initMap"></script>
  </body>
</html>`;

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

            // Notify WebView to center on current location
            if (searchQuery.trim() === "") {
                webviewRef.current?.postMessage(
                    JSON.stringify({
                        type: "location-update",
                        latitude: location.latitude,
                        longitude: location.longitude,
                    })
                );
            }
        }
    }, [location]);

    // Watch for searchQuery changes - if cleared, reset markers & map
    useEffect(() => {
        if (searchQuery.trim() === "" && location) {
            // Keep only current-location marker
            setMarkers((prev) => prev.filter((m) => m.id === "current-location"));

            // Center WebView map back to current location
            webviewRef.current?.postMessage(
                JSON.stringify({
                    type: "location-update",
                    latitude: location.latitude,
                    longitude: location.longitude,
                })
            );
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

                // Notify WebView to add marker and center
                webviewRef.current?.postMessage(
                    JSON.stringify({
                        type: "search",
                        id: `search-${Date.now()}`,
                        latitude: lat,
                        longitude: lng,
                        title: searchQuery,
                    })
                );
            } else {
                console.warn("Place not found!");
            }
        } catch (error) {
            console.error("Geocoding API error:", error);
        }
    };


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

    // Send initial location to WebView once it loads
    const onWebViewLoaded = () => {
        if (location) {
            webviewRef.current?.postMessage(
                JSON.stringify({
                    type: "init",
                    latitude: location.latitude,
                    longitude: location.longitude,
                })
            );
        }

        // Add predefined bus location markers (Colombo, Kottawa, Kaduwela)
        const busLocations: LocationType[] = [
            { id: "bus-colombo", latitude: 6.9271, longitude: 79.8612, title: "Bus - Colombo" },
            { id: "bus-kottawa", latitude: 6.8416, longitude: 79.9650, title: "Bus - Kottawa" },
            { id: "bus-kaduwela", latitude: 6.9330, longitude: 79.9850, title: "Bus - Kaduwela" },
        ];

        busLocations.forEach((bus) => {
            webviewRef.current?.postMessage(
                JSON.stringify({
                    type: "marker",
                    id: bus.id,
                    latitude: bus.latitude,
                    longitude: bus.longitude,
                    title: bus.title,
                })
            );
        });
    };

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

            {/* Map via WebView */}
            <WebView
                ref={webviewRef}
                originWhitelist={["*"]}
                source={{ html: mapHtml }}
                onLoadEnd={onWebViewLoaded}
                javaScriptEnabled
                domStorageEnabled
                style={{ flex: 1 }}
            />
        </View>
    );
};

export default LiveLocation;
