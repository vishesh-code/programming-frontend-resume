


import React, { useState } from "react";
import { Code, CheckCircle, Clock, Eye, EyeOff, Copy, Target, Loader2 } from "lucide-react";
import { useTheme } from "../../context/themeContext";
import apiClient from "../../utils/apiClient"; 

const getDifficultyColor = (difficulty, darkMode) => {
  if (darkMode) {
    switch (difficulty) {
      case "Easy": return { bg: "bg-emerald-900/30", text: "text-emerald-300", border: "border-emerald-700", dot: "bg-emerald-400" };
      case "Medium": return { bg: "bg-amber-900/30", text: "text-amber-300", border: "border-amber-700", dot: "bg-amber-400" };
      case "Hard": return { bg: "bg-red-900/30", text: "text-red-300", border: "border-red-700", dot: "bg-red-400" };
      default: return { bg: "bg-slate-800", text: "text-slate-300", border: "border-slate-600", dot: "bg-slate-400" };
    }
  } else {
    switch (difficulty) {
      case "Easy": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" };
      case "Medium": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" };
      case "Hard": return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-400" };
      default: return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-400" };
    }
  }
};

const ProblemsCard = ({ problem, onUpdate }) => {
  const { darkMode } = useTheme();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false); 

  if (!problem) return null;

  const difficultyStyle = getDifficultyColor(problem.difficulty, darkMode);

  const handleCopyCode = () => {
    if (!problem.solution) return;
    navigator.clipboard.writeText(problem.solution);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleSolved = async () => {
    try {
      setIsToggling(true); 
      const response = await apiClient.patch(`/problems/${problem._id}/toggle-solved`);
      if (onUpdate) {
        onUpdate({ _id: problem._id, solved: response.data.solved }); 
      }
    } catch (error) {
      console.error("Failed to toggle solved status", error);
    } finally {
      setIsToggling(false); 
    }
  };

  return (
    <div className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"} rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group w-full`}>
      <div className="p-3 sm:p-4">
        <div className="space-y-3">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            
            {/* Title & Difficulty Tag (Moved Here) */}
            <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
              <h3 className={`text-base sm:text-lg font-bold truncate w-full ${darkMode ? "text-white" : "text-slate-900"}`}>
                {problem.question}
              </h3>
              <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border w-max ${difficultyStyle.bg} ${difficultyStyle.text} ${difficultyStyle.border}`}>
                <div className={`w-1.5 h-1.5 ${difficultyStyle.dot} rounded-full`}></div>
                <span>{problem.difficulty}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2 sm:ml-4 shrink-0">
              <button
                onClick={handleToggleSolved}
                disabled={isToggling}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isToggling ? "opacity-70 cursor-not-allowed" : ""
                } ${
                  problem.solved
                    ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                    : darkMode
                    ? "bg-slate-700/50 text-slate-400 hover:bg-blue-900/30 hover:text-blue-400 border border-slate-600"
                    : "bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                }`}
                title={problem.solved ? "Mark as incomplete" : "Mark as complete"}
              >
                {isToggling ? <Loader2 className="h-4 w-4 animate-spin" /> : problem.solved ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </button>
              
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-xs font-medium"
              >
                {isExpanded ? (
                  <><EyeOff className="h-3.5 w-3.5" /><span className="hidden sm:inline">Hide</span></>
                ) : (
                  <><Eye className="h-3.5 w-3.5" /><span className="hidden sm:inline">Solution</span></>
                )}
              </button>
            </div>
          </div>
          
          {/* Description */}
          <p className={`${darkMode ? "text-slate-400" : "text-slate-600"} text-sm leading-snug line-clamp-2`}>
            {problem.description}
          </p>
          
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Tags Group (Difficulty removed from here) */}
            <div className="flex flex-wrap gap-2">
              {problem.category && problem.category.name && (
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${darkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                  {problem.category.name}
                </span>
              )}
              {problem.tags && problem.tags.map((tag, i) => (
                 <span key={i} className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${darkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                    {tag.name || tag}
                 </span>
              ))}
            </div>

            {/* Complexity Group */}
            <div className={`flex items-center space-x-4 text-xs font-mono ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
               {problem.time_complexity && (
                 <div className="flex items-center space-x-1"><Clock className="h-3 w-3" /><span>{problem.time_complexity}</span></div>
               )}
               {problem.space_complexity && (
                 <div className="flex items-center space-x-1"><Target className="h-3 w-3" /><span>{problem.space_complexity}</span></div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Solution */}
      {isExpanded && (
        <div className={`border-t ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-blue-100 bg-blue-50/50"}`}>
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h4 className={`text-sm font-semibold flex items-center ${darkMode ? "text-white" : "text-slate-900"}`}>
                <Code className="h-4 w-4 mr-2" /> Solution
              </h4>
              <button
                onClick={handleCopyCode}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${isCopied ? "bg-emerald-100 text-emerald-700" : darkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"}`}
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{isCopied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
            <pre className={`p-3 rounded-xl overflow-x-auto text-xs font-mono border ${darkMode ? "bg-slate-900 text-slate-300 border-slate-700" : "bg-slate-900 text-slate-200 border-slate-800"}`}>
              <code>{problem.solution || "// No solution provided"}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsCard;