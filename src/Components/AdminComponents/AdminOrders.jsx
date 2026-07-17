import React from "react";
import { X } from "lucide-react";

export default function AdminOrders({ orders, handleUpdateOrderStatus }) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200/80 flex justify-between items-center">
        <h3 className="font-bold text-brand-dark">Active System Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200/80 text-gray-500 font-bold text-xs uppercase tracking-wider">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Restaurant</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr
                key={order.order_id}
                className="hover:bg-gray-50/30 transition-colors"
              >
                <td className="px-6 py-4 font-mono font-bold text-brand-dark">
                  {order.order_id}
                </td>

                {/* FIXED: Extracted the .name from the customer object */}
                <td className="px-6 py-4 font-semibold">
                  {order.status_history?.[0]?.changed_by?.username || "Guest"}
                </td>

                {/* FIXED: Extracted the .name from the restaurant object */}
                <td className="px-6 py-4 text-gray-600">
                  {order.restaurant?.name || "Unknown Restaurant"}
                </td>

                {/* SAFEGUARD: Checks if items is an array of objects to prevent crashes */}
                <td className="px-6 py-4 text-gray-500 text-xs truncate max-w-xs">
                  {Array.isArray(order.items)
                    ? order.items
                        .map(
                          (item) => item.name || item.menu_item?.name || "Item",
                        )
                        .join(", ")
                    : order.items || "N/A"}
                </td>

                {/* ALREADY FIXED: The price calculation */}
                <td className="px-6 py-4 font-bold text-brand-dark">
                  Rs.{parseFloat(order.total_price || 0).toFixed(2)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      order.current_status === "delivered"
                        ? "bg-green-50 text-brand-green border border-green-200"
                        : order.current_status === "preparing" ||
                            order.current_status === "accepted"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : order.current_status === "pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {order.current_status.replace("_", " ")}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-1.5 justify-end">
                    {order.current_status === "pending" && (
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order.order_id, "accepted")
                        }
                        className="px-2.5 py-1 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange/90 rounded-lg transition-colors"
                      >
                        Accept
                      </button>
                    )}
                    {order.current_status === "accepted" && (
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order.order_id, "preparing")
                        }
                        className="px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Prepare
                      </button>
                    )}
                    {order.current_status === "preparing" && (
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(
                            order.order_id,
                            "out_for_delivery",
                          )
                        }
                        className="px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                      >
                        Send Out
                      </button>
                    )}
                    {order.current_status === "out_for_delivery" && (
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order.order_id, "delivered")
                        }
                        className="px-2.5 py-1 text-xs font-bold text-white bg-brand-green hover:bg-brand-green/95 rounded-lg transition-colors"
                      >
                        Deliver
                      </button>
                    )}
                    {!["delivered", "cancelled"].includes(
                      order.current_status,
                    ) && (
                      <button
                        onClick={() =>
                          handleUpdateOrderStatus(order.order_id, "cancelled")
                        }
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                        title="Cancel Order"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {["delivered", "cancelled"].includes(
                      order.current_status,
                    ) && (
                      <span className="text-xs text-gray-400 font-medium px-2">
                        —
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
