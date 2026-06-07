// import React, { useState } from 'react';
// import { useTheme } from '../../context/themeContext';
// import { Search, Plus, MoreVertical, Edit2, Trash2, Shield, User } from 'lucide-react';

// const AdminUsers = () => {
//   const { darkMode } = useTheme();
//   const [searchTerm, setSearchTerm] = useState("");

//   // Dummy Data representing what your API will return
//   const [users] = useState([
//     { id: 1, name: "Admin User", email: "admin@example.com", role: "admin", status: "Active", joined: "Oct 12, 2025" },
//     { id: 2, name: "John Doe", email: "john@example.com", role: "user", status: "Active", joined: "Nov 05, 2025" },
//     { id: 3, name: "Jane Smith", email: "jane.smith@gmail.com", role: "user", status: "Inactive", joined: "Dec 22, 2025" },
//     { id: 4, name: "Music Garden", email: "music.garden@youtube.com", role: "user", status: "Active", joined: "Feb 14, 2026" },
//   ]);

//   const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.name.toLowerCase().includes(searchTerm.toLowerCase()));

//   return (
//     <div className="space-y-6 animate-fadeUp">
      
//       {/* Header Actions */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>User Management</h1>
//           <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage system access, roles, and user accounts.</p>
//         </div>
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-all font-medium text-sm">
//           <Plus className="w-4 h-4" /> Add User
//         </button>
//       </div>

//       {/* Module Card */}
//       <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        
//         {/* Toolbar */}
//         <div className={`p-4 border-b flex justify-between items-center ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
//           <div className="relative w-full max-w-sm">
//             <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
//             <input 
//               type="text" 
//               placeholder="Search users by name or email..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
//                 darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900"
//               }`}
//             />
//           </div>
//           <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
//             Total: {filteredUsers.length}
//           </span>
//         </div>

//         {/* Data Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className={`text-xs uppercase font-semibold ${darkMode ? "bg-slate-900/50 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
//               <tr>
//                 <th className="px-6 py-4">User</th>
//                 <th className="px-6 py-4">Role</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4">Joined</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className={`divide-y ${darkMode ? "divide-slate-700/50" : "divide-slate-100"}`}>
//               {filteredUsers.map((user) => (
//                 <tr key={user.id} className={`transition-colors hover:bg-slate-50/50 ${darkMode ? "hover:bg-slate-700/20" : ""}`}>
                  
//                   {/* User Column */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                         user.role === 'admin' ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
//                       }`}>
//                         {user.name.charAt(0)}
//                       </div>
//                       <div>
//                         <div className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-900"}`}>{user.name}</div>
//                         <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{user.email}</div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Role Column */}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-1.5">
//                       {user.role === 'admin' ? <Shield className="w-4 h-4 text-indigo-500" /> : <User className="w-4 h-4 text-slate-400" />}
//                       <span className={`font-medium capitalize ${user.role === 'admin' ? (darkMode ? "text-indigo-400" : "text-indigo-600") : (darkMode ? "text-slate-300" : "text-slate-700")}`}>
//                         {user.role}
//                       </span>
//                     </div>
//                   </td>

//                   {/* Status Column */}
//                   <td className="px-6 py-4">
//                     <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
//                       user.status === 'Active' 
//                         ? darkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700"
//                         : darkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"
//                     }`}>
//                       {user.status}
//                     </span>
//                   </td>

//                   {/* Joined Date Column */}
//                   <td className={`px-6 py-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
//                     {user.joined}
//                   </td>

