import { Redirect, Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="add/index" />
      <Stack.Screen name="add-info/index" />
      <Stack.Screen name="chat/index" />
    </Stack>
  );
}
