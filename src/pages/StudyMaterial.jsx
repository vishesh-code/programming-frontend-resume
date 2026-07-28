// import React, { useState, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Dark theme for code
// import apiClient from "../utils/apiClient";
// import { useTheme } from "../context/themeContext";

// export default function StudyMaterial() {
//   const { darkMode } = useTheme();
//   const [menuData, setMenuData] = useState([]);
//   const [activeNote, setActiveNote] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch the menu structure on load
//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const response = await apiClient.get('/study/menu');
//         setMenuData(response.data);
        
//         // Auto-select the first note of the first chapter if it exists
//         if (response.data.length > 0 && response.data[0].subtopics.length > 0) {
//           setActiveNote(response.data[0].subtopics[0]);
//         }
//       } catch (error) {
//         console.error("Error fetching study materials:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchMenu();
//   }, []);

//   if (isLoading) {
//     return <div className="p-8 text-center">Loading study materials...</div>;
//   }

//   return (
//     <div className="flex h-[calc(100vh-64px)] w-full border-t border-slate-200 dark:border-slate-800">
      
//       {/* SIDEBAR (W3Schools Style) */}
//       <div className={`w-64 flex-shrink-0 overflow-y-auto border-r p-4 ${
//         darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
//       }`}>
//         <h2 className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
//           Course Content
//         </h2>
        
//         <div className="flex flex-col gap-4">
//           {menuData.map((chapter) => (
//             <div key={chapter._id}>
//               {/* Chapter Title */}
//               <h3 className={`font-semibold text-sm uppercase tracking-wider mb-2 ${
//                 darkMode ? "text-slate-400" : "text-slate-500"
//               }`}>
//                 {chapter.title}
//               </h3>
              
//               {/* Subtopics / Notes */}
//               <ul className="flex flex-col gap-1 pl-2">
//                 {chapter.subtopics.map((note) => {
//                   const isActive = activeNote?._id === note._id;
//                   return (
//                     <li key={note._id}>
//                       <button
//                         onClick={() => setActiveNote(note)}
//                         className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
//                           isActive
//                             ? "bg-blue-600 text-white font-medium"
//                             : darkMode
//                               ? "text-slate-300 hover:bg-slate-800"
//                               : "text-slate-700 hover:bg-slate-200"
//                         }`}
//                       >
//                         {note.title}
//                       </button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA (Markdown Renderer) */}
//       <div className={`flex-1 overflow-y-auto p-8 lg:p-12 ${
//         darkMode ? "bg-slate-950" : "bg-white"
//       }`}>
//         {activeNote ? (
//           <div className="max-w-4xl mx-auto">
//             {/* The Tailwind 'prose' class automatically styles h1, h2, p, ul, etc. */}
//             <article className={`prose max-w-none ${darkMode ? "prose-invert" : ""}`}>
//               <h1>{activeNote.title}</h1>
              
//               <ReactMarkdown
//                 remarkPlugins={[remarkGfm]}
//                 components={{
//                   // Custom component to handle code blocks with syntax highlighting
//                   code({ node, inline, className, children, ...props }) {
//                     const match = /language-(\w+)/.exec(className || "");
//                     return !inline && match ? (
//                       <SyntaxHighlighter
//                         style={vscDarkPlus}
//                         language={match[1]}
//                         PreTag="div"
//                         className="rounded-xl shadow-md !my-6"
//                         {...props}
//                       >
//                         {String(children).replace(/\n$/, "")}
//                       </SyntaxHighlighter>
//                     ) : (
//                       <code className={`${className} bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-sm`} {...props}>
//                         {children}
//                       </code>
//                     );
//                   },
//                 }}
//               >
//                 {activeNote.content}
//               </ReactMarkdown>
//             </article>
//           </div>
//         ) : (
//           <div className="flex h-full items-center justify-center text-slate-500">
//             Select a topic from the sidebar to start reading.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }















// import React, { useState, useEffect, useCallback } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { Plus, Edit2, Trash2, Save, X, BookOpen } from "lucide-react";
// import apiClient from "../utils/apiClient";
// import { useTheme } from "../context/themeContext";

// // Reusable UI Component for Forms
// const Modal = ({ title, isOpen, onClose, onSubmit, children, submitText, darkMode }) => {
//   if (!isOpen) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//       <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl border animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
//         <div className="flex items-center justify-between mb-4">
//           <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{title}</h3>
//           <button type="button" onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//         <form onSubmit={onSubmit} className="space-y-4">
//           {children}
//           <div className="flex justify-end gap-2 pt-4">
//             <button type="button" onClick={onClose} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${darkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
//               Cancel
//             </button>
//             <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md text-sm font-semibold transition-all">
//               {submitText}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default function StudyMaterial() {
//   const { darkMode } = useTheme();
  
//   // Data States
//   const [topics, setTopics] = useState([]);
//   const [activeTopicId, setActiveTopicId] = useState("");
//   const [menuData, setMenuData] = useState([]);
//   const [activeNote, setActiveNote] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Editor States
//   const [isEditing, setIsEditing] = useState(false);
//   const [editTitle, setEditTitle] = useState("");
//   const [editContent, setEditContent] = useState("");

//   // Modal Controls & Form States
//   const [showTopicModal, setShowTopicModal] = useState(false);
//   const [newTopicName, setNewTopicName] = useState("");

//   const [showChapterModal, setShowChapterModal] = useState(false);
//   const [newChapterTitle, setNewChapterTitle] = useState("");

//   const [showNoteModal, setShowNoteModal] = useState(false);
//   const [newNoteTitle, setNewNoteTitle] = useState("");
//   const [targetChapterId, setTargetChapterId] = useState("");

//   // 1. Fetch High-Level Topics
//   const fetchTopics = useCallback(async () => {
//     try {
//       const res = await apiClient.get('/study/topics');
//       // Merge private and public topics for authoring
//       const allTopics = [...res.data.private, ...res.data.public];
//       setTopics(allTopics);
      
//       if (allTopics.length > 0 && !activeTopicId) {
//         setActiveTopicId(allTopics[0]._id);
//       }
//     } catch (error) {
//       console.error("Error fetching topics:", error);
//     }
//   }, [activeTopicId]);

//   useEffect(() => { fetchTopics(); }, [fetchTopics]);

//   // 2. Fetch Chapters & Notes when a Topic is selected
//   const fetchContent = useCallback(async () => {
//     if (!activeTopicId) return;
//     setIsLoading(true);
//     try {
//       const res = await apiClient.get(`/study/content?topicId=${activeTopicId}`);
//       setMenuData(res.data);
      
//       // Auto-select first note if none is selected
//       if (!activeNote && res.data.length > 0 && res.data[0].subtopics.length > 0) {
//         setActiveNote(res.data[0].subtopics[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching content:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [activeTopicId, activeNote]);

//   useEffect(() => { fetchContent(); }, [fetchContent]);

//   // --- CRUD HANDLERS ---

//   const handleCreateTopic = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await apiClient.post('/study/topic', { name: newTopicName, isPublic: false });
//       setNewTopicName("");
//       setShowTopicModal(false);
//       await fetchTopics();
//       setActiveTopicId(res.data._id); // Auto switch to new topic
//     } catch (err) { alert("Failed to create topic"); }
//   };

//   const handleCreateChapter = async (e) => {
//     e.preventDefault();
//     if (!activeTopicId) return alert("Select a topic first");
//     try {
//       await apiClient.post('/study/chapter', { topicId: activeTopicId, title: newChapterTitle, order: menuData.length });
//       setNewChapterTitle("");
//       setShowChapterModal(false);
//       fetchContent();
//     } catch (err) { alert("Failed to create chapter"); }
//   };

//   const handleCreateNote = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await apiClient.post('/study/note', { 
//         chapterId: targetChapterId, 
//         title: newNoteTitle, 
//         content: "# Start typing your notes here...", 
//         order: 0 
//       });
//       setNewNoteTitle("");
//       setShowNoteModal(false);
//       await fetchContent();
      
//       // Auto open editor for new note
//       setActiveNote(res.data);
//       setEditTitle(res.data.title);
//       setEditContent(res.data.content);
//       setIsEditing(true);
//     } catch (err) { alert("Failed to create note"); }
//   };

//   const handleSaveNoteEdit = async () => {
//     try {
//       const res = await apiClient.put(`/study/note/${activeNote._id}`, { 
//         title: editTitle, 
//         content: editContent 
//       });
//       setActiveNote(res.data);
//       setIsEditing(false);
//       fetchContent(); // Refresh the sidebar
//     } catch (err) { alert("Failed to save note. Make sure the PUT route is configured in your backend."); }
//   };

//   const handleDeleteNote = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this note?")) return;
//     try {
//       await apiClient.delete(`/study/note/${id}`);
//       setActiveNote(null);
//       fetchContent();
//     } catch (err) { alert("Failed to delete note"); }
//   };

//   // --- STYLING UTILS ---
//   const inputStyles = `w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900"}`;

//   return (
//     <div className="flex h-[calc(100vh-64px)] w-full border-t border-slate-200 dark:border-slate-800">
      
//       {/* SIDEBAR */}
//       <div className={`w-72 flex-shrink-0 flex flex-col border-r ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
        
//         {/* Topic Selector */}
//         <div className={`p-4 border-b ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
//           <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Subject</label>
//           <div className="flex items-center gap-2">
//             <select
//               value={activeTopicId}
//               onChange={(e) => { setActiveTopicId(e.target.value); setActiveNote(null); }}
//               className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold border outline-none ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"}`}
//             >
//               <option value="" disabled>Select a Topic</option>
//               {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
//             </select>
//             <button onClick={() => setShowTopicModal(true)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm" title="New Topic">
//               <Plus className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {/* Chapters & Notes List */}
//         <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//           {isLoading ? (
//             <p className="text-center text-sm text-slate-500 mt-4">Loading structure...</p>
//           ) : menuData.length === 0 ? (
//             <div className="text-center mt-10">
//               <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
//               <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>No chapters yet.</p>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {menuData.map((chapter) => (
//                 <div key={chapter._id}>
//                   <div className="flex items-center justify-between mb-2 pb-1 border-b border-dashed border-slate-300 dark:border-slate-700">
//                     <h3 className={`font-bold text-xs uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
//                       {chapter.title}
//                     </h3>
//                     <button 
//                       onClick={() => { setTargetChapterId(chapter._id); setShowNoteModal(true); }}
//                       className={`p-1 rounded transition-colors ${darkMode ? "hover:bg-slate-800 text-blue-400" : "hover:bg-slate-200 text-blue-600"}`}
//                       title="Add Note to Chapter"
//                     >
//                       <Plus className="w-3 h-3" />
//                     </button>
//                   </div>
                  
//                   <ul className="flex flex-col gap-1">
//                     {chapter.subtopics.map((note) => {
//                       const isActive = activeNote?._id === note._id;
//                       return (
//                         <li key={note._id}>
//                           <button
//                             onClick={() => { setActiveNote(note); setIsEditing(false); }}
//                             className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                               isActive
//                                 ? "bg-blue-600 text-white shadow-md"
//                                 : darkMode
//                                   ? "text-slate-300 hover:bg-slate-800"
//                                   : "text-slate-700 hover:bg-slate-200"
//                             }`}
//                           >
//                             {note.title}
//                           </button>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Add Chapter Button */}
//           {activeTopicId && (
//             <button 
//               onClick={() => setShowChapterModal(true)} 
//               className={`w-full mt-6 py-2.5 border-2 border-dashed rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${darkMode ? "border-slate-700 text-slate-500 hover:text-blue-400 hover:border-blue-500/50" : "border-slate-300 text-slate-400 hover:text-blue-600 hover:border-blue-300"}`}
//             >
//               + Create Chapter
//             </button>
//           )}
//         </div>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className={`flex-1 overflow-y-auto ${darkMode ? "bg-slate-950" : "bg-white"}`}>
//         {activeNote ? (
//           isEditing ? (
//             /* --- EDIT MODE --- */
//             <div className="flex flex-col h-full max-w-5xl mx-auto p-6 lg:p-10">
//               <div className="flex items-center justify-between mb-6 gap-4">
//                 <input
//                   type="text"
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                   className={`flex-1 text-3xl font-bold bg-transparent border-b-2 border-transparent focus:border-blue-500 pb-2 outline-none transition-colors ${darkMode ? "text-white" : "text-slate-900"}`}
//                   placeholder="Note Title"
//                 />
//                 <div className="flex gap-2 shrink-0">
//                   <button onClick={() => setIsEditing(false)} className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
//                     Cancel
//                   </button>
//                   <button onClick={handleSaveNoteEdit} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md font-semibold text-sm flex items-center gap-2 transition-all">
//                     <Save className="w-4 h-4" /> Save
//                   </button>
//                 </div>
//               </div>
//               <textarea
//                 value={editContent}
//                 onChange={(e) => setEditContent(e.target.value)}
//                 className={`flex-1 w-full p-6 rounded-2xl resize-none outline-none font-mono text-sm leading-relaxed border shadow-inner ${darkMode ? "bg-slate-900 border-slate-800 text-slate-300 placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400"}`}
//                 placeholder="Write your study notes using Markdown..."
//               />
//             </div>
//           ) : (
//             /* --- READ MODE --- */
//             <div className="max-w-4xl mx-auto p-8 lg:p-12 animate-fadeIn">
//               <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
//                 <h1 className={`text-4xl font-black tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
//                   {activeNote.title}
//                 </h1>
//                 <div className="flex gap-2">
//                   <button 
//                     onClick={() => { setEditTitle(activeNote.title); setEditContent(activeNote.content); setIsEditing(true); }} 
//                     className={`p-2.5 rounded-xl transition-colors ${darkMode ? "bg-blue-900/30 hover:bg-blue-900/50 text-blue-400" : "bg-blue-50 hover:bg-blue-100 text-blue-600"}`}
//                     title="Edit Note"
//                   >
//                     <Edit2 className="w-5 h-5" />
//                   </button>
//                   <button 
//                     onClick={() => handleDeleteNote(activeNote._id)} 
//                     className={`p-2.5 rounded-xl transition-colors ${darkMode ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-600"}`}
//                     title="Delete Note"
//                   >
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               <article className={`prose lg:prose-lg max-w-none ${darkMode ? "prose-invert prose-pre:bg-slate-900" : ""}`}>
//                 <ReactMarkdown
//                   remarkPlugins={[remarkGfm]}
//                   components={{
//                     code({ node, inline, className, children, ...props }) {
//                       const match = /language-(\w+)/.exec(className || "");
//                       return !inline && match ? (
//                         <SyntaxHighlighter
//                           style={vscDarkPlus}
//                           language={match[1]}
//                           PreTag="div"
//                           className="rounded-xl shadow-lg border border-slate-700 !my-6 text-sm"
//                           {...props}
//                         >
//                           {String(children).replace(/\n$/, "")}
//                         </SyntaxHighlighter>
//                       ) : (
//                         <code className={`${className} ${darkMode ? "bg-slate-800 text-blue-300" : "bg-slate-100 text-blue-600"} px-1.5 py-0.5 rounded-md text-sm font-semibold`} {...props}>
//                           {children}
//                         </code>
//                       );
//                     },
//                   }}
//                 >
//                   {activeNote.content}
//                 </ReactMarkdown>
//               </article>
//             </div>
//           )
//         ) : (
//           <div className="flex flex-col h-full items-center justify-center text-slate-500">
//             <BookOpen className="w-16 h-16 mb-4 opacity-20" />
//             <p className="font-medium">Select a topic and note from the sidebar to begin.</p>
//           </div>
//         )}
//       </div>

//       {/* --- MODALS --- */}
      
//       <Modal title="Create New Subject" isOpen={showTopicModal} onClose={() => setShowTopicModal(false)} onSubmit={handleCreateTopic} submitText="Build Subject" darkMode={darkMode}>
//         <input autoFocus value={newTopicName} onChange={e => setNewTopicName(e.target.value)} placeholder="e.g. System Design, React.js" className={inputStyles} required />
//       </Modal>

//       <Modal title="Create New Chapter" isOpen={showChapterModal} onClose={() => setShowChapterModal(false)} onSubmit={handleCreateChapter} submitText="Add Chapter" darkMode={darkMode}>
//         <input autoFocus value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)} placeholder="e.g. 1. Load Balancers" className={inputStyles} required />
//       </Modal>

//       <Modal title="Create New Note" isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} onSubmit={handleCreateNote} submitText="Create File" darkMode={darkMode}>
//         <input autoFocus value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} placeholder="e.g. Consistent Hashing" className={inputStyles} required />
//       </Modal>

//     </div>
//   );
// }


// import React, { useState, useEffect, useCallback } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { 
//   Plus, Trash2, Edit2, Loader2, X, Save, 
//   ChevronRight, ArrowLeft, ArrowRight, GripVertical 
// } from "lucide-react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import apiClient from "../utils/apiClient";
// import { useTheme } from "../context/themeContext";

// export default function StudyMaterial() {
//   const { darkMode } = useTheme();
  
//   // Data States
//   const [topics, setTopics] = useState([]);
//   const [activeTopic, setActiveTopic] = useState(null);
//   const [menuData, setMenuData] = useState([]); 
//   const [activeNote, setActiveNote] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [expandedChapters, setExpandedChapters] = useState([]);

//   // Inline Note Editing States
//   const [isEditingNote, setIsEditingNote] = useState(false);
//   const [noteForm, setNoteForm] = useState({ title: "", content: "" });
//   const [isSavingNote, setIsSavingNote] = useState(false);

//   // Modal States (Strictly for Topic/Chapter Names)
//   const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, parentId: null });
//   const [formData, setForm] = useState({ title: "", isPublic: false });
//   const [isSubmittingModal, setIsSubmittingModal] = useState(false);

//   // 1. Fetch Top-Level Topics
//   const fetchTopics = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const res = await apiClient.get('/study/topics');
//       const allTopics = [...res.data.private, ...res.data.public];
//       setTopics(allTopics);
      
//       if (allTopics.length > 0 && !activeTopic) {
//         setActiveTopic(allTopics[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching topics:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [activeTopic]);

//   useEffect(() => {
//     fetchTopics();
//   }, [fetchTopics]);

//   // 2. Fetch Chapters & Notes when a Topic is selected
//   useEffect(() => {
//     if (!activeTopic) return;
//     const fetchContent = async () => {
//       try {
//         const res = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//         setMenuData(res.data);
        
//         // Auto-expand all chapters for the newly loaded topic
//         setExpandedChapters(res.data.map(ch => ch._id));

//         if (res.data.length > 0 && res.data[0].subtopics.length > 0) {
//           handleSelectNote(res.data[0].subtopics[0]);
//         } else {
//           handleSelectNote(null);
//         }
//       } catch (error) {
//         console.error("Error fetching content:", error);
//       }
//     };
//     fetchContent();
//   }, [activeTopic?._id]);

//   // Handle Note Selection (Exits edit mode if active)
//   const handleSelectNote = (note) => {
//     setActiveNote(note);
//     setIsEditingNote(false);
//     if (note) {
//       setNoteForm({ title: note.title, content: note.content });
      
//       if (!expandedChapters.includes(note.chapterId)) {
//         setExpandedChapters(prev => [...prev, note.chapterId]);
//       }
//     }
//   };

//   // 3. Drag and Drop Handler
//   const onDragEnd = async (result) => {
//     const { source, destination, type } = result;

//     // Dropped outside the list
//     if (!destination) return;
//     // Dropped in the same position
//     if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//     if (type === "chapter") {
//       // Optimistic UI Update for Chapters
//       const newMenuData = Array.from(menuData);
//       const [movedChapter] = newMenuData.splice(source.index, 1);
//       newMenuData.splice(destination.index, 0, movedChapter);
//       setMenuData(newMenuData);

//       // Backend Sync
//       try {
//         const chapterIds = newMenuData.map(ch => ch._id);
//         await apiClient.put('/study/chapters/reorder', { chapterIds });
//       } catch (error) {
//         console.error("Error reordering chapters:", error);
//       }
//     } 
//     else if (type === "note") {
//       const sourceChapterIndex = menuData.findIndex(ch => ch._id === source.droppableId);
//       const destChapterIndex = menuData.findIndex(ch => ch._id === destination.droppableId);
      
//       const newMenuData = Array.from(menuData);
//       const sourceChapter = newMenuData[sourceChapterIndex];
//       const destChapter = newMenuData[destChapterIndex];
      
//       const sourceNotes = Array.from(sourceChapter.subtopics);
//       const destNotes = source.droppableId === destination.droppableId ? sourceNotes : Array.from(destChapter.subtopics);
      
//       const [movedNote] = sourceNotes.splice(source.index, 1);
//       movedNote.chapterId = destination.droppableId; // Update the note's parent chapter reference
      
//       destNotes.splice(destination.index, 0, movedNote);
      
//       newMenuData[sourceChapterIndex] = { ...sourceChapter, subtopics: sourceNotes };
//       if (source.droppableId !== destination.droppableId) {
//         newMenuData[destChapterIndex] = { ...destChapter, subtopics: destNotes };
//       }
      
//       // Optimistic UI Update for Notes
//       setMenuData(newMenuData);

//       // Backend Sync
//       try {
//         const updates = destNotes.map((note, index) => ({
//           _id: note._id,
//           chapterId: destination.droppableId,
//           order: index
//         }));
//         await apiClient.put('/study/notes/reorder', { updates });
//       } catch (error) {
//         console.error("Error reordering notes:", error);
//       }
//     }
//   };

//   // 4. Inline Note Handlers
//   const handleCreateNote = async (chapterId) => {
//     try {
//       const res = await apiClient.post('/study/note', { 
//         chapterId, 
//         title: "Untitled Note", 
//         content: "# Start typing your notes here...", 
//         order: 0 
//       });
//       const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//       setMenuData(resContent.data);
      
//       if (!expandedChapters.includes(chapterId)) {
//         setExpandedChapters(prev => [...prev, chapterId]);
//       }
//       setActiveNote(res.data);
//       setNoteForm({ title: res.data.title, content: res.data.content });
//       setIsEditingNote(true);
//     } catch (error) {
//       console.error("Error creating note:", error);
//       alert("Failed to create note: " + (error.response?.data?.message || "Server Error"));
//     }
//   };

//   const handleSaveNote = async () => {
//     setIsSavingNote(true);
//     try {
//       const res = await apiClient.put(`/study/note/${activeNote._id}`, {
//         title: noteForm.title || "Untitled Note",
//         content: noteForm.content
//       });
//       const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//       setMenuData(resContent.data);
//       setActiveNote(res.data);
//       setIsEditingNote(false);
//     } catch (error) {
//       console.error("Error saving note:", error);
//     } finally {
//       setIsSavingNote(false);
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     if(!window.confirm("Are you sure you want to delete this note?")) return;
//     try {
//       await apiClient.delete(`/study/note/${noteId}`);
//       const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//       setMenuData(resContent.data);
//       setActiveNote(null);
//       setIsEditingNote(false);
//     } catch (error) {
//       console.error("Error deleting note:", error);
//     }
//   };

//   // 5. Chapter/Topic Modal Submit
//   const handleModalSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmittingModal(true);
//     try {
//       if (modalConfig.type === 'topic') {
//         await apiClient.post('/study/topic', { name: formData.title, isPublic: formData.isPublic });
//         await fetchTopics();
//       } 
//       else if (modalConfig.type === 'chapter') {
//         const resChapter = await apiClient.post('/study/chapter', { topicId: modalConfig.parentId, title: formData.title, order: 0 });
//         const res = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//         setMenuData(res.data);
//         setExpandedChapters(prev => [...prev, resChapter.data._id]);
//       } 
//       else if (modalConfig.type === 'edit-chapter') {
//         await apiClient.put(`/study/chapter/${modalConfig.parentId}`, { title: formData.title });
//         const res = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//         setMenuData(res.data);
//       }
//       closeModal();
//     } catch (error) {
//       console.error("Error saving data:", error);
//     } finally {
//       setIsSubmittingModal(false);
//     }
//   };

//   const handleDeleteChapter = async (chapterId) => {
//     if(!window.confirm("Are you sure you want to delete this chapter and all its associated notes?")) return;
//     try {
//       await apiClient.delete(`/study/chapter/${chapterId}`);
//       const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//       setMenuData(resContent.data);
      
//       if (activeNote && activeNote.chapterId === chapterId) {
//         handleSelectNote(null);
//       }
//     } catch (error) {
//       console.error("Error deleting chapter:", error);
//     }
//   };

//   const toggleChapter = (chapterId) => {
//     setExpandedChapters(prev => 
//       prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
//     );
//   };

//   const openModal = (type, parentId = null, initialTitle = "") => {
//     setForm({ title: initialTitle, isPublic: false });
//     setModalConfig({ isOpen: true, type, parentId });
//   };

//   const closeModal = () => setModalConfig({ isOpen: false, type: null, parentId: null });

//   // 6. Navigation Computations
//   const flatNotes = menuData.flatMap(ch => ch.subtopics);
//   const currentIndex = flatNotes.findIndex(n => n._id === activeNote?._id);
//   const prevNote = currentIndex > 0 ? flatNotes[currentIndex - 1] : null;
//   const nextNote = currentIndex >= 0 && currentIndex < flatNotes.length - 1 ? flatNotes[currentIndex + 1] : null;

//   if (isLoading && topics.length === 0) {
//     return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
//   }

//   return (
//     <div className="flex h-[calc(100vh-64px)] w-full border-t border-slate-200 dark:border-slate-800 relative">
      
//       {/* SIDEBAR: Taxonomy Hierarchy */}
//       <div className={`w-80 flex-shrink-0 overflow-y-auto border-r p-4 flex flex-col ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
        
//         <div className="flex items-center justify-between mb-4">
//           <select 
//             className={`text-sm font-bold w-full p-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
//             value={activeTopic?._id || ""}
//             onChange={(e) => setActiveTopic(topics.find(t => t._id === e.target.value))}
//           >
//             <option disabled value="">Select a Topic...</option>
//             {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
//           </select>
//           <button onClick={() => openModal('topic')} className="ml-2 p-2 bg-blue-600 text-white rounded-lg shrink-0">
//             <Plus className="w-4 h-4" />
//           </button>
//         </div>

//         {activeTopic && (
//           <div className="flex items-center justify-between mb-3">
//             <h2 className={`font-semibold text-xs tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
//               Chapters
//             </h2>
//             <button onClick={() => openModal('chapter', activeTopic._id)} className="text-blue-500 hover:text-blue-600">
//               <Plus className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         )}
        
//         <DragDropContext onDragEnd={onDragEnd}>
//           <Droppable droppableId="chapters-list" type="chapter">
//             {(provided) => (
//               <div 
//                 className="flex flex-col gap-3 min-h-[50px]"
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//               >
//                 {menuData.map((chapter, index) => {
//                   const isExpanded = expandedChapters.includes(chapter._id);

//                   return (
//                     <Draggable key={chapter._id} draggableId={chapter._id} index={index}>
//                       {(provided, snapshot) => (
//                         <div 
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           className={`group/chapter rounded-xl border transition-colors ${
//                             snapshot.isDragging 
//                               ? (darkMode ? "bg-slate-700 border-blue-500 shadow-lg" : "bg-white border-blue-400 shadow-lg")
//                               : (darkMode ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600" : "bg-slate-100/50 border-slate-200 hover:border-slate-300")
//                           }`}
//                         >
//                           {/* Chapter Accordion Header */}
//                           <div 
//                             className="flex items-center justify-between p-3 cursor-pointer select-none"
//                             onClick={() => toggleChapter(chapter._id)}
//                           >
//                             <div className="flex items-center gap-1 overflow-hidden">
//                               <div 
//                                 {...provided.dragHandleProps} 
//                                 onClick={(e) => e.stopPropagation()} 
//                                 className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pr-1"
//                               >
//                                 <GripVertical className="w-4 h-4 shrink-0" />
//                               </div>
//                               <ChevronRight 
//                                 className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''} ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} 
//                               />
//                               <h3 className={`font-semibold text-sm truncate pr-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
//                                 {chapter.title}
//                               </h3>
//                             </div>
                            
//                             {/* Hover Actions */}
//                             <div 
//                               className="opacity-0 group-hover/chapter:opacity-100 flex items-center transition-opacity shrink-0"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               <button onClick={() => openModal('edit-chapter', chapter._id, chapter.title)} className="text-slate-400 hover:text-blue-500 p-1" title="Edit Chapter Name">
//                                 <Edit2 className="w-3 h-3" />
//                               </button>
//                               <button onClick={() => handleDeleteChapter(chapter._id)} className="text-slate-400 hover:text-red-500 p-1" title="Delete Chapter">
//                                 <Trash2 className="w-3 h-3" />
//                               </button>
//                             </div>
//                           </div>

//                           {/* Subtopics List (Collapsible Content) */}
//                           {isExpanded && (
//                             <Droppable droppableId={chapter._id} type="note">
//                               {(provided) => (
//                                 <div className="px-3 pb-3">
//                                   <ul 
//                                     className="flex flex-col gap-1 min-h-[5px]"
//                                     ref={provided.innerRef}
//                                     {...provided.droppableProps}
//                                   >
//                                     {chapter.subtopics.map((note, noteIndex) => {
//                                       const isActive = activeNote?._id === note._id;
//                                       return (
//                                         <Draggable key={note._id} draggableId={note._id} index={noteIndex}>
//                                           {(provided, snapshot) => (
//                                             <li 
//                                               ref={provided.innerRef}
//                                               {...provided.draggableProps}
//                                               className={`relative group flex items-center rounded-md transition-colors ${
//                                                 snapshot.isDragging 
//                                                   ? (darkMode ? "bg-slate-700 shadow-md ring-1 ring-blue-500" : "bg-white shadow-md ring-1 ring-blue-400") 
//                                                   : isActive 
//                                                     ? "bg-blue-600 text-white" 
//                                                     : "hover:bg-slate-200 dark:hover:bg-slate-800/80"
//                                               }`}
//                                             >
//                                               <div 
//                                                 {...provided.dragHandleProps}
//                                                 className={`pl-2 pr-1 py-1.5 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 ${isActive ? "text-blue-200" : "text-slate-400"}`}
//                                               >
//                                                 <GripVertical className="w-3.5 h-3.5" />
//                                               </div>
//                                               <button
//                                                 onClick={() => handleSelectNote(note)}
//                                                 className={`w-full text-left pr-3 py-1.5 text-sm font-medium transition-colors ${!isActive && darkMode ? "text-slate-400" : ""} ${!isActive && !darkMode ? "text-slate-600" : ""}`}
//                                               >
//                                                 {note.title}
//                                               </button>
//                                             </li>
//                                           )}
//                                         </Draggable>
//                                       );
//                                     })}
//                                     {provided.placeholder}
//                                   </ul>
                                  
//                                   <button 
//                                     onClick={(e) => { e.stopPropagation(); handleCreateNote(chapter._id); }}
//                                     className={`mt-2 w-full justify-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-dashed ${
//                                       darkMode 
//                                         ? 'border-slate-600 text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 hover:border-blue-500' 
//                                         : 'border-slate-300 text-slate-500 hover:text-blue-600 hover:bg-slate-100 hover:border-blue-400'
//                                     }`}
//                                   >
//                                     <Plus className="w-3.5 h-3.5" /> Add New Subtopic
//                                   </button>
//                                 </div>
//                               )}
//                             </Droppable>
//                           )}
//                         </div>
//                       )}
//                     </Draggable>
//                   );
//                 })}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className={`flex-1 overflow-y-auto p-8 lg:p-12 ${darkMode ? "bg-slate-950" : "bg-white"}`}>
//         {activeNote ? (
//           <div className="max-w-4xl mx-auto w-full flex flex-col min-h-full">
            
//             {/* Note Header / Toolbar */}
//             <div className="flex justify-between items-center mb-6 shrink-0">
//               {isEditingNote ? (
//                 <input
//                   type="text"
//                   value={noteForm.title}
//                   onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
//                   className={`flex-1 text-3xl font-bold bg-transparent outline-none border-b-2 focus:border-blue-500 transition-colors pb-1 mr-4 ${darkMode ? "text-white border-slate-700" : "text-slate-900 border-slate-200"}`}
//                   placeholder="Note Title"
//                 />
//               ) : (
//                 <h1 className={`text-3xl font-bold flex-1 pr-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
//                   {activeNote.title}
//                 </h1>
//               )}

//               {/* Action Buttons */}
//               <div className="flex gap-2 items-center shrink-0">
//                 {isEditingNote ? (
//                   <>
//                     <button 
//                       onClick={() => {
//                         setIsEditingNote(false);
//                         setNoteForm({ title: activeNote.title, content: activeNote.content });
//                       }} 
//                       className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
//                     >
//                       Cancel
//                     </button>
//                     <button 
//                       onClick={handleSaveNote}
//                       disabled={isSavingNote}
//                       className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-md transition-colors flex items-center gap-2"
//                     >
//                       {isSavingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                       Save
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <button 
//                       onClick={() => setIsEditingNote(true)} 
//                       className={`p-2 rounded-lg transition-colors ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}
//                       title="Edit Markdown"
//                     >
//                       <Edit2 className="w-5 h-5" />
//                     </button>
//                     <button 
//                       onClick={() => handleDeleteNote(activeNote._id)} 
//                       className={`p-2 rounded-lg transition-colors ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"}`}
//                       title="Delete Note"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
            
//             {/* Note Body: Textarea (Edit Mode) vs ReactMarkdown (View Mode) */}
//             <div className="flex-1">
//               {isEditingNote ? (
//                 <textarea
//                   value={noteForm.content}
//                   onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
//                   className={`w-full min-h-[500px] resize-y bg-transparent outline-none text-base leading-relaxed ${darkMode ? "text-slate-300 placeholder-slate-600" : "text-slate-700 placeholder-slate-400"}`}
//                   placeholder="Start typing your markdown here..."
//                 />
//               ) : (
//                 <article className={`prose max-w-none ${darkMode ? "prose-invert" : ""}`}>
//                   <ReactMarkdown
//                     remarkPlugins={[remarkGfm]}
//                     components={{
//                       code({ node, inline, className, children, ...props }) {
//                         const match = /language-(\w+)/.exec(className || "");
//                         return !inline && match ? (
//                           <SyntaxHighlighter
//                             style={vscDarkPlus}
//                             language={match[1]}
//                             PreTag="div"
//                             className="rounded-xl shadow-md !my-6"
//                             {...props}
//                           >
//                             {String(children).replace(/\n$/, "")}
//                           </SyntaxHighlighter>
//                         ) : (
//                           <code className={`${className} bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-sm`} {...props}>
//                             {children}
//                           </code>
//                         );
//                       },
//                     }}
//                   >
//                     {activeNote.content || "*Empty Note*"}
//                   </ReactMarkdown>
//                 </article>
//               )}
//             </div>

//             {/* Navigation Footer */}
//             <div className={`mt-12 pt-6 border-t flex items-center justify-between shrink-0 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
//               {prevNote ? (
//                 <button 
//                   onClick={() => handleSelectNote(prevNote)} 
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
//                 >
//                   <ArrowLeft className="w-4 h-4" /> Previous: {prevNote.title}
//                 </button>
//               ) : <div />}
              
//               {nextNote ? (
//                 <button 
//                   onClick={() => handleSelectNote(nextNote)} 
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
//                 >
//                   Next: {nextNote.title} <ArrowRight className="w-4 h-4" />
//                 </button>
//               ) : <div />}
//             </div>

//           </div>
//         ) : (
//           <div className="flex h-full items-center justify-center text-slate-500">
//             Select a note or add a new one to start writing.
//           </div>
//         )}
//       </div>

//       {/* CRUD MODAL: Only used for Topics and Chapters now */}
//       {modalConfig.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
            
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-lg font-bold capitalize">
//                 {modalConfig.type === 'edit-chapter' ? 'Edit Chapter Name' : `Add New ${modalConfig.type}`}
//               </h3>
//               <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <form onSubmit={handleModalSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   {modalConfig.type === 'topic' ? 'Topic Name' : 'Chapter Name'}
//                 </label>
//                 <input
//                   autoFocus
//                   type="text"
//                   required
//                   value={formData.title}
//                   onChange={(e) => setForm({ ...formData, title: e.target.value })}
//                   className={`w-full px-4 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
//                 />
//               </div>

//               {modalConfig.type === 'topic' && (
//                 <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
//                   <input 
//                     type="checkbox" 
//                     checked={formData.isPublic} 
//                     onChange={(e) => setForm({...formData, isPublic: e.target.checked})} 
//                     className="rounded text-blue-600"
//                   />
//                   Make this topic public
//                 </label>
//               )}

//               <button 
//                 type="submit" 
//                 disabled={isSubmittingModal}
//                 className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
//               >
//                 {isSubmittingModal && <Loader2 className="w-4 h-4 animate-spin" />}
//                 {isSubmittingModal ? 'Saving...' : 'Save'}
//               </button>
//             </form>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





// import React, { useState, useEffect, useCallback } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { 
//   Plus, Trash2, Edit2, Loader2, X, Save, 
//   ChevronRight, ArrowLeft, ArrowRight, GripVertical, BookOpen 
// } from "lucide-react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import apiClient from "../utils/apiClient";
// import { useTheme } from "../context/themeContext";

// export default function StudyMaterial() {
//   const { darkMode } = useTheme();

//   // Workspace Tabs
//   const [sidebarTab, setSidebarTab] = useState("my_workspace"); // "my_workspace" or "public_library"

//   // Data States
//   const [myWorkspaceTopics, setMyWorkspaceTopics] = useState([]);
//   const [publicTopics, setPublicTopics] = useState([]);
//   const [topics, setTopics] = useState([]);
//   const [activeTopic, setActiveTopic] = useState(null);
//   const [menuData, setMenuData] = useState([]); 
//   const [activeNote, setActiveNote] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [expandedChapters, setExpandedChapters] = useState([]);

//   // Inline Note Editing States
//   const [isEditingNote, setIsEditingNote] = useState(false);
//   const [noteForm, setNoteForm] = useState({ title: "", content: "" });
//   const [isSavingNote, setIsSavingNote] = useState(false);

//   // Modal States
//   const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, parentId: null });
//   const [formData, setForm] = useState({ title: "", isPublic: false });
//   const [isSubmittingModal, setIsSubmittingModal] = useState(false);

//   // 1. Fetch Top-Level Topics
//   const fetchTopics = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const res = await apiClient.get('/study/topics');
      
//       const myWorkspace = res.data.myWorkspace || [];
//       const publicLibrary = res.data.publicLibrary || [];

//       setMyWorkspaceTopics(myWorkspace);
//       setPublicTopics(publicLibrary);
      
//       const displayTopics = sidebarTab === "my_workspace" ? myWorkspace : publicLibrary;
//       setTopics(displayTopics);
      
//       if (displayTopics.length > 0 && !activeTopic) {
//         setActiveTopic(displayTopics[0]);
//       }
//     } catch (error) {
//       console.error("Error fetching topics:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [activeTopic, sidebarTab]);

//   useEffect(() => {
//     fetchTopics();
//   }, [fetchTopics]);

//   // Handle Tab Switch
//   useEffect(() => {
//     const displayTopics = sidebarTab === "my_workspace" ? myWorkspaceTopics : publicTopics;
//     setTopics(displayTopics);
    
//     // Automatically select the first topic in the new tab if current activeTopic is not in it
//     if (displayTopics.length > 0 && !displayTopics.find(t => t._id === activeTopic?._id)) {
//       setActiveTopic(displayTopics[0]);
//     } else if (displayTopics.length === 0) {
//       setActiveTopic(null);
//       setMenuData([]);
//       setActiveNote(null);
//     }
//   }, [sidebarTab, myWorkspaceTopics, publicTopics, activeTopic]);

//   // 2. Fetch Chapters & Notes when a Topic is selected
//   useEffect(() => {
//     if (!activeTopic) return;
//     const fetchContent = async () => {
//       try {
//         const res = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//         setMenuData(res.data);
        
//         setExpandedChapters(res.data.map(ch => ch._id));
//         if (res.data.length > 0 && res.data[0].subtopics.length > 0) {
//           handleSelectNote(res.data[0].subtopics[0]);
//         } else {
//           handleSelectNote(null);
//         }
//       } catch (error) {
//         console.error("Error fetching content:", error);
//       }
//     };
//     fetchContent();
//   }, [activeTopic?._id]);

//   // Access Control Helper
//   const canEdit = sidebarTab === "my_workspace" && activeTopic?.status !== "Published";

//   // Handle Topic Status Updates (FIXED: Updates local activeTopic state so UI unlocks immediately)
//   const handleUpdateTopicStatus = async (topicId, newStatus) => {
//     try {
//       const res = await apiClient.put(`/study/topic/${topicId}/status`, { status: newStatus });
//       setActiveTopic(res.data); // <-- This unlocks the edit controls immediately
//       await fetchTopics(); 
//     } catch (error) {
//       alert("Failed to update status. " + (error.response?.data?.message || ""));
//     }
//   };

//   const handleSelectNote = (note) => {
//     setActiveNote(note);
//     setIsEditingNote(false);
//     if (note) {
//       setNoteForm({ title: note.title, content: note.content });
//       if (!expandedChapters.includes(note.chapterId)) {
//         setExpandedChapters(prev => [...prev, note.chapterId]);
//       }
//     }
//   };

//   // 3. Drag and Drop Handler
//   const onDragEnd = async (result) => {
//     if (!canEdit) return; // Prevent reordering if not editable

//     const { source, destination, type } = result;
//     if (!destination) return;
//     if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//     if (type === "chapter") {
//       const newMenuData = Array.from(menuData);
//       const [movedChapter] = newMenuData.splice(source.index, 1);
//       newMenuData.splice(destination.index, 0, movedChapter);
//       setMenuData(newMenuData);

//       try {
//         const chapterIds = newMenuData.map(ch => ch._id);
//         await apiClient.put('/study/chapters/reorder', { chapterIds });
//       } catch (error) {
//         console.error("Error reordering chapters:", error);
//       }
//     } 
//     else if (type === "note") {
//       const sourceChapterIndex = menuData.findIndex(ch => ch._id === source.droppableId);
//       const destChapterIndex = menuData.findIndex(ch => ch._id === destination.droppableId);
      
//       const newMenuData = Array.from(menuData);
//       const sourceChapter = newMenuData[sourceChapterIndex];
//       const destChapter = newMenuData[destChapterIndex];
      
//       const sourceNotes = Array.from(sourceChapter.subtopics);
//       const destNotes = source.droppableId === destination.droppableId ? sourceNotes : Array.from(destChapter.subtopics);
      
//       const [movedNote] = sourceNotes.splice(source.index, 1);
//       movedNote.chapterId = destination.droppableId; 
      
//       destNotes.splice(destination.index, 0, movedNote);
      
//       newMenuData[sourceChapterIndex] = { ...sourceChapter, subtopics: sourceNotes };
//       if (source.droppableId !== destination.droppableId) {
//         newMenuData[destChapterIndex] = { ...destChapter, subtopics: destNotes };
//       }
      
//       setMenuData(newMenuData);

//       try {
//         const updates = destNotes.map((note, index) => ({
//           _id: note._id,
//           chapterId: destination.droppableId,
//           order: index
//         }));
//         await apiClient.put('/study/notes/reorder', { updates });
//       } catch (error) {
//         console.error("Error reordering notes:", error);
//       }
//     }
//   };

//   // 4. Inline Note Handlers
//   const handleCreateNote = async (chapterId) => {
//     if (!canEdit) return;
//     try {
//       const res = await apiClient.post('/study/note', { 
//         chapterId, 
//         title: "Untitled Note", 
//         content: "# Start typing your notes here...", 
//         order: 0 
//       });
//       const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//       setMenuData(resContent.data);
      
//       if (!expandedChapters.includes(chapterId)) {
//         setExpandedChapters(prev => [...prev, chapterId]);
//       }
//       setActiveNote(res.data);
//       setNoteForm({ title: res.data.title, content: res.data.content });
//       setIsEditingNote(true);
//     } catch (error) {
//       console.error("Error creating note:", error);
//       alert("Failed to create note: " + (error.response?.data?.message || "Server Error"));
//     }
//   };

//   const handleSaveNote = async () => {
//     if (!canEdit) return;
//     setIsSavingNote(true);
//     try {
//       const res = await apiClient.put(`/study/note/${activeNote._id}`, {
//         title: noteForm.title || "Untitled Note",
//         content: noteForm.content
//       });
//       const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//       setMenuData(resContent.data);
//       setActiveNote(res.data);
//       setIsEditingNote(false);
//     } catch (error) {
//       console.error("Error saving note:", error);
//     } finally {
//       setIsSavingNote(false);
//     }
//   };

//   const handleDeleteNote = async (noteId) => {
//     if (!canEdit) return;
//     if(!window.confirm("Are you sure you want to delete this note?")) return;
//     try {
//       await apiClient.delete(`/study/note/${noteId}`);
//       const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//       setMenuData(resContent.data);
//       setActiveNote(null);
//       setIsEditingNote(false);
//     } catch (error) {
//       console.error("Error deleting note:", error);
//     }
//   };

//   // 5. Chapter/Topic Modal Submit
//   const handleModalSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmittingModal(true);
//     try {
//       if (modalConfig.type === 'topic') {
//         await apiClient.post('/study/topic', { name: formData.title }); 
//         await fetchTopics();
//       } 
//       else if (modalConfig.type === 'chapter') {
//         const resChapter = await apiClient.post('/study/chapter', { topicId: modalConfig.parentId, title: formData.title, order: 0 });
//         const res = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//         setMenuData(res.data);
//         setExpandedChapters(prev => [...prev, resChapter.data._id]);
//       } 
//       else if (modalConfig.type === 'edit-chapter') {
//         await apiClient.put(`/study/chapter/${modalConfig.parentId}`, { title: formData.title });
//         const res = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//         setMenuData(res.data);
//       }
//       closeModal();
//     } catch (error) {
//       console.error("Error saving data:", error);
//     } finally {
//       setIsSubmittingModal(false);
//     }
//   };

//   const handleDeleteChapter = async (chapterId) => {
//     if (!canEdit) return;
//     if(!window.confirm("Are you sure you want to delete this chapter and all its associated notes?")) return;
//     try {
//       await apiClient.delete(`/study/chapter/${chapterId}`);
//       const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
//       setMenuData(resContent.data);
      
//       if (activeNote && activeNote.chapterId === chapterId) {
//         handleSelectNote(null);
//       }
//     } catch (error) {
//       console.error("Error deleting chapter:", error);
//     }
//   };

//   const toggleChapter = (chapterId) => {
//     setExpandedChapters(prev => 
//       prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
//     );
//   };

//   const openModal = (type, parentId = null, initialTitle = "") => {
//     setForm({ title: initialTitle, isPublic: false });
//     setModalConfig({ isOpen: true, type, parentId });
//   };
//   const closeModal = () => setModalConfig({ isOpen: false, type: null, parentId: null });

//   // 6. Navigation Computations
//   const flatNotes = menuData.flatMap(ch => ch.subtopics);
//   const currentIndex = flatNotes.findIndex(n => n._id === activeNote?._id);
//   const prevNote = currentIndex > 0 ? flatNotes[currentIndex - 1] : null;
//   const nextNote = currentIndex >= 0 && currentIndex < flatNotes.length - 1 ? flatNotes[currentIndex + 1] : null;

//   if (isLoading && topics.length === 0) {
//     return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
//   }

//   return (
//     <div className="flex h-[calc(100vh-64px)] w-full border-t border-slate-200 dark:border-slate-800 relative">
      
//       {/* SIDEBAR: Taxonomy Hierarchy */}
//       <div className={`w-80 flex-shrink-0 overflow-y-auto border-r p-4 flex flex-col ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
        
//         {/* Workspace Toggles */}
//         <div className={`flex gap-2 mb-4 border-b pb-2 ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
//           <button 
//             onClick={() => setSidebarTab("my_workspace")}
//             className={`flex-1 text-xs font-bold uppercase tracking-wider pb-1 ${sidebarTab === "my_workspace" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
//           >
//             My Workspace
//           </button>
//           <button 
//             onClick={() => setSidebarTab("public_library")}
//             className={`flex-1 text-xs font-bold uppercase tracking-wider pb-1 ${sidebarTab === "public_library" ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
//           >
//             Public Library
//           </button>
//         </div>

//         {/* Topic Selector */}
//         <div className="flex items-center justify-between mb-4">
//           <select 
//             className={`text-sm font-bold w-full p-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
//             value={activeTopic?._id || ""}
//             onChange={(e) => setActiveTopic(topics.find(t => t._id === e.target.value))}
//           >
//             <option disabled value="">{sidebarTab === 'public_library' ? "Select a Public Course..." : "Select a Topic..."}</option>
//             {topics.map(t => (
//               <option key={t._id} value={t._id}>
//                 {t.name} {t.status === 'PendingReview' ? '(Pending)' : t.status === 'Published' && sidebarTab === 'my_workspace' ? '(Published)' : ''}
//               </option>
//             ))}
//           </select>
//           {sidebarTab === "my_workspace" && (
//             <button onClick={() => openModal('topic')} className="ml-2 p-2 bg-blue-600 text-white rounded-lg shrink-0" title="Create New Topic">
//               <Plus className="w-4 h-4" />
//             </button>
//           )}
//         </div>

//         {/* Status Action Workflow (Only in My Workspace) */}
//         {activeTopic && sidebarTab === "my_workspace" && (
//           <div className="mb-4">
//             {activeTopic.status === 'Private' && (
//               <button 
//                 onClick={() => handleUpdateTopicStatus(activeTopic._id, 'PendingReview')} 
//                 className="w-full text-xs font-bold bg-amber-100 text-amber-700 py-2 rounded-md hover:bg-amber-200 transition-colors"
//               >
//                 Submit for Global Review
//               </button>
//             )}
//             {activeTopic.status === 'PendingReview' && (
//               <button 
//                 onClick={() => handleUpdateTopicStatus(activeTopic._id, 'Private')} 
//                 className="w-full text-xs font-bold bg-slate-200 text-slate-700 py-2 rounded-md hover:bg-slate-300 transition-colors"
//               >
//                 Cancel Review Request
//               </button>
//             )}
//             {activeTopic.status === 'Published' && (
//               <button 
//                 onClick={() => handleUpdateTopicStatus(activeTopic._id, 'Private')} 
//                 className="w-full text-xs font-bold bg-emerald-100 text-emerald-700 py-2 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors group"
//               >
//                 <span className="group-hover:hidden">Published Live</span>
//                 <span className="hidden group-hover:inline">Unpublish & Edit</span>
//               </button>
//             )}
//           </div>
//         )}

