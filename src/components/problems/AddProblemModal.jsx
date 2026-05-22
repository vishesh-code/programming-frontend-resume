
import React, { useState, useEffect, useRef } from "react";
import { X, Save, Loader2, Plus, Search } from "lucide-react";
import { useTheme } from "../../context/themeContext";
import apiClient from "../../utils/apiClient";

const AddProblemModal = ({ onAdd }) => {
  const { darkMode } = useTheme();
  const [open, setOpen] = useState(false);

  // Data from API
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Form State
  const [form, setForm] = useState({
    question: "",
    description: "",
    solution: "",
    difficulty: "Medium",
    category: "",
    tags: [], // Will store an array of Tag IDs
    time_complexity: "",
    space_complexity: "",
  });

  // Tag Search Autocomplete State
  const [tagSearch, setTagSearch] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Categories & Tags when the modal is opened
  useEffect(() => {
    if (open) {
      const fetchDropdownData = async () => {
        try {
          const [catRes, tagRes] = await Promise.all([
            apiClient.get('/category'),
            apiClient.get('/tag') 
          ]);
          setCategories(catRes.data);
          setAvailableTags(tagRes.data);
        } catch (err) {
          console.error("Failed to fetch categories/tags:", err);
        }
      };
      fetchDropdownData();
    }
  }, [open]);

  // Click outside listener to close the dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tagInputRef.current && !tagInputRef.current.contains(e.target)) {
        setShowTagDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- TAG SELECTION LOGIC ---
  const addTag = (tagId) => {
    if (!form.tags.includes(tagId)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagId] }));
    }
    setTagSearch(""); // Clear search
    setShowTagDropdown(false); // Close dropdown
  };

  const removeTag = (tagId) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter(id => id !== tagId) }));
  };

  const filteredTags = availableTags.filter(
    tag => !form.tags.includes(tag._id) && tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.question.trim() || !form.category) {
      setError("Question and Category are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onAdd(form);
      setOpen(false);
      // Reset form on success
      setForm({
        question: "", description: "", solution: "", difficulty: "Medium",
        category: "", tags: [], time_complexity: "", space_complexity: "",
      });
      setTagSearch("");
    } catch (err) {
      setError(err.message || "Failed to add problem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all font-medium text-sm"
      >
        <Plus className="w-4 h-4" /> Add Problem
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-2xl shadow-xl animate-fadeUp my-8 ${darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Add New Problem</h2>
              <button onClick={() => setOpen(false)} className={`p-2 rounded-xl transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div className="space-y-1">
                <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Question Title *</label>
                <input required type="text" name="question" value={form.question} onChange={handleChange} placeholder="e.g., Two Sum" className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Category *</label>
                  <select required name="category" value={form.category} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SEARCHABLE AUTOCOMPLETE TAGS SELECTOR */}
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Tags</label>
                
                {/* Selected Tags Display */}
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map(tagId => {
                      const tagObj = availableTags.find(t => t._id === tagId);
                      if (!tagObj) return null;
                      return (
                        <div key={tagObj._id} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${darkMode ? "bg-blue-900/30 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                          <span>{tagObj.name}</span>
                          <button type="button" onClick={() => removeTag(tagObj._id)} className="hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Autocomplete Input Container */}
                <div className="relative" ref={tagInputRef}>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
                    <input
                      type="text"
                      value={tagSearch}
                      onChange={(e) => {
                        setTagSearch(e.target.value);
                        setShowTagDropdown(true);
                      }}
                      onFocus={() => setShowTagDropdown(true)}
                      placeholder="Search to add tags..."
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {showTagDropdown && filteredTags.length > 0 && (
                    <div className={`absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-xl border shadow-lg ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                      {filteredTags.map((tag) => (
                        <button
                          key={tag._id}
                          type="button"
                          // Use onMouseDown instead of onClick so it fires before the input loses focus (onBlur)
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevents input from losing focus
                            addTag(tag._id);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${darkMode ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {showTagDropdown && tagSearch && filteredTags.length === 0 && (
                    <div className={`absolute z-10 w-full mt-1 px-4 py-3 text-sm rounded-xl border shadow-lg ${darkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
                      No matching tags found.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="3" className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`} />
              </div>

              <div className="space-y-1">
                <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Solution Code</label>
                <textarea name="solution" value={form.solution} onChange={handleChange} rows="4" className={`w-full px-4 py-2.5 rounded-xl border font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* TIME COMPLEXITY DROPDOWN */}
                <div className="space-y-1">
                  <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Time Complexity</label>
                  <select name="time_complexity" value={form.time_complexity} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}>
                    <option value="">Select Time Complexity</option>
                    <option value="O(1)">O(1) - Constant</option>
                    <option value="O(log N)">O(log N) - Logarithmic</option>
                    <option value="O(N)">O(N) - Linear</option>
                    <option value="O(N log N)">O(N log N) - Linearithmic</option>
                    <option value="O(N^2)">O(N²) - Quadratic</option>
                    <option value="O(N^3)">O(N³) - Cubic</option>
                    <option value="O(2^N)">O(2^N) - Exponential</option>
                    <option value="O(N!)">O(N!) - Factorial</option>
                  </select>
                </div>
                
                {/* SPACE COMPLEXITY DROPDOWN */}
                <div className="space-y-1">
                  <label className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Space Complexity</label>
                  <select name="space_complexity" value={form.space_complexity} onChange={handleChange} className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}>
                    <option value="">Select Space Complexity</option>
                    <option value="O(1)">O(1) - Constant</option>
                    <option value="O(log N)">O(log N) - Logarithmic</option>
                    <option value="O(N)">O(N) - Linear</option>
                    <option value="O(N^2)">O(N²) - Quadratic</option>
                    <option value="O(N^3)">O(N³) - Cubic</option>
                    <option value="O(2^N)">O(2^N) - Exponential</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className={`mt-6 pt-5 border-t flex items-center justify-end gap-3 ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                <button type="button" onClick={() => setOpen(false)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{loading ? "Saving..." : "Save Problem"}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProblemModal;