import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Common/Button"; 

export default function CheckoutDetail({ cartItems = [] }) {
  const navigate = useNavigate();
  
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash"); 
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!deliveryAddress.trim()) {
      toast.error("Please enter a delivery address.");
      return;
    }

    if (paymentMethod !== "cash" && !transactionId.trim()) {
      toast.error(`A transaction ID is required for ${paymentMethod} payments.`);
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      delivery_address: deliveryAddress,
      payment_method: paymentMethod,
    };

    if (paymentMethod !== "cash") {
      orderPayload.transaction_id = transactionId;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("http://127.0.0.1:8000/order/checkout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("🚨 Full Backend Error:", errorData);
        
        let errorMessage = "Failed to place order.";
        if (errorData) {
          if (errorData.error) {
            const backendError = errorData.error;
            const firstKey = Object.keys(backendError)[0];
            errorMessage = `${firstKey}: ${backendError[firstKey]}`;
          } else if (typeof errorData === 'object' && !errorData.detail && !errorData.message) {
            const firstKey = Object.keys(errorData)[0];
            errorMessage = `${firstKey}: ${errorData[firstKey][0]}`;
          } else {
            errorMessage = errorData.detail || errorData.message || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("🎁 SUCCESS! Django Response Data:", responseData);
      
      toast.success("Order successfully placed!");
      
      // Extract Order ID
      const extractOrderId = (data) => {
        if (!data) return null;
        
        if (data.successful_orders && Array.isArray(data.successful_orders) && data.successful_orders.length > 0) {
          const order = data.successful_orders[0];
          return order.id || order.order_id || order.pk;
        }
        
        if (Array.isArray(data) && data.length > 0) {
          return data[0].id || data[0].order_id || data[0].pk;
        }
        
        if (data.order && typeof data.order === 'object') {
          return data.order.id || data.order.order_id || data.order.pk;
        }
        return data.id || data.order_id || data.pk;
      };

      const newOrderId = extractOrderId(responseData);
      console.log("🎯 Extracted Order ID:", newOrderId);
      
      if (newOrderId && String(newOrderId) !== "undefined" && String(newOrderId) !== "null") {
        // Save to localStorage so the Navbar "Track Order" link can find it!
        localStorage.setItem("latestOrderId", newOrderId);
        
        // Notify if they ordered from multiple restaurants (multiple orders)
        if (responseData.successful_orders && responseData.successful_orders.length > 1) {
          toast.info(`Your order was split into ${responseData.successful_orders.length} deliveries.`);
        }
        
        navigate(`/orderTrack/${newOrderId}`); 
      } else {
        console.error("🚨 Could not find a valid Order ID in the backend response:", responseData);
        toast.warning("Order placed successfully, but tracking information is loading.");
        navigate("/"); 
      }
      
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex min-h-[50vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">No items to checkout.</h2>
        <Button onClick={() => navigate('/restaurants')} className="mt-4 px-6 py-2">
          Return to Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 font-sans">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
      >
        ← Back to Cart
      </button>

      <h1 className="mb-8 text-3xl font-extrabold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 relative items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 border-b pb-3">1. Delivery Information</h2>
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  rows="3"
                  maxLength="255"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full delivery address"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 border-b pb-3">2. Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cash" 
                  checked={paymentMethod === "cash"} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-medium text-gray-900">Cash on Delivery</span>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'stripe' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="stripe" 
                  checked={paymentMethod === "stripe"} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-medium text-gray-900">Card (Stripe)</span>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'jazzcash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="jazzcash" 
                  checked={paymentMethod === "jazzcash"} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-medium text-gray-900">JazzCash</span>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'easypaisa' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="easypaisa" 
                  checked={paymentMethod === "easypaisa"} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-medium text-gray-900">EasyPaisa</span>
              </label>
            </div>

            {paymentMethod !== "cash" && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                <label htmlFor="transactionId" className="block text-sm font-semibold text-gray-700 mb-1">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">Since you selected an online payment, please provide your transaction ID.</p>
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g., TXN-987654321"
                  className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:border-orange-500 focus:outline-none"
                  required={paymentMethod !== "cash"}
                />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 w-80 lg:w-100 p-6 border border-gray-100 sticky top-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-3">Order Summary</h2>
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div className="flex gap-3">
                  <span className="font-bold text-gray-900">{item.quantity}x</span>
                  <div>
                    <p className="font-medium text-gray-800">{item.title || item.name}</p>
                    <p className="text-xs text-gray-500">£{Number(item.price).toFixed(2)} each</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  £{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-lg font-extrabold text-gray-900 mb-6">
              <span>Total Price</span>
              <span className="text-orange-600">£{totalPrice.toFixed(2)}</span>
            </div>

            <Button
              form="checkout-form"
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-lg py-3.5 font-bold text-white transition-opacity ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}