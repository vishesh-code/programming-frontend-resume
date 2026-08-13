import React, { useState, useEffect, useMemo, useCallback } from "react";
import CategoryTabs from "../components/problems/CategoryTabs";
import FilterBar from "../components/problems/FilterBar";
import ProblemsCard from "../components/problems/ProblemsCard";
import EmptyState from "../components/ui/EmptyState";
import AddProblemModal from "../components/problems/AddProblemModal";
import { useTheme } from "../context/themeContext";
import { useUser } from "../context/userContext";
import apiClient from "../utils/apiClient";
import { Loader2, Inbox, Plus } from "lucide-react";

const Landing = () => {
  const { darkMode } = useTheme();
  const { user } = useUser();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [solvedFilter, setSolvedFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("All"); 
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [mainTab, setMainTab] = useState("my_problems"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingProblem, setEditingProblem] = useState(null);
  const [shareProblem, setShareProblem] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/problems?tab=${mainTab}`);
      const data = response.data.problems
        ? response.data.problems
        : response.data;
      setProblems(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(err.response?.data?.message || "Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  }, [mainTab]); 

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  
  const fetchTags = useCallback(async () => {
    try {
      const response = await apiClient.get("/tag");
      setAllTags(response.data);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  
  useEffect(() => {
    setSelectedTags([]);
  }, [activeTab]);

  
  const handleProblemUpdate = (updatedProblem) => {
    if (!updatedProblem) return;
    setProblems((prevProblems) =>
      prevProblems.map((p) =>
        p._id === updatedProblem._id
          ? { ...p, solved: updatedProblem.solved }
          : p,
      ),
    );
    window.dispatchEvent(new Event("problemStatusChanged"));
  };

  const handleAddProblem = async (newProblemData) => {
    try {
      await apiClient.post("/problems", newProblemData);
      fetchProblems();
    } catch (err) {
      console.error("Error adding problem:", err);
      alert(err.response?.data?.message || "Failed to add problem");
    }
  };

  const handleEditComplete = (updatedProblem) => {
    setProblems((prevProblems) =>
      prevProblems.map((p) =>
        p._id === updatedProblem._id ? updatedProblem : p,
      ),
    );
    setEditingProblem(null);
  };

  const handleDeleteProblem = (id) => {
    setProblems((prevProblems) => prevProblems.filter((p) => p._id !== id));
  };

  
  const handleShareSubmit = async (e) => {
    e.preventDefault();
    if (!shareEmail) return;
    setIsSharing(true);
    try {
      await apiClient.post(`/problems/${shareProblem._id}/share`, {
        email: shareEmail,
      });
      setShareProblem(null);
      setShareEmail("");
      alert("Problem shared successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to share problem");
    } finally {
      setIsSharing(false);
    }
  };

  
  const filteredProblems = useMemo(() => {
    const lowerSearch = searchTerm ? searchTerm.toLowerCase() : "";

    return problems.filter((problem) => {
      const questionText = problem.question
        ? problem.question.toLowerCase()
        : "";

      const matchesSearch =
        !lowerSearch ||
        questionText.includes(lowerSearch) ||
        (problem.tags &&
          problem.tags.some((tag) => {
            const tagName = typeof tag === "object" ? tag.name : tag;
            return (
              tagName &&
              typeof tagName === "string" &&
              tagName.toLowerCase().includes(lowerSearch)
            );
          }));

      const matchesDifficulty =
        difficultyFilter === "All" || problem.difficulty === difficultyFilter;

      const matchesSolved =
        solvedFilter === "All" ||
        (solvedFilter === "Solved" && problem.solved) ||
        (solvedFilter === "Unsolved" && !problem.solved);

      const matchesCategory =
        activeTab === "All" ||
        (problem.category && problem.category.name === activeTab);

      
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some(
          (selectedTagId) =>
            problem.tags &&
            problem.tags.some((t) => (t._id || t) === selectedTagId),
        );

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesSolved &&
        matchesCategory &&
        matchesTags
      );
    });
  }, [
    problems,
    searchTerm,
    difficultyFilter,
    solvedFilter,
    activeTab,
    selectedTags,
  ]);

  
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const currentProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProblems, currentPage, itemsPerPage]);

  const handlePagination = (direction) => {
    if (direction === "prev" && currentPage > 1)
      setCurrentPage((prev) => prev - 1);
    if (direction === "next" && currentPage < totalPages)
      setCurrentPage((prev) => prev + 1);
  };

  
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    difficultyFilter,
    solvedFilter,
    activeTab,
    selectedTags,
    itemsPerPage,
    mainTab,
  ]);

  return (
    <div className="flex flex-col h-full space-y-6 animate-fadeUp">
      {/* Main Visibility Tabs */}
      <div
        className={`flex gap-6 border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}
      >
        {["my_problems", "public", "shared"].map((tab) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className={`pb-3 text-sm font-bold capitalize transition-colors border-b-2 ${
              mainTab === tab
                ? darkMode
                  ? "border-blue-400 text-blue-400"
                  : "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        problems={problems}
      />

      {/* Filters Section */}
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        solvedFilter={solvedFilter}
        setSolvedFilter={setSolvedFilter}
        activeTab={activeTab}
        allTags={allTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        onResetFilters={() => {
          setSearchTerm("");
          setDifficultyFilter("All");
          setSolvedFilter("All");
          setSelectedTags([]);
        }}
        addProblemComponent={
          <AddProblemModal
            onAdd={handleAddProblem}
            triggerElement={
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition-all font-medium text-sm w-full h-full">
                <Plus className="w-4 h-4" /> Add Problem
              </button>
            }
          />
        }
      />

      {error && (
        <div className="p-4 bg-red-100 text-red-600 rounded-xl text-center font-medium shadow-sm">
          {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : problems.length === 0 ? (
         
          <div
            className={`flex flex-col items-center justify-center flex-1 p-10 text-center rounded-2xl border-2 border-dashed ${darkMode ? "border-slate-700 bg-slate-800/30" : "border-slate-300 bg-slate-50"}`}
          >
            <div
              className={`p-4 rounded-full mb-4 ${darkMode ? "bg-slate-800 text-slate-500" : "bg-white text-slate-400 shadow-sm"}`}
            >
              <Inbox className="w-8 h-8" />
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              {mainTab === "my_problems"
                ? "Your Workspace is Empty"
                : "No Problems Found"}
            </h3>
            <p
              className={`text-sm max-w-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              {mainTab === "my_problems"
                ? "You haven't added any programming questions yet. Click '+ Add Problem' above to create your first one!"
                : `There is currently no data available in the ${mainTab.replace("_", " ")} tab.`}
            </p>
          </div>
        ) : filteredProblems.length === 0 ? (
         
          <EmptyState />
        ) : (
         
          <>
            <div className="flex flex-col gap-4 w-full">
              {currentProblems.map((problem, index) => (
                <ProblemsCard
                  key={problem._id}
                  problem={problem}
                  index={(currentPage - 1) * itemsPerPage + index + 1}
                  onUpdate={handleProblemUpdate}
                  onEdit={mainTab === "my_problems" ? setEditingProblem : null}
                  onDelete={
                    mainTab === "my_problems" ? handleDeleteProblem : null
                  }
                  onShare={mainTab === "my_problems" ? setShareProblem : null}
                />
              ))}
            </div>

            {/* Pagination Footer */}
            {filteredProblems.length > 0 && (
              <div
                className={`mt-8 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${darkMode ? "border-slate-700" : "border-slate-200"}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Show:
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className={`text-sm px-3 py-1.5 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-700"}`}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handlePagination("prev")}
                      disabled={currentPage === 1}
                      className={`px-4 py-1.5 rounded-lg transition border text-sm font-medium ${darkMode ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 disabled:opacity-50" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-50"} disabled:cursor-not-allowed`}
                    >
                      Previous
                    </button>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePagination("next")}
                      disabled={currentPage >= totalPages}
                      className={`px-4 py-1.5 rounded-lg transition border text-sm font-medium ${darkMode ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 disabled:opacity-50" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-50"} disabled:cursor-not-allowed`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden Edit Modal */}
      {editingProblem && (
        <AddProblemModal
          isEdit={true}
          initialData={editingProblem}
          onAdd={handleEditComplete}
          onClose={() => setEditingProblem(null)}
        />
      )}

      {/* Share Problem Modal */}
      {shareProblem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-md p-6 rounded-2xl shadow-xl animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <h3
              className={`text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Share Problem
            </h3>
            <p
              className={`text-sm mb-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Share "{shareProblem.question}" with another user.
            </p>

            <form onSubmit={handleShareSubmit}>
              <label
                className={`text-sm font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                User Email Address
              </label>
              <input
                type="email"
                required
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                placeholder="friend@example.com"
                className={`w-full mt-2 mb-6 px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 placeholder-slate-400"}`}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShareProblem(null)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSharing}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
                >
                  {isSharing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSharing ? "Sharing..." : "Share"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
