import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useTheme } from "../context/themeContext";
import apiClient from "../utils/apiClient";

const Icon = ({ name, className = "h-4 w-4" }) => {
  const paths = {
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    "clock-off": (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5" />
        <path d="M4 4l16 16" />
      </>
    ),
    check: <path d="M5 12l4 4L19 7" />,
    x: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </>
    ),
    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </>
    ),
    flag: (
      <>
        <path d="M5 21V4" />
        <path d="M5 4h12l-3 4 3 4H5" />
      </>
    ),
    refresh: (
      <>
        <path d="M4 4v5h5" />
        <path d="M20 20v-5h-5" />
        <path d="M5.5 9A7 7 0 0118 7.5" />
        <path d="M18.5 15A7 7 0 016 16.5" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v4a4 4 0 01-8 0V4z" />
        <path d="M8 5H5a2 2 0 002 4" />
        <path d="M16 5h3a2 2 0 01-2 4" />
        <path d="M10 16h4" />
        <path d="M12 12v4" />
        <path d="M8 20h8" />
      </>
    ),
    bolt: <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />,
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? null}
    </svg>
  );
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const letters = ["A", "B", "C", "D", "E", "F"];

function TimerRing({ secondsLeft, totalSeconds, size = 48, darkMode }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = totalSeconds > 0 ? clamp(secondsLeft / totalSeconds, 0, 1) : 0;
  const offset = circumference * (1 - ratio);
  const urgent = secondsLeft <= 5 && secondsLeft > 0;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={darkMode ? "text-slate-700" : "text-slate-200"}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-[stroke-dashoffset] duration-300 ease-linear ${urgent ? "text-red-500" : "text-blue-600"}`}
        />
      </svg>
      <span
        className={`absolute text-xs font-bold tabular-nums ${urgent ? "text-red-500" : darkMode ? "text-blue-400" : "text-blue-600"}`}
      >
        {secondsLeft}
      </span>
    </div>
  );
}

function SetupScreen({ onStart, isFetching, darkMode, isEmbedded }) {
  const [mode, setMode] = useState(null);
  const [seconds, setSeconds] = useState(30);
  const [customSeconds, setCustomSeconds] = useState("");
  const [selectedTopics, setSelectedTopics] = useState(["All"]);
  const [difficulty, setDifficulty] = useState("All");

  const presets = [15, 30, 45, 60];
  const availableTopics = [
    "All",
    "Arrays",
    "Hashing",
    "Recursion",
    "Sorting",
    "Graphs",
  ];

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, "").slice(0, 3);
    setCustomSeconds(val);
    if (val) setSeconds(clamp(parseInt(val, 10), 5, 300));
  };

  const handleTopicToggle = (topic) => {
    if (topic === "All") {
      setSelectedTopics(["All"]);
      return;
    }
    let newTopics = selectedTopics.filter((t) => t !== "All");
    if (newTopics.includes(topic)) {
      newTopics = newTopics.filter((t) => t !== topic);
      if (newTopics.length === 0) newTopics = ["All"];
    } else {
      newTopics.push(topic);
    }
    setSelectedTopics(newTopics);
  };

  return (
    <div className="mx-auto w-full max-w-xl animate-fadeUp">
      <div className="mb-8 text-center">
        <h2
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          {isEmbedded ? "Real-Time AI Practice" : "Set up your quiz"}
        </h2>
        <p
          className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
        >
          {isEmbedded
            ? "Test your knowledge on the notes you just read."
            : "Choose your topics, difficulty, and pacing."}
        </p>
      </div>

      {/* Hide filters if embedded inside the Study Material Modal */}
      {!isEmbedded && (
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
          <div
            className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Difficulty
            </p>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={`w-full rounded-xl px-4 py-2.5 text-sm border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? "bg-slate-900 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div
            className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Topics (Multiple)
            </p>
            <div className="flex flex-wrap gap-2">
              {availableTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTopicToggle(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border ${selectedTopics.includes(t) ? "border-blue-600 bg-blue-600 text-white shadow-sm" : darkMode ? "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setMode("timed")}
          className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all ${mode === "timed" ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/50 dark:bg-slate-800" : darkMode ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm"}`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${mode === "timed" ? (darkMode ? "bg-blue-900/30 border-blue-800 text-blue-400" : "bg-blue-100 border-blue-200 text-blue-700") : darkMode ? "bg-slate-700 border-slate-600 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"}`}
          >
            <Icon name="clock" />
          </span>
          <div>
            <p
              className={`font-bold ${darkMode ? "text-slate-200" : "text-slate-900"}`}
            >
              Timed mode
            </p>
            <p
              className={`mt-1 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Auto-advances when the clock runs out.
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMode("untimed")}
          className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all ${mode === "untimed" ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/50 dark:bg-slate-800" : darkMode ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm"}`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${mode === "untimed" ? (darkMode ? "bg-blue-900/30 border-blue-800 text-blue-400" : "bg-blue-100 border-blue-200 text-blue-700") : darkMode ? "bg-slate-700 border-slate-600 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500"}`}
          >
            <Icon name="clock-off" />
          </span>
          <div>
            <p
              className={`font-bold ${darkMode ? "text-slate-200" : "text-slate-900"}`}
            >
              Untimed mode
            </p>
            <p
              className={`mt-1 text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              No clock pressure. Move when ready.
            </p>
          </div>
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${mode === "timed" ? "mt-5 max-h-96 opacity-100" : "mt-0 max-h-0 opacity-0"}`}
      >
        {mode === "timed" && (
          <div
            className={`rounded-2xl border p-5 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Seconds per question
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setSeconds(p);
                    setCustomSeconds("");
                  }}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors border ${seconds === p && !customSeconds ? "border-blue-600 bg-blue-600 text-white shadow-md" : darkMode ? "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`}
                >
                  {p}s
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={!mode || isFetching}
        onClick={() => onStart({ mode, seconds }, selectedTopics, difficulty)}
        className={`mt-6 w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all duration-200 ${mode && !isFetching ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md" : darkMode ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700" : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"}`}
      >
        <span>{isFetching ? "Loading Questions..." : "Begin Quiz"}</span>
        {!isFetching && <Icon name="arrowRight" className="h-4 w-4" />}
      </button>
    </div>
  );
}

function QuestionScreen({
  question,
  index,
  total,
  mode,
  durationSeconds,
  onAnswer,
  onNext,
  selectedIndex,
  isAnswered,
  score,
  darkMode,
}) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const intervalRef = useRef(null);
  const hasAdvancedRef = useRef(false);
  const isTimed = mode === "timed";

  useEffect(() => {
    hasAdvancedRef.current = false;
    setSecondsLeft(durationSeconds);
  }, [index, durationSeconds]);

  useEffect(() => {
    if (!isTimed || isAnswered) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isTimed, isAnswered, index]);

  useEffect(() => {
    if (isTimed && !hasAdvancedRef.current && secondsLeft === 0) {
      hasAdvancedRef.current = true;
      const t = setTimeout(() => onNext(), 900);
      return () => clearTimeout(t);
    }
  }, [secondsLeft, isTimed, onNext]);

  useEffect(() => {
    if (isTimed && isAnswered && !hasAdvancedRef.current) {
      hasAdvancedRef.current = true;
      clearInterval(intervalRef.current);
      const t = setTimeout(() => onNext(), 1100);
      return () => clearTimeout(t);
    }
  }, [isAnswered, isTimed, onNext]);

  const progressPct = ((index + 1) / total) * 100;

  return (
    <div className="mx-auto w-full animate-fadeUp">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold ${darkMode ? "bg-slate-800 border border-slate-700 text-slate-300" : "bg-white border border-slate-200 text-slate-700 shadow-sm"}`}
          >
            {index + 1}
          </div>
          <div>
            <p
              className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              Question {index + 1} of {total}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {question.topic && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${darkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-700"}`}
                >
                  {question.topic}
                </span>
              )}
              {question.difficulty && (
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${darkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                >
                  {question.difficulty}
                </span>
              )}
            </div>
          </div>
        </div>
        {isTimed ? (
          <TimerRing
            secondsLeft={secondsLeft}
            totalSeconds={durationSeconds}
            darkMode={darkMode}
          />
        ) : (
          <span
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${darkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-500 shadow-sm"}`}
          >
            <Icon name="clock-off" className="h-3.5 w-3.5" />
            No timer
          </span>
        )}
      </div>

      <div
        className={`h-1.5 w-full overflow-hidden rounded-full mb-6 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div
        className={`rounded-2xl border p-6 sm:p-8 shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <h3
          className={`text-lg sm:text-xl font-bold leading-relaxed mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          {question.question}
        </h3>
        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correctIndex;
            const isSelected = i === selectedIndex;
            let btnClass =
              "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group";
            let textClass = "text-sm sm:text-base font-semibold";
            let letterClass =
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors";
            if (isAnswered) {
              if (isCorrect) {
                btnClass += darkMode
                  ? " border-emerald-500/50 bg-emerald-500/10"
                  : " border-emerald-500 bg-emerald-50";
                textClass += darkMode
                  ? " text-emerald-300"
                  : " text-emerald-800";
                letterClass +=
                  " border-emerald-500 text-emerald-600 dark:text-emerald-400";
              } else if (isSelected) {
                btnClass += darkMode
                  ? " border-rose-500/50 bg-rose-500/10"
                  : " border-rose-500 bg-rose-50";
                textClass += darkMode ? " text-rose-300" : " text-rose-800";
                letterClass +=
                  " border-rose-500 text-rose-600 dark:text-rose-400";
              } else {
                btnClass += darkMode
                  ? " border-slate-700 opacity-40"
                  : " border-slate-100 opacity-50";
                textClass += darkMode ? " text-slate-500" : " text-slate-500";
                letterClass +=
                  " border-slate-300 text-slate-400 dark:border-slate-700";
              }
            } else {
              btnClass += darkMode
                ? " border-slate-700 bg-slate-800/50 hover:border-blue-500 hover:bg-slate-800"
                : " border-slate-100 bg-slate-50 hover:border-blue-400 hover:bg-white hover:shadow-sm";
              textClass += darkMode
                ? " text-slate-300 group-hover:text-blue-400"
                : " text-slate-700 group-hover:text-blue-700";
              letterClass += darkMode
                ? " border-slate-600 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-400"
                : " border-slate-300 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600";
            }
            return (
              <button
                key={i}
                type="button"
                disabled={isAnswered}
                onClick={() => onAnswer(i)}
                className={btnClass}
              >
                <span className={letterClass}>
                  {isAnswered && isCorrect ? (
                    <Icon name="check" className="h-4 w-4" />
                  ) : isAnswered && isSelected && !isCorrect ? (
                    <Icon name="x" className="h-4 w-4" />
                  ) : (
                    letters[i]
                  )}
                </span>
                <span className={textClass}>{opt}</span>
              </button>
            );
          })}
        </div>
        {isAnswered && question.explanation && (
          <div
            className={`mt-6 rounded-xl border p-4 animate-fadeUp ${darkMode ? "bg-blue-900/10 border-blue-900/30" : "bg-blue-50/50 border-blue-100"}`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${darkMode ? "text-blue-400" : "text-blue-700"}`}
            >
              Explanation
            </p>
            <p
              className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}
            >
              {question.explanation}
            </p>
          </div>
        )}
        {isTimed && secondsLeft === 0 && selectedIndex === null && (
          <div
            className={`mt-6 rounded-xl border p-4 text-sm font-semibold ${darkMode ? "bg-amber-900/10 border-amber-900/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-800"}`}
          >
            Time's up moving to the next question.
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span
          className={`text-sm font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}
        >
          Score:{" "}
          <span className={darkMode ? "text-blue-400" : "text-blue-600"}>
            {score}
          </span>{" "}
          / {total}
        </span>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md font-semibold text-sm transition-all"
        >
          <span>{index + 1 === total ? "View Results" : "Next Question"}</span>
          <Icon name="arrowRight" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ResultsScreen({
  total,
  score,
  mode,
  onRestart,
  missed,
  darkMode,
  onClose,
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const tier =
    pct >= 80
      ? "Excellent work!"
      : pct >= 50
        ? "Solid effort!"
        : "Keep practicing!";
  return (
    <div className="mx-auto w-full max-w-xl text-center animate-fadeUp">
      <div
        className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transform -rotate-3 ${darkMode ? "bg-slate-800 border-2 border-slate-700" : "bg-white border border-blue-100"}`}
      >
        <Icon
          name="trophy"
          className={`h-10 w-10 ${darkMode ? "text-yellow-400" : "text-blue-600"}`}
        />
      </div>
      <h2
        className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
      >
        {tier}
      </h2>
      <p
        className={`text-sm mb-8 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
      >
        You completed the {mode} quiz. Here's how you performed.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div
          className={`p-5 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <p
            className={`text-3xl font-black ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
          >
            {score}
          </p>
          <p
            className={`text-xs font-bold uppercase tracking-wider mt-1.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
          >
            Correct
          </p>
        </div>
        <div
          className={`p-5 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <p
            className={`text-3xl font-black ${darkMode ? "text-rose-400" : "text-rose-600"}`}
          >
            {total - score}
          </p>
          <p
            className={`text-xs font-bold uppercase tracking-wider mt-1.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
          >
            Missed
          </p>
        </div>
        <div
          className={`p-5 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <p
            className={`text-3xl font-black ${darkMode ? "text-blue-400" : "text-blue-600"}`}
          >
            {pct}%
          </p>
          <p
            className={`text-xs font-bold uppercase tracking-wider mt-1.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
          >
            Accuracy
          </p>
        </div>
      </div>

      {missed.length > 0 && (
        <div
          className={`p-6 rounded-2xl border shadow-sm text-left mb-8 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <p
            className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
          >
            <Icon
              name="flag"
              className={`h-4 w-4 ${darkMode ? "text-amber-400" : "text-amber-500"}`}
            />
            Suggested review topics
          </p>
          <div className="flex flex-wrap gap-2">
            {missed.map((m, i) => (
              <span
                key={i}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${darkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md font-semibold transition-all"
        >
          <Icon name="refresh" className="h-4 w-4" />
          <span>Try Again</span>
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border font-semibold transition-all ${darkMode ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`}
          >
            <span>Finish & Close</span>
          </button>
        )}
      </div>
    </div>
  );
}

// --- UPDATED EXPORT ---
export default function QuizModule({
  onFinish,
  embeddedQuestions = null,
  onClose = null,
}) {
  const { darkMode } = useTheme();

  const [stage, setStage] = useState("setup");
  const [config, setConfig] = useState({ mode: null, seconds: 30 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const [questions, setQuestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const total = questions.length;
  const currentQuestion = questions[currentIndex];

  const score = useMemo(() => {
    return Object.entries(answers).reduce((acc, [qIdx, ansIdx]) => {
      const q = questions[Number(qIdx)];
      return q && ansIdx === q.correctIndex ? acc + 1 : acc;
    }, 0);
  }, [answers, questions]);

  const missedTopics = useMemo(() => {
    const set = new Set();
    Object.entries(answers).forEach(([qIdx, ansIdx]) => {
      const q = questions[Number(qIdx)];
      if (q && ansIdx !== q.correctIndex && q.topic) set.add(q.topic);
    });
    return Array.from(set);
  }, [answers, questions]);

  const handleStart = async (cfg, selectedTopics, difficulty) => {
    // If embedded mode is active, skip DB fetch and use passed questions
    if (embeddedQuestions) {
      setQuestions(embeddedQuestions);
      setConfig(cfg);
      setAnswers({});
      setCurrentIndex(0);
      setStage("active");
      return;
    }

    // Normal DB Fetch
    setIsFetching(true);
    try {
      const params = {};
      if (!selectedTopics.includes("All")) {
        params.topics = selectedTopics.join(",");
      }
      if (difficulty !== "All") {
        params.difficulty = difficulty;
      }
      const response = await apiClient.get("/quiz", { params });

      if (response.data.length === 0) {
        alert("No questions found for the selected criteria.");
        setIsFetching(false);
        return;
      }
      setQuestions(response.data);
      setConfig(cfg);
      setAnswers({});
      setCurrentIndex(0);
      setStage("active");
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAnswer = useCallback(
    (optionIndex) => {
      setAnswers((prev) => {
        if (prev[currentIndex] !== undefined) return prev;
        return { ...prev, [currentIndex]: optionIndex };
      });
    },
    [currentIndex],
  );

  const handleNext = useCallback(() => {
    setAnswers((prev) => {
      if (prev[currentIndex] === undefined)
        return { ...prev, [currentIndex]: null };
      return prev;
    });
    setCurrentIndex((idx) => {
      const nextIdx = idx + 1;
      if (nextIdx >= total) {
        setStage("results");
        return idx;
      }
      return nextIdx;
    });
  }, [currentIndex, total]);

  useEffect(() => {
    if (stage === "results" && onFinish) onFinish({ score, total, answers });
  }, [stage, onFinish, score, total, answers]);

  const handleRestart = () => {
    setStage("setup");
    setAnswers({});
    setCurrentIndex(0);
  };

  const isAnswered = answers[currentIndex] !== undefined;
  const selectedIndex = answers[currentIndex] ?? null;

  return (
    <div className="flex flex-col h-full w-full">
      {stage === "setup" && (
        <SetupScreen
          onStart={handleStart}
          isFetching={isFetching}
          darkMode={darkMode}
          isEmbedded={!!embeddedQuestions}
        />
      )}
      {stage === "active" && currentQuestion && (
        <QuestionScreen
          key={currentIndex}
          question={currentQuestion}
          index={currentIndex}
          total={total}
          mode={config.mode}
          durationSeconds={config.seconds}
          onAnswer={handleAnswer}
          onNext={handleNext}
          selectedIndex={selectedIndex}
          isAnswered={isAnswered}
          score={score}
          darkMode={darkMode}
        />
      )}
      {stage === "results" && (
        <ResultsScreen
          total={total}
          score={score}
          mode={config.mode}
          onRestart={handleRestart}
          missed={missedTopics}
          darkMode={darkMode}
          onClose={onClose}
        />
      )}
    </div>
  );
}
