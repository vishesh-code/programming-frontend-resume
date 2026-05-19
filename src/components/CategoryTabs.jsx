import React, { useState, useEffect, useMemo } from "react";
import apiClient from "../utils/apiClient";

// Fallback data provided by user
const FALLBACK_CATEGORIES = [
  {
    _id: { $oid: "6932b73ccb6da56f8d187004" },
    name: "All Problems",
    slug: "all-problems",
    __v: 0,
  },
  {
    _id: { $oid: "6932b8a9ccfcc7763c51aa94" },
    name: "Array",
    slug: "array",
  },
  {
    _id: { $oid: "6932b8a9ccfcc7763c51aa95" },
    name: "String",
    slug: "string",
  },
  {
    _id: { $oid: "6932b8a9ccfcc7763c51aa96" },
    name: "React",
    slug: "react",
  },
  {
    _id: { $oid: "6932b8a9ccfcc7763c51aa97" },
    name: "JavaScript",
    slug: "javascript",
  },
  {
    _id: { $oid: "6932b8a9ccfcc7763c51aa98" },
    name: "Algorithms",
    slug: "algorithms",
  },
  {
    _id: { $oid: "6932b8a9ccfcc7763c51aa99" },
    name: "Data Structures",
    slug: "data-structures",
  },
];

const CategoryTabs = ({ activeTab, handleTabClick, problems, darkMode }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const processCategories = (data) => {
    const formatted = data.map((cat) => ({
      id: cat.slug === "all-problems" ? "All" : cat.name,
      label: cat.name,
    }));

    return formatted.sort((a, b) => {
      if (a.id === "All") return -1;
      if (b.id === "All") return 1;
      return 0;
    });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/category");
        setCategories(processCategories(response.data));
      } catch (err) {
        console.error("Failed to fetch categories, using fallback:", err);
        setCategories(processCategories(FALLBACK_CATEGORIES));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const tabsWithCounts = useMemo(
    () =>
      categories.map((tab) => ({
        ...tab,
        count:
          tab.id === "All"
            ? problems.length
            : problems.filter((p) => p.category === tab.id).length,
      })),
    [problems, categories]
  );

  if (loading) {
    return (
      // Changed pb-2 to py-2 to prevent top clipping
      <div className="w-full mb-8 overflow-x-auto py-2">
        <div className="flex space-x-3 min-w-max px-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-10 w-32 rounded-full animate-pulse ${
                darkMode ? "bg-slate-800" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-8 overflow-x-auto py-2 scrollbar-hide">
      <div className="flex space-x-3 min-w-max px-1">
        {tabsWithCounts.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-600 ring-offset-2 " +
                    (darkMode ? "ring-offset-slate-900" : "ring-offset-white")
                  : darkMode
                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700"
                  : "bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600 border border-gray-200 shadow-sm"
              }
            `}
          >
            <span>{tab.label}</span>
            <span
              className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${
                  activeTab === tab.id
                    ? "bg-blue-500/30 text-white"
                    : darkMode
                    ? "bg-slate-700 text-slate-300"
                    : "bg-gray-100 text-gray-500"
                }
              `}
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
