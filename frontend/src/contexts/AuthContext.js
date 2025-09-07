import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const source = axios.CancelToken.source(); // For cleanup
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cancelToken: source.token,
        })
        .then((res) => {
          setUser(res.data);
          setError(null);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            localStorage.removeItem('token');
            setError('Session expired or invalid token');
          }
        })
        .finally(() => setLoading(false));
      return () => source.cancel('Component unmounted'); // Cleanup
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array for mount only

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      throw err; // Allow calling component to handle
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  // Provide the context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};