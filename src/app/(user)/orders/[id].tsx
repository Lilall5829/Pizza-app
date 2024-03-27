import {
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import OrderListItem from "@components/OrderListItem";
import OrderItemListItem from "@components/OrderItemListItem";
import { useOrderDetails } from "@/api/orders";

// shortcut of create a component: rnfe

const OrderDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString == "string" ? idString : idString[0]);

  const { data: order, isLoading, error } = useOrderDetails(id);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch products</Text>;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order # ${id}` }} />

      <FlatList
        data={order?.order_items}
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
