import { CheckCircle, ChefHat, Truck, MapPin, ShoppingBag, Image as ImageIcon } from "lucide-react";

export default function OrderDetails({ orderData, safeString, safeImage }) {
  const currentOrderId = orderData.order_id || orderData.id;
  const currentStatus = safeString(orderData.current_status || orderData.status, "pending");
  const restaurantName = safeString(orderData.restaurant, "Restaurant");
  const itemsList = orderData.items || [];
  const totalPrice = orderData.total_price || "0.00";
  const deliveryAddress = safeString(orderData.delivery_address || orderData.address, "Provided on checkout");

  const getStatusLevel = (status) => {
    switch (String(status).toLowerCase()) {
      case "pending":
      case "accepted": return 1;
      case "preparing": return 2;
      case "out_for_delivery": return 3;
      case "delivered": return 4;
      default: return 1;
    }
  };

  const currentLevel = getStatusLevel(currentStatus);

  return (
    <div className="w-full md:w-2/3">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Order Tracking</h1>
            <p className="text-gray-500 mt-1">
              Order #{currentOrderId} • <span className="text-orange-500 font-semibold">{restaurantName}</span>
            </p>
          </div>
        </div>

        {/* Simplified Progress Timeline */}
        <div className="relative py-6 pl-2 md:pl-6">
          <div className="absolute left-8 md:left-12 top-10 bottom-10 w-0.5 bg-gray-200 z-0"></div>
          <div 
            className="absolute left-8 md:left-12 top-10 w-0.5 bg-orange-500 z-0 transition-all duration-500"
            style={{ height: `${(currentLevel - 1) * 33}%` }}
          ></div>

          <div className="space-y-10 relative z-10">
            {/* Step 1 */}
            <div className={`flex items-center gap-6 ${currentLevel >= 1 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${currentLevel >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${currentLevel >= 1 ? 'text-gray-900' : 'text-gray-500'}`}>Order Confirmed</h3>
                <p className="text-gray-500 text-sm">We have received your order.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`flex items-center gap-6 ${currentLevel >= 2 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${currentLevel >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <ChefHat size={24} />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${currentLevel >= 2 ? 'text-gray-900' : 'text-gray-500'}`}>Preparing Food</h3>
                <p className="text-gray-500 text-sm">Your order is being prepared in the kitchen.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`flex items-center gap-6 ${currentLevel >= 3 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${currentLevel >= 3 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Truck size={24} />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${currentLevel >= 3 ? 'text-gray-900' : 'text-gray-500'}`}>Out for Delivery</h3>
                <p className="text-gray-500 text-sm">Your rider is on the way.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`flex items-center gap-6 ${currentLevel >= 4 ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${currentLevel >= 4 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${currentLevel >= 4 ? 'text-gray-900' : 'text-gray-500'}`}>Delivered</h3>
                <p className="text-gray-500 text-sm">Enjoy your meal!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Item List Overview with Images */}
        {itemsList.length > 0 && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-orange-500" /> Items Ordered
            </h4>
            <div className="space-y-4">
              {itemsList.map((item, idx) => {
                const itemName = safeString(item.name || item, "Item");
                const itemImage = safeImage(item.image || item.product?.image || item.menu_item?.image || item);
                const itemPrice = parseFloat(item.subtotal || item.price || 0).toFixed(2);
                
                return (
                  <div key={item.id || idx} className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {/* 📸 Item Image (White bg & Icon if missing) */}
                    <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center">
                      {itemImage ? (
                        <img src={itemImage} alt={itemName} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-gray-300" size={24} />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-base">{itemName}</p>
                      <p className="text-gray-500 text-xs mt-0.5">Qty: {item.quantity || 1}</p>
                    </div>

                    <div className="font-bold text-gray-900 text-base">£{itemPrice}</div>
                  </div>
                );
              })}
              
              <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100 mt-4">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-extrabold text-orange-600 text-xl">£{parseFloat(totalPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Details Footer */}
        <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h4 className="font-bold text-gray-900 mb-2">Delivery Details</h4>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Address:</span> {deliveryAddress}
          </p>
        </div>

      </div>
    </div>
  );
}