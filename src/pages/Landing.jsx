
// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import Header from "./components/Header";
// import CategoryTabs from "./components/CategoryTabs";
// import FilterBar from "./components/FilterBar";
// import ProblemsCard from "./components/ProblemsCard";
// import EmptyState from "./components/EmptyState";
// import Footer from "./components/Footer";
// import AddProblemModal from "./components/AddProblemModal"; 
// import { useTheme } from "./context/themeContext"; 
// import { useUser } from "./context/userContext";
// import apiClient from "./utils/apiClient"; //

// const ITEMS_PER_PAGE = 6;

// const Landing = () => {
//   const { darkMode } = useTheme();
//   const { user } = useUser(); //

//   // App state
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Filter/sort states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [difficultyFilter, setDifficultyFilter] = useState('All');
//   const [solvedFilter, setSolvedFilter] = useState('All');
//   const [activeTab, setActiveTab] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);

//   // 1. Fetch Problems from Backend
//   const fetchProblems = useCallback(async () => {
//     // Prevent fetching if user is not logged in yet
//     if (!user) return; 

//     setLoading(true);
//     setError(null);

//     try {
//       // Uses the base URL http://localhost:5000/api defined in apiClient
//       const response = await apiClient.get('/problems'); 
      
//       // The API returns `_id`, but ProblemsCard expects `id`. We map it here.
//       const formattedData = response.data.map(problem => ({
//         ...problem,
//         id: problem._id, // Map MongoDB _id to React key id
//         // Normalize category if needed (API returns "Arrays", Tab expects "Array")
//         category: problem.category === "Arrays" ? "Array" : problem.category 
//       }));

//       setProblems(formattedData);
//     } catch (err) {
//       console.error("Error fetching problems:", err);
//       setError("Failed to load problems. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   // Trigger fetch on component mount or when user logs in
//   useEffect(() => {
//     fetchProblems();
//   }, [fetchProblems]);

//   // 2. Add Problem (Send to Backend)
//   const handleAddProblem = async (problemData) => {
//     try {
//       // Send POST request to create new problem
//       const response = await apiClient.post('/problems', problemData);
      
//       // Format the response to match UI state
//       const newProblem = {
//         ...response.data,
//         id: response.data._id
//       };

//       // Update local state immediately (Optimistic update)
//       setProblems(prev => [newProblem, ...prev]);
//       setActiveTab("All");
//       setCurrentPage(1);
//     } catch (err) {
//       console.error("Error adding problem:", err);
//       throw new Error("Failed to save problem to the server.");
//     }
//   };

//   // --- EXISTING FILTERING LOGIC ---
//   const filteredProblems = useMemo(() => {
//     // Filter by Tab (Client-side filtering)
//     let currentTabProblems = problems;
//     if (activeTab !== "All") {
//       currentTabProblems = currentTabProblems.filter(p => p.category === activeTab);
//     }

//     // Filter by Search, Difficulty, Solved
//     return currentTabProblems.filter(problem => {
//       const matchesSearch = problem.question?.toLowerCase().includes(searchTerm.toLowerCase())
//         || (problem.tags && problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
//       const matchesDifficulty = difficultyFilter === "All" || problem.difficulty === difficultyFilter;
      
//       const matchesSolved = solvedFilter === "All" ||
//         (solvedFilter === "Solved" && problem.solved) ||
//         (solvedFilter === "Not Solved" && !problem.solved);
        
//       return matchesSearch && matchesDifficulty && matchesSolved;
//     });
//   }, [problems, activeTab, searchTerm, difficultyFilter, solvedFilter]);

//   const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE) || 1;
//   const paginatedProblems = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredProblems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [filteredProblems, currentPage]);

//   // Statistics for header
//   const stats = useMemo(() => {
//     const total = problems.length;
//     const solved = problems.filter(p => p.solved).length;
//     const easy = problems.filter(p => p.difficulty === "Easy").length;
//     const medium = problems.filter(p => p.difficulty === "Medium").length;
//     const hard = problems.filter(p => p.difficulty === "Hard").length;
//     return {
//       total,
//       solved,
//       easy,
//       medium,
//       hard,
//       percentage: total ? Math.round((solved / total) * 100) : 0,
//     };
//   }, [problems]);

//   const handleTabClick = useCallback((tabId) => {
//     setActiveTab(tabId);
//     setCurrentPage(1);
//   }, []);

//   const handlePagination = (direction) => {
//     setCurrentPage(prev =>
//       direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
//     );
//   };

//   const themeClasses = darkMode ? "dark bg-slate-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

//   return (
//     <div className={`min-h-screen flex flex-col transition-colors duration-300 ${themeClasses}`}>
//       <Header stats={stats} />

//       <div className="max-w-6xl mx-auto px-4 flex items-center justify-end py-2">
//         {/* Pass API handler to Modal */}
//         <AddProblemModal onAdd={handleAddProblem} /> 
//       </div>

//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
//         <CategoryTabs
//           activeTab={activeTab}
//           handleTabClick={handleTabClick}
//           problems={problems}
//           darkMode={darkMode}
//         />
//         <FilterBar
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           difficultyFilter={difficultyFilter}
//           setDifficultyFilter={setDifficultyFilter}
//           solvedFilter={solvedFilter}
//           setSolvedFilter={setSolvedFilter}
//           darkMode={darkMode}
//         />

//         {loading ? (
//           <div className="flex justify-center py-16">
//             <span className={darkMode ? "text-white" : "text-slate-800"}>Loading problems...</span>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center py-16">
//             <span className="text-red-500 font-semibold">{error}</span>
//           </div>
//         ) : (
//           <>
//             {paginatedProblems.length
//               ? <ProblemsCard problems={paginatedProblems} darkMode={darkMode} />
//               : <EmptyState
//                   darkMode={darkMode}
//                   resetFilters={() => {
//                     setSearchTerm('');
//                     setDifficultyFilter('All');
//                     setSolvedFilter('All');
//                     setActiveTab('All'); // Added reset for tab as well
//                   }}
//                 />
//             }
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center space-x-4 mt-8">
//                 <button
//                   onClick={() => handlePagination("prev")}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded-lg transition border ${
//                     darkMode
//                       ? "bg-slate-700 text-slate-300 border-slate-600 disabled:bg-slate-800 disabled:text-slate-500"
//                       : "bg-white text-slate-700 border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                   } disabled:cursor-not-allowed`}
//                 >
//                   Previous
//                 </button>
//                 <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => handlePagination("next")}
//                   disabled={currentPage >= totalPages}
//                   className={`px-4 py-2 rounded-lg transition border ${
//                     darkMode
//                       ? "bg-slate-700 text-slate-300 border-slate-600 disabled:bg-slate-800 disabled:text-slate-500"
//                       : "bg-white text-slate-700 border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                   } disabled:cursor-not-allowed`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <Footer darkMode={darkMode} />
//     </div>
//   );
// };

// export default Landing;





// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import Header from "./components/Header";
// import CategoryTabs from "./components/CategoryTabs";
// import FilterBar from "./components/FilterBar";
// import ProblemsCard from "./components/ProblemsCard";
// import EmptyState from "./components/EmptyState";
// import Footer from "./components/Footer";
// import AddProblemModal from "./components/AddProblemModal"; 
// import { useTheme } from "./context/themeContext"; 
// import { useUser } from "./context/userContext";
// import apiClient from "./utils/apiClient";

// const ITEMS_PER_PAGE = 6;

// const Landing = () => {
//   const { darkMode } = useTheme();
//   const { user } = useUser();

//   // App state
//   const [problems, setProblems] = useState([]);

//   console.log("problmes",problems)
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Filter/sort states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [difficultyFilter, setDifficultyFilter] = useState('All');
//   const [solvedFilter, setSolvedFilter] = useState('All');
//   const [activeTab, setActiveTab] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);

