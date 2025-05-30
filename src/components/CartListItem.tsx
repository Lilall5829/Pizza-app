"use client";

import { useCart } from "@/providers/CartProvider";
import { CartItem } from "@/types";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";

interface CartListItemProps {
  item: CartItem;
}

export default function CartListItem({ item }: CartListItemProps) {
  const { updateQuantity } = useCart();

  const handleRemoveItem = () => {
    // Remove all quantity of this item
    for (let i = 0; i < item.quantity; i++) {
      updateQuantity(item.id, -1);
    }
  };

  return (
    <div className="flex items-center space-x-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          {item.product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-1">Size: {item.size}</p>
        <p className="text-sm text-gray-900 font-medium">
          ${item.product.price.toFixed(2)} each
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.id, -1)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>

        <button
          onClick={() => updateQuantity(item.id, 1)}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Price and Remove */}
      <div className="text-right flex items-center space-x-3">
        <div>
          <p className="text-sm font-medium text-gray-900">
            ${(item.product.price * item.quantity).toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleRemoveItem}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          aria-label="Remove item"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
