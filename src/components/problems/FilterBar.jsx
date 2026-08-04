// import React from "react";
// import { Search } from "lucide-react";

// const FilterBar = ({
//   searchTerm,
//   setSearchTerm,
//   difficultyFilter,
//   setDifficultyFilter,
//   solvedFilter,
//   setSolvedFilter,
//   darkMode,
// }) => (
//   <div
//     className={`${
//       darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"
//     } rounded-2xl p-4 border shadow-sm mb-6 transition-colors`}
//   >
//     <div className="space-y-4">
//       <div className="relative">
//         <Search
//           className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
//             darkMode ? "text-slate-400" : "text-slate-400"
//           }`}
//         />
//         <input
//           type="text"
//           placeholder="Search problems, tags, or keywords..."
//           className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
//             darkMode
//               ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600"
//               : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white"
//           }`}
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//         />
//       </div>
//       <div className="flex flex-col sm:flex-row gap-3">
//         <select
//           className={`border rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm flex-1 ${
//             darkMode
//               ? "bg-slate-700 border-slate-600 text-slate-200 focus:bg-slate-600"
//               : "bg-slate-50 border-slate-200 text-slate-700 focus:bg-white"
//           }`}
//           value={difficultyFilter}
//           onChange={e => setDifficultyFilter(e.target.value)}
//         >
//           <option value="All">All Levels</option>
//           <option value="Easy">Easy</option>
//           <option value="Medium">Medium</option>
//           <option value="Hard">Hard</option>
//         </select>
//         <select
//           className={`border rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm flex-1 ${
//             darkMode
//               ? "bg-slate-700 border-slate-600 text-slate-200 focus:bg-slate-600"
//               : "bg-slate-50 border-slate-200 text-slate-700 focus:bg-white"
//           }`}
//           value={solvedFilter}
//           onChange={e => setSolvedFilter(e.target.value)}
//         >
//           <option value="All">All Status</option>
//           <option value="Solved">Completed</option>
//           <option value="Not Solved">Todo</option>
//         </select>
//       </div>
//     </div>
//   </div>
// );

// export default FilterBar;


// import React, { useState, useRef, useEffect } from "react";
// import { Search, ChevronDown, Check, Tags, X } from "lucide-react";
// import { useTheme } from "../../context/themeContext";

// const FilterBar = ({
//   searchTerm,
//   setSearchTerm,
//   difficultyFilter,
//   setDifficultyFilter,
//   solvedFilter,
//   setSolvedFilter,
//   activeTab,
//   allTags = [],
//   selectedTags = [],
//   setSelectedTags,
//   onAddClick 
// }) => {
//   const { darkMode } = useTheme();
//   const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Close custom dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsTagDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter available tags dynamically based on the selected Category Tab
//   const availableTags = activeTab === "All"
//     ? allTags
//     : allTags.filter((tag) => tag.category && tag.category.name === activeTab);

//   const toggleTag = (tagId) => {
//     setSelectedTags((prev) =>
//       prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
//     );
//   };

//   return (
//     <div className={`rounded-2xl p-4 border shadow-sm mb-6 transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"}`}>
      
//       <div className="space-y-4">
//         {/* Top Row: Search and Add Button */}
//         <div className="flex gap-3">
//           <div className="relative flex-1">
//             <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? "text-slate-400" : "text-slate-400"}`} />
//             <input
//               type="text"
//               placeholder="Search problems, tags, or keywords..."
//               className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:bg-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white"}`}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           {onAddClick && (
//              <button 
//                onClick={onAddClick}
//                className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition-all font-medium text-sm shrink-0"
//              >
//                + Add Problem
//              </button>
//           )}
//         </div>

//         {/* Bottom Row: Filters */}
//         <div className="flex flex-col sm:flex-row gap-3">
          
//           {/* Difficulty Filter (Shrunk width) */}
//           <select
//             className={`w-full sm:w-36 shrink-0 border rounded-xl px-4 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer ${darkMode ? "bg-slate-900 border-slate-700 text-slate-200 focus:bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-700 focus:bg-white"}`}
//             value={difficultyFilter}
//             onChange={(e) => setDifficultyFilter(e.target.value)}
//           >
//             <option value="All">All Levels</option>
//             <option value="Easy">Easy</option>
//             <option value="Medium">Medium</option>
//             <option value="Hard">Hard</option>
//           </select>

//           {/* Status Filter (Shrunk width) */}
//           <select
//             className={`w-full sm:w-36 shrink-0 border rounded-xl px-4 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer ${darkMode ? "bg-slate-900 border-slate-700 text-slate-200 focus:bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-700 focus:bg-white"}`}
//             value={solvedFilter}
//             onChange={(e) => setSolvedFilter(e.target.value)}
//           >
//             <option value="All">All Status</option>
//             <option value="Solved">Completed</option>
//             <option value="Unsolved">Todo</option> 
//           </select>

//           {/* Dynamic Multi-Select Tag Box (Takes remaining space) */}
//           <div className="relative flex-1 min-w-[200px]" ref={dropdownRef}>
//             <div
//               onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
//               className={`w-full min-h-[44px] flex items-center flex-wrap gap-2 px-3 py-2 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all text-sm cursor-pointer ${darkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}
//             >
//               <Tags className={`w-4 h-4 shrink-0 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
              
//               {/* Display Selected Tags as Chips */}
//               {selectedTags.length === 0 ? (
//                 <span className={`text-sm truncate ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
//                   {activeTab === "All" ? "Filter by Tags..." : `Tags for ${activeTab}...`}
//                 </span>
//               ) : (
//                 selectedTags.map((tagId) => {
//                   // Find the full tag object to get the name[cite: 16]
//                   const tag = allTags.find((t) => t._id === tagId);
//                   if (!tag) return null;
                  
//                   return (
//                     <span 
//                       key={tagId} 
//                       className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide border ${darkMode ? "bg-blue-900/40 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200"}`}
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent opening the dropdown when clicking the 'X'
//                         toggleTag(tagId);
//                       }}
//                     >
//                       {tag.name}
//                       <X className="w-3 h-3 hover:text-red-500 transition-colors cursor-pointer" />
//                     </span>
//                   );
//                 })
//               )}

//               <ChevronDown className={`w-4 h-4 shrink-0 ml-auto transition-transform ${darkMode ? "text-slate-500" : "text-slate-400"} ${isTagDropdownOpen ? "rotate-180" : ""}`} />
//             </div>

//             {/* The actual dropdown menu list */}
//             {isTagDropdownOpen && (
//               <div className={`absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-xl border shadow-xl max-h-60 overflow-y-auto animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
//                 {availableTags.length === 0 ? (
//                   <div className={`p-3 text-center text-xs italic ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
//                     No tags mapped to {activeTab}.
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-1">
//                     {availableTags.map((tag) => {
//                       const isSelected = selectedTags.includes(tag._id);
//                       return (
//                         <button
//                           key={tag._id}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleTag(tag._id);
//                           }}
//                           className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors ${isSelected ? (darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600 font-medium") : (darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100")}`}
//                         >
//                           {tag.name}
//                           {isSelected && <Check className="w-4 h-4" />}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default FilterBar;








import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Tags, X, RotateCcw } from "lucide-react";
import { useTheme } from "../../context/themeContext";

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  difficultyFilter,
  setDifficultyFilter,
  solvedFilter,
  setSolvedFilter,
  activeTab,
  allTags = [],
  selectedTags = [],
  setSelectedTags,
  onResetFilters,      // NEW: Function to clear all filters
  addProblemComponent  // NEW: Receives the Modal component directly
}) => {
  const { darkMode } = useTheme();
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTagDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter available tags dynamically based on the selected Category Tab
  const availableTags = activeTab === "All"
    ? allTags
    : allTags.filter((tag) => tag.category && tag.category.name === activeTab);

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // Check if any filters are currently active to show the Reset button
  const hasActiveFilters = searchTerm !== "" || difficultyFilter !== "All" || solvedFilter !== "All" || selectedTags.length > 0;

  return (
    <div className={`rounded-2xl p-4 border shadow-sm mb-6 transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"}`}>
      
      <div className="space-y-4">
        {/* Top Row: Search and Add Modal Trigger */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? "text-slate-400" : "text-slate-400"}`} />
            <input
              type="text"
              placeholder="Search problems, tags, or keywords..."
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:bg-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* This renders the actual AddProblemModal button exactly where we want it */}
          {addProblemComponent && (
             <div className="hidden sm:block shrink-0">
               {addProblemComponent}
             </div>
          )}
        </div>

        {/* Bottom Row: Filters & Reset Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          
          <select
            className={`w-full sm:w-36 shrink-0 border rounded-xl px-4 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer ${darkMode ? "bg-slate-900 border-slate-700 text-slate-200 focus:bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-700 focus:bg-white"}`}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            className={`w-full sm:w-36 shrink-0 border rounded-xl px-4 py-2.5 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer ${darkMode ? "bg-slate-900 border-slate-700 text-slate-200 focus:bg-slate-800" : "bg-slate-50 border-slate-200 text-slate-700 focus:bg-white"}`}
            value={solvedFilter}
            onChange={(e) => setSolvedFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Solved">Completed</option>
            <option value="Unsolved">Todo</option> 
          </select>

          {/* Dynamic Multi-Select Tag Box */}
          <div className="relative flex-1 min-w-[200px]" ref={dropdownRef}>
            <div
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
              className={`w-full min-h-[44px] flex items-center flex-wrap gap-2 px-3 py-2 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all text-sm cursor-pointer ${darkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}
            >
              <Tags className={`w-4 h-4 shrink-0 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
              
              {selectedTags.length === 0 ? (
                <span className={`text-sm truncate ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                  {activeTab === "All" ? "Filter by Tags..." : `Tags for ${activeTab}...`}
                </span>
              ) : (
                selectedTags.map((tagId) => {
                  const tag = allTags.find((t) => t._id === tagId);
                  if (!tag) return null;
                  
                  return (
                    <span 
                      key={tagId} 
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide border ${darkMode ? "bg-blue-900/40 text-blue-300 border-blue-800" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                      onClick={(e) => {
                        e.stopPropagation(); 
                        toggleTag(tagId);
                      }}
                    >
                      {tag.name}
                      <X className="w-3 h-3 hover:text-red-500 transition-colors cursor-pointer" />
                    </span>
                  );
                })
              )}
              <ChevronDown className={`w-4 h-4 shrink-0 ml-auto transition-transform ${darkMode ? "text-slate-500" : "text-slate-400"} ${isTagDropdownOpen ? "rotate-180" : ""}`} />
            </div>

            {isTagDropdownOpen && (
              <div className={`absolute top-full left-0 right-0 mt-2 z-50 p-2 rounded-xl border shadow-xl max-h-60 overflow-y-auto animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                {availableTags.length === 0 ? (
                  <div className={`p-3 text-center text-xs italic ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                    No tags mapped to {activeTab}.
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {availableTags.map((tag) => {
                      const isSelected = selectedTags.includes(tag._id);
                      return (
                        <button
                          key={tag._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTag(tag._id);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors ${isSelected ? (darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600 font-medium") : (darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100")}`}
                        >
                          {tag.name}
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border text-sm font-medium transition-all shrink-0 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
              title="Clear all filters"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="sm:hidden lg:inline">Reset</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default FilterBar;