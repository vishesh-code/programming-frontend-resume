// import React, {
//   useState,
//   useEffect,
//   useMemo,
//   useRef,
//   useCallback,
// } from "react";
// import {
//   Upload,
//   Search,
//   Grid3X3,
//   List,
//   Download,
//   Trash2,
//   FileText,
//   FileCode,
//   FileImage,
//   FileArchive,
//   File,
//   FolderOpen,
//   X,
//   Loader2,
//   Tag,
//   Plus,
//   SortAsc,
//   SortDesc,
// } from "lucide-react";
// import { useTheme } from "../context/themeContext";
// import apiClient from "../utils/apiClient";

// const FILE_TYPES = ["all", "code", "pdf", "image", "text", "zip"];

// // Helpers
// const formatSize = (bytes) => {
//   if (!bytes) return "0 B";
//   if (bytes < 1024) return `${bytes} B`;
//   if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
//   return `${(bytes / 1048576).toFixed(1)} MB`;
// };

// const formatDate = (dateStr) => {
//   if (!dateStr) return "Unknown date";
//   return new Date(dateStr).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// const timeAgo = (iso) => {
//   if (!iso) return "";
//   const diff = Date.now() - new Date(iso).getTime();
//   const days = Math.floor(diff / 86400000);
//   if (days === 0) return "Today";
//   if (days === 1) return "Yesterday";
//   if (days < 7) return `${days}d ago`;
//   return formatDate(iso);
// };

// const getFileIcon = (type, size = "w-5 h-5") => {
//   if (!type) return <File className={size} />;
//   if (type.includes("code")) return <FileCode className={size} />;
//   if (type.includes("pdf")) return <FileText className={size} />;
//   if (type.includes("image")) return <FileImage className={size} />;
//   if (type.includes("zip")) return <FileArchive className={size} />;
//   if (type.includes("text")) return <FileText className={size} />;
//   return <File className={size} />;
// };

// // Wired strictly to darkMode context (removed all Tailwind 'dark:' prefixes)
// const getTypeColorClasses = (type, darkMode) => {
//   if (!type)
//     return darkMode
//       ? "bg-slate-800 text-slate-300 border-slate-700"
//       : "bg-slate-100 text-slate-600 border-slate-200";
//   if (type.includes("code"))
//     return darkMode
//       ? "bg-indigo-900/30 text-indigo-400 border-indigo-800"
//       : "bg-indigo-50 text-indigo-600 border-indigo-200";
//   if (type.includes("pdf"))
//     return darkMode
//       ? "bg-red-900/30 text-red-400 border-red-800"
//       : "bg-red-50 text-red-600 border-red-200";
//   if (type.includes("image"))
//     return darkMode
//       ? "bg-emerald-900/30 text-emerald-400 border-emerald-800"
//       : "bg-emerald-50 text-emerald-600 border-emerald-200";
//   if (type.includes("zip"))
//     return darkMode
//       ? "bg-amber-900/30 text-amber-400 border-amber-800"
//       : "bg-amber-50 text-amber-600 border-amber-200";
//   return darkMode
//     ? "bg-slate-800 text-slate-300 border-slate-700"
//     : "bg-slate-100 text-slate-600 border-slate-200";
// };

// /* ─────────────────────────────────────────────
//    SUB-COMPONENTS
// ───────────────────────────────────────────── */
// const TagPill = ({ tag, active, onClick, removable, onRemove, darkMode }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
//       active
//         ? darkMode
//           ? "bg-blue-900/30 text-blue-400 border-blue-800"
//           : "bg-blue-50 text-blue-600 border-blue-200"
//         : darkMode
//           ? "bg-slate-800 text-slate-400 border-slate-700"
//           : "bg-slate-50 text-slate-500 border-slate-200"
//     }`}
//   >
//     <Tag className="w-2.5 h-2.5" />
//     {tag}
//     {removable && (
//       <span
//         className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
//         onClick={(e) => {
//           e.stopPropagation();
//           onRemove?.(tag);
//         }}
//       >
//         <X className="w-2.5 h-2.5" />
//       </span>
//     )}
//   </button>
// );

// const TypeBadge = ({ type, darkMode }) => (
//   <span
//     className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase ${getTypeColorClasses(type, darkMode)}`}
//   >
//     {type}
//   </span>
// );

// /* ─────────────────────────────────────────────
//    MODAL
// ───────────────────────────────────────────── */
// const UploadModal = ({ onClose, onUpload, allTags, darkMode }) => {
//   const [dragging, setDragging] = useState(false);
//   const [files, setFiles] = useState([]);
//   const [tagInput, setTagInput] = useState("");
//   const [selectedTags, setSelectedTags] = useState([]);
//   const [showTagSuggest, setShowTagSuggest] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const inputRef = useRef();

//   const handleDrop = useCallback((e) => {
//     e.preventDefault();
//     setDragging(false);
//     setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
//   }, []);

//   const addTag = (tag) => {
//     const t = tag.trim();
//     if (t && !selectedTags.includes(t)) setSelectedTags((p) => [...p, t]);
//     setTagInput("");
//     setShowTagSuggest(false);
//   };

//   const filteredSuggestions = allTags.filter(
//     (t) =>
//       t.toLowerCase().includes(tagInput.toLowerCase()) &&
//       !selectedTags.includes(t),
//   );

//   const handleUploadClick = async () => {
//     if (!files.length) return;
//     setIsUploading(true);

//     const formData = new FormData();
//     formData.append("file", files[0]);
//     formData.append("tags", JSON.stringify(selectedTags));

//     try {
//       const response = await apiClient.post("/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       onUpload(response.data.file);
//       onClose();
//     } catch (err) {
//       console.error("Upload failed", err);
//       alert("Failed to upload file.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm">
//       <div
//         className={`w-full max-w-lg rounded-2xl overflow-hidden shadow-xl animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700 border" : "bg-white border-slate-200 border"}`}
//       >
//         <div className="h-0.5 bg-blue-600" />

//         <div
//           className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? "border-slate-700" : "border-slate-200"}`}
//         >
//           <div>
//             <h2
//               className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
//             >
//               Upload File
//             </h2>
//             <p
//               className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//             >
//               Attach tags to organize your files
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className={`p-1.5 rounded-lg border ${darkMode ? "border-slate-700 text-slate-400 hover:bg-slate-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         <div className="px-6 py-5 space-y-5">
//           <div
//             onDragOver={(e) => {
//               e.preventDefault();
//               setDragging(true);
//             }}
//             onDragLeave={() => setDragging(false)}
//             onDrop={handleDrop}
//             onClick={() => inputRef.current?.click()}
//             className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
//               dragging
//                 ? darkMode
//                   ? "border-blue-500 bg-blue-900/20"
//                   : "border-blue-500 bg-blue-50"
//                 : darkMode
//                   ? "border-slate-600 bg-slate-800/50 hover:bg-slate-700/50"
//                   : "border-slate-300 bg-slate-50 hover:bg-slate-100"
//             }`}
//           >
//             <input
//               ref={inputRef}
//               type="file"
//               className="hidden"
//               onChange={(e) => setFiles(Array.from(e.target.files))}
//             />
//             <div
//               className={`w-10 h-10 rounded-xl flex items-center justify-center border ${darkMode ? "bg-blue-900/50 border-blue-800" : "bg-blue-100 border-blue-200"}`}
//             >
//               <Upload
//                 className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
//               />
//             </div>
//             <div className="text-center">
//               <p
//                 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
//               >
//                 {dragging ? "Release to drop" : "Drag & drop files here"}
//               </p>
//               <p
//                 className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//               >
//                 or{" "}
//                 <span className={darkMode ? "text-blue-400" : "text-blue-600"}>
//                   browse
//                 </span>{" "}
//                 to choose files
//               </p>
//             </div>
//           </div>

//           {files.length > 0 && (
//             <div className="space-y-2 max-h-36 overflow-y-auto">
//               {files.map((f, i) => (
//                 <div
//                   key={i}
//                   className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600" : "bg-slate-50 border-slate-200"}`}
//                 >
//                   <div className="flex items-center gap-2 min-w-0">
//                     <FileText
//                       className={`w-3.5 h-3.5 shrink-0 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
//                     />
//                     <span
//                       className={`text-xs truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}
//                     >
//                       {f.name}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 shrink-0">
//                     <span
//                       className={`text-[10px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//                     >
//                       {formatSize(f.size)}
//                     </span>
//                     <button
//                       onClick={() =>
//                         setFiles(files.filter((_, idx) => idx !== i))
//                       }
//                       className="text-slate-500 hover:text-red-500"
//                     >
//                       <X className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="space-y-2">
//             <label
//               className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//             >
//               Assign Tags
//             </label>
//             <div className="relative">
//               <input
//                 value={tagInput}
//                 onChange={(e) => {
//                   setTagInput(e.target.value);
//                   setShowTagSuggest(true);
//                 }}
//                 onFocus={() => setShowTagSuggest(true)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                     addTag(tagInput);
//                   }
//                 }}
//                 placeholder="Type a tag and press Enter…"
//                 className={`w-full border rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}
//               />
//               <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//               {showTagSuggest && tagInput && filteredSuggestions.length > 0 && (
//                 <div
//                   className={`absolute z-10 top-full mt-1 w-full rounded-xl overflow-hidden shadow-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
//                 >
//                   {filteredSuggestions.slice(0, 6).map((t) => (
//                     <button
//                       key={t}
//                       onClick={() => addTag(t)}
//                       className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${darkMode ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-100"}`}
//                     >
//                       <Tag className="w-3 h-3 text-blue-500" /> {t}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//             {selectedTags.length > 0 && (
//               <div className="flex flex-wrap gap-1.5 mt-2">
//                 {selectedTags.map((t) => (
//                   <TagPill
//                     key={t}
//                     tag={t}
//                     active
//                     removable
//                     onRemove={(tag) =>
//                       setSelectedTags(selectedTags.filter((x) => x !== tag))
//                     }
//                     darkMode={darkMode}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div
//           className={`px-6 py-4 border-t flex justify-end gap-3 ${darkMode ? "border-slate-700" : "border-slate-200"}`}
//         >
//           <button
//             onClick={onClose}
//             className={`px-4 py-2 text-xs font-semibold rounded-lg border ${darkMode ? "border-slate-700 text-slate-400 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleUploadClick}
//             disabled={!files.length || isUploading}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
//           >
//             {isUploading ? (
//               <Loader2 className="w-3.5 h-3.5 animate-spin" />
//             ) : (
//               <Upload className="w-3.5 h-3.5" />
//             )}
//             {isUploading
//               ? "Uploading..."
//               : `Upload ${files.length > 0 ? `(${files.length})` : ""}`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────
//    MAIN FILES PANEL
// ───────────────────────────────────────────── */
// const MyFiles = () => {
//   const { darkMode } = useTheme();

//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);

//   // Filters and Views
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [tagFilters, setTagFilters] = useState([]);
//   const [sort, setSort] = useState({ key: "uploadedAt", dir: "desc" });
//   const [view, setView] = useState("grid");

//   const fileInputRef = useRef(null);

//   // Fetch Files
//   const fetchFiles = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await apiClient.get("/upload/my-files");
//       const formatted = res.data.files.map((f) => ({
//         id: f._id,
//         name: f.fileName,
//         url: f.fileUrl,
//         type: f.fileType,
//         size: f.size,
//         tags: f.tags || [],
//         uploadedAt: f.createdAt,
//       }));
//       setFiles(formatted);
//     } catch (err) {
//       console.error("Failed to fetch files", err);
//       // Failsafe empty state
//       setFiles([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchFiles();
//   }, [fetchFiles]);

//   // Upload File
//   const handleFileUpload = async (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       await apiClient.post("/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       await fetchFiles();
//     } catch (error) {
//       console.error("Upload failed", error);
//       alert("Failed to upload file");
//     } finally {
//       setUploading(false);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     }
//   };

//   const handleDownload = (url) => {
//     if (url) window.open(url, "_blank");
//   };

//   const allTags = useMemo(
//     () => [...new Set(files.flatMap((f) => f.tags || []))].sort(),
//     [files],
//   );

//   // Filter Data
//   const filteredFiles = useMemo(() => {
//     let result = files.filter((f) => {
//       const matchSearch =
//         !search || f.name.toLowerCase().includes(search.toLowerCase());
//       const matchType =
//         typeFilter === "all" || (f.type && f.type.includes(typeFilter));
//       const matchTags =
//         tagFilters.length === 0 ||
//         tagFilters.every((t) => (f.tags || []).includes(t));
//       return matchSearch && matchType && matchTags;
//     });

//     result.sort((a, b) => {
//       let va = a[sort.key] || "",
//         vb = b[sort.key] || "";
//       if (sort.key === "name") {
//         va = va.toLowerCase();
//         vb = vb.toLowerCase();
//       }
//       if (sort.key === "size" || sort.key === "uploadedAt") {
//         va = new Date(va).getTime?.() ?? va;
//         vb = new Date(vb).getTime?.() ?? vb;
//       }
//       return sort.dir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
//     });

//     return result;
//   }, [files, search, typeFilter, tagFilters, sort]);

//   const toggleSort = (key) =>
//     setSort((s) => ({
//       key,
//       dir: s.key === key ? (s.dir === "asc" ? "desc" : "asc") : "desc",
//     }));

//   const SortBtn = ({ label, k }) => (
//     <button
//       onClick={() => toggleSort(k)}
//       className={`flex items-center gap-1 text-xs font-semibold transition-colors ${sort.key === k ? (darkMode ? "text-blue-400" : "text-blue-600") : darkMode ? "text-slate-400" : "text-slate-500"}`}
//     >
//       {label}{" "}
//       {sort.key === k ? (
//         sort.dir === "asc" ? (
//           <SortAsc className="w-3 h-3" />
//         ) : (
//           <SortDesc className="w-3 h-3" />
//         )
//       ) : (
//         <SortAsc className="w-3 h-3 opacity-30" />
//       )}
//     </button>
//   );

//   return (
//     <div
//       className={`flex flex-col h-full space-y-6 ${darkMode ? "text-white" : "text-slate-900"}`}
//     >
//       {/* HEADER SECTION */}
//       <div
//         className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
//       >
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div
//               className={`w-12 h-12 rounded-xl flex items-center justify-center border ${darkMode ? "bg-blue-900/30 border-blue-800 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"}`}
//             >
//               <FolderOpen className="w-6 h-6" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold">My Files</h1>
//               <p
//                 className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//               >
//                 {filteredFiles.length} files available
//               </p>
//             </div>
//           </div>

//           <label className="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md transition-all">
//             {uploading ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <Upload className="w-4 h-4" />
//             )}
//             {uploading ? "Uploading..." : "Upload New File"}
//             <input
//               type="file"
//               className="hidden"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               disabled={uploading}
//             />
//           </label>
//         </div>
//       </div>

//       {/* TOOLBAR SECTION (Fixed Layout wrapper) */}
//       <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
//         {/* Left Side: Search & Filter (Flex-wrap to handle tight spaces) */}
//         <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full xl:w-auto xl:flex-1">
//           {/* Search */}
//           <div className="relative w-full sm:w-64 shrink-0">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search files..."
//               className={`w-full border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${darkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"}`}
//             />
//           </div>

//           {/* Type Filter */}
//           <div
//             className={`flex items-center gap-1.5 p-1.5 border rounded-xl overflow-x-auto w-full sm:w-auto ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
//           >
//             {FILE_TYPES.map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setTypeFilter(t)}
//                 className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap ${
//                   typeFilter === t
//                     ? "bg-blue-600 text-white shadow-md"
//                     : darkMode
//                       ? "text-slate-400 hover:bg-slate-700"
//                       : "text-slate-600 hover:bg-slate-100"
//                 }`}
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Right Side: Sort & View Toggle */}
//         <div className="flex items-center gap-3 w-full sm:w-auto mt-2 xl:mt-0 justify-between sm:justify-end">
//           <div
//             className={`flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl border shadow-sm w-full sm:w-auto justify-center ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
//           >
//             <SortBtn label="Name" k="name" />
//             <span className={darkMode ? "text-slate-600" : "text-slate-300"}>
//               ·
//             </span>
//             <SortBtn label="Size" k="size" />
//             <span className={darkMode ? "text-slate-600" : "text-slate-300"}>
//               ·
//             </span>
//             <SortBtn label="Date" k="uploadedAt" />
//           </div>

//           <div
//             className={`flex rounded-xl border overflow-hidden shrink-0 shadow-sm ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
//           >
//             <button
//               onClick={() => setView("grid")}
//               className={`p-2 transition-all ${view === "grid" ? "bg-blue-600 text-white" : darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-50"}`}
//             >
//               <Grid3X3 className="w-5 h-5" />
//             </button>
//             <button
//               onClick={() => setView("list")}
//               className={`p-2 transition-all ${view === "list" ? "bg-blue-600 text-white" : darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-50"}`}
//             >
//               <List className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Active tag filter chips */}
//       {allTags.length > 0 && (
//         <div className="flex items-center gap-2 flex-wrap">
//           <span
//             className={`text-xs mr-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//           >
//             Tags:
//           </span>
//           {allTags.map((t) => (
//             <TagPill
//               key={t}
//               tag={t}
//               active={tagFilters.includes(t)}
//               onClick={() =>
//                 setTagFilters((prev) =>
//                   prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
//                 )
//               }
//               darkMode={darkMode}
//             />
//           ))}
//         </div>
//       )}

//       {/* CONTENT AREA */}
//       {loading ? (
//         <div className="flex justify-center items-center py-20">
//           <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//         </div>
//       ) : filteredFiles.length === 0 ? (
//         <div
//           className={`flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-300 bg-white"}`}
//         >
//           <FolderOpen
//             className={`w-16 h-16 mb-4 ${darkMode ? "text-slate-600" : "text-slate-400"}`}
//           />
//           <h3 className="text-lg font-bold mb-2">No files found</h3>
//           <p
//             className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//           >
//             Upload your first file or try a different search term.
//           </p>
//           <button
//             onClick={() => setShowUpload(true)}
//             className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md"
//           >
//             Upload File
//           </button>
//         </div>
//       ) : view === "grid" ? (
//         /* --- GRID VIEW --- */
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredFiles.map((f) => (
//             <div
//               key={f.id}
//               className={`flex flex-col rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md group ${darkMode ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-300"}`}
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div
//                   className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getTypeColorClasses(f.type, darkMode)}`}
//                 >
//                   {getFileIcon(f.type, "w-6 h-6")}
//                 </div>
//                 <button
//                   onClick={() => handleDownload(f.url)}
//                   className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}
//                 >
//                   <Download className="w-5 h-5" />
//                 </button>
//               </div>
//               <div className="min-w-0">
//                 <p className="text-sm font-semibold truncate" title={f.name}>
//                   {f.name}
//                 </p>
//                 <div
//                   className={`flex items-center gap-2 mt-1 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//                 >
//                   <span>{formatSize(f.size)}</span>
//                   <span>•</span>
//                   <span>{formatDate(f.uploadedAt)}</span>
//                 </div>
//               </div>
//               {f.tags && f.tags.length > 0 && (
//                 <div className="flex flex-wrap gap-1.5 mt-4">
//                   {f.tags.slice(0, 3).map((t) => (
//                     <span
//                       key={t}
//                       className={`px-2 py-0.5 text-[10px] rounded border ${darkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-slate-100 text-slate-600 border-slate-200"}`}
//                     >
//                       {t}
//                     </span>
//                   ))}
//                   {f.tags.length > 3 && (
//                     <span
//                       className={`px-2 py-0.5 text-[10px] rounded border ${darkMode ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-50 text-slate-400 border-slate-200"}`}
//                     >
//                       +{f.tags.length - 3}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         /* --- LIST VIEW --- */
//         <div
//           className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
//         >
//           <div
//             className={`flex flex-col divide-y ${darkMode ? "divide-slate-700" : "divide-slate-200"}`}
//           >
//             {filteredFiles.map((f) => (
//               <div
//                 key={f.id}
//                 className={`flex items-center gap-4 px-5 py-4 transition-colors ${darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
//               >
//                 <div
//                   className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${getTypeColorClasses(f.type, darkMode)}`}
//                 >
//                   {getFileIcon(f.type, "w-5 h-5")}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold truncate">{f.name}</p>
//                   <p
//                     className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//                   >
//                     Uploaded on {formatDate(f.uploadedAt)}
//                   </p>
//                 </div>
//                 <div
//                   className={`hidden sm:block text-xs w-24 text-right ${darkMode ? "text-slate-400" : "text-slate-500"}`}
//                 >
//                   {formatSize(f.size)}
//                 </div>
//                 <button
//                   onClick={() => handleDownload(f.url)}
//                   className={`p-2 ml-4 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}
//                 >
//                   <Download className="w-5 h-5" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyFiles;



import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  Upload,
  Search,
  Grid3X3,
  List,
  Download,
  Eye, 
  Trash2,
  FileText,
  FileImage,
  FileArchive,
  File,
  FolderOpen,
  X,
  Loader2,
  Tag,
  Plus,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useTheme } from "../context/themeContext";
import apiClient from "../utils/apiClient";

const FILE_TYPES = ["all", "docs", "pdf", "image", "text", "zip"];

// Helpers
const formatSize = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "Unknown date";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getFileIcon = (type, size = "w-5 h-5") => {
  if (!type) return <File className={size} />;
  if (type.includes("docs")) return <FileText className={size} />; 
  if (type.includes("pdf")) return <FileText className={size} />;
  if (type.includes("image")) return <FileImage className={size} />;
  if (type.includes("zip")) return <FileArchive className={size} />;
  if (type.includes("text")) return <FileText className={size} />;
  return <File className={size} />;
};

const getTypeColorClasses = (type, darkMode) => {
  if (!type)
    return darkMode
      ? "bg-slate-800 text-slate-300 border-slate-700"
      : "bg-slate-100 text-slate-600 border-slate-200";
  if (type.includes("docs")) 
    return darkMode
      ? "bg-indigo-900/30 text-indigo-400 border-indigo-800"
      : "bg-indigo-50 text-indigo-600 border-indigo-200";
  if (type.includes("pdf"))
    return darkMode
      ? "bg-red-900/30 text-red-400 border-red-800"
      : "bg-red-50 text-red-600 border-red-200";
  if (type.includes("image"))
    return darkMode
      ? "bg-emerald-900/30 text-emerald-400 border-emerald-800"
      : "bg-emerald-50 text-emerald-600 border-emerald-200";
  if (type.includes("zip"))
    return darkMode
      ? "bg-amber-900/30 text-amber-400 border-amber-800"
      : "bg-amber-50 text-amber-600 border-amber-200";
  return darkMode
    ? "bg-slate-800 text-slate-300 border-slate-700"
    : "bg-slate-100 text-slate-600 border-slate-200";
};

// --- NEW HELPER: Routes unsupported docs through Google Viewer ---
const getViewerUrl = (url, name) => {
  if (!url) return "";
  const ext = name?.split('.').pop().toLowerCase();
  
  // Browsers can't natively render Office files. Wrap them in Google Docs Viewer.
  // Note: This requires the URL to be publicly accessible (not localhost).
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }
  return url;
};

