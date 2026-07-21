import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Store, 
  UtensilsCrossed, 
  Tags, 
  Percent,
  LineChart, // <-- Added LineChart icon for Analytics
  LogOut 
} from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab, setSearchQuery, activeOrdersCount, onLogout }) {
  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Manage Orders", icon: ClipboardList, badge: activeOrdersCount },
    { id: "restaurants", label: "Restaurants", icon: Store },
    { id: "menu", label: "Menu Items", icon: UtensilsCrossed },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "deals", label: "Deals", icon: Percent },
    { id: "analytics", label: "Analytics", icon: LineChart }, // <-- Added Analytics tab here
  ];

  return (
    <aside className="bg-brand-dark text-white w-64 flex-shrink-0 flex flex-col h-full border-r border-black/20">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black text-brand-orange tracking-tight">
          ChickBite<span className="text-xs text-gray-400 font-normal ml-2 bg-white/5 px-2 py-0.5 rounded">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isTabActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery("");
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isTabActive
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 shrink-0" />
                <span>{tab.label}</span>
              </div>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isTabActive ? "bg-white text-brand-orange" : "bg-brand-orange text-white"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}