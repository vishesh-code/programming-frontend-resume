import React, { useState, useEffect } from "react";
import { Link as LinkIcon, Plus, Trash2, Edit2, ExternalLink, X, Loader2, ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { useTheme } from "../context/themeContext";
import apiClient from "../utils/apiClient";

const LinkMenus = () => {
  const { darkMode } = useTheme();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Accordion & Copy state
  const [expandedMenus, setExpandedMenus] = useState({});
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  
  // Modals
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [editMenuModalOpen, setEditMenuModalOpen] = useState(false);
  
  // Forms
  const [newMenuTitle, setNewMenuTitle] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [newLink, setNewLink] = useState({ name: "", url: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/link-menus");
      setMenus(res.data);
    } catch (err) {
      console.error("Failed to fetch link menus", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleCreateMenu = async (e) => {
    e.preventDefault();
    if (!newMenuTitle.trim()) return;
    setIsProcessing(true);
    try {
      await apiClient.post("/link-menus", { title: newMenuTitle });
      setMenuModalOpen(false);
      setNewMenuTitle("");
      fetchMenus();
    } catch (err) {
      alert("Failed to create menu");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditMenu = async (e) => {
    e.preventDefault();
    if (!newMenuTitle.trim() || !activeMenuId) return;
    setIsProcessing(true);
    try {
      await apiClient.put(`/link-menus/${activeMenuId}`, { title: newMenuTitle });
      setEditMenuModalOpen(false);
      setNewMenuTitle("");
      setActiveMenuId(null);
      fetchMenus();
    } catch (err) {
      alert("Failed to update menu");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMenu = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the menu "${title}"?`)) return;
    try {
      await apiClient.delete(`/link-menus/${id}`);
      fetchMenus();
    } catch (err) {
      alert("Failed to delete menu");
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.name.trim() || !newLink.url.trim() || !activeMenuId) return;
    
    // Ensure URL has protocol
    let finalUrl = newLink.url;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    setIsProcessing(true);
    try {
      await apiClient.post(`/link-menus/${activeMenuId}/links`, { 
        name: newLink.name, 
        url: finalUrl 
      });
      setLinkModalOpen(false);
      setNewLink({ name: "", url: "" });
      setActiveMenuId(null);
      fetchMenus();
    } catch (err) {
      alert("Failed to add link");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteLink = async (menuId, linkId) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      await apiClient.delete(`/link-menus/${menuId}/links/${linkId}`);
      fetchMenus();
    } catch (err) {
      alert("Failed to delete link");
    }
  };

  const handleCopyLink = (url, linkId) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLinkId(linkId);
      setTimeout(() => setCopiedLinkId(null), 2000);
    }).catch(err => {
      console.error("Failed to copy link: ", err);
    });
  };

  return (
    <div className={`flex flex-col h-full space-y-6 ${darkMode ? "text-white" : "text-slate-900"}`}>
      {/* HEADER SECTION */}
      <div className={`p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${darkMode ? "bg-indigo-900/30 border-indigo-800 text-indigo-400" : "bg-indigo-50 border-indigo-200 text-indigo-600"}`}>
              <LinkIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Link Menus</h1>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Organize your important bookmarks and resources
              </p>
            </div>
          </div>
          <button
            onClick={() => setMenuModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Create New Menu
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : menus.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed ${darkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-300 bg-white"}`}>
          <LinkIcon className={`w-16 h-16 mb-4 ${darkMode ? "text-slate-600" : "text-slate-400"}`} />
          <h3 className="text-lg font-bold mb-2">No menus found</h3>
          <p className={darkMode ? "text-slate-400" : "text-slate-500"}>Create a menu to start saving your links.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {menus.map((menu) => {
            const isExpanded = !!expandedMenus[menu._id];
            return (
            <div
              key={menu._id}
              className={`flex flex-col rounded-2xl border shadow-sm transition-all ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
            >
              {/* Card Header (Accordion Toggle) */}
              <div 
                className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 ${isExpanded ? (darkMode ? 'border-b border-slate-700' : 'border-b border-slate-100') : ''} ${!isExpanded ? 'rounded-2xl' : 'rounded-t-2xl'}`}
                onClick={() => setExpandedMenus(prev => ({ ...prev, [menu._id]: !prev[menu._id] }))}
              >
                <div className="flex items-center gap-3 flex-1 pr-4 min-w-0">
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`}>
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                  <h3 className="font-bold text-lg truncate">{menu.title}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${darkMode ? "bg-slate-900 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                    {menu.links?.length || 0} links
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setActiveMenuId(menu._id);
                      setNewMenuTitle(menu.title);
                      setEditMenuModalOpen(true);
                    }}
                    className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-indigo-400" : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}
                    title="Edit Menu"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(menu._id, menu.title)}
                    className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:bg-slate-700 hover:text-red-400" : "text-slate-400 hover:bg-red-50 hover:text-red-600"}`}
                    title="Delete Menu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="animate-fadeUp origin-top">
                  {/* Links List */}
                  <div className="flex-1 px-4 py-2 max-h-[500px] overflow-y-auto">
                    <div className="flex flex-col">
                      {menu.links && menu.links.length > 0 ? (
                        menu.links.map(link => (
                          <div key={link._id} className={`group flex items-center justify-between py-3 px-2 border-b last:border-0 transition-colors ${darkMode ? "border-slate-700/50 hover:bg-slate-800/80 rounded-lg" : "border-slate-100 hover:bg-slate-50 rounded-lg"}`}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-4 min-w-0 flex-1 group/link"
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${darkMode ? "bg-slate-800 text-slate-400 group-hover/link:bg-indigo-900/40 group-hover/link:text-indigo-400" : "bg-slate-100 text-slate-500 group-hover/link:bg-indigo-50 group-hover/link:text-indigo-600"}`}>
                                <ExternalLink className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className={`font-medium text-sm truncate transition-colors ${darkMode ? "text-slate-200 group-hover/link:text-indigo-400" : "text-slate-800 group-hover/link:text-indigo-600"}`}>
                                  {link.name}
                                </span>
                                <span className={`text-xs truncate ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                                  {link.url.replace(/^https?:\/\//, '')}
                                </span>
                              </div>
                            </a>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                              <button
                                onClick={() => handleCopyLink(link.url, link._id)}
                                className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-500 hover:text-indigo-400 hover:bg-slate-700" : "text-slate-400 hover:text-indigo-600 hover:bg-slate-200"}`}
                                title="Copy Link"
                              >
                                {copiedLinkId === link._id ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteLink(menu._id, link._id)}
                                className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-500 hover:text-red-400 hover:bg-slate-700" : "text-slate-400 hover:text-red-500 hover:bg-slate-200"}`}
                                title="Remove Link"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`text-center py-8 text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                          No links in this menu yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Link Button */}
                  <div className={`p-4 border-t ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
                    <button
                      onClick={() => {
                        setActiveMenuId(menu._id);
                        setLinkModalOpen(true);
                      }}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors border-2 border-dashed ${darkMode ? "border-slate-600 text-indigo-400 hover:bg-indigo-900/20 hover:border-indigo-500/50" : "border-slate-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"}`}
                    >
                      <Plus className="w-5 h-5" /> Add New Link Here
                    </button>
                  </div>
                </div>
              )}
            </div>
          )})}
        </div>
      )}

      {/* CREATE MENU MODAL */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Create New Menu</h3>
              <button
                onClick={() => setMenuModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMenu}>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Menu Title</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Important Resources"
                  value={newMenuTitle}
                  onChange={(e) => setNewMenuTitle(e.target.value)}
                  className={`w-full border rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !newMenuTitle.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MENU MODAL */}
      {editMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Edit Menu Title</h3>
              <button
                onClick={() => setEditMenuModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditMenu}>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Menu Title</label>
                <input
                  type="text"
                  autoFocus
                  value={newMenuTitle}
                  onChange={(e) => setNewMenuTitle(e.target.value)}
                  className={`w-full border rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditMenuModalOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !newMenuTitle.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit2 className="w-4 h-4" />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD LINK MODAL */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border animate-fadeUp ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add New Link</h3>
              <button
                onClick={() => {
                  setLinkModalOpen(false);
                  setNewLink({ name: "", url: "" });
                }}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddLink}>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Link Name</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. React Documentation"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  className={`w-full border rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                />
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>URL</label>
                <input
                  type="text"
                  placeholder="e.g. reactjs.org"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className={`w-full border rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"}`}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLinkModalOpen(false);
                    setNewLink({ name: "", url: "" });
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !newLink.name.trim() || !newLink.url.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LinkMenus;
