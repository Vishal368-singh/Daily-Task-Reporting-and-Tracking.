import { useState, useMemo, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Load token and user from sessionStorage (not sessionStorage)
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login function
  const loginUser = useCallback((userData, authToken) => {
    setToken(authToken);
    setUser(userData);

    sessionStorage.setItem("token", authToken);
    sessionStorage.setItem("user", JSON.stringify(userData));
  }, []);

  // Logout function
  const logoutUser = useCallback(() => {
    setToken(null);
    setUser(null);

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login");
  }, [navigate]);

  // Redirect to login if no token found (for page reloads)
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Context value
  const contextValue = useMemo(
    () => ({
      token,
      user,
      loginUser,
      logoutUser,
      isAuthenticated: !!token,
    }),
    [token, user, loginUser, logoutUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
