import axios from 'axios';

const api = axios.create({
  // In production (Render), VITE_API_URL is not set so we use relative URLs
  // since frontend and backend are served from the same server.
  // In development, VITE_API_URL=http://localhost:5000 is used.
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only redirect if it's a 401 and NOT from login/register endpoints
    if (
      err.response?.status === 401 && 
      !err.config.url.includes('/login') && 
      !err.config.url.includes('/register')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
