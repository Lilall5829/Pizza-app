"use client";

import { useInsertOrderItems } from "@/api/order-items";
import { useInsertOrder } from "@/api/orders";
import { processPayment } from "@/lib/stripe";
import { CartItem, Tables } from "@/types";
import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

type Product = Tables<"products">;

type CartType = {
  items: CartItem[];
  addItem: (
    product: Product,
    size: CartItem["size"],
    quantity?: number
  ) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: (deliveryInfo?: DeliveryInfo) => Promise<void>;
};

// 配送信息类型
interface DeliveryInfo {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  instructions?: string;
}

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: async () => {},
});

// Generate a simple UUID for cart items
function generateId(): string {
  return (
    "cart-" + Date.now().toString(36) + Math.random().toString(36).substr(2)
  );
}

// Load cart from localStorage
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("food-ordering-cart");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
    return [];
  }
}

// Save cart to localStorage
function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("food-ordering-cart", JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
}

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    setItems(savedItems);
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(items);
    }
  }, [items, isLoaded]);

  const addItem = (
    product: Product,
    size: CartItem["size"],
    quantity: number = 1
  ) => {
    // Check if item already exists in cart
    const existingItem = items.find(
      (item) => item.product.id === product.id && item.size === size
    );

    if (existingItem) {
      // If item exists, update its quantity
      setItems(
        items.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // If item doesn't exist, create new cart item
      const newCartItem: CartItem = {
        id: generateId(),
        product,
        product_id: product.id,
        size,
        quantity,
      };
      setItems([newCartItem, ...items]);
    }

    if (quantity === 1) {
      toast.success(`${product.name} added to cart`);
    } else {
      toast.success(`${quantity} ${product.name} added to cart`);
    }
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

  const checkout = async (deliveryInfo?: DeliveryInfo) => {
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

      // If payment successful, create order with delivery info
      const orderData: any = {
        total,
      };

      // Add delivery information if provided
      if (deliveryInfo) {
        orderData.customer_name = deliveryInfo.customerName;
        orderData.delivery_phone = deliveryInfo.phone;
        orderData.delivery_address = deliveryInfo.address;
        orderData.delivery_city = deliveryInfo.city;
        orderData.delivery_province = deliveryInfo.province;
        orderData.delivery_postal_code = deliveryInfo.postalCode;
        orderData.delivery_country = deliveryInfo.country;
        orderData.delivery_instructions = deliveryInfo.instructions || null;
      }

      insertOrder(orderData, {
        onSuccess: saveOrderItems,
        onError: (error) => {
          toast.dismiss();
          toast.error("Failed to create order");
          console.error("Order creation failed:", error);
        },
      });
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
