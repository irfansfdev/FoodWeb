import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../Common/Button";
import api from "../../api/axios"; // 

// Helper for Django media & dynamic absolute URLs
const formatImageUrl = (urlStr) => {
  if (!urlStr) return "https://via.placeholder.com/300?text=No+Image";
  if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) return urlStr;

  const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/$/, "") : "";
  let path = urlStr.startsWith("/") ? urlStr : `/${urlStr}`;

  // Prepend /media/ if backend saved plain filename like 'hot_chocolate.png'
  if (!path.startsWith("/media/") && !path.startsWith("/static/")) {
    path = `/media${path}`;
  }

  return `${baseUrl}${path}`;
};

export default function CartDetail({
  cartItems,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const navigate = useNavigate();

  const subTotal = cartItems.reduce((total, item) => {
    const itemPrice = parseFloat(item.price || item.menu_item?.price || item.deal?.combo_price || item.deal?.price || 0);
    return total + itemPrice * item.quantity;
  }, 0);

  const deliveryFee = 0;
  const discount = 0;
  const total = subTotal + deliveryFee - discount;

  const handleRemove = (id, title, name) => {
    const itemName = title || name || "Item"; 
    toast.info(`${itemName} removed from cart`);
    onRemove(id);
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">Your Cart is Empty 🛒</h1>
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
      <button
        onClick={() => navigate("/")}
        className="mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-black cursor-pointer"
      >
        ← Back to Home
      </button>

      <h1 className="mb-6 sm:mb-8 text-3xl sm:text-4xl font-bold">Order Checkout</h1>

      <div className="grid grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: Cart Items */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-lg overflow-hidden h-fit">
          <div className="flex items-center justify-between border-b p-4 sm:p-6 bg-gray-50/50">
            <div className="flex items-center gap-3 font-semibold text-lg">
              <i className="fa-solid fa-cart-shopping"></i>
              My Cart
            </div>
          </div>

          {cartItems.map((item) => {
            const itemTitle = item.title || item.name || item.menu_item?.name || item.deal?.name || item.deal?.title || "Item";
            const itemDescription = item.description || item.menu_item?.description || item.deal?.description || "";
            const itemPrice = parseFloat(item.price || item.menu_item?.price || item.deal?.combo_price || item.deal?.price || 0);

            // Extract image string across direct, menu_item, and deal properties
            const rawImage = item.image || item.image_url || item.menu_item?.image || item.deal?.image;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b p-4 sm:p-6 gap-4 sm:gap-0"
              >
                {/* Item Details */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto">
                  <img
                    src={formatImageUrl(rawImage)}
                    alt={itemTitle}
                    className="h-20 w-24 sm:h-24 sm:w-32 rounded-lg object-cover shrink-0 bg-gray-100"
                  />

                  <div className="max-w-md">
                    <h3 className="text-base sm:text-lg font-bold leading-tight">
                      {itemTitle}
                    </h3>

                    {itemDescription && (
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2">
                        {itemDescription}
                      </p>
                    )}

                    <p className="mt-1 sm:mt-3 text-xs sm:text-sm font-semibold">
                      Extra: Bacon, Cheddar Cheese
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500">Without cutlery</p>
                  </div>
                </div>

                {/* Actions & Price */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 mt-2 sm:mt-0">
                  <div className="flex items-center gap-3 sm:gap-4 rounded-full border px-3 sm:px-4 py-1.5 sm:py-2">
                    <button
                      onClick={() => onDecrease(item.id)}
                      className="text-lg sm:text-xl font-bold cursor-pointer px-1 hover:text-gray-600"
                    >
                      -
                    </button>

                    <span className="font-semibold w-4 text-center">{item.quantity}</span>

                    <button
                      onClick={() => onIncrease(item.id)}
                      className="text-lg sm:text-xl font-bold cursor-pointer px-1 hover:text-gray-600"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-1 sm:gap-2">
                    <h4 className="font-bold text-lg sm:text-base whitespace-nowrap">
                      £{itemPrice.toFixed(2)}
                    </h4>
                    
                    <button
                      onClick={() => handleRemove(item.id, itemTitle)}
                      className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-700 cursor-pointer hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Order Summary */}
        {cartItems.length > 0 && (
          <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-lg h-fit lg:sticky lg:top-8">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">Total Payment</h2>

            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-black">£{subTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-black">£{deliveryFee}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="font-medium text-black">-£{discount}</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between text-lg sm:text-xl font-bold">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-lg py-3 sm:py-4 font-semibold text-base sm:text-lg transition-transform active:scale-[0.98]"
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