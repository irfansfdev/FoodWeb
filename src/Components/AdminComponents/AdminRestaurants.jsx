import { Plus, Edit2, Trash2 } from "lucide-react";
import { getImageUrl } from "/src/api/axios";

export default function AdminRestaurants({ restaurants, openModal, handleDeleteRestaurant }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm">
        <span className="text-sm text-gray-500 font-semibold">Registered Restaurant Brands</span>
        <button onClick={() => openModal("add-restaurant")} className="bg-brand-orange hover:bg-brand-orange/95 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-orange/15 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Register Restaurant
        </button>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200/80 text-gray-500 font-bold text-xs uppercase tracking-wider">
                
                <th className="px-6 py-4">Restaurant Name</th>
                <th className="px-6 py-4 w-44">Image</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {restaurants.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/30 transition-colors">
                  
                  {/* Name Column */}
                  <td className="px-6 py-4 font-bold text-brand-dark capitalize text-base">
                    {r.name}
                  </td>

                   {/* Image Column */}
                  <td className="px-6 py-4">
                    {r.image ? (
                      <img 
                        src={getImageUrl(r.image)} 
                        alt={r.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium">
                        No Img
                      </div>
                    )}
                  </td>
                  
                  {/* Actions Column */}
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button 
                        onClick={() => openModal("edit-restaurant", r)} 
                        className="p-2 text-gray-500 hover:text-brand-orange hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                        title="Edit Restaurant"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRestaurant(r.id)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                        title="Delete Restaurant"
                      >
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