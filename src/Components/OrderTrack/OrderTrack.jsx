import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Clock } from "lucide-react"; 

import OrderSidebar from "../OrderTrack/OrderSidebar";
import OrderDetails from "../OrderTrack/OrderDetail";

const API_URL = "http://127.0.0.1:8000/order/orders/"; 
const BACKEND_BASE_URL = "http://127.0.0.1:8000"; 

// Helpers (passed to children as props)
const safeString = (val, fallback = "") => {
  if (!val) return fallback;
  if (typeof val === "object") return val.name || val.title || val.address_line1 || val.address || fallback;
  return String(val);
};

const safeImage = (val) => {
  if (!val) return null; // 👈 Returns null instead of fallback image now
  
  let imgStr = typeof val === "object" ? (val.image || val.url || val.photo || null) : String(val);
  
  if (!imgStr || imgStr === "null" || imgStr === "undefined") return null;
  if (imgStr.startsWith("/")) return `${BACKEND_BASE_URL}${imgStr}`;
  return imgStr;
};

export default function OrderTrack() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [allOrders, setAllOrders] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("Please log in to track your order.");
      navigate("/login");
      return;
    }

    const fetchOrderFromList = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Could not load your orders.");

        const rawData = await response.json();
        let ordersArray = [];
        
        if (rawData && typeof rawData === "object" && Array.isArray(rawData.data)) {
          ordersArray = rawData.data;
        } else if (Array.isArray(rawData)) {
          ordersArray = rawData;
        } else if (rawData && typeof rawData === "object") {
          if (Array.isArray(rawData.results)) ordersArray = rawData.results;
          else if (Array.isArray(rawData.orders)) ordersArray = rawData.orders;
          else {
            const dynamicArrayKey = Object.keys(rawData).find(key => Array.isArray(rawData[key]));
            if (dynamicArrayKey) ordersArray = rawData[dynamicArrayKey];
          }
        }

        if (!ordersArray || ordersArray.length === 0) {
          setIsLoading(false);
          return;
        }

        setAllOrders(ordersArray); 

        let targetOrder = null;
        const hasValidId = id && id !== ":id" && id !== "undefined" && id !== "null";

        if (hasValidId) {
          targetOrder = ordersArray.find((o) => o && (String(o.order_id) === String(id) || String(o.id) === String(id)));
        } else {
          targetOrder = ordersArray[0];
          if (targetOrder) {
            const fallbackId = targetOrder.order_id || targetOrder.id;
            if (fallbackId) navigate(`/orderTrack/${fallbackId}`, { replace: true });
          }
        }

        if (targetOrder) {
          setOrderData(targetOrder);
        } else {
          const fallbackOrder = ordersArray[0];
          const fallbackId = fallbackOrder.order_id || fallbackOrder.id;
          navigate(`/orderTrack/${fallbackId}`, { replace: true });
        }

      } catch (error) {
        console.error("🚨 Tracking error:", error);
        toast.error("Failed to load tracking data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderFromList();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500 mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading tracking details...</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-[70vh] bg-gray-50 py-10 px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <Clock className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Found</h2>
          <p className="text-gray-500 text-sm mb-6">
            We couldn't find any recent orders on your account.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Go to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 font-sans min-h-[75vh]">
      <div className="flex flex-col md:flex-row gap-6">
        
        <OrderSidebar 
          allOrders={allOrders} 
          currentOrderId={orderData.order_id || orderData.id}
          onSelectOrder={(selectedId) => navigate(`/orderTrack/${selectedId}`)}
          safeString={safeString}
          safeImage={safeImage}
        />
        
        <OrderDetails 
          orderData={orderData} 
          safeString={safeString}
          safeImage={safeImage}
        />
        
      </div>
    </div>
  );
}