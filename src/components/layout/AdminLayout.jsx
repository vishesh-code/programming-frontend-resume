import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/themeContext';
import { useUser } from '../../context/userContext';
import { 
  LayoutDashboard, Users, FolderOpen, 
  StickyNote, Tags, BarChart3, Settings, LogOut 
} from 'lucide-react';

const AdminLayout = () => {
  const { darkMode } = useTheme();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user-role");
    setUser(null);
    navigate("/login");
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/files', icon: FolderOpen, label: 'File Manager' },
    { path: '/admin/notes', icon: StickyNote, label: 'Notes & Content' },
    { path: '/admin/taxonomy', icon: Tags, label: 'Tags & Categories' },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Admin Sidebar */}
      <aside className={`w-64 border-r flex flex-col ${darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
        <div className={`p-6 border-b ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              A
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-tight">Admin Portal</h1>
              <p className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>System Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className={`px-3 text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Modules</p>
          
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                  isActive 
                    ? darkMode 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                      : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : darkMode 
                      ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" 
                      : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} /> 
                {item.label}
              </Link>
            );
          })}

          <div className={`my-6 border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}></div>

          <Link to="/admin/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}>
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>

        <div className={`p-4 border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors w-full font-semibold text-sm">
            <LogOut className="w-4 h-4" /> Logout System
          </button>
        </div>
      </aside>

      {/* Admin Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;