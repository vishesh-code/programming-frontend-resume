// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   Folder,
//   Edit3,
//   BarChart2,
//   Settings,
//   FileText,
//   CheckSquare,
//   Brain,
//   BookOpen,
//   ChevronDown,
//   ChevronRight,
// } from "lucide-react";
// import { useTheme } from "../../context/themeContext";

// const LeftSidebar = () => {
//   const { darkMode } = useTheme();
//   const location = useLocation();
//   const [isStudyExpanded, setIsStudyExpanded] = useState(false);

//   const menuItems = [
//     { name: "Home", icon: Home, path: "/app" },
//     { name: "Files", icon: Folder, path: "/app/files" },
//     { name: "Notes", icon: FileText, path: "/app/notes" },
//     { name: "Todo", icon: CheckSquare, path: "/app/todo" },
//     { name: "Quiz", icon: Brain, path: "/app/quiz" },
//     {
//       name: "Study",
//       icon: BookOpen,
//       path: "/app/study",
//       subItems: [
//         { name: "Private Study", path: "/app/study?type=private" },
//         { name: "Public Study", path: "/app/study?type=public" },
//       ],
//     },
//     { name: "Analytics", icon: BarChart2, path: "/app/analytics" },
//     { name: "Settings", icon: Settings, path: "/app/settings" },
//   ];

//   return (
//     <div className="card-panel sticky top-24">
//       <div className="flex flex-col space-y-2">
//         {menuItems.map((item, idx) => {
//           const isActive =
//             location.pathname === item.path ||
//             (item.subItems && location.pathname.startsWith(item.path));
//           const hasSubItems = !!item.subItems;

//           return (
//             <div key={idx} className="flex flex-col">
//               {hasSubItems ? (
//                 <button
//                   onClick={() => setIsStudyExpanded(!isStudyExpanded)}
//                   className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
//                     isActive
//                       ? darkMode
//                         ? "bg-slate-700 text-blue-400"
//                         : "bg-blue-50 text-blue-600"
//                       : darkMode
//                         ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
//                         : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
//                   }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <item.icon className="w-5 h-5" />
//                     <span>{item.name}</span>
//                   </div>
//                   {isStudyExpanded ? (
//                     <ChevronDown className="w-4 h-4" />
//                   ) : (
//                     <ChevronRight className="w-4 h-4" />
//                   )}
//                 </button>
//               ) : (
//                 <Link
//                   to={item.path}
//                   className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
//                     isActive
//                       ? darkMode
//                         ? "bg-slate-700 text-blue-400"
//                         : "bg-blue-50 text-blue-600"
//                       : darkMode
//                         ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
//                         : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
//                   }`}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   <span>{item.name}</span>
//                 </Link>
//               )}

//               {/* Render SubItems if the menu is expanded */}
//               {hasSubItems && isStudyExpanded && (
//                 <div className="flex flex-col mt-1 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700 space-y-1">
//                   {item.subItems.map((sub, subIdx) => {
//                     const queryParam = sub.path.split("?")[1];
//                     const isSubActive =
//                       location.pathname === item.path &&
//                       location.search.includes(queryParam);

//                     return (
//                       <Link
//                         key={subIdx}
//                         to={sub.path}
//                         className={`px-3 py-2 rounded-lg text-sm transition-colors ${
//                           isSubActive
//                             ? darkMode
//                               ? "text-blue-400 font-semibold"
//                               : "text-blue-600 font-semibold"
//                             : darkMode
//                               ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
//                               : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/50"
//                         }`}
//                       >
//                         {sub.name}
//                       </Link>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default LeftSidebar;



import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Folder,
  FileText,
  CheckSquare,
  Brain,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";
import { useTheme } from "../../context/themeContext";

// 🔥 FIX: `mobile` lets this render inside AppLayout's mobile drawer
// without the desktop rail's card/sticky styling; `onNavigate` lets the
// drawer close itself when a link is tapped. Both are optional and
// default to the original desktop behavior when omitted.
const LeftSidebar = ({ mobile = false, onNavigate }) => {
  const { darkMode } = useTheme();
  const location = useLocation();
  const [isStudyExpanded, setIsStudyExpanded] = useState(false);

  const menuItems = [
    { name: "Home", icon: Home, path: "/app" },
    { name: "Files", icon: Folder, path: "/app/files" },
    { name: "Notes", icon: FileText, path: "/app/notes" },
    { name: "Todo", icon: CheckSquare, path: "/app/todo" },
    { name: "Quiz", icon: Brain, path: "/app/quiz" },
    { name: "Links", icon: LinkIcon, path: "/app/links" },
    {
      name: "Study",
      icon: BookOpen,
      path: "/app/study",
      subItems: [
        { name: "Private Study", path: "/app/study?type=private" },
        { name: "Public Study", path: "/app/study?type=public" },
      ],
    },
    // 🔥 FIX: "Analytics" (/app/analytics) and "Settings" (/app/settings)
    // don't exist anywhere in App.jsx's route table — App.jsx only defines
    // index/files/notes/todo/quiz/study under /app. Clicking either of
    // these hit the catch-all `<Route path="*" ... />` and silently
    // bounced the user back to "/". Disabled until those pages and their
    // routes actually exist — add the <Route> entries in App.jsx first,
    // then restore these two items (and the BarChart2/Settings imports).
  ];

  return (
    <div className={mobile ? "" : "card-panel sticky top-24"}>
      <div className="flex flex-col space-y-2">
        {menuItems.map((item, idx) => {
          const isActive =
            location.pathname === item.path ||
            (item.subItems && location.pathname.startsWith(item.path));
          const hasSubItems = !!item.subItems;

          return (
            <div key={idx} className="flex flex-col">
              {hasSubItems ? (
                <button
                  onClick={() => setIsStudyExpanded(!isStudyExpanded)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                    isActive
                      ? darkMode
                        ? "bg-slate-700 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                      : darkMode
                        ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {isStudyExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                    isActive
                      ? darkMode
                        ? "bg-slate-700 text-blue-400"
                        : "bg-blue-50 text-blue-600"
                      : darkMode
                        ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )}

              {/* Render SubItems if the menu is expanded */}
              {hasSubItems && isStudyExpanded && (
                <div className="flex flex-col mt-1 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700 space-y-1">
                  {item.subItems.map((sub, subIdx) => {
                    const queryParam = sub.path.split("?")[1];
                    const isSubActive =
                      location.pathname === item.path &&
                      location.search.includes(queryParam);

                    return (
                      <Link
                        key={subIdx}
                        to={sub.path}
                        onClick={onNavigate}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          isSubActive
                            ? darkMode
                              ? "text-blue-400 font-semibold"
                              : "text-blue-600 font-semibold"
                            : darkMode
                              ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                              : "text-slate-600 hover:text-blue-600 hover:bg-blue-50/50"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSidebar;
