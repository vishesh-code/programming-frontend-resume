
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from './Header';
// import LeftSidebar from './LeftSidebar';
// import RightSidebar from './RightSidebar';
// import { useTheme } from "../../context/themeContext";

// const AppLayout = () => {
//   const { darkMode } = useTheme();

//   return (
//     <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
//       <Header stats={{ total: 0, solved: 0, percentage: 0, easy: 0, medium: 0, hard: 0 }} />
//       {/* Increased max-w from 1400px to 1700px to push sidebars outwards and expand middle section */}
//       <div className="flex flex-1 max-w-[1700px] mx-auto w-full gap-6 px-4 py-6">
//         <aside className="w-64 hidden md:block shrink-0">
//           <LeftSidebar />
//         </aside>
//         <main className="flex-1 min-w-0 bg-transparent rounded-2xl">
//           <Outlet />
//         </main>
//         <aside className="w-72 hidden lg:block shrink-0">
//           <RightSidebar />
//         </aside>
//       </div>
//     </div>
//   );
// };

// export default AppLayout;




import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { useTheme } from "../../context/themeContext";
import { X } from "lucide-react";

const AppLayout = () => {
  const { darkMode } = useTheme();

  // 🔥 FIX: LeftSidebar carries all primary navigation (Home, Files, Notes,
  // Todo, Quiz, Study) and was `hidden md:block` with nothing standing in
  // for it below that breakpoint — phone and small-tablet users had no way
  // to get from one page to another. This drawer is that mobile fallback,
  // opened from Header's new hamburger button.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header onMenuClick={() => setMobileNavOpen(true)} />

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto p-4 shadow-xl animate-fadeUp ${darkMode ? "bg-slate-900" : "bg-white"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-bold uppercase tracking-wide ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Menu
              </span>
              <button
                onClick={() => setMobileNavOpen(false)}
                className={`p-2 rounded-lg ${darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* `mobile` drops the sticky/card-panel styling meant for the
                desktop rail; `onNavigate` closes the drawer after a tap. */}
            <LeftSidebar mobile onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Increased max-w from 1400px to 1700px to push sidebars outwards and expand middle section */}
      <div className="flex flex-1 max-w-[1700px] mx-auto w-full gap-4 md:gap-6 px-3 sm:px-4 py-4 sm:py-6">
        <aside className="w-64 hidden md:block shrink-0">
          <LeftSidebar />
        </aside>
        <main className="flex-1 min-w-0 bg-transparent rounded-2xl">
          <Outlet />
        </main>
        <aside className="w-72 hidden lg:block shrink-0">
          <RightSidebar />
        </aside>
      </div>

      {/* 🔥 FIX: Footer.jsx already existed in the codebase (styled,
          theme-aware) but wasn't imported/rendered anywhere in the app —
          every page just ended abruptly with no footer at all. */}
      <Footer />
    </div>
  );
};

export default AppLayout;