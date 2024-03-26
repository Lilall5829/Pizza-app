//@ represent the root directory: FoodOrdering
import { FlatList, ActivityIndicator, Text } from "react-native";
import OrderListItem from "@components/OrderListItem";
import { useAdminOrderList } from "@/api/orders";

export default function OrderScreen() {
  const {
    data: orders,
    error,
    isLoading,
  } = useAdminOrderList({ archived: true });

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
