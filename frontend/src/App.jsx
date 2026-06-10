import React, { useEffect, useState } from 'react';
import { api } from './api';
import Home from './pages/Home';
import Login from './pages/Login';
import Panel from './pages/Panel';

// Telegram WebApp API
const tg = window.Telegram?.WebApp;

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Telegram Mini App инициализациясы
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Telegram темасын колдонуу
      if (tg.colorScheme) {
        document.documentElement.setAttribute('data-theme', tg.colorScheme === 'dark' ? 'dark' : 'light');
      }
      
      // Telegram баскычтарын жашыруу
      if (tg.BackButton) {
        tg.BackButton.hide();
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (accessToken) => {
    localStorage.setItem('token', accessToken);
    setToken(accessToken);
    api.setToken(accessToken);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    api.setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      api.setToken(token);
      api.me().then((data) => setUser(data)).catch(() => handleLogout());
    }
  }, [token]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Жүктөлүүдө...</div>;
  }

  if (showLogin) {
    return <Login onLogin={handleLogin} />;
  }

  if (!token) {
    return <Home onShowLogin={() => setShowLogin(true)} />;
  }

  return <Panel user={user} onLogout={handleLogout} />;
}

export default App;