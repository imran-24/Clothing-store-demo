import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const navigationContainerRef = useRef(null);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}>
      <ConvexProvider client={convex}>
        <NavigationContainer
          ref={navigationContainerRef}
          onStateChange={(state) => console.log("New state is", state)}
        >
          <Stack>
            <Stack.Screen
              name='(tabs)'
              options={{
                headerShown: false,
                statusBarHidden: false,
                statusBarBackgroundColor: "gray",
              }}
            />
            <Stack.Screen
              name='productDetails'
              options={{
                headerShown: false,
                title: "Product Details",
                statusBarHidden: false,
                statusBarBackgroundColor: "gray",
              }}
            />
            <Stack.Screen
              name='uploadListing'
              options={{
                headerShown: false,
                title: "Upload Product",
                statusBarHidden: false,
                statusBarBackgroundColor: "gray",
              }}
            />
            <Stack.Screen
              name='productList'
              options={{
                headerShown: true,
                title: "Products",
                statusBarHidden: false,
                statusBarBackgroundColor: "gray",
              }}
            />
            <Stack.Screen
              name='adminPage'
              options={{
                headerShown: true,
                title: "Admin Dashboard",
                statusBarHidden: false,
                statusBarBackgroundColor: "gray",
              }}
            />
            <Stack.Screen
              name='imageSearch'
              options={{
                headerShown: true,
                title: "Advanced Search",
                statusBarHidden: false,
                statusBarBackgroundColor: "gray",
              }}
            />
            <Stack.Screen
              name='cartScreen'
              options={{
                headerShown: false,
                statusBarHidden: false,
                statusBarBackgroundColor: "gray",
              }}
            />
            <Stack.Screen
              name='searchResults'
              options={{
                headerShown: false,
                statusBarHidden: false,
                statusBarBackgroundColor: "gray",
              }}
            />
            <Stack.Screen name='+not-found' />
          </Stack>
        </NavigationContainer>
      </ConvexProvider>
    </ThemeProvider>
  );
}
