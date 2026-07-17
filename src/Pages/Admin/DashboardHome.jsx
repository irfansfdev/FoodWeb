import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // State
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [deals, setDeals] = useState([]);
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
          fetchedCategories
        ] = await Promise.all([
          AdminAPI.analyticsAllOrders(),
          RestaurantAPI.getDeals(),
          RestaurantAPI.getRestaurants(),
          RestaurantAPI.getMenuItems(),
          // FIXED: Changed getCategories to getCategory to match RestaurantAPI.js
          RestaurantAPI.getCategory ? RestaurantAPI.getCategory() : Promise.resolve([])
        ]);
        
        setOrders(fetchedOrders || []);
        setDeals(fetchedDeals || []);
        setRestaurants(fetchedRestaurants || []);
        setMenuItems(fetchedMenuItems || []);
        setCategories(fetchedCategories || []);
        
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // FIXED: Using your authorized Axios instance to hit the discovered URLs
  const openModal = async (type, item = null) => {
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
          console.log("🎯 SUCCESS! Securely fetched database details:", detailedItem);
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

  // Unified Modal Submit Handler to Add/Edit Data
  const handleModalSubmit = async (formDataOrPayload) => {
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
          const res = await AdminAPI.createDeal(formDataOrPayload);
          setDeals(prev => [...prev, res]);
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

  return (
    <div className="min-h-screen bg-brand-offwhite flex font-body text-brand-dark">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        setSearchQuery={setSearchQuery} 
        activeOrdersCount={activeOrdersCount} 
        onLogout={() => navigate("/")} 
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-gray-200/80 h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-brand-dark capitalize">
            {activeTab === "menu" ? "Menu Items" : activeTab.replace("-", " ")}
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white font-black text-sm">A</div>
            <span className="text-sm font-semibold text-brand-dark">Manager Panel</span>
          </div>
        </header>

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
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
            </>
          )}
        </main>
      </div>

      <AdminModals 
        modalType={modalType} 
        selectedItem={selectedItem} 
        closeModal={closeModal}
        restaurantsList={restaurants}
        categoriesList={categories}
        menuItemsList={menuItems} 
        onSubmitSuccess={handleModalSubmit} 
      />
    </div>
  );
}