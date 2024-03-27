import { CartItem, Tables } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "@/api/orders";
import { useRouter } from "expo-router";
type Product = Tables<"products">;
type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  // total: number;
  totalRounded: number;
  checkout: () => void;
};

export const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  // total: 0,
  totalRounded: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const { mutate: insertOrder } = useInsertOrder();

  const router = useRouter();

  const addItem = (product: Product, size: CartItem["size"]) => {
    // if already in cart, increment quantity rather than duplicate it!
    const existingItem = items.find(
      (item) => item.product == product && item.size == size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  // updateQuantity
  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems(
      items
        .map((item) =>
          item.id != itemId
            ? item
            : { ...item, quantity: item.quantity + amount }
        )
        // filter the item whose quantity < 0
        .filter((item) => item.quantity > 0)
    );
  };
  // calculate
  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );

  const totalRounded = Number(total.toFixed(3));

  const clearCart = () => {
    setItems([]);
  };

  const checkout = () => {
    insertOrder(
      { totalRounded },
      {
        onSuccess: (data) => {
          console.log(data);

          clearCart();
          router.push(`/(user)/orders/${data.id}`);
        },
      }
    );
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, totalRounded, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => useContext(CartContext);
