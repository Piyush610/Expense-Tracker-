import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <App />
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: 'card',
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(12px)',
              }
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
