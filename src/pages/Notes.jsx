// import React, { useState, useEffect } from "react";
// import { useTheme } from "../context/themeContext";
// import { Plus, Trash2, Save, FileText, Clock } from "lucide-react";

// const Notes = () => {
//   const { darkMode } = useTheme();

//   // State to handle our notes
//   const [notes, setNotes] = useState([]);
//   const [activeNoteId, setActiveNoteId] = useState(null);
  
//   // State for the currently edited note
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   // Load notes from local storage on mount
//   useEffect(() => {
//     const savedNotes = JSON.parse(localStorage.getItem("my-notes") || "[]");
//     setNotes(savedNotes);
//     if (savedNotes.length > 0) {
//       setActiveNote(savedNotes[0]);
//     } else {
//       createNewNote();
//     }
//   }, []);

//   // Save changes to localStorage whenever `notes` array updates
//   useEffect(() => {
//     if (notes.length > 0) {
//         localStorage.setItem("my-notes", JSON.stringify(notes));
//     }
//   }, [notes]);

//   const setActiveNote = (note) => {
//     setActiveNoteId(note.id);
//     setTitle(note.title);
//     setContent(note.content);
//   };

//   const createNewNote = () => {
//     const newNote = {
//       id: Date.now().toString(),
//       title: "Untitled Note",
//       content: "",
//       updatedAt: new Date().toISOString()
//     };
//     setNotes([newNote, ...notes]);
//     setActiveNote(newNote);
//   };

//   const handleSave = () => {
//     const updatedNotes = notes.map(note => {
//       if (note.id === activeNoteId) {
//         return { ...note, title: title || "Untitled Note", content, updatedAt: new Date().toISOString() };
//       }
//       return note;
//     });
//     setNotes(updatedNotes);
//   };

//   const handleDelete = (id, e) => {
//     e.stopPropagation();
//     const remainingNotes = notes.filter(n => n.id !== id);
//     setNotes(remainingNotes);
//     localStorage.setItem("my-notes", JSON.stringify(remainingNotes));
    
//     if (remainingNotes.length > 0) {
//       setActiveNote(remainingNotes[0]);
//     } else {
//       createNewNote();
//     }
//   };

//   const activeNoteData = notes.find(n => n.id === activeNoteId);

//   return (
//     <div className={`flex h-[calc(100vh-140px)] rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
      
//       {/* Sidebar: Note List */}
//       <div className={`w-1/3 max-w-xs flex flex-col border-r ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50/50"}`}>
//         <div className="p-4 border-b border-inherit flex items-center justify-between">
//           <h2 className={`font-bold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>My Notes</h2>
//           <button 
//             onClick={createNewNote}
//             className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//           >
//             <Plus className="w-4 h-4" />
//           </button>
//         </div>
        
//         <div className="flex-1 overflow-y-auto p-3 space-y-2">
//           {notes.map((note) => (
//             <div 
//               key={note.id}
//               onClick={() => setActiveNote(note)}
//               className={`p-3 rounded-xl cursor-pointer border transition-all group ${
//                 activeNoteId === note.id 
//                   ? darkMode ? "bg-blue-900/30 border-blue-700 text-blue-100" : "bg-blue-50 border-blue-200 text-blue-900"
//                   : darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
//               }`}
//             >
//               <div className="flex items-start justify-between">
//                 <div className="min-w-0 pr-2">
//                   <h4 className="font-semibold text-sm truncate">{note.title}</h4>
//                   <p className={`text-xs mt-1 flex items-center gap-1 ${activeNoteId === note.id ? (darkMode ? "text-blue-300" : "text-blue-600") : (darkMode ? "text-slate-500" : "text-slate-400")}`}>
//                     <Clock className="w-3 h-3" />
//                     {new Date(note.updatedAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <button 
//                   onClick={(e) => handleDelete(note.id, e)}
//                   className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Panel: Note Editor */}
//       <div className={`flex-1 flex flex-col ${darkMode ? "bg-slate-900" : "bg-white"}`}>
//         {activeNoteData ? (
//           <>
//             <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
//               <div className="flex items-center gap-3 w-full max-w-xl">
//                 <FileText className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
//                 <input 
//                   type="text" 
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   onBlur={handleSave}
//                   placeholder="Note Title"
//                   className={`w-full bg-transparent text-xl font-bold outline-none placeholder-slate-400 ${darkMode ? "text-white" : "text-slate-900"}`}
//                 />
//               </div>
//               <button 
//                 onClick={handleSave}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//               >
//                 <Save className="w-4 h-4" /> Save
//               </button>
//             </div>
            
//             <div className="flex-1 p-6">
//               <textarea 
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 onBlur={handleSave}
//                 placeholder="Start writing your thoughts..."
//                 className={`w-full h-full resize-none bg-transparent outline-none leading-relaxed ${darkMode ? "text-slate-200 placeholder-slate-600" : "text-slate-700 placeholder-slate-300"}`}
//               />
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
//              <FileText className="w-12 h-12 mb-4 opacity-50" />
//              <p>Select a note or create a new one</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notes;



// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useTheme } from "../context/themeContext";
// import {
//   Plus, Trash2, Save, FileText, Clock, Search,
//   Bold, Italic, Underline, Strikethrough,
//   List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
//   Heading1, Heading2, Link, Undo, Redo, Quote,
//   ChevronDown, Star, StarOff, Tag, X, Check
// } from "lucide-react";

// /* ─── Toolbar Button ─────────────────────────────────── */
// const ToolBtn = ({ onClick, active, title, children, disabled }) => (
//   <button
//     onMouseDown={(e) => { e.preventDefault(); onClick && onClick(); }}
//     disabled={disabled}
//     title={title}
//     className={`p-1.5 rounded-md transition-all text-sm ${
//       active
//         ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
//         : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
//     } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
//   >
//     {children}
//   </button>
// );

// const Divider = () => (
//   <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 self-center" />
// );

// /* ─── Tag Pill ─────────────────────────────────────── */
// const TagPill = ({ label, onRemove, color = "blue" }) => {
//   const colors = {
//     blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
//     purple: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
//     green: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
//     amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
//     rose: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
//   };
//   return (
//     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
//       {label}
//       {onRemove && (
//         <button onMouseDown={(e) => { e.preventDefault(); onRemove(); }} className="opacity-60 hover:opacity-100">
//           <X className="w-3 h-3" />
//         </button>
//       )}
//     </span>
//   );
// };

// /* ─── Word / Char counter ────────────────────────────── */
// const getStats = (html) => {
//   const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
//   const words = text ? text.split(" ").length : 0;
//   const chars = text.length;
//   return { words, chars };
// };

// /* ─── Tag color cycling ──────────────────────────────── */
// const TAG_COLORS = ["blue", "purple", "green", "amber", "rose"];

// /* ─── Main Component ─────────────────────────────────── */
// const Notes = () => {
//   const { darkMode } = useTheme();
//   const editorRef = useRef(null);
//   const searchRef = useRef(null);

//   const [notes, setNotes] = useState([]);
//   const [activeNoteId, setActiveNoteId] = useState(null);
//   const [title, setTitle] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [tagInput, setTagInput] = useState("");
//   const [showTagInput, setShowTagInput] = useState(false);
//   const [saved, setSaved] = useState(true);
//   const [activeFormats, setActiveFormats] = useState({});
//   const [wordCount, setWordCount] = useState({ words: 0, chars: 0 });

//   /* ─── Load from localStorage ─── */
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("my-notes-v2") || "[]");
//     setNotes(saved);
//     if (saved.length > 0) activateNote(saved[0]);
//     else createNote();
//   }, []);

//   /* ─── Persist ─── */
//   useEffect(() => {
//     if (notes.length > 0) {
//       localStorage.setItem("my-notes-v2", JSON.stringify(notes));
//     }
//   }, [notes]);

//   /* ─── Track formatting state ─── */
//   const updateFormatState = useCallback(() => {
//     const formats = {};
//     ["bold","italic","underline","strikeThrough"].forEach(cmd => {
//       formats[cmd] = document.queryCommandState(cmd);
//     });
//     setActiveFormats(formats);

//     if (editorRef.current) {
//       const html = editorRef.current.innerHTML;
//       setWordCount(getStats(html));
//       setSaved(false);
//     }
//   }, []);

//   /* ─── Exec command ─── */
//   const exec = (cmd, value = null) => {
//     editorRef.current?.focus();
//     document.execCommand(cmd, false, value);
//     updateFormatState();
//   };

//   /* ─── Activate note ─── */
//   const activateNote = (note) => {
//     setActiveNoteId(note.id);
//     setTitle(note.title);
//     setSaved(true);
//     if (editorRef.current) {
//       editorRef.current.innerHTML = note.content || "";
//       setWordCount(getStats(note.content || ""));
//     }
//   };

//   /* ─── Create note ─── */
//   const createNote = () => {
//     const n = {
//       id: Date.now().toString(),
//       title: "Untitled Note",
//       content: "",
//       tags: [],
//       starred: false,
//       updatedAt: new Date().toISOString(),
//     };
//     setNotes(prev => [n, ...prev]);
//     activateNote(n);
//   };

//   /* ─── Save ─── */
//   const handleSave = useCallback(() => {
//     if (!activeNoteId) return;
//     const content = editorRef.current?.innerHTML || "";
//     setNotes(prev =>
//       prev.map(n =>
//         n.id === activeNoteId
//           ? { ...n, title: title || "Untitled Note", content, updatedAt: new Date().toISOString() }
//           : n
//       )
//     );
//     setSaved(true);
//   }, [activeNoteId, title]);

//   /* ─── Auto-save debounce ─── */
//   useEffect(() => {
//     const timer = setTimeout(handleSave, 1200);
//     return () => clearTimeout(timer);
//   }, [title, handleSave]);

//   /* ─── Delete ─── */
//   const deleteNote = (id, e) => {
//     e.stopPropagation();
//     const remaining = notes.filter(n => n.id !== id);
//     setNotes(remaining);
//     localStorage.setItem("my-notes-v2", JSON.stringify(remaining));
//     if (remaining.length > 0) activateNote(remaining[0]);
//     else createNote();
//   };

//   /* ─── Star toggle ─── */
//   const toggleStar = (id, e) => {
//     e.stopPropagation();
//     setNotes(prev => prev.map(n => n.id === id ? { ...n, starred: !n.starred } : n));
//   };

//   /* ─── Add tag ─── */
//   const addTag = () => {
//     const tag = tagInput.trim().toLowerCase();
//     if (!tag || !activeNoteId) return;
//     setNotes(prev =>
//       prev.map(n =>
//         n.id === activeNoteId && !n.tags.includes(tag)
//           ? { ...n, tags: [...n.tags, tag] }
//           : n
//       )
//     );
//     setTagInput("");
//     setShowTagInput(false);
//   };

//   const removeTag = (tag) => {
//     setNotes(prev =>
//       prev.map(n =>
//         n.id === activeNoteId
//           ? { ...n, tags: n.tags.filter(t => t !== tag) }
//           : n
//       )
//     );
//   };

//   /* ─── Insert link ─── */
//   const insertLink = () => {
//     const url = window.prompt("Enter URL:", "https://");
//     if (url) exec("createLink", url);
//   };

//   /* ─── Filtered notes ─── */
//   const filtered = notes
//     .sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0))
//     .filter(n => {
//       if (!searchQuery) return true;
//       const q = searchQuery.toLowerCase();
//       return (
//         n.title.toLowerCase().includes(q) ||
//         n.content?.replace(/<[^>]*>/g, " ").toLowerCase().includes(q) ||
//         n.tags.some(t => t.includes(q))
//       );
//     });

//   const activeNote = notes.find(n => n.id === activeNoteId);

