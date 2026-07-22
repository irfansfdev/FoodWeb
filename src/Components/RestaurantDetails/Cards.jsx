import { toast } from "react-toastify";
import plus from "../../assets/Plus.png";
import api from "../../api/axios"

const Card = ({ data, onBtnClick }) => {
  const itemName = data.name || "Menu Item";
  const itemPrice = data.price ? `$${data.price}` : "Price Unavailable";
  
  // Robust image URL builder: handle objects, absolute URLs, and prepend backend base URL for relative paths
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/300?text=No+Image";

    if (typeof img === "object") {
      img = img.url || img.src || img.path || "";
    }

    if (typeof img === "string" && img.startsWith("http")) return img;

    const baseUrl = api.defaults && api.defaults.baseURL ? api.defaults.baseURL.replace(/\/$/, "") : "";
    let path = (img || "").toString();
    if (!path.startsWith("/")) path = `/${path}`;

    // If backend stores plain filename, ensure /media prefix so Django serves it correctly
    if (!path.startsWith("/media/") && !path.startsWith("/static/")) {
      path = `/media${path}`;
    }

    return baseUrl ? `${baseUrl}${path}` : path;
  };

  const itemImage = getImageUrl(data.image);

  // Wrapper function to handle both the prop function and the toast
  const handleAddToCart = () => {
    if (onBtnClick) {
      onBtnClick(data); // Passing data back can be helpful for the cart logic
    }
    
    // Trigger the toast notification
   toast.success(`${itemName} added to cart!`);
  };

  return (
    <article className="overflow-hidden rounded-xl p-5 bg-white shadow-[5px_5px_34px_0px_rgba(0,0,0,0.12)] transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="flex">
        {/* Left Content Column */}
        <div className="flex flex-1 flex-col justify-between pr-4">
          <div>
            <h3 className="text-[18px] font-bold leading-6 text-[#03081F] line-clamp-2">
              {itemName}
            </h3>

            <p className="mt-4 text-[14px] leading-6 text-[#555] line-clamp-3">
              {data.description || "Freshly prepared with premium ingredients."}
            </p>
          </div>

          <p className="text-[18px] font-bold text-[#03081F] mt-4">
            {itemPrice}
          </p>
        </div>

        {/* Right Image/Action Column */}
        <div className="relative shrink-0">
          <img
            src={itemImage}
            alt={itemName}
            className="h-40 w-36 rounded-xl object-cover border border-gray-100 bg-gray-50"
          />

          {/* Add To Cart Trigger */}
          <div className="absolute bottom-0 right-0 rounded-tl-4xl opacity-90 rounded-br-lg bg-white/80 px-3 pt-5 backdrop-blur-sm">
            <button 
              onClick={handleAddToCart}
              className="cursor-pointer hover:scale-110 transition-transform active:scale-95"
              title={`Add ${itemName} to cart`}
            >
              <img src={plus} alt="Add button" className="h-8 w-8 object-contain" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;