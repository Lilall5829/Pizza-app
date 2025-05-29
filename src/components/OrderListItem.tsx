import { Order } from "@/types/database";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

type OrderListItemProps = {
  order: Order;
  baseUrl?: string;
};

const OrderListItem = ({ order, baseUrl = "/orders" }: OrderListItemProps) => {
  dayjs.extend(relativeTime);
  const timeSinceCreated = dayjs(order.created_at).fromNow();

  return (
    <Link href={`${baseUrl}/${order.id}`} className="block">
      <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Order #{order.id}</h3>
            <p className="text-gray-500 text-sm">{timeSinceCreated}</p>
          </div>
          <span className="font-medium text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-800">
            {order.status}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default OrderListItem;
