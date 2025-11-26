import React, { useMemo } from "react";

const tabs = [
  { id: "All", label: "All Problems" },
  { id: "Array", label: "Array" },
  { id: "String", label: "String" },
  { id: "React", label: "React" },
  { id: "JavaScript", label: "JavaScript" },
  { id: "Algorithms", label: "Algorithms" },
  { id: "Data Structure", label: "Data Structures" }
];

const CategoryTabs = ({ activeTab, handleTabClick, problems, darkMode }) => {
  const tabsWithCounts = useMemo(
    () =>
      tabs.map(tab => ({
        ...tab,
        count: tab.id === "All" ? problems.length : problems.filter(p => p.category === tab.id).length
      })),
    [problems]
  );

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {tabsWithCounts.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105"
                : darkMode
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-white text-slate-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={
                activeTab === tab.id
                  ? "bg-white/20 text-white px-2 py-0.5 rounded-full"
                  : darkMode
                  ? "bg-slate-600 text-slate-300 px-2 py-0.5 rounded-full"
                  : "bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full"
              }
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
