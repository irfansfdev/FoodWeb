import { useState } from "react";
import {
  Clock,
  ChefHat,
  Utensils,
  Bike,
  CheckCircle2,
  MapPin,
  Copy,
  Check,
} from "lucide-react";

// Fallback matching your exact API structure so the UI doesn't break while loading
const FALLBACK_ORDER = {
  order_id: "ORD-00000",
  restaurant: "Loading Restaurant...",
  items: [],
  total_price: "0.00",
  current_status: "Pending",
  delivery_address: "Loading address...",
  status_history: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function OrderTrack({ orderData = FALLBACK_ORDER }) {
  const [copied, setCopied] = useState(false);

  // Helper function to extract timestamps from the status_history array
  const getTimeForStatus = (statusName) => {
    if (!orderData.status_history) return "--:--";
    const record = orderData.status_history.find(
      (h) => h.status.toLowerCase() === statusName.toLowerCase()
    );
    if (!record) return "--:--";
    
    // Format timestamp to localized time (e.g. 12:45 PM)
    return new Date(record.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const steps = [
    { label: "Pending", time: getTimeForStatus("Pending"), icon: Clock },
    { label: "Accepted", time: getTimeForStatus("Accepted"), icon: ChefHat },
    { label: "Preparing", time: getTimeForStatus("Preparing"), icon: Utensils },
    {
      label: "Out for delivery",
      time: getTimeForStatus("Out for delivery"),
      icon: Bike,
    },
    {
      label: "Delivered",
      time: getTimeForStatus("Delivered"),
      icon: CheckCircle2,
    },
  ];

  const currentStepIndex = Math.max(
    0,
    steps.findIndex(
      (step) => step.label.toLowerCase() === (orderData.current_status || "").toLowerCase()
    )
  );

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderData.order_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate Subtotal dynamically from items array
  const calculatedSubtotal = orderData.items?.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Track Your Order
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Follow your order in real-time and get it delivered fresh & fast.
          </p>
        </div>

        {/* ================= STEPPER ================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div
                  key={step.label}
                  className="flex md:flex-col items-center flex-1 w-full relative z-10"
                >
                  {index < steps.length - 1 && (
                    <>
                      <div className="hidden md:block absolute left-[50%] right-[-50%] top-6 h-1 bg-gray-100 -z-10">
                        <div
                          className="h-full bg-orange-500 transition-all duration-500"
                          style={{
                            width:
                              index < currentStepIndex
                                ? "100%"
                                : isActive
                                  ? "50%"
                                  : "0%",
                          }}
                        />
                      </div>
                      <div className="block md:hidden absolute left-6 top-12 bottom-[-16px] w-1 bg-gray-100 -z-10">
                        <div
                          className="w-full bg-orange-500 transition-all duration-500"
                          style={{
                            height: index < currentStepIndex ? "100%" : "0%",
                          }}
                        />
                      </div>
                    </>
                  )}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 ${
                      isActive
                        ? "bg-orange-500 border-orange-600 text-white scale-110"
                        : isCompleted
                          ? "bg-orange-100 border-orange-500 text-orange-600"
                          : "bg-white border-gray-200 text-gray-400"
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div className="ml-4 md:ml-0 md:mt-3 text-left md:text-center">
                    <p
                      className={`text-sm font-bold ${
                        isActive ? "text-orange-600" : "text-gray-800"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      {step.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= ORDER DETAILS ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
               <Utensils className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {orderData.restaurant}
              </h2>
              <p className="text-xs text-gray-400 flex items-center gap-2">
                Order Placed: {new Date(orderData.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="px-6 pt-5 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-gray-400">
              Items
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-mono">
                #{orderData.order_id}
              </span>
              <button
                onClick={copyOrderId}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy Order ID"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="px-6 pb-4 space-y-4">
            {orderData.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image?.startsWith("http") ? item.image : `http://127.0.0.1:8000${item.image}`}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                  />
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-gray-800">
                    {item.name}
                  </h5>
                  {item.type && (
                    <p className="text-xs text-gray-400">{item.type}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-800 block">
                    £{Number(item.subtotal).toFixed(2)}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-xs text-gray-400">
                      (£{Number(item.price_at_order).toFixed(2)} each)
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {orderData.items?.length === 0 && (
              <p className="text-sm text-gray-500 italic">No items found for this order.</p>
            )}
          </div>

          <div className="bg-gray-50/60 p-6 border-t border-gray-100 space-y-2.5 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-800">
                £{calculatedSubtotal.toFixed(2)}
              </span>
            </div>
            
            {/* Removed missing fees based on API mapping. Only showing Subtotal and Final Total. */}

            <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center text-base font-bold text-gray-900">
              <span>Total Paid</span>
              <span className="text-xl font-extrabold text-orange-600">
                £{Number(orderData.total_price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ================= DELIVERY INFO ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-700" />
            <h3 className="text-sm font-bold text-gray-900">
              Delivery Information
            </h3>
          </div>
          <p className="text-xs font-bold uppercase text-gray-400 mb-1">
            Delivery Address
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {orderData.delivery_address || "No delivery address provided."}
          </p>
        </div>

      </div>
    </div>
  );
}