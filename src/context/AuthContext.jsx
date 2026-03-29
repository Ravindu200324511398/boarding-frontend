import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('bf_token');
    const storedUser = localStorage.getItem('bf_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('bf_token', jwtToken);
    localStorage.setItem('bf_user', JSON.stringify(userData));
  };

  const updateUser = (userData, jwtToken) => {
    const merged = { ...user, ...userData };
    setUser(merged);
    localStorage.setItem('bf_user', JSON.stringify(merged));
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem('bf_token', jwtToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bf_token');
    localStorage.removeItem('bf_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
