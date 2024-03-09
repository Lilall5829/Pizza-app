import { StyleSheet, Text, View, Image } from "react-native";
//@ represent the root directory: FoodOrdering
import { FlatList } from "react-native";
import products from "@assets/data/products";
import ProductListItem from "@components/ProductListItem";

export default function MenuScreen() {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductListItem product={item}></ProductListItem>
      )}
      numColumns={2}
      contentContainerStyle={{ gap: 5, padding: 5 }}
      columnWrapperStyle={{ gap: 5 }}
    />
  );
}
