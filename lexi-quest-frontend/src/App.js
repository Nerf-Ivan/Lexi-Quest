import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Enhanced utility to decode the JWT token and get user info
const decodeToken = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      localStorage.removeItem('token');
      return null;
    }
    
    return payload.user;
  } catch (error) {
    console.error('Token decode error:', error);
    localStorage.removeItem('token');
    return null;
  }
};

function App() {
  // State management
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [likedWords, setLikedWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference or default to false
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Enhanced logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setLikedWords([]);
    setPage('home');
    setError('');
  }, []);

  // Enhanced function to fetch user's liked words
  const fetchLikedWords = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/words/liked`, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        if (response.status === 503) {
          // Database not available, skip loading liked words
          console.log('Database not available, running in demo mode');
          return;
        }
        throw new Error('Failed to fetch liked words');
      }
      
      const data = await response.json();
      setLikedWords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch liked words error:', error);
      // Don't show error for demo mode
      if (!error.message.includes('Database not available')) {
        setError('Failed to load your favorite words');
      }
    }
  }, [handleLogout]);

  // Enhanced function to fetch current user info
  const fetchUserInfo = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { 
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        if (response.status === 503) {
          // Database not available, create a demo user from token
          const decodedUser = decodeToken(token);
          if (decodedUser) {
            setUser({
              id: decodedUser.id,
              email: decodedUser.email || 'demo@example.com',
              firstName: decodedUser.firstName || 'Demo',
              lastName: decodedUser.lastName || 'User'
            });
          }
          return;
        }
        throw new Error('Failed to fetch user info');
      }
      
      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Fetch user info error:', error);
      // Don't logout for demo mode
      if (!error.message.includes('Database not available')) {
        handleLogout();
      }
    }
  }, [handleLogout]);

  // Enhanced initialization effect
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          const decodedUser = decodeToken(token);
          if (decodedUser) {
            try {
              await fetchUserInfo(token);
              await fetchLikedWords(token);
            } catch (error) {
              console.error('App initialization error:', error);
              handleLogout();
            }
          } else {
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Critical app initialization error:', error);
        setError('Failed to initialize application');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [fetchUserInfo, fetchLikedWords, handleLogout]);

  // Enhanced login success handler
  const handleLoginSuccess = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    fetchLikedWords(token);
    setPage('home');
    setError('');
  };



  // Function to update liked words
  const updateLikedWords = (newLikedWords) => {
    setLikedWords(newLikedWords);
  };

  // Dark mode toggle function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Enhanced page rendering with loading states
  const renderPage = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    switch (page) {
      case 'home':
        return (
          <HomePage 
            user={user} 
            likedWords={likedWords} 
            updateLikedWords={updateLikedWords}
          />
        );
      case 'login':
        return (
          <LoginPage 
            setPage={setPage} 
            onLoginSuccess={handleLoginSuccess} 
          />
        );
      case 'register':
        return (
          <RegisterPage 
            setPage={setPage} 
            onLoginSuccess={handleLoginSuccess} 
          />
        );
      case 'profile':
        return (
          <ProfilePage 
            user={user} 
            setUser={setUser}
            setPage={setPage}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage 
            user={user}
            likedWords={likedWords}
            updateLikedWords={updateLikedWords}
            setPage={setPage}
          />
        );
      default:
        return (
          <HomePage 
            user={user} 
            likedWords={likedWords} 
            updateLikedWords={updateLikedWords}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className={`${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} min-h-screen flex flex-col transition-colors duration-200`}>
        <Header 
          user={user} 
          setPage={setPage} 
          onLogout={handleLogout}
          currentPage={page}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        {error && (
          <div className={`${darkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 mx-4 mt-4 rounded`}>
            {error}
            <button 
              onClick={() => setError('')}
              className={`float-right font-bold ${darkMode ? 'text-red-100 hover:text-red-300' : 'text-red-700 hover:text-red-900'}`}
            >
              ×
            </button>
          </div>
        )}
        
        <main className="flex-grow">
          {renderPage()}
        </main>
        
        <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} p-4 border-t transition-colors duration-200`}>
          <div className={`container mx-auto text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>&copy; {new Date().getFullYear()} LexiQuest. All rights reserved.</p>
            <p className="text-sm mt-1">
              Expand your vocabulary, one word at a time.
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;