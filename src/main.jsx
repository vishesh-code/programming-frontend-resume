

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { UserProvider } from "./context/userContext";
// import { ThemeProvider } from "./context/themeContext";

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <UserProvider>
//       <ThemeProvider>
//         <App />
//       </ThemeProvider>
//     </UserProvider>
//   </StrictMode>,
// )



import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from "./context/userContext";
import { ThemeProvider } from "./context/themeContext";
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- Add this import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap with Google Provider and use your environment variable */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)