// import React, { useState, useEffect, useCallback } from "react";
// import { useTheme } from "../../context/themeContext";
// import apiClient from "../../utils/apiClient";
// import { Edit2, Check, Loader2 } from "lucide-react";

// const RightSidebar = () => {
//   const { darkMode } = useTheme();

//   const [stats, setStats] = useState({
//     targetGoal: 50,
//     solved: 0,
//     easy: 0,
//     medium: 0,
//     hard: 0,
//     streak: 0,
//     weeklyActivity: [
//       { day: "-", date: "-", count: 0, active: false },
//       { day: "-", date: "-", count: 0, active: false },
//       { day: "-", date: "-", count: 0, active: false },
//       { day: "-", date: "-", count: 0, active: false },
//       { day: "-", date: "-", count: 0, active: false },
//       { day: "-", date: "-", count: 0, active: false },
//       { day: "-", date: "-", count: 0, active: false },
//     ],
//   });
//   const [loading, setLoading] = useState(true);
//   const [isEditingGoal, setIsEditingGoal] = useState(false);
//   const [tempGoal, setTempGoal] = useState(50);

//   const fetchStats = useCallback(async () => {
//     try {
//       const response = await apiClient.get("/problems/stats");
//       setStats(response.data);
//       setTempGoal(response.data.targetGoal);
//     } catch (err) {
//       console.error("Failed to fetch stats", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchStats();
//     window.addEventListener("problemStatusChanged", fetchStats);
//     return () => window.removeEventListener("problemStatusChanged", fetchStats);
//   }, [fetchStats]);

//   const saveGoal = async () => {
//     const newGoal = Math.max(1, parseInt(tempGoal) || 1);
//     setIsEditingGoal(false);
//     setStats((prev) => ({ ...prev, targetGoal: newGoal }));
//     try {
//       await apiClient.put("/problems/goal", { goal: newGoal });
//     } catch (err) {
//       console.error("Failed to update goal", err);
//       fetchStats();
//     }
//   };

//   const goal = stats.targetGoal;
//   const solved = stats.solved;
//   const percentage = Math.min(Math.round((solved / goal) * 100), 100) || 0;
//   const remaining = Math.max(goal - solved, 0);
//   const easyPct = solved > 0 ? (stats.easy / solved) * 100 : 0;
//   const mediumPct = solved > 0 ? (stats.medium / solved) * 100 : 0;
//   const hardPct = solved > 0 ? (stats.hard / solved) * 100 : 0;

//   const maxActivity = Math.max(...stats.weeklyActivity.map((d) => d.count), 1);
//   const graphMax = Math.max(30, maxActivity);

//   const circleRadius = 45;
//   const circleCircumference = 2 * Math.PI * circleRadius;
//   const strokeDashoffset =
//     circleCircumference - (percentage / 100) * circleCircumference;

//   if (loading) {
//     return (
//       <div
//         className={`w-full max-w-sm flex items-center justify-center p-10 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
//       >
//         <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-sm space-y-6 sticky top-24 font-sans">
//       {/* Goal & Difficulty Panel */}
//       <div
//         className={`p-6 rounded-2xl border shadow-sm space-y-8 transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
//       >
//         {/* Header INSIDE the card */}
//         <div
//           className={`flex items-center space-x-2 pb-4 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}
//         >
//           <svg
//             className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <circle cx="12" cy="12" r="10" />
//             <circle cx="12" cy="12" r="6" />
//             <circle cx="12" cy="12" r="2" />
//           </svg>
//           <h2
//             className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
//           >
//             Goal Tracker
//           </h2>
//         </div>

//         {/* Main Circular Progress */}
//         <div className="flex flex-col items-center relative">
//           <div className="relative w-32 h-32 flex items-center justify-center mb-4">
//             <svg
//               className="w-full h-full transform -rotate-90"
//               viewBox="0 0 100 100"
//             >
//               <circle
//                 cx="50"
//                 cy="50"
//                 r={circleRadius}
//                 fill="transparent"
//                 className={darkMode ? "stroke-slate-700" : "stroke-slate-100"}
//                 strokeWidth="8"
//               />
//               <circle
//                 cx="50"
//                 cy="50"
//                 r={circleRadius}
//                 fill="transparent"
//                 className={`transition-all duration-1000 ease-out ${darkMode ? "stroke-blue-500" : "stroke-blue-600"}`}
//                 strokeWidth="8"
//                 strokeLinecap="round"
//                 strokeDasharray={circleCircumference}
//                 strokeDashoffset={strokeDashoffset}
//               />
//             </svg>
//             <div className="absolute flex flex-col items-center justify-center">
//               <span
//                 className={`text-3xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
//               >
//                 {percentage}%
//               </span>
//             </div>
//           </div>
//           <div className="text-center">
//             <p
//               className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}
//             >
//               <span
//                 className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
//               >
//                 {solved}
//               </span>{" "}
//               of{" "}
//               {isEditingGoal ? (
//                 <span className="inline-flex items-center gap-1 mx-1">
//                   <input
//                     type="number"
//                     value={tempGoal}
//                     onChange={(e) => setTempGoal(e.target.value)}
//                     className={`w-14 px-1 py-0.5 text-center font-bold border rounded outline-none ${darkMode ? "bg-slate-900 border-slate-600 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
//                     autoFocus
//                   />
//                   <button
//                     onClick={saveGoal}
//                     className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded"
//                   >
//                     <Check className="w-3.5 h-3.5" />
//                   </button>
//                 </span>
//               ) : (
//                 <span
//                   className="inline-flex items-center gap-1 cursor-pointer group"
//                   onClick={() => setIsEditingGoal(true)}
//                 >
//                   <span
//                     className={`font-bold underline decoration-dashed decoration-slate-400 underline-offset-4 ${darkMode ? "text-white" : "text-slate-900"}`}
//                   >
//                     {goal}
//                   </span>
//                   <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
//                 </span>
//               )}{" "}
//               problems completed
//             </p>
//           </div>
//         </div>

//         {/* Goal Progress Bar */}
//         <div>
//           <div className="flex justify-between items-center mb-3">
//             <span
//               className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}
//             >
//               Progress
//             </span>
//             <span
//               className={`text-xs font-bold px-2 py-0.5 rounded-md ${darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700"}`}
//             >
//               {percentage}%
//             </span>
//           </div>
//           <div
//             className={`w-full rounded-full h-2 mb-2 overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
//           >
//             <div
//               className="bg-blue-600 h-full rounded-full transition-all duration-500"
//               style={{ width: `${percentage}%` }}
//             ></div>
//           </div>
//           <p
//             className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//           >
//             {remaining > 0
//               ? `${remaining} more to reach your goal`
//               : "Goal Achieved! 🎉"}
//           </p>
//         </div>

//         {/* Difficulty Breakdown */}
//         <div
//           className={`pt-6 border-t ${darkMode ? "border-slate-700" : "border-slate-100"}`}
//         >
//           <div className="flex items-center space-x-2 mb-5">
//             <svg
//               className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
//               <polyline points="17 6 23 6 23 12" />
//             </svg>
//             <span
//               className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}
//             >
//               Difficulty Breakdown
//             </span>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1.5">
//                 <span
//                   className={`font-medium tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//                 >
//                   Easy
//                 </span>
//                 <span
//                   className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
//                 >
//                   {stats.easy}
//                 </span>
//               </div>
//               <div
//                 className={`w-full rounded-full h-1.5 overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
//               >
//                 <div
//                   className="bg-emerald-500 h-full rounded-full transition-all duration-700"
//                   style={{ width: `${easyPct}%` }}
//                 ></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1.5">
//                 <span
//                   className={`font-medium tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//                 >
//                   Medium
//                 </span>
//                 <span
//                   className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
//                 >
//                   {stats.medium}
//                 </span>
//               </div>
//               <div
//                 className={`w-full rounded-full h-1.5 overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
//               >
//                 <div
//                   className="bg-amber-500 h-full rounded-full transition-all duration-700"
//                   style={{ width: `${mediumPct}%` }}
//                 ></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1.5">
//                 <span
//                   className={`font-medium tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//                 >
//                   Hard
//                 </span>
//                 <span
//                   className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
//                 >
//                   {stats.hard}
//                 </span>
//               </div>
//               <div
//                 className={`w-full rounded-full h-1.5 overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
//               >
//                 <div
//                   className="bg-red-500 h-full rounded-full transition-all duration-700"
//                   style={{ width: `${hardPct}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Weekly Activity Panel */}
//       <div
//         className={`p-6 rounded-2xl border shadow-sm transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
//       >
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-2">
//             <svg
//               className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               viewBox="0 0 24 24"
//             >
//               <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//             </svg>
//             <h3
//               className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}
//             >
//               Weekly Activity
//             </h3>
//           </div>
//         </div>

//         {/* Dynamic Activity Bar Graph with Grid Lines */}
//         <div className="relative h-24 mb-2 mt-6 ml-6">
//           {/* Horizontal Grid Lines (30, 20, 10) */}
//           {[30, 20, 10].map((val) => (
//             <div
//               key={val}
//               className="absolute left-[-24px] right-0 flex items-center"
//               style={{
//                 bottom: `${(val / graphMax) * 100}%`,
//                 transform: "translateY(50%)",
//               }}
//             >
//               <span
//                 className={`text-[9px] w-5 text-right mr-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
//               >
//                 {val}
//               </span>
//               <div
//                 className={`flex-1 border-b border-dashed ${darkMode ? "border-slate-700/70" : "border-slate-200"}`}
//               ></div>
//             </div>
//           ))}

//           {/* Zero Line (X-axis base) */}
//           <div
//             className={`absolute left-0 right-0 bottom-0 border-b ${darkMode ? "border-slate-700" : "border-slate-300"}`}
//           ></div>

//           {/* Bars Container */}
//           <div className="absolute inset-0 flex justify-between items-end">
//             {stats.weeklyActivity.map((item, idx) => {
//               const barHeight =
//                 item.count === 0 ? "2%" : `${(item.count / graphMax) * 100}%`;
//               return (
//                 <div
//                   key={idx}
//                   className="flex flex-col items-center w-8 group relative h-full justify-end z-10"
//                 >
//                   <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap">
//                     {item.count} solved
//                   </div>
//                   <div
//                     className={`w-full rounded-t-sm transition-all duration-500 ${item.active ? "bg-blue-600 hover:bg-blue-500" : darkMode ? "bg-slate-700" : "bg-slate-200"}`}
//                     style={{ height: barHeight }}
//                   ></div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Day and Date Labels */}
//         <div className="flex justify-between ml-6 mb-6">
//           {stats.weeklyActivity.map((item, idx) => (
//             <div
//               key={idx}
//               className="flex flex-col items-center w-8 text-center"
//             >
//               <span
//                 className={`text-[10px] font-bold uppercase ${darkMode ? "text-slate-300" : "text-slate-700"}`}
//               >
//                 {item.day}
//               </span>
//               <span
//                 className={`text-[9px] font-semibold mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
//               >
//                 {item.date}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Current Streak */}
//         <div
//           className={`border rounded-xl p-4 ${darkMode ? "bg-blue-900/20 border-blue-800/30" : "bg-blue-50 border-blue-100/50"}`}
//         >
//           <div className="flex items-center space-x-2 mb-1">
//             <span className="text-xl">{stats.streak > 0 ? "🔥" : "🧊"}</span>
//             <span
//               className={`text-sm font-semibold ${darkMode ? "text-blue-300" : "text-slate-800"}`}
//             >
//               Current Streak
//             </span>
//           </div>
//           <div className="flex items-baseline space-x-1 mb-1">
//             <span
//               className={`text-3xl font-black tracking-tighter ${darkMode ? "text-white" : "text-slate-900"}`}
//             >
//               {stats.streak}
//             </span>
//             <span
//               className={`text-sm font-medium ${darkMode ? "text-blue-200/70" : "text-slate-500"}`}
//             >
//               days
//             </span>
//           </div>
//           <p
//             className={`text-xs font-medium ${darkMode ? "text-blue-400" : "text-blue-600"}`}
//           >
//             {stats.streak > 0
//               ? "Keep it up — you're on a roll!"
//               : "Solve a problem to start your streak!"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;


import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../context/themeContext";
import apiClient from "../../utils/apiClient";
import { Edit2, Check, Loader2 } from "lucide-react";

const DEFAULT_WEEKLY_ACTIVITY = [
  { day: "-", date: "-", count: 0, active: false },
  { day: "-", date: "-", count: 0, active: false },
  { day: "-", date: "-", count: 0, active: false },
  { day: "-", date: "-", count: 0, active: false },
  { day: "-", date: "-", count: 0, active: false },
  { day: "-", date: "-", count: 0, active: false },
  { day: "-", date: "-", count: 0, active: false },
];

const RightSidebar = () => {
  const { darkMode } = useTheme();

  const [stats, setStats] = useState({
    targetGoal: 50,
    solved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    streak: 0,
    weeklyActivity: DEFAULT_WEEKLY_ACTIVITY,
  });
  const [loading, setLoading] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(50);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiClient.get("/problems/stats");
      const data = response.data || {};
      // 🔥 FIX: previously did setStats(response.data) directly — a
      // malformed response (missing fields, weeklyActivity not an array,
      // string instead of number) would crash the circular progress math
      // and the weeklyActivity.map() calls further down.
      setStats({
        targetGoal: Number(data.targetGoal) || 1,
        solved: Number(data.solved) || 0,
        easy: Number(data.easy) || 0,
        medium: Number(data.medium) || 0,
        hard: Number(data.hard) || 0,
        streak: Number(data.streak) || 0,
        weeklyActivity:
          Array.isArray(data.weeklyActivity) && data.weeklyActivity.length > 0
            ? data.weeklyActivity.map((d) => ({
                day: d?.day ?? "-",
                date: d?.date ?? "-",
                count: Number(d?.count) || 0,
                active: !!d?.active,
              }))
            : DEFAULT_WEEKLY_ACTIVITY,
      });
      setTempGoal(Number(data.targetGoal) || 1);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    window.addEventListener("problemStatusChanged", fetchStats);
    return () => window.removeEventListener("problemStatusChanged", fetchStats);
  }, [fetchStats]);

  const saveGoal = async () => {
    const newGoal = Math.max(1, parseInt(tempGoal) || 1);
    setIsEditingGoal(false);
    setStats((prev) => ({ ...prev, targetGoal: newGoal }));
    try {
      await apiClient.put("/problems/goal", { goal: newGoal });
    } catch (err) {
      console.error("Failed to update goal", err);
      fetchStats();
    }
  };

  const goal = stats.targetGoal;
  const solved = stats.solved;
  const percentage = Math.min(Math.round((solved / goal) * 100), 100) || 0;
  const remaining = Math.max(goal - solved, 0);
  const easyPct = solved > 0 ? (stats.easy / solved) * 100 : 0;
  const mediumPct = solved > 0 ? (stats.medium / solved) * 100 : 0;
  const hardPct = solved > 0 ? (stats.hard / solved) * 100 : 0;

  const maxActivity = Math.max(...stats.weeklyActivity.map((d) => d.count), 1);
  const graphMax = Math.max(30, maxActivity);

  const circleRadius = 45;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (percentage / 100) * circleCircumference;

  if (loading) {
    return (
      <div
        className={`w-full max-w-sm flex items-center justify-center p-10 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6 sticky top-24 font-sans">
      {/* Goal & Difficulty Panel */}
      <div
        className={`p-6 rounded-2xl border shadow-sm space-y-8 transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        {/* Header INSIDE the card */}
        <div
          className={`flex items-center space-x-2 pb-4 border-b ${darkMode ? "border-slate-700" : "border-slate-100"}`}
        >
          <svg
            className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          <h2
            className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Goal Tracker
          </h2>
        </div>

        {/* Main Circular Progress */}
        <div className="flex flex-col items-center relative">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                fill="transparent"
                className={darkMode ? "stroke-slate-700" : "stroke-slate-100"}
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                fill="transparent"
                className={`transition-all duration-1000 ease-out ${darkMode ? "stroke-blue-500" : "stroke-blue-600"}`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span
                className={`text-3xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                {percentage}%
              </span>
            </div>
          </div>
          <div className="text-center">
            <p
              className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}
            >
              <span
                className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                {solved}
              </span>{" "}
              of{" "}
              {isEditingGoal ? (
                <span className="inline-flex items-center gap-1 mx-1">
                  <input
                    type="number"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    className={`w-14 px-1 py-0.5 text-center font-bold border rounded outline-none ${darkMode ? "bg-slate-900 border-slate-600 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                    autoFocus
                  />
                  <button
                    onClick={saveGoal}
                    className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 p-1 rounded"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 cursor-pointer group"
                  onClick={() => setIsEditingGoal(true)}
                >
                  <span
                    className={`font-bold underline decoration-dashed decoration-slate-400 underline-offset-4 ${darkMode ? "text-white" : "text-slate-900"}`}
                  >
                    {goal}
                  </span>
                  <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                </span>
              )}{" "}
              problems completed
            </p>
          </div>
        </div>

        {/* Goal Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span
              className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}
            >
              Progress
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${darkMode ? "bg-blue-900/40 text-blue-300" : "bg-blue-100 text-blue-700"}`}
            >
              {percentage}%
            </span>
          </div>
          <div
            className={`w-full rounded-full h-2 mb-2 overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
          >
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p
            className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            {remaining > 0
              ? `${remaining} more to reach your goal`
              : "Goal Achieved! 🎉"}
          </p>
        </div>

        {/* Difficulty Breakdown */}
        <div
          className={`pt-6 border-t ${darkMode ? "border-slate-700" : "border-slate-100"}`}
        >
          <div className="flex items-center space-x-2 mb-5">
            <svg
              className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span
              className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}
            >
              Difficulty Breakdown
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span
                  className={`font-medium tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  Easy
                </span>
                <span
                  className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {stats.easy}
                </span>
              </div>
              <div
                className={`w-full rounded-full h-1.5 overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
              >
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${easyPct}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span
                  className={`font-medium tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  Medium
                </span>
                <span
                  className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {stats.medium}
                </span>
              </div>
              <div
                className={`w-full rounded-full h-1.5 overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
              >
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${mediumPct}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span
                  className={`font-medium tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  Hard
                </span>
                <span
                  className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {stats.hard}
                </span>
              </div>
              <div
                className={`w-full rounded-full h-1.5 overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
              >
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${hardPct}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Panel */}
      <div
        className={`p-6 rounded-2xl border shadow-sm transition-colors ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <svg
              className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-500"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <h3
              className={`text-sm font-semibold ${darkMode ? "text-slate-200" : "text-slate-800"}`}
            >
              Weekly Activity
            </h3>
          </div>
        </div>

        {/* Dynamic Activity Bar Graph with Grid Lines */}
        <div className="relative h-24 mb-2 mt-6 ml-6">
          {/* Horizontal Grid Lines (30, 20, 10) */}
          {[30, 20, 10].map((val) => (
            <div
              key={val}
              className="absolute left-[-24px] right-0 flex items-center"
              style={{
                bottom: `${(val / graphMax) * 100}%`,
                transform: "translateY(50%)",
              }}
            >
              <span
                className={`text-[9px] w-5 text-right mr-1 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
              >
                {val}
              </span>
              <div
                className={`flex-1 border-b border-dashed ${darkMode ? "border-slate-700/70" : "border-slate-200"}`}
              ></div>
            </div>
          ))}

          {/* Zero Line (X-axis base) */}
          <div
            className={`absolute left-0 right-0 bottom-0 border-b ${darkMode ? "border-slate-700" : "border-slate-300"}`}
          ></div>

          {/* Bars Container */}
          <div className="absolute inset-0 flex justify-between items-end">
            {stats.weeklyActivity.map((item, idx) => {
              const barHeight =
                item.count === 0 ? "2%" : `${(item.count / graphMax) * 100}%`;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center w-8 group relative h-full justify-end z-10"
                >
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap">
                    {item.count} solved
                  </div>
                  <div
                    className={`w-full rounded-t-sm transition-all duration-500 ${item.active ? "bg-blue-600 hover:bg-blue-500" : darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                    style={{ height: barHeight }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day and Date Labels */}
        <div className="flex justify-between ml-6 mb-6">
          {stats.weeklyActivity.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center w-8 text-center"
            >
              <span
                className={`text-[10px] font-bold uppercase ${darkMode ? "text-slate-300" : "text-slate-700"}`}
              >
                {item.day}
              </span>
              <span
                className={`text-[9px] font-semibold mt-0.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
              >
                {item.date}
              </span>
            </div>
          ))}
        </div>

        {/* Current Streak */}
        <div
          className={`border rounded-xl p-4 ${darkMode ? "bg-blue-900/20 border-blue-800/30" : "bg-blue-50 border-blue-100/50"}`}
        >
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xl">{stats.streak > 0 ? "🔥" : "🧊"}</span>
            <span
              className={`text-sm font-semibold ${darkMode ? "text-blue-300" : "text-slate-800"}`}
            >
              Current Streak
            </span>
          </div>
          <div className="flex items-baseline space-x-1 mb-1">
            <span
              className={`text-3xl font-black tracking-tighter ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              {stats.streak}
            </span>
            <span
              className={`text-sm font-medium ${darkMode ? "text-blue-200/70" : "text-slate-500"}`}
            >
              days
            </span>
          </div>
          <p
            className={`text-xs font-medium ${darkMode ? "text-blue-400" : "text-blue-600"}`}
          >
            {stats.streak > 0
              ? "Keep it up — you're on a roll!"
              : "Solve a problem to start your streak!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
