import { useTheme } from "../../Context/ThemeContext";

function CategoryCard({ image, name, restaurantCount, onClick }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={onClick}
      // Merged the redundant inner div into this single wrapper and added flex-col h-full
      className={`w-full h-full flex flex-col text-left rounded-xl overflow-hidden shadow-sm font-poppins
                 cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-orange
                 ${isDark ? "bg-[#03081f]" : "bg-white border border-gray-100"}`}
    >
      {/* Changed invalid h-47 to h-40 and added shrink-0 */}
      <div className="w-full h-30 lg:h-40 shrink-0 bg-gray-100">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="px-3 py-4 flex flex-col flex-grow">
        {/* Added line-clamp-1 so super long category names don't push the card out of proportion */}
        <p className={`${isDark ? "text-brand-orange" : "text-black"} font-bold text-base md:text-lg line-clamp-1`}>
          {name}
        </p>
        <p className={`${isDark ? "text-white" : "text-[#fc8a06]"} text-xs md:text-sm mt-1 font-medium`}>
          {restaurantCount}
        </p>
      </div>
    </button>
  );
}

export default CategoryCard;