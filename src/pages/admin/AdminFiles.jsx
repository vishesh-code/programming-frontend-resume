// import React, { useState } from 'react';
// import { useTheme } from '../../context/themeContext';
// import { Search, UploadCloud, FileText, Download, Trash2, Image as ImageIcon } from 'lucide-react';

// const AdminFiles = () => {
//   const { darkMode } = useTheme();
//   const [searchTerm, setSearchTerm] = useState("");

//   const [files] = useState([
//     { id: 1, name: "Project_Requirements.pdf", size: "2.4 MB", type: "pdf", uploadedBy: "John Doe", date: "May 20, 2026" },
//     { id: 2, name: "System_Architecture.png", size: "1.1 MB", type: "image", uploadedBy: "Admin", date: "May 22, 2026" },
//     { id: 3, name: "Q3_Financial_Report.pdf", size: "4.8 MB", type: "pdf", uploadedBy: "Jane Smith", date: "May 24, 2026" },
//   ]);

//   return (
//     <div className="space-y-6 animate-fadeUp">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>File Manager</h1>
//           <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage all user uploads and system assets.</p>
//         </div>
//         <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-all font-medium text-sm">
//           <UploadCloud className="w-4 h-4" /> Upload File
//         </button>
//       </div>

//       <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
//         <div className={`p-4 border-b flex justify-between items-center ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
//           <div className="relative w-full max-w-sm">
//             <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
//             <input 
//               type="text" placeholder="Search files..." 
//               className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
//             />
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead className={`text-xs uppercase font-semibold ${darkMode ? "bg-slate-900/50 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
//               <tr>
//                 <th className="px-6 py-4">File Name</th>
//                 <th className="px-6 py-4">Size</th>
//                 <th className="px-6 py-4">Uploaded By</th>
//                 <th className="px-6 py-4">Date</th>
//                 <th className="px-6 py-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className={`divide-y ${darkMode ? "divide-slate-700/50" : "divide-slate-100"}`}>
//               {files.map((file) => (
//                 <tr key={file.id} className={`transition-colors hover:bg-slate-50/50 ${darkMode ? "hover:bg-slate-700/20" : ""}`}>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className={`p-2 rounded-lg ${darkMode ? "bg-slate-700 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
//                         {file.type === 'pdf' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
//                       </div>
//                       <span className={`font-medium ${darkMode ? "text-slate-200" : "text-slate-900"}`}>{file.name}</span>
//                     </div>
//                   </td>
//                   <td className={`px-6 py-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{file.size}</td>
//                   <td className={`px-6 py-4 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{file.uploadedBy}</td>
//                   <td className={`px-6 py-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{file.date}</td>
//                   <td className="px-6 py-4 text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       <button className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-emerald-400 hover:bg-slate-700" : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"}`}><Download className="w-4 h-4" /></button>
//                       <button className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-700" : "text-slate-500 hover:text-red-600 hover:bg-red-50"}`}><Trash2 className="w-4 h-4" /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default AdminFiles;




import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/themeContext';
import { Search, UploadCloud, FileText, Download, Trash2, Image as ImageIcon } from 'lucide-react';
import apiClient from '../../utils/apiClient'; // ⚠️ Adjust path if necessary

const AdminFiles = () => {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Files from Database
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/admin/files');
      setFiles(data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // 2. Handle File Deletion
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this file from the database and storage?")) return;

    try {
      await apiClient.delete(`/admin/files/${fileId}`);
      // Remove the file from the UI state after successful deletion
      setFiles(files.filter(f => f._id !== fileId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete file");
    }
  };

  // Helper function to format file sizes nicely (e.g., bytes to MB/KB)
  const formatFileSize = (bytes) => {
    if (bytes === 0 || !bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter files based on file name or uploader's email
  const filteredFiles = files.filter(f => 
    f.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (f.user && f.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeUp">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>File Manager</h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Manage all user uploads and system assets.</p>
        </div>
        {/* Note: If admins shouldn't upload files from here, you can hide this button or link it to your existing upload modal */}
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition-all font-medium text-sm">
          <UploadCloud className="w-4 h-4" /> Upload File
        </button>
      </div>

      {/* Module Card */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
        
        {/* Toolbar */}
        <div className={`p-4 border-b flex justify-between items-center ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
          <div className="relative w-full max-w-sm">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? "text-slate-500" : "text-slate-400"}`} />
            <input 
              type="text" 
              placeholder="Search by file name or user email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
               Loading files...
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className={`text-xs uppercase font-semibold ${darkMode ? "bg-slate-900/50 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                <tr>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Uploaded By</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? "divide-slate-700/50" : "divide-slate-100"}`}>
                {filteredFiles.map((file) => {
                  
                  // Check if it's an image based on the mimetype saved in DB
                  const isImage = file.fileType && file.fileType.includes('image');
                  // Get the email part before @ for display
                  const uploaderName = file.user && file.user.email ? file.user.email.split('@')[0] : 'Unknown User';

                  return (
                    <tr key={file._id} className={`transition-colors hover:bg-slate-50/50 ${darkMode ? "hover:bg-slate-700/20" : ""}`}>
                      
                      {/* File Name Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-slate-700 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                            {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <span className={`font-medium ${darkMode ? "text-slate-200" : "text-slate-900"} max-w-[200px] truncate`} title={file.fileName}>
                            {file.fileName}
                          </span>
                        </div>
                      </td>

                      {/* Size Column */}
                      <td className={`px-6 py-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {formatFileSize(file.size)}
                      </td>

                      {/* Uploaded By Column */}
                      <td className={`px-6 py-4 ${darkMode ? "text-slate-300" : "text-slate-700"} capitalize`}>
                        {uploaderName}
                      </td>

                      {/* Date Column */}
                      <td className={`px-6 py-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {new Date(file.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Download Link (Opens Supabase URL in new tab) */}
                          <a 
                            href={file.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg transition-colors inline-block ${darkMode ? "text-slate-400 hover:text-emerald-400 hover:bg-slate-700" : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"}`}
                            title="Download / View"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          {/* Delete Button */}
                          <button 
                            onClick={() => handleDeleteFile(file._id)}
                            className={`p-2 rounded-lg transition-colors ${darkMode ? "text-slate-400 hover:text-red-400 hover:bg-slate-700" : "text-slate-500 hover:text-red-600 hover:bg-red-50"}`}
                            title="Delete File"
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
          )}

          {/* Empty State */}
          {!loading && filteredFiles.length === 0 && (
            <div className={`p-10 text-center font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              No files found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFiles;