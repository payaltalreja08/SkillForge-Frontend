import React, { useState } from 'react';
import { X, Award, Eye, EyeOff } from 'lucide-react';

// AuthModal Component
const AuthModal = ({ 
  showAuthModal, 
  setShowAuthModal, 
  authMode, 
  setAuthMode, 
  authForm, 
  setAuthForm, 
  authErrors, 
  setAuthErrors, 
  showPassword, 
  setShowPassword, 
  handleAuthSubmit,
  handleInputChange 
}) => {
  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-indigo-600 mr-2" />
            <span className="font-bold text-xl text-gray-900">SkillForge</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {authMode === 'login' ? 'Welcome Back!' : 'Join SkillForge'}
          </h2>
          <p className="text-gray-600">
            {authMode === 'login' 
              ? 'Sign in to continue your learning journey' 
              : 'Start your learning journey today'
            }
          </p>
        </div>

        <div className="space-y-6">
          {authMode === 'register' && (
            <div key="fullName-field">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={authForm.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  authErrors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              {authErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">{authErrors.fullName}</p>
              )}
            </div>
          )}

          <div key="email-field">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                authErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {authErrors.email && (
              <p className="text-red-500 text-sm mt-1">{authErrors.email}</p>
            )}
          </div>

          <div key="password-field">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={authForm.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12 ${
                  authErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {authErrors.password && (
              <p className="text-red-500 text-sm mt-1">{authErrors.password}</p>
            )}
          </div>

          {authMode === 'register' && (
            <div key="confirmPassword-field">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={authForm.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  authErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              {authErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{authErrors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleAuthSubmit}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setAuthErrors({});
                setAuthForm({ email: '', password: '', confirmPassword: '', fullName: '' });
              }}
              className="text-indigo-600 font-semibold hover:text-indigo-800"
            >
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;