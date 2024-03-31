import { StyleSheet, Text, View, Image, Pressable } from "react-native";
//@ represent the root directory: FoodOrdering
import Colors from "@constants/Colors";
import { Tables } from "@/types";
import { Link, useSegments } from "expo-router";
import RemoteImage from "./RemoteImage";

type ProductListItemProps = {
  product: Tables<"products">;
};

export const defaultPizzaImage =
  "https://p16-flow-sign-va.ciciai.com/ocean-cloud-tos-us/e07c014119634c93be31ff19afbc4149.png~tplv-6bxrjdptv7-image.png?rk3s=18ea6f23&x-expires=1742920030&x-signature=rO03rYWUGHlGKyVnD2SsaNj0Bvk%3D";
const ProductListItem = ({ product }: ProductListItemProps) => {
  const segments = useSegments();

  return (
    <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    maxWidth: "50%",
  },
  image: {
    width: "auto",
    aspectRatio: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});
