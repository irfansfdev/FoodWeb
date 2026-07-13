import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "../../Components/Cart/Checkout";
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
    // Only fetch if idle to prevent infinite loops
    if (status === "idle") {
      dispatch(fetchCartAsync());
    }
  }, [status, dispatch]);

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
    <Checkout
      cartItems={cartItems}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      onRemove={handleRemove} 
      confirm={handleConfirm}
    />
  );
}