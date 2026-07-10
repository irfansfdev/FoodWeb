import { useNavigate } from "react-router-dom";

export default function Checkout({ cartItems, onIncrease, onDecrease }) {
  const navigate = useNavigate();

  // Calculate order metrics helper dynamically
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity || 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 font-body">
      {/* Dynamic Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black cursor-pointer font-medium transition-colors"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-brand-dark">Your Basket</h1>

      {cartItems.length === 0 ? (
        /* Styled Brand New Empty Cart Block */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 border rounded-2xl p-8">
          <span className="text-5xl mb-4">🛒</span>
          <p className="text-xl font-semibold text-gray-500">Your cart is empty!</p>
          <p className="text-gray-400 text-sm mt-1 max-w-xs">Looks like you haven't added any meals to your basket yet.</p>
          
          <button 
            onClick={() => navigate('/restaurants')} 
            className="mt-6 rounded-full bg-[#fc8a06] px-8 py-3 font-semibold text-white transition-all hover:bg-opacity-90 shadow-md cursor-pointer hover:scale-[1.02]"
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        /* Real layout items list display container logic */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm">
                <div>
                  <h3 className="font-semibold text-lg text-brand-dark">{item.name || "Menu Item"}</h3>
                  <p className="text-gray-500 font-medium">GBP {item.price}</p>
                </div>
                
                <div className="flex items-center gap-4 border rounded-full px-3 py-1 bg-gray-50">
                  <button onClick={() => onDecrease(item.id)} className="font-bold text-gray-600 hover:text-black cursor-pointer text-lg px-1">-</button>
                  <span className="font-semibold w-4 text-center">{item.quantity}</span>
                  <button onClick={() => onIncrease(item.id)} className="font-bold text-gray-600 hover:text-black cursor-pointer text-lg px-1">+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown sidebar summary block */}
          <div className="border rounded-xl p-6 bg-white shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Summary</h2>
            <div className="flex justify-between font-medium text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>GBP {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-brand-dark border-t pt-2 mt-4">
              <span>Total</span>
              <span>GBP {subtotal.toFixed(2)}</span>
            </div>
            <button className="w-full mt-6 bg-[#fc8a06] text-white py-3 rounded-xl font-bold shadow-md hover:bg-opacity-90 transition-opacity cursor-pointer">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}