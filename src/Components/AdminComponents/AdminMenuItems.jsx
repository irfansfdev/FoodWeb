import { Plus, Search, Edit2, Trash2 } from "lucide-react";

export default function AdminMenuItems({ menuItems, searchQuery, setSearchQuery, openModal, handleDeleteMenuitem }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 focus:border-brand-orange focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
        </div>
        <button onClick={() => openModal("add-menuitem")} className="bg-brand-orange hover:bg-brand-orange/95 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-orange/15 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
          <Plus className="w-4 h-4" /> Create Menu Item
        </button>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200/80 text-gray-500 font-bold text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Dish</th>
                <th className="px-6 py-4">Restaurant</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {menuItems
                .filter(item => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-dark">{item.name}</td>
                    
                    {/* FIXED: Extracting name from restaurant object safely */}
                    <td className="px-6 py-4 text-gray-600">
                      {typeof item.restaurant === 'object' && item.restaurant !== null 
                        ? item.restaurant.name 
                        : (item.restaurant || "N/A")}
                    </td>
                    
                    {/* FIXED: Extracting name from category object safely */}
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-semibold">
                        {typeof item.category === 'object' && item.category !== null 
                          ? item.category.name 
                          : (item.category || "General")}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 font-black text-brand-dark">${parseFloat(item.price || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-xs text-gray-400 truncate max-w-xs">{item.description}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button onClick={() => openModal("edit-menuitem", item)} className="p-2 text-gray-500 hover:text-brand-orange hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteMenuitem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}