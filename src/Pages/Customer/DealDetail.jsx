import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify"; 
import { getDeals } from "/src/api/restaurantAPI";
import { useDispatch, useSelector } from "react-redux"; 
import { addToCartAsync } from "/src/Redux/Slices/cartSlice"; 
import { openAuthModal } from "/src/Redux/Slices/AuthSlice"; 
import Navbar from "../../Components/Common/Navbar";
import Footer from "../../Components/Common/Footer";
import api from "../../api/axios";

// 👈 Enhanced Helper for Django media & dynamic absolute URLs
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

function DealDetail() {
  const { id } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const dispatch = useDispatch(); 
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDealData = async () => {
      try {
        const allDeals = await getDeals();
        const matchedDeal = allDeals.find((d) => String(d.id) === String(id));
        setDeal(matchedDeal);
        if (matchedDeal) {
          setActiveImage(matchedDeal.image);
        }
      } catch (error) {
        console.error("Error fetching deal details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-600 font-semibold text-lg">Deal not found!</p>
        <Link to="/" className="text-orange-500 hover:underline font-medium">
          Back to home deals
        </Link>
      </div>
    );
  }

  const comboPrice = parseFloat(deal.combo_price) || 0;
  
  const originalPrice = deal.items?.reduce((sum, item) => {
    const basePrice = parseFloat(item.menu_item?.price) || 0;
    const itemQuantity = item.quantity || 1;
    return sum + (basePrice * itemQuantity);
  }, 0) || comboPrice; 

  const hasDiscount = originalPrice > comboPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - comboPrice) / originalPrice) * 100) 
    : 0;
  const savedAmount = originalPrice - comboPrice;

  const restaurantInfo = deal.items?.[0]?.menu_item?.restaurant || {};
  
  const thumbnails = [
    deal.image,
    ...(deal.items?.map((item) => item.menu_item?.image) || [])
  ].filter(Boolean);

  const handleIncrement = () => setCartQuantity((prev) => prev + 1);
  const handleDecrement = () => setCartQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser") ? JSON.parse(localStorage.getItem("authUser")) : null;
    const currentUser = user || storedUser; // 👈 Fallback check so reload won't trigger modal if logged in
    
    if (!currentUser || !token) {
      dispatch(openAuthModal()); 
      return; 
    }

    setIsAdding(true);
    try {
      await dispatch(addToCartAsync({ itemId: deal.id, quantity: cartQuantity, isDeal: true })).unwrap();

      toast.success(`Added ${cartQuantity}x ${deal.name} to cart!`, {
        position: "bottom-right",
        autoClose: 2500,
        theme: "colored"
      });
    } catch (error) {
      console.error("Cart action failed:", error);
      toast.error("Could not add item to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Navbar />
    
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800 bg-slate-50/50 min-h-screen">
        <nav className="text-xs sm:text-sm text-slate-400 mb-6 flex gap-2 items-center font-medium">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-semibold capitalize">{deal.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-video sm:aspect-[4/3] w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-full z-10 shadow-sm animate-pulse">
                  {discountPercent}% SAVED
                </span>
              )}
              {activeImage && (
                <img
                  src={formatImageUrl(activeImage)}
                  alt={deal.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {thumbnails.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {thumbnails.map((thumb, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(thumb)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === thumb ? "border-orange-500 scale-95 shadow-md" : "border-transparent bg-white shadow-sm hover:scale-105"
                    }`}
                  >
                    <img src={formatImageUrl(thumb)} alt="Preview" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[450px]">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full mb-4">
                🍱 Special Combo Deal
              </span>
              
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
                {deal.name}
              </h1>

              {deal.description && (
                <p className="text-slate-500 leading-relaxed text-sm sm:text-base mb-6">
                  {deal.description}
                </p>
              )}

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-extrabold text-orange-500">
                    $ {comboPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-slate-400 line-through text-sm font-medium">
                      $ {originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {savedAmount > 0 && (
                  <p className="text-emerald-600 font-bold text-xs mt-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">
                    🎉 Instantly saves you Rs. {savedAmount.toFixed(0)}
                  </p>
                )}
              </div>

              {deal.items && deal.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">What's Included:</h3>
                  <ul className="space-y-2">
                    {deal.items.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50/50 px-3 py-2 rounded-xl">
                        <span className="bg-orange-100 text-orange-600 font-extrabold text-xs px-2 py-0.5 rounded-md">
                          {item.quantity}x
                        </span>
                        <span className="font-medium">{item.menu_item?.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center border border-slate-200 bg-slate-50 rounded-2xl h-14 overflow-hidden shadow-inner">
                <button onClick={handleDecrement} className="px-4 text-slate-400 hover:bg-slate-200 text-xl transition-colors font-bold">
                  −
                </button>
                <span className="w-8 text-center font-black text-base text-slate-800">
                  {cartQuantity}
                </span>
                <button onClick={handleIncrement} className="px-4 text-slate-400 hover:bg-slate-200 text-xl transition-colors font-bold">
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-98 text-white font-extrabold h-14 rounded-2xl shadow-md shadow-orange-500/10 transition-all flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
              >
                {isAdding ? "Adding..." : "🛒 Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {restaurantInfo.name && (
          <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex gap-4 items-center">
              {restaurantInfo.image && (
                <div className="w-14 h-14 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 shrink-0 shadow-sm">
                  <img 
                    src={formatImageUrl(restaurantInfo.image)} 
                    alt={restaurantInfo.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                  {restaurantInfo.name}
                </h3>
                {restaurantInfo.description && (
                  <p className="text-slate-400 text-xs mt-1 max-w-xl line-clamp-2">
                    {restaurantInfo.description}
                  </p>
                )}
              </div>
            </div>

            <Link
              to={`/restaurant/${restaurantInfo.id || ""}`}
              className="w-full md:w-auto text-center border-2 border-slate-200 hover:border-orange-500 hover:text-orange-500 text-slate-600 font-bold text-sm px-6 py-3 rounded-2xl transition-all whitespace-nowrap"
            >
              View Restaurants
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default DealDetail;