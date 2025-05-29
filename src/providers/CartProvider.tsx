"use client";

import { useInsertOrderItems } from "@/api/order-items";
import { useInsertOrder } from "@/api/orders";
import { processPayment } from "@/lib/stripe";
import { CartItem, Tables } from "@/types";
import { useRouter } from "next/navigation";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

type Product = Tables<"products">;
type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

export const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

// Generate a simple UUID for cart items
function generateId(): string {
  return (
    "cart-" + Date.now().toString(36) + Math.random().toString(36).substr(2)
  );
}

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

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
      id: generateId(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
    toast.success(`${product.name} added to cart`);
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
  const totalInit = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );

  const total = Number(totalInit.toFixed(2));

  const clearCart = () => {
    setItems([]);
  };

  const checkout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    toast.loading("Processing your payment...");

    try {
      // Process payment first
      const paymentResult = await processPayment(Math.floor(total * 100));

      if (!paymentResult.success) {
        toast.dismiss();
        toast.error(paymentResult.error || "Payment failed");
        return;
      }

      // If payment successful, create order
      insertOrder(
        { total },
        {
          onSuccess: saveOrderItems,
          onError: (error) => {
            toast.dismiss();
            toast.error("Failed to create order");
            console.error("Order creation failed:", error);
          },
        }
      );
    } catch (error) {
      toast.dismiss();
      toast.error("Payment processing failed");
      console.error("Payment error:", error);
    }
  };

  const saveOrderItems = (order: Tables<"orders">) => {
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size,
    }));

    insertOrderItems(orderItems, {
      onSuccess() {
        toast.dismiss();
        toast.success("Order placed successfully!");
        clearCart();
        router.push(`/orders/${order.id}`);
      },
      onError: (error) => {
        toast.dismiss();
        toast.error("Failed to save order items");
        console.error("Order items creation failed:", error);
      },
    });
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
export const useCart = () => useContext(CartContext);