//   // 1. Fetch Problems from Backend
//   const fetchProblems = useCallback(async () => {
//     // Prevent fetching if user is not logged in yet
//     if (!user) return; 

//     setLoading(true);
//     setError(null);

//     try {
//       // Uses the base URL http://localhost:5000/api defined in apiClient
//       const response = await apiClient.get('/problems'); 
      
//       // The API returns `_id`, but ProblemsCard expects `id`. We map it here.
//       const formattedData = response.data.map(problem => ({
//         ...problem,
//         id: problem._id, // Map MongoDB _id to React key id
//         // Normalize category if needed (API returns "Arrays", Tab expects "Array")
//         category: problem.category === "Arrays" ? "Array" : problem.category 
//       }));

//       setProblems(formattedData);
//     } catch (err) {
//       console.error("Error fetching problems:", err);
//       setError("Failed to load problems. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   // Trigger fetch on component mount or when user logs in
//   useEffect(() => {
//     fetchProblems();
//   }, [fetchProblems]);

//   // 2. Add Problem (Send to Backend)
//   const handleAddProblem = async (problemData) => {
//     try {
//       // Send POST request to create new problem
//       const response = await apiClient.post('/problems', problemData);
      
//       // Format the response to match UI state
//       const newProblem = {
//         ...response.data,
//         id: response.data._id
//       };

//       // Update local state immediately (Optimistic update)
//       setProblems(prev => [newProblem, ...prev]);
//       setActiveTab("All");
//       setCurrentPage(1);
//     } catch (err) {
//       console.error("Error adding problem:", err);
//       throw new Error("Failed to save problem to the server.");
//     }
//   };

//   // --- FILTERING LOGIC ---
//   const filteredProblems = useMemo(() => {
//     // Filter by Tab (Client-side filtering)
//     let currentTabProblems = problems;
//     if (activeTab !== "All") {
//       currentTabProblems = currentTabProblems.filter(p => p.category === activeTab);
//     }

//     // Filter by Search, Difficulty, Solved
//     return currentTabProblems.filter(problem => {
//       const matchesSearch = problem.question?.toLowerCase().includes(searchTerm.toLowerCase())
//         || (problem.tags && problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
//       const matchesDifficulty = difficultyFilter === "All" || problem.difficulty === difficultyFilter;
      
//       const matchesSolved = solvedFilter === "All" ||
//         (solvedFilter === "Solved" && problem.solved) ||
//         (solvedFilter === "Not Solved" && !problem.solved);
        
//       return matchesSearch && matchesDifficulty && matchesSolved;
//     });
//   }, [problems, activeTab, searchTerm, difficultyFilter, solvedFilter]);
  
//   // --- NEW: Check for active filters ---
//   const hasActiveFilters = useMemo(() => {
//     // Check if any filter state is not the default value
//     return searchTerm !== '' 
//       || difficultyFilter !== 'All' 
//       || solvedFilter !== 'All' 
//       || activeTab !== 'All';
//   }, [searchTerm, difficultyFilter, solvedFilter, activeTab]);
//   // ----------------------------------

//   const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE) || 1;
//   const paginatedProblems = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredProblems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [filteredProblems, currentPage]);

//   // Statistics for header
//   const stats = useMemo(() => {
//     const total = problems.length;
//     const solved = problems.filter(p => p.solved).length;
//     const easy = problems.filter(p => p.difficulty === "Easy").length;
//     const medium = problems.filter(p => p.difficulty === "Medium").length;
//     const hard = problems.filter(p => p.difficulty === "Hard").length;
//     return {
//       total,
//       solved,
//       easy,
//       medium,
//       hard,
//       percentage: total ? Math.round((solved / total) * 100) : 0,
//     };
//   }, [problems]);

//   const handleTabClick = useCallback((tabId) => {
//     setActiveTab(tabId);
//     setCurrentPage(1);
//   }, []);

