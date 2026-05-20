import React from 'react';
import { Home, Folder, Settings, BarChart2 } from 'lucide-react';
import { useTheme } from "../../context/themeContext";

const LeftSidebar = () => {
  const { darkMode } = useTheme();
  
  const menuItems = [
    { name: 'Home', icon: Home, active: true },
    { name: 'Files', icon: Folder, active: false },
    { name: 'Analytics', icon: BarChart2, active: false },
    { name: 'Settings', icon: Settings, active: false },
  ];

  return (
    // The outermost wrapper has sticky top-24 applied
    <div className="card-panel sticky top-24">
      <div className="flex flex-col space-y-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
              item.active 
                ? (darkMode ? "bg-slate-700 text-blue-400" : "bg-blue-50 text-blue-600")
                : (darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100")
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;