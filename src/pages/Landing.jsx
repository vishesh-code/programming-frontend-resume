
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import CategoryTabs from "../components/problems/CategoryTabs";
// import FilterBar from "../components/problems/FilterBar";
// import ProblemsCard from "../components/problems/ProblemsCard";
// import EmptyState from "../components/ui/EmptyState";
// import AddProblemModal from "../components/problems/AddProblemModal";
// import { useTheme } from "../context/themeContext";
// import { useUser } from "../context/userContext";
// import apiClient from "../utils/apiClient";
// import { Loader2 } from "lucide-react";

// const ITEMS_PER_PAGE = 6;

// const Landing = () => {
//   const { darkMode } = useTheme();
//   const { user } = useUser();

//   // App state
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Filter/sort states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [difficultyFilter, setDifficultyFilter] = useState("All");
//   const [solvedFilter, setSolvedFilter] = useState("All");
//   const [activeTab, setActiveTab] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);

//   // 1. Fetch Problems from Backend
//   const fetchProblems = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await apiClient.get("/problems");
//       setProblems(response.data);
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching problems:", err);
//       setError(err.response?.data?.message || "Failed to fetch problems");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProblems();
//   }, [fetchProblems]);

//   // 2. Update a single problem in local state without reloading the whole list
//  // 2. Update a single problem in local state without reloading the whole list
//   const handleProblemUpdate = (updatedProblem) => {
//     if (!updatedProblem) return;
    
//     setProblems((prevProblems) =>
//       prevProblems.map((p) => 
//         // If the ID matches, keep all existing data (...p) but update the solved status
//         p._id === updatedProblem._id 
//           ? { ...p, solved: updatedProblem.solved } 
//           : p
//       )
//     );
//   };

//   // 3. Handle Add Problem
//   const handleAddProblem = async (newProblemData) => {
//     try {
//       await apiClient.post("/problems", newProblemData);
//       fetchProblems();
//     } catch (err) {
//       console.error("Error adding problem:", err);
//       alert(err.response?.data?.message || "Failed to add problem");
//     }
//   };

//   // Filter Logic
// // Filter Logic (Bulletproof version)
//   const filteredProblems = useMemo(() => {
//     // 1. Safely handle the search term
//     const lowerSearch = searchTerm ? searchTerm.toLowerCase() : "";

//     return problems.filter((problem) => {
//       // 2. Safely check the question title
//       const questionText = problem.question ? problem.question.toLowerCase() : "";
      
//       const matchesSearch =
//         !lowerSearch ||
//         questionText.includes(lowerSearch) ||
//         (problem.tags &&
//           problem.tags.some((tag) => {
//             // 3. THIS IS THE MAGIC LINE FOR YOUR DATA FORMAT:
//             // It checks if the tag is an object (like your data) and extracts the .name
//             const tagName = typeof tag === 'object' ? tag.name : tag;
            
//             // 4. Only call .toLowerCase() if tagName actually exists and is a string
//             return tagName && typeof tagName === 'string' && tagName.toLowerCase().includes(lowerSearch);
//           }));

//       const matchesDifficulty =
//         difficultyFilter === "All" || problem.difficulty === difficultyFilter;
        
//       const matchesSolved =
//         solvedFilter === "All" ||
//         (solvedFilter === "Solved" && problem.solved) ||
//         (solvedFilter === "Unsolved" && !problem.solved);
        
//       const matchesCategory =
//         activeTab === "All" ||
//         (problem.category && problem.category.name === activeTab);

//       return (
//         matchesSearch && matchesDifficulty && matchesSolved && matchesCategory
//       );
//     });
//   }, [problems, searchTerm, difficultyFilter, solvedFilter, activeTab]);

//   // Pagination Logic
//   const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
//   const currentProblems = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredProblems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [filteredProblems, currentPage]);

//   const handlePagination = (direction) => {
//     if (direction === "prev" && currentPage > 1)
//       setCurrentPage((prev) => prev - 1);
//     if (direction === "next" && currentPage < totalPages)
//       setCurrentPage((prev) => prev + 1);
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, difficultyFilter, solvedFilter, activeTab]);

//   return (
//     <div className="flex flex-col h-full space-y-6 animate-fadeUp">
      
//       {/* Tabs Section */}
//       <CategoryTabs
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         problems={problems}
//       />

//       {/* Filters Section */}
//       <FilterBar
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         difficultyFilter={difficultyFilter}
//         setDifficultyFilter={setDifficultyFilter}
//         solvedFilter={solvedFilter}
//         setSolvedFilter={setSolvedFilter}
//         onAddClick={() => document.getElementById("add-modal")?.showModal()}
//       />

//       {/* Error State */}
//       {error && (
//         <div className="p-4 bg-red-100 text-red-600 rounded-xl text-center font-medium shadow-sm">
//           {error}
//         </div>
//       )}

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col min-h-[500px]">
//         {loading ? (
//           <div className="flex-1 flex justify-center items-center">
//             <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
//           </div>
//         ) : filteredProblems.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <>
//             {/* Display problems in a single column (line-by-line layout) */}
//             <div className="flex flex-col gap-5 w-full">
//               {currentProblems.map((problem) => (
//                 <ProblemsCard
//                   key={problem._id}
//                   problem={problem}
//                   onUpdate={handleProblemUpdate} 
//                 />
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="mt-8 flex justify-center items-center space-x-4">
//                 <button
//                   onClick={() => handlePagination("prev")}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded-lg transition border font-medium ${
//                     darkMode
//                       ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 disabled:opacity-50"
//                       : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
//                   } disabled:cursor-not-allowed`}
//                 >
//                   Previous
//                 </button>
//                 <span
//                   className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}
//                 >
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => handlePagination("next")}
//                   disabled={currentPage >= totalPages}
//                   className={`px-4 py-2 rounded-lg transition border font-medium ${
//                     darkMode
//                       ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 disabled:opacity-50"
//                       : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
//                   } disabled:cursor-not-allowed`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       <AddProblemModal onAdd={handleAddProblem} />
//     </div>
//   );
// };

