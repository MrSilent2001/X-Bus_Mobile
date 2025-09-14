import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { parseJwt } from '@/util/parseJwt';

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { user, token, isInitialized, initializeAuth } = useAuthStore();
    const segments = useSegments();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAppReady, setIsAppReady] = useState(false);

    // Initialize auth state
    useEffect(() => {
        const initializeApp = async () => {
            try {
                setIsLoading(true);
                await initializeAuth();
            } catch (error) {
                console.log("App initialization error:", error);
            } finally {
                setIsLoading(false);
                // Add a small delay to ensure Root Layout is mounted
                setTimeout(() => setIsAppReady(true), 200);
            }
        };

        if (!isInitialized) {
            initializeApp();
        } else {
            setIsLoading(false);
            setTimeout(() => setIsAppReady(true), 200);
        }
    }, [isInitialized]);

    // Handle navigation after app is ready
    useEffect(() => {
        if (!isAppReady || !isInitialized) return;

        const handleNavigation = async () => {
            try {
                // Add a small delay to ensure router is ready
                await new Promise(resolve => setTimeout(resolve, 50));

                if (token) {
                    const decodedToken = parseJwt(token);
                    const role = decodedToken.role;

                    // Route based on role
                    try {
                        if (role === "passenger") {
                            router.replace("/(passenger)/(tabs)/home");
                        } else if (role === "operator") {
                            router.replace("/(operator)/(tabs)/home");
                        } else {
                            router.replace("/(auth)/welcome");
                        }
                    } catch (navError) {
                        console.log("Navigation error:", navError);
                        // Fallback to welcome screen
                        router.replace("/(auth)/welcome");
                    }
                } else {
                    try {
                        router.replace("/(auth)/welcome");
                    } catch (navError) {
                        console.log("Navigation error:", navError);
                    }
                }
            } catch (error) {
                console.log("Token parsing error:", error);
                router.replace("/(auth)/welcome");
            }
        };

        handleNavigation();
    }, [isAppReady, isInitialized, token]);

    // Handle authentication state changes
    useEffect(() => {
        if (!isInitialized || !isAppReady) return;

        const handleRouteGuard = async () => {
            try {
                // Add a small delay to ensure router is ready
                await new Promise(resolve => setTimeout(resolve, 50));

                const inAuthGroup = segments[0] === '(auth)';
                const inPassengerGroup = segments[0] === '(passenger)';
                const inOperatorGroup = segments[0] === '(operator)';

                if (!user || !token) {
                    // User is not authenticated, redirect to auth
                    if (!inAuthGroup) {
                        try {
                            router.replace('/(auth)/welcome');
                        } catch (navError) {
                            console.log("Navigation error in route guard:", navError);
                        }
                    }
                } else {
                    // User is authenticated
                    try {
                        const decodedToken = parseJwt(token);
                        const role = decodedToken.role;

                        if (inAuthGroup) {
                            // User is authenticated but on auth screen, redirect to appropriate home
                            try {
                                if (role === "passenger") {
                                    router.replace("/(passenger)/(tabs)/home");
                                } else if (role === "operator") {
                                    router.replace("/(operator)/(tabs)/home");
                                }
                            } catch (navError) {
                                console.log("Navigation error in route guard:", navError);
                            }
                        } else if (inPassengerGroup && role !== "passenger") {
                            // User is passenger but on operator screen
                            try {
                                router.replace("/(passenger)/(tabs)/home");
                            } catch (navError) {
                                console.log("Navigation error in route guard:", navError);
                            }
                        } else if (inOperatorGroup && role !== "operator") {
                            // User is operator but on passenger screen
                            try {
                                router.replace("/(operator)/(tabs)/home");
                            } catch (navError) {
                                console.log("Navigation error in route guard:", navError);
                            }
                        }
                    } catch (error) {
                        console.log("Token parsing error in route guard:", error);
                        try {
                            router.replace('/(auth)/welcome');
                        } catch (navError) {
                            console.log("Navigation error in route guard:", navError);
                        }
                    }
                }
            } catch (error) {
                console.log("Route guard error:", error);
            }
        };

        handleRouteGuard();
    }, [user, token, segments, isInitialized, isAppReady]);

    if (isLoading || !isInitialized || !isAppReady) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return <>{children}</>;
};

export default AuthProvider;

