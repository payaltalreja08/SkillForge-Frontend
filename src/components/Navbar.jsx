import React from 'react';
import { Award, User } from 'lucide-react';

const Navbar = ({ 
  currentPage, 
  setCurrentPage, 
  isLoggedIn, 
  currentUser, 
  onLogout, 
  onShowAuth, 
  onSetAuthMode 
}) => {
  
  const handleAuthClick = (mode) => {
    onSetAuthMode(mode);
    onShowAuth(true);
  };

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
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-700">
                  <User className="h-5 w-5 mr-2" />
                  <span className="font-medium">Welcome, {currentUser?.name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Logout
                </button>
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
    </nav>
  );
};

export default Navbar;