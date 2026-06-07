import React from 'react';
import { useTheme } from '../../context/themeContext';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, Users, Code, Activity, Download } from 'lucide-react';

const AdminAnalytics = () => {
  const { darkMode } = useTheme();

  // --- DUMMY DATA ---
  const userGrowthData = [
    { name: 'Jan', users: 400 }, { name: 'Feb', users: 600 },
    { name: 'Mar', users: 850 }, { name: 'Apr', users: 930 },
    { name: 'May', users: 1248 }
  ];

  const weeklyActivityData = [
    { day: 'Mon', solved: 120 }, { day: 'Tue', solved: 210 },
    { day: 'Wed', solved: 180 }, { day: 'Thu', solved: 240 },
    { day: 'Fri', solved: 190 }, { day: 'Sat', solved: 320 },
    { day: 'Sun', solved: 280 }
  ];

  const difficultyData = [
    { name: 'Easy', value: 4500, color: '#10b981' },   // Emerald
    { name: 'Medium', value: 2800, color: '#f59e0b' }, // Amber
    { name: 'Hard', value: 1132, color: '#ef4444' }    // Red
  ];

  // --- STYLING HELPERS ---
  const textColor = darkMode ? '#94a3b8' : '#64748b';
  const gridColor = darkMode ? '#334155' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderColor: darkMode ? '#334155' : '#e2e8f0',
    color: darkMode ? '#f8fafc' : '#0f172a',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>System Analytics</h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Monitor platform performance and user engagement.</p>
        </div>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium text-sm border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"}`}>
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Users", value: "1,248", increment: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { title: "Active Today", value: "342", increment: "+5%", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
          { title: "Problems Solved", value: "8,432", increment: "+24%", icon: Code, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { title: "Avg. Success Rate", value: "68%", increment: "+2%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${darkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                {stat.increment}
              </span>
            </div>
            <div>
              <h3 className={`text-3xl font-black ${darkMode ? "text-white" : "text-slate-900"}`}>{stat.value}</h3>
              <p className={`text-sm font-medium mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Growth Line Chart (Takes up 2 columns) */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="mb-6">
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>User Growth</h2>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>New registrations over the last 5 months</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: gridColor, strokeWidth: 1, strokeDasharray: '5 5' }} />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Pie Chart (Takes up 1 column) */}
        <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="mb-6">
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Questions Solved</h2>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Breakdown by difficulty level</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: darkMode ? '#fff' : '#000' }} />
                <Pie data={difficultyData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: textColor }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Bar Chart (Takes up full width below) */}
        <div className={`lg:col-span-3 p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className="mb-6">
            <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Weekly Platform Activity</h2>
            <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Total number of code submissions processed this week</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: darkMode ? '#334155' : '#f1f5f9', opacity: 0.4 }} />
                <Bar dataKey="solved" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAnalytics;