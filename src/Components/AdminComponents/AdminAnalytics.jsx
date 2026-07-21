import React, { useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Activity, Users } from "lucide-react";

// 👇 Added onTimeFrameChange to the props here
export default function AdminAnalytics({ ordersByStatus = [], analyticsOverviewData = null, revenueOverTime = [], totalRestaurantsCount = 0, onTimeFrameChange }) {
  const [timeFrame, setTimeFrame] = useState("weekly");

  const PIE_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  // 1. FORMAT ORDERS STATUS DATA (Donut Chart)
  const formattedOrderStatus = ordersByStatus.map(item => ({
    name: item.status || item.current_status || item.name || 'Unknown',
    value: Number(item.count || item.total || item.value || 0)
  })).filter(item => item.value > 0); 

  // 2. EXTRACT SUMMARY METRICS FROM /analytics/overview/ (For the top cards)
  const actualOverviewData = analyticsOverviewData?.data?.data || analyticsOverviewData?.data || analyticsOverviewData || {};
  
  const totalRevenue = actualOverviewData.total_revenue || actualOverviewData.revenue || actualOverviewData.total || 0;
  const totalOrders = actualOverviewData.total_orders || actualOverviewData.orders || formattedOrderStatus.reduce((sum, item) => sum + item.value, 0);
  const activeRestaurants = actualOverviewData.active_restaurants || actualOverviewData.restaurants || totalRestaurantsCount;
  const totalUsers = actualOverviewData.total_users || actualOverviewData.users || 0;

  // 3. EXTRACT CHART ARRAY FROM /analytics/revenue-over-time/ (Dynamic Data)
  const actualChartData = revenueOverTime?.data?.data || revenueOverTime?.data || revenueOverTime || [];
  
  let rawChartArray = [];
  if (Array.isArray(actualChartData)) {
    rawChartArray = actualChartData;
  } else if (typeof actualChartData === 'object') {
    if (Array.isArray(actualChartData[timeFrame])) {
      rawChartArray = actualChartData[timeFrame];
    } else {
      const arrayKeys = Object.keys(actualChartData).filter(key => Array.isArray(actualChartData[key]));
      if (arrayKeys.length > 0) {
        rawChartArray = actualChartData[arrayKeys[0]];
      }
    }
  }
  
  // 👇 UPDATE THIS BLOCK TO FORMAT DATES 👇
  const formattedOverview = rawChartArray.map((item, index) => {
    const defaultLabel = `${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} ${index + 1}`;

    if (typeof item === 'number') return { name: defaultLabel, total: item };

    const keys = Object.keys(item || {});
    let label = item.date || item.day || item.week || item.month || item.period || item.label || item.created_at;
    let value = item.total || item.revenue || item.total_revenue || item.amount || item.value || item.sales || item.count;

    if (label === undefined && keys.length > 0) label = item[keys[0]];
    if (value === undefined && keys.length > 1) value = item[keys[1]];

    // --- NEW DATE FORMATTING LOGIC ---
    let displayName = String(label || defaultLabel);
    
    // If the label looks like a date string (contains hyphens like 2026-07-01)
    if (typeof displayName === 'string' && displayName.includes('-')) {
      const dateObj = new Date(displayName);
      if (!isNaN(dateObj)) {
        if (timeFrame === 'monthly') {
          // Turns 2026-07-01T00:00:00Z into "Jul 2026"
          displayName = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
          // Turns 2026-07-01T00:00:00Z into "Jul 1"
          displayName = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      }
    }
    // ---------------------------------

    return {
      name: displayName,
      total: Number(value || 0)
    };
  });

  return (
    <div className="space-y-6 animation-fade-in">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-brand-dark tracking-tight">System Analytics</h2>
        <p className="text-sm text-gray-500 font-medium">Detailed overview of your platform's performance.</p>
      </div>

      {/* 🚀 Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <ShoppingBag size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">Total Orders</p>
            <h3 className="text-2xl font-black text-gray-800">{Number(totalOrders).toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">Total Revenue</p>
            <h3 className="text-2xl font-black text-gray-800">${Number(totalRevenue).toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">Restaurants</p>
            <h3 className="text-2xl font-black text-gray-800">{activeRestaurants}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold mb-1">Total Users</p>
            <h3 className="text-2xl font-black text-gray-800">{Number(totalUsers).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* 📊 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 1: Orders By Status */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
            Orders By Status
          </h3>
          <div className="flex-1 min-h-[320px] w-full">
            {formattedOrderStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={formattedOrderStatus} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" nameKey="name" stroke="none">
                    {formattedOrderStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                  </Pie>
                  <ChartTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontWeight: 'bold' }} formatter={(value, name) => [value, String(name).toUpperCase()]} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium bg-gray-50 rounded-xl">
                No order status data available
              </div>
            )}
          </div>
        </div>

        {/* Graph 2: Revenue Over Time */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity className="text-brand-orange" size={24} />
              Revenue
            </h3>
            
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['daily', 'weekly', 'monthly'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    
                    setTimeFrame(tf); 
                    // 2. Tell Dashboard to fetch the new API data
                    if (onTimeFrameChange) {
                      onTimeFrameChange(tf);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 capitalize ${
                    timeFrame === tf 
                      ? 'bg-white text-gray-800 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[320px] w-full">
            {formattedOverview.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedOverview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOverview" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7F50" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF7F50" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `$${val}`} />
                  <ChartTooltip cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(val) => [`$${val.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="total" stroke="#FF7F50" strokeWidth={3} fillOpacity={1} fill="url(#colorOverview)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-start justify-center p-4 text-gray-400 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                <p className="text-sm font-bold text-gray-600 mb-1">No chart data found for {timeFrame}.</p>
                <p className="text-xs text-gray-400 mb-3">API returned this for '/revenue-over-time/':</p>
                <pre className="text-[11px] bg-slate-900 text-green-400 p-3 rounded-lg w-full max-h-[200px] overflow-auto whitespace-pre-wrap font-mono">
                  {JSON.stringify(actualChartData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}