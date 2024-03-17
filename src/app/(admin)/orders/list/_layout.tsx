import { Tabs, withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function OrderListNavigator() {
  return (
    // if do not set edges, the bottom will show white space, not good looking
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "white" }}>
      <TopTabs>
        <TopTabs.Screen name="index" options={{ title: "Active" }} />
      </TopTabs>
    </SafeAreaView>
  );
}
