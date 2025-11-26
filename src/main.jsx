// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { UserProvider } from "./context/userContext";
// import { ThemeProvider } from "./context/themeContext";

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from "./context/userContext";
import { ThemeProvider } from "./context/themeContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </UserProvider>
  </StrictMode>,
)




// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// import { UserProvider } from "./context/userContext";
// import { ThemeProvider } from "./context/themeContext";

// ReactDOM.render(
//   <ThemeProvider>
//     <UserProvider>
//       <App />
//     </UserProvider>
//   </ThemeProvider>,
//   document.getElementById("root")
// );
