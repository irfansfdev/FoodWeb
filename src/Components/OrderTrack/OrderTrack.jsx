import { useState } from "react";
import {
  Clock,
  ChefHat,
  Utensils,
  Bike,
  CheckCircle2,
  MapPin,
  Info,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";

const DEFAULT_ORDER = {
  orderId: "ORD87654321",
  status: "Preparing",
  statusMessage: "Your order is being prepared by the restaurant.",
  timing: {
    pending: "12:45 PM",
    accepted: "12:48 PM",
    preparing: "12:52 PM",
    outForDelivery: "01:20 PM",
    delivered: "--:--",
  },
  restaurant: {
    name: "Tandoori Pizza London",
    cuisine: "Italian • Pizza • Beverages",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80",
    profileUrl: "#",
  },
  items: [
    {
      id: 1,
      name: "Margherita Pizza",
      variant: "Regular • Classic Cheese",
      quantity: 2,
      price: 15.98,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 2,
      name: "Tandoori Paneer Pizza",
      variant: "Regular • Spicy",
      quantity: 1,
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=100&q=80",
    },
    {
      id: 3,
      name: "Coca Cola",
      variant: "330ml",
      quantity: 2,
      price: 2.78,
      image:
        "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=100&q=80",
    },
  ],
  pricing: {
    subtotal: 31.75,
    deliveryFee: 2.5,
    serviceFee: 1.25,
    discount: 5.0,
    total: 30.5,
  },
  delivery: {
    address: "8 Picketts Lock, All Souls, Hertford, Hertfordshire, SG14 1BB, UK",
    mapUrl: "#",
  },
  operationalHours: [
    { day: "Monday", hours: "07:00 AM - 11:00 PM" },
    { day: "Tuesday", hours: "07:00 AM - 11:00 PM" },
    { day: "Wednesday", hours: "07:00 AM - 11:00 PM" },
    { day: "Thursday", hours: "07:00 AM - 11:00 PM" },
    { day: "Friday", hours: "07:00 AM - 11:00 PM" },
    { day: "Saturday", hours: "07:00 AM - 11:00 PM" },
    { day: "Sunday", hours: "07:00 AM - 11:00 PM" },
  ],
  orderHistory: [
    {
      id: "ORD87654321",
      date: "21 May, 2024 at 12:45 PM",
      status: "Processing",
      active: true,
    },
    {
      id: "ORD87543210",
      date: "19 May, 2024 at 07:30 PM",
      status: "Delivered",
      active: false,
    },
    {
      id: "ORD87432109",
      date: "18 May, 2024 at 01:15 PM",
      status: "Delivered",
      active: false,
    },
  ],
  heroImage:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
};

export default function OrderTrack({ orderData = DEFAULT_ORDER }) {
  const [copied, setCopied] = useState(false);

  const steps = [
    { label: "Pending", time: orderData.timing.pending, icon: Clock },
    { label: "Accepted", time: orderData.timing.accepted, icon: ChefHat },
    { label: "Preparing", time: orderData.timing.preparing, icon: Utensils },
    {
      label: "Out for delivery",
      time: orderData.timing.outForDelivery,
      icon: Bike,
    },
    {
      label: "Delivered",
      time: orderData.timing.delivered,
      icon: CheckCircle2,
    },
  ];

  const currentStepIndex = Math.max(
    0,
    steps.findIndex(
      (step) => step.label.toLowerCase() === orderData.status.toLowerCase(),
    ),
  );

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderData.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ================= HERO & ORDERS LIST ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Track Your Order
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Follow your order in real-time and get it delivered fresh & fast.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1">
              <div className="px-5 pt-4 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Your Orders
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {orderData.orderHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                        #{hist.id}
                        {hist.active && (
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{hist.date}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        hist.status === "Processing"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {hist.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-gray-50 text-center">
                <button className="text-sm font-semibold text-orange-500 hover:text-orange-600">
                  View All Orders
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:block rounded-2xl overflow-hidden min-h-[220px]">
            <img
              src={orderData.heroImage}
              alt="Fresh food"
              className="w-full h-full object-cover"
            />
          </div>
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
                      className={`text-sm font-bold ${isActive ? "text-orange-600" : "text-gray-800"}`}
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

          {orderData.statusMessage && (
            <div className="mt-6 flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0">
                <Info className="w-3.5 h-3.5" />
              </span>
              <p className="text-sm text-orange-700 font-medium">
                {orderData.statusMessage}
              </p>
            </div>
          )}
        </div>

        {/* ================= ORDER DETAILS ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={orderData.restaurant.image}
                alt={orderData.restaurant.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {orderData.restaurant.name}
                </h2>
                <p className="text-xs text-gray-400">
                  {orderData.restaurant.cuisine}
                </p>
              </div>
            </div>
            <a
              href={orderData.restaurant.profileUrl}
              className="text-xs font-semibold text-orange-500 border border-orange-200 rounded-full px-4 py-2 hover:bg-orange-50 whitespace-nowrap"
            >
              View Restaurant
            </a>
          </div>

          <div className="px-6 pt-5 pb-2">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-bold uppercase text-gray-400">
                Items
              </h3>
              <span className="text-xs text-gray-300 font-mono">
                #{orderData.orderId}
              </span>
              <button
                onClick={copyOrderId}
                className="text-gray-400 hover:text-gray-600"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="px-6 pb-4 space-y-4">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-semibold text-gray-800">
                    {item.name}
                  </h5>
                  <p className="text-xs text-gray-400">{item.variant}</p>
                </div>
                <span className="text-sm font-bold text-gray-800">
                  £{item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50/60 p-6 border-t border-gray-100 space-y-2.5 text-sm text-gray-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-800">
                £{orderData.pricing.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-medium text-gray-800">
                £{orderData.pricing.deliveryFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span className="font-medium text-gray-800">
                £{orderData.pricing.serviceFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Discount</span>
              <span className="font-medium">
                - £{orderData.pricing.discount.toFixed(2)}
              </span>
            </div>
            <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center text-base font-bold text-gray-900">
              <span>Total Paid</span>
              <span className="text-xl font-extrabold text-orange-600">
                £{orderData.pricing.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* ================= DELIVERY INFO & OPERATIONAL TIMES ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-700" />
              <h3 className="text-sm font-bold text-gray-900">
                Delivery Information
              </h3>
            </div>
            <p className="text-xs font-bold uppercase text-gray-400 mb-1">
              Delivery Address
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              {orderData.delivery.address}
            </p>
            <a
              href={orderData.delivery.mapUrl}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 border border-orange-200 rounded-full px-4 py-2 hover:bg-orange-50"
            >
              View on Map
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4" />
              <h3 className="text-sm font-bold">Operational Times</h3>
            </div>
            <div className="space-y-2">
              {orderData.operationalHours.map((entry) => (
                <div
                  key={entry.day}
                  className="flex justify-between text-xs text-gray-300"
                >
                  <span className="font-semibold text-white">
                    {entry.day}:
                  </span>
                  <span>{entry.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}