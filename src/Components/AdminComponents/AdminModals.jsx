import React, { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import api from "../../api/axios"


export default function AdminModals({ 
  modalType, 
  selectedItem, 
  closeModal, 
  restaurantsList = [], 
  categoriesList = [],
  menuItemsList = [], // <--- Added Menu Items List
  onSubmitSuccess 
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (selectedItem?.image) {
      if (typeof selectedItem.image === "string") {
        const buildUrl = (img) => {
          if (!img) return null;
          if (img.startsWith("http")) return img;
          const baseUrl = api.defaults && api.defaults.baseURL ? api.defaults.baseURL.replace(/\/$/, "") : "";
          let path = img.startsWith("/") ? img : `/${img}`;
          if (!path.startsWith("/media/") && !path.startsWith("/static/")) path = `/media${path}`;
          return baseUrl ? `${baseUrl}${path}` : path;
        };

        setImagePreview(buildUrl(selectedItem.image));
      } else {
        setImagePreview(null);
      }
    } else {
      setImagePreview(null);
    }
    setSelectedFile(null);

    if (selectedItem) {
      setFormData({
        ...selectedItem,
        category_id: selectedItem.category?.id || selectedItem.category || "",
        restaurant_id: selectedItem.restaurant?.id || selectedItem.restaurant || "",
        // Pre-fill deal menu items (handles if API returns objects or just IDs)
        menu_items: selectedItem.menu_items?.map(mi => mi.id || mi) || [] 
      });
    } else {
      setFormData({
        name: "",
        description: "",
        address: "",
        price: "",
        combo_price: "",
        slug: "",
        is_active: true,
        is_featured: false,
        is_available: true,
        restaurant_id: "",
        menu_items: [] // Empty array for new deals
      });
    }
  }, [selectedItem, modalType]);

  if (!modalType) return null;

  // Derive filtered menu items for Deals dynamically based on the selected restaurant
  const filteredMenuItems = menuItemsList.filter(item => {
    const itemRestId = item.restaurant?.id || item.restaurant;
    return parseInt(itemRestId, 10) === parseInt(formData.restaurant_id, 10);
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      };
      
      // If changing restaurant on a deal, clear out the previously selected menu items
      if (name === "restaurant_id" && modalType.includes("deal")) {
        updated.menu_items = [];
      }
      
      return updated;
    });
  };

  // Dedicated handler for the Deal Menu Items checkboxes
  const handleMenuItemToggle = (itemId) => {
    setFormData((prev) => {
      const currentItems = prev.menu_items || [];
      if (currentItems.includes(itemId)) {
        // Remove item if already checked
        return { ...prev, menu_items: currentItems.filter(id => id !== itemId) };
      } else {
        // Add item if unchecked
        return { ...prev, menu_items: [...currentItems, itemId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();

    if (selectedFile) {
      payload.append("image", selectedFile);
    }

    if (modalType.includes("restaurant")) {
      payload.append("name", formData.name || "");
      payload.append("description", formData.description || "");
      payload.append("address", formData.address || "");
      payload.append("is_featured", formData.is_featured ? "true" : "false");
      payload.append("is_active", formData.is_active ? "true" : "false");
    }

    if (modalType.includes("menuitem")) {
      payload.append("name", formData.name || "");
      payload.append("price", parseFloat(formData.price || 0).toFixed(2));
      payload.append("restaurant_id", parseInt(formData.restaurant_id, 10));
      payload.append("category_id", parseInt(formData.category_id, 10));
      payload.append("description", formData.description || "");
      payload.append("is_available", formData.is_available ? "true" : "false");
      payload.append("is_featured", formData.is_featured ? "true" : "false");
    }

    if (modalType.includes("category")) {
      const categoryPayload = {
        name: formData.name || "",
        slug: (formData.slug || "").toLowerCase().replace(/\s+/g, '-'),
      };
      onSubmitSuccess(categoryPayload);
      return;
    }

    // ... [keep everything else above the same]

    if (modalType.includes("deal")) {
      payload.append("name", formData.name || "");
      payload.append("combo_price", parseFloat(formData.combo_price || 0).toFixed(2));
      payload.append("description", formData.description || "");
      payload.append("is_featured", formData.is_featured ? "true" : "false");
      payload.append("is_active", formData.is_active ? "true" : "false");
      
      if (formData.restaurant_id) {
        payload.append("restaurant_id", parseInt(formData.restaurant_id, 10));
      }
      
      // ❌ REMOVE the forEach loop that appends menu_items to the payload here.
      // Django's Deal creation endpoint hates it and will crash.
    }

    // ✅ PASS the menu_items array as a second argument to the submit handler
    onSubmitSuccess(payload, modalType.includes("deal") ? formData.menu_items : []);
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-brand-dark capitalize">
            {selectedItem ? "Edit" : "Add"} {modalType.replace("-", " ")}
          </h2>
          <button onClick={closeModal} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          <form id="admin-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Image Upload */}
            {!modalType.includes("category") && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500">Cover Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <label className="flex-1 border border-dashed border-gray-300 hover:border-brand-orange bg-gray-50/50 hover:bg-orange-50/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-600">Click to Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* Restaurant Fields */}
            {modalType.includes("restaurant") && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Restaurant Name</label>
                  <input required name="name" value={formData.name || ""} onChange={handleChange} type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                  <textarea name="description" value={formData.description || ""} onChange={handleChange} rows="2" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Full Address</label>
                  <textarea name="address" value={formData.address || ""} onChange={handleChange} rows="2" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none resize-none" />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600">
                    <input type="checkbox" name="is_active" checked={!!formData.is_active} onChange={handleChange} className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4" />
                    Is Active Restaurant
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600">
                    <input type="checkbox" name="is_featured" checked={!!formData.is_featured} onChange={handleChange} className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4" />
                    Is Featured
                  </label>
                </div>
              </>
            )}

            {/* Menu Item Fields */}
            {modalType.includes("menuitem") && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Item Name</label>
                  <input required name="name" value={formData.name || ""} onChange={handleChange} type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Price (£)</label>
                    <input required name="price" value={formData.price || ""} onChange={handleChange} type="number" step="0.01" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                    <select required name="category_id" value={formData.category_id || ""} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none bg-white">
                      <option value="">Select Category</option>
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Restaurant Assignee</label>
                  <select required name="restaurant_id" value={formData.restaurant_id || ""} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none bg-white">
                    <option value="">Select Restaurant</option>
                    {restaurantsList.map(rest => (
                      <option key={rest.id} value={rest.id}>{rest.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                  <textarea name="description" value={formData.description || ""} onChange={handleChange} rows="2" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none resize-none" />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600">
                    <input type="checkbox" name="is_available" checked={!!formData.is_available} onChange={handleChange} className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4" />
                    Available In Stock
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600">
                    <input type="checkbox" name="is_featured" checked={!!formData.is_featured} onChange={handleChange} className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4" />
                    Featured Item
                  </label>
                </div>
              </>
            )}

            {/* Category Fields */}
            {modalType.includes("category") && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Category Name</label>
                  <input required name="name" value={formData.name || ""} onChange={handleChange} type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">URL Slug</label>
                  <input required name="slug" value={formData.slug || ""} onChange={handleChange} type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none" />
                </div>
              </>
            )}

            {/* Deal Fields */}
            {modalType.includes("deal") && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Deal Name</label>
                  <input required name="name" value={formData.name || ""} onChange={handleChange} type="text" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none" />
                </div>
                
                {/* NEW: Restaurant Selection for Deals */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Select Restaurant for Deal</label>
                  <select required name="restaurant_id" value={formData.restaurant_id || ""} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none bg-white">
                    <option value="">-- Choose a Restaurant --</option>
                    {restaurantsList.map(rest => (
                      <option key={rest.id} value={rest.id}>{rest.name}</option>
                    ))}
                  </select>
                </div>

                {/* NEW: Cascading Menu Items Checkboxes */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Select Menu Items</label>
                  {!formData.restaurant_id ? (
                    <div className="text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center">
                      Please select a restaurant first to see its menu items.
                    </div>
                  ) : filteredMenuItems.length === 0 ? (
                    <div className="text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center">
                      This restaurant has no menu items yet.
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2 bg-gray-50/50 space-y-1">
                      {filteredMenuItems.map(item => (
                        <label key={item.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={(formData.menu_items || []).includes(item.id)}
                            onChange={() => handleMenuItemToggle(item.id)}
                            className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4 cursor-pointer"
                          />
                          <div className="flex flex-col flex-1">
                            <span className="text-sm font-bold text-brand-dark">{item.name}</span>
                            <span className="text-xs text-gray-500">Regular Price: ${item.price}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Combo Price ($)</label>
                  <input required name="combo_price" value={formData.combo_price || ""} onChange={handleChange} type="number" step="0.01" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                  <textarea name="description" value={formData.description || ""} onChange={handleChange} rows="2" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none resize-none" />
                </div>
                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600">
                    <input type="checkbox" name="is_active" checked={!!formData.is_active} onChange={handleChange} className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4" />
                    Is Deal Active
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600">
                    <input type="checkbox" name="is_featured" checked={!!formData.is_featured} onChange={handleChange} className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4" />
                    Feature Deal on Home
                  </label>
                </div>
              </>
            )}

          </form>
        </div>

        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 shrink-0">
          <button onClick={closeModal} type="button" className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button form="admin-form" type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange/90 rounded-xl transition-colors shadow-md shadow-brand-orange/20">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}