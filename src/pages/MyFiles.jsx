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
  Edit2,
  FileText,
  FileImage,
  FileArchive,
  File,
  FileSpreadsheet,
  FolderOpen,
  X,
  Loader2,
  Tag,
  SortAsc,
  SortDesc,
  CheckSquare,
  Square,
} from "lucide-react";
import { useTheme } from "../context/themeContext";
import apiClient from "../utils/apiClient";

// ADDED "excel" TO FILE_TYPES[cite: 20]
const FILE_TYPES = ["all", "docs", "excel", "pdf", "image", "text", "zip"];

// Helpers[cite: 20]
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

// ADDED EXCEL HANDLING[cite: 20]
const getFileIcon = (type, size = "w-5 h-5") => {
  if (!type) return <File className={size} />;
  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    type.includes("csv")
  )
    return <FileSpreadsheet className={size} />;
  if (type.includes("docs") || type.includes("word"))
    return <FileText className={size} />;
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
  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    type.includes("csv")
  )
    return darkMode
      ? "bg-green-900/30 text-green-400 border-green-800"
      : "bg-green-50 text-green-600 border-green-200";
  if (type.includes("docs") || type.includes("word"))
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

const getViewerUrl = (url, name) => {
  if (!url) return "";
  const ext = name?.split(".").pop().toLowerCase();
  if (["doc", "docx", "xls", "xlsx", "csv", "ppt", "pptx"].includes(ext)) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }
  return url;
};

const MyFiles = () => {
  const { darkMode } = useTheme();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Modals[cite: 20]
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [viewingFile, setViewingFile] = useState(null);
  const fileInputRef = useRef(null);

  // UI/UX Enhancements (Selection, Bulk Actions, Rename)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [fileToRename, setFileToRename] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filters and Views[cite: 20]
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState({ key: "uploadedAt", dir: "desc" });
  const [view, setView] = useState("list");

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
      setSelectedFiles([]); // Clear selection on fetch
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

  // Upload Logic[cite: 20]
  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) setPendingFile(e.target.files[0]);
  };

  const handleConfirmUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", pendingFile);

    try {
      await apiClient.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchFiles();
      closeUploadModal();
    } catch (error) {
      alert("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  // CRUD Enhancements
  const handleDownload = (url) => {
    if (url) window.open(url, "_blank");
  };

  const handleDeleteSingle = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setIsProcessing(true);
    try {
      await apiClient.delete(`/upload/${id}`);
      await fetchFiles();
    } catch (error) {
      alert("Failed to delete file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedFiles.length} selected files?`,
      )
    )
      return;
    setIsProcessing(true);
    try {
      await apiClient.post(`/upload/bulk-delete`, { ids: selectedFiles });
      await fetchFiles();
    } catch (error) {
      alert("Failed to delete selected files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openRenameModal = (file) => {
    setFileToRename(file);
    setNewFileName(file.name);
    setRenameModalOpen(true);
  };

  const handleConfirmRename = async (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    setIsProcessing(true);
    try {
      await apiClient.put(`/upload/${fileToRename.id}`, {
        fileName: newFileName,
      });
      await fetchFiles();
      setRenameModalOpen(false);
    } catch (error) {
      alert("Failed to rename file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Selection Logic
  const toggleSelection = (id) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id],
    );
  };
  const toggleAllSelection = (currentFilteredFiles) => {
    if (
      selectedFiles.length === currentFilteredFiles.length &&
      currentFilteredFiles.length > 0
    ) {
      setSelectedFiles([]); // Deselect all
    } else {
      setSelectedFiles(currentFilteredFiles.map((f) => f.id)); // Select all
    }
  };

  // Filter & Sort Logic[cite: 20]
  const filteredFiles = useMemo(() => {
    let result = files.filter((f) => {
      const matchSearch =
        !search || f.name.toLowerCase().includes(search.toLowerCase());

      const isExcel =
        f.type?.includes("spreadsheet") ||
        f.type?.includes("excel") ||
        f.type?.includes("csv");
      const matchType =
        typeFilter === "all" ||
        (typeFilter === "excel" && isExcel) ||
        (!isExcel && f.type && f.type.includes(typeFilter));

      return matchSearch && matchType;
    });

    result.sort((a, b) => {
      let va = a[sort.key] || "",
        vb = b[sort.key] || "";
      if (sort.key === "name") {
        va = va.toLowerCase();
        vb = vb.toLowerCase();
      }
      if (sort.key === "size" || sort.key === "uploadedAt") {
        va = new Date(va).getTime?.() ?? va;
        vb = new Date(vb).getTime?.() ?? vb;
      }
      return sort.dir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
    return result;
  }, [files, search, typeFilter, sort]);

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
        sort.dir === "asc" ? (
          <SortAsc className="w-3 h-3" />
        ) : (
          <SortDesc className="w-3 h-3" />
        )
      ) : (
        <SortAsc className="w-3 h-3 opacity-30" />
      )}
    </button>
  );

  return (
    <div
      className={`flex flex-col h-full space-y-6 ${darkMode ? "text-white" : "text-slate-900"}`}
    >
      {/* RENAME MODAL */}
      {renameModalOpen && fileToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Rename File</h3>
              <button
                onClick={() => setRenameModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmRename}>
              <input
                type="text"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className={`w-full border rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-colors mb-6 ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRenameModalOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !newFileName.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Edit2 className="w-4 h-4" />
                  )}{" "}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL[cite: 20] */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Upload New File</h3>
              <button
                onClick={closeUploadModal}
                disabled={uploading}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {!pendingFile ? (
              <label
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${darkMode ? "border-slate-600 hover:border-blue-500 bg-slate-900/50" : "border-slate-300 hover:border-blue-500 bg-slate-50"}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <Upload
                    className={`w-8 h-8 mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                  />
                  <p
                    className={`text-sm mb-1 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                  >
                    <span className="font-semibold text-blue-500">
                      Click to browse
                    </span>{" "}
                    or drag and drop
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              <div className="flex flex-col gap-4">
                <div
                  className={`flex flex-col p-4 rounded-xl border ${darkMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}
                >
                  {pendingFile.type && pendingFile.type.startsWith("image/") ? (
                    <div className="w-full h-40 mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/5">
                      <img src={URL.createObjectURL(pendingFile)} alt="preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-full h-40 mb-4 rounded-lg flex flex-col items-center justify-center bg-blue-50/50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                      <FileText className="w-12 h-12 mb-3 opacity-80" />
                      <span className="text-xs font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900/40 rounded-full">{pendingFile.type || "Unknown File Type"}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-4">
                      <p
                        className="text-base font-bold truncate"
                        title={pendingFile.name}
                      >
                        {pendingFile.name}
                      </p>
                      <div className={`flex items-center gap-2 mt-1.5 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        <span className="font-medium bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">{formatSize(pendingFile.size)}</span>
                        <span>•</span>
                        <span>{formatDate(pendingFile.lastModified)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPendingFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      disabled={uploading}
                      className={`p-2.5 shrink-0 rounded-xl text-red-500 transition-colors ${darkMode ? "bg-red-900/20 hover:bg-red-900/40" : "bg-red-50 hover:bg-red-100"} disabled:opacity-50`}
                      title="Remove file"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeUploadModal}
                disabled={uploading}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"} disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpload}
                disabled={!pendingFile || uploading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}{" "}
                {uploading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEWER MODAL[cite: 20] */}
      {viewingFile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
          <div
            className={`w-[95vw] max-w-7xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <div
              className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${darkMode ? "border-slate-700" : "border-slate-200"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getTypeColorClasses(viewingFile.type, darkMode)}`}
                >
                  {getFileIcon(viewingFile.type, "w-5 h-5")}
                </div>
                <div>
                  <h3 className="font-bold truncate max-w-sm sm:max-w-md">
                    {viewingFile.name}
                  </h3>
                  <p
                    className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {formatSize(viewingFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleDownload(viewingFile.url)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
                <button
                  onClick={() => setViewingFile(null)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div
              className={`flex-1 relative w-full h-full ${darkMode ? "bg-slate-900" : "bg-slate-100"}`}
            >
              <iframe
                src={getViewerUrl(viewingFile.url, viewingFile.name)}
                className="absolute inset-0 w-full h-full border-none"
                title="File Viewer"
              />
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION[cite: 20] */}
      <div
        className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${darkMode ? "bg-blue-900/30 border-blue-800 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600"}`}
            >
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">My Files</h1>
              <p
                className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                {filteredFiles.length} files available
              </p>
            </div>
          </div>
          <button
            onClick={openUploadModal}
            className="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Upload className="w-4 h-4" /> Upload New File
          </button>
        </div>
      </div>

      {/* BULK ACTIONS BAR (Appears only when items are selected) */}
      {selectedFiles.length > 0 && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-md animate-fadeUp ${darkMode ? "bg-indigo-900/30 border-indigo-700" : "bg-indigo-50 border-indigo-200"}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 text-sm font-bold rounded-lg ${darkMode ? "bg-indigo-900/60 text-indigo-300" : "bg-indigo-200 text-indigo-800"}`}
            >
              {selectedFiles.length} Selected
            </span>
            <button
              onClick={() => setSelectedFiles([])}
              className={`text-sm font-medium hover:underline ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}
            >
              Clear Selection
            </button>
          </div>
          <button
            onClick={handleBulkDelete}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}{" "}
            Delete Selected
          </button>
        </div>
      )}

      {/* TOOLBAR SECTION[cite: 20] */}
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

          <div
            className={`flex items-center gap-1.5 p-1.5 border rounded-xl overflow-x-auto w-full sm:w-auto ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            {FILE_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all whitespace-nowrap ${
                  typeFilter === t
                    ? "bg-blue-600 text-white shadow-md"
                    : darkMode
                      ? "text-slate-400 hover:bg-slate-700"
                      : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 xl:mt-0 justify-between sm:justify-end">
          <div
            className={`flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl border shadow-sm w-full sm:w-auto justify-center ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
          >
            <SortBtn label="Name" k="name" />
            <span className={darkMode ? "text-slate-600" : "text-slate-300"}>
              ·
            </span>
            <SortBtn label="Size" k="size" />
            <span className={darkMode ? "text-slate-600" : "text-slate-300"}>
              ·
            </span>
            <SortBtn label="Date" k="uploadedAt" />
          </div>

          <div
            className={`flex rounded-xl border overflow-hidden shrink-0 shadow-sm ${darkMode ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}
          >
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-all ${view === "grid" ? "bg-blue-600 text-white" : darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-all ${view === "list" ? "bg-blue-600 text-white" : darkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT AREA[cite: 20] */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-300 bg-white"}`}
        >
          <FolderOpen
            className={`w-16 h-16 mb-4 ${darkMode ? "text-slate-600" : "text-slate-400"}`}
          />
          <h3 className="text-lg font-bold mb-2">No files found</h3>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles.map((f) => {
            const isSelected = selectedFiles.includes(f.id);
            return (
              <div
                key={f.id}
                className={`relative flex flex-col rounded-2xl p-5 border shadow-sm transition-all group ${
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/10"
                    : darkMode
                      ? "bg-slate-800 border-slate-700 hover:border-slate-500"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {/* Checkbox (Absolute positioning inside card) */}
                <div
                  className={`absolute top-4 right-4 z-10 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <button onClick={(e) => { e.stopPropagation(); toggleSelection(f.id); }}>
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square
                        className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-300"}`}
                      />
                    )}
                  </button>
                </div>

                <div className="flex items-start justify-between mb-4 mt-2">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border ${getTypeColorClasses(f.type, darkMode)}`}
                  >
                    {getFileIcon(f.type, "w-6 h-6")}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-semibold truncate mb-1"
                    title={f.name}
                  >
                    {f.name}
                  </p>
                  <div
                    className={`flex items-center gap-2 mt-1 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                  >
                    <span>{formatSize(f.size)}</span>
                    <span>•</span>
                    <span>{formatDate(f.uploadedAt)}</span>
                  </div>
                </div>

                {/* Card Action Buttons (Hover Reveal) */}
                <div
                  className="flex items-center justify-end gap-1 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setViewingFile(f)}
                    className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(f.url)}
                    className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openRenameModal(f)}
                    className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-indigo-400" : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}
                    title="Rename"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSingle(f.id, f.name)}
                    className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-red-400" : "text-slate-400 hover:bg-red-50 hover:text-red-600"}`}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <table className="w-full text-left">
            <thead
              className={`border-b ${darkMode ? "bg-slate-900/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}
            >
              <tr>
                <th className="px-5 py-3 w-12 text-center">
                  <button onClick={() => toggleAllSelection(filteredFiles)}>
                    {selectedFiles.length === filteredFiles.length &&
                    filteredFiles.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 mx-auto" />
                    ) : (
                      <Square
                        className={`w-4 h-4 mx-auto ${darkMode ? "text-slate-600" : "text-slate-300"}`}
                      />
                    )}
                  </button>
                </th>
                <th
                  className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  File Name
                </th>
                <th
                  className={`hidden sm:table-cell px-5 py-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  Size
                </th>
                <th
                  className={`hidden md:table-cell px-5 py-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  Uploaded
                </th>
                <th className="px-5 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${darkMode ? "divide-slate-700" : "divide-slate-200"}`}
            >
              {filteredFiles.map((f) => {
                const isSelected = selectedFiles.includes(f.id);
                return (
                  <tr
                    key={f.id}
                    className={`transition-colors ${isSelected ? (darkMode ? "bg-blue-900/20" : "bg-blue-50/50") : darkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
                  >
                    <td
                      className="px-5 py-4 w-12 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => toggleSelection(f.id)}>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 mx-auto" />
                        ) : (
                          <Square
                            className={`w-4 h-4 mx-auto ${darkMode ? "text-slate-600" : "text-slate-300"}`}
                          />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${getTypeColorClasses(f.type, darkMode)}`}
                        >
                          {getFileIcon(f.type, "w-4 h-4")}
                        </div>
                        <p className="text-sm font-semibold truncate max-w-[200px] sm:max-w-xs">
                          {f.name}
                        </p>
                      </div>
                    </td>
                    <td
                      className={`hidden sm:table-cell px-5 py-4 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {formatSize(f.size)}
                    </td>
                    <td
                      className={`hidden md:table-cell px-5 py-4 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      {formatDate(f.uploadedAt)}
                    </td>
                    <td
                      className="px-5 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingFile(f)}
                          className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(f.url)}
                          className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-blue-400" : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"}`}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openRenameModal(f)}
                          className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-indigo-400" : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSingle(f.id, f.name)}
                          className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-red-400" : "text-slate-400 hover:bg-red-50 hover:text-red-600"}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyFiles;
