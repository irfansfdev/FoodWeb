import Plus from "../../assets/plus.png";

function OfferCard({ image, restaurantLabel, title, discount, onAdd, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="relative text-left rounded-xl overflow-hidden w-full h-[220px] sm:h-[260px] md:h-[325px]
                 font-poppins cursor-pointer hover:scale-[1.01] transition-transform
                 focus:outline-none focus:ring-2 focus:ring-[#fc8a06]"
    >
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(235deg, rgba(255,255,255,0) 1%, rgba(3,8,31,0.19) 52%, rgba(3,8,31,0.89) 88%)',
        }}
      />

      <div className="absolute top-0 right-0 bg-[#03081f] w-[70px] h-[54px] md:w-[88px] md:h-[66px] rounded-bl-xl flex items-center justify-center">
        <span className="text-white font-bold text-sm md:text-lg">{discount}</span>
      </div>

      <div className="absolute left-4 md:left-6 bottom-4 md:bottom-6 max-w-[70%]">
        <p className="text-[#fc8a06] font-medium text-sm md:text-lg">{restaurantLabel}</p>
        <p className="text-white font-bold text-xl md:text-3xl">{title}</p>
      </div>

      <span
        role="button"
        aria-label="Add offer"
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
        
      >
        <div className="absolute bottom-0 right-0 rounded-tl-4xl opacity-90 rounded-br-lg bg-white/80 px-3  pt-5 backdrop-blur-sm">


        <span><img src={Plus} alt="" className="h-8 w-8 mb-2 " /></span>
        </div>
      </span>
    </button>
  );
}

export default OfferCard;