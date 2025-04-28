import { useFonts } from 'expo-font';
import {Stack, useRouter, useSegments} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import "../global.css";
import {useAuthStore} from "@/store/authStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // const router = useRouter();
  // const segments = useSegments();
  //
  // const {checkAuth, user, token} = useAuthStore();
  //
  //   useEffect(() => {
  //       checkAuth();
  //   }, []);
  //
  //   useEffect(() => {
  //       const inAuthScreen = segments[0] === "(auth)";
  //       const isSignedIn = user && token;
  //
  //       if (!isSignedIn && !inAuthScreen) router.replace('/(auth)/welcome');
  //       else if (isSignedIn && inAuthScreen) router.replace('/(tabs)')
  //   }, [user,token, segments]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
          <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
          </Stack>
  );
}

export default RootLayout;
