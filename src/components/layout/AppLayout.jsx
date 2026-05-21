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
//       <div className="flex flex-1 max-w-[1400px] mx-auto w-full gap-6 px-4 py-6">
//         <aside className="w-64 hidden md:block shrink-0">
//           <LeftSidebar />
//         </aside>
//         <main className="flex-1 min-w-0 bg-transparent rounded-2xl">
//           <Outlet /> {/* <-- Landing or MyFiles will render inside here */}
//         </main>
//         <aside className="w-72 hidden lg:block shrink-0">
//           <RightSidebar />
//         </aside>

//       </div>
//     </div>
//   );
// };

// export default AppLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import { useTheme } from "../../context/themeContext";

const AppLayout = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header stats={{ total: 0, solved: 0, percentage: 0, easy: 0, medium: 0, hard: 0 }} />
      {/* Increased max-w from 1400px to 1700px to push sidebars outwards and expand middle section */}
      <div className="flex flex-1 max-w-[1700px] mx-auto w-full gap-6 px-4 py-6">
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
    </div>
  );
};

export default AppLayout;