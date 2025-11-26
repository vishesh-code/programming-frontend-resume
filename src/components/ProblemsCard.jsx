
import React, { useState } from "react";
import {
  Code,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Target,
} from "lucide-react";
import { useTheme } from "../context/themeContext";

// --- HELPER FUNCTION ---
const getDifficultyColor = (difficulty, darkMode) => {
  if (darkMode) {
    switch (difficulty) {
      case "Easy":
        return { bg: "bg-emerald-900/30", text: "text-emerald-300", border: "border-emerald-700", dot: "bg-emerald-400" };
      case "Medium":
        return { bg: "bg-amber-900/30", text: "text-amber-300", border: "border-amber-700", dot: "bg-amber-400" };
      case "Hard":
        return { bg: "bg-red-900/30", text: "text-red-300", border: "border-red-700", dot: "bg-red-400" };
      default:
        return { bg: "bg-slate-800", text: "text-slate-300", border: "border-slate-600", dot: "bg-slate-400" };
    }
  } else {
    switch (difficulty) {
      case "Easy":
        return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" };
      case "Medium":
        return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" };
      case "Hard":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-400" };
      default:
        return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" };
    }
  }
};

// --- SINGLE CARD COMPONENT (Internal Use) ---
const SingleProblemCard = ({
  problem,
  problemNumber,
  isExpanded,
  onToggleExpanded,
  onToggleSolved,
  copiedId,
  onCopyCode,
  darkMode
}) => {
  // Safety check
  if (!problem) return null;

  const difficultyStyle = getDifficultyColor(problem.difficulty, darkMode);

  return (
    <div className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"} rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group mb-4`}>
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`${darkMode ? "bg-slate-700 text-slate-300" : "bg-blue-100 text-blue-600"} rounded-lg px-3 py-1.5 text-sm font-medium shrink-0`}>
                #{String(problemNumber).padStart(2, "0")}
              </div>
              <h3 className={`text-lg sm:text-xl font-bold truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
                {problem.question}
              </h3>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2 sm:ml-6 self-start sm:self-center">
              <button
                onClick={() => onToggleSolved(problem.id)}
                className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 ${
                  problem.solved
                    ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-800/40"
                    : darkMode
                    ? "bg-slate-700/50 text-slate-400 hover:bg-blue-900/30 hover:text-blue-400 border border-slate-600"
                    : "bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                }`}
                title={problem.solved ? "Mark as incomplete" : "Mark as complete"}
              >
                {problem.solved ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => onToggleExpanded(problem.id)}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium"
              >
                {isExpanded ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="hidden sm:inline">Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Solution</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Description */}
          <p className={`${darkMode ? "text-slate-300" : "text-slate-600"} leading-relaxed text-sm sm:text-base`}>
            {problem.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium border ${difficultyStyle.bg} ${difficultyStyle.text} ${difficultyStyle.border}`}>
              <div className={`w-2 h-2 ${difficultyStyle.dot} rounded-full`}></div>
              <span>{problem.difficulty}</span>
            </div>
            {problem.tags && problem.tags.map((tag, i) => (
               <span key={i} className={`px-3 py-1.5 rounded-full text-sm font-medium border ${darkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                  {tag}
               </span>
            ))}
          </div>

          {/* Complexity */}
          <div className={`flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
             {problem.time_complexity && (
               <div className="flex items-center space-x-1"><Clock className="h-4 w-4" /><span>Time: {problem.time_complexity}</span></div>
             )}
             {problem.space_complexity && (
               <div className="flex items-center space-x-1"><Target className="h-4 w-4" /><span>Space: {problem.space_complexity}</span></div>
             )}
          </div>
        </div>
      </div>

      {/* Expanded Solution */}
      {isExpanded && (
        <div className={`border-t ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-blue-100 bg-blue-50/50"}`}>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h4 className={`text-base sm:text-lg font-semibold flex items-center ${darkMode ? "text-white" : "text-slate-900"}`}>
                <Code className="h-4 w-4 mr-2" /> Solution
              </h4>
              <button
                onClick={() => onCopyCode(problem.solution, problem.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${copiedId === problem.id ? "bg-emerald-100 text-emerald-700" : darkMode ? "bg-slate-700 text-slate-300" : "bg-white text-slate-700 border border-slate-200"}`}
              >
                <Copy className="h-4 w-4" />
                <span>{copiedId === problem.id ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
            <div className="relative">
              <pre className={`p-4 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono border ${darkMode ? "bg-slate-900 text-slate-100 border-slate-700" : "bg-slate-900 text-slate-100 border-slate-800"}`}>
                <code>{problem.solution || "// No solution provided"}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN LIST COMPONENT (Default Export) ---
const ProblemsCard = ({ problems, darkMode }) => {
  // We manage the "View" state (expanded/copied) here because Landing.jsx doesn't provide these handlers
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleToggleExpanded = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSolved = (id) => {
    // NOTE: This only updates the UI locally for now. 
    // To save this to the database, you need to pass a handler from Landing.jsx
    console.log("Toggle solved for ID:", id);
  };

  // If no problems exist in the array, return null (EmptyState in Landing handles the UI)
  if (!problems || problems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {problems.map((problem, index) => (
        <SingleProblemCard
          key={problem.id || problem._id} // Support both ID formats
          problem={problem}
          problemNumber={index + 1}
          isExpanded={expandedId === (problem.id || problem._id)}
          onToggleExpanded={handleToggleExpanded}
          onToggleSolved={handleToggleSolved}
          copiedId={copiedId}
          onCopyCode={handleCopyCode}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default ProblemsCard;