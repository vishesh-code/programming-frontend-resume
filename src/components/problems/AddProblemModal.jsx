// import React, { useState } from "react";
// import { PlusCircle, X } from "lucide-react";

// const AddProblemModal = ({ onAdd }) => {
//   const [open, setOpen] = useState(false);

//   const [form, setForm] = useState({
//     question: "",
//     description: "",
//     solution: "",
//     difficulty: "Medium",
//     category: "",
//     tags: "",
//     time_complexity: "",
//     space_complexity: "",
//     solved: false,
//   });

//   // For error handling or loading (optional)
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Basic validation
//     if (!form.question.trim()) {
//       setError("Question is required!");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     // Pass tags as array, trimmed
//     const problemData = {
//       ...form,
//       tags: form.tags
//         .split(",")
//         .map((t) => t.trim())
//         .filter(Boolean),
//     };
//     // Call parent's handler
//     Promise.resolve(onAdd(problemData))
//       .then(() => {
//         setOpen(false);
//         setForm({
//           question: "",
//           description: "",
//           solution: "",
//           difficulty: "Medium",
//           category: "",
//           tags: "",
//           time_complexity: "",
//           space_complexity: "",
//           solved: false,
//         });
//         setLoading(false);
//         setError("");
//       })
//       .catch((err) => {
//         setError(err?.message || "Error adding problem.");
//         setLoading(false);
//       });
//   };

//   return (
//     <>
//       {/* Add Problem Button */}
//       <button
//         onClick={() => setOpen(true)}
//         className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
//       >
//         <PlusCircle className="h-5 w-5" />
//         <span>Add Problem</span>
//       </button>

//       {/* Modal */}
//       {open && (
//         <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
//           <div className="bg-white rounded-2xl shadow-xl p-7 w-full max-w-xl relative">
//             <button
//               className="absolute top-3 right-3 text-slate-400 hover:text-red-400 transition-colors"
//               onClick={() => {
//                 setOpen(false);
//                 setError("");
//               }}
//               tabIndex={0}
//             >
//               <X className="h-5 w-5" />
//             </button>
//             <h2 className="font-bold text-xl mb-4">Add New Problem</h2>
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <input
//                 name="question"
//                 value={form.question}
//                 onChange={handleChange}
//                 required
//                 placeholder="Question *"
//                 className="w-full p-3 rounded bg-slate-50 border"
//               />
//               <textarea
//                 name="description"
//                 value={form.description}
//                 onChange={handleChange}
//                 placeholder="Description"
//                 className="w-full p-3 rounded bg-slate-50 border"
//               />
//               <textarea
//                 name="solution"
//                 value={form.solution}
//                 onChange={handleChange}
//                 placeholder="Solution Code"
//                 className="w-full p-3 rounded bg-slate-50 border"
//               />
//               <input
//                 name="category"
//                 value={form.category}
//                 onChange={handleChange}
//                 placeholder="Category"
//                 className="w-full p-3 rounded bg-slate-50 border"
//               />
//               <input
//                 name="tags"
//                 value={form.tags}
//                 onChange={handleChange}
//                 placeholder="Tags (comma separated)"
//                 className="w-full p-3 rounded bg-slate-50 border"
//               />
//               <input
//                 name="time_complexity"
//                 value={form.time_complexity}
//                 onChange={handleChange}
//                 placeholder="Time Complexity"
//                 className="w-full p-3 rounded bg-slate-50 border"
//               />
//               <input
//                 name="space_complexity"
//                 value={form.space_complexity}
//                 onChange={handleChange}
//                 placeholder="Space Complexity"
//                 className="w-full p-3 rounded bg-slate-50 border"
//               />
//               <select
//                 name="difficulty"
//                 value={form.difficulty}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded bg-slate-50 border"
//               >
//                 <option value="Easy">Easy</option>
//                 <option value="Medium">Medium</option>
//                 <option value="Hard">Hard</option>
//               </select>
//               <div>
//                 <label className="cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="solved"
//                     checked={form.solved}
//                     onChange={handleChange}
//                   />{" "}
//                   Mark as Solved
//                 </label>
//               </div>
//               {error && <div className="text-red-500 text-sm">{error}</div>}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow font-medium"
//               >
//                 {loading ? "Saving..." : "Save Problem"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AddProblemModal;





