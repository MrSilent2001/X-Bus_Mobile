import {TextInputProps, TouchableOpacityProps} from "react-native";

//====================================Auth============================================
interface AuthResponse {
    success: boolean;
    error?: string;
}

interface User {
    name: string;
    email: string;
    nic:string;
    contactNo: string;
    password?: string;
    confirmPassword?: string;
    profilePicture: string;
    role?: string;
}

interface LoginPayload {
    identifier: string;
    password: string;
}

interface authType{
    user: User | null
    token: string |null
    isLoading: boolean
    isInitialized: boolean
    setUser: (user: User) => void;
    login: (payload: LoginPayload) => Promise<AuthResponse>
    signup: (payload: User) => Promise<AuthResponse>
    checkAuth: () => Promise<{ isAuthenticated: boolean; user?: User; token?: string }>
    initializeAuth: () => Promise<{ isAuthenticated: boolean; user?: User; token?: string }>
    logout: () => Promise<{ success: boolean; error?: string }>
    clearAuthData: () => Promise<void>
}

interface Bus{
    id: number;
    regNo?: string;
    ownerId: string;
    fleetName: string;
    routeNo?: string;
    route?: string;
    seatingCapacity?: number;
    busFare: string;
    password: string;
    profilePicture: string;
}
interface BusSchedule {
    id?: number;
    date: string;
    scheduledTime: string;
    regNo?: string;
    seatingCapacity: number;
    route?: string;
    routeNo?: string;
    busId: number;
}

interface Feedback {
    passengerName: string;
    message: string;
}

interface FeedbackResponse{
    passengerName: string;
    message: string;
    createdAt: string;
    time:string
}

interface LostnFoundData{
    userName: string;
    contactNo: string;
    description?: string;
    date: string;
    time: string;
    status: string;
}

type PaymentData = {
    id: number;
    date: string;
    amount: number;
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    schedule: {
        id: number;
        date: string;
        scheduledTime: string;
        bus: {
            id: number;
            regNo: string;
            fleetName: string;
            routeNo: string;
            route: string;
        };
    };
};

type BusPaymentData = {
    id: number;
    date: string;
    amount: number;
    status: string;
    user: {
        id: number;
        name: string;
        nic: string;
        contactNo: string;
        email: string;
        password: string;
        profilePicture: string;
        role: string;
    };
    schedule: {
        id: number;
        date: string;
        scheduledTime: string;
        seatingCapacity: number;
        totalIncome: number;
    };
    bus: {
        id: number;
        ownerId: string;
        regNo: string;
        fleetName: string;
        routeNo: string;
        route: string;
        seatingCapacity: number;
        busFare: string;
        password: string;
        profilePicture: string;
    };
}

declare interface MarkerData {
    latitude: number;
    longitude: number;
    id: number;
    title: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: number;
    first_name: string;
    last_name: string;
    time?: number;
    price?: string;
}

declare interface MapProps {
    destinationLatitude?: number;
    destinationLongitude?: number;
    onDriverTimesCalculated?: (driversWithTimes: MarkerData[]) => void;
    selectedDriver?: number | null;
    onMapReady?: () => void;
}

declare interface Ride {
    origin_address: string;
    destination_address: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_latitude: number;
    destination_longitude: number;
    ride_time: number;
    fare_price: number;
    payment_status: string;
    driver_id: number;
    user_email: string;
    created_at: string;
    driver: {
        first_name: string;
        last_name: string;
        car_seats: number;
    };
}

declare interface ButtonProps extends TouchableOpacityProps {
    title: string;
    bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
    textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
    IconLeft?: React.ComponentType<any>;
    IconRight?: React.ComponentType<any>;
    className?: string;
}

declare interface GoogleInputProps {
    icon?: string;
    initialLocation?: string;
    containerStyle?: string;
    textInputBackgroundColor?: string;
    handlePress: ({
                      latitude,
                      longitude,
                      address,
                  }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

declare interface InputFieldProps extends TextInputProps {
    label: string;
    icon?: any;
    secureTextEntry?: boolean;
    labelStyle?: string;
    containerStyle?: string;
    inputStyle?: string;
    iconStyle?: string;
    className?: string;
}

declare interface LocationStore {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLatitude: number | null;
    destinationLongitude: number | null;
    destinationAddress: string | null;
    setUserLocation: ({
                          latitude,
                          longitude,
                          address,
                      }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
    setDestinationLocation: ({
                                 latitude,
                                 longitude,
                                 address,
                             }: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}
