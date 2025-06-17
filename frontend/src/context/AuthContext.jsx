import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginUser as apiLogin } from '../services/api'; // Import fungsi login dari api.js

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('mieAyamToken'));
    const [loading, setLoading] = useState(true); // Untuk initial auth check

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) { // Cek apakah token belum expired
                    setUser({ id: decoded.id, username: decoded.username });
                } else {
                    localStorage.removeItem('mieAyamToken');
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('mieAyamToken');
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await apiLogin({ username, password });
            const { token: newToken, user: userData } = response.data;
            localStorage.setItem('mieAyamToken', newToken);
            setToken(newToken);
            setUser(userData);
            return true;
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            throw error.response ? error.response.data : new Error('Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('mieAyamToken');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);