import React, { useState } from "react";
import { 
  PlusCircle, 
  X, 
  Code, 
  AlignLeft, 
  FileText, 
  Clock, 
  Database, 
  Hash, 
  Folder,
  Save,
  Loader2,
  Check
} from "lucide-react";
import { useTheme } from "../../context/themeContext";
import apiClient from "../../utils/apiClient"; // <-- Imported Axios instance

// --- Mock Data for Dropdowns ---
// In a real app, these would be fetched via API and passed as props or fetched in useEffect
const MOCK_CATEGORIES = [
  { id: "660c1234567890abcdef1234", name: "Arrays & Hashing" },
  { id: "660c1234567890abcdef1237", name: "Two Pointers" },
  { id: "660c1234567890abcdef1238", name: "Dynamic Programming" },
  { id: "660c1234567890abcdef1239", name: "Graphs" },
];

const MOCK_TAGS = [
  { id: "660c1234567890abcdef1235", name: "Hash Table" },
  { id: "660c1234567890abcdef1236", name: "Math" },
  { id: "660c1234567890abcdef1240", name: "Sorting" },
  { id: "660c1234567890abcdef1241", name: "Greedy" },
  { id: "660c1234567890abcdef1242", name: "DFS" },
];

const AddProblemModal = ({ onAdd }) => {
  const { darkMode } = useTheme();
  const [open, setOpen] = useState(false);

  // Initialize state to match the requested JSON body format
  const [form, setForm] = useState({
    question: "",
    description: "",
    solution: "",
    difficulty: "Medium",
    category: "", // Expects Category ID
    tags: [], // Expects Array of Tag IDs
    time_complexity: "",
    space_complexity: "",
    solved: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // General change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Special handler for the Tags multi-select
  const handleTagSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    if (!form.tags.includes(selectedId)) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, selectedId],
      }));
    }
    // Reset the select dropdown to the default option
    e.target.value = ""; 
  };

  const removeTag = (idToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((id) => id !== idToRemove),
    }));
  };

  // UPDATED: Using async/await, try...catch, and axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!form.question.trim()) {
      setError("The question title is required.");
      return;
    }
    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Make the Axios POST request directly
      await apiClient.post("/problems", form);

      // 2. On success, close modal and reset form
      setOpen(false);
      setForm({
        question: "",
        description: "",
        solution: "",
        difficulty: "Medium",
        category: "",
        tags: [],
        time_complexity: "",
        space_complexity: "",
        solved: false,
      });

      // 3. Notify the parent component (Landing.jsx) to refresh the problems list
      if (typeof onAdd === "function") {
        onAdd();
      }

    } catch (err) {
      // Handle Axios errors cleanly
      const errorMessage = err.response?.data?.message || err.message || "An error occurred while adding the problem.";
      setError(errorMessage);
    } finally {
      // Stop the loading spinner whether it succeeded or failed
      setLoading(false);
    }
  };

  // Theming classes to keep JSX clean
  const inputBg = darkMode ? "bg-slate-900 border-slate-700 text-white focus:bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white";
  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`;
  const iconClass = `absolute left-3 top-3.5 h-4 w-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
      >
        <PlusCircle className="h-5 w-5" />
        <span>Add Problem</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
          <div 
            className={`relative w-full max-w-4xl rounded-2xl shadow-2xl border my-8 animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-8 py-5 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Code className="h-5 w-5" />
                </div>
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  Create New Problem
                </h2>
              </div>
              <button
                className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"}`}
                onClick={() => { setOpen(false); setError(""); }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* --- LEFT COLUMN: Core Content --- */}
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Question Title</label>
                    <div className="relative">
                      <AlignLeft className={iconClass} />
                      <input
                        name="question"
                        value={form.question}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Two Sum"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Description</label>
                    <div className="relative">
                      <FileText className={iconClass} />
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Given an array of integers nums..."
                        rows={4}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm resize-none ${inputBg}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Solution Strategy / Code</label>
                    <div className="relative">
                      <Code className={iconClass} />
                      <textarea
                        name="solution"
                        value={form.solution}
                        onChange={handleChange}
                        placeholder="Use a hash map to store the difference..."
                        rows={5}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm resize-none ${inputBg}`}
                      />
                    </div>
                  </div>
                </div>

                {/* --- RIGHT COLUMN: Metadata & Classification --- */}
                <div className="space-y-5">
                  
                  {/* Category & Difficulty Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Category</label>
                      <div className="relative">
                        <Folder className={iconClass} />
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm appearance-none ${inputBg}`}
                        >
                          <option value="" disabled>Select category</option>
                          {MOCK_CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Difficulty</label>
                      <select
                        name="difficulty"
                        value={form.difficulty}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm font-medium ${
                          form.difficulty === 'Easy' ? 'text-emerald-500' :
                          form.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'
                        } ${inputBg}`}
                      >
                        <option value="Easy" className="text-emerald-500 font-medium">Easy</option>
                        <option value="Medium" className="text-amber-500 font-medium">Medium</option>
                        <option value="Hard" className="text-red-500 font-medium">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Tags Multi-select */}
                  <div>
                    <label className={labelClass}>Tags</label>
                    <div className="relative mb-3">
                      <Hash className={iconClass} />
                      <select
                        onChange={handleTagSelect}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm appearance-none ${inputBg}`}
                      >
                        <option value="">Select tags to add...</option>
                        {MOCK_TAGS.filter(t => !form.tags.includes(t.id)).map(tag => (
                          <option key={tag.id} value={tag.id}>{tag.name}</option>
                        ))}
                      </select>
                    </div>
                    {/* Selected Tags Pills */}
                    <div className="flex flex-wrap gap-2">
                      {form.tags.length === 0 && (
                        <span className={`text-xs italic ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No tags selected</span>
                      )}
                      {form.tags.map(tagId => {
                        const tagObj = MOCK_TAGS.find(t => t.id === tagId);
                        return (
                          <div 
                            key={tagId} 
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${darkMode ? "bg-blue-900/30 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                          >
                            <span>{tagObj ? tagObj.name : tagId}</span>
                            <button 
                              type="button" 
                              onClick={() => removeTag(tagId)}
                              className="opacity-60 hover:opacity-100 hover:text-red-500 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Complexities Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Time Complexity</label>
                      <div className="relative">
                        <Clock className={iconClass} />
                        <input
                          name="time_complexity"
                          value={form.time_complexity}
                          onChange={handleChange}
                          placeholder="e.g. O(n)"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm ${inputBg}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Space Complexity</label>
                      <div className="relative">
                        <Database className={iconClass} />
                        <input
                          name="space_complexity"
                          value={form.space_complexity}
                          onChange={handleChange}
                          placeholder="e.g. O(1)"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-mono text-sm ${inputBg}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className={`mt-6 flex items-center justify-between p-4 rounded-xl border ${darkMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <div>
                      <h4 className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-slate-800"}`}>Problem Status</h4>
                      <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Mark this problem as successfully solved</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="solved"
                        checked={form.solved}
                        onChange={handleChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                      <div className={`absolute right-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity`}>
                        <Check className="w-3 h-3 ml-1" />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`mt-6 p-4 rounded-xl text-sm border flex items-center gap-3 ${darkMode ? "bg-red-900/30 text-red-200 border-red-800" : "bg-red-50 text-red-600 border-red-200"}`}>
                  <X className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className={`mt-8 pt-6 border-t flex items-center justify-end gap-4 ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 font-medium disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed"
                >
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