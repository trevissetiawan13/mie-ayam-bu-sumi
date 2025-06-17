import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { loginUser as apiLogin } from "../services/api"; // Import fungsi login dari api.js

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("mieAyamToken"));
  const [loading, setLoading] = useState(true); // Untuk initial auth check

  useEffect(() => {
    const delay = setTimeout(() => {
      const storedToken = localStorage.getItem("mieAyamToken");
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          console.log("Decoded JWT:", decoded);
          if (decoded.exp * 1000 > Date.now()) {
            setUser({ id: decoded.id, username: decoded.username });
          } else {
            localStorage.removeItem("mieAyamToken");
            setUser(null);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("mieAyamToken");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }, 0); // Delay 0ms untuk biarkan render awal selesai

    return () => clearTimeout(delay);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await apiLogin({ username, password });
      const { token: newToken } = response.data;
      localStorage.setItem("mieAyamToken", newToken);
      console.log(
        "Token tersimpan di localStorage:",
        localStorage.getItem("mieAyamToken")
      );
      setToken(newToken);

      const decoded = jwtDecode(newToken);
      console.log("Decoded JWT setelah login:", decoded);
      setUser({ id: decoded.id, username: decoded.username }); // Tambahkan ini

      return true;
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      throw error.response ? error.response.data : new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("mieAyamToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