//   const handlePagination = (direction) => {
//     setCurrentPage(prev =>
//       direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
//     );
//   };

//   const themeClasses = darkMode ? "dark bg-slate-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

//   return (
//     <div className={`min-h-screen flex flex-col transition-colors duration-300 ${themeClasses}`}>
//       <Header stats={stats} />

//       <div className="max-w-6xl mx-auto px-4 flex items-center justify-end py-2">
//         {/* Pass API handler to Modal */}
//         <AddProblemModal onAdd={handleAddProblem} /> 
//       </div>

//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
//         <CategoryTabs
//           activeTab={activeTab}
//           handleTabClick={handleTabClick}
//           problems={problems}
//           darkMode={darkMode}
//         />
//         <FilterBar
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           difficultyFilter={difficultyFilter}
//           setDifficultyFilter={setDifficultyFilter}
//           solvedFilter={solvedFilter}
//           setSolvedFilter={setSolvedFilter}
//           darkMode={darkMode}
//         />

//         {loading ? (
//           <div className="flex justify-center py-16">
//             <span className={darkMode ? "text-white" : "text-slate-800"}>Loading problems...</span>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center py-16">
//             <span className="text-red-500 font-semibold">{error}</span>
//           </div>
//         ) : (
//           <>
//             {paginatedProblems.length
//               ? <ProblemsCard problems={paginatedProblems} darkMode={darkMode} />
//               : <EmptyState
//                   darkMode={darkMode}
//                   // ADDED: Check if the original list of problems is empty (no data from API)
//                   isInitialEmpty={problems.length === 0}
//                   // ADDED: Check if any filter is active (no results due to filter)
//                   hasActiveFilters={hasActiveFilters}
//                   resetFilters={() => {
//                     setSearchTerm('');
//                     setDifficultyFilter('All');
//                     setSolvedFilter('All');
//                     setActiveTab('All');
//                   }}
//                 />
//             }
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center space-x-4 mt-8">
//                 <button
//                   onClick={() => handlePagination("prev")}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded-lg transition border ${
//                     darkMode
//                       ? "bg-slate-700 text-slate-300 border-slate-600 disabled:bg-slate-800 disabled:text-slate-500"
//                       : "bg-white text-slate-700 border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                   } disabled:cursor-not-allowed`}
//                 >
//                   Previous
//                 </button>
//                 <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => handlePagination("next")}
//                   disabled={currentPage >= totalPages}
//                   className={`px-4 py-2 rounded-lg transition border ${
//                     darkMode
//                       ? "bg-slate-700 text-slate-300 border-slate-600 disabled:bg-slate-800 disabled:text-slate-500"
//                       : "bg-white text-slate-700 border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                   } disabled:cursor-not-allowed`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <Footer darkMode={darkMode} />
//     </div>
//   );
// };

// export default Landing;





// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import Header from "./components/Header";
// import CategoryTabs from "./components/CategoryTabs";
// import FilterBar from "./components/FilterBar";
// import ProblemsCard from "./components/ProblemsCard";
// import EmptyState from "./components/EmptyState";
// import Footer from "./components/Footer";
// import AddProblemModal from "./components/AddProblemModal"; 
// import { useTheme } from "../context/themeContext"; 
// import { useUser } from "../context/userContext";
// import apiClient from "../utils/apiClient";

// const ITEMS_PER_PAGE = 6;

// const Landing = () => {
//   const { darkMode } = useTheme();
//   const { user } = useUser();

//   // App state
//   const [problems, setProblems] = useState([]);

//   console.log("prblemmm",problems)
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Filter/sort states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [difficultyFilter, setDifficultyFilter] = useState('All');
//   const [solvedFilter, setSolvedFilter] = useState('All');
//   const [activeTab, setActiveTab] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);

