// import React, { useState } from "react";
// import { useUser } from "../context/userContext";
// import { useTheme } from "../context/themeContext";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   Code,
//   Sun,
//   Moon,
//   Loader2,
//   AlertCircle,
//   CheckCircle2,
// } from "lucide-react";
// import apiClient from "../utils/apiClient";

// /* ── Floating code snippets in background ── */
// const CODE_SNIPPETS = [
//   "O(n log n)",
//   "two-sum",
//   "BFS/DFS",
//   "dp[i][j]",
//   "hash map",
//   "O(1) space",
//   "binary search",
//   "stack.push()",
//   "left, right",
//   "return memo[n]",
//   "while(l<r)",
//   "graph.adj[]",
// ];

// const BgFloaters = () => (
//   <div
//     className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
//     aria-hidden
//   >
//     {CODE_SNIPPETS.map((s, i) => (
//       <span
//         key={i}
//         className="absolute font-mono text-xs font-medium opacity-0"
//         style={{
//           left: `${(i * 37 + 11) % 90}%`,
//           top: `${(i * 23 + 7) % 85}%`,
//           color: "var(--color-accent, #3b82f6)",
//           opacity: 0.1 + (i % 4) * 0.03,
//           animation: `fadeUp ${2 + i * 0.3}s ease both`,
//           animationDelay: `${i * 0.15}s`,
//           transform: `rotate(${((i % 3) - 1) * 6}deg)`,
//           fontSize: `${10 + (i % 3)}px`,
//         }}
//       >
//         {s}
//       </span>
//     ))}
//     {/* Accent orbs */}
//     <div
//       className="login-orb absolute w-96 h-96 -top-20 -left-20"
//       style={{
//         background: "var(--color-accent, #3b82f6)",
//         filter: "blur(100px)",
//         opacity: 0.3,
//       }}
//     />
//     <div
//       className="login-orb absolute w-72 h-72 bottom-10 right-10"
//       style={{
//         background: "#06b6d4",
//         animationDelay: "2s",
//         filter: "blur(100px)",
//         opacity: 0.3,
//       }}
//     />
//     <div
//       className="login-orb absolute w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
//       style={{
//         background: "#8b5cf6",
//         animationDelay: "1s",
//         opacity: 0.12,
//         filter: "blur(80px)",
//       }}
//     />
//   </div>
// );

// const LoginPage = () => {
//   const { setUser } = useUser();
//   const { darkMode, setDarkMode } = useTheme();
//   const navigate = useNavigate();

//   // UI States
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [isForgotPassword, setIsForgotPassword] = useState(false);

//   // Form States
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   const handleAuth = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     const endpoint = isSignUp ? "/user/register" : "/user/login";

//     try {
//       const response = await apiClient.post(endpoint, {
//         email,
//         password,
//       });

//       const data = response.data;

//       if (isSignUp) {
//         setMessage({
//           type: "success",
//           text: "Account created! Please sign in.",
//         });
//         setIsSignUp(false);
//         setPassword("");
//       } else {
//         localStorage.setItem("auth-token", data.token);
//         localStorage.setItem("user-email", data.user.email);
//         localStorage.setItem("user-id", data.user.id);

//         setUser({
//           token: data.token,
//           email: data.user.email,
//           id: data.user.id,
//         });
//         navigate("/app");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Authentication failed";
//       setMessage({ type: "error", text: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPasswordSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     try {
//       const response = await apiClient.post("/user/forgot-password", { email });
//       setMessage({
//         type: "success",
//         text:
//           response.data.message || "Reset email sent! Please check your inbox.",
//       });
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || "Failed to send reset link.";
//       setMessage({ type: "error", text: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     setLoading(true);
//     setMessage(null);

//     try {
//       const response = await apiClient.post("/user/google-login", {
//         token: credentialResponse.credential,
//       });

//       const data = response.data;

//       localStorage.setItem("auth-token", data.token);
//       localStorage.setItem("user-email", data.user.email);
//       localStorage.setItem("user-id", data.user.id);

