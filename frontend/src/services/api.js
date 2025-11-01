import axios from 'axios';

// Runtime API URL from Docker injection
const getApiUrl = () => {
  if (window._env_ && window._env_.API_URL) {
    return window._env_.API_URL;
  }
  // Fallback: build-time or dev
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;