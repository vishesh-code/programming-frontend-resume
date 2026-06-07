// import React from 'react';
// import { useTheme } from '../../context/themeContext';
// import { Tags, Folder, Plus, Trash2 } from 'lucide-react';

// const AdminTaxonomy = () => {
//   const { darkMode } = useTheme();

//   return (
//     <div className="space-y-6 animate-fadeUp">
//       <div>
//         <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Tags & Categories</h1>
//         <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage problem categories and solution tags.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
//         {/* Categories Box */}
//         <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2">
//               <Folder className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
//               <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Categories</h2>
//             </div>
//             <button className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 transition-colors"><Plus className="w-4 h-4" /></button>
//           </div>
//           <div className="space-y-3">
//             {['Arrays', 'Dynamic Programming', 'Graphs', 'Trees'].map((cat, i) => (
//               <div key={i} className={`flex items-center justify-between p-3 border rounded-xl ${darkMode ? "border-slate-700 bg-slate-900/50" : "border-slate-100 bg-slate-50"}`}>
//                 <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{cat}</span>
//                 <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tags Box */}
//         <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-2">
//               <Tags className={`w-5 h-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
//               <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Tags</h2>
//             </div>
//             <button className="p-1.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 transition-colors"><Plus className="w-4 h-4" /></button>
//           </div>
//           <div className="flex flex-wrap gap-2">
//              {['Binary Search', 'Two Pointers', 'Sliding Window', 'DFS', 'BFS', 'Greedy', 'Backtracking'].map((tag, i) => (
//                 <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${darkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-white text-slate-600 border-slate-200"}`}>
//                   {tag}
//                   <button className="hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
//                 </div>
//              ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };
// export default AdminTaxonomy;



import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/themeContext';
import { Tags, Folder, Plus, Trash2, Edit2, X, Layers } from 'lucide-react';
import apiClient from '../../utils/apiClient'; // ⚠️ Adjust path to your apiClient instance

