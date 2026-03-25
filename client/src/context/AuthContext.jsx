import { createContext, useContext, useState } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      
      if (data.pending2FA) {
        return { pending2FA: true, email: data.email };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      const { data: updatedUser } = await api.put('/api/auth/profile', data);
      localStorage.setItem('user', JSON.stringify(updatedUser)); 
      setUser(prev => ({ ...prev, ...updatedUser }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  };

  const login2FA = async (email, token) => {
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/2fa/login', { email, token });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Verification failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, login2FA, register, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
