import React, { useEffect } from "react";
import { Plus, Edit2, Trash2, Tags, Inbox } from "lucide-react";

export default function AdminCategories({ categories, openModal, handleDeleteCategory }) {
  
  // DEBUG LOG: See exactly what data is being passed from DashboardHome
  useEffect(() => {
    console.log("📂 Current Categories Data inside Component:", categories);
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-brand-dark font-bold">
          <Tags className="w-5 h-5 text-brand-orange" />
          <span>Menu Categories</span>
        </div>
        <button 
          onClick={() => openModal("add-category")} 
          className="bg-brand-orange hover:bg-brand-orange/95 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-brand-orange/15 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Table & Data Handling */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
        {!categories || categories.length === 0 ? (
          /* Empty State Handler */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-brand-dark">No categories found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Click the "Add Category" button above to create your first menu category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200/80 text-gray-500 font-bold text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 w-24">ID</th>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">URL Slug</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-400">{c.id}</td>
                    <td className="px-6 py-4 font-bold text-brand-dark">{c.name}</td>
                    
                    {/* FIXED: Removed inline-block from <td> and placed it on the nested <span> to avoid row layout collapses */}
                    <td className="px-6 py-4">
                      <span className="text-gray-500 bg-gray-50/50 rounded font-mono text-xs inline-block border border-gray-100 px-2.5 py-1">
                        /{c.slug || c.name?.toLowerCase().replace(/\s+/g, '-')}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button 
                          onClick={() => openModal("edit-category", c)} 
                          className="p-2 text-gray-500 hover:text-brand-orange hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(c.id)} 
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
        )}
      </div>
    </div>
  );
}