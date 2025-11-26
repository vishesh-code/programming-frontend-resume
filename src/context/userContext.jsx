import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents "flickering" on refresh

  useEffect(() => {
    // Check LocalStorage on application load
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      let email = localStorage.getItem("user-email");
      let id = localStorage.getItem("user-id");

      if (token && email && id) {
        // Restore user session from storage
        setUser({
          token: token,
          email: email,
          id: id
        });
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const logout = () => {
    // Clear storage and state
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-email");
    localStorage.removeItem("user-id");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);