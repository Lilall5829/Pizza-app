import { Text, View } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
// shortcut of create a component: rnfe
const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Stack.Screen options={{ title: "Details:" + id }} />
      <Text style={{ fontSize: 20 }}>ProductDetailsScreen for id: {id}</Text>
    </View>
  );
};

export default ProductDetailsScreen;
