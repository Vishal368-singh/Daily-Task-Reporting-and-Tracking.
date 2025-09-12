import { useState, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  // Store both token and user object
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // loginUser now accepts both the token and user data from your API
  const loginUser = useCallback((userData, authToken) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  }, []);

  // logoutUser clears everything
  const logoutUser = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // useMemo prevents unnecessary re-renders of context consumers
  const contextValue = useMemo(
    () => ({
      token,
      user,
      loginUser,
      logoutUser,
      isAuthenticated: !!token, // Derived state to easily check if logged in
    }),
    [token, user, loginUser, logoutUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
