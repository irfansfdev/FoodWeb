import { Plus, Edit2, Trash2, Percent } from "lucide-react";
import api from "../../api/axios"; 

const formatImageUrl = (urlStr) => {
  if (!urlStr) return "";
  if (urlStr.startsWith("http")) return urlStr;

  const baseUrl = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/$/, "") : "";
  const path = urlStr.startsWith("/") ? urlStr : `/${urlStr}`;

  return `${baseUrl}${path}`;
};

export default function AdminDeals({ deals = [], openModal, handleDeleteDeal }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-brand-dark font-bold">
          <Percent className="w-5 h-5 text-brand-orange" />
          <span>Active Promotional Deals</span>
        </div>
        <button 
          onClick={() => openModal("add-deal")} 
          className="bg-brand-orange hover:bg-brand-orange/95 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-orange/15 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Deal
        </button>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200/80 text-gray-500 font-bold text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deals.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-brand-dark">{d.name}</td>
                  <td className="px-6 py-4">
                    {d.image ? (
                      <img 
                        // 👇 Dynamic image URL resolution
                        src={formatImageUrl(d.image)} 
                        alt={d.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs truncate max-w-xs">
                    {d.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-brand-orange bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                      ${d.combo_price}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button 
                        onClick={() => openModal("edit-deal", d)} 
                        className="p-2 text-gray-500 hover:text-brand-orange hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDeal(d.id)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
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