//                   {/* Actions Column */}
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       <button className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-blue-400 hover:bg-slate-700" : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"}`} title="Edit User">
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-700" : "text-slate-500 hover:text-red-600 hover:bg-red-50"}`} title="Delete User">
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                       <button className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"}`}>
//                         <MoreVertical className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
                  
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {filteredUsers.length === 0 && (
//             <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
//               No users found matching your search.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;


import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/themeContext';
import { Search, Plus, Trash2, Shield, User, Power } from 'lucide-react';
import apiClient from '../../utils/apiClient'; // ⚠️ Adjust this path to where your apiClient.js is located
import { useUser } from '../../context/UserContext'; // ⚠️ Adjust if needed to get current logged in user

const AdminUsers = () => {
  const { darkMode } = useTheme();
  const { user: currentUser } = useUser(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  console.log("userss",users)
  const [loading, setLoading] = useState(true);

  // 1. Fetch Users from Database
// 1. Fetch Users from Database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/admin/users');
      
      // Since backend now sends { success: true, count: X, users: [...] }
      // We can directly access data.users
      setUsers(data.users || []); 
      
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Handle Activate / Deactivate
  const handleToggleStatus = async (userId, currentStatus) => {
    const actionText = currentStatus ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${actionText} this user?`)) return;

    try {
      const { data } = await apiClient.put(`/admin/users/${userId}/deactivate`);
      // Update the user in the local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isActive: data.isActive } : u
      ));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change user status");
    }
  };

  // 3. Handle Permanent Delete
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("WARNING: Are you sure you want to PERMANENTLY delete this user and all their data? This cannot be undone.")) return;

    try {
      await apiClient.delete(`/admin/users/${userId}`);
      // Remove the user from the local state
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  // Filter based on email (since we only store email in DB, we use it for both)
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeUp">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>User Management</h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage system access, roles, and user accounts.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-all font-medium text-sm">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Module Card */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        
        {/* Toolbar */}
        <div className={`p-4 border-b flex justify-between items-center ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
          <div className="relative w-full max-w-sm">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
            <input 
              type="text" 
              placeholder="Search users by email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            />
          </div>
          <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Total: {filteredUsers.length}
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
               Loading users...
             </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase font-semibold ${darkMode ? "bg-slate-900/50 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-slate-700/50" : "divide-slate-100"}`}>
                {filteredUsers.map((user) => {
                  // Derive a display name from the email (e.g. "john.doe" from "john.doe@gmail.com")
                  const displayName = user.email.split('@')[0];
                  // If this is the currently logged in admin, we can label them admin visually
                  const isSuperAdmin = currentUser?.email === user.email;
                  const displayRole = isSuperAdmin ? 'admin' : 'user';

                  return (
                    <tr key={user._id} className={`transition-colors hover:bg-slate-50/50 ${darkMode ? "hover:bg-slate-700/20" : ""}`}>
                      
                      {/* User Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold uppercase ${
                            displayRole === 'admin' ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}>
                            {displayName.charAt(0)}
                          </div>
                          <div>
                            <div className={`font-semibold capitalize ${darkMode ? "text-slate-200" : "text-slate-900"}`}>
                              {displayName}
                            </div>
                            <div className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {displayRole === 'admin' ? <Shield className="w-4 h-4 text-indigo-500" /> : <User className="w-4 h-4 text-slate-400" />}
                          <span className={`font-medium capitalize ${displayRole === 'admin' ? (darkMode ? "text-indigo-400" : "text-indigo-600") : (darkMode ? "text-slate-300" : "text-slate-700")}`}>
                            {displayRole}
                          </span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.isActive !== false 
                            ? (darkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700")
                            : (darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700")
                        }`}>
                          {user.isActive !== false ? 'Active' : 'Deactivated'}
                        </span>
                      </td>

                      {/* Joined Date Column */}
                      <td className={`px-6 py-4 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                        {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Deactivate/Activate Button */}
                          <button 
                            onClick={() => handleToggleStatus(user._id, user.isActive !== false)}
                            disabled={isSuperAdmin} // Prevent admin from deactivating themselves
                            className={`p-2 rounded-lg transition-colors ${
                              isSuperAdmin 
                                ? "opacity-30 cursor-not-allowed" 
                                : darkMode ? "text-slate-400 hover:text-amber-400 hover:bg-slate-700" : "text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                            }`} 
                            title={user.isActive !== false ? "Deactivate User" : "Activate User"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          
                          {/* Delete Button */}
                          <button 
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={isSuperAdmin} // Prevent admin from deleting themselves
                            className={`p-2 rounded-lg transition-colors ${
                              isSuperAdmin 
                                ? "opacity-30 cursor-not-allowed" 
                                : darkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-700" : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                            }`} 
                            title="Permanently Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                        </div>
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          
          {/* Empty State */}
          {!loading && filteredUsers.length === 0 && (
            <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;