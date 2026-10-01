// import { useUser } from "../../context/userContext";
// import { useTheme } from "../../context/themeContext";
// import { useNavigate } from "react-router-dom";
// import { Code, Sun, Moon, LogOut } from "lucide-react";

// const Header = ({ stats }) => {
//   const { user, setUser } = useUser();
//   const { darkMode, setDarkMode } = useTheme();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100'} border-b sticky top-0 z-20 shadow-sm`}>
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

//         {/* LEFTMOST: Logo and Name */}
//         <div className="flex items-center space-x-3">
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
//             <Code className="h-7 w-7 text-white" />
//           </div>
//           <div>
//             <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>CodeMaster</h1>
//             <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
//               Master programming fundamentals
//             </p>
//           </div>
//         </div>

//         {/* RIGHTMOST: All other modules inline */}
//         <div className="flex items-center space-x-6">
//           {/* Completed stats */}
//           <div className="text-center">
//             <div className="flex items-center justify-center mb-1">
//               <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stats.solved}</div>
//               <div className={`text-lg ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>/{stats.total}</div>
//             </div>
//             <div className={`text-xs uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>COMPLETED</div>
//             <div className={`mt-1 rounded-full h-1.5 w-16 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
//               <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${stats.percentage}%` }}></div>
//             </div>
//           </div>
          
//           {/* User email */}
//           <span className={`font-mono text-xs px-3 py-1.5 rounded-xl border border-blue-300 ${darkMode ? 'bg-slate-700 text-yellow-200' : 'bg-indigo-50 text-indigo-600'}`}>
//             {user && user.email ? user.email : "Not logged in"}
//           </span>

//           {/* Logout Button */}
//           {user && user.email && (
//             <button
//               onClick={handleLogout}
//               title="Logout"
//               className={`px-3 py-1.5 rounded-xl font-medium flex items-center space-x-2 transition-colors border ${
//                 darkMode ? "bg-slate-700 text-red-300 border-slate-600 hover:bg-slate-600" : "bg-white text-red-600 border-red-200 hover:bg-red-50"
//               }`}
//             >
//               <LogOut className="h-4 w-4" />
//               <span>Logout</span>
//             </button>
//           )}

//           {/* Dark mode toggle */}
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             title="Toggle Dark Mode"
//             className={`p-2 rounded-lg transition-colors ${
//               darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//             }`}
//           >
//             {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Header;


import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/userContext";
import { useTheme } from "../../context/themeContext";
import { useNavigate } from "react-router-dom";
import { Code, Sun, Moon, LogOut, Menu } from "lucide-react";
import apiClient from "../../utils/apiClient";

// 🔥 FIX: Header used to receive `stats={{ total: 0, solved: 0, percentage: 0, ... }}`
// as a hardcoded prop from AppLayout — it displayed "0/0 COMPLETED" no matter
// how many problems the user actually solved. RightSidebar already fetches the
// real numbers from /problems/stats, so Header now fetches the same endpoint
// itself and stays in sync (including live updates via the same
// "problemStatusChanged" event RightSidebar already listens for).
const Header = ({ onMenuClick }) => {
  const { user, setUser } = useUser();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ solved: 0, targetGoal: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get("/problems/stats");
      setStats({
        solved: Number(response.data?.solved) || 0,
        targetGoal: Number(response.data?.targetGoal) || 0,
      });
    } catch (err) {
      console.error("Failed to fetch header stats", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    window.addEventListener("problemStatusChanged", fetchStats);
    return () => window.removeEventListener("problemStatusChanged", fetchStats);
  }, [fetchStats]);

  const total = stats.targetGoal;
  const solved = stats.solved;
  const percentage = total > 0 ? Math.min(Math.round((solved / total) * 100), 100) : 0;

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100'} border-b sticky top-0 z-20 shadow-sm`}>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">

        {/* LEFTMOST: Mobile menu button + Logo and Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* 🔥 FIX: LeftSidebar (all primary navigation — Home, Files,
              Notes, Todo, Quiz, Study) is `hidden md:block` with no
              alternative below that breakpoint, so phone/small-tablet
              users previously had no way to navigate the app at all once
              they landed on a page. This button opens it as a drawer
              (see AppLayout.jsx). */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className={`md:hidden p-2 -ml-1 rounded-lg shrink-0 ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 sm:p-2.5 rounded-xl shadow-lg shrink-0">
            <Code className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className={`text-lg sm:text-2xl font-bold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>CodeMaster</h1>
            {/* Tagline dropped on phones — no room, and it's not essential info */}
            <p className={`hidden sm:block text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Master programming fundamentals
            </p>
          </div>
        </div>

        {/* RIGHTMOST: All other modules inline */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
          {/* Completed stats — hidden below sm, there just isn't room next to the logo + actions */}
          <div className="hidden sm:block text-center">
            <div className="flex items-center justify-center mb-1">
              <div className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{solved}</div>
              <div className={`text-base sm:text-lg ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>/{total}</div>
            </div>
            <div className={`text-[10px] sm:text-xs uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>COMPLETED</div>
            <div className={`mt-1 rounded-full h-1.5 w-12 sm:w-16 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>

          {/* User email — hidden below sm, and now truncates instead of stretching the header on mid-size screens */}
          <span className={`hidden sm:inline-block font-mono text-xs px-3 py-1.5 rounded-xl border border-blue-300 max-w-[140px] md:max-w-none truncate align-middle ${darkMode ? 'bg-slate-700 text-yellow-200' : 'bg-indigo-50 text-indigo-600'}`}>
            {user && user.email ? user.email : "Not logged in"}
          </span>

          {/* Logout Button */}
          {user && user.email && (
            <button
              onClick={handleLogout}
              title="Logout"
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 sm:gap-2 transition-colors border ${
                darkMode ? "bg-slate-700 text-red-300 border-slate-600 hover:bg-slate-600" : "bg-white text-red-600 border-red-200 hover:bg-red-50"
              }`}
            >
              <LogOut className="h-4 w-4" />
              {/* Label hidden on phones/small tablets — icon + title tooltip is enough */}
              <span className="hidden md:inline">Logout</span>
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark Mode"
            className={`p-2 rounded-lg transition-colors shrink-0 ${
              darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Header;