const AdminTaxonomy = () => {
  const { darkMode } = useTheme();
  
  // Data States
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal Control States
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, isEditing: false, id: null });
  const [tagModal, setTagModal] = useState({ isOpen: false, isEditing: false, id: null });

  // Form Field States
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '' });
  const [tagForm, setTagForm] = useState({ name: '', slug: '', categoryId: '' });

  // Helper to auto-generate clean slugs from input strings
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_]+/g, '-')  // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
  };

  // Sync slug transformations when names are updated
  const handleCategoryNameChange = (e) => {
    const nameVal = e.target.value;
    setCategoryForm({
      name: nameVal,
      slug: generateSlug(nameVal)
    });
  };

  const handleTagNameChange = (e) => {
    const nameVal = e.target.value;
    setTagForm({
      ...tagForm,
      name: nameVal,
      slug: generateSlug(nameVal)
    });
  };

  // 1. Initial Data Fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, tagRes] = await Promise.all([
        apiClient.get('/category'),
        apiClient.get('/tag')
      ]);
      setCategories(catRes.data || []);
      setTags(tagRes.data || []);
    } catch (error) {
      console.error("Failed to load taxonomy data:", error);
      alert("Error loading structural dashboard items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // CATEGORY OPERATIONS
  // ==========================================
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
    if (!categoryForm.name || !categoryForm.slug) return alert("All fields are required.");

    try {
      if (categoryModal.isEditing) {
        const { data } = await apiClient.put(`/category/${categoryModal.id}`, categoryForm);
        setCategories(categories.map(c => c._id === categoryModal.id ? data : c));
      } else {
        const { data } = await apiClient.post('/category', categoryForm);
        setCategories([...categories, data].sort((a,b) => a.name.localeCompare(b.name)));
      }
      setCategoryModal({ isOpen: false, isEditing: false, id: null });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to process category update.");
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"? This could leave dependent tags or problem records dangling.`)) return;
    try {
      await apiClient.delete(`/category/${id}`);
      setCategories(categories.filter(c => c._id !== id));
      // Re-fetch tags just in case cascade mechanics altered items
      const tagRes = await apiClient.get('/tag');
      setTags(tagRes.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete category.");
    }
  };

  // ==========================================
  // TAG OPERATIONS
  // ==========================================
  const openTagCreate = () => {
    setTagForm({ name: '', slug: '', categoryId: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : '' });
    setTagModal({ isOpen: true, isEditing: false, id: null });
  };

  const openTagEdit = (tag) => {
    setTagForm({ 
      name: tag.name, 
      slug: tag.slug, 
      categoryId: tag.category?._id || tag.category 
    });
    setTagModal({ isOpen: true, isEditing: true, id: tag._id });
  };

  const handleTagSubmit = async (e) => {
    e.preventDefault();
    if (!tagForm.name || !tagForm.slug || !tagForm.categoryId) {
      return alert("Name, Slug, and Category assignments are required.");
    }

    try {
      if (tagModal.isEditing) {
        const { data } = await apiClient.put(`/tag/${tagModal.id}`, tagForm);
        // Refresh full tag dashboard list to make sure populations remain structurally sound
        const tagRes = await apiClient.get('/tag');
        setTags(tagRes.data || []);
      } else {
        await apiClient.post('/tag', tagForm);
        const tagRes = await apiClient.get('/tag');
        setTags(tagRes.data || []);
      }
      setTagModal({ isOpen: false, isEditing: false, id: null });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save processing tag configuration.");
    }
  };

  const handleDeleteTag = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the tag "${name}"?`)) return;
    try {
      await apiClient.delete(`/tag/${id}`);
      setTags(tags.filter(t => t._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove structural tag object.");
    }
  };

  // Compute displayed elements dynamically
  const filteredTags = selectedCategoryFilter === "all" 
    ? tags 
    : tags.filter(t => (t.category?._id || t.category) === selectedCategoryFilter);

  return (
    <div className="space-y-6 animate-fadeUp">
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Tags & Categories</h1>
        <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage problem categories and solution tags across data models.</p>
      </div>

      {loading ? (
        <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Syncing structure matrices...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* ==========================================
              CATEGORIES CONTAINER
             ========================================== */}
          <div className={`p-6 rounded-2xl border shadow-sm flex flex-col ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Folder className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Categories ({categories.length})</h2>
              </div>
              <button 
                onClick={openCategoryCreate}
                className="p-1.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-200 transition-colors"
                title="Create Category"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
              {categories.map((cat) => (
                <div key={cat._id} className={`flex items-center justify-between p-3 border rounded-xl transition-all ${darkMode ? "border-slate-700 bg-slate-900/30 hover:bg-slate-900/60" : "border-slate-100 bg-slate-50 hover:bg-slate-100/80"}`}>
                  <div className="flex flex-col">
                    <span className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{cat.name}</span>
                    <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>/{cat.slug}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => openCategoryEdit(cat)}
                      className={`p-1.5 rounded-lg text-slate-400 transition-colors ${darkMode ? "hover:text-blue-400 hover:bg-slate-700" : "hover:text-blue-600 hover:bg-blue-100/50"}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(cat._id, cat.name)}
                      className={`p-1.5 rounded-lg text-slate-400 transition-colors ${darkMode ? "hover:text-red-400 hover:bg-slate-700" : "hover:text-red-500 hover:bg-red-100/50"}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p className={`text-sm italic text-center p-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No categories populated.</p>
              )}
            </div>
          </div>

          {/* ==========================================
              TAGS CONTAINER
             ========================================== */}
          <div className={`p-6 rounded-2xl border shadow-sm flex flex-col ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Tags className={`w-5 h-5 ${darkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Tags ({filteredTags.length})</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className={`text-xs px-2.5 py-1.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>

                <button 
                  onClick={openTagCreate}
                  className="p-1.5 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 transition-colors"
                  title="Create Tag"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-[50vh] pr-1 content-start">
              {filteredTags.map((tag) => (
                <div 
                  key={tag._id} 
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-all ${
                    darkMode 
                      ? "bg-slate-900/40 text-slate-300 border-slate-700 hover:border-slate-500" 
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{tag.name}</span>
                    {selectedCategoryFilter === "all" && tag.category?.name && (
                      <span className="text-[9px] opacity-40 font-normal -mt-0.5 tracking-wider uppercase">({tag.category.name})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openTagEdit(tag)} className="hover:text-blue-500 transition-colors">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDeleteTag(tag._id, tag.name)} className="hover:text-red-500 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredTags.length === 0 && (
                <p className={`text-sm italic text-center w-full p-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No tags found under this view criteria.</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ==========================================
          CATEGORY CREATION / EDITING MODAL
         ========================================== */}
      {categoryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-xl border p-6 overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-500" />
                {categoryModal.isEditing ? "Edit Category Blueprint" : "Create New Category Block"}
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
                <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">Display Name</label>
                <input 
                  type="text" 
                  value={categoryForm.name}
                  onChange={handleCategoryNameChange}
                  placeholder="e.g., Dynamic Programming"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">URL System Slug</label>
                <input 
                  type="text" 
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: generateSlug(e.target.value) })}
                  placeholder="dynamic-programming"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-900 text-slate-500"}`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setCategoryModal({ isOpen: false, isEditing: false, id: null })}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md font-medium text-sm transition-colors"
                >
                  {categoryModal.isEditing ? "Save Changes" : "Build Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          TAG CREATION / EDITING MODAL
         ========================================== */}
      {tagModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-xl border p-6 overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Tags className="w-5 h-5 text-indigo-500" />
                {tagModal.isEditing ? "Modify Tag Definition" : "Construct Taxonomy Tag"}
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
                <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">Parent Category Assignment</label>
                <select 
                  value={tagForm.categoryId}
                  onChange={(e) => setTagForm({ ...tagForm, categoryId: e.target.value })}
                  required
                  className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                >
                  <option value="" disabled>Select Category Allocation Context</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">Tag Label Name</label>
                <input 
                  type="text" 
                  value={tagForm.name}
                  onChange={handleTagNameChange}
                  placeholder="e.g., Binary Search"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider">Tag Unique Slug</label>
                <input 
                  type="text" 
                  value={tagForm.slug}
                  onChange={(e) => setTagForm({ ...tagForm, slug: generateSlug(e.target.value) })}
                  placeholder="binary-search"
                  required
                  className={`w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setTagModal({ isOpen: false, isEditing: false, id: null })}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md font-medium text-sm transition-colors"
                >
                  {tagModal.isEditing ? "Commit Changes" : "Inject Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTaxonomy;