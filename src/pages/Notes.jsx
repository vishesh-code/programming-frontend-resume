import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useTheme } from "../context/themeContext";
import {
  Plus,
  Trash2,
  Save,
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import apiClient from "../utils/apiClient";

// ==========================================
// Toolbar configuration for the rich text editor
// (module-level: created once, not re-created every render)
// ==========================================
const editorModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "image", "code-block"],
    ["clean"],
  ],
};

const editorFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "color",
  "background",
  "align",
  "link",
  "image",
  "code-block",
];

const AUTOSAVE_DELAY_MS = 800;

// Strips HTML tags for the sidebar preview without touching the DOM
// (the old version used document.createElement + innerHTML per note per render — expensive at scale).
const stripHtml = (html) => {
  if (!html) return "No content yet…";
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text || "No content yet…";
};

// ==========================================
// TOAST SYSTEM (lightweight, local to this module)
// ==========================================
let toastSeq = 0;

const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback(
    (id) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );
  const push = useCallback(
    (message, type = "error") => {
      const id = ++toastSeq;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );
  return { toasts, push, dismiss };
};

const ToastStack = ({ toasts, dismiss, darkMode }) => (
  <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
    {toasts.map((t) => (
      <div
        key={t.id}
        onClick={() => dismiss(t.id)}
        className={`flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-lg border cursor-pointer animate-fadeUp ${
          darkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-slate-200"
        }`}
      >
        {t.type === "success" && (
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
        )}
        {t.type === "error" && (
          <XCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
        )}
        {t.type === "info" && (
          <AlertCircle className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
        )}
        <span
          className={`text-sm ${darkMode ? "text-slate-200" : "text-slate-700"}`}
        >
          {t.message}
        </span>
      </div>
    ))}
  </div>
);

// ==========================================
// MAIN COMPONENT
// Owns only the note LIST + which note is active. It never holds the
// title/content being typed, so keystrokes in the editor can't force
// this component (and the sidebar) to re-render.
// ==========================================
const Notes = () => {
  const { darkMode } = useTheme();
  const { toasts, push, dismiss } = useToasts();

  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false); // guards against double-click creating two notes
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title } | null

  // ------------------------------------------
  // Load notes once on mount. No auto-create here — an empty list is a
  // legitimate, valid state and renders its own empty view below.
  // ------------------------------------------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get("/notes");
        if (cancelled) return;
        setNotes(data);
        setActiveNoteId(data.length > 0 ? data[0]._id : null);
      } catch (error) {
        if (!cancelled)
          push("Couldn't load your notes. Try refreshing the page.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [push]);

  const createNewNote = useCallback(async () => {
    if (creating) return; // prevent duplicate notes from a double-click
    setCreating(true);
    try {
      const { data: newNote } = await apiClient.post("/notes", {
        title: "Untitled Document",
        content: "",
      });
      setNotes((prev) => [newNote, ...prev]);
      setActiveNoteId(newNote._id);
    } catch (error) {
      push("Couldn't create a new note. Please try again.");
    } finally {
      setCreating(false);
    }
  }, [creating, push]);

  // Called by NoteEditor whenever a save succeeds — merges just that one
  // note's fresh data back into the list.
  const handleNoteSaved = useCallback((updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === updatedNote._id ? updatedNote : n)),
    );
  }, []);

  const handleSaveError = useCallback((message) => push(message), [push]);

  const requestDelete = useCallback((note) => {
    setDeleteTarget({ id: note._id, title: note.title || "Untitled Document" });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    try {
      await apiClient.delete(`/notes/${id}`);
      setNotes((prev) => {
        const remaining = prev.filter((n) => n._id !== id);
        // Only move the selection if the note we deleted was the active one.
        setActiveNoteId((currentActiveId) =>
          currentActiveId === id
            ? (remaining[0]?._id ?? null)
            : currentActiveId,
        );
        return remaining;
      });
    } catch (error) {
      push("Couldn't delete that note. Please try again.");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, push]);

  const activeNote = useMemo(
    () => notes.find((n) => n._id === activeNoteId) || null,
    [notes, activeNoteId],
  );

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-[calc(100vh-140px)] rounded-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div
      className={`flex h-[calc(100vh-140px)] rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
    >
      <QuillThemeStyles />

      <NotesSidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onSelect={setActiveNoteId}
        onCreate={createNewNote}
        onDeleteRequest={requestDelete}
        creating={creating}
        darkMode={darkMode}
      />

      {activeNote ? (
        // key forces a clean remount when switching notes, so the editor's
        // local title/content state always starts from the right note
        // instead of needing a prop-sync effect (and the bugs that invites).
        <NoteEditor
          key={activeNote._id}
          note={activeNote}
          darkMode={darkMode}
          onSaved={handleNoteSaved}
          onError={handleSaveError}
        />
      ) : (
        <EmptyState
          darkMode={darkMode}
          onCreate={createNewNote}
          creating={creating}
        />
      )}

      <DeleteConfirm
        target={deleteTarget}
        darkMode={darkMode}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <ToastStack toasts={toasts} dismiss={dismiss} darkMode={darkMode} />
    </div>
  );
};

// ==========================================
// SIDEBAR (memoized — re-renders only when notes/activeNoteId/darkMode change,
// never because someone is typing in the editor)
// ==========================================
const NotesSidebar = React.memo(function NotesSidebar({
  notes,
  activeNoteId,
  onSelect,
  onCreate,
  onDeleteRequest,
  creating,
  darkMode,
}) {
  return (
    <div
      className={`w-1/3 max-w-[280px] flex flex-col border-r shrink-0 ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50/50"}`}
    >
      <div className="p-4 border-b border-inherit flex items-center justify-between">
        <h2
          className={`font-bold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          My Notes
          <span
            className={`ml-2 text-xs font-normal px-1.5 py-0.5 rounded-full align-middle ${darkMode ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-500"}`}
          >
            {notes.length}
          </span>
        </h2>
        <button
          onClick={onCreate}
          disabled={creating}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          title="New note"
        >
          {creating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {notes.length === 0 ? (
          <p
            className={`text-sm italic text-center p-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
          >
            No notes yet.
          </p>
        ) : (
          notes.map((note) => (
            <NoteListItem
              key={note._id}
              note={note}
              isActive={activeNoteId === note._id}
              onSelect={onSelect}
              onDeleteRequest={onDeleteRequest}
              darkMode={darkMode}
            />
          ))
        )}
      </div>
    </div>
  );
});

// One row in the sidebar. Memoized so editing the active note only re-renders
// that note's own row (via the `notes` update after save), not the rest of the list.
const NoteListItem = React.memo(function NoteListItem({
  note,
  isActive,
  onSelect,
  onDeleteRequest,
  darkMode,
}) {
  const preview = useMemo(() => stripHtml(note.content), [note.content]);
  const timestamp = useMemo(() => {
    const d = new Date(note.updatedAt);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }, [note.updatedAt]);

  return (
    <div
      onClick={() => onSelect(note._id)}
      className={`p-3 rounded-xl cursor-pointer border transition-all group ${
        isActive
          ? darkMode
            ? "bg-blue-900/30 border-blue-700 text-blue-100"
            : "bg-blue-50 border-blue-200 text-blue-900"
          : darkMode
            ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 pr-2">
          <h4 className="font-semibold text-sm truncate">
            {note.title || "Untitled Document"}
          </h4>
          <p className="text-xs truncate mt-1 opacity-70">{preview}</p>
          <p
            className={`text-[10px] mt-2 flex items-center gap-1 ${isActive ? (darkMode ? "text-blue-300" : "text-blue-600") : darkMode ? "text-slate-500" : "text-slate-400"}`}
          >
            <Clock className="w-3 h-3" />
            {timestamp}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteRequest(note);
          }}
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1 shrink-0"
          title="Delete note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

// ==========================================
// EDITOR PANEL
// Owns title/content locally so typing never touches the parent's state
// (and therefore never re-renders the sidebar) until a save actually lands.
// ==========================================
const NoteEditor = React.memo(function NoteEditor({
  note,
  darkMode,
  onSaved,
  onError,
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saveStatus, setSaveStatus] = useState("Saved");

  // Always-current values for the debounce timer / unmount flush, so timers
  // never act on a stale closure of title/content.
  const latestRef = useRef({ title: note.title, content: note.content });
  const savedRef = useRef({ title: note.title, content: note.content }); // last value confirmed saved
  const timeoutRef = useRef(null);

  useEffect(() => {
    latestRef.current = { title, content };
  }, [title, content]);

  const persist = useCallback(async () => {
    const { title: t, content: c } = latestRef.current;
    if (t === savedRef.current.title && c === savedRef.current.content) return;

    setSaveStatus("Saving...");
    try {
      const { data } = await apiClient.put(`/notes/${note._id}`, {
        title: t || "Untitled Document",
        content: c,
      });
      savedRef.current = { title: data.title, content: data.content };
      setSaveStatus("Saved");
      onSaved(data);
    } catch (error) {
      setSaveStatus("Failed to save");
      onError("Couldn't save your note. Check your connection and try again.");
    }
  }, [note._id, onSaved, onError]);

  // Debounced autosave whenever title/content change.
  useEffect(() => {
    if (
      title === savedRef.current.title &&
      content === savedRef.current.content
    )
      return;
    setSaveStatus("Unsaved changes…");
    timeoutRef.current = setTimeout(persist, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [title, content, persist]);

  // Flush any pending edit on unmount (e.g. the user switches to another
  // note before the debounce fires) so nothing is silently lost.
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      const { title: t, content: c } = latestRef.current;
      if (t !== savedRef.current.title || c !== savedRef.current.content) {
        apiClient
          .put(`/notes/${note._id}`, {
            title: t || "Untitled Document",
            content: c,
          })
          .catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSave = () => {
    clearTimeout(timeoutRef.current);
    persist();
  };

  return (
    <div
      className={`flex-1 flex flex-col ${darkMode ? "bg-slate-900" : "bg-white"}`}
    >
      <div
        className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? "border-slate-700" : "border-slate-200"}`}
      >
        <div className="flex items-center gap-3 w-full max-w-xl">
          <FileText
            className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            className={`w-full bg-transparent text-xl font-bold outline-none placeholder-slate-400 ${darkMode ? "text-white" : "text-slate-900"}`}
          />
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            {saveStatus}
          </span>
          <button
            onClick={handleManualSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={editorModules}
            formats={editorFormats}
            placeholder="Start writing your amazing notes here..."
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
});

// ==========================================
// EMPTY STATE — shown when there are zero notes, or none selected.
// No more silently auto-creating a note on the user's behalf.
// ==========================================
const EmptyState = ({ darkMode, onCreate, creating }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
    <FileText className="w-16 h-16 mb-4 opacity-50" />
    <p className="text-lg font-medium mb-4">No note selected</p>
    <button
      onClick={onCreate}
      disabled={creating}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
    >
      {creating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Create a note
    </button>
  </div>
);

// ==========================================
// DELETE CONFIRMATION
// ==========================================
const DeleteConfirm = ({ target, darkMode, onCancel, onConfirm }) => {
  if (!target) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-2xl shadow-xl border p-6 text-center ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}
      >
        <div
          className={`mx-auto w-11 h-11 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </div>
        <h3 className="text-base font-bold mb-1">Delete note?</h3>
        <p
          className={`text-sm mb-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
        >
          "{target.title}" will be permanently removed. This can't be undone.
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm font-medium text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Quill theming, hoisted to a component so the <style> tag's string isn't
// rebuilt on every render of the main component.
const QuillThemeStyles = React.memo(() => (
  <style>{`
    .ql-container {
      font-family: inherit !important;
      font-size: 1rem !important;
      height: calc(100% - 42px) !important;
      border-bottom-left-radius: 0.75rem;
      border-bottom-right-radius: 0.75rem;
    }
    .ql-toolbar {
      border-top-left-radius: 0.75rem;
      border-top-right-radius: 0.75rem;
    }
    .dark .ql-toolbar {
      background-color: #1e293b;
      border-color: #334155 !important;
    }
    .dark .ql-container {
      border-color: #334155 !important;
      color: #e2e8f0;
    }
    .dark .ql-picker-label { color: #cbd5e1; }
    .dark .ql-stroke { stroke: #cbd5e1; }
    .dark .ql-fill { fill: #cbd5e1; }
    .dark .ql-picker-options {
      background-color: #1e293b;
      border-color: #334155;
    }
    .dark .ql-editor.ql-blank::before {
      color: #475569;
    }
  `}</style>
));

export default Notes;
