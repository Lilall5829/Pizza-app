import { StyleSheet, Text, View, Image } from "react-native";
//@ represent the root directory: FoodOrdering
import products from "@assets/data/products";
import ProductListItem from "@components/ProductListItem";

export default function MenuScreen() {
  return (
    <View>
      <ProductListItem product={products[0]}></ProductListItem>
      <ProductListItem product={products[1]}></ProductListItem>
    </View>
  );
}
