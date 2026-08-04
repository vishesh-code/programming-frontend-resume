


// import React, { useState, useEffect } from 'react';
// import { useTheme } from '../../context/themeContext';
// import { Tags, Folder, Plus, Trash2, Edit2, X, Layers } from 'lucide-react';
// import apiClient from '../../utils/apiClient'; // ⚠️ Adjust path to your apiClient instance

// const AdminTaxonomy = () => {
//   const { darkMode } = useTheme();
  
//   // Data States
//   const [categories, setCategories] = useState([]);
//   const [tags, setTags] = useState([]);
//   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
//   const [loading, setLoading] = useState(true);

//   // Modal Control States
//   const [categoryModal, setCategoryModal] = useState({ isOpen: false, isEditing: false, id: null });
//   const [tagModal, setTagModal] = useState({ isOpen: false, isEditing: false, id: null });

//   // Form Field States
//   const [categoryForm, setCategoryForm] = useState({ name: '', slug: '' });
//   const [tagForm, setTagForm] = useState({ name: '', slug: '', categoryId: '' });

//   // Helper to auto-generate clean slugs from input strings
//   const generateSlug = (text) => {
//     return text
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, '') // Remove special characters
//       .replace(/[\s_]+/g, '-')  // Replace spaces and underscores with hyphens
//       .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
//   };

//   // Sync slug transformations when names are updated
//   const handleCategoryNameChange = (e) => {
//     const nameVal = e.target.value;
//     setCategoryForm({
//       name: nameVal,
//       slug: generateSlug(nameVal)
//     });
//   };

//   const handleTagNameChange = (e) => {
//     const nameVal = e.target.value;
//     setTagForm({
//       ...tagForm,
//       name: nameVal,
//       slug: generateSlug(nameVal)
//     });
//   };

