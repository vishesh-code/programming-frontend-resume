import React from "react";

const RightSidebar = ({ stats }) => {
  const goal = 50;
  const solved = stats?.solved || 0;
  const percentage = Math.min(Math.round((solved / goal) * 100), 100);
  const remaining = Math.max(goal - solved, 0);

  // SVG Circle math for progress ring
  const circleRadius = 45;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circleCircumference - (percentage / 100) * circleCircumference;

  // Mock data for weekly activity
  const weeklyActivity = [
    { day: "M", height: "h-6", active: true },
    { day: "T", height: "h-8", active: true },
    { day: "W", height: "h-4", active: true },
    { day: "T", height: "h-8", active: true },
    { day: "F", height: "h-6", active: true },
    { day: "S", height: "h-2", active: false },
    { day: "S", height: "h-4", active: true },
  ];

  return (
    <div className="w-full max-w-sm space-y-6 sticky top-24 font-sans">
      {/* Header */}
      <div className="flex items-center space-x-2 px-1">
        <svg
          className="w-6 h-6 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <h2 className="heading-lg">Goal Tracker</h2>
      </div>

      {/* Goal & Difficulty Panel */}
      <div className="card-panel space-y-8">
        {/* Main Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            {/* Background Ring */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                fill="transparent"
                className="stroke-slate-100 dark:stroke-slate-700"
                strokeWidth="8"
              />
              {/* Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                fill="transparent"
                className="stroke-blue-600 dark:stroke-blue-500 transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            {/* Inner Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {percentage}%
              </span>
              <span className="text-[10px] text-muted font-bold tracking-widest mt-1 uppercase">
                Solved
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm">
              <span className="font-bold text-slate-900 dark:text-white">
                {solved}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {goal}
              </span>{" "}
              problems completed
            </p>
          </div>
        </div>

        {/* Goal Target Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="heading-sm">Goal: {goal} Problems</span>
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <p className="text-muted text-xs">
            {remaining} more to reach your goal
          </p>
        </div>

        {/* Difficulty Breakdown */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-2 mb-5">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            <span className="heading-sm">Difficulty Breakdown</span>
          </div>

          <div className="space-y-4">
            {/* Easy */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted font-medium tracking-wide">
                  Easy
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats?.easy || 1}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
            {/* Medium */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted font-medium tracking-wide">
                  Medium
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats?.medium || 0}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-slate-300 dark:bg-slate-600 h-full rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
            {/* Hard */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted font-medium tracking-wide">
                  Hard
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {stats?.hard || 0}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-slate-300 dark:bg-slate-600 h-full rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Panel */}
      <div className="card-panel">
        <div className="flex items-center space-x-2 mb-6">
          <svg
            className="w-4 h-4 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <h3 className="heading-sm">Weekly Activity</h3>
        </div>

        <div className="flex justify-between items-end px-1 h-12 mb-2">
          {weeklyActivity.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center w-8">
              <div
                className={`w-full rounded-md ${item.height} ${item.active ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
              ></div>
            </div>
          ))}
        </div>

        <div className="flex justify-between px-1 mb-6">
          {weeklyActivity.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-8 text-center uppercase"
            >
              {item.day}
            </span>
          ))}
        </div>

        {/* Current Streak */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xl">🔥</span>
            <span className="heading-sm">Current Streak</span>
          </div>
          <div className="flex items-baseline space-x-1 mb-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              7
            </span>
            <span className="text-muted">days</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Keep it up — you're on a roll!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
