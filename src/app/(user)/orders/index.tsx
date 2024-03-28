//@ represent the root directory: FoodOrdering
import { FlatList, Text, ActivityIndicator } from "react-native";
import OrderListItem from "@components/OrderListItem";
import { useMyOrderList } from "@/api/orders";

export default function OrderScreen() {
  const { data: orders, isLoading, error } = useMyOrderList();

  // if (!orders) {
  //   return <Text>Product not found</Text>;
  // }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch products</Text>;
  }
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item}></OrderListItem>}
      contentContainerStyle={{ gap: 5, padding: 5 }}
    />
  );
}
