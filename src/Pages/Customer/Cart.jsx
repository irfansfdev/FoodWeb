import { useState, useEffect } from "react";
import Checkout from "../../Components/Cart/Checkout";
import { fetchCartAPI, deleteCartItemAPI } from "../../api/cartAPI";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from Backend Database on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const data = await fetchCartAPI();
        // Adjust syntax based on if backend yields raw arrays or wrappers like { items: [] }
        const items = data.items || data || []; 
        setCartItems(items); 
      } catch (error) {
        console.error("Error loading cart from DB:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const handleIncrease = async (id) => {
    // Local visual optimistic state update (Sync backend as required)
    setCartItems((prev) =>
      prev.map((cart) =>
        cart.id === id ? { ...cart, quantity: cart.quantity + 1 } : cart
      )
    );
  };

  const handleDecrease = async (id) => {
    const item = cartItems.find((cart) => cart.id === id);

    if (item.quantity > 1) {
      setCartItems((prev) =>
        prev.map((cart) =>
          cart.id === id ? { ...cart, quantity: cart.quantity - 1 } : cart
        )
      );
    } else {
      const isConfirmed = window.confirm("Are you sure you want to remove this item?");
      if (!isConfirmed) return;

      try {
        // Request delete request from your Django endpoint
        await deleteCartItemAPI(id);
        // Clear visually from UI upon success
        setCartItems((prev) => prev.filter((cart) => cart.id !== id));
      } catch (error) {
        console.error("Failed to delete item from database:", error);
        alert("Could not remove item. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xl font-medium text-gray-600">
        Loading your cart...
      </div>
    );
  }

  return (
    <Checkout
      cartItems={cartItems}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
    />
  );
}