// export default Landing;




import React, { useState, useEffect, useMemo, useCallback } from "react";
import CategoryTabs from "../components/problems/CategoryTabs";
import FilterBar from "../components/problems/FilterBar";
import ProblemsCard from "../components/problems/ProblemsCard";
import EmptyState from "../components/ui/EmptyState";
import AddProblemModal from "../components/problems/AddProblemModal";
import { useTheme } from "../context/themeContext";
import { useUser } from "../context/userContext";
import apiClient from "../utils/apiClient";
import { Loader2 } from "lucide-react";

const Landing = () => {
  const { darkMode } = useTheme();
  const { user } = useUser();

  // App state
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter/sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [solvedFilter, setSolvedFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  
  // 🔥 NEW: Dynamic Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 1. Fetch Problems from Backend
  const fetchProblems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/problems");
      // Read from the newly updated backend format (response.data.problems)
      // Fallback to response.data just in case an old cached response comes back
      const data = response.data.problems ? response.data.problems : response.data;
      setProblems(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching problems:", err);
      setError(err.response?.data?.message || "Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  // 2. Update a single problem locally
  const handleProblemUpdate = (updatedProblem) => {
    if (!updatedProblem) return;
    setProblems((prevProblems) =>
      prevProblems.map((p) => (p._id === updatedProblem._id ? { ...p, solved: updatedProblem.solved } : p))
    );
  };

  // 3. Handle Add Problem
  const handleAddProblem = async (newProblemData) => {
    try {
      await apiClient.post("/problems", newProblemData);
      fetchProblems();
    } catch (err) {
      console.error("Error adding problem:", err);
      alert(err.response?.data?.message || "Failed to add problem");
    }
  };

  // Filter Logic (Bulletproof version)
  const filteredProblems = useMemo(() => {
    const lowerSearch = searchTerm ? searchTerm.toLowerCase() : "";

    return problems.filter((problem) => {
      const questionText = problem.question ? problem.question.toLowerCase() : "";
      
      const matchesSearch =
        !lowerSearch ||
        questionText.includes(lowerSearch) ||
        (problem.tags &&
          problem.tags.some((tag) => {
            const tagName = typeof tag === 'object' ? tag.name : tag;
            return tagName && typeof tagName === 'string' && tagName.toLowerCase().includes(lowerSearch);
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

      return matchesSearch && matchesDifficulty && matchesSolved && matchesCategory;
    });
  }, [problems, searchTerm, difficultyFilter, solvedFilter, activeTab]);

  // 🔥 NEW: Dynamic Pagination Logic
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const currentProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProblems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProblems, currentPage, itemsPerPage]);

  const handlePagination = (direction) => {
    if (direction === "prev" && currentPage > 1) setCurrentPage((prev) => prev - 1);
    if (direction === "next" && currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Reset to page 1 whenever filters OR items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, difficultyFilter, solvedFilter, activeTab, itemsPerPage]);

  return (
    <div className="flex flex-col h-full space-y-6 animate-fadeUp">
      
      {/* Tabs Section */}
      <CategoryTabs activeTab={activeTab} setActiveTab={setActiveTab} problems={problems} />

      {/* Filters Section */}
      <FilterBar
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        difficultyFilter={difficultyFilter} setDifficultyFilter={setDifficultyFilter}
        solvedFilter={solvedFilter} setSolvedFilter={setSolvedFilter}
        onAddClick={() => document.getElementById("add-modal")?.showModal()}
      />

      {error && (
        <div className="p-4 bg-red-100 text-red-600 rounded-xl text-center font-medium shadow-sm">{error}</div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-[500px]">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : filteredProblems.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex flex-col gap-4 w-full">
              {currentProblems.map((problem) => (
                <ProblemsCard
                  key={problem._id}
                  problem={problem}
                  onUpdate={handleProblemUpdate} 
                />
              ))}
            </div>

            {/* 🔥 NEW: Enhanced Pagination Footer */}
            {filteredProblems.length > 0 && (
              <div className={`mt-8 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                
                {/* Items Per Page Selector */}
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
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

                {/* Page Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handlePagination("prev")}
                      disabled={currentPage === 1}
                      className={`px-4 py-1.5 rounded-lg transition border text-sm font-medium ${
                        darkMode
                          ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 disabled:opacity-50"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                      } disabled:cursor-not-allowed`}
                    >
                      Previous
                    </button>
                    <span className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePagination("next")}
                      disabled={currentPage >= totalPages}
                      className={`px-4 py-1.5 rounded-lg transition border text-sm font-medium ${
                        darkMode
                          ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 disabled:opacity-50"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                      } disabled:cursor-not-allowed`}
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

      <AddProblemModal onAdd={handleAddProblem} />
    </div>
  );
};

export default Landing;