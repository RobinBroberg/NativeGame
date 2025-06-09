import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // <- hides the header
      }}
    >
      <Stack.Screen name="index" options={{ title: "Welcome" }} />
      <Stack.Screen name="Game" options={{ title: "GyroBounce" }} />
    </Stack>
  );
}
