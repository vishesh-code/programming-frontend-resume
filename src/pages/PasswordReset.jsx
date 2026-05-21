import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/themeContext";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import apiClient from "../utils/apiClient";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await apiClient.put(`/user/reset-password/${token}`, {
        password: password,
      });

      setMessage({
        type: "success",
        text: response.data.message || "Password reset successfully!",
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Failed to reset password. The link may have expired.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Theme styling assignments
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
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border shadow-xl overflow-hidden transition-all duration-300 ${cardClasses}`}
      >
        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform transition-all duration-300">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${textMain}`}>
            Set New Password
          </h1>
          <p className={`text-sm ${textMuted}`}>
            Please enter your new password below.
          </p>
        </div>

        {/* Form Container */}
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

          {/* Only show the form if the password hasn't been successfully reset yet */}
          {message?.type !== "success" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password Input */}
              <div className="space-y-1.5">
                <label
                  className={`text-sm font-medium ml-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  New Password
                </label>
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
                    minLength="6"
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

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label
                  className={`text-sm font-medium ml-1 ${darkMode ? "text-slate-300" : "text-slate-700"}`}
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${darkMode ? "text-slate-400 group-focus-within:text-blue-400" : "text-slate-400 group-focus-within:text-blue-500"}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength="6"
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${inputClasses}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
