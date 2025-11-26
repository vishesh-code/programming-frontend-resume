import React from "react";
import { Code } from "lucide-react";

const Footer = ({ darkMode }) => (
  <footer
    className={`${
      darkMode
        ? "bg-slate-800 border-t border-slate-700"
        : "bg-white border-t border-blue-100"
    } py-6 mt-12`}
  >
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <Code className={`h-5 w-5 ${darkMode ? "text-slate-400" : "text-blue-600"}`} />
        <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
          Algorithm Practice App
        </span>
      </div>
      <div className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
        © {new Date().getFullYear()} CodeMaster. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