//         {/* Chapters Header */}
//         {activeTopic && (
//           <div className="flex items-center justify-between mb-3">
//             <h2 className={`font-semibold text-xs tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
//               Chapters
//             </h2>
//             {canEdit && (
//               <button onClick={() => openModal('chapter', activeTopic._id)} className="text-blue-500 hover:text-blue-600" title="Add Chapter">
//                 <Plus className="w-3.5 h-3.5" />
//               </button>
//             )}
//           </div>
//         )}
        
//         {/* Chapters & Notes Drag and Drop */}
//         <DragDropContext onDragEnd={onDragEnd}>
//           <Droppable droppableId="chapters-list" type="chapter" isDropDisabled={!canEdit}>
//             {(provided) => (
//               <div 
//                 className="flex flex-col gap-3 min-h-[50px]"
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//               >
//                 {menuData.map((chapter, index) => {
//                   const isExpanded = expandedChapters.includes(chapter._id);
//                   return (
//                     <Draggable key={chapter._id} draggableId={chapter._id} index={index} isDragDisabled={!canEdit}>
//                       {(provided, snapshot) => (
//                         <div 
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           className={`group/chapter rounded-xl border transition-colors ${
//                             snapshot.isDragging 
//                               ? (darkMode ? "bg-slate-700 border-blue-500 shadow-lg" : "bg-white border-blue-400 shadow-lg")
//                               : (darkMode ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600" : "bg-slate-100/50 border-slate-200 hover:border-slate-300")
//                           }`}
//                         >
//                           {/* Chapter Accordion Header */}
//                           <div 
//                             className="flex items-center justify-between p-3 cursor-pointer select-none"
//                             onClick={() => toggleChapter(chapter._id)}
//                           >
//                             <div className="flex items-center gap-1 overflow-hidden">
//                               {canEdit && (
//                                 <div 
//                                   {...provided.dragHandleProps}
//                                   onClick={(e) => e.stopPropagation()}
//                                   className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pr-1"
//                                 >
//                                   <GripVertical className="w-4 h-4 shrink-0" />
//                                 </div>
//                               )}
//                               <ChevronRight 
//                                 className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''} ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} 
//                               />
//                               <h3 className={`font-semibold text-sm truncate pr-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
//                                 {chapter.title}
//                               </h3>
//                             </div>
                            
//                             {/* Hover Actions */}
//                             {canEdit && (
//                               <div 
//                                 className="opacity-0 group-hover/chapter:opacity-100 flex items-center transition-opacity shrink-0"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <button onClick={() => openModal('edit-chapter', chapter._id, chapter.title)} className="text-slate-400 hover:text-blue-500 p-1" title="Edit Chapter Name">
//                                   <Edit2 className="w-3 h-3" />
//                                 </button>
//                                 <button onClick={() => handleDeleteChapter(chapter._id)} className="text-slate-400 hover:text-red-500 p-1" title="Delete Chapter">
//                                   <Trash2 className="w-3 h-3" />
//                                 </button>
//                               </div>
//                             )}
//                           </div>

//                           {/* Subtopics List */}
//                           {isExpanded && (
//                             <Droppable droppableId={chapter._id} type="note" isDropDisabled={!canEdit}>
//                               {(provided) => (
//                                 <div className="px-3 pb-3">
//                                   <ul 
//                                     className="flex flex-col gap-1 min-h-[5px]"
//                                     ref={provided.innerRef}
//                                     {...provided.droppableProps}
//                                   >
//                                     {chapter.subtopics.map((note, noteIndex) => {
//                                       const isActive = activeNote?._id === note._id;
//                                       return (
//                                         <Draggable key={note._id} draggableId={note._id} index={noteIndex} isDragDisabled={!canEdit}>
//                                           {(provided, snapshot) => (
//                                             <li 
//                                               ref={provided.innerRef}
//                                               {...provided.draggableProps}
//                                               className={`relative group flex items-center rounded-md transition-colors ${
//                                                 snapshot.isDragging 
//                                                   ? (darkMode ? "bg-slate-700 shadow-md ring-1 ring-blue-500" : "bg-white shadow-md ring-1 ring-blue-400")
//                                                   : isActive 
//                                                     ? "bg-blue-600 text-white" 
//                                                     : "hover:bg-slate-200 dark:hover:bg-slate-800/80"
//                                               }`}
//                                             >
//                                               {canEdit && (
//                                                 <div 
//                                                   {...provided.dragHandleProps}
//                                                   className={`pl-2 pr-1 py-1.5 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 ${isActive ? "text-blue-200" : "text-slate-400"}`}
//                                                 >
//                                                   <GripVertical className="w-3.5 h-3.5" />
//                                                 </div>
//                                               )}
//                                               <button
//                                                 onClick={() => handleSelectNote(note)}
//                                                 className={`w-full text-left py-1.5 text-sm font-medium transition-colors ${canEdit ? "pr-3" : "px-3"} ${!isActive && darkMode ? "text-slate-400" : ""} ${!isActive && !darkMode ? "text-slate-600" : ""}`}
//                                               >
//                                                 {note.title}
//                                               </button>
//                                             </li>
//                                           )}
//                                         </Draggable>
//                                       );
//                                     })}
//                                     {provided.placeholder}
//                                   </ul>
                                  
//                                   {canEdit && (
//                                     <button 
//                                       onClick={(e) => { e.stopPropagation(); handleCreateNote(chapter._id); }}
//                                       className={`mt-2 w-full justify-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-dashed ${
//                                         darkMode 
//                                           ? 'border-slate-600 text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 hover:border-blue-500' 
//                                           : 'border-slate-300 text-slate-500 hover:text-blue-600 hover:bg-slate-100 hover:border-blue-400'
//                                       }`}
//                                     >
//                                       <Plus className="w-3.5 h-3.5" /> Add New Subtopic
//                                     </button>
//                                   )}
//                                 </div>
//                               )}
//                             </Droppable>
//                           )}
//                         </div>
//                       )}
//                     </Draggable>
//                   );
//                 })}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </DragDropContext>
        
//         {topics.length === 0 && !isLoading && (
//           <div className="text-center mt-10">
//             <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20 text-slate-500" />
//             <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
//               {sidebarTab === 'public_library' ? "No public courses approved yet." : "No topics found."}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className={`flex-1 overflow-y-auto p-8 lg:p-12 ${darkMode ? "bg-slate-950" : "bg-white"}`}>
//         {activeNote ? (
//           <div className="max-w-4xl mx-auto w-full flex flex-col min-h-full">
            
//             {/* Note Header / Toolbar */}
//             <div className="flex justify-between items-center mb-6 shrink-0">
//               {isEditingNote && canEdit ? (
//                 <input
//                   type="text"
//                   value={noteForm.title}
//                   onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
//                   className={`flex-1 text-3xl font-bold bg-transparent outline-none border-b-2 focus:border-blue-500 transition-colors pb-1 mr-4 ${darkMode ? "text-white border-slate-700" : "text-slate-900 border-slate-200"}`}
//                   placeholder="Note Title"
//                 />
//               ) : (
//                 <h1 className={`text-3xl font-bold flex-1 pr-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
//                   {activeNote.title}
//                 </h1>
//               )}

//               {/* Action Buttons */}
//               {canEdit && (
//                 <div className="flex gap-2 items-center shrink-0">
//                   {isEditingNote ? (
//                     <>
//                       <button 
//                         onClick={() => {
//                           setIsEditingNote(false);
//                           setNoteForm({ title: activeNote.title, content: activeNote.content });
//                         }} 
//                         className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
//                       >
//                         Cancel
//                       </button>
//                       <button 
//                         onClick={handleSaveNote}
//                         disabled={isSavingNote}
//                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-md transition-colors flex items-center gap-2"
//                       >
//                         {isSavingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                         Save
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button 
//                         onClick={() => setIsEditingNote(true)} 
//                         className={`p-2 rounded-lg transition-colors ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}
//                         title="Edit Markdown"
//                       >
//                         <Edit2 className="w-5 h-5" />
//                       </button>
//                       <button 
//                         onClick={() => handleDeleteNote(activeNote._id)} 
//                         className={`p-2 rounded-lg transition-colors ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"}`}
//                         title="Delete Note"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>
            
//             {/* Note Body: Textarea (Edit Mode) vs ReactMarkdown (View Mode) */}
//             <div className="flex-1">
//               {isEditingNote && canEdit ? (
//                 <textarea
//                   value={noteForm.content}
//                   onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
//                   className={`w-full min-h-[500px] resize-y bg-transparent outline-none text-base leading-relaxed ${darkMode ? "text-slate-300 placeholder-slate-600" : "text-slate-700 placeholder-slate-400"}`}
//                   placeholder="Start typing your markdown here..."
//                 />
//               ) : (
//                 <article className={`prose max-w-none ${darkMode ? "prose-invert" : ""}`}>
//                   <ReactMarkdown
//                     remarkPlugins={[remarkGfm]}
//                     components={{
//                       code({ node, inline, className, children, ...props }) {
//                         const match = /language-(\w+)/.exec(className || "");
//                         return !inline && match ? (
//                           <SyntaxHighlighter
//                             style={vscDarkPlus}
//                             language={match[1]}
//                             PreTag="div"
//                             className="rounded-xl shadow-md !my-6"
//                             {...props}
//                           >
//                             {String(children).replace(/\n$/, "")}
//                           </SyntaxHighlighter>
//                         ) : (
//                           <code className={`${className} bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-sm`} {...props}>
//                             {children}
//                           </code>
//                         );
//                       },
//                     }}
//                   >
//                     {activeNote.content || "*Empty Note*"}
//                   </ReactMarkdown>
//                 </article>
//               )}
//             </div>

//             {/* Navigation Footer */}
//             <div className={`mt-12 pt-6 border-t flex items-center justify-between shrink-0 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
//               {prevNote ? (
//                 <button 
//                   onClick={() => handleSelectNote(prevNote)} 
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
//                 >
//                   <ArrowLeft className="w-4 h-4" /> Previous: {prevNote.title}
//                 </button>
//               ) : <div />}
              
//               {nextNote ? (
//                 <button 
//                   onClick={() => handleSelectNote(nextNote)} 
//                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
//                 >
//                   Next: {nextNote.title} <ArrowRight className="w-4 h-4" />
//                 </button>
//               ) : <div />}
//             </div>
//           </div>
//         ) : (
//           <div className="flex h-full items-center justify-center text-slate-500">
//             {sidebarTab === 'public_library' 
//               ? "Select a public course from the sidebar to start reading." 
//               : "Select a note or add a new one to start writing."}
//           </div>
//         )}
//       </div>

