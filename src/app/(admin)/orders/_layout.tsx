import { Stack, Link } from "expo-router";

export default function OrderLayout() {
  return (
    <Stack>
      // name is index
      {/* <Stack.Screen name="index" options={{ title: "Orders" }} /> */}
      <Stack.Screen name="list" options={{ headerShown: false }} />
    </Stack>
  );
}
