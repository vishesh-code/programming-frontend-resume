import React, { useState, useRef, useEffect } from "react";
import {
  Code, CheckCircle, Clock, Eye, EyeOff, Copy, Target,
  Loader2, Trash2, Edit, ChevronLeft, ChevronRight,
  Sparkles, Send, Bot, User, Maximize2, Minimize2,
  FolderOpen, Hash, Share2, Globe, Lock, Lightbulb,
  FileText
} from "lucide-react";
import { useTheme } from "../../context/themeContext";
import apiClient from "../../utils/apiClient";
import ReactMarkdown from 'react-markdown';

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



const DESCRIPTION_PREVIEW_THRESHOLD = 160;

const markdownComponents = (darkMode) => ({
  strong: ({ node, ...props }) => <span className="font-bold text-inherit" {...props} />,
  p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed break-words whitespace-pre-line" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
  code: ({ node, inline, className, children, ...props }) => {
    const isInline = inline || !className;
    return isInline ? (
      <code className={`px-1.5 py-0.5 rounded text-[11px] font-mono break-words ${darkMode ? "bg-slate-700 text-blue-300" : "bg-blue-50 text-blue-600"}`} {...props}>
        {children}
      </code>
    ) : (
      <pre className={`p-3 mt-2 mb-2 rounded-xl text-xs font-mono overflow-x-auto ${darkMode ? "bg-slate-900 border border-slate-700 text-slate-300" : "bg-slate-100 border border-slate-200 text-slate-800"}`}>
        <code className={className} {...props}>{children}</code>
      </pre>
    );
  }
});

const ProblemsCard = ({ problem, index, onUpdate, onEdit, onDelete, onShare }) => {
  const { darkMode } = useTheme();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("solutions");
  const [isCopied, setIsCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeSolIndex, setActiveSolIndex] = useState(0);

  
  
  const [showFullDescription, setShowFullDescription] = useState(false);

  
  const [revealedHints, setRevealedHints] = useState(0);

  
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const chatEndRef = useRef(null);

  if (!problem) return null;

  const difficultyStyle = getDifficultyColor(problem.difficulty, darkMode);

  
  useEffect(() => {
    if (activeTab === "ai" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab, isAiTyping]);

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleSolved = async () => {
    try {
      setIsToggling(true);
      const response = await apiClient.patch(`/problems/${problem._id}/toggle-solved`);
      if (onUpdate) onUpdate({ _id: problem._id, solved: response.data.solved });
    } catch (error) {
      console.error("Failed to toggle solved status", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      setIsDeleting(true);
      await apiClient.delete(`/problems/${problem._id}`);
      if (onDelete) onDelete(problem._id);
    } catch (error) {
      console.error("Failed to delete problem", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setActiveSolIndex(0);
      setActiveTab("solutions");
      setIsChatExpanded(false);
      setRevealedHints(0);
    }
  };

  const handleSendAiMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const newHistory = [...chatMessages, { role: "user", text: userMessage }];

    setChatMessages(newHistory);
    setChatInput("");
    setIsAiTyping(true);

    try {
      const response = await apiClient.post('/ai/chat', {
        prompt: userMessage,
        problemContext: problem,
        chatHistory: chatMessages
      });

      setChatMessages([...newHistory, { role: "ai", text: response.data.reply }]);
    } catch (error) {
      setChatMessages([...newHistory, { role: "ai", text: "❌ Sorry, I encountered an error connecting to the server." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const solutionsToRender = problem.solutions?.length > 0
    ? problem.solutions
    : problem.solution ? [{ title: "Main Solution", code: problem.solution, language: "javascript" }] : [];
  const currentSolution = solutionsToRender[activeSolIndex] || { title: "", code: "", language: "javascript", time_complexity: "", space_complexity: "" };

  
  
  const currentTimeComplexity = currentSolution.time_complexity || problem.time_complexity;
  const currentSpaceComplexity = currentSolution.space_complexity || problem.space_complexity;

  const hints = problem.hints || [];
  const description = problem.description || "";
  const isLongDescription = description.length > DESCRIPTION_PREVIEW_THRESHOLD;

  return (
    <div className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"} rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 w-full overflow-hidden`}>
      <div className="p-3 sm:p-4">
        <div className="space-y-3">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">

              {/* Question Title & Serial Number */}
              <h3 className={`text-base sm:text-lg font-bold truncate w-full flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                {index ? <span className="opacity-60">{index}.</span> : null}
                {problem.question}
              </h3>

              <div className="flex items-center gap-2">
                {/* Difficulty Badge */}
                <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border w-max ${difficultyStyle.bg} ${difficultyStyle.text} ${difficultyStyle.border}`}>
                  <div className={`w-1.5 h-1.5 ${difficultyStyle.dot} rounded-full`}></div>
                  <span>{problem.difficulty}</span>
                </div>

                {/* Visibility Badge (Public/Private) */}
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider w-max ${darkMode ? "bg-slate-700 border-slate-600 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                  {problem.visibility === "Public" ? <Globe className="w-3 h-3 text-blue-500" /> : <Lock className="w-3 h-3 text-amber-500" />}
                  {problem.visibility || "Private"}
                </div>

                {/* Hint count badge */}
                {hints.length > 0 && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider w-max ${darkMode ? "bg-amber-900/20 border-amber-800/40 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                    <Lightbulb className="w-3 h-3" />
                    {hints.length} hint{hints.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>

            </div>

            {/* Quick Actions Menu */}
            <div className="flex items-center space-x-2 sm:ml-4 shrink-0">
              {onEdit && (
                <button onClick={() => onEdit(problem)} className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`} title="Edit">
                  <Edit className="h-4 w-4" />
                </button>
              )}
              {onShare && (
                <button onClick={() => onShare(problem)} className={`p-2 rounded-lg transition-all duration-200 ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-500 hover:bg-slate-100 hover:text-blue-600"}`} title="Share">
                  <Share2 className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button onClick={handleDelete} disabled={isDeleting} className={`p-2 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10`} title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              <button onClick={handleToggleSolved} disabled={isToggling} className={`p-2 rounded-lg transition-all duration-200 ${problem.solved ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200" : darkMode ? "bg-slate-700/50 text-slate-400 hover:bg-blue-900/30 hover:text-blue-400" : "bg-slate-100 text-slate-400 hover:bg-blue-50"}`} title="Toggle Solved">
                {problem.solved ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </button>

              <button onClick={toggleExpand} className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 transition-all duration-200 text-xs font-medium">
                {isExpanded ? <><EyeOff className="h-3.5 w-3.5" /><span className="hidden sm:inline">Hide</span></> : <><Eye className="h-3.5 w-3.5" /><span className="hidden sm:inline">View</span></>}
              </button>
            </div>
          </div>

          {/* 🔥 FIX: description now wraps properly (break-words + whitespace-pre-line
              so long unbroken strings never look "concatenated"), and a Show
              more/less toggle reveals the FULL text in place — nothing is ever
              permanently hidden. */}
          {description && (
            <div className="space-y-1">
              <p
                className={`${darkMode ? "text-slate-400" : "text-slate-600"} text-sm leading-relaxed break-words whitespace-pre-line ${!showFullDescription && isLongDescription ? "line-clamp-2" : ""}`}
              >
                {description}
              </p>
              {isLongDescription && (
                <button
                  type="button"
                  onClick={() => setShowFullDescription((s) => !s)}
                  className={`text-xs font-semibold hover:underline ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}

          {/* Category & Tags */}
          <div className={`flex flex-wrap items-center gap-2 pt-3 mt-1 border-t ${darkMode ? "border-slate-700/50" : "border-slate-100"}`}>
            {/* Category Chip */}
            {problem.category && problem.category.name && (
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide border ${darkMode ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" : "bg-indigo-50 text-indigo-700 border-indigo-200"}`}>
                <FolderOpen className="w-3 h-3" />
                {problem.category.name}
              </span>
            )}

            {/* Tag Chips */}
            {problem.tags && problem.tags.map((tag, i) => (
              <span key={i} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${darkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                <Hash className="w-3 h-3 opacity-60" />
                {tag.name || tag}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Expanded Section (Solutions, Hints & AI) */}
      {isExpanded && (
        <div className={`border-t flex flex-col ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-blue-100 bg-blue-50/50"}`}>

          {/* Sub-Navigation Tabs */}
          <div className={`flex items-center justify-between px-4 pt-2 border-b overflow-x-auto ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("solutions")}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "solutions" ? (darkMode ? "border-blue-500 text-blue-400" : "border-blue-600 text-blue-700") : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                <Code className="w-4 h-4" /> Solutions
              </button>
              <button
                onClick={() => setActiveTab("hints")}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "hints" ? (darkMode ? "border-amber-500 text-amber-400" : "border-amber-600 text-amber-700") : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                <Lightbulb className="w-4 h-4" /> Hints{hints.length > 0 ? ` (${hints.length})` : ""}
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === "ai" ? (darkMode ? "border-purple-500 text-purple-400" : "border-purple-600 text-purple-700") : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                <Sparkles className="w-4 h-4" /> AI Tutor
              </button>
            </div>

            {/* Expand Chat Button */}
            {activeTab === "ai" && (
              <button
                onClick={() => setIsChatExpanded(!isChatExpanded)}
                className={`p-2 mb-1 rounded-lg transition-colors flex items-center justify-center shrink-0 ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}`}
                title={isChatExpanded ? "Minimize Chat" : "Expand Chat"}
              >
                {isChatExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>

          <div className="p-3 sm:p-4">

            {/* TAB: SOLUTIONS */}
            {activeTab === "solutions" && (
              solutionsToRender.length === 0 ? (
                <p className={`text-sm italic ${darkMode ? "text-slate-400" : "text-slate-500"}`}>No solutions provided.</p>
              ) : (
                <div className="space-y-4 animate-fadeUp">
                  {/* Global Explanation — shown once, separate from the
                      problem Description above and from the code blocks
                      below (each of which holds only that approach's code). */}
                  <div className={`p-3 rounded-xl border text-sm ${darkMode ? "bg-slate-900/50 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-700"}`}>
                    <div className={`flex items-center gap-1.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      <FileText className="w-3 h-3" /> Explanation
                    </div>
                    {problem.explanation ? (
                      <ReactMarkdown components={markdownComponents(darkMode)}>
                        {problem.explanation}
                      </ReactMarkdown>
                    ) : (
                      <p className={`italic ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No explanation added for this problem yet.</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-sm font-semibold flex items-center ${darkMode ? "text-white" : "text-slate-900"}`}>
                        {currentSolution.title || `Solution ${activeSolIndex + 1}`}
                      </h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${darkMode ? "bg-slate-700 text-blue-300 border-slate-600" : "bg-blue-50 text-blue-600 border-blue-200"}`}>
                        {currentSolution.language || "javascript"}
                      </span>

                      {/* Per-solution complexity */}
                      {(currentTimeComplexity || currentSpaceComplexity) && (
                        <div className={`flex items-center gap-3 text-[11px] font-mono font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                          {currentTimeComplexity && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{currentTimeComplexity}</span>}
                          {currentSpaceComplexity && <span className="flex items-center gap-1"><Target className="h-3 w-3" />{currentSpaceComplexity}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Solutions Carousel Controls */}
                      {solutionsToRender.length > 1 && (
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border ${darkMode ? "bg-slate-900/50 border-slate-700" : "bg-white border-slate-200"}`}>
                          <button onClick={() => setActiveSolIndex(prev => Math.max(0, prev - 1))} disabled={activeSolIndex === 0} className={`p-1 rounded-md ${activeSolIndex === 0 ? "opacity-30 cursor-not-allowed" : darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><ChevronLeft className="w-4 h-4" /></button>
                          <span className={`text-[11px] font-mono font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{activeSolIndex + 1} / {solutionsToRender.length}</span>
                          <button onClick={() => setActiveSolIndex(prev => Math.min(solutionsToRender.length - 1, prev + 1))} disabled={activeSolIndex === solutionsToRender.length - 1} className={`p-1 rounded-md ${activeSolIndex === solutionsToRender.length - 1 ? "opacity-30 cursor-not-allowed" : darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><ChevronRight className="w-4 h-4" /></button>
                        </div>
                      )}
                      {/* Copy Code Button */}
                      <button onClick={() => handleCopyCode(currentSolution.code)} className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${isCopied ? "bg-emerald-100 text-emerald-700" : darkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-white text-slate-700 border hover:bg-slate-50"}`}>
                        <Copy className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{isCopied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Code only — no explanation mixed in here */}
                  <pre className={`p-3 rounded-xl overflow-x-auto text-xs font-mono border ${darkMode ? "bg-slate-900 text-slate-300 border-slate-700" : "bg-slate-900 text-slate-200 border-slate-800"}`}>
                    <code>{currentSolution.code || "
                  </pre>
                </div>
              )
            )}

            {/* TAB: HINTS */}
            {activeTab === "hints" && (
              <div className="space-y-3 animate-fadeUp">
                {hints.length === 0 ? (
                  <p className={`text-sm italic ${darkMode ? "text-slate-400" : "text-slate-500"}`}>No hints added for this problem.</p>
                ) : (
                  <>
                    <p className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      Try the problem on your own first — reveal hints one at a time if you get stuck.
                    </p>
                    {hints.map((hint, i) => {
                      const isRevealed = i < revealedHints;
                      const isNext = i === revealedHints;
                      return (
                        <div key={i}>
                          {isRevealed ? (
                            <div className={`p-3 rounded-xl border flex gap-3 ${darkMode ? "bg-amber-900/10 border-amber-800/40" : "bg-amber-50 border-amber-200"}`}>
                              <div className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${darkMode ? "bg-amber-900/40 text-amber-300" : "bg-amber-100 text-amber-700"}`}>
                                {i + 1}
                              </div>
                              <p className={`text-sm leading-relaxed break-words whitespace-pre-line ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{hint}</p>
                            </div>
                          ) : isNext ? (
                            <button
                              onClick={() => setRevealedHints((r) => r + 1)}
                              className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed text-sm font-semibold transition-colors ${darkMode ? "border-amber-800/60 text-amber-400 hover:bg-amber-900/10" : "border-amber-300 text-amber-600 hover:bg-amber-50"}`}
                            >
                              <Lightbulb className="w-4 h-4" /> Reveal Hint {i + 1}
                            </button>
                          ) : (
                            <div className={`flex items-center gap-3 p-3 rounded-xl border opacity-50 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                              <div className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${darkMode ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"}`}>
                                <Lock className="w-3 h-3" />
                              </div>
                              <span className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Hint {i + 1} locked</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* TAB: AI TUTOR */}
            {activeTab === "ai" && (
              <div className={`flex flex-col transition-all duration-300 animate-fadeUp ${isChatExpanded ? "h-[650px]" : "h-[350px]"}`}>

                <div className={`flex-1 overflow-y-auto p-3 rounded-xl border mb-3 space-y-4 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}>

                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                      <Sparkles className={`w-8 h-8 mb-2 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                      <p className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>Ask me anything about "{problem.question}"!</p>
                      <p className={`text-xs mt-1 max-w-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>I can explain the logic, analyze time complexity, or help debug your own approach.</p>
                    </div>
                  )}

                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-7 h-7 shrink-0 mt-1 rounded-full flex items-center justify-center ${msg.role === 'user' ? "bg-blue-600 text-white" : "bg-purple-600 text-white"}`}>
                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm overflow-x-auto ${msg.role === 'user' ? (darkMode ? "bg-blue-600 text-white rounded-tr-sm" : "bg-blue-600 text-white rounded-tr-sm") : (darkMode ? "bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm" : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm")}`}>
                        <ReactMarkdown components={markdownComponents(darkMode)}>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isAiTyping && (
                    <div className="flex gap-3 flex-row">
                      <div className="w-7 h-7 shrink-0 rounded-full bg-purple-600 text-white flex items-center justify-center"><Bot className="w-4 h-4" /></div>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm rounded-tl-sm flex items-center gap-1 ${darkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* AI Input Form */}
                <form onSubmit={handleSendAiMessage} className={`flex items-center gap-2 p-2 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isAiTyping}
                    placeholder="Ask about time complexity, alternative approaches..."
                    className={`flex-1 bg-transparent border-none outline-none text-sm px-2 ${darkMode ? "text-white placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isAiTyping}
                    className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemsCard;