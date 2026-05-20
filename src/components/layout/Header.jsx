import { useUser } from "../../context/userContext";
import { useTheme } from "../../context/themeContext";
import { useNavigate } from "react-router-dom";
import { Code, Sun, Moon, LogOut } from "lucide-react";

const Header = ({ stats }) => {
  const { user, setUser } = useUser();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100'} border-b sticky top-0 z-20 shadow-sm`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* LEFTMOST: Logo and Name */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
            <Code className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>CodeMaster</h1>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Master programming fundamentals
            </p>
          </div>
        </div>

        {/* RIGHTMOST: All other modules inline */}
        <div className="flex items-center space-x-6">
          {/* Completed stats */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stats.solved}</div>
              <div className={`text-lg ml-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>/{stats.total}</div>
            </div>
            <div className={`text-xs uppercase tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>COMPLETED</div>
            <div className={`mt-1 rounded-full h-1.5 w-16 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${stats.percentage}%` }}></div>
            </div>
          </div>
          
          {/* User email */}
          <span className={`font-mono text-xs px-3 py-1.5 rounded-xl border border-blue-300 ${darkMode ? 'bg-slate-700 text-yellow-200' : 'bg-indigo-50 text-indigo-600'}`}>
            {user && user.email ? user.email : "Not logged in"}
          </span>

          {/* Logout Button */}
          {user && user.email && (
            <button
              onClick={handleLogout}
              title="Logout"
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center space-x-2 transition-colors border ${
                darkMode ? "bg-slate-700 text-red-300 border-slate-600 hover:bg-slate-600" : "bg-white text-red-600 border-red-200 hover:bg-red-50"
              }`}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark Mode"
            className={`p-2 rounded-lg transition-colors ${
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