//       {/* CRUD MODAL */}
//       {modalConfig.isOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
            
//             <div className="flex justify-between items-center mb-5">
//               <h3 className="text-lg font-bold capitalize">
//                 {modalConfig.type === 'edit-chapter' ? 'Edit Chapter Name' : `Add New ${modalConfig.type}`}
//               </h3>
//               <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <form onSubmit={handleModalSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-semibold mb-1">
//                   {modalConfig.type === 'topic' ? 'Topic Name' : 'Chapter Name'}
//                 </label>
//                 <input
//                   autoFocus
//                   type="text"
//                   required
//                   value={formData.title}
//                   onChange={(e) => setForm({ ...formData, title: e.target.value })}
//                   className={`w-full px-4 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
//                 />
//               </div>
//               <button 
//                 type="submit" 
//                 disabled={isSubmittingModal}
//                 className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
//               >
//                 {isSubmittingModal && <Loader2 className="w-4 h-4 animate-spin" />}
//                 {isSubmittingModal ? 'Saving...' : 'Save'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom"; // <-- Added to read the URL from your sidebar
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  Plus, Trash2, Edit2, Loader2, X, Save, 
  ChevronRight, ArrowLeft, ArrowRight, GripVertical, BookOpen 
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import apiClient from "../utils/apiClient";
import { useTheme } from "../context/themeContext";

