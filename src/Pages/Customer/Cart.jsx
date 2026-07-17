import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartDetail from "../../Components/Cart/CartDetails";
import {
  fetchCartAsync,
  deleteCartItemAsync,
  increaseQuantity,
  decreaseQuantity,
} from "../../Redux/Slices/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  
  // Pull state directly from Redux
  const { items: cartItems, status } = useSelector((state) => state.cart);

  useEffect(() => {
    // 🔧 FIX: Removed the 'status === "idle"' check. 
    // Now, every time the Cart page mounts, it forces a fresh fetch from Django 
    // to guarantee Redux has the exact same data as your database.
    dispatch(fetchCartAsync());
  }, [dispatch]); // 🔧 FIX: Only depend on dispatch to prevent infinite loops

  const handleIncrease = (id) => {
    dispatch(increaseQuantity(id));
  };

  const handleDecrease = (id) => {
    const item = cartItems.find((cart) => cart.id === id);
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(id));
    } else {
      handleRemove(id);
    }
  };

  const handleRemove = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this item?");
    if (!isConfirmed) return;

    dispatch(deleteCartItemAsync(id)).unwrap().catch((error) => {
      console.error("Failed to delete item:", error);
      alert("Could not remove item. Please try again.");
    });
  };

  const handleConfirm = () => {
    alert("Proceeding to checkout...");
  };

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xl font-medium text-gray-600">
        Loading your cart...
      </div>
    );
  }

  return (
    <CartDetail
      cartItems={cartItems}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      onRemove={handleRemove} 
      confirm={handleConfirm}
    />
  );
}