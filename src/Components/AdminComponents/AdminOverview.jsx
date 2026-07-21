import React from "react";
import {
  TrendingUp,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  Sparkles,
  Sliders,
} from "lucide-react";

export default function AdminOverview({
  deliveredSales,
  activeOrdersCount,
  restaurants,
  menuItems,
  deals,
}) {
  const stats = [
    {
      label: "Total Revenue",
      value: `$${deliveredSales.toFixed(2)}`,
      desc: "From completed orders",
      icon: TrendingUp,
    },
    {
      label: "Active Orders",
      value: activeOrdersCount,
      desc: "Pending processing",
      icon: ShoppingBag,
    },
    {
      label: "Partner Restaurants",
      value: restaurants.length,
      desc: "Locations onboarded",
      icon: Store,
    },
    {
      label: "Menu Catalogue",
      value: menuItems.length,
      desc: "Total registered dishes",
      icon: UtensilsCrossed,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Analytical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-brand-dark mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className="bg-orange-50 text-brand-orange p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Bottom Lists Side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/80">
            <h3 className="font-bold text-brand-dark flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-orange" /> Popular Menu
              Items
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {menuItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <p className="font-bold text-brand-dark">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.restaurant?.name} • {item.category?.name}
                  </p>
                </div>
                <span className="font-bold text-brand-dark">
                
                  ${parseFloat(item.price || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200/80">
            <h3 className="font-bold text-brand-dark flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-orange" /> Popular Active
              Deals
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <p className="font-bold text-brand-dark">{deal.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {deal.description}
                  </p>
                </div>
                <span className="text-xs font-black text-brand-orange bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 shrink-0">
                  ${deal.combo_price} only.
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