//   // 1. Fetch Problems from Backend
//   const fetchProblems = useCallback(async () => {
//     // Prevent fetching if user is not logged in yet
//     if (!user) return; 

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await apiClient.get('/problems'); 
      
//       const formattedData = response.data.map(problem => {
//         // Normalize category: handle "Arrays" to "Array" AND ensure no empty string
//         const normalizedCategory = (problem.category === "Arrays" ? "Array" : problem.category) || 'Uncategorized';
        
//         return {
//           ...problem,
//           id: problem._id, // Map MongoDB _id to React key id
//           // FIX: Ensure category is not an empty string for filtering/display stability
//           category: normalizedCategory,
//         };
//       });

//       setProblems(formattedData);
//     } catch (err) {
//       console.error("Error fetching problems:", err);
//       setError("Failed to load problems. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   }, [user]);

//   // Trigger fetch on component mount or when user logs in
//   useEffect(() => {
//     fetchProblems();
//   }, [fetchProblems]);

//   // 2. Add Problem (Send to Backend)
//   const handleAddProblem = async (problemData) => {
//     try {
//       // Send POST request to create new problem
//       const response = await apiClient.post('/problems', problemData);
      
//       // Format the response to match UI state and ensure data integrity
//       const newProblem = {
//         ...response.data,
//         id: response.data._id,
//         // FIX: Ensure category is normalized even on new creation
//         category: response.data.category || 'Uncategorized'
//       };

//       // Update local state immediately (Optimistic update)
//       setProblems(prev => [newProblem, ...prev]);
//       setActiveTab("All");
//       setCurrentPage(1);
//     } catch (err) {
//       console.error("Error adding problem:", err);
//       throw new Error("Failed to save problem to the server.");
//     }
//   };

//   // --- FILTERING LOGIC ---
//   const filteredProblems = useMemo(() => {
//     // Filter by Tab (Client-side filtering)
//     let currentTabProblems = problems;
//     if (activeTab !== "All") {
//       currentTabProblems = currentTabProblems.filter(p => p.category === activeTab);
//     }

//     // Filter by Search, Difficulty, Solved
//     return currentTabProblems.filter(problem => {
//       const matchesSearch = problem.question?.toLowerCase().includes(searchTerm.toLowerCase())
//         || (problem.tags && problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
//       const matchesDifficulty = difficultyFilter === "All" || problem.difficulty === difficultyFilter;
      
//       const matchesSolved = solvedFilter === "All" ||
//         (solvedFilter === "Solved" && problem.solved) ||
//         (solvedFilter === "Not Solved" && !problem.solved);
        
//       return matchesSearch && matchesDifficulty && matchesSolved;
//     });
//   }, [problems, activeTab, searchTerm, difficultyFilter, solvedFilter]);

//   // --- Check for active filters (for EmptyState logic) ---
//   const hasActiveFilters = useMemo(() => {
//     return searchTerm !== '' 
//       || difficultyFilter !== 'All' 
//       || solvedFilter !== 'All' 
//       || activeTab !== 'All';
//   }, [searchTerm, difficultyFilter, solvedFilter, activeTab]);
//   // ----------------------------------
  
//   const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE) || 1;
//   const paginatedProblems = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredProblems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [filteredProblems, currentPage]);

//   // Statistics for header
//   const stats = useMemo(() => {
//     const total = problems.length;
//     const solved = problems.filter(p => p.solved).length;
//     const easy = problems.filter(p => p.difficulty === "Easy").length;
//     const medium = problems.filter(p => p.difficulty === "Medium").length;
//     const hard = problems.filter(p => p.difficulty === "Hard").length;
//     return {
//       total,
//       solved,
//       easy,
//       medium,
//       hard,
//       percentage: total ? Math.round((solved / total) * 100) : 0,
//     };
//   }, [problems]);

//   const handleTabClick = useCallback((tabId) => {
//     setActiveTab(tabId);
//     setCurrentPage(1);
//   }, []);

//   const handlePagination = (direction) => {
//     setCurrentPage(prev =>
//       direction === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
//     );
//   };

