import React, { useState, useEffect, useRef } from "react";
import { X, Save, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useTheme } from "../../context/themeContext";
import apiClient from "../../utils/apiClient";

const AddProblemModal = ({
  onAdd,
  isEdit = false,
  initialData = null,
  triggerElement = null,
  onClose = null,
}) => {
  const { darkMode } = useTheme();

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  const [form, setForm] = useState({
    question: "",
    description: "",
    solutions: [{ title: "Approach 1", code: "", language: "javascript" }],
    difficulty: "Medium",
    category: "",
    tags: [],
    time_complexity: "",
    space_complexity: "",
    visibility: "Private", // 🔥 NEW: Default visibility
  });

  const [tagSearch, setTagSearch] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && (open || isEdit)) {
      setForm({
        ...initialData,
        category: initialData.category?._id || initialData.category || "",
        tags: initialData.tags?.map((t) => t._id || t) || [],

        // 🔥 NEW: Set visibility from initial data
        visibility: initialData.visibility || "Private",

        solutions:
          initialData.solutions?.length > 0
            ? initialData.solutions
            : initialData.solution
              ? [
                  {
                    title: "Solution",
                    code: initialData.solution,
                    language: "javascript",
                  },
                ]
              : [{ title: "Approach 1", code: "", language: "javascript" }],
      });
    }
  }, [initialData, open, isEdit]);

  useEffect(() => {
    if (open || isEdit) {
      const fetchDropdownData = async () => {
        try {
          const [catRes, tagRes] = await Promise.all([
            apiClient.get("/category"),
            apiClient.get("/tag"),
          ]);
          setCategories(catRes.data);
          setAvailableTags(tagRes.data);
        } catch (err) {
          console.error("Failed to fetch categories/tags:", err);
        }
      };
      fetchDropdownData();
    }
  }, [open, isEdit]);

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

  const handleSolutionChange = (index, field, value) => {
    const newSolutions = [...form.solutions];
    newSolutions[index][field] = value;
    setForm((prev) => ({ ...prev, solutions: newSolutions }));
  };

  const addSolutionBlock = () => {
    setForm((prev) => ({
      ...prev,
      solutions: [
        ...prev.solutions,
        {
          title: `Approach ${prev.solutions.length + 1}`,
          code: "",
          language: "javascript",
        },
      ],
    }));
  };

  const removeSolutionBlock = (index) => {
    setForm((prev) => ({
      ...prev,
      solutions: prev.solutions.filter((_, i) => i !== index),
    }));
  };

  const addTag = (tagId) => {
    if (!form.tags.includes(tagId)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagId] }));
    }
    setTagSearch("");
    setShowTagDropdown(false);
  };

  const removeTag = (tagId) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((id) => id !== tagId),
    }));
  };

  const filteredTags = availableTags.filter(
    (tag) =>
      !form.tags.includes(tag._id) &&
      tag.name.toLowerCase().includes(tagSearch.toLowerCase()),
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.category) {
      setError("Question and Category are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        const res = await apiClient.put(`/problems/${initialData._id}`, form);
        if (onAdd) onAdd(res.data);
      } else {
        await onAdd(form);
      }
      handleClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to process problem.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
    if (!isEdit) {
      setForm({
        question: "",
        description: "",
        solutions: [{ title: "Approach 1", code: "", language: "javascript" }],
        difficulty: "Medium",
        category: "",
        tags: [],
        time_complexity: "",
        space_complexity: "",
        visibility: "Private",
      });
      setTagSearch("");
    }
  };

  const isModalOpen = open || isEdit;

  return (
    <>
      {!isEdit &&
        (triggerElement ? (
          <div onClick={() => setOpen(true)}>{triggerElement}</div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all font-medium text-sm"
          >
            <Plus className="w-4 h-4" /> Add Problem
          </button>
        ))}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-2xl shadow-xl animate-fadeUp my-8 max-h-[90vh] overflow-y-auto ${darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}`}
          >
            <div
              className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${darkMode ? "bg-slate-800/95 border-slate-700" : "bg-white/95 border-slate-100"}`}
            >
              <h2
                className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                {isEdit ? "Edit Problem" : "Add New Problem"}
              </h2>
              <button
                onClick={handleClose}
                className={`p-2 rounded-xl transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1">
                <label
                  className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  Question Title *
                </label>
                <input
                  required
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="e.g., Two Sum"
                  className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label
                    className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Category *
                  </label>
                  <select
                    required
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 🔥 NEW: Visibility Dropdown */}
                <div className="space-y-1">
                  <label
                    className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Visibility
                  </label>
                  <select
                    name="visibility"
                    value={form.visibility}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  >
                    <option value="Private">🔒 Private</option>
                    <option value="Public">🌐 Public</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  Tags
                </label>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map((tagId) => {
                      const tagObj = availableTags.find((t) => t._id === tagId);
                      if (!tagObj) return null;
                      return (
                        <div
                          key={tagObj._id}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${darkMode ? "bg-blue-900/30 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                        >
                          <span>{tagObj.name}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tagObj._id)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="relative" ref={tagInputRef}>
                  <div className="relative">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                    />
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
                  {showTagDropdown && filteredTags.length > 0 && (
                    <div
                      className={`absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-xl border shadow-lg ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                    >
                      {filteredTags.map((tag) => (
                        <button
                          key={tag._id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            addTag(tag._id);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${darkMode ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                />
              </div>

              {/* MULTIPLE SOLUTIONS SECTION WITH LANGUAGE SELECTOR */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label
                    className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Solutions
                  </label>
                  <button
                    type="button"
                    onClick={addSolutionBlock}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 ${darkMode ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                  >
                    <Plus className="w-3 h-3" /> Add Approach
                  </button>
                </div>

                {form.solutions.map((sol, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <div className="flex flex-1 gap-3">
                        <input
                          type="text"
                          value={sol.title}
                          onChange={(e) =>
                            handleSolutionChange(index, "title", e.target.value)
                          }
                          placeholder="e.g. Brute Force"
                          className={`flex-1 text-sm font-semibold px-3 py-1.5 rounded-lg border outline-none min-w-[120px] ${darkMode ? "bg-slate-900 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-800"}`}
                        />

                        <select
                          value={sol.language || "javascript"}
                          onChange={(e) =>
                            handleSolutionChange(
                              index,
                              "language",
                              e.target.value,
                            )
                          }
                          className={`text-sm px-3 py-1.5 rounded-lg border outline-none min-w-[110px] ${darkMode ? "bg-slate-900 border-slate-600 text-slate-200" : "bg-white border-slate-300 text-slate-700"}`}
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                          <option value="c">C</option>
                          <option value="go">Go</option>
                          <option value="rust">Rust</option>
                          <option value="csharp">C#</option>
                        </select>
                      </div>

                      {form.solutions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSolutionBlock(index)}
                          className="p-1.5 shrink-0 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <textarea
                      value={sol.code}
                      onChange={(e) =>
                        handleSolutionChange(index, "code", e.target.value)
                      }
                      placeholder="Paste solution code here..."
                      rows="4"
                      className={`w-full px-4 py-2.5 rounded-xl border font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1">
                  <label
                    className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Time Complexity
                  </label>
                  <select
                    name="time_complexity"
                    value={form.time_complexity}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  >
                    <option value="">Select</option>
                    <option value="O(1)">O(1) - Constant</option>
                    <option value="O(log N)">O(log N) - Logarithmic</option>
                    <option value="O(N)">O(N) - Linear</option>
                    <option value="O(N log N)">
                      O(N log N) - Linearithmic
                    </option>
                    <option value="O(N^2)">O(N²) - Quadratic</option>
                    <option value="O(N^3)">O(N³) - Cubic</option>
                    <option value="O(2^N)">O(2^N) - Exponential</option>
                    <option value="O(N!)">O(N!) - Factorial</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label
                    className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Space Complexity
                  </label>
                  <select
                    name="space_complexity"
                    value={form.space_complexity}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  >
                    <option value="">Select</option>
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
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium border flex items-center gap-2">
                  <X className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div
                className={`mt-6 pt-5 border-t flex items-center justify-end gap-3 ${darkMode ? "border-slate-700" : "border-slate-100"}`}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>
                    {loading
                      ? "Saving..."
                      : isEdit
                        ? "Update Problem"
                        : "Save Problem"}
                  </span>
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
