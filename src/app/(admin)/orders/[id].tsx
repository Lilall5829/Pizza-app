import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { OrderStatusList, OrderStatus } from "@/types";
import Colors from "@constants/Colors";
import OrderListItem from "@components/OrderListItem";
import OrderItemListItem from "@components/OrderItemListItem";
import { useOrderDetails, useUpdateOrder } from "@/api/orders";

const OrderDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString == "string" ? idString : idString[0]);

  const { data: order, isLoading, error } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();
  const [selectedStatus, setSelectedStatus] = useState(order?.status);

  const updateStatus = (status: string) => {
    updateOrder({ id: id, updateFields: { status } });
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error || !order) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order # ${id}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => (
          <OrderItemListItem item={item}></OrderItemListItem>
        )}
        contentContainerStyle={{ gap: 5, padding: 5 }}
        //ListHeaderComponent fix the header when scrolling screen
        ListHeaderComponent={() => (
          <OrderListItem order={order}></OrderListItem>
        )}
        ListFooterComponent={() => (
          <View>
            <Text style={{ fontWeight: "bold" }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  onPress={() => {
                    console.warn("Update status");
                    setSelectedStatus(status);
                    updateStatus(status);
                  }}
                  key={status}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      selectedStatus === status
                        ? Colors.light.tint
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedStatus === status ? "white" : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
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