const TagPill = ({ tag, active, onClick, removable, onRemove, darkMode }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap ${
      active
        ? darkMode
          ? "bg-blue-900/30 text-blue-400 border-blue-800"
          : "bg-blue-50 text-blue-600 border-blue-200"
        : darkMode
          ? "bg-slate-800 text-slate-400 border-slate-700"
          : "bg-slate-50 text-slate-500 border-slate-200"
    }`}
  >
    <Tag className="w-2.5 h-2.5" />
    {tag}
  </button>
);

const MyFiles = () => {
  const { darkMode } = useTheme();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // File Viewer State
  const [viewingFile, setViewingFile] = useState(null);

  // Filters and Views
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [tagFilters, setTagFilters] = useState([]);
  const [sort, setSort] = useState({ key: "uploadedAt", dir: "desc" });
  const [view, setView] = useState("grid");

  const fileInputRef = useRef(null);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/upload/my-files");
      const formatted = res.data.files.map((f) => ({
        id: f._id,
        name: f.fileName,
        url: f.fileUrl,
        type: f.fileType,
        size: f.size,
        tags: f.tags || [],
        uploadedAt: f.createdAt,
      }));
      setFiles(formatted);
    } catch (err) {
      console.error("Failed to fetch files", err);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchFiles();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = (url) => {
    if (url) window.open(url, "_blank");
  };

  const filteredFiles = useMemo(() => {
    let result = files.filter((f) => {
      const matchSearch = !search || f.name.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || (f.type && f.type.includes(typeFilter));
      const matchTags = tagFilters.length === 0 || tagFilters.every((t) => (f.tags || []).includes(t));
      return matchSearch && matchType && matchTags;
    });

    result.sort((a, b) => {
      let va = a[sort.key] || "", vb = b[sort.key] || "";
      if (sort.key === "name") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      if (sort.key === "size" || sort.key === "uploadedAt") {
        va = new Date(va).getTime?.() ?? va;
        vb = new Date(vb).getTime?.() ?? vb;
      }
      return sort.dir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });

    return result;
  }, [files, search, typeFilter, tagFilters, sort]);

  const toggleSort = (key) =>
    setSort((s) => ({
      key,
      dir: s.key === key ? (s.dir === "asc" ? "desc" : "asc") : "desc",
    }));

  const SortBtn = ({ label, k }) => (
    <button
      onClick={() => toggleSort(k)}
      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${sort.key === k ? (darkMode ? "text-blue-400" : "text-blue-600") : darkMode ? "text-slate-400" : "text-slate-500"}`}
    >
      {label}{" "}
      {sort.key === k ? (
        sort.dir === "asc" ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
      ) : (
        <SortAsc className="w-3 h-3 opacity-30" />
      )}
    </button>
  );

  return (
    <div className={`flex flex-col h-full space-y-6 ${darkMode ? "text-white" : "text-slate-900"}`}>
      
      {/* Viewer Modal 
        - Increased width to w-[95vw] and max-w-7xl
        - Removed bezels (padding) from the iframe container
      */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className={`w-[95vw] max-w-7xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getTypeColorClasses(viewingFile.type, darkMode)}`}>
                  {getFileIcon(viewingFile.type, "w-5 h-5")}
                </div>
                <div>
                  <h3 className="font-bold truncate max-w-sm sm:max-w-md">{viewingFile.name}</h3>
                  <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{formatSize(viewingFile.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleDownload(viewingFile.url)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button onClick={() => setViewingFile(null)} className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe Container - No padding for maximum view size */}
            <div className={`flex-1 relative w-full h-full ${darkMode ? "bg-slate-900" : "bg-slate-100"}`}>
              <iframe 
                src={getViewerUrl(viewingFile.url, viewingFile.name)} 
                className="absolute inset-0 w-full h-full border-none"
                title="File Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${darkMode ? "bg-blue-900/30 border-blue-800 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">My Files</h1>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {filteredFiles.length} files available
              </p>
            </div>
          </div>

          <label className="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md transition-all">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload New File"}
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* TOOLBAR SECTION */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full xl:w-auto xl:flex-1">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className={`w-full border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${darkMode ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"}`}
            />
          </div>

          <div className={`flex items-center gap-1.5 p-1.5 border rounded-xl overflow-x-auto w-full sm:w-auto ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            {FILE_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap ${
                  typeFilter === t
                    ? "bg-blue-600 text-white shadow-md"
                    : darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 xl:mt-0 justify-between sm:justify-end">
          <div className={`flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl border shadow-sm w-full sm:w-auto justify-center ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}>
            <SortBtn label="Name" k="name" />
            <span className={darkMode ? "text-slate-600" : "text-slate-300"}>·</span>
            <SortBtn label="Size" k="size" />
            <span className={darkMode ? "text-slate-600" : "text-slate-300"}>·</span>
            <SortBtn label="Date" k="uploadedAt" />
          </div>

          <div className={`flex rounded-xl border overflow-hidden shrink-0 shadow-sm ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}>
            <button onClick={() => setView("grid")} className={`p-2 transition-all ${view === "grid" ? "bg-blue-600 text-white" : darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-50"}`}><Grid3X3 className="w-5 h-5" /></button>
            <button onClick={() => setView("list")} className={`p-2 transition-all ${view === "list" ? "bg-blue-600 text-white" : darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-50"}`}><List className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
      ) : filteredFiles.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-300 bg-white"}`}>
          <FolderOpen className={`w-16 h-16 mb-4 ${darkMode ? "text-slate-600" : "text-slate-400"}`} />
          <h3 className="text-lg font-bold mb-2">No files found</h3>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((f) => (
            <div key={f.id} className={`flex flex-col rounded-2xl p-5 border shadow-sm transition-all hover:shadow-md group ${darkMode ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-300"}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getTypeColorClasses(f.type, darkMode)}`}>
                  {getFileIcon(f.type, "w-6 h-6")}
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setViewingFile(f)} className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}>
                    <Eye className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDownload(f.url)} className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" title={f.name}>{f.name}</p>
                <div className={`flex items-center gap-2 mt-1 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  <span>{formatSize(f.size)}</span><span>•</span><span>{formatDate(f.uploadedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
          <div className={`flex flex-col divide-y ${darkMode ? "divide-slate-700" : "divide-slate-200"}`}>
            {filteredFiles.map((f) => (
              <div key={f.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${getTypeColorClasses(f.type, darkMode)}`}>
                  {getFileIcon(f.type, "w-5 h-5")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{f.name}</p>
                  <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Uploaded on {formatDate(f.uploadedAt)}</p>
                </div>
                <div className={`hidden sm:block text-xs w-24 text-right ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{formatSize(f.size)}</div>
                
                <div className="flex items-center gap-1 ml-4">
                  <button onClick={() => setViewingFile(f)} className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}>
                    <Eye className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDownload(f.url)} className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFiles;