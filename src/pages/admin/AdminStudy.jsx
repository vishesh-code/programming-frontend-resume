import React, { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";
import { useTheme } from "../../context/themeContext";
import { CheckCircle, XCircle } from "lucide-react";

const AdminStudy = () => {
  const { darkMode } = useTheme();
  const [pendingTopics, setPendingTopics] = useState([]);

  const fetchPending = async () => {
    try {
      const { data } = await apiClient.get("/admin/study/pending");
      setPendingTopics(data.topics);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await apiClient.put(`/admin/study/${id}/status`, { status });
      fetchPending();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <h1
        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
      >
        Study Material Review Queue
      </h1>
      <div className="grid gap-4">
        {pendingTopics.map((topic) => (
          <div
            key={topic._id}
            className={`p-5 border rounded-xl flex justify-between items-center ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          >
            <div>
              <h3
                className={`font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                {topic.name}
              </h3>
              <p
                className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Author: {topic.createdBy.email}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange(topic._id, "Published")}
                className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 flex gap-1 items-center"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => handleStatusChange(topic._id, "Private")}
                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex gap-1 items-center"
              >
                <XCircle className="w-4 h-4" /> Reject (Revert)
              </button>
            </div>
          </div>
        ))}
        {pendingTopics.length === 0 && <p>No topics pending review.</p>}
      </div>
    </div>
  );
};

export default AdminStudy;
