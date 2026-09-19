import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Contacts from './components/Contacts';
import Skills from './components/Skills';
import About from './components/About';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Configure axios base URL from env with fallback
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiError, setApiError] = useState('');
  const [adminProfile, setAdminProfile] = useState(null);

  const normalizeAdmin = useCallback((data) => {
    if (!data) return null;

    const baseUrl = axios.defaults.baseURL?.replace(/\/api$/i, '') || '';
    const resolvedAvatar = data.avatarUrl
      ? (data.avatarUrl.startsWith('http') ? data.avatarUrl : `${baseUrl}${data.avatarUrl}`)
      : '';

    return {
      _id: data._id,
      username: data.username,
      fullName: data.fullName || data.username || '',
      email: data.email,
      avatarUrl: resolvedAvatar,
      phone: data.phone || '',
      location: data.location || '',
      website: data.website || '',
      bio: data.bio || ''
    };
  }, []);

  const loadAdminProfile = useCallback(async () => {
    try {
      const response = await axios.get('/auth/me');
      setAdminProfile(normalizeAdmin(response.data));
    } catch (error) {
      console.error('Failed to load admin profile:', error);
    }
  }, [normalizeAdmin]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      loadAdminProfile();
    }
    // Check backend health
    axios.get('/health')
      .then(() => setApiError(''))
      .catch(() => setApiError('Cannot reach the server. Please start the backend or update VITE_API_URL.'))
      .finally(() => setLoading(false));
  }, [loadAdminProfile]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const handleLogin = (authPayload) => {
    const token = authPayload?.token;
    if (!token) {
      console.error('Login payload missing token');
      return;
    }

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setAdminProfile(normalizeAdmin(authPayload));
    setApiError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setAdminProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} apiError={apiError} />
      ) : (
          <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-200`}> 
            <Sidebar admin={adminProfile} onLogout={handleLogout} onClose={() => setSidebarOpen(false)} />
          </div>
          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <Header admin={adminProfile} onMenuClick={() => setSidebarOpen((s) => !s)} onLogout={handleLogout} />
            <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-950 min-h-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/about" element={<About />} />
                <Route path="/settings" element={<Settings admin={adminProfile} onAdminUpdated={(data) => setAdminProfile(normalizeAdmin(data))} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;