//   const themeClasses = darkMode ? "dark bg-slate-900" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

//   return (
//     <div className={`min-h-screen flex flex-col transition-colors duration-300 ${themeClasses}`}>
//       <Header stats={stats} />

//       <div className="max-w-6xl mx-auto px-4 flex items-center justify-end py-2">
//         {/* Pass API handler to Modal */}
//         <AddProblemModal onAdd={handleAddProblem} /> 
//       </div>

//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
//         <CategoryTabs
//           activeTab={activeTab}
//           handleTabClick={handleTabClick}
//           problems={problems}
//           darkMode={darkMode}
//         />
//         <FilterBar
//           searchTerm={searchTerm}
//           setSearchTerm={setSearchTerm}
//           difficultyFilter={difficultyFilter}
//           setDifficultyFilter={setDifficultyFilter}
//           solvedFilter={solvedFilter}
//           setSolvedFilter={setSolvedFilter}
//           darkMode={darkMode}
//         />

//         {loading ? (
//           <div className="flex justify-center py-16">
//             <span className={darkMode ? "text-white" : "text-slate-800"}>Loading problems...</span>
//           </div>
//         ) : error ? (
//           <div className="flex justify-center py-16">
//             <span className="text-red-500 font-semibold">{error}</span>
//           </div>
//         ) : (
//           <>
//             {/* RENDER PROBLEMS CARD OR EMPTY STATE */}
//             {paginatedProblems.length
//               ? <ProblemsCard problems={paginatedProblems} darkMode={darkMode} />
//               : <EmptyState
//                   darkMode={darkMode}
//                   // ADDED PROP: Check if the original problems array is completely empty
//                   isInitialEmpty={problems.length === 0}
//                   // ADDED PROP: Check if the lack of results is due to an active filter
//                   hasActiveFilters={hasActiveFilters}
//                   resetFilters={() => {
//                     setSearchTerm('');
//                     setDifficultyFilter('All');
//                     setSolvedFilter('All');
//                     setActiveTab('All');
//                   }}
//                 />
//             }
//             {/* PAGINATION */}
//             {totalPages > 1 && paginatedProblems.length > 0 && (
//               <div className="flex justify-center items-center space-x-4 mt-8">
//                 <button
//                   onClick={() => handlePagination("prev")}
//                   disabled={currentPage === 1}
//                   className={`px-4 py-2 rounded-lg transition border ${
//                     darkMode
//                       ? "bg-slate-700 text-slate-300 border-slate-600 disabled:bg-slate-800 disabled:text-slate-500"
//                       : "bg-white text-slate-700 border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                   } disabled:cursor-not-allowed`}
//                 >
//                   Previous
//                 </button>
//                 <span className={darkMode ? "text-slate-400" : "text-slate-600"}>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => handlePagination("next")}
//                   disabled={currentPage >= totalPages}
//                   className={`px-4 py-2 rounded-lg transition border ${
//                     darkMode
//                       ? "bg-slate-700 text-slate-300 border-slate-600 disabled:bg-slate-800 disabled:text-slate-500"
//                       : "bg-white text-slate-700 border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                   } disabled:cursor-not-allowed`}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       <Footer darkMode={darkMode} />
//     </div>
//   );
// };

// export default Landing;




import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "../components/layout/Header";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import CategoryTabs from "../components/problems/CategoryTabs";
import FilterBar from "../components/problems/FilterBar";
import ProblemsCard from "../components/problems/ProblemsCard";
import EmptyState from "../components/ui/EmptyState";
import AddProblemModal from "../components/problems/AddProblemModal"; 
import { useTheme } from "../context/themeContext"; 
import { useUser } from "../context/userContext";
import apiClient from "../utils/apiClient";

const ITEMS_PER_PAGE = 6;

