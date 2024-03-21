import { StyleSheet, Text, View, Image } from "react-native";
//@ represent the root directory: FoodOrdering
import { ActivityIndicator, FlatList } from "react-native";
import ProductListItem from "@components/ProductListItem";
import { useProductList } from "@/api/products";

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch products</Text>;
  }
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
