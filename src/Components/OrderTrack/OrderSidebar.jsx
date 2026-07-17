import { ChevronRight, Image as ImageIcon } from "lucide-react";

export default function OrderSidebar({ allOrders, currentOrderId, onSelectOrder, safeString, safeImage }) {
  return (
    <div className="w-full md:w-1/3 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-900 px-1">Your Orders</h2>
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-2">
        {allOrders.map((order) => {
          const oId = order.order_id || order.id;
          const isActive = String(oId) === String(currentOrderId);
          const oStatus = safeString(order.current_status || order.status, "pending");
          const oRest = safeString(order.restaurant, "Restaurant");
          
          // 📸 Fetch Thumbnail
          const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
          const orderThumbnail = firstItem 
            ? safeImage(firstItem.image || firstItem.product?.image || firstItem.menu_item?.image || firstItem) 
            : null;
          
          return (
            <div 
              key={oId}
              onClick={() => onSelectOrder(oId)}
              className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center gap-4 ${
                isActive 
                  ? "border-orange-500 bg-orange-50 shadow-sm" 
                  : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
              }`}
            >
              {/* Thumbnail Image (White bg & Icon if missing) */}
              <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                {orderThumbnail ? (
                  <img src={orderThumbnail} alt={oRest} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-gray-300" size={24} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm mb-1 truncate">Order #{oId}</p>
                <p className="text-gray-500 text-xs mb-2 truncate">{oRest}</p>
                <span className={`inline-block text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                  oStatus.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {oStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <ChevronRight size={20} className={isActive ? "text-orange-500 shrink-0" : "text-gray-300 shrink-0"} />
            </div>
          );
        })}
      </div>
    </div>
  );
}