//   return (
//     <div
//       className={`flex h-[calc(100vh-140px)] rounded-2xl border shadow-sm overflow-hidden ${
//         darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
//       }`}
//     >
//       {/* ── Sidebar ─────────────────────────────────────── */}
//       <div
//         className={`w-72 flex-shrink-0 flex flex-col border-r ${
//           darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50"
//         }`}
//       >
//         {/* Header */}
//         <div className={`p-4 border-b flex items-center justify-between ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
//           <h2 className={`font-bold text-base ${darkMode ? "text-white" : "text-slate-900"}`}>
//             Notes
//             <span className={`ml-2 text-xs font-normal px-1.5 py-0.5 rounded-full ${darkMode ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-500"}`}>
//               {notes.length}
//             </span>
//           </h2>
//           <div className="flex items-center gap-1.5">
//             <button
//               onClick={() => { setShowSearch(s => !s); setTimeout(() => searchRef.current?.focus(), 50); }}
//               className={`p-1.5 rounded-lg transition-colors ${
//                 showSearch
//                   ? darkMode ? "bg-slate-700 text-blue-400" : "bg-blue-50 text-blue-600"
//                   : darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-200"
//               }`}
//             >
//               <Search className="w-4 h-4" />
//             </button>
//             <button
//               onClick={createNote}
//               className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//             >
//               <Plus className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Search bar */}
//         {showSearch && (
//           <div className={`px-3 py-2 border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
//             <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm ${
//               darkMode ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-300"
//             }`}>
//               <Search className={`w-3.5 h-3.5 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
//               <input
//                 ref={searchRef}
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 placeholder="Search notes…"
//                 className={`flex-1 bg-transparent outline-none text-sm ${
//                   darkMode ? "text-slate-200 placeholder-slate-600" : "text-slate-700 placeholder-slate-400"
//                 }`}
//               />
//               {searchQuery && (
//                 <button onClick={() => setSearchQuery("")}>
//                   <X className="w-3 h-3 text-slate-400" />
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Note list */}
//         <div className="flex-1 overflow-y-auto p-2 space-y-1">
//           {filtered.length === 0 ? (
//             <div className={`text-center py-10 text-sm ${darkMode ? "text-slate-600" : "text-slate-400"}`}>
//               No notes found
//             </div>
//           ) : (
//             filtered.map(note => (
//               <div
//                 key={note.id}
//                 onClick={() => activateNote(note)}
//                 className={`group p-3 rounded-xl cursor-pointer border transition-all ${
//                   activeNoteId === note.id
//                     ? darkMode
//                       ? "bg-blue-950/50 border-blue-800 text-blue-100"
//                       : "bg-blue-50 border-blue-200 text-blue-900"
//                     : darkMode
//                     ? "bg-slate-800/60 border-slate-700/60 hover:bg-slate-700/70 text-slate-300"
//                     : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
//                 }`}
//               >
//                 <div className="flex items-start justify-between gap-1">
//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-center gap-1.5">
//                       {note.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
//                       <h4 className="font-semibold text-sm truncate">{note.title}</h4>
//                     </div>
//                     <p className={`text-xs mt-1 truncate ${
//                       activeNoteId === note.id
//                         ? darkMode ? "text-blue-400" : "text-blue-500"
//                         : darkMode ? "text-slate-600" : "text-slate-400"
//                     }`}>
//                       {note.content
//                         ? note.content.replace(/<[^>]*>/g, " ").trim().slice(0, 50) || "No content"
//                         : "No content"}
//                     </p>
//                     <div className="flex items-center gap-1 mt-1.5 flex-wrap">
//                       <span className={`text-xs flex items-center gap-0.5 ${darkMode ? "text-slate-600" : "text-slate-400"}`}>
//                         <Clock className="w-2.5 h-2.5" />
//                         {new Date(note.updatedAt).toLocaleDateString()}
//                       </span>
//                       {note.tags.slice(0, 2).map((t, i) => (
//                         <span key={t} className={`text-xs px-1.5 py-0 rounded-full border ${
//                           darkMode ? "bg-slate-900 border-slate-700 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-500"
//                         }`}>{t}</span>
//                       ))}
//                     </div>
//                   </div>
//                   <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button onClick={(e) => toggleStar(note.id, e)} className={`p-1 rounded ${darkMode ? "hover:bg-slate-600" : "hover:bg-slate-200"}`}>
//                       {note.starred
//                         ? <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
//                         : <StarOff className="w-3.5 h-3.5 text-slate-400" />}
//                     </button>
//                     <button onClick={(e) => deleteNote(note.id, e)} className={`p-1 rounded ${darkMode ? "hover:bg-slate-600" : "hover:bg-slate-200"}`}>
//                       <Trash2 className="w-3.5 h-3.5 text-red-400" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* ── Editor Panel ──────────────────────────────────── */}
//       {activeNote ? (
//         <div className={`flex-1 flex flex-col min-w-0 ${darkMode ? "bg-slate-900" : "bg-white"}`}>

