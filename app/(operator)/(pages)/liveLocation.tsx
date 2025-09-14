import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
    ScrollView,
    RefreshControl,
    Animated,
    Dimensions,
    StatusBar,
    BackHandler,
    Linking,
    PermissionsAndroid,
} from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import useLocation from "@/hooks/useLocation";
import { GOOGLE_MAPS_KEY } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import Toast from "@/components/Toast";

// Try to import react-native-maps, but provide fallback if it fails
let MapView: any = null;
let Marker: any = null;
let Region: any = null;

try {
    const maps = require("react-native-maps");
    MapView = maps.default;
    Marker = maps.Marker;
    Region = maps.Region;
} catch (error) {
    console.log("react-native-maps not available, using WebView fallback");
}

type LocationType = {
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
    description?: string;
    type?: 'current' | 'search' | 'bus';
};

type SearchResult = {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
};

type NetworkStatus = 'connected' | 'disconnected' | 'checking';

const { width, height } = Dimensions.get('window');

const LiveLocation: React.FC = () => {
    const { location, errMsg, requestLocation } = useLocation();
    const mapRef = useRef<any>(null);
    const searchInputRef = useRef<TextInput>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-50)).current;

    // State management
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [mapError, setMapError] = useState<string>("");
    const [mapReady, setMapReady] = useState<boolean>(false);
    const [useWebView, setUseWebView] = useState<boolean>(!MapView);
    const [markers, setMarkers] = useState<LocationType[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('checking');
    const [isLocationTracking, setIsLocationTracking] = useState<boolean>(false);
    const [lastKnownLocation, setLastKnownLocation] = useState<any>(null);
    const [apiKeyValid, setApiKeyValid] = useState<boolean>(true);
    const [retryCount, setRetryCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [toast, setToast] = useState<{
        visible: boolean;
        message: string;
        type: 'success' | 'error' | 'info' | 'warning';
    }>({
        visible: false,
        message: '',
        type: 'info',
    });

    // Animation effects
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Network status monitoring
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: any) => {
            setNetworkStatus(state.isConnected ? 'connected' : 'disconnected');
            if (!state.isConnected) {
                showToast('No internet connection', 'error');
            }
        });

        return () => unsubscribe();
    }, []);

    // Back handler for search results
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (showSearchResults) {
                setShowSearchResults(false);
                setSearchResults([]);
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [showSearchResults]);

    // Test API key on component mount
    useEffect(() => {
        testApiKey();
    }, []);

    // Update current location marker whenever location updates
    useEffect(() => {
        if (location) {
            setLastKnownLocation(location);
            setIsLoading(false);

            setMarkers((prev) => {
                const filtered = prev.filter((m) => m.id !== "current-location");
                return [
                    ...filtered,
                    {
                        id: "current-location",
                        latitude: location.latitude,
                        longitude: location.longitude,
                        title: "Your Current Location",
                        description: "You are here",
                        type: 'current',
                    },
                ];
            });

            if (searchQuery.trim() === "" && mapReady && !useWebView && MapView) {
                animateToLocation(location);
            }
        }
    }, [location, mapReady, useWebView]);

    // Auto-search suggestions
    useEffect(() => {
        if (searchQuery.trim().length > 2) {
            const timeoutId = setTimeout(() => {
                searchPlaces(searchQuery);
            }, 500);

            return () => clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, [searchQuery]);

    const testApiKey = async () => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${GOOGLE_MAPS_KEY}`,
                { timeout: 10000 }
            );

            if (response.data.status === "REQUEST_DENIED") {
                setApiKeyValid(false);
                setMapError("Google Maps API key is invalid or restricted");
                showToast("Google Maps API key is invalid", "error");
            } else {
                setApiKeyValid(true);
                setMapError("");
            }
        } catch (error) {
            console.error("API Key test error:", error);
            setApiKeyValid(false);
            setMapError("Failed to validate API key");
        }
    };

    const searchPlaces = async (query: string) => {
        if (!apiKeyValid || networkStatus !== 'connected') return;

        try {
            setIsSearching(true);
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_KEY}&types=establishment|geocode`,
                { timeout: 10000 }
            );

            if (response.data.status === "OK") {
                setSearchResults(response.data.predictions);
                setShowSearchResults(true);
            } else {
                setSearchResults([]);
                setShowSearchResults(false);
            }
        } catch (error) {
            console.error("Place search error:", error);
            showToast("Failed to search places", "error");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = async (searchText?: string) => {
        const query = searchText || searchQuery;
        if (!query.trim() || !apiKeyValid) return;

        try {
            setIsSearching(true);
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_KEY}`,
                { timeout: 10000 }
            );

            if (response.data.status === "OK") {
                const { lat, lng } = response.data.results[0].geometry.location;
                const formattedAddress = response.data.results[0].formatted_address;

                if (!useWebView && MapView) {
                    const newRegion = {
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
                            title: formattedAddress,
                            description: "Searched location",
                            type: 'search',
                        },
                    ]);
                }

                setSearchQuery(formattedAddress);
                setShowSearchResults(false);
                setSearchResults([]);
                showToast(`Found: ${formattedAddress}`, "success");
            } else {
                showToast("Place not found. Try a different search term.", "error");
            }
        } catch (error) {
            console.error("Geocoding API error:", error);
            showToast("Search failed. Check your connection.", "error");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchResultSelect = (result: SearchResult) => {
        setSearchQuery(result.description);
        setShowSearchResults(false);
        handleSearch(result.description);
    };

    const animateToLocation = (loc: any) => {
        if (!mapRef.current || !loc) return;

        const region = {
            latitude: loc.latitude,
            longitude: loc.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        mapRef.current.animateToRegion(region, 1000);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await requestLocation();
            await testApiKey();
            showToast("Location refreshed", "success");
        } catch (error) {
            showToast("Failed to refresh location", "error");
        } finally {
            setIsRefreshing(false);
        }
    };

    const toggleLocationTracking = () => {
        setIsLocationTracking(!isLocationTracking);
        if (!isLocationTracking && lastKnownLocation) {
            animateToLocation(lastKnownLocation);
        }
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Location Permission",
                        message: "This app needs access to your location to show your position on the map.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    requestLocation();
                } else {
                    showToast("Location permission denied", "error");
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        setToast({
            visible: true,
            message,
            type,
        });
    };

    const openMapsApp = () => {
        if (location) {
            const url = Platform.OS === 'ios'
                ? `http://maps.apple.com/?q=${location.latitude},${location.longitude}`
                : `geo:${location.latitude},${location.longitude}`;

            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    showToast("No maps app available", "error");
                }
            });
        }
    };

    // Create HTML for WebView map
    const createMapHTML = () => {
        if (!location) return "";

        const markersHTML = markers.map(marker => `
            new google.maps.Marker({
                position: { lat: ${marker.latitude}, lng: ${marker.longitude} },
                map: map,
                title: "${marker.title || ''}",
                ${marker.id === "current-location" ? "icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'" : ""}
            });
        `).join('');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { margin: 0; padding: 0; }
                    #map { width: 100%; height: 100vh; }
                </style>
            </head>
            <body>
                <div id="map"></div>
                <script>
                    function initMap() {
                        const map = new google.maps.Map(document.getElementById('map'), {
                            center: { lat: ${location.latitude}, lng: ${location.longitude} },
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            zoomControl: true,
                            mapTypeControl: true,
                            scaleControl: true,
                            streetViewControl: true,
                            rotateControl: true,
                            fullscreenControl: true
                        });
                        
                        ${markersHTML}
                    }
                </script>
                <script async defer
                    src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&callback=initMap">
                </script>
            </body>
            </html>
        `;
    };

    // Loading state
    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Animated.View style={{ opacity: fadeAnim }}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text className="mt-4 text-gray-700 text-lg font-medium">Getting your location...</Text>
                    <Text className="mt-2 text-gray-500 text-sm text-center px-8">
                        Please ensure location services are enabled
                    </Text>
                </Animated.View>
            </View>
        );
    }

    // Network error state
    if (networkStatus === 'disconnected') {
        return (
            <View className="flex-1 justify-center items-center bg-white px-6">
                <Ionicons name="wifi-outline" size={64} color="#EF4444" />
                <Text className="mt-4 text-red-600 text-xl font-bold text-center">No Internet Connection</Text>
                <Text className="mt-2 text-gray-600 text-center">
                    Please check your internet connection and try again
                </Text>
                <TouchableOpacity
                    onPress={handleRefresh}
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Location permission error
    if (errMsg) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-6">
                <Ionicons name="location-outline" size={64} color="#EF4444" />
                <Text className="mt-4 text-red-600 text-xl font-bold text-center">Location Access Required</Text>
                <Text className="mt-2 text-gray-600 text-center">{errMsg}</Text>
                <TouchableOpacity
                    onPress={requestLocationPermission}
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-medium">Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // API key error
    if (!apiKeyValid) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-6">
                <Ionicons name="map-outline" size={64} color="#EF4444" />
                <Text className="mt-4 text-red-600 text-xl font-bold text-center">Map Configuration Error</Text>
                <Text className="mt-2 text-gray-600 text-center px-4">{mapError}</Text>
                <TouchableOpacity
                    onPress={testApiKey}
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-medium">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // No location available
    if (!location) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-6">
                <Ionicons name="location-outline" size={64} color="#6B7280" />
                <Text className="mt-4 text-gray-700 text-xl font-bold text-center">Location Unavailable</Text>
                <Text className="mt-2 text-gray-600 text-center">
                    Unable to get your current location
                </Text>
                <TouchableOpacity
                    onPress={handleRefresh}
                    className="mt-6 bg-blue-600 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-medium">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const initialRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}
                className="bg-white border-b border-gray-200"
            >
                <View className="flex-row items-center justify-between p-4">
                    <Text className="text-xl font-bold text-gray-900">Live Location</Text>
                    <View className="flex-row space-x-2">
                        <TouchableOpacity
                            onPress={handleRefresh}
                            className="p-2 bg-gray-100 rounded-full"
                            disabled={isRefreshing}
                        >
                            <Ionicons
                                name="refresh"
                                size={20}
                                color="#6B7280"
                                style={{ transform: [{ rotate: isRefreshing ? '360deg' : '0deg' }] }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={openMapsApp}
                            className="p-2 bg-blue-100 rounded-full"
                        >
                            <Ionicons name="open-outline" size={20} color="#2563EB" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>

            {/* Search Bar */}
            <View className="p-4 bg-white border-b border-gray-200">
                <View className="relative">
                    <View className="flex-row items-center border border-gray-300 rounded-xl bg-gray-50">
                        <Ionicons name="search" size={20} color="#6B7280" style={{ marginLeft: 12 }} />
                        <TextInput
                            ref={searchInputRef}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search for places..."
                            className="flex-1 px-3 py-3 text-gray-800"
                            placeholderTextColor="#9CA3AF"
                        />
                        {isSearching && (
                            <ActivityIndicator size="small" color="#2563EB" style={{ marginRight: 12 }} />
                        )}
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery("")}
                                className="p-2"
                            >
                                <Ionicons name="close-circle" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Search Results */}
                    {showSearchResults && searchResults.length > 0 && (
                        <View className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-48 z-50">
                            <ScrollView>
                                {searchResults.map((result, index) => (
                                    <TouchableOpacity
                                        key={result.place_id}
                                        onPress={() => handleSearchResultSelect(result)}
                                        className={`p-3 border-b border-gray-100 ${
                                            index === searchResults.length - 1 ? 'border-b-0' : ''
                                        }`}
                                    >
                                        <Text className="font-medium text-gray-900">
                                            {result.structured_formatting.main_text}
                                        </Text>
                                        <Text className="text-sm text-gray-600">
                                            {result.structured_formatting.secondary_text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            </View>

            {/* Map Controls */}
            <View className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row space-x-2">
                        {MapView && (
                            <TouchableOpacity
                                onPress={() => setUseWebView(!useWebView)}
                                className="bg-blue-600 px-3 py-2 rounded-lg"
                            >
                                <Text className="text-white font-medium text-sm">
                                    {useWebView ? 'Native' : 'WebView'}
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={toggleLocationTracking}
                            className={`px-3 py-2 rounded-lg ${
                                isLocationTracking ? 'bg-green-600' : 'bg-gray-600'
                            }`}
                        >
                            <Text className="text-white font-medium text-sm">
                                {isLocationTracking ? 'Tracking' : 'Track'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center space-x-2">
                        <View className={`w-2 h-2 rounded-full ${
                            networkStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <Text className="text-xs text-gray-600">
                            {networkStatus === 'connected' ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Map */}
            {useWebView ? (
                <WebView
                    source={{ html: createMapHTML() }}
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onLoad={() => setMapReady(true)}
                    onError={() => {
                        setMapError("Failed to load map");
                        showToast("Map loading failed", "error");
                    }}
                />
            ) : MapView ? (
                <MapView
                    ref={mapRef}
                    style={{ flex: 1 }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    followsUserLocation={isLocationTracking}
                    initialRegion={initialRegion}
                    onMapReady={() => {
                        console.log('Map is ready');
                        setMapReady(true);
                    }}
                    onError={() => {
                        setMapError("Map loading failed");
                        showToast("Map loading failed", "error");
                    }}
                >
                    {markers.map(({ id, latitude, longitude, title, description, type }) => (
                        <Marker
                            key={id}
                            coordinate={{ latitude, longitude }}
                            title={title}
                            description={description}
                            pinColor={
                                type === 'current' ? 'blue' :
                                    type === 'search' ? 'red' :
                                        type === 'bus' ? 'green' : 'red'
                            }
                        />
                    ))}
                </MapView>
            ) : (
                <View className="flex-1 justify-center items-center bg-gray-100">
                    <Ionicons name="map-outline" size={64} color="#6B7280" />
                    <Text className="mt-4 text-gray-600 text-lg">Map not available</Text>
                    <Text className="text-gray-500 text-sm mt-2">Please use WebView mode</Text>
                </View>
            )}

            {/* Location Info Card */}
            {location && (
                <View className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200">
                    <View className="p-4">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-sm font-medium text-gray-900">Current Location</Text>
                                <Text className="text-xs text-gray-600">
                                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </Text>
                            </View>
                            <View className="flex-row space-x-2">
                                <TouchableOpacity
                                    onPress={() => animateToLocation(location)}
                                    className="p-2 bg-blue-100 rounded-full"
                                >
                                    <Ionicons name="locate" size={16} color="#2563EB" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={openMapsApp}
                                    className="p-2 bg-green-100 rounded-full"
                                >
                                    <Ionicons name="open-outline" size={16} color="#059669" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Toast Component */}
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({ ...prev, visible: false }))}
            />
        </View>
    );
};

export default LiveLocation;
