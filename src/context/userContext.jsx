// import React, { createContext, useState, useContext, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkLoggedIn = async () => {
//       let token = localStorage.getItem("auth-token");
//       let email = localStorage.getItem("user-email");
//       let id = localStorage.getItem("user-id");

//       if (token && email && id) {
//         try {
//           const decoded = jwtDecode(token);
//           const currentTime = Date.now() / 1000;

//           if (decoded.exp < currentTime) {
//             console.warn("Token expired during initialization");
//             localStorage.removeItem("auth-token");
//             localStorage.removeItem("user-email");
//             localStorage.removeItem("user-id");
//             setUser(null);
//           } else {
//             setUser({
//               token: token,
//               email: email,
//               id: id,
//             });
//           }
//         } catch (error) {
//           console.error("Invalid token found", error);
//           localStorage.removeItem("auth-token");
//           localStorage.removeItem("user-email");
//           localStorage.removeItem("user-id");
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };

//     checkLoggedIn();
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("auth-token");
//     localStorage.removeItem("user-email");
//     localStorage.removeItem("user-id");
//     setUser(null);
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, logout, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);





import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      let email = localStorage.getItem("user-email");
      let id = localStorage.getItem("user-id");
      let role = localStorage.getItem("user-role"); // 🔥 1. Fetch the role from local storage

      if (token && email && id) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            console.warn("Token expired during initialization");
            localStorage.removeItem("auth-token");
            localStorage.removeItem("user-email");
            localStorage.removeItem("user-id");
            localStorage.removeItem("user-role"); // 🔥 Clear role on expire
            setUser(null);
          } else {
            // 🔥 2. Set the user state WITH the role included
            setUser({
              token: token,
              email: email,
              id: id,
              role: role || 'user', // Default to 'user' if none exists
            });
          }
        } catch (error) {
          console.error("Invalid token found", error);
          localStorage.removeItem("auth-token");
          localStorage.removeItem("user-email");
          localStorage.removeItem("user-id");
          localStorage.removeItem("user-role"); // 🔥 Clear role on error
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
    localStorage.removeItem("user-role"); // 🔥 3. Clear role on logout
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);