const Landing = () => {
  const { darkMode } = useTheme();
  const { user } = useUser();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // States remain the same...
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [solvedFilter, setSolvedFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProblems = useCallback(async () => {
    if (!user) return; 
    setLoading(true);
    try {
      const response = await apiClient.get('/problems'); 
      const formattedData = response.data.map(problem => ({
        ...problem,
        id: problem._id,
        category: (problem.category === "Arrays" ? "Array" : problem.category) || 'Uncategorized',
      }));
      setProblems(formattedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchProblems(); }, [fetchProblems]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = problems.length;
    const solved = problems.filter(p => p.solved).length;
    return {
      total, solved,
      easy: problems.filter(p => p.difficulty === "Easy").length,
      medium: problems.filter(p => p.difficulty === "Medium").length,
      hard: problems.filter(p => p.difficulty === "Hard").length,
      percentage: total ? Math.round((solved / total) * 100) : 0,
    };
  }, [problems]);

  // Filtering Logic (Omitted for brevity, keep your existing logic here)
  const paginatedProblems = problems; // Replace with your existing useMemo slice

  // return (
  //   <div className="min-h-screen flex flex-col">
  //     <Header stats={stats} />

  //     {/* Main 3-Column Layout Container */}
  //     <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
  //       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
  //         {/* LEFT COLUMN: Navigation Sidebar */}
  //         <div className="hidden lg:block lg:col-span-1">
  //           <LeftSidebar />
  //         </div>

  //         {/* MIDDLE COLUMN: Main Content */}
  //         <div className="lg:col-span-2 space-y-6">
  //           <div className="flex items-center justify-between">
  //             <h2 className="heading-lg">Practice Problems</h2>
  //             <AddProblemModal onAdd={() => {}} /> 
  //           </div>
            
  //           <CategoryTabs activeTab={activeTab} handleTabClick={setActiveTab} problems={problems} />
  //           <FilterBar 
  //             searchTerm={searchTerm} setSearchTerm={setSearchTerm}
  //             difficultyFilter={difficultyFilter} setDifficultyFilter={setDifficultyFilter}
  //           />

  //           {loading ? (
  //             <div className="text-center py-10 text-muted">Loading problems...</div>
  //           ) : (
  //             <ProblemsCard problems={paginatedProblems} darkMode={darkMode} />
  //           )}
  //         </div>

  //         {/* RIGHT COLUMN: Stats & Goals */}
  //         <div className="hidden lg:block lg:col-span-1">
  //           <RightSidebar stats={stats} />
  //         </div>

  //       </div>
  //     </main>
  //   </div>
  // );


  // Inside Landing.jsx return statement:

return (
  <div className="min-h-screen flex flex-col">
    <Header stats={stats} />

    {/* Expanded Max-Width Container */}
    <main className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
      
      {/* Custom Grid Layout: 
        Left Sidebar: 240px 
        Middle Content: 1fr (takes all remaining space)
        Right Sidebar: 300px 
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_300px] gap-6 xl:gap-8">
        
        {/* LEFT COLUMN: Navigation Sidebar */}
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {/* MIDDLE COLUMN: Main Content */}
        {/* min-w-0 is crucial here to prevent the center column from overflowing the grid if child elements get too wide */}
        <div className="min-w-0 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="heading-lg">Practice Problems</h2>
            <AddProblemModal onAdd={() => {}} /> 
          </div>
          
          <CategoryTabs activeTab={activeTab} handleTabClick={setActiveTab} problems={problems} />
          <FilterBar 
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            difficultyFilter={difficultyFilter} setDifficultyFilter={setDifficultyFilter}
          />

          {loading ? (
            <div className="text-center py-10 text-muted">Loading problems...</div>
          ) : (
            <ProblemsCard problems={paginatedProblems} darkMode={darkMode} />
          )}
        </div>

        {/* RIGHT COLUMN: Stats & Goals */}
        <div className="hidden lg:block">
          <RightSidebar stats={stats} />
        </div>

      </div>
    </main>
  </div>
);
};

export default Landing;