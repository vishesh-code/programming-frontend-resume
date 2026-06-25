import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"; // Dark theme for code
import apiClient from "../utils/apiClient";
import { useTheme } from "../context/themeContext";

export default function StudyMaterial() {
  const { darkMode } = useTheme();
  const [menuData, setMenuData] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the menu structure on load
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await apiClient.get('/study/menu');
        setMenuData(response.data);
        
        // Auto-select the first note of the first chapter if it exists
        if (response.data.length > 0 && response.data[0].subtopics.length > 0) {
          setActiveNote(response.data[0].subtopics[0]);
        }
      } catch (error) {
        console.error("Error fetching study materials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center">Loading study materials...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full border-t border-slate-200 dark:border-slate-800">
      
      {/* SIDEBAR (W3Schools Style) */}
      <div className={`w-64 flex-shrink-0 overflow-y-auto border-r p-4 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
      }`}>
        <h2 className={`font-bold text-lg mb-4 ${darkMode ? "text-white" : "text-slate-800"}`}>
          Course Content
        </h2>
        
        <div className="flex flex-col gap-4">
          {menuData.map((chapter) => (
            <div key={chapter._id}>
              {/* Chapter Title */}
              <h3 className={`font-semibold text-sm uppercase tracking-wider mb-2 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}>
                {chapter.title}
              </h3>
              
              {/* Subtopics / Notes */}
              <ul className="flex flex-col gap-1 pl-2">
                {chapter.subtopics.map((note) => {
                  const isActive = activeNote?._id === note._id;
                  return (
                    <li key={note._id}>
                      <button
                        onClick={() => setActiveNote(note)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white font-medium"
                            : darkMode
                              ? "text-slate-300 hover:bg-slate-800"
                              : "text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {note.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA (Markdown Renderer) */}
      <div className={`flex-1 overflow-y-auto p-8 lg:p-12 ${
        darkMode ? "bg-slate-950" : "bg-white"
      }`}>
        {activeNote ? (
          <div className="max-w-4xl mx-auto">
            {/* The Tailwind 'prose' class automatically styles h1, h2, p, ul, etc. */}
            <article className={`prose max-w-none ${darkMode ? "prose-invert" : ""}`}>
              <h1>{activeNote.title}</h1>
              
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom component to handle code blocks with syntax highlighting
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
                {activeNote.content}
              </ReactMarkdown>
            </article>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            Select a topic from the sidebar to start reading.
          </div>
        )}
      </div>
    </div>
  );
}