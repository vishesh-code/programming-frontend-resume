import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Loader2,
  Plus,
  Search,
  Trash2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useTheme } from "../../context/themeContext";
import apiClient from "../../utils/apiClient";

const COMPLEXITY_TIME_OPTIONS = [
  { value: "", label: "Select" },
  { value: "O(1)", label: "O(1) - Constant" },
  { value: "O(log N)", label: "O(log N) - Logarithmic" },
  { value: "O(N)", label: "O(N) - Linear" },
  { value: "O(N log N)", label: "O(N log N) - Linearithmic" },
  { value: "O(N^2)", label: "O(N²) - Quadratic" },
  { value: "O(N^3)", label: "O(N³) - Cubic" },
  { value: "O(2^N)", label: "O(2^N) - Exponential" },
  { value: "O(N!)", label: "O(N!) - Factorial" },
];

const COMPLEXITY_SPACE_OPTIONS = [
  { value: "", label: "Select" },
  { value: "O(1)", label: "O(1) - Constant" },
  { value: "O(log N)", label: "O(log N) - Logarithmic" },
  { value: "O(N)", label: "O(N) - Linear" },
  { value: "O(N^2)", label: "O(N²) - Quadratic" },
  { value: "O(N^3)", label: "O(N³) - Cubic" },
  { value: "O(2^N)", label: "O(2^N) - Exponential" },
];

const emptySolution = (n = 1) => ({
  title: `Approach ${n}`,
  code: "",
  language: "javascript",
  time_complexity: "",
  space_complexity: "",
});

