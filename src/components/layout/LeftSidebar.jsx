// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Home, Folder, Settings, BarChart2 } from "lucide-react";
// import { useTheme } from "../../context/themeContext";

// const LeftSidebar = () => {
//   const { darkMode } = useTheme();
//   const location = useLocation(); // Gets the current URL path

//   // Added 'path' to each item to control navigation
//   const menuItems = [
//     { name: "Home", icon: Home, path: "/app" },
//     { name: "Files", icon: Folder, path: "/app/files" },
//     { name: "Analytics", icon: BarChart2, path: "/app/analytics" },
//     { name: "Settings", icon: Settings, path: "/app/settings" }, 
//   ];

//   return (
//     // The outermost wrapper has sticky top-24 applied
//     <div className="card-panel sticky top-24">
//       <div className="flex flex-col space-y-2">
//         {menuItems.map((item, idx) => {
//           // Dynamically check if the current URL matches the item's path
//           const isActive = location.pathname === item.path;

//           return (
//             <Link
//               key={idx}
//               to={item.path}
//               className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
//                 isActive
//                   ? darkMode
//                     ? "bg-slate-700 text-blue-400"
//                     : "bg-blue-50 text-blue-600"
//                   : darkMode
//                     ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
//                     : "text-slate-600 hover:bg-slate-100"
//               }`}
//             >
//               <item.icon className="h-5 w-5" />
//               <span>{item.name}</span>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default LeftSidebar;


import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Folder, Settings, BarChart2, Edit3 } from "lucide-react";
import { useTheme } from "../../context/themeContext";

const LeftSidebar = () => {
  const { darkMode } = useTheme();
  const location = useLocation();

  const menuItems = [
    { name: "Home", icon: Home, path: "/app" },
    { name: "Files", icon: Folder, path: "/app/files" },
    { name: "Notes", icon: Edit3, path: "/app/notes" }, // Added Notes Tab
    { name: "Analytics", icon: BarChart2, path: "/app/analytics" },
    { name: "Settings", icon: Settings, path: "/app/settings" }, 
  ];

  return (
    <div className="card-panel sticky top-24">
      <div className="flex flex-col space-y-2">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                isActive
                  ? darkMode
                    ? "bg-slate-700 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                  : darkMode
                    ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSidebar;