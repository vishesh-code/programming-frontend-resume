import React from "react";
import { Search, PlusCircle, Frown } from "lucide-react";

/**
 * Renders a state when no problems are available, either due to no data or active filters.
 * @param {boolean} isInitialEmpty - True if the problems array is completely empty (no data from API).
 * @param {boolean} hasActiveFilters - True if any filter (search, difficulty, etc.) is currently active.
 * @param {function} resetFilters - Function to clear active filters.
 * @param {function} onAddProblem - Function to open the Add Problem modal (optional, not strictly needed as a button is outside).
 */
const EmptyState = ({
  darkMode,
  isInitialEmpty, 
  hasActiveFilters, 
  resetFilters,
  onAddProblem, 
}) => {
  let iconComponent;
  let title;
  let message;
  let primaryButtonText;
  let onPrimaryAction;

  if (isInitialEmpty && !hasActiveFilters) {
    iconComponent = (
      <PlusCircle
        className={`h-8 w-8 ${darkMode ? "text-slate-400" : "text-blue-400"}`}
      />
    );
    title = "Start Your Practice Journey";
    message =
      "It looks like you haven't added any practice problems yet. Click the 'Add Problem' button above to add your first question!";
    primaryButtonText = "Add Problem";
    onPrimaryAction = resetFilters;
  }
  else if (!isInitialEmpty && hasActiveFilters) {
    iconComponent = (
      <Search
        className={`h-8 w-8 ${darkMode ? "text-slate-400" : "text-blue-400"}`}
      />
    );
    title = "No Problems Found";
    message =
      "Your current search or filters did not match any problems. Try resetting your filters to see all available questions.";
    primaryButtonText = "Reset Filters";
    onPrimaryAction = resetFilters;
  }
  else {
    iconComponent = (
      <Frown
        className={`h-8 w-8 ${darkMode ? "text-slate-400" : "text-blue-400"}`}
      />
    );
    title = "Problems Unavailable";
    message =
      "Problems data is currently unavailable. Please try again later or clear filters if problems should exist.";
    primaryButtonText = "Reset Filters";
    onPrimaryAction = resetFilters;
  }

  return (
    <div className="text-center py-12">
      <div
        className={`${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-blue-100"
        } rounded-2xl p-8 border shadow-sm max-w-md mx-auto`}
      >
        <div
          className={`${
            darkMode ? "bg-slate-700" : "bg-blue-100"
          } w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}
        >
          {iconComponent}
        </div>
        <h3
          className={`text-xl font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          {title}
        </h3>
        <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} mb-6`}>
          {message}
        </p>
        <button
          onClick={onPrimaryAction}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-base font-medium flex items-center justify-center mx-auto space-x-2"
        >
          {primaryButtonText === "Add Problem" && (
            <PlusCircle className="h-5 w-5" />
          )}
          <span>{primaryButtonText}</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
