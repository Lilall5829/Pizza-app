import { StyleSheet, Text, View, Image } from "react-native";
//@ represent the root directory: FoodOrdering
import Colors from "@constants/Colors";
import { Product } from "@/types";

type ProductListItemProps = {
  product: Product;
};
export const defaultPizzaImage =
  "https://p16-flow-sign-va.ciciai.com/ocean-cloud-tos-us/ed68cf0e763e4993bc8efa195cf0f133.png~tplv-6bxrjdptv7-image.png?rk3s=18ea6f23&x-expires=1739939558&x-signature=%2B9rFwlDL26cRNwOclICZQ823%2BNU%3D";

const ProductListItem = ({ product }: ProductListItemProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </View>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
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