//           {/* Title bar */}
//           <div className={`px-6 py-3 border-b flex items-center gap-3 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
//             <FileText className={`w-4 h-4 flex-shrink-0 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
//             <input
//               type="text"
//               value={title}
//               onChange={e => { setTitle(e.target.value); setSaved(false); }}
//               onBlur={handleSave}
//               placeholder="Note Title"
//               className={`flex-1 bg-transparent text-lg font-bold outline-none placeholder-slate-300 min-w-0 ${
//                 darkMode ? "text-white placeholder-slate-600" : "text-slate-900"
//               }`}
//             />
//             <div className="flex items-center gap-2 flex-shrink-0">
//               <span className={`text-xs flex items-center gap-1 transition-all ${
//                 saved
//                   ? darkMode ? "text-slate-600" : "text-slate-300"
//                   : darkMode ? "text-amber-400" : "text-amber-500"
//               }`}>
//                 {saved ? <><Check className="w-3 h-3" />Saved</> : "Unsaved"}
//               </span>
//               <button
//                 onClick={handleSave}
//                 className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//               >
//                 <Save className="w-3.5 h-3.5" /> Save
//               </button>
//             </div>
//           </div>

//           {/* Tags bar */}
//           <div className={`px-6 py-2 border-b flex items-center gap-2 flex-wrap min-h-[40px] ${
//             darkMode ? "border-slate-800" : "border-slate-100"
//           }`}>
//             <Tag className={`w-3.5 h-3.5 flex-shrink-0 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
//             {activeNote.tags.map((t, i) => (
//               <TagPill
//                 key={t}
//                 label={t}
//                 color={TAG_COLORS[i % TAG_COLORS.length]}
//                 onRemove={() => removeTag(t)}
//               />
//             ))}
//             {showTagInput ? (
//               <div className="flex items-center gap-1">
//                 <input
//                   autoFocus
//                   value={tagInput}
//                   onChange={e => setTagInput(e.target.value)}
//                   onKeyDown={e => { if (e.key === "Enter") addTag(); if (e.key === "Escape") setShowTagInput(false); }}
//                   onBlur={() => { addTag(); setShowTagInput(false); }}
//                   placeholder="tag name"
//                   className={`w-24 text-xs px-2 py-0.5 rounded-full border outline-none ${
//                     darkMode
//                       ? "bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-600"
//                       : "bg-white border-slate-300 text-slate-700 placeholder-slate-400"
//                   }`}
//                 />
//               </div>
//             ) : (
//               <button
//                 onClick={() => setShowTagInput(true)}
//                 className={`text-xs px-2 py-0.5 rounded-full border border-dashed transition-colors ${
//                   darkMode
//                     ? "border-slate-700 text-slate-600 hover:text-slate-400 hover:border-slate-500"
//                     : "border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400"
//                 }`}
//               >
//                 + tag
//               </button>
//             )}
//           </div>

//           {/* Toolbar */}
//           <div className={`px-4 py-1.5 border-b flex items-center flex-wrap gap-0.5 ${
//             darkMode ? "border-slate-800 bg-slate-850" : "border-slate-100 bg-slate-50/80"
//           }`}>
//             <ToolBtn onClick={() => exec("undo")} title="Undo"><Undo className="w-4 h-4" /></ToolBtn>
//             <ToolBtn onClick={() => exec("redo")} title="Redo"><Redo className="w-4 h-4" /></ToolBtn>
//             <Divider />
//             <ToolBtn onClick={() => exec("bold")} active={activeFormats.bold} title="Bold"><Bold className="w-4 h-4" /></ToolBtn>
//             <ToolBtn onClick={() => exec("italic")} active={activeFormats.italic} title="Italic"><Italic className="w-4 h-4" /></ToolBtn>
//             <ToolBtn onClick={() => exec("underline")} active={activeFormats.underline} title="Underline"><Underline className="w-4 h-4" /></ToolBtn>
//             <ToolBtn onClick={() => exec("strikeThrough")} active={activeFormats.strikeThrough} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolBtn>
//             <Divider />
//             <ToolBtn onClick={() => exec("formatBlock", "h1")} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolBtn>
//             <ToolBtn onClick={() => exec("formatBlock", "h2")} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolBtn>
//             <ToolBtn onClick={() => exec("formatBlock", "blockquote")} title="Blockquote"><Quote className="w-4 h-4" /></ToolBtn>
//             <Divider />
//             <ToolBtn onClick={() => exec("insertUnorderedList")} title="Bullet List"><List className="w-4 h-4" /></ToolBtn>
//             <ToolBtn onClick={() => exec("insertOrderedList")} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolBtn>
//             <Divider />
//             <ToolBtn onClick={() => exec("justifyLeft")} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolBtn>
//             <ToolBtn onClick={() => exec("justifyCenter")} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolBtn>
//             <ToolBtn onClick={() => exec("justifyRight")} title="Align Right"><AlignRight className="w-4 h-4" /></ToolBtn>
//             <Divider />
//             <ToolBtn onClick={insertLink} title="Insert Link"><Link className="w-4 h-4" /></ToolBtn>
//           </div>

//           {/* Content editable area */}
//           <div className="flex-1 overflow-y-auto px-8 py-6">
//             <div
//               ref={editorRef}
//               contentEditable
//               suppressContentEditableWarning
//               onInput={updateFormatState}
//               onKeyUp={updateFormatState}
//               onMouseUp={updateFormatState}
//               onBlur={handleSave}
//               data-placeholder="Start writing your thoughts…"
//               className={`min-h-full outline-none leading-relaxed prose max-w-none
//                 ${darkMode
//                   ? "text-slate-200 prose-invert prose-headings:text-white prose-blockquote:border-blue-700 prose-blockquote:text-slate-400"
//                   : "text-slate-700 prose-headings:text-slate-900 prose-blockquote:border-blue-400 prose-blockquote:text-slate-500"
//                 }
//                 prose-h1:text-2xl prose-h1:font-bold prose-h1:mt-6 prose-h1:mb-3
//                 prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-5 prose-h2:mb-2
//                 prose-blockquote:pl-4 prose-blockquote:border-l-4 prose-blockquote:italic
//                 prose-li:my-0.5
//                 focus:outline-none
//                 [&:empty]:before:content-[attr(data-placeholder)]
//                 [&:empty]:before:text-slate-300
//                 [&:empty]:before:dark:text-slate-600
//                 [&:empty]:before:pointer-events-none
//               `}
//             />
//           </div>

//           {/* Status bar */}
//           <div className={`px-6 py-2 border-t flex items-center justify-between text-xs ${
//             darkMode ? "border-slate-800 text-slate-600" : "border-slate-100 text-slate-400"
//           }`}>
//             <span>{wordCount.words} word{wordCount.words !== 1 ? "s" : ""} · {wordCount.chars} chars</span>
//             <span className="flex items-center gap-1">
//               <Clock className="w-3 h-3" />
//               Last edited {new Date(activeNote.updatedAt).toLocaleString()}
//             </span>
//           </div>
//         </div>
//       ) : (
//         <div className={`flex-1 flex flex-col items-center justify-center ${darkMode ? "text-slate-600" : "text-slate-300"}`}>
//           <FileText className="w-12 h-12 mb-4 opacity-40" />
//           <p className="text-sm">Select a note or create a new one</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notes;




import React, { useState, useEffect } from "react";
import { useTheme } from "../context/themeContext";
import { Plus, Trash2, Save, FileText, Clock } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

// Toolbar configuration for the rich text editor
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
    ["clean"], // remove formatting button
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

const Notes = () => {
  const { darkMode } = useTheme();

  // State to handle our notes
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);

  // State for the currently edited note
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("my-notes") || "[]");
    setNotes(savedNotes);
    if (savedNotes.length > 0) {
      setActiveNote(savedNotes[0]);
    } else {
      createNewNote();
    }
  }, []);

  // Save changes to localStorage whenever `notes` array updates
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem("my-notes", JSON.stringify(notes));
    }
  }, [notes]);

  // Auto-save effect (saves 1 second after user stops typing)
  useEffect(() => {
    if (!activeNoteId) return;
    
    setSaveStatus("Saving...");
    const timeoutId = setTimeout(() => {
      handleSave();
      setSaveStatus("Saved");
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [title, content]);

  const setActiveNote = (note) => {
    setActiveNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "Untitled Document",
      content: "",
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const handleSave = () => {
    if (!activeNoteId) return;
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id === activeNoteId) {
          return {
            ...note,
            title: title || "Untitled Document",
            content,
            updatedAt: new Date().toISOString(),
          };
        }
        return note;
      })
    );
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    const remainingNotes = notes.filter((n) => n.id !== id);
    setNotes(remainingNotes);
    localStorage.setItem("my-notes", JSON.stringify(remainingNotes));

    if (remainingNotes.length > 0) {
      setActiveNote(remainingNotes[0]);
    } else {
      createNewNote();
    }
  };

  const activeNoteData = notes.find((n) => n.id === activeNoteId);

  // Helper to strip HTML tags for the sidebar preview
  const stripHtml = (html) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "No content...";
  };

  return (
    <div
      className={`flex h-[calc(100vh-140px)] rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
    >
      {/* Inject Custom CSS to style React Quill for Dark Mode and better heights 
      */}
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
        
        /* Dark Mode Overrides for Quill */
        .dark .ql-toolbar {
          background-color: #1e293b; /* slate-800 */
          border-color: #334155 !important; /* slate-700 */
        }
        .dark .ql-container {
          border-color: #334155 !important; /* slate-700 */
          color: #e2e8f0; /* slate-200 */
        }
        .dark .ql-picker-label { color: #cbd5e1; }
        .dark .ql-stroke { stroke: #cbd5e1; }
        .dark .ql-fill { fill: #cbd5e1; }
        .dark .ql-picker-options { 
          background-color: #1e293b;
          border-color: #334155;
        }
        .dark .ql-editor.ql-blank::before {
          color: #475569; /* slate-600 */
        }
      `}</style>

      {/* Sidebar: Note List */}
      <div
        className={`w-1/3 max-w-[280px] flex flex-col border-r shrink-0 ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50/50"}`}
      >
        <div className="p-4 border-b border-inherit flex items-center justify-between">
          <h2 className={`font-bold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}>
            My Notes
          </h2>
          <button
            onClick={createNewNote}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={`p-3 rounded-xl cursor-pointer border transition-all group ${
                activeNoteId === note.id
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
                  <h4 className="font-semibold text-sm truncate">{note.title}</h4>
                  <p className="text-xs truncate mt-1 opacity-70">
                    {stripHtml(note.content)}
                  </p>
                  <p
                    className={`text-[10px] mt-2 flex items-center gap-1 ${activeNoteId === note.id ? (darkMode ? "text-blue-300" : "text-blue-600") : darkMode ? "text-slate-500" : "text-slate-400"}`}
                  >
                    <Clock className="w-3 h-3" />
                    {new Date(note.updatedAt).toLocaleDateString()}{" "}
                    {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(note.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Panel: Note Editor */}
      <div className={`flex-1 flex flex-col ${darkMode ? "bg-slate-900" : "bg-white"}`}>
        {activeNoteData ? (
          <>
            {/* Editor Header */}
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
                <span className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {saveStatus}
                </span>
                <button
                  onClick={() => { handleSave(); setSaveStatus("Saved"); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>

            {/* Rich Text Editor Body */}
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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;