import { Text, View, FlatList, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import orders from "@assets/data/orders";
import OrderListItem from "@components/OrderListItem";
import OrderItemListItem from "@components/OrderItemListItem";

// shortcut of create a component: rnfe

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  const order = orders.find((p) => p.id.toString() == id);
  if (!order) {
    return <Text>Order not found</Text>;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order # ${order?.id.toString()}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => (
          <OrderItemListItem orderItem={item}></OrderItemListItem>
        )}
        contentContainerStyle={{ gap: 5, padding: 5 }}
        //ListHeaderComponent fix the header when scrolling screen
        ListHeaderComponent={() => (
          <OrderListItem order={order}></OrderListItem>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
    // flex: 1,
    padding: 10,
    gap: 20,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "auto",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  size: {
    backgroundColor: "gainsboro",
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
  },
});
export default OrderDetailsScreen;
