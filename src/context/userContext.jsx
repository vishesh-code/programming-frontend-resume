import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import the decoder

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      let email = localStorage.getItem("user-email");
      let id = localStorage.getItem("user-id");

      if (token && email && id) {
        try {
          // 1. Decode the token
          const decoded = jwtDecode(token);

          // 2. Check if token is expired
          // decoded.exp is in seconds, Date.now() is in milliseconds
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token is expired - clear storage
            console.warn("Token expired during initialization");
            localStorage.removeItem("auth-token");
            localStorage.removeItem("user-email");
            localStorage.removeItem("user-id");
            setUser(null);
          } else {
            // Token is valid - restore session
            setUser({
              token: token,
              email: email,
              id: id,
            });
          }
        } catch (error) {
          // If token is malformed, clear everything
          console.error("Invalid token found", error);
          localStorage.removeItem("auth-token");
          localStorage.removeItem("user-email");
          localStorage.removeItem("user-id");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const logout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-email");
    localStorage.removeItem("user-id");
    setUser(null);
    // Optional: Window reload to clear any memory states
    // window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