//       setUser({ token: data.token, email: data.user.email, id: data.user.id });
//       navigate("/app");
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || "Google Authentication failed";
//       setMessage({ type: "error", text: errorMsg });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UI styling assignments
//   const themeClasses = darkMode
//     ? "bg-slate-900"
//     : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";
//   const cardClasses = darkMode
//     ? "bg-slate-800 border-slate-700"
//     : "bg-white border-blue-100";
//   const textMain = darkMode ? "text-white" : "text-slate-900";
//   const textMuted = darkMode ? "text-slate-400" : "text-slate-500";
//   const inputClasses = darkMode
//     ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600"
//     : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white";

//   return (
//     <div
//       className={`relative overflow-hidden min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses}`}
//     >
//       <BgFloaters />

//       {/* Theme Toggle */}
//       <button
//         onClick={() => setDarkMode(!darkMode)}
//         className={`absolute top-6 right-6 p-2 rounded-lg transition-colors relative z-10 ${
//           darkMode
//             ? "bg-slate-700 text-yellow-400 hover:bg-slate-600"
//             : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
//         }`}
//       >
//         {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//       </button>

//       {/* Main Card */}
//       <div
//         className={`relative z-10 w-full max-w-md rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ${cardClasses}`}
//       >
//         <div className="p-8 pb-6 text-center">
//           <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
//             <Code className="h-8 w-8 text-white" />
//           </div>
//           <h1 className={`text-2xl font-bold mb-2 ${textMain}`}>
//             {isForgotPassword
//               ? "Reset Password"
//               : isSignUp
//                 ? "Create Account"
//                 : "Welcome Back"}
//           </h1>
//           <p className={`text-sm ${textMuted}`}>
//             {isForgotPassword
//               ? "Enter your email to receive a recovery link"
//               : isSignUp
//                 ? "Start mastering algorithms today"
//                 : "Continue your programming journey"}
//           </p>
//         </div>

//         <div className="p-8 pt-0">
//           {message && (
//             <div
//               className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
//                 message.type === "error"
//                   ? darkMode
//                     ? "bg-red-900/30 text-red-200 border border-red-800"
//                     : "bg-red-50 text-red-600 border border-red-100"
//                   : darkMode
//                     ? "bg-emerald-900/30 text-emerald-200 border border-emerald-800"
//                     : "bg-emerald-50 text-emerald-600 border border-emerald-100"
//               }`}
//             >
//               {message.type === "error" ? (
//                 <AlertCircle className="h-5 w-5 shrink-0" />
//               ) : (
//                 <CheckCircle2 className="h-5 w-5 shrink-0" />
//               )}
//               <span>{message.text}</span>
//             </div>
//           )}

//           {isForgotPassword ? (
//             <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
//               <div className="space-y-1.5">
//                 <label
//                   className={`text-sm font-medium ml-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
//                 >
//                   Email Address
//                 </label>
//                 <div className="relative group">
//                   <Mail
//                     className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400`}
//                   />
//                   <input
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="you@example.com"
//                     className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 disabled:opacity-70"
//               >
//                 {loading ? (
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                 ) : (
//                   <span>Send Reset Link</span>
//                 )}
//               </button>

//               <div className="text-center mt-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsForgotPassword(false);
//                     setMessage(null);
//                   }}
//                   className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
//                 >
//                   Back to Sign In
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <>
//               <form onSubmit={handleAuth} className="space-y-5">
//                 <div className="space-y-1.5">
//                   <label
//                     className={`text-sm font-medium ml-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
//                   >
//                     Email Address
//                   </label>
//                   <div className="relative group">
//                     <Mail
//                       className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? "text-slate-400 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-500"}`}
//                     />
//                     <input
//                       type="email"
//                       required
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="you@example.com"
//                       className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-1.5">
//                   <div className="flex justify-between items-center px-1">
//                     <label
//                       className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
//                     >
//                       Password
//                     </label>
//                     {!isSignUp && (
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setIsForgotPassword(true);
//                           setMessage(null);
//                         }}
//                         className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
//                       >
//                         Forgot Password?
//                       </button>
//                     )}
//                   </div>
//                   <div className="relative group">
//                     <Lock
//                       className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? "text-slate-400 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-500"}`}
//                     />
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       required
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="••••••••"
//                       className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400"
//                     >
//                       {showPassword ? (
//                         <EyeOff className="h-4 w-4" />
//                       ) : (
//                         <Eye className="h-4 w-4" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   {loading ? (
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                   ) : (
//                     <>
//                       <span>{isSignUp ? "Create Account" : "Sign In"}</span>
//                       <ArrowRight className="h-5 w-5" />
//                     </>
//                   )}
//                 </button>
//               </form>

//               <div className="mt-6 flex items-center justify-center space-x-2">
//                 <div
//                   className={`flex-1 h-px ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
//                 ></div>
//                 <span
//                   className={`text-xs uppercase font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}
//                 >
//                   Or continue with
//                 </span>
//                 <div
//                   className={`flex-1 h-px ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
//                 ></div>
//               </div>

//               <div className="mt-5 flex justify-center w-full">
//                 <GoogleLogin
//                   text={isSignUp ? "signup_with" : "signin_with"}
//                   onSuccess={handleGoogleSuccess}
//                   onError={() => {
//                     setMessage({
//                       type: "error",
//                       text: "Google Authentication Failed",
//                     });
//                   }}
//                   useOneTap
//                 />
//               </div>

//               <div className="mt-8 pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 text-center">
//                 <p className={`text-sm ${textMuted}`}>
//                   {isSignUp
//                     ? "Already have an account?"
//                     : "Don't have an account yet?"}
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsSignUp(!isSignUp);
//                       setMessage(null);
//                       setEmail("");
//                       setPassword("");
//                     }}
//                     className="ml-2 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
//                   >
//                     {isSignUp ? "Sign In" : "Sign Up"}
//                   </button>
//                 </p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { useTheme } from "../context/themeContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Code,
  Sun,
  Moon,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import apiClient from "../utils/apiClient";

/* ── Floating code snippets in background ── */
const CODE_SNIPPETS = [
  "O(n log n)",
  "two-sum",
  "BFS/DFS",
  "dp[i][j]",
  "hash map",
  "O(1) space",
  "binary search",
  "stack.push()",
  "left, right",
  "return memo[n]",
  "while(l<r)",
  "graph.adj[]",
];

const BgFloaters = () => (
  <div
    className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
    aria-hidden
  >
    {CODE_SNIPPETS.map((s, i) => (
      <span
        key={i}
        className="absolute font-mono text-xs font-medium opacity-0"
        style={{
          left: `${(i * 37 + 11) % 90}%`,
          top: `${(i * 23 + 7) % 85}%`,
          color: "var(--color-accent, #3b82f6)",
          opacity: 0.1 + (i % 4) * 0.03,
          animation: `fadeUp ${2 + i * 0.3}s ease both`,
          animationDelay: `${i * 0.15}s`,
          transform: `rotate(${((i % 3) - 1) * 6}deg)`,
          fontSize: `${10 + (i % 3)}px`,
        }}
      >
        {s}
      </span>
    ))}
    {/* Accent orbs */}
    <div
      className="login-orb absolute w-96 h-96 -top-20 -left-20"
      style={{
        background: "var(--color-accent, #3b82f6)",
        filter: "blur(100px)",
        opacity: 0.3,
      }}
    />
    <div
      className="login-orb absolute w-72 h-72 bottom-10 right-10"
      style={{
        background: "#06b6d4",
        animationDelay: "2s",
        filter: "blur(100px)",
        opacity: 0.3,
      }}
    />
    <div
      className="login-orb absolute w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        background: "#8b5cf6",
        animationDelay: "1s",
        opacity: 0.12,
        filter: "blur(80px)",
      }}
    />
  </div>
);

const LoginPage = () => {
  const { setUser } = useUser();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const endpoint = isSignUp ? "/user/register" : "/user/login";

    try {
      const response = await apiClient.post(endpoint, {
        email,
        password,
      });

      const data = response.data;

      if (isSignUp) {
        setMessage({
          type: "success",
          text: "Account created! Please sign in.",
        });
        setIsSignUp(false);
        setPassword("");
      } else {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user-email", data.user.email);
        localStorage.setItem("user-id", data.user.id);
        
        // Include the role in the local storage if you want it to persist, though context handles it via token decryption usually.
        if (data.user.role) {
          localStorage.setItem("user-role", data.user.role);
        }

        setUser({
          token: data.token,
          email: data.user.email,
          id: data.user.id,
          role: data.user.role, // 🔥 Add role to user context
        });

        // 🔥 Route based on Admin Role
        if (data.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/app");
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Authentication failed";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiClient.post("/user/forgot-password", { email });
      setMessage({
        type: "success",
        text:
          response.data.message || "Reset email sent! Please check your inbox.",
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to send reset link.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiClient.post("/user/google-login", {
        token: credentialResponse.credential,
      });

      const data = response.data;

      localStorage.setItem("auth-token", data.token);
      localStorage.setItem("user-email", data.user.email);
      localStorage.setItem("user-id", data.user.id);
      
      if (data.user.role) {
        localStorage.setItem("user-role", data.user.role);
      }

      setUser({ 
        token: data.token, 
        email: data.user.email, 
        id: data.user.id,
        role: data.user.role // 🔥 Add role to user context
      });
      
      // 🔥 Route based on Admin Role
      if (data.user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/app");
      }
      
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Google Authentication failed";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // UI styling assignments
  const themeClasses = darkMode
    ? "bg-slate-900"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";
  const cardClasses = darkMode
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-blue-100";
  const textMain = darkMode ? "text-white" : "text-slate-900";
  const textMuted = darkMode ? "text-slate-400" : "text-slate-500";
  const inputClasses = darkMode
    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white";

  return (
    <div
      className={`relative overflow-hidden min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses}`}
    >
      <BgFloaters />

      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 p-2 rounded-lg transition-colors relative z-10 ${
          darkMode
            ? "bg-slate-700 text-yellow-400 hover:bg-slate-600"
            : "bg-white text-slate-600 hover:bg-slate-100 shadow-sm"
        }`}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Main Card */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ${cardClasses}`}
      >
        <div className="p-8 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${textMain}`}>
            {isForgotPassword
              ? "Reset Password"
              : isSignUp
                ? "Create Account"
                : "Welcome Back"}
          </h1>
          <p className={`text-sm ${textMuted}`}>
            {isForgotPassword
              ? "Enter your email to receive a recovery link"
              : isSignUp
                ? "Start mastering algorithms today"
                : "Continue your programming journey"}
          </p>
        </div>

        <div className="p-8 pt-0">
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
                message.type === "error"
                  ? darkMode
                    ? "bg-red-900/30 text-red-200 border border-red-800"
                    : "bg-red-50 text-red-600 border border-red-100"
                  : darkMode
                    ? "bg-emerald-900/30 text-emerald-200 border border-emerald-800"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle className="h-5 w-5 shrink-0" />
              ) : (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {isForgotPassword ? (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  className={`text-sm font-medium ml-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400`}
                  />
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setMessage(null);
                  }}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleAuth} className="space-y-5">
                <div className="space-y-1.5">
                  <label
                    className={`text-sm font-medium ml-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                  >
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? "text-slate-400 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-500"}`}
                    />
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
                  <div className="flex justify-between items-center px-1">
                    <label
                      className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                    >
                      Password
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setMessage(null);
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? "text-slate-400 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-500"}`}
                    />
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
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
                      <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-center space-x-2">
                <div
                  className={`flex-1 h-px ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                ></div>
                <span
                  className={`text-xs uppercase font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                >
                  Or continue with
                </span>
                <div
                  className={`flex-1 h-px ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                ></div>
              </div>

              <div className="mt-5 flex justify-center w-full">
                <GoogleLogin
                  text={isSignUp ? "signup_with" : "signin_with"}
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    setMessage({
                      type: "error",
                      text: "Google Authentication Failed",
                    });
                  }}
                  useOneTap
                />
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-slate-200 dark:border-slate-700 text-center">
                <p className={`text-sm ${textMuted}`}>
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account yet?"}
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
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;