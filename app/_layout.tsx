import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName="(main)/home"
        screenOptions={{ headerShown: false }}
      >
        {/* <Stack.Screen name="(auth)/login" options={{ title: "Login" }} /> */}
        <Stack.Screen name="(main)/home" options={{ title: "Home" }} />
        <Stack.Screen name="(main)/create" options={{ title: "Create" }} />
        <Stack.Screen name="(main)/edit" options={{ title: "Edit" }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
