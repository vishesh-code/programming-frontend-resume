import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  X,
  Save,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  GripVertical,
  BookOpen,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  List,
  Search,
  Download,
  CopyIcon,
  CheckCircle2,
  Circle,
  FileDown,
  Brain,
  ChevronDown,
  FileCode,
  FileText,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import apiClient from "../utils/apiClient";
import { useTheme } from "../context/themeContext";

// --- Import the QuizModule to reuse the UI ---
import QuizModule from "./Quiz";

// --- Custom Component: Code Block with Copy Button ---
const CodeBlockWithCopy = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative group">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-1.5 bg-slate-800/90 backdrop-blur text-slate-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 hover:text-white hover:scale-105 border border-slate-700 shadow-sm pdf-hide"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-2xl shadow-lg ring-1 ring-black/5 !my-6 text-sm"
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  }
  return (
    <code
      className={`${className} bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-300 px-1.5 py-0.5 rounded-md text-[0.85em] font-mono border border-slate-200 dark:border-slate-700`}
      {...props}
    >
      {children}
    </code>
  );
};

// --- Helper: Extract Headings for Table of Contents ---
const extractHeadings = (markdown) => {
  if (!markdown) return [];
  const headingRegex = /^(#{1,3})\s+(.*)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, "-");
    headings.push({ level, text, id });
  }
  return headings;
};

const createHeadingRenderer =
  (level) =>
  ({ children, ...props }) => {
    const text = React.Children.toArray(children).join("");
    const id = text.toLowerCase().replace(/[^\w]+/g, "-");
    const Tag = `h${level}`;
    return (
      <Tag id={id} className="scroll-mt-24" {...props}>
        {children}
      </Tag>
    );
  };

export default function StudyMaterial() {
  const { darkMode } = useTheme();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studyType = queryParams.get("type") || "private";
  const isPublicMode = studyType === "public";

  // Data States
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState([]);

  // Feature States
  const [searchQuery, setSearchQuery] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  // --- NEW: Download Menu & Scroll Spy States ---
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const downloadMenuRef = useRef(null);

  // Inline Note Editing States
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Modal States
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    parentId: null,
  });
  const [formData, setForm] = useState({ title: "", isPublic: false });
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const canEdit = !isPublicMode && activeTopic?.status !== "Published";

  // Handle Download Menu Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(event.target)
      ) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- NEW: Scroll Spy for Table of Contents Highlight ---
  useEffect(() => {
    if (isEditingNote || !activeNote) return;

    const scrollContainer = document.getElementById("note-scroll-area");
    if (!scrollContainer) return;

    const handleScroll = () => {
      const headings = Array.from(
        scrollContainer.querySelectorAll("h1[id], h2[id], h3[id]"),
      );
      let currentActive = "";
      for (const heading of headings) {
        const rect = heading.getBoundingClientRect();
        // 120 is roughly the height of the top toolbars
        if (rect.top <= 120) {
          currentActive = heading.id;
        } else {
          break; // Stop once we hit a heading below the threshold
        }
      }

      if (
        !currentActive &&
        headings.length > 0 &&
        scrollContainer.scrollTop === 0
      ) {
        currentActive = headings[0].id;
      }
      setActiveHeadingId(currentActive);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [activeNote, isEditingNote]);

  // 1. Fetch Top-Level Topics
  const fetchTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("/study/topics");
      const displayTopics = isPublicMode
        ? res.data.publicLibrary
        : res.data.myWorkspace;
      setTopics(displayTopics);

      if (displayTopics.length > 0) {
        const currentStillExists =
          activeTopic && displayTopics.find((t) => t._id === activeTopic._id);
        if (!currentStillExists) setActiveTopic(displayTopics[0]);
      } else {
        setActiveTopic(null);
        setMenuData([]);
        setActiveNote(null);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublicMode]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // 2. Fetch Chapters & Notes
  const fetchContent = useCallback(async () => {
    if (!activeTopic) return;
    try {
      const res = await apiClient.get(
        `/study/content?topicId=${activeTopic._id}`,
      );
      setMenuData(res.data);
      setExpandedChapters(res.data.map((ch) => ch._id)); // Auto-expand all

      const flatNotes = res.data.flatMap((ch) => ch.subtopics);
      if (activeNote && flatNotes.find((n) => n._id === activeNote._id)) {
        setActiveNote(flatNotes.find((n) => n._id === activeNote._id));
      } else if (res.data.length > 0 && res.data[0].subtopics.length > 0) {
        handleSelectNote(res.data[0].subtopics[0]);
      } else {
        handleSelectNote(null);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTopic?._id]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Handle Topic Status & Deletion
  const handleUpdateTopicStatus = async (topicId, newStatus) => {
    try {
      const res = await apiClient.put(`/study/topic/${topicId}/status`, {
        status: newStatus,
      });
      setActiveTopic(res.data);
      await fetchTopics();
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!canEdit) return;
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this ENTIRE topic?",
      )
    )
      return;
    try {
      await apiClient.delete(`/study/topic/${topicId}`);
      setActiveTopic(null);
      setActiveNote(null);
      setMenuData([]);
      await fetchTopics();
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  // Clone Topic (Forking)
  const handleCloneTopic = async () => {
    if (!activeTopic) return;
    setIsCloning(true);
    try {
      await apiClient.post(`/study/topic/${activeTopic._id}/clone`);
      alert("Topic successfully cloned to your Private Workspace!");
    } catch (error) {
      alert("Failed to clone topic.");
    } finally {
      setIsCloning(false);
    }
  };

  // Toggle Note Completion (Progress Tracking)
  const handleToggleComplete = async () => {
    if (!canEdit || !activeNote) return;
    try {
      const res = await apiClient.put(`/study/note/${activeNote._id}/complete`);
      setActiveNote(res.data);
      await fetchContent();
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  // Export as Markdown
  const handleExportMarkdown = () => {
    if (!activeNote) return;
    const element = document.createElement("a");
    const file = new Blob([activeNote.content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeNote.title.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowDownloadMenu(false);
  };

  // Export as HTML
  const handleExportHTML = () => {
    if (!activeNote) return;
    const printArea = document.getElementById("note-print-area");
    if (!printArea) return;

    const contentHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeNote.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1, h2, h3 { color: #111; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
            h1 { font-size: 2.2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            code { background-color: #f6f8fa; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 85%; }
            pre { background-color: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 6px; overflow: auto; }
            blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; margin: 0 0 16px 0; font-style: italic; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
            th, td { border: 1px solid #dfe2e5; padding: 8px 12px; }
          </style>
        </head>
        <body>
          ${printArea.innerHTML}
        </body>
      </html>
    `;
    const element = document.createElement("a");
    const file = new Blob([contentHTML], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeNote.title.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setShowDownloadMenu(false);
  };

  // Native HTML to PDF Export via Hidden Iframe
  const handleExportPDF = () => {
    if (!activeNote) return;

    const printArea = document.getElementById("note-print-area");
    if (!printArea) return;
    const contentHTML = printArea.innerHTML;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${activeNote.title}</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              .pdf-hide { display: none !important; }
            }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              line-height: 1.6; 
              color: #24292e;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
            }
            h1, h2, h3, h4 { color: #111; margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
            h1 { font-size: 2.2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h2 { font-size: 1.6em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            h3 { font-size: 1.3em; }
            p, ul, ol { margin-bottom: 16px; }
            li { margin-bottom: 4px; }
            code { background-color: #f6f8fa; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 85%; }
            pre { background-color: #1e1e1e !important; color: #d4d4d4 !important; padding: 16px; border-radius: 6px; overflow: auto; }
            pre code { background: transparent; padding: 0; color: inherit; }
            blockquote { padding: 0 1em; color: #6a737d; border-left: 0.25em solid #dfe2e5; margin: 0 0 16px 0; font-style: italic; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 16px; }
            th, td { border: 1px solid #dfe2e5; padding: 8px 12px; }
            th { background-color: #f6f8fa; font-weight: 600; }
            a { color: #0366d6; text-decoration: none; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          ${contentHTML}
        </body>
      </html>
    `);
    iframeDoc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
    setShowDownloadMenu(false);
  };

  // Generate Quiz Logic
  const handleGenerateQuiz = async () => {
    if (!activeNote || !activeNote.content) return;
    setIsGeneratingQuiz(true);
    try {
      const aiRes = await apiClient.post("/ai/generate-quiz", {
        content: activeNote.content,
        topic: activeTopic?.name || "General",
        difficulty: "Medium",
      });

      const questions = aiRes.data.questions;
      if (!questions || questions.length === 0)
        throw new Error("No questions returned.");

      setGeneratedQuiz(questions);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      alert(
        "Failed to generate quiz. Please ensure the note has enough content.",
      );
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectNote = (note) => {
    setActiveNote(note);
    setIsEditingNote(false);
    setActiveHeadingId(""); // Reset active heading when switching notes
    if (note) {
      setNoteForm({ title: note.title, content: note.content });
      if (!expandedChapters.includes(note.chapterId)) {
        setExpandedChapters((prev) => [...prev, note.chapterId]);
      }
    }
  };

  // Drag and Drop
  const onDragEnd = async (result) => {
    if (!canEdit) return;
    const { source, destination, type } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "chapter") {
      const newMenuData = Array.from(menuData);
      const [movedChapter] = newMenuData.splice(source.index, 1);
      newMenuData.splice(destination.index, 0, movedChapter);
      setMenuData(newMenuData);
      try {
        const chapterIds = newMenuData.map((ch) => ch._id);
        await apiClient.put("/study/chapters/reorder", { chapterIds });
      } catch (error) {}
    } else if (type === "note") {
      const sourceChapterIndex = menuData.findIndex(
        (ch) => ch._id === source.droppableId,
      );
      const destChapterIndex = menuData.findIndex(
        (ch) => ch._id === destination.droppableId,
      );

      const newMenuData = Array.from(menuData);
      const sourceChapter = newMenuData[sourceChapterIndex];
      const destChapter = newMenuData[destChapterIndex];

      const sourceNotes = Array.from(sourceChapter.subtopics);
      const destNotes =
        source.droppableId === destination.droppableId
          ? sourceNotes
          : Array.from(destChapter.subtopics);

      const [movedNote] = sourceNotes.splice(source.index, 1);
      movedNote.chapterId = destination.droppableId;
      destNotes.splice(destination.index, 0, movedNote);

      newMenuData[sourceChapterIndex] = {
        ...sourceChapter,
        subtopics: sourceNotes,
      };
      if (source.droppableId !== destination.droppableId) {
        newMenuData[destChapterIndex] = {
          ...destChapter,
          subtopics: destNotes,
        };
      }
      setMenuData(newMenuData);
      try {
        const updates = destNotes.map((note, index) => ({
          _id: note._id,
          chapterId: destination.droppableId,
          order: index,
        }));
        await apiClient.put("/study/notes/reorder", { updates });
      } catch (error) {}
    }
  };

  // Inline Note CRUD
  const handleCreateNote = async (chapterId) => {
    if (!canEdit) return;
    try {
      const res = await apiClient.post("/study/note", {
        chapterId,
        title: "Untitled Note",
        content: "# Start typing your notes here...",
        order: 0,
      });
      await fetchContent();
      if (!expandedChapters.includes(chapterId))
        setExpandedChapters((prev) => [...prev, chapterId]);
      setActiveNote(res.data);
      setNoteForm({ title: res.data.title, content: res.data.content });
      setIsEditingNote(true);
    } catch (error) {
      alert("Failed to create note");
    }
  };

  const handleSaveNote = async () => {
    if (!canEdit) return;
    setIsSavingNote(true);
    try {
      const res = await apiClient.put(`/study/note/${activeNote._id}`, {
        title: noteForm.title || "Untitled Note",
        content: noteForm.content,
      });
      await fetchContent();
      setActiveNote(res.data);
      setIsEditingNote(false);
    } catch (error) {
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!canEdit) return;
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await apiClient.delete(`/study/note/${noteId}`);
      await fetchContent();
      setActiveNote(null);
      setIsEditingNote(false);
    } catch (error) {}
  };

  // Modals
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingModal(true);
    try {
      if (modalConfig.type === "topic") {
        await apiClient.post("/study/topic", { name: formData.title });
        await fetchTopics();
      } else if (modalConfig.type === "chapter") {
        const resChapter = await apiClient.post("/study/chapter", {
          topicId: modalConfig.parentId,
          title: formData.title,
          order: 0,
        });
        await fetchContent();
        setExpandedChapters((prev) => [...prev, resChapter.data._id]);
      } else if (modalConfig.type === "edit-chapter") {
        await apiClient.put(`/study/chapter/${modalConfig.parentId}`, {
          title: formData.title,
        });
        await fetchContent();
      }
      closeModal();
    } catch (error) {
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!canEdit) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this chapter and all its associated notes?",
      )
    )
      return;
    try {
      await apiClient.delete(`/study/chapter/${chapterId}`);
      await fetchContent();
      if (activeNote && activeNote.chapterId === chapterId)
        handleSelectNote(null);
    } catch (error) {}
  };

  const toggleChapter = (chapterId) =>
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    );
  const openModal = (type, parentId = null, initialTitle = "") => {
    setForm({ title: initialTitle, isPublic: false });
    setModalConfig({ isOpen: true, type, parentId });
  };
  const closeModal = () =>
    setModalConfig({ isOpen: false, type: null, parentId: null });

  // Filtering & Computations
  const filteredMenuData = useMemo(() => {
    if (!searchQuery) return menuData;
    const lowerQuery = searchQuery.toLowerCase();

    return menuData
      .map((chapter) => {
        const filteredNotes = chapter.subtopics.filter(
          (note) =>
            note.title.toLowerCase().includes(lowerQuery) ||
            (note.content && note.content.toLowerCase().includes(lowerQuery)),
        );
        return { ...chapter, subtopics: filteredNotes };
      })
      .filter(
        (chapter) =>
          chapter.subtopics.length > 0 ||
          chapter.title.toLowerCase().includes(lowerQuery),
      );
  }, [menuData, searchQuery]);

  const flatNotes = filteredMenuData.flatMap((ch) => ch.subtopics);
  const currentIndex = flatNotes.findIndex((n) => n._id === activeNote?._id);
  const prevNote = currentIndex > 0 ? flatNotes[currentIndex - 1] : null;
  const nextNote =
    currentIndex >= 0 && currentIndex < flatNotes.length - 1
      ? flatNotes[currentIndex + 1]
      : null;
  const activeChapterTitle = activeNote
    ? menuData.find((ch) => ch._id === activeNote.chapterId)?.title
    : "";
  const tableOfContents = activeNote
    ? extractHeadings(isEditingNote ? noteForm.content : activeNote.content)
    : [];

  // Progress Tracking Calculation
  const totalNotes = menuData.reduce((acc, ch) => acc + ch.subtopics.length, 0);
  const completedNotes = menuData.reduce(
    (acc, ch) => acc + ch.subtopics.filter((n) => n.isCompleted).length,
    0,
  );
  const progressPercent =
    totalNotes === 0 ? 0 : Math.round((completedNotes / totalNotes) * 100);

  if (isLoading && topics.length === 0) {
    return (
      <div className="p-8 h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full border-t border-slate-200 dark:border-slate-800 relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* LEFT SIDEBAR */}
      {!focusMode && (
        <div
          className={`w-80 flex-shrink-0 overflow-y-auto border-r p-4 flex flex-col transition-all duration-300 custom-scrollbar ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}
        >
          <h2
            className={`font-bold text-lg mb-5 tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            {isPublicMode ? "Public Library" : "Private Workspace"}
          </h2>

          {/* Search Box */}
          <div className="relative mb-4">
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
            />
            <input
              type="text"
              placeholder="Search in this topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none border transition-all duration-200 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 ${darkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 shadow-sm"}`}
            />
          </div>

          <div className="flex items-center justify-between mb-4 gap-2">
            <select
              className={`text-sm font-semibold w-full p-2.5 rounded-xl border outline-none transition-colors cursor-pointer ${darkMode ? "bg-slate-800 border-slate-700 text-white hover:border-slate-600" : "bg-white border-slate-200 text-slate-800 shadow-sm hover:border-slate-300"}`}
              value={activeTopic?._id || ""}
              onChange={(e) => {
                setActiveTopic(topics.find((t) => t._id === e.target.value));
                setSearchQuery("");
              }}
            >
              <option disabled value="">
                {isPublicMode
                  ? "Select a Public Course..."
                  : "Select a Topic..."}
              </option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}{" "}
                  {t.status === "PendingReview" && !isPublicMode
                    ? "(Pending)"
                    : t.status === "Published" && !isPublicMode
                      ? "(Published)"
                      : ""}
                </option>
              ))}
            </select>
            {!isPublicMode && (
              <button
                onClick={() => openModal("topic")}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shrink-0 shadow-sm shadow-blue-600/30 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                title="Create New Topic"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress Tracker / Fork Button */}
          {activeTopic && (
            <div className="mb-4">
              {isPublicMode ? (
                <button
                  onClick={handleCloneTopic}
                  disabled={isCloning}
                  className={`w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${darkMode ? "bg-blue-900/40 text-blue-300 hover:bg-blue-900/60 border border-blue-800" : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"}`}
                >
                  {isCloning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CopyIcon className="w-4 h-4" />
                  )}
                  Duplicate to My Workspace
                </button>
              ) : (
                <div
                  className={`p-3.5 rounded-xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                >
                  <div className="flex justify-between items-center mb-2.5">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Course Progress
                    </span>
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${darkMode ? "text-blue-300 bg-blue-900/40" : "text-blue-700 bg-blue-50"}`}
                    >
                      {progressPercent}%
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Action Workflow (Only in Private Mode) */}
          {activeTopic && !isPublicMode && (
            <div className="mb-4">
              {activeTopic.status === "Private" && (
                <button
                  onClick={() =>
                    handleUpdateTopicStatus(activeTopic._id, "PendingReview")
                  }
                  className="w-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 py-2.5 rounded-xl hover:bg-amber-100 transition-all duration-200 shadow-sm"
                >
                  Submit for Global Review
                </button>
              )}
              {activeTopic.status === "PendingReview" && (
                <button
                  onClick={() =>
                    handleUpdateTopicStatus(activeTopic._id, "Private")
                  }
                  className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all duration-200 shadow-sm ${darkMode ? "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700" : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"}`}
                >
                  Cancel Review Request
                </button>
              )}
              {activeTopic.status === "Published" && (
                <button
                  onClick={() =>
                    handleUpdateTopicStatus(activeTopic._id, "Private")
                  }
                  className="w-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 py-2.5 rounded-xl hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200 shadow-sm group"
                >
                  <span className="group-hover:hidden">Published Live</span>
                  <span className="hidden group-hover:inline">
                    Unpublish & Edit
                  </span>
                </button>
              )}
              <button
                onClick={() => handleDeleteTopic(activeTopic._id)}
                className="w-full mt-2 text-xs font-bold bg-red-50 text-red-700 border border-red-200 py-2.5 rounded-xl hover:bg-red-100 transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Entire Topic
              </button>
            </div>
          )}

          {activeTopic && (
            <div className="flex items-center justify-between mb-3 mt-1">
              <h2
                className={`font-bold text-xs tracking-widest uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Chapters
              </h2>
              {canEdit && (
                <button
                  onClick={() => openModal("chapter", activeTopic._id)}
                  className={`p-1 rounded-md transition-colors ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-500 hover:bg-blue-50"}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="chapters-list"
              type="chapter"
              isDropDisabled={!canEdit}
            >
              {(provided) => (
                <div
                  className="flex flex-col gap-3 min-h-[50px] custom-scrollbar overflow-y-auto"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {filteredMenuData.map((chapter, index) => {
                    const isExpanded =
                      expandedChapters.includes(chapter._id) || searchQuery;
                    return (
                      <Draggable
                        key={chapter._id}
                        draggableId={chapter._id}
                        index={index}
                        isDragDisabled={!canEdit}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group/chapter rounded-xl border transition-all duration-200 ${snapshot.isDragging ? (darkMode ? "bg-slate-700 border-blue-500 shadow-lg" : "bg-white border-blue-400 shadow-lg") : darkMode ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/70" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"}`}
                          >
                            <div
                              className="flex items-center justify-between p-3 cursor-pointer select-none"
                              onClick={() => toggleChapter(chapter._id)}
                            >
                              <div className="flex items-center gap-1 overflow-hidden">
                                {canEdit && (
                                  <div
                                    {...provided.dragHandleProps}
                                    onClick={(e) => e.stopPropagation()}
                                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pr-1"
                                  >
                                    <GripVertical className="w-4 h-4 shrink-0" />
                                  </div>
                                )}
                                <ChevronRight
                                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""} ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                                />
                                <h3
                                  className={`font-semibold text-sm truncate pr-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}
                                >
                                  {chapter.title}
                                </h3>
                              </div>
                              {canEdit && (
                                <div
                                  className="opacity-0 group-hover/chapter:opacity-100 flex items-center transition-opacity shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() =>
                                      openModal(
                                        "edit-chapter",
                                        chapter._id,
                                        chapter.title,
                                      )
                                    }
                                    className="text-slate-400 hover:text-blue-500 p-1"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteChapter(chapter._id)
                                    }
                                    className="text-slate-400 hover:text-red-500 p-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {isExpanded && (
                              <Droppable
                                droppableId={chapter._id}
                                type="note"
                                isDropDisabled={!canEdit}
                              >
                                {(provided) => (
                                  <div className="px-3 pb-3">
                                    <ul
                                      className="flex flex-col gap-1 min-h-[5px]"
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                    >
                                      {chapter.subtopics.map(
                                        (note, noteIndex) => {
                                          const isActive =
                                            activeNote?._id === note._id;
                                          return (
                                            <Draggable
                                              key={note._id}
                                              draggableId={note._id}
                                              index={noteIndex}
                                              isDragDisabled={!canEdit}
                                            >
                                              {(provided, snapshot) => (
                                                <li
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className={`relative group flex items-center rounded-lg transition-all duration-150 ${snapshot.isDragging ? (darkMode ? "bg-slate-700 shadow-md ring-1 ring-blue-500" : "bg-white shadow-md ring-1 ring-blue-400") : isActive ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30" : "hover:bg-slate-200/70 dark:hover:bg-slate-800/80"}`}
                                                >
                                                  {canEdit && (
                                                    <div
                                                      {...provided.dragHandleProps}
                                                      className={`pl-2 pr-1 py-1.5 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 ${isActive ? "text-blue-200" : "text-slate-400"}`}
                                                    >
                                                      <GripVertical className="w-3.5 h-3.5" />
                                                    </div>
                                                  )}
                                                  <button
                                                    onClick={() =>
                                                      handleSelectNote(note)
                                                    }
                                                    className={`flex-1 flex items-center justify-between text-left py-1.5 text-sm font-medium transition-colors ${canEdit ? "pr-2" : "px-3 pr-2"} ${!isActive && darkMode ? "text-slate-400" : ""} ${!isActive && !darkMode ? "text-slate-600" : ""}`}
                                                  >
                                                    <span className="truncate">
                                                      {note.title}
                                                    </span>
                                                    {note.isCompleted && (
                                                      <CheckCircle2
                                                        className={`w-3.5 h-3.5 shrink-0 ml-1 ${isActive ? "text-blue-200" : "text-emerald-500"}`}
                                                      />
                                                    )}
                                                  </button>
                                                </li>
                                              )}
                                            </Draggable>
                                          );
                                        },
                                      )}
                                      {provided.placeholder}
                                    </ul>
                                    {canEdit && !searchQuery && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCreateNote(chapter._id);
                                        }}
                                        className={`mt-2 w-full justify-center px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 border border-dashed ${darkMode ? "border-slate-600 text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 hover:border-blue-500" : "border-slate-300 text-slate-500 hover:text-blue-600 hover:bg-blue-50/60 hover:border-blue-400"}`}
                                      >
                                        <Plus className="w-3.5 h-3.5" /> Add New
                                        Subtopic
                                      </button>
                                    )}
                                  </div>
                                )}
                              </Droppable>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {topics.length === 0 && !isLoading && (
            <div className="text-center mt-10">
              <div
                className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}
              >
                <BookOpen className="w-6 h-6 opacity-40 text-slate-500" />
              </div>
              <p
                className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}
              >
                {isPublicMode
                  ? "No public courses available."
                  : "No topics found."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div
        className={`flex-1 flex flex-col h-full overflow-hidden ${darkMode ? "bg-slate-950" : "bg-white"}`}
      >
        {activeNote ? (
          <div
            className={`flex flex-col h-full w-full ${focusMode ? "max-w-5xl mx-auto" : ""}`}
          >
            {/* Top Toolbar */}
            <div
              className={`px-6 py-3 border-b flex justify-between items-center shrink-0 backdrop-blur-sm ${darkMode ? "border-slate-800 bg-slate-950/80" : "border-slate-200 bg-white/80"}`}
            >
              {/* Breadcrumbs (Hidden in Focus Mode) */}
              {!focusMode ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 min-w-0">
                  <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-semibold text-blue-500 shrink-0">
                    {activeTopic?.name}
                  </span>
                  <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />
                  <span className="truncate max-w-[150px] md:max-w-xs">
                    {activeChapterTitle}
                  </span>
                  <ChevronRight className="w-3 h-3 shrink-0 opacity-50" />
                  <span
                    className={`truncate max-w-[150px] md:max-w-xs font-medium ${darkMode ? "text-slate-200" : "text-slate-800"}`}
                  >
                    {activeNote.title}
                  </span>
                </div>
              ) : (
                <div className="flex-1" />
              )}

              {/* Top Right Tools */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz || !activeNote.content}
                  className={`p-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 px-3 text-xs font-semibold shadow-sm hover:shadow ${darkMode ? "border-indigo-700 bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50" : "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"} disabled:opacity-50 disabled:shadow-none`}
                  title="Generate Practice Quiz with AI"
                >
                  {isGeneratingQuiz ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Brain className="w-3.5 h-3.5" />
                  )}
                  {isGeneratingQuiz ? "Generating..." : "Generate Quiz"}
                </button>

                {/* --- NEW: DOWNLOAD DROPDOWN --- */}
                <div className="relative" ref={downloadMenuRef}>
                  <button
                    onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                    className={`p-1.5 rounded-lg border transition-all duration-200 flex items-center gap-1.5 px-3 text-xs font-semibold ${darkMode ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                    title="Download Note"
                  >
                    <Download className="w-3.5 h-3.5" /> Download{" "}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${showDownloadMenu ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showDownloadMenu && (
                    <div
                      className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border overflow-hidden z-50 animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                    >
                      <div className="py-1">
                        <button
                          onClick={handleExportPDF}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors font-medium ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"}`}
                        >
                          <FileDown className="w-4 h-4 text-rose-500" /> PDF
                          Document
                        </button>
                        <button
                          onClick={handleExportMarkdown}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors font-medium ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"}`}
                        >
                          <FileText className="w-4 h-4 text-blue-500" />{" "}
                          Markdown File
                        </button>
                        <button
                          onClick={handleExportHTML}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors font-medium ${darkMode ? "text-slate-300 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"}`}
                        >
                          <FileCode className="w-4 h-4 text-amber-500" /> HTML
                          File
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={`p-1.5 rounded-lg border transition-all duration-200 ${darkMode ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                  title={focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                >
                  {focusMode ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Note Header (Title & Actions) */}
            <div className="px-8 lg:px-12 pt-8 pb-4 shrink-0 flex justify-between items-center">
              {isEditingNote && canEdit ? (
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) =>
                    setNoteForm({ ...noteForm, title: e.target.value })
                  }
                  className={`flex-1 text-4xl font-black tracking-tight bg-transparent outline-none border-b-2 focus:border-blue-500 transition-colors duration-200 pb-1 mr-4 ${darkMode ? "text-white border-slate-700" : "text-slate-900 border-slate-200"}`}
                  placeholder="Note Title"
                />
              ) : (
                <div className="flex-1">
                  {/* Empty div just to push the action buttons to the right. */}
                </div>
              )}

              {canEdit && (
                <div className="flex gap-2 items-center shrink-0">
                  {isEditingNote ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditingNote(false);
                          setNoteForm({
                            title: activeNote.title,
                            content: activeNote.content,
                          });
                        }}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNote}
                        disabled={isSavingNote}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm shadow-sm shadow-blue-600/30 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                      >
                        {isSavingNote ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}{" "}
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditingNote(true)}
                        className={`p-2 rounded-xl transition-all duration-200 ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}
                        title="Edit Markdown"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(activeNote._id)}
                        className={`p-2 rounded-xl transition-all duration-200 ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"}`}
                        title="Delete Note"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Note Body with Split-Pane OR Reading Mode */}
            <div className="flex flex-1 overflow-hidden">
              {/* Split-Pane Editing View */}
              {isEditingNote && canEdit ? (
                <div className="flex w-full h-full px-8 lg:px-12 pb-8 gap-6">
                  {/* Markdown Input */}
                  <textarea
                    value={noteForm.content}
                    onChange={(e) =>
                      setNoteForm({ ...noteForm, content: e.target.value })
                    }
                    className={`w-1/2 h-full p-6 rounded-2xl resize-none outline-none font-mono text-sm leading-relaxed border shadow-inner transition-colors focus:border-blue-500/50 ${darkMode ? "bg-slate-900 border-slate-800 text-slate-300 placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400"}`}
                    placeholder="Type Markdown here..."
                  />
                  {/* Live Preview */}
                  <div
                    className={`w-1/2 h-full overflow-y-auto p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"} custom-scrollbar`}
                  >
                    <h1
                      className={`text-4xl font-black tracking-tight mb-8 ${darkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {noteForm.title}
                    </h1>
                    <article
                      className={`prose max-w-none ${darkMode ? "prose-invert" : ""}`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: CodeBlockWithCopy,
                          h1: createHeadingRenderer(1),
                          h2: createHeadingRenderer(2),
                          h3: createHeadingRenderer(3),
                        }}
                      >
                        {noteForm.content || "*Live preview...*"}
                      </ReactMarkdown>
                    </article>
                  </div>
                </div>
              ) : (
                /* Read-Only View with Right-side Table of Contents */
                <div className="flex w-full h-full">
                  {/* Main Reading Area (Wrapped for PDF Generation & ScrollSpy) */}
                  <div
                    id="note-scroll-area"
                    className="flex-1 h-full overflow-y-auto px-8 lg:px-12 pb-24 custom-scrollbar scroll-smooth"
                  >
                    <div id="note-print-area" className="max-w-3xl mx-auto p-2">
                      <h1
                        className={`text-4xl font-black tracking-tight mb-8 ${darkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {activeNote.title}
                      </h1>
                      <article
                        className={`prose max-w-none ${darkMode ? "prose-invert" : ""}`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code: CodeBlockWithCopy,
                            h1: createHeadingRenderer(1),
                            h2: createHeadingRenderer(2),
                            h3: createHeadingRenderer(3),
                          }}
                        >
                          {activeNote.content || "*Empty Note*"}
                        </ReactMarkdown>
                      </article>
                    </div>

                    {/* Navigation Footer (Bottom of Reading Area) */}
                    <div
                      className={`max-w-3xl mx-auto mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${darkMode ? "border-slate-800" : "border-slate-200"}`}
                    >
                      {canEdit && (
                        <button
                          onClick={handleToggleComplete}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border shadow-sm ${activeNote.isCompleted ? (darkMode ? "bg-emerald-900/30 text-emerald-400 border-emerald-800" : "bg-emerald-50 text-emerald-600 border-emerald-200") : darkMode ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                        >
                          {activeNote.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                          {activeNote.isCompleted
                            ? "Completed"
                            : "Mark as Completed"}
                        </button>
                      )}

                      <div className="flex gap-2 ml-auto">
                        {prevNote && (
                          <button
                            onClick={() => handleSelectNote(prevNote)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${darkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-700"}`}
                          >
                            <ArrowLeft className="w-4 h-4" /> Previous
                          </button>
                        )}
                        {nextNote && (
                          <button
                            onClick={() => handleSelectNote(nextNote)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${darkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-700"}`}
                          >
                            Next <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Auto-Generated Table of Contents (Right Sidebar - Hidden in Focus Mode) */}
                  {!focusMode && (
                    <div
                      className={`hidden xl:block w-64 flex-shrink-0 border-l p-6 overflow-y-auto custom-scrollbar transition-all duration-300 ${darkMode ? "border-slate-800" : "border-slate-200"}`}
                    >
                      <div className="sticky top-0">
                        <h4
                          className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                        >
                          <List className="w-3.5 h-3.5" /> On this page
                        </h4>
                        {tableOfContents.length > 0 ? (
                          <ul
                            className={`flex flex-col gap-1 border-l ${darkMode ? "border-slate-800" : "border-slate-200"}`}
                          >
                            {tableOfContents.map((heading, i) => {
                              const isActiveHeading =
                                activeHeadingId === heading.id;
                              return (
                                <li
                                  key={i}
                                  style={{
                                    paddingLeft: `${0.9 + (heading.level - 1) * 0.75}rem`,
                                  }}
                                  className={`text-sm py-1 -ml-px border-l-2 transition-colors duration-150 ${
                                    isActiveHeading
                                      ? darkMode
                                        ? "border-blue-400 text-blue-400 font-medium"
                                        : "border-blue-600 text-blue-600 font-medium"
                                      : `border-transparent ${darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`
                                  }`}
                                >
                                  <a
                                    href={`#${heading.id}`}
                                    className="block truncate"
                                  >
                                    {heading.text}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p
                            className={`text-sm italic ${darkMode ? "text-slate-600" : "text-slate-400"}`}
                          >
                            No headings found.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full items-center justify-center text-slate-500 gap-3">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center ${darkMode ? "bg-slate-900" : "bg-slate-50"}`}
            >
              <BookOpen className="w-7 h-7 opacity-30" />
            </div>
            <p className="text-sm">
              {isPublicMode
                ? "Select a public course from the sidebar to start reading."
                : "Select a note or add a new one to start writing."}
            </p>
          </div>
        )}
      </div>

      {/* CRUD MODAL */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold capitalize tracking-tight">
                {modalConfig.type === "edit-chapter"
                  ? "Edit Chapter Name"
                  : `Add New ${modalConfig.type}`}
              </h3>
              <button
                onClick={closeModal}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-slate-200" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  {modalConfig.type === "topic" ? "Topic Name" : "Chapter Name"}
                </label>
                <input
                  autoFocus
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setForm({ ...formData, title: e.target.value })
                  }
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingModal}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-sm shadow-blue-600/30 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmittingModal && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}{" "}
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI QUIZ INLINE MODAL */}
      {generatedQuiz && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div
            className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative custom-scrollbar ${darkMode ? "bg-slate-900 border border-slate-700" : "bg-slate-50 border border-slate-200"}`}
          >
            <button
              onClick={() => setGeneratedQuiz(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-slate-200 dark:bg-slate-800 rounded-full hover:bg-red-500 hover:text-white shadow-sm transition-all duration-200 hover:scale-105"
              title="Close Quiz"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 sm:p-10">
              <QuizModule
                embeddedQuestions={generatedQuiz}
                onClose={() => setGeneratedQuiz(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
