import React, { useState, useEffect, useRef } from 'react';
import { Award, User, ChevronDown, Settings, BookOpen, BarChart3 } from 'lucide-react';

const Navbar = ({ 
  currentPage, 
  setCurrentPage, 
  isLoggedIn, 
  currentUser, 
  onLogout, 
  onShowAuth, 
  onSetAuthMode,
  onShowDashboard
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  
  const handleAuthClick = (mode) => {
    onSetAuthMode(mode);
    onShowAuth(true);
  };

  const isInstructor = currentUser?.role === 'instructor';

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Award className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SkillForge
              </span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('courses')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'courses' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Courses
              </button>
              {isLoggedIn && isInstructor && (
                <button 
                  onClick={() => setCurrentPage('course-management')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'course-management' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  My Courses
                </button>
              )}
              <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </button>
              <button className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{currentUser?.name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
                    </div>
                    
                    {isInstructor && (
                      <button
                        onClick={() => {
                          setCurrentPage('course-management');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        My Courses
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        onShowDashboard();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </button>
                    
                    <button
                      onClick={() => {
                        // TODO: Add profile/settings page
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={() => handleAuthClick('register')}
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Register
                </button>
                <button 
                  onClick={() => handleAuthClick('login')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              currentPage === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('courses')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              currentPage === 'courses' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'
            }`}
          >
            Courses
          </button>
          {isLoggedIn && isInstructor && (
            <button 
              onClick={() => setCurrentPage('course-management')}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                currentPage === 'course-management' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:text-indigo-600'
              }`}
            >
              My Courses
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;