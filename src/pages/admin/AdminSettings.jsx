
import React from 'react';
import { useTheme } from '../../context/themeContext';
import { Save } from 'lucide-react';

const AdminSettings = () => {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-6 animate-fadeUp">
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>System Settings</h1>
        <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Configure global application preferences.</p>
      </div>

      <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <form className="space-y-5 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
          
          <div className="space-y-1.5">
            <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Platform Name</label>
            <input type="text" defaultValue="CodeMaster Pro" className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`} />
          </div>

          <div className="space-y-1.5">
            <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Admin Support Email</label>
            <input type="email" defaultValue="support@example.com" className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`} />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl mt-4 bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
            <div>
              <h4 className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-900"}`}>Maintenance Mode</h4>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Disable access to normal users while upgrading the system.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md transition-all font-medium">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AdminSettings;