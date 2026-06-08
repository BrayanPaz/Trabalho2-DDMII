import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="SignUp" options={{ headerShown: false }} />
      <Stack.Screen name="LogIn" options={{ headerShown: false }} />
      <Stack.Screen name="Home" options={{ headerShown: false }} />
      <Stack.Screen name="Add" options={{ headerShown: false }} />
      <Stack.Screen name="Edit" options={{ headerShown: false }} />
    </Stack>
  );
}
