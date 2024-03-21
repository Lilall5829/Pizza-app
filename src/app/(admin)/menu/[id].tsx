import {
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter, Link } from "expo-router";
import { defaultPizzaImage } from "@/components/ProductListItem";
import { useState } from "react";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useProduct } from "@/api/products";

// shortcut of create a component: rnfe

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();
  // console.log(idString);

  const id = parseFloat(typeof idString == "string" ? idString : idString[0]);
  const { data: product, error, isLoading } = useProduct(id);
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");
  const { addItem } = useCart();
  const router = useRouter();

  // const product = products.find((p) => p.id.toString() == id);

  // const addToCart = () => {
  //   if (!product) {
  //     return;
  //   }
  //   addItem(product, selectedSize);
  //   router.push("/cart");
  // };

  if (!product) {
    return <Text>Product not found</Text>;
  }
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Failed to fetch products</Text>;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Stack.Screen options={{ title: product?.name }} />
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
      />

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "bold",
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});
export default ProductDetailsScreen;
