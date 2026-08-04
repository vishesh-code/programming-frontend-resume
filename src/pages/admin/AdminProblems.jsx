import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/themeContext';
import { Search, Trash2, Eye, X, AlertTriangle, Code } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const AdminProblems = () => {
  const { darkMode } = useTheme();
  
  // State
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // 1. Fetch All Problems
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/admin/problems');
      setProblems(data.problems || []);
    } catch (error) {
      console.error("Error fetching problems:", error);
      alert("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // 2. Delete Single Problem
  const handleDeleteProblem = async (problemId) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;

    try {
      await apiClient.delete(`/admin/problems/${problemId}`);
      setProblems(problems.filter(p => p._id !== problemId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete problem");
    }
  };

  // 3. Bulk Delete All Problems
  const handleDeleteAll = async () => {
    try {
      const { data } = await apiClient.delete('/admin/problems');
      setProblems([]);
      setShowDeleteAllConfirm(false);
      alert(data.message || "All problems deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to bulk delete problems");
    }
  };

  // 4. Filter & Pagination Logic
  const filteredProblems = useMemo(() => {
    return problems.filter(p => 
      p.question?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [problems, searchTerm]);

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const currentProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProblems, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, itemsPerPage]);

  const handlePagination = (direction) => {
    if (direction === "prev" && currentPage > 1) setCurrentPage(prev => prev - 1);
    if (direction === "next" && currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="space-y-6 animate-fadeUp relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Problems Database</h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage all user-generated programming problems.</p>
        </div>
        <button 
          onClick={() => setShowDeleteAllConfirm(true)}
          disabled={problems.length === 0}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl shadow-md transition-all font-medium text-sm"
        >
          <AlertTriangle className="w-4 h-4" /> Delete All Problems
        </button>
      </div>

      {/* Module Card */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        
        {/* Toolbar */}
        <div className={`p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4 ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
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
          <div className="flex items-center gap-3">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className={`text-sm px-3 py-1.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-700"}`}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Total: {filteredProblems.length}
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
               Loading problems...
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase font-semibold ${darkMode ? "bg-slate-900/50 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                <tr>
                  <th className="px-6 py-4">Question Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Visibility</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-slate-700/50" : "divide-slate-100"}`}>
                {currentProblems.map((problem) => {
                  const authorName = problem.user?.email ? problem.user.email.split('@')[0] : 'Unknown';

                  return (
                    <tr key={problem._id} className={`transition-colors hover:bg-slate-50/50 ${darkMode ? "hover:bg-slate-700/20" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-slate-700 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                            <Code className="w-5 h-5" />
                          </div>
                          <span className={`font-medium ${darkMode ? "text-slate-200" : "text-slate-900"} max-w-[200px] truncate`} title={problem.question}>
                            {problem.question}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? "text-slate-300" : "text-slate-700"} capitalize`}>
                        {authorName}
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {problem.category?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          problem.difficulty === 'Easy' ? (darkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700") :
                          problem.difficulty === 'Medium' ? (darkMode ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700") :
                          (darkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700")
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {problem.visibility}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedProblem(problem)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-blue-400 hover:bg-slate-700" : "text-slate-500 hover:text-blue-600 hover:bg-blue-50"}`}
                            title="View Problem Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProblem(problem._id)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-700" : "text-slate-500 hover:text-red-600 hover:bg-red-50"}`}
                            title="Delete Problem"
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
          {!loading && filteredProblems.length === 0 && (
            <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              No problems found.
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {filteredProblems.length > 0 && (
          <div className={`p-4 border-t flex justify-between items-center ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
            <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Page {currentPage} of {totalPages || 1}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePagination("prev")}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"} disabled:cursor-not-allowed`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePagination("next")}
                disabled={currentPage >= totalPages}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700 disabled:opacity-50" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"} disabled:cursor-not-allowed`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 🛑 VIEW DETAILS MODAL */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl shadow-xl overflow-hidden ${darkMode ? "bg-slate-800 border border-slate-700" : "bg-white"}`}>
            
            <div className={`px-6 py-4 border-b flex justify-between items-center shrink-0 ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {selectedProblem.question}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{selectedProblem.category?.name}</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Time: {selectedProblem.time_complexity || 'N/A'}</span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Space: {selectedProblem.space_complexity || 'N/A'}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProblem(null)}
                className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Description</h4>
                <p className={`text-sm whitespace-pre-wrap ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {selectedProblem.description || "No description provided."}
                </p>
              </div>

              {selectedProblem.solutions?.length > 0 && (
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Solutions ({selectedProblem.solutions.length})</h4>
                  <div className="space-y-4">
                    {selectedProblem.solutions.map((sol, i) => (
                      <div key={i} className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-semibold text-sm ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{sol.title}</span>
                          <span className={`text-xs px-2 py-1 rounded border uppercase ${darkMode ? "border-slate-600 text-slate-400 bg-slate-800" : "border-slate-300 text-slate-500 bg-white"}`}>{sol.language}</span>
                        </div>
                        <pre className={`p-3 rounded-lg overflow-x-auto text-sm font-mono ${darkMode ? "bg-black text-slate-300" : "bg-slate-800 text-slate-200"}`}>
                          <code>{sol.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`px-6 py-4 border-t flex justify-end shrink-0 ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
              <button 
                onClick={() => setSelectedProblem(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛑 BULK DELETE CONFIRMATION MODAL */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 overflow-hidden ${darkMode ? "bg-slate-800 border-red-900/50" : "bg-white border-red-100"}`}>
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete All Problems?</h3>
            </div>
            
            <p className={`mb-6 text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              This action will permanently delete <strong>every single problem</strong> from the database. This action cannot be undone. Are you absolutely sure?
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteAllConfirm(false)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAll}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md font-medium text-sm transition-colors"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProblems;