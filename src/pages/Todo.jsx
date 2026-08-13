import { useState, useEffect, useRef } from "react";
import apiClient from "../utils/apiClient"; // Ensure this path matches your project structure

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PRIORITY_CONFIG = {
  high: {
    label: "High",
    dot: "#E8943A",
    badge: "bg-amber-100 text-amber-800 border border-amber-300",
  },
  medium: {
    label: "Medium",
    dot: "#3B82F6",
    badge: "bg-blue-100 text-blue-800 border border-blue-300",
  },
  low: {
    label: "Low",
    dot: "#10B981",
    badge: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  },
};

function generateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getTodayKey() {
  const d = new Date();
  return generateKey(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function TodoCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [tasks, setTasks] = useState({});
  const [modal, setModal] = useState(null);
  const [newTask, setNewTask] = useState({
    text: "",
    priority: "medium",
    time: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef(null);

  // --- API INTEGRATION: Fetch Todos using apiClient ---
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await apiClient.get("/todos");
        const data = res.data;

        // Group the flat array of tasks by dateKey for the calendar
        const groupedTasks = {};
        if (Array.isArray(data)) {
          data.forEach((task) => {
            if (!groupedTasks[task.dateKey]) groupedTasks[task.dateKey] = [];
            // Map MongoDB _id to id
            groupedTasks[task.dateKey].push({ ...task, id: task._id });
          });
        }
        setTasks(groupedTasks);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, []);

  useEffect(() => {
    if (modal && inputRef.current)
      setTimeout(() => inputRef.current?.focus(), 80);
  }, [modal]);

  const todayKey = getTodayKey();

  /* ─── calendar grid ─── */
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
  const cells = [];

  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, cur: false, key: null });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, cur: true, key: generateKey(viewYear, viewMonth, d) });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++)
    cells.push({ day: d, cur: false, key: null });

  /* ─── task helpers ─── */
  const dayTasks = (key) => tasks[key] || [];
  const totalDone = Object.values(tasks)
    .flat()
    .filter((t) => t.done).length;
  const totalAll = Object.values(tasks).flat().length;

  // --- API INTEGRATION: Add Task ---
  const addTask = async () => {
    if (!newTask.text.trim() || !modal) return;

    try {
      const payload = {
        text: newTask.text.trim(),
        priority: newTask.priority,
        time: newTask.time,
        dateKey: modal,
      };

      const res = await apiClient.post("/todos", payload);
      const savedTask = res.data;
      savedTask.id = savedTask._id; // Map id

      setTasks((p) => ({ ...p, [modal]: [...(p[modal] || []), savedTask] }));
      setNewTask({ text: "", priority: "medium", time: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // --- API INTEGRATION: Toggle Done Status ---
  const toggleTask = async (key, id) => {
    // Optimistic UI Update
    setTasks((p) => ({
      ...p,
      [key]: p[key].map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));

    // Find current task state to know what to send
    const task = tasks[key].find((t) => t.id === id);

    try {
      await apiClient.put(`/todos/${id}`, { done: !task.done });
    } catch (error) {
      console.error("Error toggling task:", error);
      // Optional: Revert state if failed
    }
  };

  // --- API INTEGRATION: Delete Task ---
  const deleteTask = async (key, id) => {
    // Optimistic UI Update
    setTasks((p) => ({
      ...p,
      [key]: p[key].filter((t) => t.id !== id),
    }));

    try {
      await apiClient.delete(`/todos/${id}`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- API INTEGRATION: Edit Task ---
  const saveEdit = async (key, id) => {
    if (!editText.trim()) return;

    // Optimistic UI Update
    setTasks((p) => ({
      ...p,
      [key]: p[key].map((t) =>
        t.id === id ? { ...t, text: editText.trim() } : t,
      ),
    }));
    setEditingId(null);

    try {
      await apiClient.put(`/todos/${id}`, { text: editText.trim() });
      setEditText("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const heatLevel = (key) => {
    const n = (tasks[key] || []).length;
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n <= 3) return 2;
    return 3;
  };

  const heatBg = (level, isCur, isToday, isSelected) => {
    if (isSelected)
      return "bg-[#1E3A5F] text-white shadow-lg shadow-slate-900/20";
    if (isToday) return "bg-[#1E3A5F]/10 border-[#1E3A5F] border-2";
    if (!isCur) return "opacity-30";
    if (level === 1) return "bg-amber-50";
    if (level === 2) return "bg-amber-100";
    if (level === 3) return "bg-amber-200";
    return "";
  };

  /* ─── upcoming tasks (next 7 days) ─── */
  const upcoming = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const k = generateKey(d.getFullYear(), d.getMonth(), d.getDate());
    const ts = (tasks[k] || []).filter((t) => !t.done);
    if (ts.length) upcoming.push({ date: d, key: k, tasks: ts });
  }

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else setViewMonth((m) => m + 1);
  };

  const progressPercent =
    totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-6">
      {/* ── MAIN CONTENT AREA ── */}
      <div className="w-full mx-auto px-6 py-5 flex flex-col gap-5">
        {/* ── PROGRESS BAR ── */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="whitespace-nowrap">
            <h2 className="text-xs font-bold text-[#1E3A5F] uppercase tracking-wider">
              Task Progress
            </h2>
          </div>
          <div className="flex-1 max-w-2xl h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E8943A] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="whitespace-nowrap text-right">
            <span className="text-xs font-semibold text-slate-500">
              {totalDone} / {totalAll} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* ── TOP: QUICK STATS WIDGETS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Tasks",
              value: totalAll,
              color: "text-[#1E3A5F]",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            },
            {
              label: "Completed",
              value: totalDone,
              color: "text-emerald-600",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              label: "Pending",
              value: totalAll - totalDone,
              color: "text-amber-600",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              label: "Completion",
              value: totalAll ? `${progressPercent}%` : "0%",
              color: "text-blue-600",
              icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
            },
          ].map(({ label, value, color, icon }) => (
            <div
              key={label}
              className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200/80 p-4 shadow-sm flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 ${color}`}
              >
                <svg
                  className="w-5 h-5 fill-none stroke-current stroke-2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <p className={`text-xl font-black leading-none ${color}`}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── MIDDLE: MAIN CALENDAR ── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Month nav */}
          <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-md hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-slate-600 fill-none stroke-current stroke-2"
              >
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <div className="text-center flex items-baseline gap-2">
              <p className="font-bold text-[#1E3A5F] text-lg">
                {MONTHS[viewMonth]}
              </p>
              <p className="text-sm font-medium text-slate-400">{viewYear}</p>
            </div>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-md hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-slate-600 fill-none stroke-current stroke-2"
              >
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pt-2 pb-1 bg-white">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-1 px-3 pb-3 bg-white">
            {cells.map((cell, idx) => {
              const isToday = cell.key === todayKey;
              const isSelected = cell.key === modal;
              const level = cell.cur ? heatLevel(cell.key) : 0;
              const cellTasks = cell.key ? dayTasks(cell.key) : [];
              const bg = heatBg(level, cell.cur, isToday, isSelected);

              return (
                <button
                  key={idx}
                  disabled={!cell.cur}
                  onClick={() => cell.cur && setModal(cell.key)}
                  className={`relative rounded-lg p-1.5 text-left transition-all duration-150 min-h-[65px] flex flex-col group
                    ${cell.cur ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "cursor-default"}
                    ${bg}`}
                >
                  {/* Date number */}
                  <span
                    className={`text-xs font-bold mb-1 leading-none
                    ${isSelected ? "text-white" : isToday ? "text-[#1E3A5F]" : cell.cur ? "text-slate-700" : "text-slate-300"}`}
                  >
                    {cell.day}
                  </span>

                  {/* Task pills */}
                  <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                    {cellTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`flex items-center gap-1 w-full`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background:
                              PRIORITY_CONFIG[t.priority]?.dot || "#888",
                          }}
                        />
                        <span
                          className={`text-[9px] truncate leading-tight font-semibold
                          ${isSelected ? "text-white/90" : t.done ? "line-through text-slate-400 font-medium" : "text-slate-600"}`}
                        >
                          {t.text}
                        </span>
                      </div>
                    ))}
                    {cellTasks.length > 2 && (
                      <span
                        className={`text-[9px] font-bold ${isSelected ? "text-white/70" : "text-slate-400"}`}
                      >
                        +{cellTasks.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Progress micro-bar */}
                  {cellTasks.length > 0 && !isSelected && (
                    <div className="absolute bottom-1 right-1 flex gap-0.5">
                      {cellTasks.slice(0, 4).map((t) => (
                        <div
                          key={t.id}
                          className={`w-1 h-1 rounded-full ${t.done ? "bg-emerald-400" : "bg-slate-300"}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM: TODAY & UPCOMING MODULES ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Today's snapshot */}
          <div className="bg-[#1E3A5F] rounded-xl p-5 text-white shadow-lg flex flex-col h-[320px]">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                Today's Snapshot
              </p>
              <span className="text-[10px] font-semibold bg-white/10 border border-white/20 px-2.5 py-1 rounded-full uppercase tracking-wide">
                {today.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {dayTasks(todayKey).length === 0 ? (
                <div className="bg-[#16304f] rounded-lg p-4 text-center border border-[#1E3A5F]/50 mt-2">
                  <p className="text-xs text-slate-400 italic">
                    Nothing scheduled today.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {dayTasks(todayKey).map((t) => (
                    <label
                      key={t.id}
                      className={`flex items-center gap-2.5 cursor-pointer group bg-[#16304f] p-3 rounded-lg border transition-all ${t.done ? "border-transparent opacity-60" : "border-white/5 hover:border-[#E8943A]/40 shadow-sm"}`}
                    >
                      <button
                        onClick={() => toggleTask(todayKey, t.id)}
                        className={`w-4 h-4 flex-shrink-0 rounded border transition-all
                          ${t.done ? "bg-[#E8943A] border-[#E8943A]" : "border-white/40 bg-transparent group-hover:border-[#E8943A]"}`}
                      >
                        {t.done && (
                          <svg
                            viewBox="0 0 12 12"
                            className="w-full h-full p-0.5 fill-none stroke-white stroke-2"
                          >
                            <polyline points="2,6 5,9 10,3" />
                          </svg>
                        )}
                      </button>
                      <span
                        className={`text-sm font-medium leading-snug flex-1 ${t.done ? "line-through text-slate-400" : "text-white/90"}`}
                      >
                        {t.text}
                      </span>
                      {t.time && (
                        <span className="ml-auto text-[10px] font-bold text-[#E8943A] flex-shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          {t.time}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setModal(todayKey)}
              className="mt-4 flex-shrink-0 w-full text-xs bg-[#E8943A] hover:bg-amber-500 transition-colors py-2.5 rounded-lg font-bold shadow-md uppercase tracking-wider"
            >
              + Add Task
            </button>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col h-[320px]">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex-shrink-0">
              Upcoming 7 Days
            </p>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {upcoming.length === 0 ? (
                <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100 mt-2">
                  <p className="text-xs text-slate-400 italic">
                    All clear ahead 🎉
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcoming.map(({ date, key, tasks: ts }) => (
                    <div
                      key={key}
                      className="bg-slate-50 rounded-lg p-3 border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8943A] flex-shrink-0 shadow-sm" />
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          {date.toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 pl-1">
                        {ts.slice(0, 3).map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center gap-2 bg-white p-1.5 rounded-md border border-slate-100 shadow-sm"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                              style={{
                                background: PRIORITY_CONFIG[t.priority]?.dot,
                              }}
                            />
                            <p className="text-xs font-semibold text-slate-600 truncate">
                              {t.text}
                            </p>
                          </div>
                        ))}
                        {ts.length > 3 && (
                          <div className="text-center pt-0.5">
                            <p className="text-[10px] font-bold text-blue-500 bg-blue-50 py-1 rounded-md">
                              +{ts.length - 3} more tasks
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────── MODAL ─────────── */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#1E3A5F]/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-xs font-semibold text-[#E8943A] uppercase tracking-widest mb-0.5">
                    {new Date(modal + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </p>
                  <h2 className="text-xl font-bold text-[#1E3A5F]">
                    {new Date(modal + "T00:00:00").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h2>
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-none stroke-current stroke-2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-medium text-slate-500">
                  {dayTasks(modal).length} task
                  {dayTasks(modal).length !== 1 ? "s" : ""}
                </span>
                {dayTasks(modal).length > 0 && (
                  <>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs font-medium text-emerald-600">
                      {dayTasks(modal).filter((t) => t.done).length} done
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Task list */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              {dayTasks(modal).length === 0 && (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6 text-slate-400 fill-none stroke-current stroke-1.5"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-400">
                    No tasks yet. Add one below!
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {dayTasks(modal).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all group shadow-sm
                      ${task.done ? "bg-slate-50 border-slate-100 opacity-75" : "bg-white border-slate-200 hover:border-[#E8943A]/30 hover:shadow-md"}`}
                  >
                    <button
                      onClick={() => toggleTask(modal, task.id)}
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 rounded-full border-2 transition-all flex items-center justify-center
                        ${task.done ? "bg-emerald-500 border-emerald-500" : "border-slate-300 hover:border-[#E8943A]"}`}
                    >
                      {task.done && (
                        <svg
                          viewBox="0 0 12 12"
                          className="w-3 h-3 fill-none stroke-white stroke-2"
                        >
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      {editingId === task.id ? (
                        <div className="flex gap-2">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(modal, task.id);
                              if (e.key === "Escape") {
                                setEditingId(null);
                              }
                            }}
                            className="flex-1 text-sm border border-[#1E3A5F]/30 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20"
                          />
                          <button
                            onClick={() => saveEdit(modal, task.id)}
                            className="text-xs font-semibold px-3 py-1.5 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#16304f]"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <p
                          className={`text-sm font-medium leading-snug break-words ${task.done ? "line-through text-slate-400" : "text-slate-700"}`}
                        >
                          {task.text}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORITY_CONFIG[task.priority]?.badge}`}
                        >
                          {PRIORITY_CONFIG[task.priority]?.label}
                        </span>
                        {task.time && (
                          <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                            <svg
                              viewBox="0 0 16 16"
                              className="w-2.5 h-2.5 fill-none stroke-current stroke-1.5"
                            >
                              <circle cx="8" cy="8" r="6" />
                              <polyline points="8,4 8,8 11,10" />
                            </svg>
                            {task.time}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingId(task.id);
                          setEditText(task.text);
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="w-3.5 h-3.5 fill-none stroke-current stroke-1.5"
                        >
                          <path d="M11.5 2.5l2 2-9 9H2.5v-2l9-9z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteTask(modal, task.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="w-3.5 h-3.5 fill-none stroke-current stroke-1.5"
                        >
                          <polyline points="2,4 14,4" />
                          <path d="M5 4V2h6v2" />
                          <path d="M3 4l1 10h8l1-10" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add task form */}
            <div className="px-6 py-5 border-t border-slate-100 flex-shrink-0 bg-slate-50/80 rounded-b-2xl">
              <div className="flex gap-2 mb-3">
                <input
                  ref={inputRef}
                  value={newTask.text}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, text: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addTask();
                  }}
                  placeholder="Add a new task…"
                  className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/20 focus:border-[#1E3A5F]/40 placeholder:text-slate-400 shadow-sm"
                />
                <button
                  onClick={addTask}
                  className="w-10 h-10 rounded-xl bg-[#1E3A5F] hover:bg-[#16304f] flex items-center justify-center transition-colors shadow-sm"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="w-4 h-4 fill-none stroke-white stroke-2"
                  >
                    <line x1="8" y1="2" x2="8" y2="14" />
                    <line x1="2" y1="8" x2="14" y2="8" />
                  </svg>
                </button>
              </div>
              <div className="flex gap-3">
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, priority: e.target.value }))
                  }
                  className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/10 text-slate-600 shadow-sm"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🔵 Medium</option>
                  <option value="high">🟠 High</option>
                </select>
                <input
                  type="time"
                  value={newTask.time}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, time: e.target.value }))
                  }
                  className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/10 text-slate-600 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scrollbar CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.5);
        }
      `,
        }}
      />
    </div>
  );
}
