import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";

// Pass onAdd (function) from parent to handle adding the new problem to state/backend
const AddProblemModal = ({ onAdd }) => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    question: "",
    description: "",
    solution: "",
    difficulty: "Medium",
    category: "",
    tags: "",
    time_complexity: "",
    space_complexity: "",
    solved: false
  });

  // For error handling or loading (optional)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Basic validation
    if (!form.question.trim()) {
      setError("Question is required!");
      return;
    }
    setLoading(true);
    setError("");
    // Pass tags as array, trimmed
    const problemData = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
    };
    // Call parent's handler
    Promise.resolve(onAdd(problemData)).then(() => {
      setOpen(false);
      setForm({
        question: "",
        description: "",
        solution: "",
        difficulty: "Medium",
        category: "",
        tags: "",
        time_complexity: "",
        space_complexity: "",
        solved: false
      });
      setLoading(false);
      setError("");
    }).catch(err => {
      setError(err?.message || "Error adding problem.");
      setLoading(false);
    });
  };

  return (
    <>
      {/* Add Problem Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
      >
        <PlusCircle className="h-5 w-5" />
        <span>Add Problem</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-7 w-full max-w-xl relative">
            <button 
              className="absolute top-3 right-3 text-slate-400 hover:text-red-400 transition-colors"
              onClick={() => { setOpen(false); setError(""); }}
              tabIndex={0}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="font-bold text-xl mb-4">Add New Problem</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                name="question"
                value={form.question}
                onChange={handleChange}
                required
                placeholder="Question *"
                className="w-full p-3 rounded bg-slate-50 border"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-3 rounded bg-slate-50 border"
              />
              <textarea
                name="solution"
                value={form.solution}
                onChange={handleChange}
                placeholder="Solution Code"
                className="w-full p-3 rounded bg-slate-50 border"
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full p-3 rounded bg-slate-50 border"
              />
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Tags (comma separated)"
                className="w-full p-3 rounded bg-slate-50 border"
              />
              <input
                name="time_complexity"
                value={form.time_complexity}
                onChange={handleChange}
                placeholder="Time Complexity"
                className="w-full p-3 rounded bg-slate-50 border"
              />
              <input
                name="space_complexity"
                value={form.space_complexity}
                onChange={handleChange}
                placeholder="Space Complexity"
                className="w-full p-3 rounded bg-slate-50 border"
              />
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full p-3 rounded bg-slate-50 border"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <div>
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="solved"
                    checked={form.solved}
                    onChange={handleChange}
                  />{" "}
                  Mark as Solved
                </label>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow font-medium"
              >
                {loading ? "Saving..." : "Save Problem"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProblemModal;