//   // 1. Initial Data Fetching
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [catRes, tagRes] = await Promise.all([
//         apiClient.get('/category'),
//         apiClient.get('/tag')
//       ]);
//       setCategories(catRes.data || []);
//       setTags(tagRes.data || []);
//     } catch (error) {
//       console.error("Failed to load taxonomy data:", error);
//       alert("Error loading structural dashboard items.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ==========================================
//   // CATEGORY OPERATIONS
//   // ==========================================
//   const openCategoryCreate = () => {
//     setCategoryForm({ name: '', slug: '' });
//     setCategoryModal({ isOpen: true, isEditing: false, id: null });
//   };

//   const openCategoryEdit = (category) => {
//     setCategoryForm({ name: category.name, slug: category.slug });
//     setCategoryModal({ isOpen: true, isEditing: true, id: category._id });
//   };

//   const handleCategorySubmit = async (e) => {
//     e.preventDefault();
//     if (!categoryForm.name || !categoryForm.slug) return alert("All fields are required.");

//     try {
//       if (categoryModal.isEditing) {
//         const { data } = await apiClient.put(`/category/${categoryModal.id}`, categoryForm);
//         setCategories(categories.map(c => c._id === categoryModal.id ? data : c));
//       } else {
//         const { data } = await apiClient.post('/category', categoryForm);
//         setCategories([...categories, data].sort((a,b) => a.name.localeCompare(b.name)));
//       }
//       setCategoryModal({ isOpen: false, isEditing: false, id: null });
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to process category update.");
//     }
//   };

//   const handleDeleteCategory = async (id, name) => {
//     if (!window.confirm(`Are you sure you want to delete the category "${name}"? This could leave dependent tags or problem records dangling.`)) return;
//     try {
//       await apiClient.delete(`/category/${id}`);
//       setCategories(categories.filter(c => c._id !== id));
//       // Re-fetch tags just in case cascade mechanics altered items
//       const tagRes = await apiClient.get('/tag');
//       setTags(tagRes.data || []);
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to delete category.");
//     }
//   };

//   // ==========================================
//   // TAG OPERATIONS
//   // ==========================================
//   const openTagCreate = () => {
//     setTagForm({ name: '', slug: '', categoryId: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : '' });
//     setTagModal({ isOpen: true, isEditing: false, id: null });
//   };

//   const openTagEdit = (tag) => {
//     setTagForm({ 
//       name: tag.name, 
//       slug: tag.slug, 
//       categoryId: tag.category?._id || tag.category 
//     });
//     setTagModal({ isOpen: true, isEditing: true, id: tag._id });
//   };

//   const handleTagSubmit = async (e) => {
//     e.preventDefault();
//     if (!tagForm.name || !tagForm.slug || !tagForm.categoryId) {
//       return alert("Name, Slug, and Category assignments are required.");
//     }

//     try {
//       if (tagModal.isEditing) {
//         const { data } = await apiClient.put(`/tag/${tagModal.id}`, tagForm);
//         // Refresh full tag dashboard list to make sure populations remain structurally sound
//         const tagRes = await apiClient.get('/tag');
//         setTags(tagRes.data || []);
//       } else {
//         await apiClient.post('/tag', tagForm);
//         const tagRes = await apiClient.get('/tag');
//         setTags(tagRes.data || []);
//       }
//       setTagModal({ isOpen: false, isEditing: false, id: null });
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to save processing tag configuration.");
//     }
//   };

//   const handleDeleteTag = async (id, name) => {
//     if (!window.confirm(`Are you sure you want to delete the tag "${name}"?`)) return;
//     try {
//       await apiClient.delete(`/tag/${id}`);
//       setTags(tags.filter(t => t._id !== id));
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to remove structural tag object.");
//     }
//   };

//   // Compute displayed elements dynamically
//   const filteredTags = selectedCategoryFilter === "all" 
//     ? tags 
//     : tags.filter(t => (t.category?._id || t.category) === selectedCategoryFilter);

//   return (
//     <div className="space-y-6 animate-fadeUp">
//       <div>
//         <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Tags & Categories</h1>
//         <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage problem categories and solution tags across data models.</p>
//       </div>

//       {loading ? (
//         <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
//           Syncing structure matrices...
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
//           {/* ==========================================
//               CATEGORIES CONTAINER
//              ========================================== */}
//           <div className={`p-6 rounded-2xl border shadow-sm flex flex-col ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center gap-2">
//                 <Folder className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
//                 <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Categories ({categories.length})</h2>
//               </div>
//               <button 
//                 onClick={openCategoryCreate}
//                 className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 transition-colors"
//                 title="Create Category"
//               >
//                 <Plus className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
//               {categories.map((cat) => (
//                 <div key={cat._id} className={`flex items-center justify-between p-3 border rounded-xl transition-all ${darkMode ? "border-slate-700 bg-slate-900/30 hover:bg-slate-900/60" : "border-slate-100 bg-slate-50 hover:bg-slate-100/80"}`}>
//                   <div className="flex flex-col">
//                     <span className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{cat.name}</span>
//                     <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>/{cat.slug}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <button 
//                       onClick={() => openCategoryEdit(cat)}
//                       className={`p-1.5 rounded-lg text-slate-400 transition-colors ${darkMode ? "hover:text-blue-400 hover:bg-slate-700" : "hover:text-blue-600 hover:bg-blue-100/50"}`}
//                     >
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                     <button 
//                       onClick={() => handleDeleteCategory(cat._id, cat.name)}
//                       className={`p-1.5 rounded-lg text-slate-400 transition-colors ${darkMode ? "hover:text-red-400 hover:bg-slate-700" : "hover:text-red-500 hover:bg-red-100/50"}`}
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               {categories.length === 0 && (
//                 <p className={`text-sm italic text-center p-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No categories populated.</p>
//               )}
//             </div>
//           </div>

//           {/* ==========================================
//               TAGS CONTAINER
//              ========================================== */}
//           <div className={`p-6 rounded-2xl border shadow-sm flex flex-col ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
//               <div className="flex items-center gap-2">
//                 <Tags className={`w-5 h-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
//                 <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Tags ({filteredTags.length})</h2>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <select 
//                   value={selectedCategoryFilter}
//                   onChange={(e) => setSelectedCategoryFilter(e.target.value)}
//                   className={`text-xs px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}
//                 >
//                   <option value="all">All Categories</option>
//                   {categories.map(c => (
//                     <option key={c._id} value={c._id}>{c.name}</option>
//                   ))}
//                 </select>

//                 <button 
//                   onClick={openTagCreate}
//                   className="p-1.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 transition-colors"
//                   title="Create Tag"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[50vh] pr-1 content-start">
//               {filteredTags.map((tag) => (
//                 <div 
//                   key={tag._id} 
//                   className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-all ${
//                     darkMode 
//                       ? "bg-slate-900/40 text-slate-300 border-slate-700 hover:border-slate-500" 
//                       : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
//                   }`}
//                 >
//                   <div className="flex flex-col">
//                     <span>{tag.name}</span>
//                     {selectedCategoryFilter === "all" && tag.category?.name && (
//                       <span className="text-[9px] opacity-40 font-normal -mt-0.5 tracking-wider uppercase">({tag.category.name})</span>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-0.5 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">
//                     <button onClick={() => openTagEdit(tag)} className="hover:text-blue-500 transition-colors">
//                       <Edit2 className="w-3 h-3" />
//                     </button>
//                     <button onClick={() => handleDeleteTag(tag._id, tag.name)} className="hover:text-red-500 transition-colors">
//                       <Trash2 className="w-3 h-3" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//               {filteredTags.length === 0 && (
//                 <p className={`text-sm italic text-center w-full p-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No tags found under this view criteria.</p>
//               )}
//             </div>
//           </div>

//         </div>
//       )}

//       {/* ==========================================
//           CATEGORY CREATION / EDITING MODAL
//          ========================================== */}
//       {categoryModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className={`w-full max-w-md rounded-2xl shadow-xl border p-6 overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}>
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold flex items-center gap-2">
//                 <Folder className="w-5 h-5 text-blue-500" />
//                 {categoryModal.isEditing ? "Edit Category Blueprint" : "Create New Category Block"}
//               </h3>
//               <button 
//                 onClick={() => setCategoryModal({ isOpen: false, isEditing: false, id: null })}
//                 className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleCategorySubmit} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">Display Name</label>
//                 <input 
//                   type="text" 
//                   value={categoryForm.name}
//                   onChange={handleCategoryNameChange}
//                   placeholder="e.g., Dynamic Programming"
//                   required
//                   className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900"}`}
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">URL System Slug</label>
//                 <input 
//                   type="text" 
//                   value={categoryForm.slug}
//                   onChange={(e) => setCategoryForm({ ...categoryForm, slug: generateSlug(e.target.value) })}
//                   placeholder="dynamic-programming"
//                   required
//                   className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-900 text-slate-500"}`}
//                 />
//               </div>

//               <div className="flex justify-end gap-2 pt-2">
//                 <button 
//                   type="button"
//                   onClick={() => setCategoryModal({ isOpen: false, isEditing: false, id: null })}
//                   className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md font-medium text-sm transition-colors"
//                 >
//                   {categoryModal.isEditing ? "Save Changes" : "Build Category"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ==========================================
//           TAG CREATION / EDITING MODAL
//          ========================================== */}
//       {tagModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//           <div className={`w-full max-w-md rounded-2xl shadow-xl border p-6 overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}>
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold flex items-center gap-2">
//                 <Tags className="w-5 h-5 text-indigo-500" />
//                 {tagModal.isEditing ? "Modify Tag Definition" : "Construct Taxonomy Tag"}
//               </h3>
//               <button 
//                 onClick={() => setTagModal({ isOpen: false, isEditing: false, id: null })}
//                 className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleTagSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">Parent Category Assignment</label>
//                 <select 
//                   value={tagForm.categoryId}
//                   onChange={(e) => setTagForm({ ...tagForm, categoryId: e.target.value })}
//                   required
//                   className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
//                 >
//                   <option value="" disabled>Select Category Allocation Context</option>
//                   {categories.map(c => (
//                     <option key={c._id} value={c._id}>{c.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">Tag Label Name</label>
//                 <input 
//                   type="text" 
//                   value={tagForm.name}
//                   onChange={handleTagNameChange}
//                   placeholder="e.g., Binary Search"
//                   required
//                   className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900"}`}
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">Tag Unique Slug</label>
//                 <input 
//                   type="text" 
//                   value={tagForm.slug}
//                   onChange={(e) => setTagForm({ ...tagForm, slug: generateSlug(e.target.value) })}
//                   placeholder="binary-search"
//                   required
//                   className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900"}`}
//                 />
//               </div>

//               <div className="flex justify-end gap-2 pt-2">
//                 <button 
//                   type="button"
//                   onClick={() => setTagModal({ isOpen: false, isEditing: false, id: null })}
//                   className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit"
//                   className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md font-medium text-sm transition-colors"
//                 >
//                   {tagModal.isEditing ? "Commit Changes" : "Inject Tag"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default AdminTaxonomy;












import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../../context/themeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tags, Folder, FolderOpen, Plus, Trash2, Edit2, X, Search,
  ChevronDown, UploadCloud, Download, CheckCircle2, AlertCircle,
  XCircle, FileText, Clipboard, ArrowLeft, Loader2
} from 'lucide-react';
import apiClient from '../../utils/apiClient'; // ⚠️ Adjust path to your apiClient instance

// ==========================================
// HELPERS
// ==========================================
const slugify = (text = '') =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Parses "Category, Tag" pairs from pasted text or a CSV file.
// Accepts an optional header row (Category/Tag, category/tag, etc.) and skips blank lines.
const parseBulkInput = (raw) => {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const rows = lines.map((line) => {
    // Handle simple quoted CSV cells as well as plain comma-separated values
    const parts = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    const [rawCategory = '', rawTag = ''] = parts.map((p) => p.trim().replace(/^"|"$/g, ''));
    return { categoryName: rawCategory, tagName: rawTag };
  });

  const first = rows[0];
  const looksLikeHeader =
    /^categor/i.test(first.categoryName) && /^tag/i.test(first.tagName);

  return looksLikeHeader ? rows.slice(1) : rows;
};

const SAMPLE_CSV = `Category,Tag\nArrays,Two Pointers\nArrays,Sliding Window\nGraphs,DFS\nGraphs,BFS\n`;

// ==========================================
// TOAST SYSTEM
// ==========================================
let toastId = 0;

const useToasts = () => {
  const [toasts, setToasts] = useState([]);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const push = (message, type = 'success') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => dismiss(id), 3800);
  };

  return { toasts, push, dismiss };
};

const ToastStack = ({ toasts, dismiss, darkMode }) => (
  <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.2 }}
          onClick={() => dismiss(t.id)}
          className={`flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-lg border cursor-pointer ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          {t.type === 'success' && <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />}
          {t.type === 'error' && <XCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />}
          {t.type === 'info' && <AlertCircle className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />}
          <span className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{t.message}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// ==========================================
// MAIN COMPONENT
// ==========================================
const AdminTaxonomy = () => {
  const { darkMode } = useTheme();
  const { toasts, push, dismiss } = useToasts();

  // Data
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // View state
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Modals
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, isEditing: false, id: null });
  const [tagModal, setTagModal] = useState({ isOpen: false, isEditing: false, id: null });
  const [bulkModal, setBulkModal] = useState({ isOpen: false });
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'category'|'tag', id, name }

  // Forms
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '' });
  const [tagForm, setTagForm] = useState({ name: '', slug: '', categoryId: '' });

  // ------------------------------------------
  // Fetch
  // ------------------------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, tagRes] = await Promise.all([
        apiClient.get('/category'),
        apiClient.get('/tag'),
      ]);
      setCategories(catRes.data || []);
      setTags(tagRes.data || []);
    } catch (error) {
      push('Could not load categories and tags. Try refreshing the page.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Expand every category by default once data first loads
  useEffect(() => {
    if (categories.length > 0 && expandedIds.size === 0) {
      setExpandedIds(new Set(categories.map((c) => c._id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const refreshTags = async () => {
    const tagRes = await apiClient.get('/tag');
    setTags(tagRes.data || []);
  };

  // ------------------------------------------
  // Derived data: group tags under their category + apply search
  // ------------------------------------------
  const grouped = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const tagsByCategory = new Map();
    tags.forEach((tag) => {
      const catId = tag.category?._id || tag.category;
      if (!tagsByCategory.has(catId)) tagsByCategory.set(catId, []);
      tagsByCategory.get(catId).push(tag);
    });

    return categories
      .map((cat) => {
        const catTags = (tagsByCategory.get(cat._id) || []).slice().sort((a, b) => a.name.localeCompare(b.name));
        const categoryMatches = !q || cat.name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q);
        const matchingTags = q ? catTags.filter((t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)) : catTags;

        return {
          ...cat,
          allTags: catTags,
          visibleTags: categoryMatches && !q ? catTags : matchingTags,
          isVisible: !q || categoryMatches || matchingTags.length > 0,
        };
      })
      .filter((c) => c.isVisible)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, tags, searchQuery]);

  const stats = useMemo(
    () => ({ categoryCount: categories.length, tagCount: tags.length }),
    [categories, tags]
  );

  // Auto-expand categories that have a search match
  useEffect(() => {
    if (!searchQuery.trim()) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      grouped.forEach((c) => next.add(c._id));
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ------------------------------------------
  // CATEGORY operations
  // ------------------------------------------
  const openCategoryCreate = () => {
    setCategoryForm({ name: '', slug: '' });
    setCategoryModal({ isOpen: true, isEditing: false, id: null });
  };

  const openCategoryEdit = (category) => {
    setCategoryForm({ name: category.name, slug: category.slug });
    setCategoryModal({ isOpen: true, isEditing: true, id: category._id });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.slug) return push('Name and slug are required.', 'error');

    try {
      if (categoryModal.isEditing) {
        const { data } = await apiClient.put(`/category/${categoryModal.id}`, categoryForm);
        setCategories((prev) => prev.map((c) => (c._id === categoryModal.id ? data : c)));
        push(`"${data.name}" updated.`);
      } else {
        const { data } = await apiClient.post('/category', categoryForm);
        setCategories((prev) => [...prev, data]);
        setExpandedIds((prev) => new Set(prev).add(data._id));
        push(`"${data.name}" created.`);
      }
      setCategoryModal({ isOpen: false, isEditing: false, id: null });
    } catch (error) {
      push(error.response?.data?.message || 'Failed to save category.', 'error');
    }
  };

  const confirmDeleteCategory = (category) =>
    setDeleteConfirm({ type: 'category', id: category._id, name: category.name });

  const confirmDeleteTag = (tag) =>
    setDeleteConfirm({ type: 'tag', id: tag._id, name: tag.name });

  const handleConfirmedDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id, name } = deleteConfirm;
    try {
      if (type === 'category') {
        await apiClient.delete(`/category/${id}`);
        setCategories((prev) => prev.filter((c) => c._id !== id));
        await refreshTags(); // orphaned tags may have been cascade-deleted server-side
        push(`Category "${name}" deleted.`);
      } else {
        await apiClient.delete(`/tag/${id}`);
        setTags((prev) => prev.filter((t) => t._id !== id));
        push(`Tag "${name}" deleted.`);
      }
    } catch (error) {
      push(error.response?.data?.message || `Failed to delete ${type}.`, 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // ------------------------------------------
  // TAG operations
  // ------------------------------------------
  const openTagCreate = (categoryId = '') => {
    setTagForm({ name: '', slug: '', categoryId });
    setTagModal({ isOpen: true, isEditing: false, id: null });
  };

  const openTagEdit = (tag) => {
    setTagForm({ name: tag.name, slug: tag.slug, categoryId: tag.category?._id || tag.category });
    setTagModal({ isOpen: true, isEditing: true, id: tag._id });
  };

  const handleTagSubmit = async (e) => {
    e.preventDefault();
    if (!tagForm.name || !tagForm.slug || !tagForm.categoryId) {
      return push('Name, slug, and a parent category are all required.', 'error');
    }

    try {
      if (tagModal.isEditing) {
        await apiClient.put(`/tag/${tagModal.id}`, tagForm);
        push(`"${tagForm.name}" updated.`);
      } else {
        await apiClient.post('/tag', tagForm);
        push(`"${tagForm.name}" added.`);
      }
      await refreshTags();
      setTagModal({ isOpen: false, isEditing: false, id: null });
    } catch (error) {
      push(error.response?.data?.message || 'Failed to save tag.', 'error');
    }
  };

  // ------------------------------------------
  // BULK UPLOAD
  // ------------------------------------------
  const handleBulkSubmit = async (rows) => {
    const { data } = await apiClient.post('/tag/bulk', { rows });
    await fetchData();
    return data; // { created, skipped, errors }
  };

  const downloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tags-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ------------------------------------------
  // Shared style tokens
  // ------------------------------------------
  const card = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const inputCls = `w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
    darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'
  }`;
  const label = 'block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider';

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Taxonomy</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage problem categories and the tags nested inside each one.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBulkModal({ isOpen: true })}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
              darkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={openCategoryCreate}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>
      </div>

      {/* ============ SEARCH + STATS ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories or tags…"
            className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-white border-slate-200 text-slate-900'
            }`}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
          <span className={`px-3 py-1.5 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            {stats.categoryCount} {stats.categoryCount === 1 ? 'category' : 'categories'}
          </span>
          <span className={`px-3 py-1.5 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
            {stats.tagCount} {stats.tagCount === 1 ? 'tag' : 'tags'}
          </span>
        </div>
      </div>

      {/* ============ LIST ============ */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-16 rounded-2xl border animate-pulse ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-100 border-slate-200'}`} />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <EmptyState
          darkMode={darkMode}
          hasQuery={!!searchQuery.trim()}
          onClear={() => setSearchQuery('')}
          onCreate={openCategoryCreate}
        />
      ) : (
        <div className="space-y-3">
          {grouped.map((cat) => (
            <CategoryRow
              key={cat._id}
              category={cat}
              expanded={expandedIds.has(cat._id)}
              onToggle={() => toggleExpanded(cat._id)}
              onEditCategory={() => openCategoryEdit(cat)}
              onDeleteCategory={() => confirmDeleteCategory(cat)}
              onAddTag={() => openTagCreate(cat._id)}
              onEditTag={openTagEdit}
              onDeleteTag={confirmDeleteTag}
              darkMode={darkMode}
              card={card}
              highlightQuery={searchQuery.trim()}
            />
          ))}
        </div>
      )}

      {/* ============ CATEGORY MODAL ============ */}
      <AnimatePresence>
        {categoryModal.isOpen && (
          <ModalShell darkMode={darkMode} onClose={() => setCategoryModal({ isOpen: false, isEditing: false, id: null })}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-500" />
                {categoryModal.isEditing ? 'Edit Category' : 'New Category'}
              </h3>
              <button
                onClick={() => setCategoryModal({ isOpen: false, isEditing: false, id: null })}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className={label}>Display Name</label>
                <input
                  type="text"
                  autoFocus
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ name: e.target.value, slug: slugify(e.target.value) })}
                  placeholder="e.g., Dynamic Programming"
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={label}>URL Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: slugify(e.target.value) })}
                  placeholder="dynamic-programming"
                  required
                  className={inputCls}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryModal({ isOpen: false, isEditing: false, id: null })}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-medium text-sm transition-colors">
                  {categoryModal.isEditing ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ============ TAG MODAL ============ */}
      <AnimatePresence>
        {tagModal.isOpen && (
          <ModalShell darkMode={darkMode} onClose={() => setTagModal({ isOpen: false, isEditing: false, id: null })}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Tags className="w-5 h-5 text-indigo-500" />
                {tagModal.isEditing ? 'Edit Tag' : 'New Tag'}
              </h3>
              <button
                onClick={() => setTagModal({ isOpen: false, isEditing: false, id: null })}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTagSubmit} className="space-y-4">
              <div>
                <label className={label}>Category</label>
                <select
                  value={tagForm.categoryId}
                  onChange={(e) => setTagForm({ ...tagForm, categoryId: e.target.value })}
                  required
                  className={inputCls.replace('focus:ring-blue-500', 'focus:ring-indigo-500')}
                >
                  <option value="" disabled>Choose a category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Tag Name</label>
                <input
                  type="text"
                  autoFocus
                  value={tagForm.name}
                  onChange={(e) => setTagForm({ ...tagForm, name: e.target.value, slug: slugify(e.target.value) })}
                  placeholder="e.g., Binary Search"
                  required
                  className={inputCls.replace('focus:ring-blue-500', 'focus:ring-indigo-500')}
                />
              </div>
              <div>
                <label className={label}>Slug</label>
                <input
                  type="text"
                  value={tagForm.slug}
                  onChange={(e) => setTagForm({ ...tagForm, slug: slugify(e.target.value) })}
                  placeholder="binary-search"
                  required
                  className={inputCls.replace('focus:ring-blue-500', 'focus:ring-indigo-500')}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTagModal({ isOpen: false, isEditing: false, id: null })}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm font-medium text-sm transition-colors">
                  {tagModal.isEditing ? 'Save Changes' : 'Add Tag'}
                </button>
              </div>
            </form>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ============ BULK UPLOAD MODAL ============ */}
      <AnimatePresence>
        {bulkModal.isOpen && (
          <BulkUploadModal
            darkMode={darkMode}
            categories={categories}
            onClose={() => setBulkModal({ isOpen: false })}
            onSubmit={handleBulkSubmit}
            onDownloadSample={downloadSampleCsv}
            push={push}
          />
        )}
      </AnimatePresence>

      {/* ============ DELETE CONFIRM ============ */}
      <AnimatePresence>
        {deleteConfirm && (
          <ModalShell darkMode={darkMode} onClose={() => setDeleteConfirm(null)} maxWidth="max-w-sm">
            <div className="text-center">
              <div className={`mx-auto w-11 h-11 rounded-full flex items-center justify-center mb-3 ${darkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-base font-bold mb-1">Delete {deleteConfirm.type === 'category' ? 'category' : 'tag'}?</h3>
              <p className={`text-sm mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {deleteConfirm.type === 'category'
                  ? `"${deleteConfirm.name}" and any tags nested inside it will be removed. This can't be undone.`
                  : `"${deleteConfirm.name}" will be permanently removed.`}
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmedDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm font-medium text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      <ToastStack toasts={toasts} dismiss={dismiss} darkMode={darkMode} />
    </div>
  );
};

// ==========================================
// CATEGORY ROW (accordion)
// ==========================================
const CategoryRow = ({
  category, expanded, onToggle, onEditCategory, onDeleteCategory,
  onAddTag, onEditTag, onDeleteTag, darkMode, card, highlightQuery,
}) => {
  const highlight = (text) => {
    if (!highlightQuery) return text;
    const idx = text.toLowerCase().indexOf(highlightQuery.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-amber-300/60 text-inherit rounded-sm">{text.slice(idx, idx + highlightQuery.length)}</mark>
        {text.slice(idx + highlightQuery.length)}
      </>
    );
  };

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${card}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors ${
          darkMode ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <motion.div animate={{ rotate: expanded ? 0 : -90 }} transition={{ duration: 0.15 }}>
            <ChevronDown className={`w-4 h-4 shrink-0 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
          </motion.div>
          {expanded
            ? <FolderOpen className={`w-5 h-5 shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            : <Folder className={`w-5 h-5 shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
          <div className="min-w-0">
            <div className={`text-sm font-semibold truncate ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
              {highlight(category.name)}
            </div>
            <div className={`text-xs truncate ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>/{category.slug}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${darkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
            {category.allTags.length}
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onEditCategory(); }}
            onKeyDown={(e) => e.key === 'Enter' && onEditCategory()}
            className={`p-1.5 rounded-lg text-slate-400 transition-colors ${darkMode ? 'hover:text-blue-400 hover:bg-slate-700' : 'hover:text-blue-600 hover:bg-blue-100/50'}`}
          >
            <Edit2 className="w-4 h-4" />
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onDeleteCategory(); }}
            onKeyDown={(e) => e.key === 'Enter' && onDeleteCategory()}
            className={`p-1.5 rounded-lg text-slate-400 transition-colors ${darkMode ? 'hover:text-red-400 hover:bg-slate-700' : 'hover:text-red-500 hover:bg-red-100/50'}`}
          >
            <Trash2 className="w-4 h-4" />
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-5 pt-1 flex flex-wrap gap-2 border-t ${darkMode ? 'border-slate-700/60' : 'border-slate-100'}`}>
              {category.visibleTags.map((tag) => (
                <div
                  key={tag._id}
                  className={`group flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-all ${
                    darkMode ? 'bg-slate-900/40 text-slate-300 border-slate-700 hover:border-slate-500' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{highlight(tag.name)}</span>
                  <span className="flex items-center gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEditTag(tag)} className="hover:text-blue-500 transition-colors p-0.5">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={() => onDeleteTag(tag)} className="hover:text-red-500 transition-colors p-0.5">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              ))}

              <button
                onClick={onAddTag}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed transition-colors ${
                  darkMode ? 'border-slate-600 text-slate-400 hover:text-indigo-400 hover:border-indigo-500' : 'border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-400'
                }`}
              >
                <Plus className="w-3 h-3" /> Add tag
              </button>

              {category.allTags.length === 0 && (
                <p className={`text-xs italic ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>No tags yet — add the first one.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// EMPTY STATE
// ==========================================
const EmptyState = ({ darkMode, hasQuery, onClear, onCreate }) => (
  <div className={`rounded-2xl border border-dashed p-12 text-center ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
      <Folder className={`w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
    </div>
    {hasQuery ? (
      <>
        <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Nothing matches your search.</p>
        <button onClick={onClear} className="text-sm font-semibold text-blue-500 hover:text-blue-600">Clear search</button>
      </>
    ) : (
      <>
        <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>No categories yet.</p>
        <button onClick={onCreate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
          Create your first category
        </button>
      </>
    )}
  </div>
);

// ==========================================
// MODAL SHELL
// ==========================================
const ModalShell = ({ children, darkMode, onClose, maxWidth = 'max-w-md' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.15 }}
      onClick={(e) => e.stopPropagation()}
      className={`w-full ${maxWidth} rounded-2xl shadow-xl border p-6 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
    >
      {children}
    </motion.div>
  </motion.div>
);

// ==========================================
// BULK UPLOAD MODAL
// ==========================================
const BulkUploadModal = ({ darkMode, categories, onClose, onSubmit, onDownloadSample, push }) => {
  const [step, setStep] = useState('input'); // 'input' | 'preview' | 'results'
  const [text, setText] = useState('');
  const [rows, setRows] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const knownCategoryNames = useMemo(
    () => new Set(categories.map((c) => c.name.toLowerCase())),
    [categories]
  );

  const preview = useMemo(() => {
    const seen = new Set();
    return rows.map((row) => {
      const key = `${row.categoryName.toLowerCase()}::${row.tagName.toLowerCase()}`;
      const isDupeInFile = seen.has(key);
      seen.add(key);

      let status = 'ok';
      let note = knownCategoryNames.has(row.categoryName.toLowerCase()) ? 'Existing category' : 'New category — will be created';
      if (!row.categoryName || !row.tagName) {
        status = 'invalid';
        note = 'Missing category or tag name';
      } else if (isDupeInFile) {
        status = 'duplicate';
        note = 'Duplicate row in this file';
      }
      return { ...row, status, note };
    });
  }, [rows, knownCategoryNames]);

  const validCount = preview.filter((r) => r.status === 'ok').length;

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setText(content);
      setRows(parseBulkInput(content));
      setStep('preview');
    };
    reader.readAsText(file);
  };

  const handleParseText = () => {
    const parsed = parseBulkInput(text);
    if (parsed.length === 0) {
      push('Paste at least one "Category, Tag" line first.', 'error');
      return;
    }
    setRows(parsed);
    setStep('preview');
  };

  const handleImport = async () => {
    const toSend = preview.filter((r) => r.status === 'ok').map(({ categoryName, tagName }) => ({ categoryName, tagName }));
    if (toSend.length === 0) return;
    setSubmitting(true);
    try {
      const data = await onSubmit(toSend);
      setResults(data);
      setStep('results');
    } catch (error) {
      push(error.response?.data?.message || 'Bulk import failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep('input');
    setText('');
    setRows([]);
    setResults(null);
  };

  return (
    <ModalShell darkMode={darkMode} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {step === 'preview' && (
            <button onClick={() => setStep('input')} className="mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <UploadCloud className="w-5 h-5 text-blue-500" />
          Bulk Upload Tags
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* STEP 1: input */}
      {step === 'input' && (
        <div className="space-y-4">
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Paste rows as <code className="px-1 rounded bg-slate-500/10">Category, Tag</code> — one per line — or upload a CSV
            with the same two columns. Categories that don't exist yet are created automatically.
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder={'Arrays, Two Pointers\nArrays, Sliding Window\nGraphs, DFS'}
            className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-all ${
              darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleParseText}
              disabled={!text.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-sm text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <Clipboard className="w-4 h-4" /> Preview pasted rows
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center gap-1.5 ${
                darkMode ? 'border-slate-700 text-slate-200 hover:bg-slate-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4" /> Upload CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv,text/plain"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <button
              onClick={onDownloadSample}
              className={`ml-auto px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5" /> Sample CSV
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: preview */}
      {step === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{preview.length} rows parsed</span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-500">{validCount} ready</span>
              {preview.some((r) => r.status === 'duplicate') && (
                <span className="text-amber-500">{preview.filter((r) => r.status === 'duplicate').length} duplicate</span>
              )}
              {preview.some((r) => r.status === 'invalid') && (
                <span className="text-red-500">{preview.filter((r) => r.status === 'invalid').length} invalid</span>
              )}
            </div>
          </div>

          <div className={`rounded-xl border max-h-72 overflow-y-auto ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <table className="w-full text-sm">
              <thead className={`sticky top-0 text-xs uppercase tracking-wider ${darkMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                <tr>
                  <th className="text-left px-3 py-2 font-semibold">Category</th>
                  <th className="text-left px-3 py-2 font-semibold">Tag</th>
                  <th className="text-left px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className={`border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <td className="px-3 py-2">{row.categoryName || <span className="italic opacity-50">missing</span>}</td>
                    <td className="px-3 py-2">{row.tagName || <span className="italic opacity-50">missing</span>}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          row.status === 'ok' ? 'text-emerald-500' : row.status === 'duplicate' ? 'text-amber-500' : 'text-red-500'
                        }`}
                      >
                        {row.status === 'ok' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {row.status === 'duplicate' && <AlertCircle className="w-3.5 h-3.5" />}
                        {row.status === 'invalid' && <XCircle className="w-3.5 h-3.5" />}
                        {row.note}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={reset}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            >
              Start over
            </button>
            <button
              onClick={handleImport}
              disabled={validCount === 0 || submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-sm font-medium text-sm transition-colors flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Import {validCount} {validCount === 1 ? 'tag' : 'tags'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: results */}
      {step === 'results' && results && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className={`rounded-xl p-3 text-center ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
              <div className="text-xl font-bold text-emerald-500">{results.created?.length || 0}</div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Created</div>
            </div>
            <div className={`rounded-xl p-3 text-center ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
              <div className="text-xl font-bold text-amber-500">{results.skipped?.length || 0}</div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Skipped (duplicates)</div>
            </div>
            <div className={`rounded-xl p-3 text-center ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
              <div className="text-xl font-bold text-red-500">{results.errors?.length || 0}</div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Errors</div>
            </div>
          </div>

          {(results.errors?.length > 0 || results.skipped?.length > 0) && (
            <div className={`rounded-xl border max-h-48 overflow-y-auto text-sm divide-y ${darkMode ? 'border-slate-700 divide-slate-800' : 'border-slate-200 divide-slate-100'}`}>
              {results.errors?.map((e, i) => (
                <div key={`e${i}`} className="px-3 py-2 flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Row {e.row}: {e.tagName || '—'} — {e.reason}</span>
                </div>
              ))}
              {results.skipped?.map((s, i) => (
                <div key={`s${i}`} className="px-3 py-2 flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Row {s.row}: {s.tagName} — {s.reason}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={reset}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'}`}
            >
              Upload more
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-medium text-sm transition-colors">
              Done
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default AdminTaxonomy;