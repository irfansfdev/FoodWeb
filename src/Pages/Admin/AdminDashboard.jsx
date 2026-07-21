import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react"; 
import * as AdminAPI from "../../api/AdminAPI"; 
import * as RestaurantAPI from "../../api/RestaurantAPI"; 
import api from "../../api/axios";

// Components
import AdminSidebar from "../../Components/AdminComponents/AdminSidebar";
import AdminOverview from "../../Components/AdminComponents/AdminOverview";
import AdminOrders from "../../Components/AdminComponents/AdminOrders";
import AdminRestaurants from "../../Components/AdminComponents/AdminRestaurants";
import AdminMenuItems from "../../Components/AdminComponents/AdminMenuItems";
import AdminCategories from "../../Components/AdminComponents/AdminCategories";
import AdminDeals from "../../Components/AdminComponents/AdminDeals";
import AdminModals from "../../Components/AdminComponents/AdminModals";
import AdminAnalytics from "../../Components/AdminComponents/AdminAnalytics"; 

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [deals, setDeals] = useState([]);
  
  // Analytics State
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [analyticsOverviewData, setAnalyticsOverviewData] = useState(null); 
  const [revenueOverTime, setRevenueOverTime] = useState([]); 
  
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [modalType, setModalType] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const [
          fetchedOrders, 
          fetchedDeals, 
          fetchedRestaurants, 
          fetchedMenuItems,
          fetchedCategories,
          fetchedOrdersByStatus,      
          fetchedOverviewData,
          fetchedRevenueOverTime 
        ] = await Promise.all([
          AdminAPI.analyticsAllOrders(),
          RestaurantAPI.getDeals(),
          RestaurantAPI.getRestaurants(),
          RestaurantAPI.getMenuItems(),
          RestaurantAPI.getCategory ? RestaurantAPI.getCategory() : Promise.resolve([]),
          AdminAPI.analyticsAllOrdersByStatus().catch(() => []),    
          AdminAPI.analyticsOverview().catch(() => null),
          // We default to asking the API for 'weekly' on first load
          AdminAPI.analyticsRevenueOverTime('weekly').catch(() => []) 
        ]);
        
        setOrders(fetchedOrders || []);
        setDeals(fetchedDeals || []);
        setRestaurants(fetchedRestaurants || []);
        setMenuItems(fetchedMenuItems || []);
        setCategories(fetchedCategories || []);
        
        setOrdersByStatus(fetchedOrdersByStatus || []);
        setAnalyticsOverviewData(fetchedOverviewData || null);
        setRevenueOverTime(fetchedRevenueOverTime || []);
        
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleTimeFrameChange = async (newTimeframe) => {
    try {
      console.log(`🗣️ Asking backend for: ${newTimeframe}`); // <--- Added
      const fetchedRevenue = await AdminAPI.analyticsRevenueOverTime(newTimeframe);
      console.log(`📥 Backend replied with:`, fetchedRevenue); // <--- Added
      
      setRevenueOverTime(fetchedRevenue || []);
    } catch (error) {
      console.error("Failed to change timeframe:", error);
    }
  };

  const openModal = async (type, item = null) => {
    // ... (Your openModal code stays exactly the same)
    setModalType(type);

    if (item && item.id) {
      setSelectedItem(item);

      try {
        let detailedItem = null;
        const id = item.id;

        if (type.includes("restaurant")) {
          detailedItem = await AdminAPI.getRestaurantsId(id);
        } 
        else if (type.includes("menuitem")) {
          const response = await api.get(`/restaurants/update-menuitem/${id}/`);
          detailedItem = response.data.data ? response.data.data : response.data;
        } 
        else if (type.includes("deal")) {
          const response = await api.get(`/restaurants/update-deal/${id}/`);
          detailedItem = response.data.data ? response.data.data : response.data;
        }

        if (detailedItem) {
          setSelectedItem(detailedItem);
        }
      } catch (error) {
        console.error("Failed to sync secure backend details:", error);
      }
    } else {
      setSelectedItem(null);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedItem(null);
  };

  const handleModalSubmit = async (formDataOrPayload, menuItemsArray = []) => {
    // ... (Your handleModalSubmit code stays exactly the same)
    try {
      const isEdit = !!selectedItem;
      const id = selectedItem?.id;

      if (modalType.includes("restaurant")) {
        if (isEdit) {
          const res = await AdminAPI.editRestaurant(id, formDataOrPayload);
          setRestaurants(prev => prev.map(r => (r.id === id ? res : r)));
        } else {
          const res = await AdminAPI.createRestaurant(formDataOrPayload);
          setRestaurants(prev => [...prev, res]);
        }
      } 
      else if (modalType.includes("menuitem")) {
        if (isEdit) {
          const res = await AdminAPI.editMenuItem(id, formDataOrPayload);
          setMenuItems(prev => prev.map(m => (m.id === id ? res : m)));
        } else {
          const res = await AdminAPI.createMenuItem(formDataOrPayload);
          setMenuItems(prev => [...prev, res]);
        }
      } 
      else if (modalType.includes("category")) {
        if (isEdit) {
          const res = await AdminAPI.editCategory(id, formDataOrPayload);
          setCategories(prev => prev.map(c => (c.id === id ? res : c)));
        } else {
          const res = await AdminAPI.createCategory(formDataOrPayload);
          setCategories(prev => [...prev, res]);
        }
      } 
      else if (modalType.includes("deal")) {
        if (isEdit) {
          const res = await AdminAPI.editDeal(id, formDataOrPayload);
          setDeals(prev => prev.map(d => (d.id === id ? res : d)));
        } else {
          const newDeal = await AdminAPI.createDeal(formDataOrPayload);
          
          if (menuItemsArray && menuItemsArray.length > 0) {
            await Promise.all(
              menuItemsArray.map(menuItemId => {
                return AdminAPI.createDealItem({
                  deal_id: newDeal.id,
                  menu_item_id: menuItemId,
                  quantity: 1
                });
              })
            );
          }
          const updatedDeals = await RestaurantAPI.getDeals();
          setDeals(updatedDeals || []);
        }
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save data:", error);
      alert("Error saving data. Please check the network tab or console.");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await AdminAPI.updateOrderStatus(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => (o.order_id === orderId ? { ...o, current_status: newStatus } : o)));
    } catch (error) {
      alert("Failed to update order status.");
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await AdminAPI.deleteRestaurant(id);
        setRestaurants(prev => prev.filter(r => r.id !== id));
      } catch (error) { console.error(error); }
    }
  };

  const handleDeleteMenuitem = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await AdminAPI.deleteMenuItem(id);
        setMenuItems(prev => prev.filter(item => item.id !== id));
      } catch (error) { console.error(error); }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await AdminAPI.deleteCategory(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (error) { console.error(error); }
    }
  };

  const handleDeleteDeal = async (id) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await AdminAPI.deleteDeal(id);
        setDeals(prev => prev.filter(d => d.id !== id));
      } catch (error) { console.error(error); }
    }
  };

  const deliveredSales = orders
    .filter(o => o.current_status === "delivered")
    .reduce((sum, o) => sum + (parseFloat(o.total_price) || 0), 0);
    
  const activeOrdersCount = orders.filter(o => 
    ["pending", "accepted", "preparing", "out_for_delivery"].includes(o.current_status)
  ).length;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear(); 
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-brand-offwhite flex font-body text-brand-dark">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} setSearchQuery={setSearchQuery} activeOrdersCount={activeOrdersCount} onLogout={handleLogout} />
      </div>
      <div className="hidden md:block shrink-0 h-screen sticky top-0">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} setSearchQuery={setSearchQuery} activeOrdersCount={activeOrdersCount} onLogout={handleLogout} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-200/80 h-16 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button type="button" className="md:hidden flex items-center justify-center text-brand-dark p-2 -ml-2 hover:bg-gray-100 rounded-lg cursor-pointer" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-brand-dark capitalize">
              {activeTab === "menu" ? "Menu Items" : activeTab.replace("-", " ")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white font-black text-sm">A</div>
            <span className="text-sm font-semibold text-brand-dark hidden sm:block">Manager Panel</span>
          </div>
        </header>

        <main className="p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
          {isLoading ? (
             <div className="text-center py-20 text-gray-500 font-bold animate-pulse">Loading System Data...</div>
          ) : (
            <>
              {activeTab === "overview" && <AdminOverview deliveredSales={deliveredSales} activeOrdersCount={activeOrdersCount} restaurants={restaurants} menuItems={menuItems} deals={deals} />}
              {activeTab === "orders" && <AdminOrders orders={orders} handleUpdateOrderStatus={handleUpdateOrderStatus} />}
              {activeTab === "restaurants" && <AdminRestaurants restaurants={restaurants} openModal={openModal} handleDeleteRestaurant={handleDeleteRestaurant} />}
              {activeTab === "menu" && <AdminMenuItems menuItems={menuItems} searchQuery={searchQuery} setSearchQuery={setSearchQuery} openModal={openModal} handleDeleteMenuitem={handleDeleteMenuitem} />}
              {activeTab === "categories" && <AdminCategories categories={categories} openModal={openModal} handleDeleteCategory={handleDeleteCategory} />}
              {activeTab === "deals" && <AdminDeals deals={deals} openModal={openModal} handleDeleteDeal={handleDeleteDeal} />}
              
              {/* ✨ ANALYTICS TAB UPDATED */}
              {activeTab === "analytics" && (
                <AdminAnalytics 
                  ordersByStatus={ordersByStatus} 
                  analyticsOverviewData={analyticsOverviewData}
                  revenueOverTime={revenueOverTime}
                  totalRestaurantsCount={restaurants.length}
                  onTimeFrameChange={handleTimeFrameChange} // 👈 Added Walkie Talkie!
                />
              )}
            </>
          )}
        </main>
      </div>

      <AdminModals modalType={modalType} selectedItem={selectedItem} closeModal={closeModal} restaurantsList={restaurants} categoriesList={categories} menuItemsList={menuItems} onSubmitSuccess={handleModalSubmit} />
    </div>
  );
}