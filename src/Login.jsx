// import React, { useState, useEffect } from 'react';
// import { Mail, Lock, Eye, EyeOff, ArrowRight, Code, Sun, Moon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
// import { supabase } from './supabaseClient'; // 👈 Ensure this path matches your project structure

// const LoginPage = () => {
//   // UI State
//   const [darkMode, setDarkMode] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false);
  
//   // Form State
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null); // { type: 'error' | 'success', text: '' }

//   // Dark mode persistence (same as your main app)
//   useEffect(() => {
//     const savedDarkMode = localStorage.getItem('darkMode') === 'true';
//     setDarkMode(savedDarkMode);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('darkMode', darkMode.toString());
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       if (isSignUp) {
//         const { error } = await supabase.auth.signUp({
//           email,
//           password,
//         });
//         if (error) throw error;
//         setMessage({ type: 'success', text: 'Signup successful! Check your email for confirmation.' });
//       } else {
//         const { error } = await supabase.auth.signInWithPassword({
//           email,
//           password,
//         });
//         if (error) throw error;
//         // Redirect or handle successful login state here
//         window.location.reload(); // Simple reload to trigger session check in main app
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: error.message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Shared styles based on your ProgrammingProblemsApp
//   const themeClasses = darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
//   const cardClasses = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100';
//   const textMain = darkMode ? 'text-white' : 'text-slate-900';
//   const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';
//   const inputClasses = darkMode 
//     ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600' 
//     : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white';

//   return (
//     <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses}`}>
      
//       {/* Theme Toggle (Absolute Positioned) */}
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${
//           darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
//         }`}
//       >
//         {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//       </button>

//       <div className={`w-full max-w-md rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ${cardClasses}`}>
        
//         {/* Header Section */}
//         <div className="p-8 pb-6 text-center">
//           <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
//             <Code className="h-8 w-8 text-white" />
//           </div>
          
//           <h1 className={`text-2xl font-bold mb-2 ${textMain}`}>
//             {isSignUp ? 'Create Account' : 'Welcome Back'}
//           </h1>
//           <p className={`text-sm ${textMuted}`}>
//             {isSignUp ? 'Start mastering algorithms today' : 'Continue your programming journey'}
//           </p>
//         </div>

//         {/* Form Section */}
//         <div className="p-8 pt-0">
//           {message && (
//             <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
//               message.type === 'error' 
//                 ? (darkMode ? 'bg-red-900/30 text-red-200 border border-red-800' : 'bg-red-50 text-red-600 border border-red-100')
//                 : (darkMode ? 'bg-emerald-900/30 text-emerald-200 border border-emerald-800' : 'bg-emerald-50 text-emerald-600 border border-emerald-100')
//             }`}>
//               {message.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
//               <span>{message.text}</span>
//             </div>
//           )}

//           <form onSubmit={handleAuth} className="space-y-5">
//             <div className="space-y-1.5">
//               <label className={`text-sm font-medium ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
//                 Email Address
//               </label>
//               <div className="relative group">
//                 <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <label className={`text-sm font-medium ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
//                 Password
//               </label>
//               <div className="relative group">
//                 <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {loading ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : (
//                 <>
//                   <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
//                   <ArrowRight className="h-5 w-5" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-8 pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 text-center">
//             <p className={`text-sm ${textMuted}`}>
//               {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
//               <button
//                 onClick={() => setIsSignUp(!isSignUp)}
//                 className="ml-2 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
//               >
//                 {isSignUp ? 'Sign In' : 'Sign Up'}
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




// import React, { useState } from "react";
// import { useUser } from "./context/userContext";
// import { useTheme } from "./context/themeContext";
// import { useNavigate } from "react-router-dom";
// import { Mail, Lock, Eye, EyeOff, ArrowRight, Code, Sun, Moon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

// const LoginPage = () => {
//   const { setUser } = useUser();
//   const { darkMode, setDarkMode } = useTheme();

//   const [showPassword, setShowPassword] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const navigate = useNavigate();

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     // Dummy login: always succeed and update context
//     setTimeout(() => {
//       setUser({ email });
//       setLoading(false);
//       navigate("/app");
//     }, 800);
//   };

//   const themeClasses = darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
//   const cardClasses = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100';
//   const textMain = darkMode ? 'text-white' : 'text-slate-900';
//   const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';
//   const inputClasses = darkMode 
//     ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600' 
//     : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white';

//   return (
//     <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses}`}>
      
//       {/* Theme Toggle */}
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${
//           darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
//         }`}
//       >
//         {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//       </button>

//       <div className={`w-full max-w-md rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ${cardClasses}`}>
//         {/* Header */}
//         <div className="p-8 pb-6 text-center">
//           <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
//             <Code className="h-8 w-8 text-white" />
//           </div>
//           <h1 className={`text-2xl font-bold mb-2 ${textMain}`}>
//             {isSignUp ? 'Create Account' : 'Welcome Back'}
//           </h1>
//           <p className={`text-sm ${textMuted}`}>
//             {isSignUp ? 'Start mastering algorithms today' : 'Continue your programming journey'}
//           </p>
//         </div>

//         {/* Form */}
//         <div className="p-8 pt-0">
//           {message && (
//             <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
//               message.type === 'error' 
//                 ? (darkMode ? 'bg-red-900/30 text-red-200 border border-red-800' : 'bg-red-50 text-red-600 border border-red-100')
//                 : (darkMode ? 'bg-emerald-900/30 text-emerald-200 border border-emerald-800' : 'bg-emerald-50 text-emerald-600 border border-emerald-100')
//             }`}>
//               {message.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
//               <span>{message.text}</span>
//             </div>
//           )}

//           <form onSubmit={handleAuth} className="space-y-5">
//             <div className="space-y-1.5">
//               <label className={`text-sm font-medium ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
//                 Email Address
//               </label>
//               <div className="relative group">
//                 <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <label className={`text-sm font-medium ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
//                 Password
//               </label>
//               <div className="relative group">
//                 <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {loading ? (
//                 <Loader2 className="h-5 w-5 animate-spin" />
//               ) : (
//                 <>
//                   <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
//                   <ArrowRight className="h-5 w-5" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="mt-8 pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 text-center">
//             <p className={`text-sm ${textMuted}`}>
//               {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
//               <button
//                 type="button"
//                 onClick={() => setIsSignUp(!isSignUp)}
//                 className="ml-2 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
//               >
//                 {isSignUp ? 'Sign In' : 'Sign Up'}
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




import React, { useState } from "react";
import { useUser } from "./context/userContext";
import { useTheme } from "./context/themeContext";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Code, Sun, Moon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import apiClient from "./utils/apiClient"; // Import your new helper
const LoginPage = () => {
  const { setUser } = useUser();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'error' | 'success', text: '' }

  // const handleAuth = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage(null);

  //   // Dynamic Endpoint based on mode
  //   const endpoint = isSignUp 
  //     ? "http://localhost:5000/api/user/register" 
  //     : "http://localhost:5000/api/user/login";

  //   try {
  //     const response = await fetch(endpoint, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();

  //     // Check if the request failed (e.g., 400 Bad Request)
  //     if (!response.ok) {
  //       throw new Error(data.message || "Authentication failed");
  //     }

  //     if (isSignUp) {
  //       // --- REGISTER SUCCESS ---
  //       setMessage({ type: 'success', text: 'Account created! Please sign in.' });
  //       setIsSignUp(false); // Switch to login view
  //       setPassword(''); // Clear password for safety
  //     } else {
  //       // --- LOGIN SUCCESS ---
        
  //       // 1. Save to LocalStorage (Persistence)
  //       localStorage.setItem("auth-token", data.token);
  //       localStorage.setItem("user-email", data.user.email);
  //       localStorage.setItem("user-id", data.user.id);

  //       // 2. Update Global Context
  //       setUser({ 
  //         token: data.token,
  //         email: data.user.email,
  //         id: data.user.id
  //       });

  //       // 3. Redirect to App
  //       navigate("/app");
  //     }

  //   } catch (error) {
  //     setMessage({ type: 'error', text: error.message || "Something went wrong" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleAuth = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  // Notice: No localhost URL here, just the specific path
  const endpoint = isSignUp ? "/user/register" : "/user/login";

  try {
    // Use apiClient.post instead of fetch
    const response = await apiClient.post(endpoint, {
      email,
      password
    });

    // Axios returns data directly in response.data
    const data = response.data; 

    if (isSignUp) {
        setMessage({ type: 'success', text: 'Account created! Please sign in.' });
        setIsSignUp(false);
    } else {
        // Save token (The interceptor will pick this up next time!)
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user-email", data.user.email);
        localStorage.setItem("user-id", data.user.id);

        setUser({ token: data.token, email: data.user.email, id: data.user.id });
        navigate("/app");
    }

  } catch (err) {
    // Axios puts the backend error message inside err.response.data
    const errorMsg = err.response?.data?.message || "Authentication failed";
    setMessage({ type: 'error', text: errorMsg });
  } finally {
    setLoading(false);
  }
};

  // Styles (same as your original design)
  const themeClasses = darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';
  const cardClasses = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100';
  const textMain = darkMode ? 'text-white' : 'text-slate-900';
  const textMuted = darkMode ? 'text-slate-400' : 'text-slate-500';
  const inputClasses = darkMode 
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600' 
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses}`}>
      
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${
          darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
        }`}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className={`w-full max-w-md rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ${cardClasses}`}>
        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${textMain}`}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className={`text-sm ${textMuted}`}>
            {isSignUp ? 'Start mastering algorithms today' : 'Continue your programming journey'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8 pt-0">
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
              message.type === 'error' 
                ? (darkMode ? 'bg-red-900/30 text-red-200 border border-red-800' : 'bg-red-50 text-red-600 border border-red-100')
                : (darkMode ? 'bg-emerald-900/30 text-emerald-200 border border-emerald-800' : 'bg-emerald-50 text-emerald-600 border border-emerald-100')
            }`}>
              {message.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle2 className="h-5 w-5 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1.5">
              <label className={`text-sm font-medium ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Email Address
              </label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-sm font-medium ml-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? 'text-slate-400 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 text-center">
            <p className={`text-sm ${textMuted}`}>
              {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage(null);
                  setEmail("");
                  setPassword("");
                }}
                className="ml-2 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;