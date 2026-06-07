// import React,{useState} from 'react';
// import { useTheme } from '../../context/themeContext';
// import { Search, Plus, Edit2, Trash2, StickyNote } from 'lucide-react';

// const AdminNotes = () => {
//   const { darkMode } = useTheme();

//   const [notes] = useState([
//     { id: 1, title: "React Performance Tips", author: "Admin", status: "Published", date: "May 25, 2026" },
//     { id: 2, title: "Graph Algorithms Explained", author: "John Doe", status: "Draft", date: "May 26, 2026" },
//   ]);

//   return (
//     <div className="space-y-6 animate-fadeUp">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Notes & Content</h1>
//           <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage study notes and platform content.</p>
//         </div>
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-all font-medium text-sm">
//           <Plus className="w-4 h-4" /> Create Note
//         </button>
//       </div>

//       <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
//         <div className={`p-4 border-b flex justify-between items-center ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
//           <div className="relative w-full max-w-sm">
//             <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
//             <input 
//               type="text" placeholder="Search notes..." 
//               className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className={`text-xs uppercase font-semibold ${darkMode ? "bg-slate-900/50 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
//               <tr>
//                 <th className="px-6 py-4">Title</th>
//                 <th className="px-6 py-4">Author</th>
//                 <th className="px-6 py-4">Status</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className={`divide-y ${darkMode ? "divide-slate-700/50" : "divide-slate-100"}`}>
//               {notes.map((note) => (
//                 <tr key={note.id} className={`transition-colors hover:bg-slate-50/50 ${darkMode ? "hover:bg-slate-700/20" : ""}`}>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <StickyNote className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-500"}`} />
//                       <span className={`font-semibold ${darkMode ? "text-slate-200" : "text-slate-900"}`}>{note.title}</span>
//                     </div>
//                   </td>
//                   <td className={`px-6 py-4 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{note.author}</td>
//                   <td className="px-6 py-4">
//                     <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${note.status === 'Published' ? (darkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700") : (darkMode ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700")}`}>
//                       {note.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       <button className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-blue-400 hover:bg-slate-700" : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"}`}><Edit2 className="w-4 h-4" /></button>
//                       <button className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-700" : "text-slate-500 hover:text-red-600 hover:bg-red-50"}`}><Trash2 className="w-4 h-4" /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default AdminNotes;



import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/themeContext';
import { Search, FileText, Trash2, Eye, X } from 'lucide-react';
import apiClient from '../../utils/apiClient'; // ⚠️ Adjust path if necessary

const AdminNotes = () => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Viewing Modal
  const [selectedNote, setSelectedNote] = useState(null);

  // 1. Fetch Notes from Database
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/admin/notes');
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 2. Handle Delete Note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to permanently delete this note?")) return;

    try {
      await apiClient.delete(`/admin/notes/${noteId}`);
      setNotes(notes.filter(n => n._id !== noteId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete note");
    }
  };

  // Filter notes based on title or user email
  const filteredNotes = notes.filter(n => 
    (n.title && n.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (n.user && n.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeUp relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Notes Manager</h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>View and manage all user-generated notes.</p>
        </div>
      </div>

      {/* Module Card */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        
        {/* Toolbar */}
        <div className={`p-4 border-b flex justify-between items-center ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
          <div className="relative w-full max-w-sm">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
            <input 
              type="text" 
              placeholder="Search by title or author email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            />
          </div>
          <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Total: {filteredNotes.length}
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
               Loading notes...
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase font-semibold ${darkMode ? "bg-slate-900/50 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-slate-700/50" : "divide-slate-100"}`}>
                {filteredNotes.map((note) => {
                  const authorName = note.user && note.user.email ? note.user.email.split('@')[0] : 'Unknown';

                  return (
                    <tr key={note._id} className={`transition-colors hover:bg-slate-50/50 ${darkMode ? "hover:bg-slate-700/20" : ""}`}>
                      
                      {/* Title Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-slate-700 text-yellow-400" : "bg-yellow-50 text-yellow-600"}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className={`font-medium ${darkMode ? "text-slate-200" : "text-slate-900"} max-w-[250px] truncate`} title={note.title}>
                            {note.title || "Untitled Note"}
                          </span>
                        </div>
                      </td>

                      {/* Author Column */}
                      <td className={`px-6 py-4 ${darkMode ? "text-slate-300" : "text-slate-700"} capitalize`}>
                        {authorName}
                      </td>

                      {/* Date Column */}
                      <td className={`px-6 py-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {new Date(note.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* VIEW Button */}
                          <button 
                            onClick={() => setSelectedNote(note)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-blue-400 hover:bg-slate-700" : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"}`}
                            title="View Note Content"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* DELETE Button */}
                          <button 
                            onClick={() => handleDeleteNote(note._id)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-700" : "text-slate-500 hover:text-red-600 hover:bg-red-50"}`}
                            title="Delete Note"
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
          {!loading && filteredNotes.length === 0 && (
            <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              No notes found.
            </div>
          )}
        </div>
      </div>

      {/* 🛑 VIEWING MODAL (Shows the actual note data) */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl shadow-xl overflow-hidden ${darkMode ? "bg-slate-800 border border-slate-700" : "bg-white"}`}>
            
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b flex justify-between items-center ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {selectedNote.title || "Untitled Note"}
                </h2>
                <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  By {selectedNote.user?.email || "Unknown"} • {new Date(selectedNote.updatedAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedNote(null)}
                className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Actual Content) */}
            <div className="p-6 overflow-y-auto flex-1">
              {selectedNote.content ? (
                <div 
                  className={`prose max-w-none text-sm whitespace-pre-wrap ${darkMode ? "text-slate-300 prose-invert" : "text-slate-700"}`}
                  dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                />
              ) : (
                <p className={`text-sm italic ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  This note is empty.
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex justify-end ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
              <button 
                onClick={() => setSelectedNote(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminNotes;