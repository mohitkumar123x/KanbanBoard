// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import api from '../api'; // Using centralized api
import logger from '../services/logger';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const source = api.CancelToken?.source() || { token: {}, cancel: () => {} };
      setLoading(true);

      api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
        cancelToken: source?.token,
      })
        .then((res) => {
          setUser(res.data);
          setError(null);
        })
        .catch((err) => {
          if (!api.isCancel?.(err)) {
            localStorage.removeItem('token');
            setError('Session expired or invalid token');
          }
        })
        .finally(() => setLoading(false));

      return () => source.cancel('Component unmounted');
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      logger.info("Calling login API:", `${api.defaults.baseURL}/auth/login`);
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};