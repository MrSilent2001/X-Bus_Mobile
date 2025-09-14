import { useFonts } from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import "../global.css";
import {StripeProvider} from "@stripe/stripe-react-native";
import AuthProvider from "@/components/AuthProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_PUBLISHABLE_KEY || "";


    return (
      <StripeProvider publishableKey={publishableKey}>
          <AuthProvider>
              <Stack
                  screenOptions={{ headerShown: false }}
                  initialRouteName="index"
              >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(passenger)" />
                  <Stack.Screen name="(operator)" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="+not-found" />
              </Stack>
          </AuthProvider>
      </StripeProvider>
  );
}

export default RootLayout;
