function DealCard({ image, name, restaurantLabel, discount, compact = false, onClick }) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        // w-full lets this card perfectly match the container size set by DealsGrid
        className="w-full flex flex-col font-poppins text-left cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] focus:outline-none"
      >
        {/* aspect-square ensures the image is always perfectly square */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden shrink-0 shadow-sm">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute top-0 left-0 bg-[#03081f] px-2 py-1 rounded-br-xl">
            <span className="text-white font-bold text-xs">{discount}</span>
          </div>
        </div>

        {/* Text container behaves naturally without overlapping */}
        <div className="mt-2 w-full">
          <p className="text-gray-500 text-[11px] font-medium tracking-tight line-clamp-1">{restaurantLabel}</p>
          <p className="text-black font-bold text-xs md:text-sm leading-tight line-clamp-2 mt-0.5">{name}</p>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative rounded-xl overflow-hidden w-full h-[325px] font-poppins text-left cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] focus:outline-none"
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(235deg, rgba(255,255,255,0) 1%, rgba(3,8,31,0.19) 52%, rgba(3,8,31,0.89) 88%)",
        }}
      />

      <div className="absolute top-0 right-0 bg-[#03081f] w-[88px] h-[66px] rounded-bl-xl flex items-center justify-center">
        <span className="text-white font-bold text-lg">{discount}</span>
      </div>

      <div className="absolute left-6 bottom-6 right-6">
        <p className="text-[#fc8a06] font-medium text-lg line-clamp-1">{restaurantLabel}</p>
        <p className="text-white font-bold text-2xl leading-tight line-clamp-2 mt-1">{name}</p>
      </div>
    </button>
  );
}

export default DealCard;