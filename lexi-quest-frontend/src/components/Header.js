import React, { useState } from "react";

function Header({ user, setPage, onLogout, currentPage, darkMode, toggleDarkMode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { key: 'home', label: 'Home', icon: '🏠' },
        ...(user ? [
            { key: 'favorites', label: 'Favorites', icon: '❤️' },
            { key: 'profile', label: 'Profile', icon: '👤' }
        ] : [])
    ];

    const handleNavClick = (page) => {
        setPage(page);
        setIsMenuOpen(false);
    };

    return (
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b sticky top-0 z-50 transition-colors duration-200`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div 
                        className="flex items-center cursor-pointer group"
                        onClick={() => handleNavClick('home')}
                    >
                        <div className="text-2xl mr-2">📚</div>
                        <h1 className={`text-2xl font-bold ${darkMode ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-indigo-600 group-hover:text-indigo-700'} transition-colors`}>
                            LexiQuest
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navItems.map(item => (
                            <button
                                key={item.key}
                                onClick={() => handleNavClick(item.key)}
                                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    currentPage === item.key
                                        ? darkMode 
                                            ? 'bg-indigo-900 text-indigo-300'
                                            : 'bg-indigo-100 text-indigo-700'
                                        : darkMode
                                            ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700'
                                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                        
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-md transition-colors ${
                                darkMode 
                                    ? 'text-yellow-400 hover:bg-gray-700' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? (
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                        
                        {user ? (
                            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-600">
                                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Welcome, <span className="font-medium">{user.firstName || user.email}</span>!
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200 dark:border-gray-600">
                                <button
                                    onClick={() => handleNavClick('login')}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        darkMode 
                                            ? 'text-gray-300 hover:text-indigo-400' 
                                            : 'text-gray-600 hover:text-indigo-600'
                                    }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => handleNavClick('register')}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-md transition-colors ${
                            darkMode 
                                ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' 
                                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                        }`}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className={`md:hidden py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="space-y-2">
                            {navItems.map(item => (
                                <button
                                    key={item.key}
                                    onClick={() => handleNavClick(item.key)}
                                    className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        currentPage === item.key
                                            ? darkMode 
                                                ? 'bg-indigo-900 text-indigo-300'
                                                : 'bg-indigo-100 text-indigo-700'
                                            : darkMode
                                                ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700'
                                                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                            
                            {/* Mobile Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    darkMode 
                                        ? 'text-yellow-400 hover:bg-gray-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <span>{darkMode ? '☀️' : '🌙'}</span>
                                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>
                            
                            {user ? (
                                <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-4`}>
                                    <div className={`px-3 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Welcome, <span className="font-medium">{user.firstName || user.email}</span>!
                                    </div>
                                    <button
                                        onClick={onLogout}
                                        className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className={`pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-4 space-y-2`}>
                                    <button
                                        onClick={() => handleNavClick('login')}
                                        className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            darkMode 
                                                ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700' 
                                                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => handleNavClick('register')}
                                        className="w-full text-left px-3 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;