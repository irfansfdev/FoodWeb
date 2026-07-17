import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutDetail from "../../Components/Cart/CheckoutDetail"; 
import { fetchCartAsync } from "../../Redux/Slices/cartSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  
  // 1. Grab the cart items directly from the global Redux store
  const { items: cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    // 2. Fetch fresh cart data from Django database as soon as the checkout page mounts
    // This makes sure the data survives hard page refreshes!
    dispatch(fetchCartAsync());
  }, [dispatch]);

  // 4. Pass the real-time Redux cart items down to your UI component
  return <CheckoutDetail cartItems={cartItems} />;
}