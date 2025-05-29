import React from "react";
import { OrderItem, Product } from "../types";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

type OrderItemListItemProps = {
  item: OrderItem & { products: Product };
};

const OrderItemListItem = ({ item }: OrderItemListItemProps) => {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm">
      <div className="w-16 h-16 relative flex-shrink-0">
        <RemoteImage
          path={item.products.image}
          fallback={defaultPizzaImage}
          alt={item.products.name}
          fill
          className="object-contain"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-gray-900 mb-1">{item.products.name}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-bold text-primary-500">
            ${item.products.price.toFixed(2)}
          </span>
          <span>Size: {item.size}</span>
        </div>
      </div>

      <div className="text-right">
        <span className="font-medium text-lg text-gray-900">
          Qty: {item.quantity}
        </span>
      </div>
    </div>
  );
};

export default OrderItemListItem;
