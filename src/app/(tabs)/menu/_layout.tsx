import { Stack } from "expo-router";

export default function MenuStack() {
  return (
    <Stack>
      // name is index
      <Stack.Screen name="index" options={{ title: "Menu" }} />
    </Stack>
  );
}
