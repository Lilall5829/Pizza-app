//@ represent the root directory: FoodOrdering
import { FlatList } from "react-native";
import OrderListItem from "@components/OrderListItem";
import orders from "@assets/data/orders";

export default function OrderScreen() {
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item}></OrderListItem>}
      contentContainerStyle={{ gap: 5, padding: 5 }}
    />
  );
}