const emptyForm = () => ({
  question: "",
  description: "",
  explanation: "",
  solutions: [emptySolution(1)],
  hints: [""],
  difficulty: "Medium",
  category: "",
  tags: [],
  visibility: "Private",
});

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

  const [form, setForm] = useState(emptyForm());

  // Collapsible state so a form with several approaches + hints stays scannable
  const [collapsedSolutions, setCollapsedSolutions] = useState({});

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
        visibility: initialData.visibility || "Private",
        hints: initialData.hints?.length > 0 ? initialData.hints : [""],
        explanation: initialData.explanation || "",
        solutions:
          initialData.solutions?.length > 0
            ? initialData.solutions.map((s) => ({
                title: s.title || "Approach 1",
                code: s.code || "",
                language: s.language || "javascript",
                // 🔥 fall back to old problem-level complexity if this is
                // a legacy problem that hasn't been re-saved yet
                time_complexity: s.time_complexity || initialData.time_complexity || "",
                space_complexity: s.space_complexity || initialData.space_complexity || "",
              }))
            : initialData.solution
              ? [
                  {
                    title: "Solution",
                    code: initialData.solution,
                    language: "javascript",
                    time_complexity: initialData.time_complexity || "",
                    space_complexity: initialData.space_complexity || "",
                  },
                ]
              : [emptySolution(1)],
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

  const handleCategoryChange = (e) => {
    setForm((prev) => ({
      ...prev,
      category: e.target.value,
      tags: [], // Reset tags if they change the category
    }));
    setTagSearch("");
  };

  const handleSolutionChange = (index, field, value) => {
    const newSolutions = [...form.solutions];
    newSolutions[index] = { ...newSolutions[index], [field]: value };
    setForm((prev) => ({ ...prev, solutions: newSolutions }));
  };

  const addSolutionBlock = () => {
    setForm((prev) => ({
      ...prev,
      solutions: [...prev.solutions, emptySolution(prev.solutions.length + 1)],
    }));
  };

  const removeSolutionBlock = (index) => {
    setForm((prev) => ({
      ...prev,
      solutions: prev.solutions.filter((_, i) => i !== index),
    }));
  };

  const toggleSolutionCollapsed = (index) => {
    setCollapsedSolutions((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // --- Hints handlers -----------------------------------------------
  const handleHintChange = (index, value) => {
    const newHints = [...form.hints];
    newHints[index] = value;
    setForm((prev) => ({ ...prev, hints: newHints }));
  };

  const addHint = () => {
    setForm((prev) => ({ ...prev, hints: [...prev.hints, ""] }));
  };

  const removeHint = (index) => {
    setForm((prev) => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index),
    }));
  };
  // --------------------------------------------------------------------

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

  const filteredTags = availableTags.filter((tag) => {
    const tagCategoryId = tag.category?._id || tag.category;
    const matchesCategory = tagCategoryId === form.category;
    const isNotSelected = !form.tags.includes(tag._id);
    const matchesSearch = tag.name.toLowerCase().includes(tagSearch.toLowerCase());

    return matchesCategory && isNotSelected && matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.category) {
      setError("Question and Category are required!");
      return;
    }

    setLoading(true);
    setError("");

    // Strip empty hint strings before sending to the API
    const payload = {
      ...form,
      hints: form.hints.map((h) => h.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        const res = await apiClient.put(`/problems/${initialData._id}`, payload);
        if (onAdd) onAdd(res.data);
      } else {
        await onAdd(payload);
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
      setForm(emptyForm());
      setTagSearch("");
      setCollapsedSolutions({});
    }
  };

  const isModalOpen = open || isEdit;

  const inputClasses = `w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`;
  const labelClasses = `text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`;

  return (
    <>
      {!isEdit &&
        (triggerElement ? (
          <div onClick={() => setOpen(true)}>{triggerElement}</div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-md transition-all font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="leading-none">Add Problem</span>
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
                <label className={labelClasses}>Question Title *</label>
                <input
                  required
                  type="text"
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  placeholder="e.g., Two Sum"
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className={labelClasses}>Difficulty</label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Category *</label>
                  <select
                    required
                    name="category"
                    value={form.category}
                    onChange={handleCategoryChange}
                    className={inputClasses}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={labelClasses}>Visibility</label>
                  <select
                    name="visibility"
                    value={form.visibility}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClasses}>Tags</label>
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
                      placeholder={form.category ? "Search to add tags..." : "Select a category first"}
                      disabled={!form.category}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}
                    />
                  </div>

                  {showTagDropdown && form.category && (
                    <div
                      className={`absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-xl border shadow-lg ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                    >
                      {filteredTags.length > 0 ? (
                        filteredTags.map((tag) => (
                          <button
                            key={tag._id}
                            type="button"
                            onClick={() => addTag(tag._id)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${darkMode ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50"}`}
                          >
                            {tag.name}
                          </button>
                        ))
                      ) : (
                        <div className={`px-4 py-3 text-sm italic ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                          No tags found for this category.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className={labelClasses}>Description</label>
                  <span className={`text-[11px] font-mono ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    {form.description.length} chars
                  </span>
                </div>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Full problem statement, constraints, examples..."
                  className={`${inputClasses} resize-y leading-relaxed`}
                />
                <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Long descriptions are fully preserved and shown in full on the problem card — nothing gets cut off.
                </p>
              </div>

              {/* Solutions */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className={labelClasses}>Solutions</label>
                  <button
                    type="button"
                    onClick={addSolutionBlock}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 ${darkMode ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                  >
                    <Plus className="w-3 h-3" /> Add Approach
                  </button>
                </div>

                {form.solutions.map((sol, index) => {
                  const isCollapsed = !!collapsedSolutions[index];
                  return (
                    <div
                      key={index}
                      className={`rounded-xl border overflow-hidden ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50"}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 pb-3">
                        <button
                          type="button"
                          onClick={() => toggleSolutionCollapsed(index)}
                          className={`p-1 rounded-md shrink-0 ${darkMode ? "text-slate-500 hover:bg-slate-700" : "text-slate-400 hover:bg-slate-200"}`}
                          title={isCollapsed ? "Expand" : "Collapse"}
                        >
                          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                        <div className="flex flex-1 gap-3">
                          <input
                            type="text"
                            value={sol.title}
                            onChange={(e) => handleSolutionChange(index, "title", e.target.value)}
                            placeholder="e.g. Brute Force"
                            className={`flex-1 text-sm font-semibold px-3 py-1.5 rounded-lg border outline-none min-w-[120px] ${darkMode ? "bg-slate-900 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-800"}`}
                          />
                          <select
                            value={sol.language || "javascript"}
                            onChange={(e) => handleSolutionChange(index, "language", e.target.value)}
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

                      {!isCollapsed && (
                        <div className="px-4 pb-4 space-y-3">
                          <div className="space-y-1">
                            <label className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                              Code
                            </label>
                            <textarea
                              value={sol.code}
                              onChange={(e) => handleSolutionChange(index, "code", e.target.value)}
                              placeholder="Paste solution code here..."
                              rows="5"
                              className={`w-full px-4 py-2.5 rounded-xl border font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}
                            />
                          </div>

                          {/* 🔥 MOVED: complexity is now per-approach */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                Time Complexity
                              </label>
                              <select
                                value={sol.time_complexity}
                                onChange={(e) => handleSolutionChange(index, "time_complexity", e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}
                              >
                                {COMPLEXITY_TIME_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                Space Complexity
                              </label>
                              <select
                                value={sol.space_complexity}
                                onChange={(e) => handleSolutionChange(index, "space_complexity", e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"}`}
                              >
                                {COMPLEXITY_SPACE_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 🔥 NEW: single global Explanation — the write-up of the
                  overall approach/logic, shown once in the Solutions tab
                  (separate from the problem's Description above). */}
              <div className="space-y-1 pt-2">
                <label className={labelClasses}>Explanation</label>
                <textarea
                  name="explanation"
                  value={form.explanation}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Walk through the approach/logic used to solve this problem, step by step..."
                  className={`${inputClasses} resize-y leading-relaxed`}
                />
                <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Shown once in the Solutions tab. Each code block below should contain only that approach's code.
                </p>
              </div>

              {/* 🔥 NEW: Hints */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <label className={`${labelClasses} flex items-center gap-1.5`}>
                    <Lightbulb className={`w-4 h-4 ${darkMode ? "text-amber-400" : "text-amber-500"}`} />
                    Hints
                  </label>
                  <button
                    type="button"
                    onClick={addHint}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 ${darkMode ? "bg-amber-900/30 text-amber-400 hover:bg-amber-900/50" : "bg-amber-50 text-amber-600 hover:bg-amber-100"}`}
                  >
                    <Plus className="w-3 h-3" /> Add Hint
                  </button>
                </div>
                <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Hints are revealed one at a time, in order, so keep the first hint gentle and get more specific from there.
                </p>

                {form.hints.map((hint, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div
                      className={`shrink-0 mt-2.5 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${darkMode ? "bg-amber-900/40 text-amber-300" : "bg-amber-100 text-amber-700"}`}
                    >
                      {index + 1}
                    </div>
                    <textarea
                      value={hint}
                      onChange={(e) => handleHintChange(index, e.target.value)}
                      placeholder={`Hint ${index + 1}...`}
                      rows="2"
                      className={`flex-1 px-4 py-2 rounded-xl border text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                    />
                    {form.hints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHint(index)}
                        className="p-1.5 mt-1.5 shrink-0 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
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
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{loading ? "Saving..." : isEdit ? "Update Problem" : "Save Problem"}</span>
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