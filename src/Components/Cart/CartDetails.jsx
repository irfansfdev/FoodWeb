import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export default function CartDetail({
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const navigate = useNavigate();

  const subTotal = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const deliveryFee = 0;
  const discount = 0;
  const total = subTotal + deliveryFee - discount;

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Your Cart is Empty 🛒</h1>

        <p className="mt-3 text-gray-500">
          Add some delicious food to your cart.
        </p>

        <Button onClick={() => navigate("/")} className="mt-6 px-6 py-2">
          Browse Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black cursor-pointer"
      >
        ← Back to Home
      </button>

      <h1 className="mb-8 text-4xl font-bold">Order Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-lg">
          <div className="flex items-center justify-between border-b p-6">
            <div className="flex items-center gap-3 font-semibold">
              <i className="fa-solid fa-cart-shopping"></i>
              My Cart
            </div>
          </div>

          {cartItems.map((item) => {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b p-6"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-24 w-32 rounded-lg object-cover"
                  />

                  <div className="max-w-md">
                    <h3 className="text-lg font-bold">{item.title}</h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {item.description}
                    </p>

                    <p className="mt-3 text-sm font-semibold">
                      Extra: Bacon, Cheddar Cheese
                    </p>

                    <p className="text-sm text-gray-500">Without cutlery</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4 rounded-full border px-4 py-2">
                    <button
                      onClick={() => onDecrease(item.id)}
                      className="text-xl font-bold cursor-pointer"
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => onIncrease(item.id)}
                      className="text-xl font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <h4 className="font-bold whitespace-nowrap">
                      £{item.price}
                    </h4>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-sm font-semibold text-red-500 hover:text-red-700 cursor-pointer hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {cartItems.length > 0 && (
          <div className=" rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-3xl font-bold">Total Payment</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{subTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>£{deliveryFee}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span>-£{discount}</span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>

              {/* 1. Directly navigates to the next page now */}
              <Button
                onClick={() => {
                  // We pass the cartItems inside the state object so the next page can read them
                  navigate("/checkout");
                }}
                className="mt-6 w-full rounded-lg py-3 font-semibold"
              >
                Proceed to checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
