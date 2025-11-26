import React from "react";
import { Search } from "lucide-react";

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  difficultyFilter,
  setDifficultyFilter,
  solvedFilter,
  setSolvedFilter,
  darkMode,
}) => (
  <div
    className={`${
      darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"
    } rounded-2xl p-4 border shadow-sm mb-6 transition-colors`}
  >
    <div className="space-y-4">
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
            darkMode ? "text-slate-400" : "text-slate-400"
          }`}
        />
        <input
          type="text"
          placeholder="Search problems, tags, or keywords..."
          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600"
              : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white"
          }`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          className={`border rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm flex-1 ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-slate-200 focus:bg-slate-600"
              : "bg-slate-50 border-slate-200 text-slate-700 focus:bg-white"
          }`}
          value={difficultyFilter}
          onChange={e => setDifficultyFilter(e.target.value)}
        >
          <option value="All">All Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select
          className={`border rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm flex-1 ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-slate-200 focus:bg-slate-600"
              : "bg-slate-50 border-slate-200 text-slate-700 focus:bg-white"
          }`}
          value={solvedFilter}
          onChange={e => setSolvedFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Solved">Completed</option>
          <option value="Not Solved">Todo</option>
        </select>
      </div>
    </div>
  </div>
);

export default FilterBar;