export default function StudyMaterial() {
  const { darkMode } = useTheme();

  // Read the URL query parameter from your LeftSidebar
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studyType = queryParams.get("type") || "private"; 
  const isPublicMode = studyType === "public"; // True if user clicked "Public Study"

  // Data States
  const [myWorkspaceTopics, setMyWorkspaceTopics] = useState([]);
  const [publicTopics, setPublicTopics] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [menuData, setMenuData] = useState([]); 
  const [activeNote, setActiveNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState([]);

  // Inline Note Editing States
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Modal States
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, parentId: null });
  const [formData, setForm] = useState({ title: "", isPublic: false });
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  // STRICT ACCESS CONTROL: Only allow editing if in Private mode AND the topic is not published
  const canEdit = !isPublicMode && activeTopic?.status !== "Published";

  // 1. Fetch Top-Level Topics
  const fetchTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetches both workspaces from backend[cite: 9]
      const res = await apiClient.get('/study/topics'); 
      
      const myWorkspace = res.data.myWorkspace || [];
      const publicLibrary = res.data.publicLibrary || [];

      setMyWorkspaceTopics(myWorkspace);
      setPublicTopics(publicLibrary);
      
      // Select which array to map over based on URL
      const displayTopics = isPublicMode ? publicLibrary : myWorkspace;
      setTopics(displayTopics);
      
      if (displayTopics.length > 0 && !activeTopic) {
        setActiveTopic(displayTopics[0]);
      }
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTopic, isPublicMode]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Handle URL changes from your LeftSidebar
  useEffect(() => {
    const displayTopics = isPublicMode ? publicTopics : myWorkspaceTopics;
    setTopics(displayTopics);
    
    // Auto-select first topic when switching between Private and Public
    if (displayTopics.length > 0) {
      const existsInNewTab = activeTopic ? displayTopics.find(t => t._id === activeTopic._id) : false;
      if (!existsInNewTab) {
        setActiveTopic(displayTopics[0]);
      }
    } else {
      setActiveTopic(null);
      setMenuData([]);
      setActiveNote(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublicMode, myWorkspaceTopics, publicTopics]);

  // 2. Fetch Chapters & Notes when a Topic is selected
  useEffect(() => {
    if (!activeTopic) return;
    const fetchContent = async () => {
      try {
        const res = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
        setMenuData(res.data);
        
        setExpandedChapters(res.data.map(ch => ch._id));
        if (res.data.length > 0 && res.data[0].subtopics.length > 0) {
          handleSelectNote(res.data[0].subtopics[0]);
        } else {
          handleSelectNote(null);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };
    fetchContent();
  }, [activeTopic?._id]);

  // Handle Topic Status Updates
  const handleUpdateTopicStatus = async (topicId, newStatus) => {
    try {
      const res = await apiClient.put(`/study/topic/${topicId}/status`, { status: newStatus });
      setActiveTopic(res.data);
      await fetchTopics(); 
    } catch (error) {
      alert("Failed to update status. " + (error.response?.data?.message || ""));
    }
  };

  const handleSelectNote = (note) => {
    setActiveNote(note);
    setIsEditingNote(false);
    if (note) {
      setNoteForm({ title: note.title, content: note.content });
      if (!expandedChapters.includes(note.chapterId)) {
        setExpandedChapters(prev => [...prev, note.chapterId]);
      }
    }
  };

  // 3. Drag and Drop Handler
  const onDragEnd = async (result) => {
    if (!canEdit) return; // Prevent reordering if not editable

    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "chapter") {
      const newMenuData = Array.from(menuData);
      const [movedChapter] = newMenuData.splice(source.index, 1);
      newMenuData.splice(destination.index, 0, movedChapter);
      setMenuData(newMenuData);

      try {
        const chapterIds = newMenuData.map(ch => ch._id);
        await apiClient.put('/study/chapters/reorder', { chapterIds });
      } catch (error) {
        console.error("Error reordering chapters:", error);
      }
    } 
    else if (type === "note") {
      const sourceChapterIndex = menuData.findIndex(ch => ch._id === source.droppableId);
      const destChapterIndex = menuData.findIndex(ch => ch._id === destination.droppableId);
      
      const newMenuData = Array.from(menuData);
      const sourceChapter = newMenuData[sourceChapterIndex];
      const destChapter = newMenuData[destChapterIndex];
      
      const sourceNotes = Array.from(sourceChapter.subtopics);
      const destNotes = source.droppableId === destination.droppableId ? sourceNotes : Array.from(destChapter.subtopics);
      
      const [movedNote] = sourceNotes.splice(source.index, 1);
      movedNote.chapterId = destination.droppableId; 
      
      destNotes.splice(destination.index, 0, movedNote);
      
      newMenuData[sourceChapterIndex] = { ...sourceChapter, subtopics: sourceNotes };
      if (source.droppableId !== destination.droppableId) {
        newMenuData[destChapterIndex] = { ...destChapter, subtopics: destNotes };
      }
      
      setMenuData(newMenuData);

      try {
        const updates = destNotes.map((note, index) => ({
          _id: note._id,
          chapterId: destination.droppableId,
          order: index
        }));
        await apiClient.put('/study/notes/reorder', { updates });
      } catch (error) {
        console.error("Error reordering notes:", error);
      }
    }
  };

  // 4. Inline Note Handlers
  const handleCreateNote = async (chapterId) => {
    if (!canEdit) return;
    try {
      const res = await apiClient.post('/study/note', { 
        chapterId, 
        title: "Untitled Note", 
        content: "# Start typing your notes here...", 
        order: 0 
      });
      const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
      setMenuData(resContent.data);
      
      if (!expandedChapters.includes(chapterId)) {
        setExpandedChapters(prev => [...prev, chapterId]);
      }
      setActiveNote(res.data);
      setNoteForm({ title: res.data.title, content: res.data.content });
      setIsEditingNote(true);
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Failed to create note");
    }
  };

  const handleSaveNote = async () => {
    if (!canEdit) return;
    setIsSavingNote(true);
    try {
      const res = await apiClient.put(`/study/note/${activeNote._id}`, {
        title: noteForm.title || "Untitled Note",
        content: noteForm.content
      });
      const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
      setMenuData(resContent.data);
      setActiveNote(res.data);
      setIsEditingNote(false);
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!canEdit) return;
    if(!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await apiClient.delete(`/study/note/${noteId}`);
      const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
      setMenuData(resContent.data);
      setActiveNote(null);
      setIsEditingNote(false);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // 5. Chapter/Topic Modal Submit
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingModal(true);
    try {
      if (modalConfig.type === 'topic') {
        await apiClient.post('/study/topic', { name: formData.title }); 
        await fetchTopics();
      } 
      else if (modalConfig.type === 'chapter') {
        const resChapter = await apiClient.post('/study/chapter', { topicId: modalConfig.parentId, title: formData.title, order: 0 });
        const res = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
        setMenuData(res.data);
        setExpandedChapters(prev => [...prev, resChapter.data._id]);
      } 
      else if (modalConfig.type === 'edit-chapter') {
        await apiClient.put(`/study/chapter/${modalConfig.parentId}`, { title: formData.title });
        const res = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
        setMenuData(res.data);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmittingModal(false);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!canEdit) return;
    if(!window.confirm("Are you sure you want to delete this chapter and all its associated notes?")) return;
    try {
      await apiClient.delete(`/study/chapter/${chapterId}`);
      const resContent = await apiClient.get(`/study/content?topicId=${activeTopic._id}`);
      setMenuData(resContent.data);
      
      if (activeNote && activeNote.chapterId === chapterId) {
        handleSelectNote(null);
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
    );
  };

  const openModal = (type, parentId = null, initialTitle = "") => {
    setForm({ title: initialTitle, isPublic: false });
    setModalConfig({ isOpen: true, type, parentId });
  };
  const closeModal = () => setModalConfig({ isOpen: false, type: null, parentId: null });

  // 6. Navigation Computations
  const flatNotes = menuData.flatMap(ch => ch.subtopics);
  const currentIndex = flatNotes.findIndex(n => n._id === activeNote?._id);
  const prevNote = currentIndex > 0 ? flatNotes[currentIndex - 1] : null;
  const nextNote = currentIndex >= 0 && currentIndex < flatNotes.length - 1 ? flatNotes[currentIndex + 1] : null;

  if (isLoading && topics.length === 0) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full border-t border-slate-200 dark:border-slate-800 relative">
      
      {/* SIDEBAR */}
      <div className={`w-80 flex-shrink-0 overflow-y-auto border-r p-4 flex flex-col ${darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
        
        {/* Dynamic Header based on URL Parameter */}
        <h2 className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
          {isPublicMode ? "Public Library" : "My Workspace"}
        </h2>

        {/* Topic Selector - STRICTLY controls "Plus" button visibility */}
        <div className="flex items-center justify-between mb-4">
          <select 
            className={`text-sm font-bold w-full p-2 rounded-lg border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
            value={activeTopic?._id || ""}
            onChange={(e) => setActiveTopic(topics.find(t => t._id === e.target.value))}
          >
            <option disabled value="">{isPublicMode ? "Select a Public Course..." : "Select a Topic..."}</option>
            {topics.map(t => (
              <option key={t._id} value={t._id}>
                {t.name} {t.status === 'PendingReview' && !isPublicMode ? '(Pending)' : t.status === 'Published' && !isPublicMode ? '(Published)' : ''}
              </option>
            ))}
          </select>
          {/* 🛑 This button ONLY renders if NOT in public mode */}
          {!isPublicMode && (
            <button onClick={() => openModal('topic')} className="ml-2 p-2 bg-blue-600 text-white rounded-lg shrink-0" title="Create New Topic">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Action Workflow (Only in Private Mode) */}
        {activeTopic && !isPublicMode && (
          <div className="mb-4">
            {activeTopic.status === 'Private' && (
              <button 
                onClick={() => handleUpdateTopicStatus(activeTopic._id, 'PendingReview')} 
                className="w-full text-xs font-bold bg-amber-100 text-amber-700 py-2 rounded-md hover:bg-amber-200 transition-colors"
              >
                Submit for Global Review
              </button>
            )}
            {activeTopic.status === 'PendingReview' && (
              <button 
                onClick={() => handleUpdateTopicStatus(activeTopic._id, 'Private')} 
                className="w-full text-xs font-bold bg-slate-200 text-slate-700 py-2 rounded-md hover:bg-slate-300 transition-colors"
              >
                Cancel Review Request
              </button>
            )}
            {activeTopic.status === 'Published' && (
              <button 
                onClick={() => handleUpdateTopicStatus(activeTopic._id, 'Private')} 
                className="w-full text-xs font-bold bg-emerald-100 text-emerald-700 py-2 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors group"
              >
                <span className="group-hover:hidden">Published Live</span>
                <span className="hidden group-hover:inline">Unpublish & Edit</span>
              </button>
            )}
          </div>
        )}

        {/* Chapters Header */}
        {activeTopic && (
          <div className="flex items-center justify-between mb-3">
            <h2 className={`font-semibold text-xs tracking-wider uppercase ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Chapters
            </h2>
            {/* 🛑 Add Chapter Button ONLY renders if editable */}
            {canEdit && (
              <button onClick={() => openModal('chapter', activeTopic._id)} className="text-blue-500 hover:text-blue-600" title="Add Chapter">
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        
        {/* Chapters & Notes Drag and Drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="chapters-list" type="chapter" isDropDisabled={!canEdit}>
            {(provided) => (
              <div 
                className="flex flex-col gap-3 min-h-[50px]"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {menuData.map((chapter, index) => {
                  const isExpanded = expandedChapters.includes(chapter._id);
                  return (
                    <Draggable key={chapter._id} draggableId={chapter._id} index={index} isDragDisabled={!canEdit}>
                      {(provided, snapshot) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group/chapter rounded-xl border transition-colors ${
                            snapshot.isDragging 
                              ? (darkMode ? "bg-slate-700 border-blue-500 shadow-lg" : "bg-white border-blue-400 shadow-lg")
                              : (darkMode ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600" : "bg-slate-100/50 border-slate-200 hover:border-slate-300")
                          }`}
                        >
                          {/* Chapter Accordion Header */}
                          <div 
                            className="flex items-center justify-between p-3 cursor-pointer select-none"
                            onClick={() => toggleChapter(chapter._id)}
                          >
                            <div className="flex items-center gap-1 overflow-hidden">
                              {/* 🛑 Drag Handle ONLY renders if editable */}
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
                                className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''} ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} 
                              />
                              <h3 className={`font-semibold text-sm truncate pr-2 ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                                {chapter.title}
                              </h3>
                            </div>
                            
                            {/* Hover Actions (Edit/Delete Chapter) ONLY renders if editable */}
                            {canEdit && (
                              <div 
                                className="opacity-0 group-hover/chapter:opacity-100 flex items-center transition-opacity shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button onClick={() => openModal('edit-chapter', chapter._id, chapter.title)} className="text-slate-400 hover:text-blue-500 p-1" title="Edit Chapter Name">
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button onClick={() => handleDeleteChapter(chapter._id)} className="text-slate-400 hover:text-red-500 p-1" title="Delete Chapter">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Subtopics List */}
                          {isExpanded && (
                            <Droppable droppableId={chapter._id} type="note" isDropDisabled={!canEdit}>
                              {(provided) => (
                                <div className="px-3 pb-3">
                                  <ul 
                                    className="flex flex-col gap-1 min-h-[5px]"
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                  >
                                    {chapter.subtopics.map((note, noteIndex) => {
                                      const isActive = activeNote?._id === note._id;
                                      return (
                                        <Draggable key={note._id} draggableId={note._id} index={noteIndex} isDragDisabled={!canEdit}>
                                          {(provided, snapshot) => (
                                            <li 
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className={`relative group flex items-center rounded-md transition-colors ${
                                                snapshot.isDragging 
                                                  ? (darkMode ? "bg-slate-700 shadow-md ring-1 ring-blue-500" : "bg-white shadow-md ring-1 ring-blue-400")
                                                  : isActive 
                                                    ? "bg-blue-600 text-white" 
                                                    : "hover:bg-slate-200 dark:hover:bg-slate-800/80"
                                              }`}
                                            >
                                              {/* 🛑 Drag Handle ONLY renders if editable */}
                                              {canEdit && (
                                                <div 
                                                  {...provided.dragHandleProps}
                                                  className={`pl-2 pr-1 py-1.5 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 ${isActive ? "text-blue-200" : "text-slate-400"}`}
                                                >
                                                  <GripVertical className="w-3.5 h-3.5" />
                                                </div>
                                              )}
                                              <button
                                                onClick={() => handleSelectNote(note)}
                                                className={`w-full text-left py-1.5 text-sm font-medium transition-colors ${canEdit ? "pr-3" : "px-3"} ${!isActive && darkMode ? "text-slate-400" : ""} ${!isActive && !darkMode ? "text-slate-600" : ""}`}
                                              >
                                                {note.title}
                                              </button>
                                            </li>
                                          )}
                                        </Draggable>
                                      );
                                    })}
                                    {provided.placeholder}
                                  </ul>
                                  
                                  {/* 🛑 Add New Subtopic Button ONLY renders if editable */}
                                  {canEdit && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleCreateNote(chapter._id); }}
                                      className={`mt-2 w-full justify-center px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border border-dashed ${
                                        darkMode 
                                          ? 'border-slate-600 text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 hover:border-blue-500' 
                                          : 'border-slate-300 text-slate-500 hover:text-blue-600 hover:bg-slate-100 hover:border-blue-400'
                                      }`}
                                    >
                                      <Plus className="w-3.5 h-3.5" /> Add New Subtopic
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
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20 text-slate-500" />
            <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              {isPublicMode ? "No public courses available." : "No topics found."}
            </p>
          </div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 overflow-y-auto p-8 lg:p-12 ${darkMode ? "bg-slate-950" : "bg-white"}`}>
        {activeNote ? (
          <div className="max-w-4xl mx-auto w-full flex flex-col min-h-full">
            
            {/* Note Header / Toolbar */}
            <div className="flex justify-between items-center mb-6 shrink-0">
              {isEditingNote && canEdit ? (
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                  className={`flex-1 text-3xl font-bold bg-transparent outline-none border-b-2 focus:border-blue-500 transition-colors pb-1 mr-4 ${darkMode ? "text-white border-slate-700" : "text-slate-900 border-slate-200"}`}
                  placeholder="Note Title"
                />
              ) : (
                <h1 className={`text-3xl font-bold flex-1 pr-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {activeNote.title}
                </h1>
              )}

              {/* Action Buttons - ONLY renders if editable */}
              {canEdit && (
                <div className="flex gap-2 items-center shrink-0">
                  {isEditingNote ? (
                    <>
                      <button 
                        onClick={() => {
                          setIsEditingNote(false);
                          setNoteForm({ title: activeNote.title, content: activeNote.content });
                        }} 
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveNote}
                        disabled={isSavingNote}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-md transition-colors flex items-center gap-2"
                      >
                        {isSavingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditingNote(true)} 
                        className={`p-2 rounded-lg transition-colors ${darkMode ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}
                        title="Edit Markdown"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(activeNote._id)} 
                        className={`p-2 rounded-lg transition-colors ${darkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"}`}
                        title="Delete Note"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Note Body: Textarea (Edit Mode) vs ReactMarkdown (View Mode) */}
            <div className="flex-1">
              {isEditingNote && canEdit ? (
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  className={`w-full min-h-[500px] resize-y bg-transparent outline-none text-base leading-relaxed ${darkMode ? "text-slate-300 placeholder-slate-600" : "text-slate-700 placeholder-slate-400"}`}
                  placeholder="Start typing your markdown here..."
                />
              ) : (
                <article className={`prose max-w-none ${darkMode ? "prose-invert" : ""}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-xl shadow-md !my-6"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={`${className} bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-sm`} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {activeNote.content || "*Empty Note*"}
                  </ReactMarkdown>
                </article>
              )}
            </div>

            {/* Navigation Footer */}
            <div className={`mt-12 pt-6 border-t flex items-center justify-between shrink-0 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              {prevNote ? (
                <button 
                  onClick={() => handleSelectNote(prevNote)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                  <ArrowLeft className="w-4 h-4" /> Previous: {prevNote.title}
                </button>
              ) : <div />}
              
              {nextNote ? (
                <button 
                  onClick={() => handleSelectNote(nextNote)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                  Next: {nextNote.title} <ArrowRight className="w-4 h-4" />
                </button>
              ) : <div />}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            {isPublicMode 
              ? "Select a public course from the sidebar to start reading." 
              : "Select a note or add a new one to start writing."}
          </div>
        )}
      </div>

      {/* CRUD MODAL */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
            
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold capitalize">
                {modalConfig.type === 'edit-chapter' ? 'Edit Chapter Name' : `Add New ${modalConfig.type}`}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {modalConfig.type === 'topic' ? 'Topic Name' : 'Chapter Name'}
                </label>
                <input
                  autoFocus
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setForm({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmittingModal}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {isSubmittingModal && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmittingModal ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}