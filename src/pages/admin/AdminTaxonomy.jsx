import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "../../context/themeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tags,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  X,
  Search,
  ChevronDown,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Clipboard,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import apiClient from "../../utils/apiClient";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseBulkInput = (raw) => {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const rows = lines.map((line) => {
    const parts = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    const [rawCategory = "", rawTag = ""] = parts.map((p) =>
      p.trim().replace(/^"|"$/g, ""),
    );
    return { categoryName: rawCategory, tagName: rawTag };
  });

  const first = rows[0];
  const looksLikeHeader =
    /^categor/i.test(first.categoryName) && /^tag/i.test(first.tagName);

  return looksLikeHeader ? rows.slice(1) : rows;
};

const SAMPLE_CSV = `Category,Tag\nArrays,Two Pointers\nArrays,Sliding Window\nGraphs,DFS\nGraphs,BFS\n`;

let toastId = 0;

const useToasts = () => {
  const [toasts, setToasts] = useState([]);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const push = (message, type = "success") => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => dismiss(id), 3800);
  };

  return { toasts, push, dismiss };
};

const ToastStack = ({ toasts, dismiss, darkMode }) => (
  <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.2 }}
          onClick={() => dismiss(t.id)}
          className={`flex items-start gap-2.5 px-4 py-3 rounded-xl shadow-lg border cursor-pointer ${
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
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

const AdminTaxonomy = () => {
  const { darkMode } = useTheme();
  const { toasts, push, dismiss } = useToasts();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState(new Set());

  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    isEditing: false,
    id: null,
  });
  const [tagModal, setTagModal] = useState({
    isOpen: false,
    isEditing: false,
    id: null,
  });
  const [bulkModal, setBulkModal] = useState({ isOpen: false });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });
  const [tagForm, setTagForm] = useState({
    name: "",
    slug: "",
    categoryId: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, tagRes] = await Promise.all([
        apiClient.get("/category"),
        apiClient.get("/tag"),
      ]);
      setCategories(catRes.data || []);
      setTags(tagRes.data || []);
    } catch (error) {
      push(
        "Could not load categories and tags. Try refreshing the page.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && expandedIds.size === 0) {
      setExpandedIds(new Set(categories.map((c) => c._id)));
    }
  }, [categories]);

  const refreshTags = async () => {
    const tagRes = await apiClient.get("/tag");
    setTags(tagRes.data || []);
  };

  const grouped = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const tagsByCategory = new Map();
    tags.forEach((tag) => {
      const catId = tag.category?._id || tag.category;
      if (!tagsByCategory.has(catId)) tagsByCategory.set(catId, []);
      tagsByCategory.get(catId).push(tag);
    });

    return categories
      .map((cat) => {
        const catTags = (tagsByCategory.get(cat._id) || [])
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name));
        const categoryMatches =
          !q ||
          cat.name.toLowerCase().includes(q) ||
          cat.slug.toLowerCase().includes(q);
        const matchingTags = q
          ? catTags.filter(
              (t) =>
                t.name.toLowerCase().includes(q) ||
                t.slug.toLowerCase().includes(q),
            )
          : catTags;

        return {
          ...cat,
          allTags: catTags,
          visibleTags: categoryMatches && !q ? catTags : matchingTags,
          isVisible: !q || categoryMatches || matchingTags.length > 0,
        };
      })
      .filter((c) => c.isVisible)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, tags, searchQuery]);

  const stats = useMemo(
    () => ({ categoryCount: categories.length, tagCount: tags.length }),
    [categories, tags],
  );

  useEffect(() => {
    if (!searchQuery.trim()) return;
    setExpandedIds((prev) => {
      const next = new Set(prev);
      grouped.forEach((c) => next.add(c._id));
      return next;
    });
  }, [searchQuery]);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openCategoryCreate = () => {
    setCategoryForm({ name: "", slug: "" });
    setCategoryModal({ isOpen: true, isEditing: false, id: null });
  };

  const openCategoryEdit = (category) => {
    setCategoryForm({ name: category.name, slug: category.slug });
    setCategoryModal({ isOpen: true, isEditing: true, id: category._id });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.slug)
      return push("Name and slug are required.", "error");

    try {
      if (categoryModal.isEditing) {
        const { data } = await apiClient.put(
          `/category/${categoryModal.id}`,
          categoryForm,
        );
        setCategories((prev) =>
          prev.map((c) => (c._id === categoryModal.id ? data : c)),
        );
        push(`"${data.name}" updated.`);
      } else {
        const { data } = await apiClient.post("/category", categoryForm);
        setCategories((prev) => [...prev, data]);
        setExpandedIds((prev) => new Set(prev).add(data._id));
        push(`"${data.name}" created.`);
      }
      setCategoryModal({ isOpen: false, isEditing: false, id: null });
    } catch (error) {
      push(
        error.response?.data?.message || "Failed to save category.",
        "error",
      );
    }
  };

  const confirmDeleteCategory = (category) =>
    setDeleteConfirm({
      type: "category",
      id: category._id,
      name: category.name,
    });

  const confirmDeleteTag = (tag) =>
    setDeleteConfirm({ type: "tag", id: tag._id, name: tag.name });

  const handleConfirmedDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id, name } = deleteConfirm;
    try {
      if (type === "category") {
        await apiClient.delete(`/category/${id}`);
        setCategories((prev) => prev.filter((c) => c._id !== id));
        await refreshTags();
        push(`Category "${name}" deleted.`);
      } else {
        await apiClient.delete(`/tag/${id}`);
        setTags((prev) => prev.filter((t) => t._id !== id));
        push(`Tag "${name}" deleted.`);
      }
    } catch (error) {
      push(
        error.response?.data?.message || `Failed to delete ${type}.`,
        "error",
      );
    } finally {
      setDeleteConfirm(null);
    }
  };

  const openTagCreate = (categoryId = "") => {
    setTagForm({ name: "", slug: "", categoryId });
    setTagModal({ isOpen: true, isEditing: false, id: null });
  };

  const openTagEdit = (tag) => {
    setTagForm({
      name: tag.name,
      slug: tag.slug,
      categoryId: tag.category?._id || tag.category,
    });
    setTagModal({ isOpen: true, isEditing: true, id: tag._id });
  };

  const handleTagSubmit = async (e) => {
    e.preventDefault();
    if (!tagForm.name || !tagForm.slug || !tagForm.categoryId) {
      return push(
        "Name, slug, and a parent category are all required.",
        "error",
      );
    }

    try {
      if (tagModal.isEditing) {
        await apiClient.put(`/tag/${tagModal.id}`, tagForm);
        push(`"${tagForm.name}" updated.`);
      } else {
        await apiClient.post("/tag", tagForm);
        push(`"${tagForm.name}" added.`);
      }
      await refreshTags();
      setTagModal({ isOpen: false, isEditing: false, id: null });
    } catch (error) {
      push(error.response?.data?.message || "Failed to save tag.", "error");
    }
  };

  const handleBulkSubmit = async (rows) => {
    const { data } = await apiClient.post("/tag/bulk", { rows });
    await fetchData();
    return data;
  };

  const downloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tags-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const card = darkMode
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200";
  const inputCls = `w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
    darkMode
      ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600"
      : "bg-slate-50 border-slate-200 text-slate-900"
  }`;
  const label =
    "block text-xs font-bold mb-1.5 opacity-70 uppercase tracking-wider";

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Taxonomy
          </h1>
          <p
            className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Manage problem categories and the tags nested inside each one.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBulkModal({ isOpen: true })}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-colors ${
              darkMode
                ? "border-slate-700 text-slate-200 hover:bg-slate-800"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={openCategoryCreate}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>
      </div>

      {/* ============ SEARCH + STATS ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search
            className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories or tags…"
            className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
          <span
            className={`px-3 py-1.5 rounded-lg ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}
          >
            {stats.categoryCount}{" "}
            {stats.categoryCount === 1 ? "category" : "categories"}
          </span>
          <span
            className={`px-3 py-1.5 rounded-lg ${darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}
          >
            {stats.tagCount} {stats.tagCount === 1 ? "tag" : "tags"}
          </span>
        </div>
      </div>

      {/* ============ LIST ============ */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-16 rounded-2xl border animate-pulse ${darkMode ? "bg-slate-800/60 border-slate-700" : "bg-slate-100 border-slate-200"}`}
            />
          ))}
        </div>
      ) : grouped.length === 0 ? (
        <EmptyState
          darkMode={darkMode}
          hasQuery={!!searchQuery.trim()}
          onClear={() => setSearchQuery("")}
          onCreate={openCategoryCreate}
        />
      ) : (
        <div className="space-y-3">
          {grouped.map((cat) => (
            <CategoryRow
              key={cat._id}
              category={cat}
              expanded={expandedIds.has(cat._id)}
              onToggle={() => toggleExpanded(cat._id)}
              onEditCategory={() => openCategoryEdit(cat)}
              onDeleteCategory={() => confirmDeleteCategory(cat)}
              onAddTag={() => openTagCreate(cat._id)}
              onEditTag={openTagEdit}
              onDeleteTag={confirmDeleteTag}
              darkMode={darkMode}
              card={card}
              highlightQuery={searchQuery.trim()}
            />
          ))}
        </div>
      )}

      {/* ============ CATEGORY MODAL ============ */}
      <AnimatePresence>
        {categoryModal.isOpen && (
          <ModalShell
            darkMode={darkMode}
            onClose={() =>
              setCategoryModal({ isOpen: false, isEditing: false, id: null })
            }
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-500" />
                {categoryModal.isEditing ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={() =>
                  setCategoryModal({
                    isOpen: false,
                    isEditing: false,
                    id: null,
                  })
                }
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className={label}>Display Name</label>
                <input
                  type="text"
                  autoFocus
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({
                      name: e.target.value,
                      slug: slugify(e.target.value),
                    })
                  }
                  placeholder="e.g., Dynamic Programming"
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={label}>URL Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      slug: slugify(e.target.value),
                    })
                  }
                  placeholder="dynamic-programming"
                  required
                  className={inputCls}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setCategoryModal({
                      isOpen: false,
                      isEditing: false,
                      id: null,
                    })
                  }
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-medium text-sm transition-colors"
                >
                  {categoryModal.isEditing ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ============ TAG MODAL ============ */}
      <AnimatePresence>
        {tagModal.isOpen && (
          <ModalShell
            darkMode={darkMode}
            onClose={() =>
              setTagModal({ isOpen: false, isEditing: false, id: null })
            }
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Tags className="w-5 h-5 text-indigo-500" />
                {tagModal.isEditing ? "Edit Tag" : "New Tag"}
              </h3>
              <button
                onClick={() =>
                  setTagModal({ isOpen: false, isEditing: false, id: null })
                }
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTagSubmit} className="space-y-4">
              <div>
                <label className={label}>Category</label>
                <select
                  value={tagForm.categoryId}
                  onChange={(e) =>
                    setTagForm({ ...tagForm, categoryId: e.target.value })
                  }
                  required
                  className={inputCls.replace(
                    "focus:ring-blue-500",
                    "focus:ring-indigo-500",
                  )}
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>Tag Name</label>
                <input
                  type="text"
                  autoFocus
                  value={tagForm.name}
                  onChange={(e) =>
                    setTagForm({
                      ...tagForm,
                      name: e.target.value,
                      slug: slugify(e.target.value),
                    })
                  }
                  placeholder="e.g., Binary Search"
                  required
                  className={inputCls.replace(
                    "focus:ring-blue-500",
                    "focus:ring-indigo-500",
                  )}
                />
              </div>
              <div>
                <label className={label}>Slug</label>
                <input
                  type="text"
                  value={tagForm.slug}
                  onChange={(e) =>
                    setTagForm({ ...tagForm, slug: slugify(e.target.value) })
                  }
                  placeholder="binary-search"
                  required
                  className={inputCls.replace(
                    "focus:ring-blue-500",
                    "focus:ring-indigo-500",
                  )}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setTagModal({ isOpen: false, isEditing: false, id: null })
                  }
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm font-medium text-sm transition-colors"
                >
                  {tagModal.isEditing ? "Save Changes" : "Add Tag"}
                </button>
              </div>
            </form>
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ============ BULK UPLOAD MODAL ============ */}
      <AnimatePresence>
        {bulkModal.isOpen && (
          <BulkUploadModal
            darkMode={darkMode}
            categories={categories}
            onClose={() => setBulkModal({ isOpen: false })}
            onSubmit={handleBulkSubmit}
            onDownloadSample={downloadSampleCsv}
            push={push}
          />
        )}
      </AnimatePresence>

      {/* ============ DELETE CONFIRM ============ */}
      <AnimatePresence>
        {deleteConfirm && (
          <ModalShell
            darkMode={darkMode}
            onClose={() => setDeleteConfirm(null)}
            maxWidth="max-w-sm"
          >
            <div className="text-center">
              <div
                className={`mx-auto w-11 h-11 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-red-900/30" : "bg-red-100"}`}
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-base font-bold mb-1">
                Delete {deleteConfirm.type === "category" ? "category" : "tag"}?
              </h3>
              <p
                className={`text-sm mb-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                {deleteConfirm.type === "category"
                  ? `"${deleteConfirm.name}" and any tags nested inside it will be removed. This can't be undone.`
                  : `"${deleteConfirm.name}" will be permanently removed.`}
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmedDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm font-medium text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </ModalShell>
        )}
      </AnimatePresence>

      <ToastStack toasts={toasts} dismiss={dismiss} darkMode={darkMode} />
    </div>
  );
};

const CategoryRow = ({
  category,
  expanded,
  onToggle,
  onEditCategory,
  onDeleteCategory,
  onAddTag,
  onEditTag,
  onDeleteTag,
  darkMode,
  card,
  highlightQuery,
}) => {
  const highlight = (text) => {
    if (!highlightQuery) return text;
    const idx = text.toLowerCase().indexOf(highlightQuery.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-amber-300/60 text-inherit rounded-sm">
          {text.slice(idx, idx + highlightQuery.length)}
        </mark>
        {text.slice(idx + highlightQuery.length)}
      </>
    );
  };

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${card}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors ${
          darkMode ? "hover:bg-slate-900/40" : "hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            animate={{ rotate: expanded ? 0 : -90 }}
            transition={{ duration: 0.15 }}
          >
            <ChevronDown
              className={`w-4 h-4 shrink-0 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
            />
          </motion.div>
          {expanded ? (
            <FolderOpen
              className={`w-5 h-5 shrink-0 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
            />
          ) : (
            <Folder
              className={`w-5 h-5 shrink-0 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
            />
          )}
          <div className="min-w-0">
            <div
              className={`text-sm font-semibold truncate ${darkMode ? "text-slate-100" : "text-slate-800"}`}
            >
              {highlight(category.name)}
            </div>
            <div
              className={`text-xs truncate ${darkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              /{category.slug}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs font-bold px-2 py-1 rounded-lg ${darkMode ? "bg-slate-900 text-slate-400" : "bg-slate-100 text-slate-500"}`}
          >
            {category.allTags.length}
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onEditCategory();
            }}
            onKeyDown={(e) => e.key === "Enter" && onEditCategory()}
            className={`p-1.5 rounded-lg text-slate-400 transition-colors ${darkMode ? "hover:text-blue-400 hover:bg-slate-700" : "hover:text-blue-600 hover:bg-blue-100/50"}`}
          >
            <Edit2 className="w-4 h-4" />
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCategory();
            }}
            onKeyDown={(e) => e.key === "Enter" && onDeleteCategory()}
            className={`p-1.5 rounded-lg text-slate-400 transition-colors ${darkMode ? "hover:text-red-400 hover:bg-slate-700" : "hover:text-red-500 hover:bg-red-100/50"}`}
          >
            <Trash2 className="w-4 h-4" />
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div
              className={`px-5 pb-5 pt-1 flex flex-wrap gap-2 border-t ${darkMode ? "border-slate-700/60" : "border-slate-100"}`}
            >
              {category.visibleTags.map((tag) => (
                <div
                  key={tag._id}
                  className={`group flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-all ${
                    darkMode
                      ? "bg-slate-900/40 text-slate-300 border-slate-700 hover:border-slate-500"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span>{highlight(tag.name)}</span>
                  <span className="flex items-center gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTag(tag)}
                      className="hover:text-blue-500 transition-colors p-0.5"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteTag(tag)}
                      className="hover:text-red-500 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              ))}

              <button
                onClick={onAddTag}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed transition-colors ${
                  darkMode
                    ? "border-slate-600 text-slate-400 hover:text-indigo-400 hover:border-indigo-500"
                    : "border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-400"
                }`}
              >
                <Plus className="w-3 h-3" /> Add tag
              </button>

              {category.allTags.length === 0 && (
                <p
                  className={`text-xs italic ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                >
                  No tags yet — add the first one.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EmptyState = ({ darkMode, hasQuery, onClear, onCreate }) => (
  <div
    className={`rounded-2xl border border-dashed p-12 text-center ${darkMode ? "border-slate-700" : "border-slate-200"}`}
  >
    <div
      className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}
    >
      <Folder
        className={`w-5 h-5 ${darkMode ? "text-slate-500" : "text-slate-400"}`}
      />
    </div>
    {hasQuery ? (
      <>
        <p
          className={`text-sm font-medium mb-3 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
        >
          Nothing matches your search.
        </p>
        <button
          onClick={onClear}
          className="text-sm font-semibold text-blue-500 hover:text-blue-600"
        >
          Clear search
        </button>
      </>
    ) : (
      <>
        <p
          className={`text-sm font-medium mb-3 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
        >
          No categories yet.
        </p>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Create your first category
        </button>
      </>
    )}
  </div>
);

const ModalShell = ({ children, darkMode, onClose, maxWidth = "max-w-md" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.15 }}
      onClick={(e) => e.stopPropagation()}
      className={`w-full ${maxWidth} rounded-2xl shadow-xl border p-6 ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"}`}
    >
      {children}
    </motion.div>
  </motion.div>
);

const BulkUploadModal = ({
  darkMode,
  categories,
  onClose,
  onSubmit,
  onDownloadSample,
  push,
}) => {
  const [step, setStep] = useState("input");
  const [text, setText] = useState("");
  const [rows, setRows] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const knownCategoryNames = useMemo(
    () => new Set(categories.map((c) => c.name.toLowerCase())),
    [categories],
  );

  const preview = useMemo(() => {
    const seen = new Set();
    return rows.map((row) => {
      const key = `${row.categoryName.toLowerCase()}::${row.tagName.toLowerCase()}`;
      const isDupeInFile = seen.has(key);
      seen.add(key);

      let status = "ok";
      let note = knownCategoryNames.has(row.categoryName.toLowerCase())
        ? "Existing category"
        : "New category — will be created";
      if (!row.categoryName || !row.tagName) {
        status = "invalid";
        note = "Missing category or tag name";
      } else if (isDupeInFile) {
        status = "duplicate";
        note = "Duplicate row in this file";
      }
      return { ...row, status, note };
    });
  }, [rows, knownCategoryNames]);

  const validCount = preview.filter((r) => r.status === "ok").length;

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setText(content);
      setRows(parseBulkInput(content));
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleParseText = () => {
    const parsed = parseBulkInput(text);
    if (parsed.length === 0) {
      push('Paste at least one "Category, Tag" line first.', "error");
      return;
    }
    setRows(parsed);
    setStep("preview");
  };

  const handleImport = async () => {
    const toSend = preview
      .filter((r) => r.status === "ok")
      .map(({ categoryName, tagName }) => ({ categoryName, tagName }));
    if (toSend.length === 0) return;
    setSubmitting(true);
    try {
      const data = await onSubmit(toSend);
      setResults(data);
      setStep("results");
    } catch (error) {
      push(error.response?.data?.message || "Bulk import failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep("input");
    setText("");
    setRows([]);
    setResults(null);
  };

  return (
    <ModalShell darkMode={darkMode} onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          {step === "preview" && (
            <button
              onClick={() => setStep("input")}
              className="mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <UploadCloud className="w-5 h-5 text-blue-500" />
          Bulk Upload Tags
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* STEP 1: input */}
      {step === "input" && (
        <div className="space-y-4">
          <p
            className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Paste rows as{" "}
            <code className="px-1 rounded bg-slate-500/10">Category, Tag</code>{" "}
            — one per line — or upload a CSV with the same two columns.
            Categories that don't exist yet are created automatically.
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder={
              "Arrays, Two Pointers\nArrays, Sliding Window\nGraphs, DFS"
            }
            className={`w-full px-3 py-2.5 rounded-xl text-sm border outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-all ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-white placeholder-slate-600"
                : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleParseText}
              disabled={!text.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-sm text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <Clipboard className="w-4 h-4" /> Preview pasted rows
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center gap-1.5 ${
                darkMode
                  ? "border-slate-700 text-slate-200 hover:bg-slate-900"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-4 h-4" /> Upload CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv,text/plain"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <button
              onClick={onDownloadSample}
              className={`ml-auto px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ${
                darkMode
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Download className="w-3.5 h-3.5" /> Sample CSV
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: preview */}
      {step === "preview" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={darkMode ? "text-slate-400" : "text-slate-500"}>
              {preview.length} rows parsed
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-500">{validCount} ready</span>
              {preview.some((r) => r.status === "duplicate") && (
                <span className="text-amber-500">
                  {preview.filter((r) => r.status === "duplicate").length}{" "}
                  duplicate
                </span>
              )}
              {preview.some((r) => r.status === "invalid") && (
                <span className="text-red-500">
                  {preview.filter((r) => r.status === "invalid").length} invalid
                </span>
              )}
            </div>
          </div>

          <div
            className={`rounded-xl border max-h-72 overflow-y-auto ${darkMode ? "border-slate-700" : "border-slate-200"}`}
          >
            <table className="w-full text-sm">
              <thead
                className={`sticky top-0 text-xs uppercase tracking-wider ${darkMode ? "bg-slate-900 text-slate-500" : "bg-slate-50 text-slate-400"}`}
              >
                <tr>
                  <th className="text-left px-3 py-2 font-semibold">
                    Category
                  </th>
                  <th className="text-left px-3 py-2 font-semibold">Tag</th>
                  <th className="text-left px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t ${darkMode ? "border-slate-800" : "border-slate-100"}`}
                  >
                    <td className="px-3 py-2">
                      {row.categoryName || (
                        <span className="italic opacity-50">missing</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {row.tagName || (
                        <span className="italic opacity-50">missing</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          row.status === "ok"
                            ? "text-emerald-500"
                            : row.status === "duplicate"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {row.status === "ok" && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        {row.status === "duplicate" && (
                          <AlertCircle className="w-3.5 h-3.5" />
                        )}
                        {row.status === "invalid" && (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {row.note}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={reset}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
            >
              Start over
            </button>
            <button
              onClick={handleImport}
              disabled={validCount === 0 || submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-sm font-medium text-sm transition-colors flex items-center gap-1.5"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Import {validCount} {validCount === 1 ? "tag" : "tags"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: results */}
      {step === "results" && results && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div
              className={`rounded-xl p-3 text-center ${darkMode ? "bg-emerald-900/20" : "bg-emerald-50"}`}
            >
              <div className="text-xl font-bold text-emerald-500">
                {results.created?.length || 0}
              </div>
              <div
                className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Created
              </div>
            </div>
            <div
              className={`rounded-xl p-3 text-center ${darkMode ? "bg-amber-900/20" : "bg-amber-50"}`}
            >
              <div className="text-xl font-bold text-amber-500">
                {results.skipped?.length || 0}
              </div>
              <div
                className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Skipped (duplicates)
              </div>
            </div>
            <div
              className={`rounded-xl p-3 text-center ${darkMode ? "bg-red-900/20" : "bg-red-50"}`}
            >
              <div className="text-xl font-bold text-red-500">
                {results.errors?.length || 0}
              </div>
              <div
                className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Errors
              </div>
            </div>
          </div>

          {(results.errors?.length > 0 || results.skipped?.length > 0) && (
            <div
              className={`rounded-xl border max-h-48 overflow-y-auto text-sm divide-y ${darkMode ? "border-slate-700 divide-slate-800" : "border-slate-200 divide-slate-100"}`}
            >
              {results.errors?.map((e, i) => (
                <div
                  key={`e${i}`}
                  className="px-3 py-2 flex items-center gap-2"
                >
                  <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>
                    Row {e.row}: {e.tagName || "—"} — {e.reason}
                  </span>
                </div>
              ))}
              {results.skipped?.map((s, i) => (
                <div
                  key={`s${i}`}
                  className="px-3 py-2 flex items-center gap-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    Row {s.row}: {s.tagName} — {s.reason}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={reset}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
            >
              Upload more
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-medium text-sm transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default AdminTaxonomy;
